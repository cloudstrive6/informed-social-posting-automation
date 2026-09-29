import { join } from "node:path";
import { runAnalytics } from "./analytics/analyze.js";
import { config, OUT, ROOT } from "./lib/config.js";
import { ContentItem } from "./lib/items.js";
import { readJson, writeJson } from "./lib/fsx.js";
import { log } from "./lib/log.js";
import { localDate } from "./lib/time.js";
import { run } from "./media/exec.js";
import { planDay } from "./plan/planDay.js";
import { produceCarousel } from "./produce/carousel.js";
import { produceLong } from "./produce/long.js";
import { produceShort } from "./produce/short.js";
import { finalizeDay, publishDue, publishNow } from "./publish/publisher.js";
import { reportFailure, syncReviews } from "./review/issues.js";
import { notify, pollTelegram } from "./notify/telegram.js";
import { refreshThreadsToken } from "./publish/threads.js";
import { runRadar } from "./trends/radar.js";

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name: string) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : undefined; };
const date = flag("date") ?? localDate(config.audience.timezone);

async function produce(kind: string, pieceId: string) {
  const fn = { long: produceLong, short: produceShort, carousel: produceCarousel }[kind];
  if (!fn) throw new Error(`unknown kind ${kind}`);
  let item: ContentItem;
  try {
    item = await fn(date, pieceId);
  } catch (e) {
    await reportFailure(`Production failed: ${kind} ${pieceId} (${date})`, `\`\`\`\n${(e as Error).stack?.slice(0, 3000)}\n\`\`\``);
    throw e;
  }
  writeJson(join(OUT, date, item.id, "item.json"), item);
  log.info(`produced ${item.id} (${item.status}${item.hold_reason ? `: ${item.hold_reason}` : ""})`);
}

async function doctor() {
  const check = async (name: string, f: () => Promise<unknown>) => {
    try { await f(); console.log(`  ✓ ${name}`); } catch (e) { console.log(`  ✗ ${name} — ${(e as Error).message.split("\n")[0].slice(0, 160)}`); }
  };
  console.log("Tools");
  await check("ffmpeg", () => run("ffmpeg", ["-version"], { quiet: true }));
  await check("python + kokoro", () => run(process.env.PYTHON ?? "python", ["-c", "import kokoro, soundfile"], { quiet: true }));
  await check("gh CLI", () => run("gh", ["--version"], { quiet: true }));
  console.log("Secrets / environment");
  const groups: Record<string, string[]> = {
    "Claude (agents)": ["CLAUDE_CODE_OAUTH_TOKEN"],
    "ElevenLabs (voice, music, SFX)": ["ELEVENLABS_API_KEY"],
    "Backblaze B2 archive (optional)": ["B2_KEY_ID", "B2_APPLICATION_KEY"],
    "YouTube upload": ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"],
    "YouTube research (optional)": ["YOUTUBE_API_KEY"],
    "Instagram + Facebook": ["META_PAGE_ACCESS_TOKEN", "META_PAGE_ID", "META_IG_USER_ID"],
    "TikTok": ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"],
    "Reddit (optional)": ["REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET"],
  };
  for (const [g, keys] of Object.entries(groups)) {
    const missing = keys.filter(k => !process.env[k]);
    console.log(`  ${missing.length === 0 ? "✓" : missing.length < keys.length && g.includes("≥1") ? "✓" : "✗"} ${g}${missing.length ? ` — missing: ${missing.join(", ")}` : ""}`);
  }
}

