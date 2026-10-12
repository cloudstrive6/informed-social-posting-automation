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
    spokenText: narration.spokenText, narrationWer: narration.wer, spokenScenes: spoken,
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
