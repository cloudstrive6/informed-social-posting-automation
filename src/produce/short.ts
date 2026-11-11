import { join } from "node:path";
import { config } from "../lib/config.js";
import { ContentItem } from "../lib/items.js";
import { ensureDir, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { creditsThisRun } from "../lib/usage.js";
import { Script, scriptSchema } from "../lib/schemas.js";
import { buildVideo } from "../media/buildVideo.js";
import { packagingLoop, directNarration, narrateChecked, qaBlockers, loadPiece, newItem, socialCopy, workDir, writeWithFactCheck } from "./common.js";

export const SHORT_MAX_S = 178;

/** Growth experiment (owner OK 2026-11-12, readout 2026-11-26): tight 40-55 s Shorts against the usual 65-80 s.
 *  Arms alternate by Short slot and day so each slot and weekday gets both. After the end date every Short
 *  uses the standard arm until the Growth Strategist records a winner in data/growth-playbook.md. */
export const SHORT_LENGTH_TEST = { start: "2026-11-12", end: "2026-11-26" };
export const SHORT_ARMS = {
  tight: { words: [90, 120], seconds: [40, 55] },
  standard: { words: [135, 160], seconds: [65, 80] },
} as const;

/** Hook styles rotate by slot and day (owner OK 2026-11-12), so question openers are at most 1 in 5 and each
 *  style collects enough Shorts to compare (proof bar n>=8 per style). */
export const HOOK_ARCHETYPES = ["result-first", "negation", "number-first", "myth-flip", "recognition-question"] as const;

export function hookArchetype(date: string, index: number): (typeof HOOK_ARCHETYPES)[number] {
  const day = Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  return HOOK_ARCHETYPES[(day * 3 + index) % HOOK_ARCHETYPES.length];
}

export function shortLengthArm(date: string, index: number): keyof typeof SHORT_ARMS {
  if (date < SHORT_LENGTH_TEST.start || date > SHORT_LENGTH_TEST.end) return "standard";
  const day = Math.round(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  return (day + index) % 2 === 0 ? "tight" : "standard";
}

export async function produceShort(date: string, pieceId: string): Promise<ContentItem> {
  const { plan, piece, index } = loadPiece(date, pieceId);
  const item = newItem(date, piece, index);
  const dir = workDir(date, item.id);
  const final = ensureDir(join(dir, "final"));
  log.step(`SHORT ${item.id}: ${piece.working_title}`);

  const arm = shortLengthArm(date, index);
  const hook = hookArchetype(date, index);
  item.experiments = { ...item.experiments, "short-length": arm, "hook-archetype": hook };
  const { content: script, factcheck, held, holdReason } = await writeWithFactCheck<Script>("scriptwriter-short", scriptSchema, {
    piece, target_seconds: SHORT_ARMS[arm].seconds, target_words: SHORT_ARMS[arm].words, length_arm: arm,
    hook_archetype: hook, content_date: date,
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
  // YouTube counts vertical videos up to 3 min as Shorts; we hold a 178 s ceiling to be safe.
  // (Facebook's Reels API stops at 90 s: longer ones go to the Page as a regular video, see publisher.)
  if (timeline.duration > SHORT_MAX_S && item.status !== "held") { item.status = "held"; item.hold_reason = `Quality check: Short runs ${timeline.duration.toFixed(0)} s (limit ${SHORT_MAX_S} s)`; }

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
