/**
 * Channel trailers (YouTube Home tab): render a hand-written script from config/trailers/<name>.json through the
 * normal pipeline (Chirp narration + Whisper check, motion design, visual critic, subtitles), then put the MP4 on the
 * `trailers` release and send a preview to Telegram. Nothing is uploaded to YouTube: the owner sets the trailers in
 * YouTube Studio > Customization > Layout.
 */
import { basename, join } from "node:path";
import { ROOT } from "../lib/config.js";
import { ensureDir, readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import type { Script } from "../lib/schemas.js";
import type { ContentItem } from "../lib/items.js";
import { buildVideo } from "../media/buildVideo.js";
import { narrateChecked } from "./common.js";

const OUT = join(ROOT, "out");

export async function produceTrailer(name: string) {
  const script = readJson<Script & { vertical?: boolean; audience?: string }>(join(ROOT, "config", "trailers", `${name}.json`), undefined as any);
  if (!script?.scenes?.length) throw new Error(`config/trailers/${name}.json not found or empty`);
  log.step(`TRAILER ${name}: ${script.working_title}`);
  const dir = join(OUT, "trailers", name);
  const out = join(ensureDir(join(dir, "final")), `informed-trailer-${name}.mp4`);
  // the script is already written for the ear: narrate it word for word (no Narration Director rewrite)
  const spoken = script.scenes.map(s => ({ id: s.id, text: s.narration, speed: 1, pause_after_ms: 220 }));
  const narration = await narrateChecked(spoken, dir, undefined, script.vertical ? "short" : "long");
  log.info(`narration: ${narration.timeline.duration.toFixed(1)} s (${narration.provider})`);
  const { qa } = await buildVideo({
    id: `trailer-${name}`, dir, out, vertical: !!script.vertical, topic: script.working_title, fallbackQuery: script.target_keyword,
    scenes: script.scenes, sources: script.sources ?? [], timeline: narration.timeline, narrationWav: narration.wav,
    spokenText: narration.spokenText, narrationWer: narration.wer, spokenScenes: spoken, burnCaptions: true,
  });
  const summary = { name, file: basename(out), seconds: +narration.timeline.duration.toFixed(1), voice: narration.provider, wer: narration.wer, visualScore: qa.visual.avgScore, blocking: qa.blocking };
  writeJson(join(dir, "summary.json"), summary);
  log.info(`TRAILER ${JSON.stringify(summary)}`);
  const { uploadToRelease, releaseAssetUrl } = await import("../publish/storage.js");
  if (process.env.GITHUB_REPOSITORY) {
    await uploadToRelease("trailers", [out]);
    const { sendPreview, notify } = await import("../notify/telegram.js");
    await sendPreview({ id: `trailer-${name}` } as ContentItem, { video: out }, `🎬 <b>Channel trailer: ${name}</b> (${summary.seconds} s)\n${script.audience ?? ""}`);
    await notify(`Download: ${releaseAssetUrl("trailers", basename(out))}${qa.blocking.length ? `\n⚠️ QA notes: ${qa.blocking.join("; ").slice(0, 500)}` : ""}`);
  }
}

const TRAILER_META: Record<string, { title: string; description: string }> = {
  visitors: {
    title: "InforMed: Health Headlines Shout. The Research Whispers.",
    description: "InforMed turns real medical studies into clear, animated explainers: science-backed health, explained like a friend would. A new deep dive every day plus quick Shorts, every script fact-checked against the published research, with sources named.\n\nNew here? Start with our best explainers: https://www.youtube.com/playlist?list=PLVku1MnNeY2w\n\nEducational content, not medical advice. Talk to a health professional about your own health.",
  },
  subscribers: {
    title: "Welcome Back to InforMed: Get More Out of Every Video",
    description: "Welcome back! How to get the most out of InforMed: chapters in every deep dive, the sources we name, topic playlists, Shorts for the key finding, and daily carousels on Instagram, TikTok, Facebook and Threads (@informedlab).\n\nEducational content, not medical advice.",
  },
};

/**
 * Upload the rendered trailers (from the `trailers` release) to YouTube as public videos, once each (ids kept in
 * data/trailers.json), and set the visitors one as the channel trailer for non-subscribers. The returning-subscriber
 * "featured video" slot can't be set through the API: the owner picks it in Studio.
 */
export async function publishTrailers() {
  const { DATA } = await import("../lib/config.js");
  const { downloadFromRelease } = await import("../publish/storage.js");
  const { uploadVideo, youtubeToken } = await import("../publish/youtube.js");
  const { httpJson } = await import("../lib/http.js");
  const { notify } = await import("../notify/telegram.js");
  const stateFile = join(DATA, "trailers.json");
  const state = readJson<Record<string, { id: string; uploaded_at: string; file: string }>>(stateFile, {});
  for (const name of Object.keys(TRAILER_META)) {
    const file = await downloadFromRelease("trailers", `informed-trailer-${name}.mp4`);
    if (state[name]?.id) { log.info(`trailer ${name} already on YouTube: ${state[name].id}`); continue; }
    const m = TRAILER_META[name];
    const id = await uploadVideo({ file, title: m.title, description: m.description, tags: ["InforMed", "health explained", "evidence-based health", "science explained"] });
    state[name] = { id, uploaded_at: new Date().toISOString(), file: basename(file) };
    writeJson(stateFile, state);
    log.info(`trailer ${name} uploaded: https://youtu.be/${id}`);
  }
  // custom thumbnails (config/trailers/<name>-thumb.jpg), set on every run
  const { setThumbnail } = await import("../publish/youtube.js");
  const { existsSync } = await import("node:fs");
  for (const name of Object.keys(TRAILER_META)) {
    const jpg = join(ROOT, "config", "trailers", `${name}-thumb.jpg`);
    if (state[name]?.id && existsSync(jpg)) { await setThumbnail(state[name].id, jpg); log.info(`thumbnail set for ${name} (${state[name].id})`); }
  }
  // channel trailer for non-subscribers: brandingSettings.channel.unsubscribedTrailer (read-modify-write, the
  // update replaces the whole brandingSettings object)
  const token = await youtubeToken();
  const ch = await httpJson<any>("https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&mine=true", { headers: { authorization: `Bearer ${token}` } });
  const channel = ch.items?.[0];
  if (!channel) throw new Error("no channel found for this YouTube login");
  // send back only writable fields, with their current values, so nothing else on the channel changes
  const cur = channel.brandingSettings ?? {};
  const keep = (o: any, keys: string[]) => Object.fromEntries(keys.filter(k => o?.[k] !== undefined).map(k => [k, o[k]]));
  const branding: any = { channel: { ...keep(cur.channel, ["description", "keywords", "defaultLanguage", "country", "trackingAnalyticsAccountId"]), unsubscribedTrailer: state.visitors.id } };
  if (cur.image?.bannerExternalUrl) branding.image = { bannerExternalUrl: cur.image.bannerExternalUrl };
  log.info(`branding before: ${JSON.stringify(cur).slice(0, 800)}`);
  await httpJson<any>("https://www.googleapis.com/youtube/v3/channels?part=brandingSettings", {
    method: "PUT", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ id: channel.id, brandingSettings: branding }),
  });
  log.info(`channel trailer set to ${state.visitors.id}`);
  await notify([
    "🎬 <b>Channel trailers are on YouTube</b>",
    `Visitors (set as channel trailer): https://youtu.be/${state.visitors.id}`,
    `Subscribers: https://youtu.be/${state.subscribers.id}`,
    "",
    "One step for you: YouTube Studio → Customization → Layout → Video spotlight → Featured video for returning subscribers → Add → pick \"Welcome Back to InforMed\" → Publish. (YouTube's API can't set that slot.)",
  ].join("\n"));
}
