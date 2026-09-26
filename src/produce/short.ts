import { join } from "node:path";
import { config } from "../lib/config.js";
import { ContentItem } from "../lib/items.js";
import { ensureDir, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { creditsThisRun } from "../lib/usage.js";
import { Script, scriptSchema } from "../lib/schemas.js";
import { buildVideo } from "../media/buildVideo.js";
import { checkPackaging, directNarration, narrateChecked, qaBlockers, loadPiece, newItem, socialCopy, workDir, writeWithFactCheck } from "./common.js";

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

  const social = await socialCopy(item, {
    hook: script.scenes[0].on_screen_text, narration: script.scenes.map(s => s.narration).join(" "),
    sources: factcheck.verified_sources, cta: script.cta,
  });
  item.package = { title: social.youtube_short_title, description: social.youtube_short_description, social, tags: [piece.target_keyword] };

  const pc = await checkPackaging(item, social, factcheck.verified_sources);
  if (pc.verdict !== "PASS" && item.status !== "held") { item.status = "held"; item.hold_reason = `Packaging check ${pc.verdict}: ${pc.summary}`; }
  return item;
}
