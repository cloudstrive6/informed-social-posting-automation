/**
 * Subtitles that match the voice word for word.
 * The narrator reads `spoken` (the Narration Director's rewrite), so captions are built from it and timed
 * with the voice's own word timestamps. Where a stretch of speech is just a different *spelling* of the
 * script (numbers, "%", acronyms, pronunciation respellings), the script's tidier written form is shown.
 */
import { normWords } from "../qa/audioQa.js";
import type { Word } from "./tts.js";

const RESPELL = /[A-Z]{2,}.*-|-.*[A-Z]{2,}/; // "KWER-sih-tin"
const key = (t: string) => normWords(t).join(" ");
const raw = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

function lev(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

/** A short stretch the narrator spelled the way it sounds ("amilin" for "amylin", "Allura TZP" for "EloraTZP"). */
function soundAlike(spoke: string[], written: string[]): boolean {
  if (spoke.length > 3 || written.length > 3) return false;
  if (spoke.length < written.length && spoke.some(w => /'/.test(w))) return false; // contractions: "it's" for "it is"
  const a = raw(spoke.join("")), b = raw(written.join(""));
  return b.length >= 4 && 1 - lev(a, b) / Math.max(a.length, b.length) >= 0.6;
}

/** Timed spoken tokens: exact when counts match (ElevenLabs), proportional otherwise (Whisper timing). */
function timedSpoken(spoken: string, words: Word[]): Word[] {
  const toks = spoken.split(/\s+/).filter(Boolean);
  if (!toks.length || !words.length) return [];
  if (toks.length === words.length) return toks.map((text, i) => ({ text, start: words[i].start, end: words[i].end }));
  return toks.map((text, i) => {
    const a = words[Math.min(words.length - 1, Math.floor((i * words.length) / toks.length))];
    const b = words[Math.min(words.length - 1, Math.floor(((i + 1) * words.length) / toks.length) - 1)] ?? a;
    return { text, start: a.start, end: Math.max(a.end, b.end) };
  });
}

/** Align spoken tokens to script tokens (edit distance on normalized forms) and pick what to display. */
export function subtitleWords(script: string, spoken: string, words: Word[]): Word[] {
  const sp = timedSpoken(spoken, words);
  const sc = script.split(/\s+/).filter(Boolean);
  const A = sp.map(w => key(w.text)), B = sc.map(key);
  const n = A.length, m = B.length;
  const d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));

  // walk back, collecting blocks of exact matches and blocks of differences
  type Block = { sp: [number, number]; sc: [number, number]; same: boolean };
  const blocks: Block[] = [];
  let i = n, j = m;
  let cur: Block | null = null;
  const push = (same: boolean, di: number, dj: number) => {
    if (!cur || cur.same !== same) { cur = { sp: [i, i], sc: [j, j], same }; blocks.unshift(cur); }
    i -= di; j -= dj; cur.sp[0] = i; cur.sc[0] = j;
  };
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && A[i - 1] === B[j - 1] && d[i][j] === d[i - 1][j - 1]) push(true, 1, 1);
    else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) push(false, 1, 1);
    else if (i > 0 && d[i][j] === d[i - 1][j] + 1) push(false, 1, 0);
    else push(false, 0, 1);
  }

  const out: Word[] = [];
  for (const b of blocks) {
    const spoke = sp.slice(b.sp[0], b.sp[1]);
    const written = sc.slice(b.sc[0], b.sc[1]);
    if (!spoke.length) continue; // script words the narrator didn't say are never shown
    const sameMeaning = key(spoke.map(w => w.text).join(" ")) === key(written.join(" "));
    const respelled = (spoke.some(w => RESPELL.test(w.text)) || soundAlike(spoke.map(w => w.text), written)) && written.length > 0;
    if (!b.same && (sameMeaning || respelled) && written.length) {
      // show the script's written form over the time the narrator spent saying it
      const t0 = spoke[0].start, t1 = spoke[spoke.length - 1].end, step = (t1 - t0) / written.length;
      written.forEach((text, k) => out.push({ text, start: t0 + k * step, end: t0 + (k + 1) * step }));
    } else if (b.same) {
      // exact matches keep the spoken token's own punctuation/casing, unless only the spelling matched
      // after normalising ("twob" vs "2b", "fifteen" vs "15"): then the script's spelling is shown
      spoke.forEach((w, k) => out.push(/\d/.test(written[k]) && raw(w.text) !== raw(written[k]) ? { ...w, text: written[k] } : w));
    } else {
      spoke.forEach(w => out.push(w));
    }
  }
  return out;
}
