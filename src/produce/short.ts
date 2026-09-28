import { join } from "node:path";
import { config } from "../lib/config.js";
import { ContentItem } from "../lib/items.js";
import { ensureDir, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { creditsThisRun } from "../lib/usage.js";
import { Script, scriptSchema } from "../lib/schemas.js";
import { buildVideo } from "../media/buildVideo.js";
import { packagingLoop, directNarration, narrateChecked, qaBlockers, loadPiece, newItem, socialCopy, workDir, writeWithFactCheck } from "./common.js";

export async function produceShort(date: string, pieceId: string): Promise<ContentItem> {
  const { plan, piece, index } = loadPiece(date, pieceId);
  const item = newItem(date, piece, index);
  const dir = workDir(date, item.id);
  const final = ensureDir(join(dir, "final"));
  log.step(`SHORT ${item.id}: ${piece.working_title}`);

  const { content: script, factcheck, held, holdReason } = await writeWithFactCheck<Script>("scriptwriter-short", scriptSchema, {
    piece, target_seconds: config.cadence.shortTargetSeconds,
    todays_long_videos: plan.pieces.filter(p => p.kind === "long").map(p => ({ id: p.id, title: p.working_title })),
  });
  item.script = script; item.factcheck = factcheck;
  if (held) { item.status = "held"; item.hold_reason = holdReason; }
  writeJson(join(dir, "script.json"), script);

  const spoken = await directNarration(script.scenes);
  const narration = await narrateChecked(spoken, dir, config.voice.kokoroShortVoice, "short");
  const { wav, timeline } = narration;
  if (Object.keys(narration.learned).length) item.pronunciations = narration.learned;
  log.info(`narration: ${timeline.duration.toFixed(1)} s`);

  const built = await buildVideo({
    id: item.id, dir, out: join(final, `${item.id}.mp4`), vertical: true, topic: piece.topic, fallbackQuery: piece.target_keyword,
    scenes: script.scenes, sources: factcheck.verified_sources.length ? factcheck.verified_sources : script.sources, timeline, narrationWav: wav,
    spokenText: narration.spokenText, narrationWer: narration.wer, spokenScenes: spoken,
  });
  item.media.video = built.video;
  item.qa = { narrationWer: narration.wer, voice: narration.provider, elevenCredits: creditsThisRun(), ...built.qa };
  const blockers = qaBlockers(narration, built.qa);
  if (blockers.length && item.status !== "held") { item.status = "held"; item.hold_reason = `Quality check: ${blockers.join("; ")}`; }
  item.media.duration = timeline.duration;
  // Shorts/Reels/TikTok: we keep every vertical video under 90 s
  if (timeline.duration > 89.5 && item.status !== "held") { item.status = "held"; item.hold_reason = `Quality check: Short runs ${timeline.duration.toFixed(0)} s (limit 90 s)`; }

  const summary = {
    hook: script.scenes[0].on_screen_text, narration: script.scenes.map(s => s.narration).join(" "),
    sources: factcheck.verified_sources, cta: script.cta,
  };
  const pk = await packagingLoop(item, await socialCopy(item, summary), factcheck.verified_sources,
    { script: script.scenes.map(s => ({ narration: s.narration, on_screen_text: s.on_screen_text })) },
    (draft, fact_check) => socialCopy(item, summary, { draft, fact_check }));
  const social = pk.packaging;
  item.package = { title: social.youtube_short_title, description: social.youtube_short_description, social, tags: [piece.target_keyword] };
  item.qa = { ...item.qa, packaging: { verdict: pk.check.verdict, issues: pk.check.issues } };
  if (pk.held && item.status !== "held") { item.status = "held"; item.hold_reason = pk.reason; }
  return item;
}
