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
import { finalizeDay, publishDue } from "./publish/publisher.js";
import { reportFailure, syncReviews } from "./review/issues.js";
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
    "Stock footage (need ≥1)": ["PEXELS_API_KEY", "PIXABAY_API_KEY"],
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
  "review-sync": () => syncReviews(),
  analytics: () => runAnalytics(),
  doctor,
  "demo-short": async () => {
    // Offline smoke test of the media pipeline with a fixture script (no agents, no publishing).
    const { narrate } = await import("./media/tts.js");
    const { buildBroll } = await import("./media/broll.js");
    const { composeShort } = await import("./media/compose.js");
    const { renderComposition, muxAudio } = await import("./media/render.js");
    const script = readJson<any>(join(ROOT, "scripts", "fixtures", "short.json"));
    const dir = join(OUT, "demo");
    const { wav, timeline } = await narrate(script.scenes.map((s: any) => ({ id: s.id, text: s.narration, speed: 1, pause_after_ms: 200 })), dir);
    const segs = script.scenes.map((s: any, i: number) => ({ start: i ? timeline.scenes[i].start : 0, end: timeline.scenes[i + 1]?.start ?? timeline.duration, query: s.visual.stock_query, dim: s.visual.kind !== "broll" }));
    const bg = await buildBroll(segs, "portrait", join(dir, "broll"), 3.5, "healthy food");
    const hf = await composeShort(join(dir, "hf"), bg, script.scenes, script.sources, timeline);
    const silent = await renderComposition(hf, join(dir, "silent.mp4"));
    log.info(`demo video: ${await muxAudio(silent, wav, join(dir, "demo-short.mp4"), "demo")}`);
  },
};

const fn = commands[cmd];
if (!fn) {
  console.log(`Usage: tsx src/cli.ts <${Object.keys(commands).join("|")}> [args] [--date YYYY-MM-DD]`);
  process.exit(1);
}
fn().then(() => process.exit(0)).catch(e => { log.error(e?.stack ?? e); process.exit(1); });