const commands: Record<string, () => Promise<unknown>> = {
  radar: () => runRadar(),
  plan: () => planDay(date),
  produce: () => produce(rest[0], rest[1]),
  finalize: () => finalizeDay(date),
  publish: () => publishDue(),
  // publish-now <date>/<item-id> [--platforms youtube,tiktok,instagram,facebook]
  // youtube-fix-description <date>/<item-id>: strip stray social captions from a long video's description (stored + live)
  "youtube-fix-description": async () => {
    const { itemPath, saveItem } = await import("./lib/items.js");
    const { cleanDescription, updateDescription } = await import("./publish/youtube.js");
    const [d, id] = rest[0].split("/");
    const item = readJson<ContentItem>(itemPath(d, id));
    const before = item.package.description ?? "";
    item.package.description = cleanDescription(before);
    saveItem(item);
    const yt = item.posts.find(p => p.platform === "youtube" && p.remote_id);
    if (yt?.remote_id) await updateDescription(yt.remote_id, item.package.description);
    log.info(`description cleaned (${before.length} → ${item.package.description.length} chars)${yt?.remote_id ? `, updated on YouTube ${yt.remote_id}` : ""}`);
  },
  // youtube-replace <date>/<item-id>: the item's video in the release was remade; delete the old YouTube upload and
  // publish the new one now (same title, cleaned description, thumbnail, playlists)
  "youtube-replace": async () => {
    const { itemPath, saveItem } = await import("./lib/items.js");
    const { cleanDescription, deleteVideo } = await import("./publish/youtube.js");
    const [d, id] = rest[0].split("/");
    const item = readJson<ContentItem>(itemPath(d, id));
    const yt = item.posts.find(p => p.platform === "youtube");
    if (!yt) throw new Error("item has no YouTube post");
    if (yt.remote_id) { await deleteVideo(yt.remote_id); log.info(`deleted old YouTube video ${yt.remote_id}`); }
    item.package.description = cleanDescription(item.package.description ?? "");
    Object.assign(yt, { status: "pending", attempts: 0, remote_id: undefined, url: undefined, published_at: undefined, slot: new Date().toISOString() });
    saveItem(item);
    await publishNow(rest[0], ["youtube"]);
  },
  // youtube-playlists <date>/<item-id>: add the item's uploaded YouTube video to its playlists (pillar + Shorts)
  "youtube-playlists": async () => {
    const { itemPath, saveItem } = await import("./lib/items.js");
    const { addToPlaylists } = await import("./publish/playlists.js");
    const [d, id] = rest[0].split("/");
    const item = readJson<ContentItem>(itemPath(d, id));
    const yt = item.posts.find(p => p.platform === "youtube" && p.remote_id);
    if (!yt?.remote_id) throw new Error("no uploaded YouTube video for this item");
    if (!(await addToPlaylists(item, yt.remote_id)).length) throw new Error("not added to any playlist");
    saveItem(item); // keeps the pillar the curator chose
  },
  // youtube-unschedule <date>/<item-id>: keep a scheduled video from going public (it stays private)
  "youtube-unschedule": async () => {
    const { itemPath } = await import("./lib/items.js");
    const { makePrivate } = await import("./publish/youtube.js");
    const [d, id] = rest[0].split("/");
    const yt = readJson<ContentItem>(itemPath(d, id)).posts.find(p => p.platform === "youtube" && p.remote_id);
    if (!yt?.remote_id) throw new Error("no uploaded YouTube video for this item");
    await makePrivate(yt.remote_id);
    log.info(`YouTube ${yt.remote_id} is now private (unscheduled)`);
  },
  "publish-now": () => publishNow(rest[0], (flag("platforms") ?? "").split(",").filter(Boolean)),
  "review-sync": () => syncReviews(),
  // Telegram button presses → review labels → queued items
  // listen for up to N seconds (default 270), applying each decision as soon as it's tapped
  "telegram-poll": () => pollTelegram(Number(rest[0] ?? 270), () => syncReviews()),
  analytics: () => runAnalytics(),
  // keep the 60-day Threads token alive (stored in B2); alert if renewal fails
  "threads-refresh": async () => { if (!(await refreshThreadsToken())) await notify("⚠️ Threads token renewal failed. Posting to Threads will stop when the token expires; generate a new one in the Meta app (Threads API → Settings → User Token Generator)."); },
  doctor,
};

const fn = commands[cmd];
if (!fn) {
  console.log(`Usage: tsx src/cli.ts <${Object.keys(commands).join("|")}> [args] [--date YYYY-MM-DD]`);
  process.exit(1);
}
fn().then(() => process.exit(0)).catch(e => { log.error(e?.stack ?? e); process.exit(1); });
