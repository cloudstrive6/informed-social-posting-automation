import { appendFileSync, readdirSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { config, DATA, OUT } from "../lib/config.js";
import { ContentItem, loadItems, PostTarget, saveItem } from "../lib/items.js";
import { ensureDir, readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { addElevenUsage } from "../lib/usage.js";
import { addDays, localDate } from "../lib/time.js";
import { coveredPath, CoveredTopic } from "../plan/planDay.js";
import { openReviewIssue, reportFailure } from "../review/issues.js";
import { facebookAlbumPost, facebookReel, instagramCarousel, instagramReel } from "./meta.js";
import { downloadFromRelease, publishImages, releaseAssetUrl, uploadToRelease } from "./storage.js";
import { archiveItem } from "./b2.js";
import { recordQuality, updateCraftNotes } from "../analytics/quality.js";
import { notify, notifyDecision, notifyReview } from "../notify/telegram.js";
import { applyDecision, editorDecision } from "../review/autoReview.js";
import { tiktokPost } from "./tiktok.js";
import { postForMeEnabled, tiktokViaPostForMe } from "./postforme.js";
import { setThumbnail, uploadVideo } from "./youtube.js";

const LOG = join(DATA, "published", "log.jsonl");
const MAX_ATTEMPTS = 3;

function logPost(item: ContentItem, p: PostTarget) {
  ensureDir(join(DATA, "published"));
  appendFileSync(LOG, JSON.stringify({
    at: new Date().toISOString(), date: item.date, id: item.id, kind: item.kind, platform: p.platform, format: p.format,
    slot: p.slot, slotKey: p.slotKey, status: p.status, remote_id: p.remote_id, url: p.url, error: p.error,
    title: item.package.title, topic: item.plan.topic, hook: item.script?.hook_pattern, thumb_layout: item.package.thumbnail?.layout, trend_stage: item.plan.trend_stage,
  }) + "\n");
}

async function media(item: ContentItem, name: string) {
  const local = join(OUT, item.date, item.id, "final", name);
  if (existsSync(local)) return local;
  return downloadFromRelease(item.release_tag!, name);
}

/** Publish (or schedule) a single post. YouTube uses native scheduling (publishAt); others post at slot time. */
async function publishOne(item: ContentItem, p: PostTarget) {
  const s = item.package.social;
  const disclaimer = config.safety.disclaimer;
  switch (`${p.platform}:${p.format}`) {
    case "youtube:long": {
      const id = await uploadVideo({ file: await media(item, item.media.video!), title: item.package.title!, description: item.package.description!, tags: item.package.tags ?? [], publishAt: p.slot });
      if (item.media.thumbnail) await setThumbnail(id, await media(item, item.media.thumbnail)).catch(e => log.warn(`thumbnail: ${e.message}`));
      return { id, url: `https://youtu.be/${id}`, scheduled: Date.parse(p.slot) > Date.now() + 5 * 60_000 };
    }
    case "youtube:short": {
      const id = await uploadVideo({ file: await media(item, item.media.video!), title: s!.youtube_short_title, description: s!.youtube_short_description, tags: item.package.tags ?? [], publishAt: p.slot });
      return { id, url: `https://youtube.com/shorts/${id}`, scheduled: Date.parse(p.slot) > Date.now() + 5 * 60_000 };
    }
    case "instagram:reel": {
      const url = item.release_tag && process.env.GITHUB_REPOSITORY ? releaseAssetUrl(item.release_tag, basename(item.media.video!)) : undefined;
      return { ...(await instagramReel(await media(item, item.media.video!), s!.instagram_caption, url)), scheduled: false };
    }
    case "instagram:carousel": return { ...(await instagramCarousel(item.image_urls!, s!.instagram_caption)), scheduled: false };
    case "tiktok:short": {
      const file = await media(item, item.media.video!);
      return { ...(postForMeEnabled() ? await tiktokViaPostForMe(file, s!.tiktok_caption) : await tiktokPost(file, s!.tiktok_caption)), scheduled: false };
    }
    case "facebook:reel": return { ...(await facebookReel(await media(item, item.media.video!), s!.facebook_caption)), scheduled: false };
    case "facebook:post": {
      const imgs = await Promise.all(item.media.slides!.map(f => media(item, f)));
      return { ...(await facebookAlbumPost(imgs, s!.facebook_caption || `${item.package.title}\n\n${disclaimer}`)), scheduled: false };
    }
  }
  throw new Error(`no publisher for ${p.platform}:${p.format}`);
}

async function attempt(item: ContentItem, p: PostTarget) {
  p.attempts++;
  try {
    const r = await publishOne(item, p);
    p.status = r.scheduled ? "scheduled" : "published";
    p.remote_id = r.id; p.url = r.url ?? undefined; p.error = undefined;
    p.published_at = r.scheduled ? p.slot : new Date().toISOString();
    log.info(`✓ ${item.id} → ${p.platform}/${p.format} ${p.status} ${p.url ?? ""}`);
    await notify(`${p.status === "scheduled" ? "🗓️ Scheduled" : "✅ Posted"} · <b>${p.platform} ${p.format}</b>\n${(item.package.title ?? item.plan.working_title).replace(/[<>&]/g, "")}${p.url ? `\n${p.url}` : ""}${p.status === "scheduled" ? `\nGoes live ${new Date(p.slot).toLocaleString("en-US", { timeZone: config.audience.timezone, dateStyle: "medium", timeStyle: "short" })}` : ""}`, { silent: true });
  } catch (e) {
    p.error = (e as Error).message.slice(0, 800);
    log.error(`✗ ${item.id} → ${p.platform}/${p.format}: ${p.error}`);
    if (p.attempts >= MAX_ATTEMPTS) {
      p.status = "failed";
      await reportFailure(`Publish failed: ${p.platform} ${p.format} — ${item.package.title ?? item.id}`, `Item \`${item.date}/${item.id}\`\n\n\`\`\`\n${p.error}\n\`\`\``);
    }
  }
  logPost(item, p);
  saveItem(item);
}

/** Called after all production jobs: move media to storage, open reviews, pre-schedule YouTube. */
export async function finalizeDay(date: string) {
  const dayOut = join(OUT, date);
  const ids = existsSync(dayOut) ? readdirSync(dayOut).filter(d => existsSync(join(dayOut, d, "item.json"))) : [];
  if (!ids.length) { log.warn(`no produced items found in ${dayOut}`); return; }
  const tag = `content-${date}`;
  const covered = readJson<CoveredTopic[]>(coveredPath, []);

  for (const id of ids) {
    const item = readJson<ContentItem>(join(dayOut, id, "item.json"));
    const finalDir = join(dayOut, id, "final");
    const files = readdirSync(finalDir).map(f => join(finalDir, f));
    await uploadToRelease(tag, files);
    item.release_tag = tag;
    item.archive_url = await archiveItem(date, id, join(dayOut, id));
    if (item.media.video) item.media.video = basename(item.media.video);
    if (item.media.thumbnail) item.media.thumbnail = basename(item.media.thumbnail);
    if (item.media.slides) {
      item.image_urls = await publishImages(item.media.slides, `${date}/${item.id}`);
      item.media.slides = item.media.slides.map(f => basename(f));
    }
    // Test runs: everything waits for a human, nothing is scheduled.
    if (process.env.TEST_RUN === "1") {
      item.status = "held";
      item.hold_reason = [item.hold_reason, "test run: review before publishing"].filter(Boolean).join("; ");
    }
    // A slot that already passed (e.g. a late re-run) goes out ASAP instead of being skipped.
    for (const p of item.posts) if (Date.parse(p.slot) < Date.now() + 10 * 60_000) p.slot = new Date(Date.now() + 10 * 60_000).toISOString();

    if (item.status === "held" && config.review.mode === "auto" && process.env.TEST_RUN !== "1") {
      // fully automated: the Editor-in-Chief makes the final call; the owner just gets an FYI (with a veto button)
      for (const p of item.posts) p.status = "held";
      const d = await editorDecision(item);
      applyDecision(item, d);
      await notifyDecision(item, d);
    } else if (item.status === "held") {
      for (const p of item.posts) p.status = "held";
      item.review_issue = await openReviewIssue(item);
      if (item.review_issue) {
        const local = (n?: string) => (n ? join(finalDir, basename(n)) : undefined);
        await notifyReview(item, item.review_issue,
          { video: local(item.media.video), slides: item.media.slides?.map(s => join(finalDir, basename(s))), thumbnail: local(item.media.thumbnail) },
          process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}/releases/tag/${tag}` : undefined);
      }
    }
    saveItem(item);
    recordQuality(item);
    covered.push({ date, kind: item.kind, topic: item.plan.topic, angle: item.plan.angle, title: item.package.title });
    // merge ElevenLabs spend from the parallel production jobs into the shared monthly counter
    const credits = Number(item.qa?.elevenCredits ?? 0);
    if (credits && process.env.GITHUB_ACTIONS) addElevenUsage(item.kind, credits, false);
  }
  writeJson(coveredPath, covered.slice(-400));
  // learn from today's QA findings so tomorrow's first drafts avoid them
  await updateCraftNotes();

  // daily summary for the owner
  const all = loadItems([date]);
  const line = (i: ContentItem) => `${i.status === "ready" ? "🟢" : i.status === "held" ? "🟡" : "🔴"} ${i.kind} · ${(i.package.title ?? i.plan.working_title).replace(/[<>&]/g, "").slice(0, 80)}`;
  await notify([
    `📦 <b>Daily production ${date}</b>`,
    `${all.filter(i => i.status === "ready").length} ready · ${all.filter(i => i.status === "held").length} held for review · ${all.filter(i => i.status === "failed").length} failed`,
    "", ...all.map(line),
    "", config.review.mode === "auto" ? `Posting follows the schedule (${config.audience.timezone}). 🟡 = dropped by the Editor-in-Chief.` : `Posting starts ${config.schedule.instagram_reel?.[0] ?? ""} (${config.audience.timezone}). Held items need your ✅ above.`,
  ].join("\n"));

  // YouTube supports native scheduling: upload now, it goes public exactly at the slot.
  for (const item of loadItems([date])) {
    if (item.status !== "ready") continue;
    for (const p of item.posts) if (p.platform === "youtube" && p.status === "pending") await attempt(item, p);
  }
}

/**
 * Manual override: publish one item right now on the given platforms, even if it's held for review
 * (a human asked for it). Used by the Publisher workflow's `item` input.
 */
export async function publishNow(ref: string, platforms: string[]) {
  const [date, id] = ref.split("/");
  const item = loadItems([date]).find(i => i.id === id || i.id.startsWith(`${id}-`));
  if (!item) throw new Error(`item ${ref} not found in data/queue/${date}`);
  const targets = item.posts.filter(p => !platforms.length || platforms.includes(p.platform));
  // one post per platform: the first slot for that platform
  const seen = new Set<string>();
  for (const p of targets) {
    if (seen.has(p.platform) || p.status === "published") continue;
    seen.add(p.platform);
    p.slot = new Date().toISOString(); p.attempts = 0;
    await attempt(item, p);
  }
  log.info(`publish-now ${item.id}: ${targets.filter(p => seen.has(p.platform)).map(p => `${p.platform} ${p.status}${p.url ? ` ${p.url}` : ""}`).join(" | ")}`);
}

/** Runs every ~15 min: publish every pending post whose slot has arrived. */
export async function publishDue() {
  const today = localDate(config.audience.timezone);
  // a few days back so late human approvals still get published
  const items = loadItems([-3, -2, -1, 0, 1].map(d => addDays(today, d)));
  const now = Date.now();
  let n = 0;
  for (const item of items) {
    if (item.status !== "ready") continue;
    for (const p of item.posts) {
      if (p.status !== "pending" || Date.parse(p.slot) > now + 3 * 60_000) continue;
      if (p.attempts >= MAX_ATTEMPTS) continue;
      await attempt(item, p);
      n++;
    }
  }
  log.info(`publisher: ${n} post(s) processed`);
}
