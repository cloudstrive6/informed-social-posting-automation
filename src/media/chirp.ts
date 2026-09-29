/**
 * Google Cloud Text-to-Speech "Chirp 3: HD" voices: near-ElevenLabs quality, free for the first 1,000,000
 * characters a month (project informed-upload, API key restricted to the Text-to-Speech API).
 * Used as the fallback narrator when ElevenLabs credits run low. Word timing comes from Whisper, like Chatterbox.
 * A monthly usage counter keeps it inside the free allowance.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { config, DATA, env, ROOT } from "../lib/config.js";
import { ensureDir, readJson, writeJson } from "../lib/fsx.js";
import { httpJson } from "../lib/http.js";
import { log } from "../lib/log.js";
import { ffmpeg, run } from "./exec.js";
import type { NarrationScene, Timeline } from "./tts.js";

const USAGE = join(DATA, "usage", "chirp.json");
const month = () => new Date().toISOString().slice(0, 7);

export function chirpEnabled(chars: number): boolean {
  if (!env("GOOGLE_TTS_API_KEY")) return false;
  const u = readJson<{ month: string; chars: number }>(USAGE, { month: month(), chars: 0 });
  const used = u.month === month() ? u.chars : 0;
  return used + chars * 1.2 <= (config.voice.chirp?.monthlyFreeChars ?? 1_000_000) * 0.95;
}

function addUsage(chars: number) {
  const u = readJson<{ month: string; chars: number }>(USAGE, { month: month(), chars: 0 });
  writeJson(USAGE, { month: month(), chars: (u.month === month() ? u.chars : 0) + chars });
}

async function synth(text: string, rate: number, out: string) {
  const voice = config.voice.chirp?.voice ?? "en-US-Chirp3-HD-Achird";
  const j = await httpJson<{ audioContent: string }>(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${env("GOOGLE_TTS_API_KEY", true)}`, {
    method: "POST", headers: { "content-type": "application/json" }, timeoutMs: 120_000,
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: voice.slice(0, 5), name: voice },
      audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 24000, speakingRate: Math.min(1.25, Math.max(0.8, rate)) },
    }),
  });
  writeFileSync(out, Buffer.from(j.audioContent, "base64"));
}

/** Narrate every scene (cached per scene), join with the scene pauses, and time the words with Whisper. */
export async function chirpNarrate(lines: NarrationScene[], dir: string): Promise<{ wav: string; timeline: Timeline }> {
  const cache = ensureDir(join(dir, "tts-cache-chirp"));
  const voice = config.voice.chirp?.voice ?? "en-US-Chirp3-HD-Achird";
  const parts: { file: string; pause: number; id: string }[] = [];
  let billed = 0;
  for (const l of lines) {
    const key = createHash("sha1").update(`${voice}|${l.speed}|${l.text}`).digest("hex").slice(0, 16);
    const f = join(cache, `${l.id}-${key}.wav`);
    if (!existsSync(f)) { await synth(l.text, l.speed, f); billed += l.text.length; }
    parts.push({ file: f, pause: l.pause_after_ms ?? 300, id: l.id });
  }
  if (billed) addUsage(billed);

  // join: scene audio + its pause (as silence), recording where each scene starts
  const list = join(dir, "chirp-concat.txt");
  const silence = (ms: number) => { const p = join(cache, `silence-${ms}.wav`); return p; };
  const durations: number[] = [];
  for (const p of parts) {
    const probe = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p.file], { quiet: true });
    durations.push(Number(probe.trim()));
    const s = silence(p.pause);
    if (!existsSync(s)) await ffmpeg(["-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(p.pause / 1000), "-c:a", "pcm_s16le", s]);
  }
  // absolute paths: ffmpeg resolves list entries relative to the list file itself
  const abs = (f: string) => resolve(f).replace(/\\/g, "/");
  writeFileSync(list, parts.flatMap(p => [`file '${abs(p.file)}'`, `file '${abs(silence(p.pause))}'`]).join("\n"));
  const wav = join(dir, "narration.wav");
  await ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c:a", "pcm_s16le", "-ar", "24000", "-ac", "1", wav]);

  // word timings from Whisper, assigned to scenes by their known start/end times
  const heardFile = join(dir, "chirp-words.json");
  await run(process.env.PYTHON_QA ?? process.env.PYTHON ?? "python", [join(ROOT, "python", "qa_audio.py"), "transcribe", wav, heardFile], { quiet: true });
  const words = JSON.parse(readFileSync(heardFile, "utf8")).words as { text: string; start: number; end: number }[];
  const timeline: Timeline = { duration: 0, scenes: [] };
  let t = 0;
  parts.forEach((p, i) => {
    const start = t, end = t + durations[i];
    timeline.scenes.push({ id: p.id, start: +start.toFixed(3), end: +end.toFixed(3), words: words.filter(w => (w.start + w.end) / 2 >= start - 0.05 && (w.start + w.end) / 2 < end + p.pause / 1000).map(w => ({ text: w.text, start: w.start, end: w.end })) });
    t = end + p.pause / 1000;
  });
  timeline.duration = +t.toFixed(3);
  writeJson(join(dir, "narration.json"), timeline);
  log.info(`chirp: ${lines.length} scenes, ${billed} new characters (${voice})`);
  return { wav, timeline };
}
