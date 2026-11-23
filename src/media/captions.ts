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

/** Timed spoken tokens: each takes the time of the heard word(s) it matches (see alignTimes). */
function timedSpoken(spoken: string, words: Word[], stats?: AlignStats): Word[] {
  const toks = spoken.split(/\s+/).filter(Boolean);
  if (!toks.length || !words.length) return [];
  return alignTimes(toks, words, stats);
}

/** How many caption tokens took their time from a heard word (the rest are placed between neighbours). */
export interface AlignStats { tokens: number; timed: number; guessedSeconds: number }
/** A merge (one token = 2-3 heard pieces, or the other way round) must sound alike, or it would swallow dropped words. */
const MERGE_SIM = 0.6;
/** A one-to-one pair below this is treated as unmatched and placed between its neighbours. */
const PAIR_SIM = 0.5;

/** A token's sound key: numbers as words, letters only ("6" = "six", "label." = "label"). */
const soundKey = (t: string) => normWords(t).join("").replace(/'/g, "") || raw(t);
const sim = (a: string, b: string) => (!a && !b ? 1 : 1 - lev(a, b) / Math.max(a.length, b.length, 1));

/**
 * Give every spoken token the time of the heard word(s) it matches. Whisper often splits or merges words
 * ("Orforglipron" heard as "Or for glipron", "it is" as "It's"), and the old rule then spread the times evenly
 * across the whole scene, so captions drifted by up to half a second (owner, 2026-11-24: "the spoken words are
 * not in sync with the subtitles"). This aligns token by token, allowing one token to match 2 or 3 heard pieces
 * and the other way round; only tokens nothing matches are placed between their neighbours.
 */
export function alignTimes(toks: string[], heard: Word[], stats?: AlignStats): Word[] {
  if (!toks.length || !heard.length) return [];
  const A = toks.map(soundKey), B = heard.map(w => soundKey(w.text));
  const n = A.length, m = B.length, SKIP = 1;
  const cost = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(Infinity));
  const move = Array.from({ length: n + 1 }, () => new Array<[number, number]>(m + 1));
  cost[0][0] = 0;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) {
    const c = cost[i][j];
    if (c === Infinity) continue;
    const relax = (di: number, dj: number, add: number) => {
      if (i + di > n || j + dj > m || c + add >= cost[i + di][j + dj]) return;
      cost[i + di][j + dj] = c + add; move[i + di][j + dj] = [di, dj];
    };
    relax(1, 0, SKIP);
    relax(0, 1, SKIP);
    for (let k = 1; k <= 3; k++) {
      // a merge must sound alike AND beat every single piece on its own, or it would swallow a neighbouring
      // filler word ("so hello") or a dropped word for less than the cost of skipping it
      if (i < n && j + k <= m) { // one token, k heard pieces
        const s = sim(A[i], B.slice(j, j + k).join(""));
        const best = k === 1 ? 0 : Math.max(...B.slice(j, j + k).map(b => sim(A[i], b)));
        if (k === 1 || (s >= MERGE_SIM && s >= best + 0.05)) relax(1, k, (1 - s) * 1.2 + (k - 1) * 0.15);
      }
      if (k > 1 && i + k <= n && j < m) { // k tokens, one heard word
        const s = sim(A.slice(i, i + k).join(""), B[j]);
        const best = Math.max(...A.slice(i, i + k).map(a => sim(a, B[j])));
        if (s >= MERGE_SIM && s >= best + 0.05) relax(k, 1, (1 - s) * 1.2 + (k - 1) * 0.15);
      }
    }
  }
  const out: (Word | null)[] = new Array(n).fill(null);
  let i = n, j = m;
  while (i > 0 || j > 0) {
    const [di, dj] = move[i][j];
    if (di && dj && (di > 1 || dj > 1 || sim(A[i - 1], B[j - 1]) >= PAIR_SIM)) {
      const span = heard.slice(j - dj, j), t0 = span[0].start, t1 = span[span.length - 1].end, step = (t1 - t0) / di;
      for (let k = 0; k < di; k++) out[i - di + k] = { text: toks[i - di + k], start: t0 + k * step, end: di > 1 ? t0 + (k + 1) * step : t1 };
    }
    i -= di; j -= dj;
  }
  // tokens nothing matched: share the gap between their timed neighbours
  const unmatched = out.filter(w => !w).length;
  for (let a = 0; a < n; a++) {
    if (out[a]) continue;
    let b = a;
    while (b < n && !out[b]) b++;
    const from = a > 0 ? out[a - 1]!.end : heard[0].start, to = b < n ? out[b]!.start : heard[m - 1].end;
    const step = Math.max(0, to - from) / (b - a);
    for (let k = a; k < b; k++) out[k] = { text: toks[k], start: from + (k - a) * step, end: from + (k - a + 1) * step };
    // how unsure the guess is: the gap it fills, or the time its words would need when squeezed into a tiny gap
    if (stats) stats.guessedSeconds = Math.max(stats.guessedSeconds, to - from, (b - a) * 0.3);
    a = b;
  }
  if (stats) { stats.tokens += n; stats.timed += n - unmatched; }
  return out as Word[];
}

/** Align spoken tokens to script tokens (edit distance on normalized forms) and pick what to display. */
export function subtitleWords(script: string, spoken: string, words: Word[], stats?: AlignStats): Word[] {
  const sp = timedSpoken(spoken, words, stats);
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
