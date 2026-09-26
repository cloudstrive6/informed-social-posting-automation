/** ElevenLabs: narration (with character timestamps), music (Eleven Music) and sound effects. */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config, env } from "../lib/config.js";
import { ensureDir, readJson, writeJson } from "../lib/fsx.js";
import { http } from "../lib/http.js";
import { log } from "../lib/log.js";
import { addElevenUsage, ttsCredits } from "../lib/usage.js";
import { ffmpeg } from "./exec.js";
import type { NarrationScene, Timeline, Word } from "./tts.js";

const API = "https://api.elevenlabs.io/v1";
const key = () => env("ELEVENLABS_API_KEY", true)!;
const SR = 44100;

async function post(path: string, body: object, accept = "application/json"): Promise<Response> {
  const res = await http(`${API}${path}`, {
    method: "POST", timeoutMs: 300_000, retries: 3,
    headers: { "xi-api-key": key(), "content-type": "application/json", accept },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${path.split("?")[0]} ${res.status}: ${(await res.text()).slice(0, 400)}`);
  return res;
}

/** Group character-level alignment into words. */
function charsToWords(a: { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] }): Word[] {
  const words: Word[] = [];
  let cur: Word | null = null;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) words.push(cur); cur = null; return; }
    if (!cur) cur = { text: ch, start: a.character_start_times_seconds[i], end: a.character_end_times_seconds[i] };
    else { cur.text += ch; cur.end = a.character_end_times_seconds[i]; }
  });
  if (cur) words.push(cur);
  return words;
}

async function decodeToF32(file: string): Promise<Float32Array> {
  const raw = `${file}.f32`;
  await ffmpeg(["-i", file, "-f", "f32le", "-ac", "1", "-ar", String(SR), raw]);
  const b = readFileSync(raw);
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
}

function writeWav(file: string, pcm: Float32Array) {
  const data = Buffer.alloc(pcm.length * 2);
  for (let i = 0; i < pcm.length; i++) data.writeInt16LE(Math.max(-1, Math.min(1, pcm[i])) * 32767 | 0, i * 2);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(file, Buffer.concat([h, data]));
}

/**
 * Narrate scene by scene (cached per scene), stitching prosody with previous/next text,
 * then assemble one WAV + timeline. `redo` re-voices only those scene ids (new seed).
 */
export async function elevenNarrate(scenes: NarrationScene[], dir: string, redo: Map<string, number> = new Map(), kind = "short"): Promise<{ wav: string; timeline: Timeline }> {
  const e = config.voice.elevenlabs;
  const cache = ensureDir(join(dir, "tts-cache"));
  const parts: { id: string; pcm: Float32Array; words: Word[]; pause: number }[] = [];
  for (const [i, s] of scenes.entries()) {
    const attempt = redo.get(s.id) ?? 0;
    const h = createHash("sha1").update(JSON.stringify([e.voiceId, e.model, s.text, s.speed, attempt])).digest("hex").slice(0, 16);
    const mp3 = join(cache, `${s.id}-${h}.mp3`), meta = join(cache, `${s.id}-${h}.json`);
    if (!existsSync(mp3)) {
      const res = await post(`/text-to-speech/${e.voiceId}/with-timestamps?output_format=mp3_44100_128`, {
        text: s.text, model_id: e.model,
        previous_text: scenes[i - 1]?.text, next_text: scenes[i + 1]?.text,
        voice_settings: { stability: e.stability, similarity_boost: e.similarity, style: e.style, use_speaker_boost: true, speed: Math.min(1.2, Math.max(0.7, s.speed)) },
        ...(attempt ? { seed: 1000 + attempt * 17 } : {}),
      });
      const j = await res.json() as any;
      addElevenUsage(kind, ttsCredits(s.text.length));
      writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
      writeJson(meta, { words: charsToWords(j.alignment ?? j.normalized_alignment) });
      log.info(`  eleven ${s.id}${attempt ? ` (retake ${attempt})` : ""}`);
    }
    parts.push({ id: s.id, pcm: await decodeToF32(mp3), words: readJson<{ words: Word[] }>(meta).words, pause: s.pause_after_ms / 1000 });
  }
  const lead = 0.2, tail = 0.5;
  const total = Math.ceil((lead + tail + parts.reduce((a, p) => a + p.pcm.length / SR + p.pause, 0)) * SR);
  const out = new Float32Array(total);
  let t = lead;
  const tl: Timeline = { duration: total / SR, scenes: [] };
  for (const p of parts) {
    out.set(p.pcm, Math.round(t * SR));
    const d = p.pcm.length / SR;
    tl.scenes.push({ id: p.id, start: +t.toFixed(3), end: +(t + d).toFixed(3), words: p.words.map(w => ({ text: w.text, start: +(t + w.start).toFixed(3), end: +(t + w.end).toFixed(3) })) });
    t += d + p.pause;
  }
  const wav = join(dir, "narration.wav");
  writeWav(wav, out);
  writeJson(join(dir, "narration.json"), tl);
  return { wav, timeline: tl };
}

/** Eleven Music: instrumental score (≤ 10 min per request; longer videos loop with a crossfade in the mixer). */
export async function elevenMusic(prompt: string, seconds: number, out: string): Promise<string> {
  const ms = Math.round(Math.min(600, Math.max(10, seconds)) * 1000);
  const body = { prompt, music_length_ms: ms, force_instrumental: true, model_id: config.music.elevenModel };
  let res: Response;
  try { res = await post(`/music?output_format=mp3_44100_128`, body, "audio/mpeg"); }
  catch (e) {
    log.warn(`Eleven Music with ${config.music.elevenModel} failed (${(e as Error).message.slice(0, 120)}); retrying with music_v1`);
    res = await post(`/music?output_format=mp3_44100_128`, { ...body, model_id: "music_v1" }, "audio/mpeg");
  }
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  addElevenUsage("music", Math.round((ms / 60000) * MUSIC_CREDITS_PER_MIN));
  return out;
}
/** Measured on the Starter plan: a 3-minute track cost ~2,700 credits. */
const MUSIC_CREDITS_PER_MIN = 905;

/** Eleven sound effect from a text prompt. */
export async function elevenSfx(prompt: string, seconds: number | undefined, out: string): Promise<string> {
  const res = await post(`/sound-generation?output_format=mp3_44100_128`, { text: prompt, ...(seconds ? { duration_seconds: Math.min(30, Math.max(0.5, seconds)) } : {}), prompt_influence: 0.5 }, "audio/mpeg");
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  return out;
}
