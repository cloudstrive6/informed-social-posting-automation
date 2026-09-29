import { existsSync } from "node:fs";
import { join } from "node:path";
import { config, ROOT } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { canUseEleven } from "../lib/usage.js";
import { elevenNarrate } from "./eleven.js";
import { chirpEnabled, chirpNarrate } from "./chirp.js";
import { run } from "./exec.js";

export interface Word { text: string; start: number; end: number }
export interface Timeline { duration: number; scenes: { id: string; start: number; end: number; words: Word[] }[] }
export interface NarrationScene { id: string; text: string; speed: number; pause_after_ms: number }

/**
 * Synthesize narration. Default: Chatterbox (expressive, human-sounding) + Whisper word timing.
 * Falls back to Kokoro (fast, lighter) if Chatterbox fails. Returns WAV path + word-level timeline.
 */
/** `plain`: the same scenes without pronunciation respellings (Google's voices read capitalized respellings as letters). */
export async function narrate(scenes: NarrationScene[], dir: string, voice = config.voice.kokoroVoice, redo: Map<string, number> = new Map(), kind = "short", plain?: NarrationScene[]): Promise<{ wav: string; timeline: Timeline; provider: string }> {
  const wav = join(dir, "narration.wav");
  const out = join(dir, "narration.json");
  const lines = scenes.map(s => ({ ...s, speed: +(s.speed * config.voice.baseSpeed).toFixed(3) }));
  const chars = lines.reduce((a, l) => a + l.text.length, 0);
  // decided once per video (cached in the work dir) so retakes never mix voices
  const choiceFile = join(dir, "voice-choice.json");
  const choice = readJson<{ provider: string }>(choiceFile, { provider: config.voice.provider === "elevenlabs" && canUseEleven(kind, chars) ? "elevenlabs" : "local" });
  writeJson(choiceFile, choice);
  if (config.voice.provider === "elevenlabs" && choice.provider !== "elevenlabs") {
    log.info(`ElevenLabs skipped for this ${kind} (budget/useFor); using the fallback voice`);
    if (config.voice.elevenlabs.useFor.includes(kind)) {
      const { notify } = await import("../notify/telegram.js");
      await notify(`🎙️ ElevenLabs credits are running low: this ${kind} is being narrated with the backup voice (Google Chirp HD). Upgrade the ElevenLabs plan and set <code>voice.elevenlabs.monthlyCredits</code> to the new allowance to bring Jeremy back.`);
    }
  }
  if (choice.provider === "elevenlabs") {
    try { return { ...(await elevenNarrate(lines, dir, redo, kind)), provider: "elevenlabs" }; }
    catch (e) {
      const msg = (e as Error).message;
      log.warn(`ElevenLabs failed, falling back to Chatterbox: ${msg.slice(0, 300)}`);
      if (/quota|credit|limit|401|402/i.test(msg)) {
        const { notify } = await import("../notify/telegram.js");
        await notify(`🎙️ ElevenLabs refused the narration (${msg.slice(0, 120).replace(/[<>&]/g, "")}). This ${kind} uses the backup voice. Check the ElevenLabs plan/credits.`);
      }
    }
  }
  // Google Chirp 3 HD: the free, near-ElevenLabs fallback (kept inside the monthly free allowance)
  if (config.voice.provider !== "kokoro" && chirpEnabled(chars)) {
    const plainLines = plain ? plain.map(s => ({ ...s, speed: +(s.speed * config.voice.baseSpeed).toFixed(3) })) : lines;
    try { return { ...(await chirpNarrate(plainLines, dir)), provider: "chirp" }; }
    catch (e) { log.warn(`Chirp failed, falling back to Chatterbox: ${(e as Error).message.slice(0, 300)}`); }
  }
  if (config.voice.provider !== "kokoro") {
    const job = join(dir, "tts-job.json");
    const ref = config.voice.voiceRef && existsSync(join(ROOT, config.voice.voiceRef)) ? join(ROOT, config.voice.voiceRef) : undefined;
    writeJson(job, { model: config.voice.chatterboxModel, voice_ref: ref, exaggeration: config.voice.exaggeration, out_wav: wav, out_json: out, scenes: lines });
    try {
      await run(process.env.PYTHON_TTS ?? process.env.PYTHON ?? "python", [join(ROOT, "python", "tts_chatterbox.py"), job]);
      return { wav, timeline: readJson<Timeline>(out), provider: "chatterbox" };
    } catch (e) {
      log.warn(`Chatterbox failed, falling back to Kokoro: ${(e as Error).message.slice(-300)}`);
    }
  }
  const job = join(dir, "tts-job-kokoro.json");
  writeJson(job, { voice, out_wav: wav, out_json: out, scenes: lines });
  await run(process.env.PYTHON ?? "python", [join(ROOT, "python", "tts_kokoro.py"), job]);
  return { wav, timeline: readJson<Timeline>(out), provider: "kokoro" };
}

/**
 * Captions must show the written words (not TTS respellings like "KWER-sih-tin").
 * Map display words onto spoken-word timings: 1:1 when counts match, proportional otherwise.
 */
export function captionWords(display: string, spoken: Word[]): Word[] {
  const words = display.split(/\s+/).filter(Boolean);
  if (!spoken.length || !words.length) return [];
  if (words.length === spoken.length) return words.map((text, i) => ({ text, start: spoken[i].start, end: spoken[i].end }));
  return words.map((text, i) => {
    const a = spoken[Math.min(spoken.length - 1, Math.floor((i * spoken.length) / words.length))];
    const b = spoken[Math.min(spoken.length - 1, Math.floor(((i + 1) * spoken.length) / words.length) - 1)] ?? a;
    return { text, start: a.start, end: Math.max(a.end, b.end) };
  });
}
