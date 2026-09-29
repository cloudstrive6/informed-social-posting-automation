import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config } from "../lib/config.js";
import { ensureDir } from "../lib/fsx.js";
import { elevenBudgetLeft } from "../lib/usage.js";
import { log } from "../lib/log.js";
import type { SfxCue, TimedShot } from "../media/animated.js";
import type { Levels } from "./audioQa.js";

export interface MixCue { t: number; sfx?: string; file?: string; gain: number; accent?: boolean }
interface SoundPlan {
  music_gain: number; music_prompt: string; notes: string;
  cue_changes: { i: number; gain: number }[];
  custom_sfx: { t: number; prompt: string; seconds: number; gain: number }[];
}
const schema = {
  type: "object", additionalProperties: false, required: ["music_gain", "music_prompt", "notes", "cue_changes", "custom_sfx"],
  properties: {
    music_gain: { type: "number", minimum: 0.1, maximum: 3 }, music_prompt: { type: "string" }, notes: { type: "string" },
    cue_changes: { type: "array", items: { type: "object", additionalProperties: false, required: ["i", "gain"], properties: { i: { type: "number" }, gain: { type: "number", minimum: 0, maximum: 1.5 } } } },
    custom_sfx: { type: "array", maxItems: 10, items: { type: "object", additionalProperties: false, required: ["t", "prompt", "seconds", "gain"], properties: { t: { type: "number" }, prompt: { type: "string" }, seconds: { type: "number" }, gain: { type: "number" } } } },
  },
};

/** Sound Designer agent: sets music level, rebalances/drops SFX cues and adds bespoke effects (ElevenLabs) for key moments. */
export async function designSound(shots: TimedShot[], cues: SfxCue[], levels: Levels, musicGain: number, workDir: string): Promise<{ cues: MixCue[]; musicGain: number; musicPrompt?: string; notes: string }> {
  let plan: SoundPlan;
  try {
    plan = await runAgent<SoundPlan>({
      agent: "sound-designer", model: config.models.polish, schema, effort: "medium",
      input: {
        current_music_gain: musicGain, music_gain_semantics: "multiplier on the current (already auto-leveled) music level; 1.0 = keep",
        custom_sfx_limit: process.env.ELEVENLABS_API_KEY && elevenBudgetLeft() > 0.25 ? config.sfx.customPerVideo : 0,
        shots: shots.map((s, i) => ({ i, t: +s.start.toFixed(1), mood: s.mood, transition: s.transition, title: s.title.style !== "none" ? `${s.title.style}: ${s.title.text}` : "" })),
        cues: cues.map((c, i) => ({ i, t: +c.t.toFixed(2), sfx: c.sfx, gain: c.gain })),
        measured: levels,
      },
    });
  } catch (e) {
    log.warn(`sound designer failed, using measured auto-levels: ${(e as Error).message}`);
    plan = { music_gain: musicGain, music_prompt: "", notes: "auto", cue_changes: [], custom_sfx: [] };
  }
  const gains = new Map(plan.cue_changes.map(c => [c.i, c.gain]));
  const mixCues: MixCue[] = cues.map((c, i) => ({ t: c.t, sfx: c.sfx, gain: gains.get(i) ?? c.gain })).filter(c => c.gain > 0.01);

  // bespoke effects via ElevenLabs sound generation
  if (plan.custom_sfx.length && process.env.ELEVENLABS_API_KEY) {
    const { elevenSfx } = await import("../media/eleven.js");
    const dir = ensureDir(join(workDir, "custom-sfx"));
    for (const [k, s] of plan.custom_sfx.slice(0, config.sfx.customPerVideo).entries()) {
      try {
        const file = await elevenSfx(s.prompt, s.seconds, join(dir, `fx-${k}.mp3`));
        mixCues.push({ t: s.t, file, gain: Math.min(1, Math.max(0.05, s.gain)), accent: true });
        log.info(`  custom sfx @${s.t.toFixed(1)}s: ${s.prompt}`);
      } catch (e) { log.warn(`custom sfx failed: ${(e as Error).message.slice(0, 150)}`); }
    }
  }
  return { cues: mixCues.sort((a, b) => a.t - b.t), musicGain: plan.music_gain, musicPrompt: plan.music_prompt || undefined, notes: plan.notes };
}

/**
 * Measured auto-leveling (runs before the Sound Designer so even a failed agent call yields a clean mix):
 * music ≈ −21 dB under speech; SFX ≈ −16 dB when they land on words, ≈ −9 dB in pauses. Only ever turns things down.
 */
export function autoLevel(levels: Levels, musicGain: number, cues: SfxCue[]): { musicGain: number; cues: SfxCue[] } {
  const g = (db: number) => 10 ** (db / 20);
  let mg = musicGain;
  // Keep the score clearly audible but never competing. Measured BEFORE ducking; the mix ducks another ~4-5 dB
  // under speech (render.ts MUSIC_DUCK), so -11.5 here lands at about -16 dB under the voice in the final mix.
  const mu = levels.music_under_voice_db;
  if (mu != null && (mu > -10 || mu < -13)) mg = Math.min(0.9, musicGain * g(-11.5 - mu));
  const out = cues.map((c, i) => {
    const m = levels.cues.find(x => x.i === i);
    if (!m) return c;
    const target = m.during_speech ? -16 : -9;
    return m.rel_voice_db > target + 2 ? { ...c, gain: +(c.gain * g(target - m.rel_voice_db)).toFixed(3) } : c;
  });
  return { musicGain: +mg.toFixed(3), cues: out };
}

/** Speech intervals from word timings (gaps < 0.35 s merged). */
export function speechIntervals(words: { start: number; end: number }[]): [number, number][] {
  const out: [number, number][] = [];
  for (const w of [...words].sort((a, b) => a.start - b.start)) {
    const last = out[out.length - 1];
    if (last && w.start - last[1] < 0.35) last[1] = Math.max(last[1], w.end);
    else out.push([w.start, w.end]);
  }
  return out;
}
