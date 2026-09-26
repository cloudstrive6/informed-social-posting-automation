import { join } from "node:path";
import { config } from "../lib/config.js";
import { writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import type { Scene, Source } from "../lib/schemas.js";
import { checkMix, checkSubtitles, measureLevels } from "../qa/audioQa.js";
import { autoLevel, designSound, speechIntervals } from "../qa/soundDesign.js";
import { ffmpeg } from "./exec.js";
import { critiqueShots, keyTimes, layoutAudit, LayoutIssue, ShotReview, technicalFrameChecks } from "../qa/visualQa.js";
import { composeAnimated, TimedShot, timeShots } from "./animated.js";
import { planShots, reviseShots } from "./motionPlan.js";
import { mixStems, musicMood, musicStem, renderComposition, sfxStem } from "./render.js";
import type { Timeline } from "./tts.js";
import type { Shot } from "./vector/shots.js";

export interface BuildVideoInput {
  id: string; dir: string; out: string; vertical: boolean; topic: string; fallbackQuery: string;
  scenes: Scene[]; sources: Source[]; timeline: Timeline; narrationWav: string;
  /** what the narrator was asked to say (for the final intelligibility check) and its measured WER */
  spokenText: string; narrationWer: number;
  /** exactly what the narrator was asked to say, per scene (subtitles follow this, not the written script) */
  spokenScenes: { id: string; text: string }[];
  /** Reuse an already-reviewed shot plan (e.g. re-voicing a video): skips motion design and the visual critic loop. */
  presetShots?: Shot[];
}

export interface VideoQa {
  visual: { rounds: number; avgScore: number | null; weakShots: number; layoutIssues: number; frameIssues: { kind: string; start: number; detail: string }[] };
  audio: { musicGain: number; sfxGain: number; finalWer: number; maskingDelta: number; lufs: number; soundNotes: string } | null;
  subtitles?: { wer: number; diffs: string[] };
  blocking: string[];
}

/** Animated visuals → pre-render QA loop → render → per-frame checks → sound design → mix → Whisper masking check. */
export async function buildVideo(v: BuildVideoInput): Promise<{ video: string; qa: VideoQa }> {
  const { dir, scenes, timeline: tl } = v;
  const qa: VideoQa = { visual: { rounds: 0, avgScore: null, weakShots: 0, layoutIssues: 0, frameIssues: [] }, audio: null, blocking: [] };

  const W = v.vertical ? 1080 : 1920, H = v.vertical ? 1920 : 1080;
  const spokenById = new Map(v.spokenScenes.map(s => [s.id, s.text]));
  const captionScenes = v.vertical || config.video.burnCaptionsLong ? scenes.map(s => ({ id: s.id, narration: s.narration, spoken: spokenById.get(s.id) })) : undefined;
  let shots: Shot[] = v.presetShots ?? await planShots(scenes, tl, v.vertical, v.topic);
  let timed: TimedShot[] = [];
  let project = "", cues: Awaited<ReturnType<typeof composeAnimated>>["cues"] = [];
  const compose = async () => {
    timed = timeShots(shots, tl);
    ({ dir: project, cues } = await composeAnimated(join(dir, "hf"), timed, tl, { vertical: v.vertical, captionScenes }));
    writeJson(join(dir, "shots.json"), shots);
  };
  await compose();

  // ---- visual QA before the expensive render: layout audit + critic on key-frame snapshots, then revise weak shots
  let reviews: ShotReview[] = [];
  let layout: LayoutIssue[] = [];
  if (config.qa.enabled && !v.presetShots) {
    let focus: Set<number> | undefined;
    for (let round = 0; round <= config.qa.visualRounds; round++) {
      qa.visual.rounds = round + 1;
      layout = await layoutAudit(project, keyTimes(timed).map(k => k.t), W, H).catch(e => { log.warn(`layout audit failed: ${e.message}`); return []; });
      reviews = await critiqueShots(project, timed, v.vertical, layout, dir, focus);
      const shotAt = (t: number) => timed.findIndex(s => t >= s.start && t < s.end);
      const badLayout = new Set(layout.map(l => shotAt(l.t)).filter(i => i >= 0));
      const bad = new Set([...reviews.filter(r => r.score < config.qa.minShotScore || r.readability === "issue").map(r => r.shot), ...badLayout]);
      log.info(`visual QA round ${round + 1}: ${reviews.length} shots reviewed, avg ${(reviews.reduce((a, r) => a + r.score, 0) / Math.max(1, reviews.length)).toFixed(1)}, ${bad.size} need work, ${layout.length} layout findings`);
      if (!bad.size || round === config.qa.visualRounds) break;
      const sceneIds = new Set([...bad].map(i => timed[i]?.scene_id).filter(Boolean) as string[]);
      const feedback = [...bad].map(i => ({ shot: i, scene_id: timed[i]?.scene_id, review: reviews.find(r => r.shot === i), layout: layout.filter(l => shotAt(l.t) === i) }));
      shots = await reviseShots(shots, scenes, sceneIds, feedback, tl, v.vertical, v.topic);
      await compose();
      focus = new Set(timed.map((s, i) => (sceneIds.has(s.scene_id) ? i : -1)).filter(i => i >= 0));
    }
    const scored = reviews.filter(r => r.score);
    qa.visual.avgScore = scored.length ? +(scored.reduce((a, r) => a + r.score, 0) / scored.length).toFixed(1) : null;
    qa.visual.weakShots = scored.filter(r => r.score < config.qa.minShotScore).length;
    qa.visual.layoutIssues = layout.length;
  }

  // ---- subtitle QA: what's on screen must be what Whisper hears the narrator say
  if (config.qa.enabled && captionScenes) {
    const sub = await checkSubtitles(captionScenes, tl, dir);
    qa.subtitles = sub;
    log.info(`subtitle QA: ${(sub.wer * 100).toFixed(1)}% mismatch vs the voice${sub.diffs.length ? ` — ${sub.diffs.slice(0, 3).join("; ")}` : ""}`);
    if (sub.wer > 0.05) qa.blocking.push(`subtitles don't match the narration (${(sub.wer * 100).toFixed(0)}%: ${sub.diffs[0] ?? ""})`);
  }

  // ---- render + technical check of every frame (re-render once in safe capture mode if glitches)
  let silent = await renderComposition(project, join(dir, "silent.mp4"));
  if (config.qa.enabled) {
    let issues = await technicalFrameChecks(silent);
    if (issues.some(i => i.kind !== "flash")) {
      log.warn(`frame check: ${issues.map(i => `${i.kind}@${i.start.toFixed(1)}s`).join(", ")}; re-rendering in safe capture mode`);
      silent = await renderComposition(project, join(dir, "silent.mp4"), true);
      issues = await technicalFrameChecks(silent);
    }
    qa.visual.frameIssues = issues.map(i => ({ kind: i.kind, start: i.start, detail: i.detail }));
    if (issues.some(i => i.kind === "flash")) qa.blocking.push("possible photosensitive flashing");
    if (issues.some(i => i.kind === "black")) qa.blocking.push("black frames in render");
  }

  const final = await buildAudio({ ...v, timed, cues, silent, qa });
  writeJson(join(dir, "qa-report.json"), qa);
  return { video: final, qa };
}

/** Audio stage: music + SFX stems, auto-level, Sound Designer, mix, Whisper masking check. Fills `qa.audio`. */
export async function buildAudio(v: Pick<BuildVideoInput, "id" | "dir" | "out" | "timeline" | "narrationWav" | "spokenText" | "narrationWer"> &
  { timed: TimedShot[]; cues: Awaited<ReturnType<typeof composeAnimated>>["cues"]; silent: string; qa: VideoQa }): Promise<string> {
  const { dir, timeline: tl, timed, cues, silent, qa } = v;
  const mood = musicMood(timed.map(s => s.mood));
  const speech = speechIntervals(tl.scenes.flatMap(s => s.words));
  let musicGain = config.video.musicVolume, sfxGain = config.video.sfxVolume;
  let music = await musicStem(mood, tl.duration, v.id, dir);
  let sfx = await sfxStem(cues, speech, tl.duration, dir);
  // measure against the loudness-normalized voice (that's what the listener hears)
  const voice = join(dir, "narration-norm.wav");
  await ffmpeg(["-i", v.narrationWav, "-af", "loudnorm=I=-15:TP=-1.5:LRA=9", "-ar", "44100", voice]);
  let notes = "";
  if (config.qa.enabled) {
    const levels = await measureLevels(voice, music, sfx, join(dir, "sfx-cues.json"), musicGain, sfxGain, join(dir, "qa-levels.json"))
      .catch(e => { log.warn(`level measurement failed: ${(e as Error).message.slice(-300)}`); return undefined; });
    if (levels) {
      const auto = autoLevel(levels, musicGain, cues);
      log.info(`auto-level: music ${levels.music_under_voice_db} dB under voice → gain ${musicGain} → ${auto.musicGain}; ${auto.cues.filter((c, i) => c.gain !== cues[i].gain).length} SFX turned down`);
      // the Sound Designer judges the auto-leveled mix, not the raw one
      sfx = await sfxStem(auto.cues, speech, tl.duration, dir);
      const leveled = await measureLevels(voice, music, sfx, join(dir, "sfx-cues.json"), auto.musicGain, sfxGain, join(dir, "qa-levels-auto.json")).catch(() => levels);
      const sd = await designSound(timed, auto.cues, leveled, 1.0, dir);
      musicGain = +(auto.musicGain * sd.musicGain).toFixed(4); // agent returns a multiplier (1.0 = keep)
      notes = sd.notes;
      if (config.music.provider === "elevenlabs" && sd.musicPrompt) music = await musicStem(mood, tl.duration, v.id, dir, sd.musicPrompt);
      sfx = await sfxStem(sd.cues, speech, tl.duration, dir);
      writeJson(join(dir, "qa-sound-design.json"), { levels_before: levels, auto_music_gain: auto.musicGain, final_music_gain: musicGain, notes, cues: sd.cues });
    }
  }
  let final = await mixStems(silent, voice, music, sfx, musicGain, sfxGain, v.out);
  if (config.qa.enabled) {
    for (let round = 0; round < 3; round++) {
      const m = await checkMix(final, v.spokenText, v.narrationWer, dir);
      qa.audio = { musicGain: +musicGain.toFixed(3), sfxGain: +sfxGain.toFixed(3), finalWer: m.finalWer, maskingDelta: m.maskingDelta, lufs: m.lufs, soundNotes: notes };
      log.info(`mix QA: WER ${m.finalWer} (narration ${v.narrationWer}), masking Δ ${m.maskingDelta}, ${m.lufs} LUFS`);
      if (m.maskingDelta <= config.qa.maskingWerDelta || round === 2) {
        if (m.maskingDelta > config.qa.maskingWerDelta * 2) qa.blocking.push(`voice masked by music/SFX (WER +${m.maskingDelta})`);
        break;
      }
      musicGain *= 0.7; sfxGain *= 0.7; // −3 dB each and remix
      final = await mixStems(silent, voice, music, sfx, musicGain, sfxGain, v.out);
    }
  }
  return final;
}
