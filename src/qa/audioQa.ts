/** Whisper-based audio review: did the voice say exactly the script, and is it still intelligible in the final mix? */
import { join } from "node:path";
import { ROOT } from "../lib/config.js";
import { readJson } from "../lib/fsx.js";
import { ffmpeg, run } from "../media/exec.js";
import type { Timeline } from "../media/tts.js";

const py = () => process.env.PYTHON_QA ?? process.env.PYTHON_TTS ?? process.env.PYTHON ?? "python";
export interface HeardWord { text: string; start: number; end: number; prob: number }

export async function transcribe(audio: string, out: string): Promise<HeardWord[]> {
  await run(py(), [join(ROOT, "python", "qa_audio.py"), "transcribe", audio, out], { quiet: true });
  return readJson<{ words: HeardWord[] }>(out).words;
}

// ---------------------------------------------------------------- text normalization
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function numWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWords(n % 100) : "");
  if (n < 1_000_000) return numWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numWords(n % 1000) : "");
  return String(n);
}
/** Lowercase words with numbers spelled out, so "58%" == "fifty-eight percent". */
const SAME = new Map([["root", "route"], ["okay", "ok"], ["percentage", "percent"]]); // accepted variants
export function normWords(s: string): string[] {
  const words = s.toLowerCase()
    .replace(/(\d)\s?[,.]?\s?(\d{3})\b/g, "$1$2") // "80,000" / "80 000" / Whisper's split "80 ,000"
    .replace(/(\d+(?:\.\d+)?)\s*%/g, "$1 percent")
    .replace(/\d+/g, m => (m.length <= 6 ? numWords(Number(m)) : m))
    .replace(/[-–—/]/g, " ")
    .replace(/[^a-z' ]/g, " ")
    .split(/\s+/).filter(Boolean).map(w => w.replace(/^'+|'+$/g, "")).map(w => SAME.get(w) ?? w);
  // spelled-out acronyms ("h r t") == "hrt"
  const letter = (w: string) => w.length === 1 && w !== "a" && w !== "i";
  const out: string[] = [];
  let inAcronym = false;
  for (const w of words) {
    if (letter(w) && inAcronym) out[out.length - 1] += w;
    else { out.push(w); inAcronym = letter(w); }
  }
  return out;
}

/** Word error rate + the mismatched stretches (for reports and retakes). */
export function wer(expected: string[], heard: string[]): { wer: number; diffs: string[] } {
  const n = expected.length, m = heard.length;
  const d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (expected[i - 1] === heard[j - 1] ? 0 : 1));
  }
  // backtrace mismatches
  const diffs: string[] = [];
  let i = n, j = m, buf: [string[], string[]] = [[], []];
  const flush = () => { if (buf[0].length || buf[1].length) diffs.unshift(`expected "${buf[0].reverse().join(" ")}" heard "${buf[1].reverse().join(" ")}"`); buf = [[], []]; };
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && expected[i - 1] === heard[j - 1] && d[i][j] === d[i - 1][j - 1]) { flush(); i--; j--; }
    else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { buf[0].push(expected[--i]); buf[1].push(heard[--j]); }
    else if (i > 0 && d[i][j] === d[i - 1][j] + 1) buf[0].push(expected[--i]);
    else buf[1].push(heard[--j]);
  }
  flush();
  return { wer: n ? d[n][m] / n : 0, diffs: diffs.slice(0, 6) };
}

export interface SceneCheck { id: string; wer: number; diffs: string[]; lowConfidence: number }

/** Compare each narrated scene with what it was supposed to say. */
export async function checkNarration(wav: string, tl: Timeline, spoken: { id: string; text: string }[], workDir: string): Promise<SceneCheck[]> {
  const heard = await transcribe(wav, join(workDir, "qa-narration-transcript.json"));
  const byId = new Map(spoken.map(s => [s.id, s.text]));
  return tl.scenes.map((sc, i) => {
    const end = tl.scenes[i + 1]?.start ?? tl.duration;
    const ws = heard.filter(w => (w.start + w.end) / 2 >= sc.start - 0.1 && (w.start + w.end) / 2 < end);
    const r = wer(normWords(byId.get(sc.id) ?? ""), normWords(ws.map(w => w.text).join(" ")));
    return { id: sc.id, wer: +r.wer.toFixed(3), diffs: r.diffs, lowConfidence: ws.filter(w => w.prob < 0.4).length };
  });
}

/** Intelligibility of the final mix vs the clean narration: a rise in WER means music/SFX are masking the voice. */
export async function checkMix(finalVideo: string, spokenText: string, narrationWer: number, workDir: string) {
  const wav = join(workDir, "qa-final-audio.wav");
  await ffmpeg(["-i", finalVideo, "-vn", "-ac", "1", "-ar", "16000", wav]);
  const heard = await transcribe(wav, join(workDir, "qa-final-transcript.json"));
  const r = wer(normWords(spokenText), normWords(heard.map(w => w.text).join(" ")));
  const loud = JSON.parse(await run(py(), [join(ROOT, "python", "qa_audio.py"), "loudness", wav], { quiet: true }));
  return { finalWer: +r.wer.toFixed(3), maskingDelta: +(r.wer - narrationWer).toFixed(3), diffs: r.diffs, lufs: loud.lufs as number, peakDb: loud.peak_db as number };
}

export interface Levels {
  voice_db: number; speaking_ratio: number; music_under_voice_db?: number; music_in_pauses_db?: number;
  cues: { i: number; t: number; sfx: string; rel_voice_db: number; during_speech: boolean }[];
}
export async function measureLevels(narration: string, music: string | undefined, sfx: string | undefined, cuesFile: string | undefined, musicGain: number, sfxGain: number, out: string): Promise<Levels> {
  await run(py(), [join(ROOT, "python", "qa_audio.py"), "levels", narration, music ?? "-", sfx ?? "-", cuesFile ?? "-", String(musicGain), String(sfxGain), out], { quiet: true });
  return readJson<Levels>(out);
}

/** Subtitles vs what Whisper heard the narrator say (uses the narration transcript from checkNarration). */
export async function checkSubtitles(scenes: { id: string; narration: string; spoken?: string }[], tl: Timeline, workDir: string) {
  const { subtitleWords } = await import("../media/captions.js");
  const shown = scenes.flatMap(sc => {
    const t = tl.scenes.find(x => x.id === sc.id);
    return t ? subtitleWords(sc.narration, sc.spoken ?? sc.narration, t.words).map(w => w.text) : [];
  }).join(" ");
  const file = join(workDir, "qa-narration-transcript.json");
  const heard = readJson<{ words: HeardWord[] }>(file, { words: [] }).words;
  if (!heard.length) return { wer: 0, diffs: ["(no narration transcript available)"] };
  const r = wer(normWords(heard.map(w => w.text).join(" ")), normWords(shown));
  return { wer: +r.wer.toFixed(3), diffs: r.diffs };
}
