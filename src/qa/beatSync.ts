/**
 * Beat-sync ship gate: is every scripted beat on screen when the narrator says it?
 *
 * A "beat" is one script scene. Its narration time is when the narrator starts saying it; its on-screen time is
 * when its first shot takes over the frame. Three independent checks, all without AI:
 *  1. plan   (exact, before render): the timed shot list against the narration word timings. Catches shots
 *            mapped to the wrong scene, re-indexed or merged beats, missing beats, and headlines that belong to
 *            a beat far away.
 *  2. audio  (final file): Whisper on the final mix, aligned to the script, against the timeline the shots were
 *            placed on. Catches a narration track that moved in the mix (offset), stretched (drift) or stepped
 *            (a clip of the wrong length). Single beats off are Whisper noise and only reported.
 *  3. render (final file): a visual change in the rendered video at each beat's narration time. Catches a render
 *            that drifts from its composition. Coarse (it can't read content), so it judges the whole video.
 *
 * Tolerance: a beat may appear up to LEAD s before its first word (the cut lands where the scene's audio clip
 * starts, and each Chirp clip opens with 0.1 to 0.5 s of breath, so a small lead is the design and reads as a
 * normal J-cut) and at most LAG = 0.3 s after it. 0.3 s is about where a picture that lags its words starts to
 * read as late, and it stays above Whisper's word-timing error (~0.1 s). The defect class we were chasing was
 * minutes off, so the gate also flags any single beat more than GROSS s away outright.
 *
 * `npx tsx src/cli.ts beat-audit <video.mp4> <script.json>` runs checks 2 and 3 on any published or local video.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import type { EngineMoves, TimedShot } from "../media/animated.js";
import { run } from "../media/exec.js";
import type { Timeline } from "../media/tts.js";
import { HeardWord, normWords, sameWord } from "./audioQa.js";

export const BEAT_TOLERANCE = { LEAD: 0.75, LAG: 0.3, GROSS: 2.0, AUDIO_SHIFT: 0.3 };
/** Beats outside tolerance before a video fails: 3, or 5% of the beats on a long video. */
const maxOff = (beats: number) => Math.max(3, Math.ceil(beats * 0.05));
/**
 * Audio check shapes (2026-11-17). The narration is one continuous WAV of concatenated clips, mixed with no
 * per-scene delay, trim or tempo change, so one beat cannot move on its own: a lone beat 0.5 to 0.9 s off is
 * Whisper noise. Real defects are a constant offset (median rule), a stretch over time (DRIFT, fitted with a
 * Theil-Sen slope) or a step where one clip's probed duration is wrong and every later beat moves (RUN: most of
 * any RUN_LEN consecutive beats shifted the same way, or STREAK consecutive beats all past STREAK_MIN the same way,
 * which also catches a step in the last few beats). STREAK_MIN: on the 2026-11-09 and 2026-11-16 long videos the
 * worst 3 consecutive same-direction beats were all within 0.16 s, and the worst pair 0.59 s (11-16 L1 s44, s45).
 */
const AUDIO_SHAPE = { DRIFT: 0.3, RUN: 0.4, RUN_LEN: 8, STREAK: 3, STREAK_MIN: 0.6, NOISE: BEAT_TOLERANCE.AUDIO_SHIFT + 0.2 };
/** Share of beats that must show a visual change at their narration time (published in-sync videos measured 0.84 to 0.94; 0.5 s late measured 0.25). */
const MIN_RENDER_HIT = 0.5;
/** ffmpeg scene score that counts as a visible change (99th percentile of all frames is ~0.04; median ~0.0003). */
const CHANGE = 0.015;

export interface BeatRow {
  id: string; on_screen_text?: string;
  /** narration start (s) from the timeline, and from Whisper on the final file */
  said: number | null; heard?: number | null;
  /** when the beat's first shot takes over the frame (plan), and the visual change seen in the render */
  shown?: number | null; change?: number | null;
  /** heard in the final file minus heard in the clean narration (s), kept so later audits can re-fit drift and steps */
  shift?: number | null;
  offset?: number | null; status: "ok" | "early" | "late" | "missing" | "wrong-content" | "unverified"; note?: string;
}
export interface BeatReport {
  verdict: "pass" | "fail"; summary: string; tolerance: typeof BEAT_TOLERANCE;
  plan?: { checked: number; off: number; worst: number | null; failures: string[] };
  /** off and outliers: single beats past Whisper's jitter, information only (they do not fail the video) */
  audio?: { anchored: number; medianShift: number | null; off: number; drift?: number | null; worstRun?: number | null; outliers?: string[]; failures: string[] };
  render?: {
    checked: number; hitRate: number | null; medianOffset: number | null; failures: string[];
    /** long-form: an impulse share between IMPULSE.BLOCK and SHARE_MIN (logged, does not fail the video) */
    warnings?: string[];
    /** long-form: where the picture sits against the plan (s, from the engine's own moves), and frames ignored */
    pictureOffset?: number; maskedFrames?: number;
    /** long-form: share of the engine's impulses visible on their plan frame, and how many there were */
    impulseShare?: number; impulses?: number;
  };
  beats: BeatRow[];
}

const median = (xs: number[]) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return +((s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2).toFixed(3); };
const r2 = (n: number | null | undefined) => (n == null ? null : +n.toFixed(2));
const fmt = (t: number) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}`;

// ------------------------------------------------------------------ 1) plan: timed shots vs word timings
const tokens = (s: string) => new Set(normWords(s ?? "").filter(w => w.length >= 3));
const jaccard = (a: Set<string>, b: Set<string>) => { if (!a.size || !b.size) return 0; let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n); };

/** The shot on top of the frame at time t: shots stack in list order, so it's the last one that has started. */
function topShot(shots: TimedShot[], t: number): number {
  let top = -1;
  for (let i = 0; i < shots.length; i++) if (shots[i].start <= t + 1e-6) top = i;
  return top;
}

/**
 * Narration start of each beat on the timeline: the scene's audio clip start plus the breath before its first word.
 * Whisper sometimes stretches a first word back into the pause before it (seen: "Could" placed 0.8 s early), which
 * no audio can do, so the first-word time is kept inside [clip start, clip start + LEAD].
 */
export function narrationStarts(tl: Timeline, firstWord?: Map<string, number | null>): Map<string, number> {
  return new Map(tl.scenes.map(s => {
    const w = firstWord?.get(s.id) ?? s.words[0]?.start ?? s.start;
    return [s.id, Math.min(s.start + BEAT_TOLERANCE.LEAD, Math.max(s.start, w))];
  }));
}

// a headline its own beat says out loud is in the right place, even if it also echoes a far-away beat's text
const STOP = new Set(["a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "at", "by", "for", "from", "with", "as", "is", "are", "was", "were",
  "be", "been", "it", "its", "it's", "this", "that", "these", "those", "you", "your", "yours", "we", "our", "they", "their", "he", "she", "his", "her",
  "i", "me", "my", "what", "which", "who", "how", "why", "when", "where", "do", "does", "did", "can", "could", "will", "would", "should", "may",
  "might", "if", "so", "than", "then", "there", "here", "not", "no", "vs", "versus", "about", "into", "just", "all", "any", "some", "each", "per"]
  .flatMap(w => normWords(w)));
/** "same" or "different" alone is not support: most comparison headlines contain one of them. */
const WEAK = new Set(["same", "different"].flatMap(w => normWords(w)));
const NUMBERS = new Set(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen",
  "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  "hundred", "thousand", "million", "billion", "half", "quarter"]);
/** Light stemmer so call / calls / calling / called match (applied after normWords, which already spells out digits). */
const stem = (w: string) => {
  let s = w.replace(/'s$/, "");
  if (s.length > 4 && s.endsWith("ies")) s = s.slice(0, -3) + "y";
  else if (s.length > 3 && s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  if (s.length > 5 && s.endsWith("ing")) s = s.slice(0, -3);
  else if (s.length > 4 && s.endsWith("ed")) s = s.slice(0, -2);
  if (s.length > 3 && s.endsWith("e")) s = s.slice(0, -1);
  return s.length > 2 && s[s.length - 1] === s[s.length - 2] ? s.slice(0, -1) : s;
};
/**
 * The numbers in a text as spoken groups: "6-8%" and "six to eight percent" are both "six eight%", "20.9%" is
 * "twenty point nine%", "two or more" is "two". A range needs both ends; "%" binds the number to "percent".
 */
function numberGroups(words: string[]): { groups: string[]; used: Set<number> } {
  const groups: string[] = [], used = new Set<number>();
  for (let i = 0; i < words.length;) {
    if (!NUMBERS.has(words[i])) { i++; continue; }
    const g: string[] = [];
    let j = i;
    while (j < words.length) {
      if (NUMBERS.has(words[j])) { g.push(words[j]); used.add(j); j++; }
      else if (words[j] === "point" && NUMBERS.has(words[j + 1] ?? "")) { g.push("point"); used.add(j); j++; }
      else if ((words[j] === "to" || words[j] === "or") && NUMBERS.has(words[j + 1] ?? "")) { j++; } // a range: "six to eight"
      else break;
    }
    const pct = words[j] === "percent";
    if (pct) used.add(j);
    groups.push(g.join(" ") + (pct ? "%" : ""));
    i = pct ? j + 1 : j;
  }
  return { groups, used };
}

/** Word stems said in more than 25% of a video's beats ("weight", "percent" in a weight-loss video): too common to place a title. */
export function commonStems(spoken: string[]): Set<string> {
  const out = new Set<string>();
  if (spoken.length < 8) return out;
  const df = new Map<string, number>();
  for (const s of spoken) for (const w of new Set(normWords(s).map(stem))) df.set(w, (df.get(w) ?? 0) + 1);
  for (const [w, n] of df) if (n / spoken.length > 0.25) out.add(w);
  return out;
}

/**
 * Is a shot's title spoken in its own beat? Every number in the title is said in the beat (a range with both ends,
 * a percentage as a percentage), and at least 60% of the title's other content words are said there too. A word
 * common across the video only counts when the beat says it in the title's own phrase ("same arm" in "people on the
 * same arm"). A title without numbers also needs 2 matched words, not just "same" / "different"; a number word
 * alone ("two", "one") never counts as word support.
 */
export function titleSpoken(title: string, narration: string, common: Set<string> = new Set()): boolean {
  if (!narration) return false;
  const tw = normWords(title), nw = normWords(narration);
  const tn = numberGroups(tw), nn = numberGroups(nw);
  if (!tn.groups.every(g => nn.groups.includes(g))) return false;
  const seq = tw.filter((w, i) => !tn.used.has(i) && !STOP.has(w));
  if (!seq.length) return tn.groups.length > 0;
  const said = new Set(nw.map(stem));
  const ns = nw.filter(w => !STOP.has(w)).map(stem);
  const pairs = new Set(ns.slice(1).map((w, i) => `${ns[i]} ${w}`));
  const inPhrase = (i: number) => (i > 0 && pairs.has(`${stem(seq[i - 1])} ${stem(seq[i])}`)) || (i + 1 < seq.length && pairs.has(`${stem(seq[i])} ${stem(seq[i + 1])}`));
  const content = [...new Set(seq)];
  const hit = content.filter(w => said.has(stem(w)) && (!common.has(stem(w)) || seq.some((x, i) => x === w && inPhrase(i))));
  if (hit.length / content.length < 0.6) return false;
  return tn.groups.length > 0 || (hit.length >= 2 && hit.some(w => !WEAK.has(w)));
}

export function planBeats(scenes: { id: string; on_screen_text?: string; spoken?: string }[], shots: TimedShot[], tl: Timeline, firstWord?: Map<string, number | null>): { rows: BeatRow[]; failures: string[]; off: number; worst: number | null } {
  const said = narrationStarts(tl, firstWord);
  const titles = shots.map(s => tokens([s.title?.text, s.title?.sub].filter(Boolean).join(" ")));
  const sceneText = scenes.map(s => tokens(s.on_screen_text ?? ""));
  const order = new Map(scenes.map((s, i) => [s.id, i]));
  const rows: BeatRow[] = scenes.map(sc => {
    const t = said.get(sc.id);
    if (t === undefined) return { id: sc.id, on_screen_text: sc.on_screen_text, said: null, status: "unverified", note: "not in the narration timeline" };
    // first moment one of this beat's shots is actually the top shot (a shot buried by the next one at once never shows)
    let shown: number | null = null;
    shots.forEach((s, i) => {
      if (s.scene_id !== sc.id) return;
      const visible = (shots[i + 1]?.start ?? Infinity) - s.start > 0.05;
      if (visible && (shown === null || s.start < shown)) shown = s.start;
    });
    if (shown === null) {
      // timeShots folds shots under 0.8 s into the next one on purpose: only a beat with real airtime counts as lost
      const ti = tl.scenes.findIndex(s => s.id === sc.id);
      const airtime = (tl.scenes[ti + 1]?.start ?? tl.duration) - tl.scenes[ti].start;
      return airtime < 1.5
        ? { id: sc.id, on_screen_text: sc.on_screen_text, said: r2(t), shown: null, status: "unverified", note: `only ${airtime.toFixed(1)} s long, folded into the next shot` }
        : { id: sc.id, on_screen_text: sc.on_screen_text, said: r2(t), shown: null, status: "missing", note: "no shot of this beat ever reaches the screen" };
    }
    const offset = (shown as number) - t;
    const top = topShot(shots, t + 0.2);
    const row: BeatRow = { id: sc.id, on_screen_text: sc.on_screen_text, said: r2(t), shown: r2(shown), offset: r2(offset), status: "ok" };
    if (top >= 0 && shots[top].scene_id !== sc.id && !shots.some((s, i) => s.scene_id === sc.id && i > top)) {
      const later = (order.get(shots[top].scene_id) ?? -1) > (order.get(sc.id) ?? -1);
      row.status = later ? "early" : "late";
      row.note = `when it is said, the screen shows ${shots[top].scene_id} instead`;
    } else if (offset > BEAT_TOLERANCE.LAG) row.status = "late";
    else if (offset < -BEAT_TOLERANCE.LEAD) row.status = "early";
    return row;
  });
  // headline check: a shot whose title is clearly another beat's on-screen text, from far away in the video
  const idx = new Map(scenes.map((s, i) => [s.id, i]));
  const common = commonStems(scenes.map(s => s.spoken ?? "").filter(Boolean));
  shots.forEach((s, i) => {
    const own = idx.get(s.scene_id);
    if (own === undefined || !titles[i].size) return;
    let best = -1, sim = 0;
    sceneText.forEach((st, k) => { const j = jaccard(titles[i], st); if (j > sim) { sim = j; best = k; } });
    const ownSim = jaccard(titles[i], sceneText[own]);
    const far = Math.abs((said.get(scenes[best]?.id) ?? 0) - (said.get(s.scene_id) ?? 0));
    const spokenHere = titleSpoken([s.title?.text, s.title?.sub].filter(Boolean).join(" "), scenes[own].spoken ?? "", common);
    if (best >= 0 && best !== own && sim >= 0.6 && ownSim < 0.34 && far > 30 && !spokenHere) {
      const row = rows[own];
      row.status = "wrong-content";
      row.note = `shot at ${fmt(s.start)} shows "${s.title.text}", which is ${scenes[best].id}'s text (said at ${fmt(said.get(scenes[best].id) ?? 0)})`;
    }
  });
  const bad = rows.filter(r => r.status !== "ok" && r.status !== "unverified");
  const worst = bad.length ? Math.max(...bad.map(r => Math.abs(r.offset ?? 999))) : null;
  const failures: string[] = [];
  const gross = bad.filter(r => r.status === "missing" || r.status === "wrong-content" || Math.abs(r.offset ?? 0) > BEAT_TOLERANCE.GROSS);
  if (gross.length) failures.push(`${gross.length} beat(s) badly off: ${gross.slice(0, 3).map(describe).join("; ")}`);
  else if (bad.length >= maxOff(rows.length)) failures.push(`${bad.length} of ${rows.length} beats outside the band (up to ${BEAT_TOLERANCE.LEAD} s early, ${BEAT_TOLERANCE.LAG} s late): ${bad.slice(0, 3).map(describe).join("; ")}`);
  return { rows, failures, off: bad.length, worst: r2(worst) };
}

function describe(r: BeatRow): string {
  if (r.note) return `${r.id} ${r.note}`;
  if (r.status === "missing") return `${r.id} never shown`;
  return `${r.id} shown at ${fmt(r.shown ?? r.change ?? 0)}, said at ${fmt(r.said ?? r.heard ?? 0)} (${(r.offset ?? 0) > 0 ? "+" : ""}${(r.offset ?? 0).toFixed(2)} s)`;
}

// ------------------------------------------------------------------ 2) audio: where each beat is heard in the final file
/** Align the script's words to Whisper's words (edit-distance alignment) and return each scene's first heard word. */
export function anchorScenes(scenes: { id: string; text: string }[], heard: HeardWord[]): Map<string, number | null> {
  const exp: { w: string; scene: number; first: boolean }[] = [];
  scenes.forEach((s, k) => normWords(s.text).forEach((w, j) => exp.push({ w, scene: k, first: j === 0 })));
  const got: { w: string; t: number }[] = [];
  for (const h of heard) for (const w of normWords(h.text)) got.push({ w, t: h.start });
  const n = exp.length, m = got.length, W = m + 1;
  const d = new Int32Array((n + 1) * W);
  for (let j = 0; j <= m; j++) d[j] = j;
  for (let i = 1; i <= n; i++) {
    d[i * W] = i;
    for (let j = 1; j <= m; j++) {
      const sub = d[(i - 1) * W + j - 1] + (sameWord(exp[i - 1].w, got[j - 1].w) ? 0 : 1);
      d[i * W + j] = Math.min(sub, d[(i - 1) * W + j] + 1, d[i * W + j - 1] + 1);
    }
  }
  const match = new Int32Array(n).fill(-1);
  for (let i = n, j = m; i > 0 && j > 0;) {
    const same = sameWord(exp[i - 1].w, got[j - 1].w);
    if (d[i * W + j] === d[(i - 1) * W + j - 1] + (same ? 0 : 1)) { if (same) match[i - 1] = j - 1; i--; j--; }
    else if (d[i * W + j] === d[(i - 1) * W + j] + 1) i--;
    else j--;
  }
  // a scene's start = its first word if Whisper heard it, else the first of its next 3 words that was heard
  // (minus a typical word length per skipped word); otherwise unknown
  const out = new Map<string, number | null>(scenes.map(s => [s.id, null]));
  for (let i = 0; i < n; i++) {
    if (!exp[i].first) continue;
    for (let k = 0; k < 4 && i + k < n && exp[i + k].scene === exp[i].scene; k++) {
      if (match[i + k] >= 0) { out.set(scenes[exp[i].scene].id, +(got[match[i + k]].t - k * 0.3).toFixed(3)); break; }
    }
  }
  return out;
}

/**
 * Final file vs the timeline the shots were placed on. Both sides are found the same way (Whisper + alignment),
 * one on the clean narration and one on the final mix, so Whisper's habits cancel out and only real moves show.
 */
export function audioBeats(rows: BeatRow[], heardAt: Map<string, number | null>, expectedAt: Map<string, number | null>) {
  const pts: { id: string; t: number; s: number }[] = [];
  for (const r of rows) {
    const h = heardAt.get(r.id), e = expectedAt.get(r.id);
    r.heard = h == null ? null : r2(h);
    r.shift = h == null || e == null ? null : +(h - e).toFixed(3);
    if (h == null || e == null) continue;
    pts.push({ id: r.id, t: e, s: h - e });
  }
  const shifts = pts.map(p => p.s);
  const med = median(shifts);
  const shape = audioShape(pts);
  // single beats past Whisper's jitter: reported, never failed on (one beat cannot move inside one WAV)
  const outliers = pts.filter(p => Math.abs(p.s) > AUDIO_SHAPE.NOISE).map(p => `${p.id} ${p.s > 0 ? "+" : ""}${p.s.toFixed(2)} s`);
  const failures: string[] = [];
  const sign = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}`;
  if (shifts.length < rows.length * 0.6) failures.push(`only ${shifts.length} of ${rows.length} beats could be found in the final audio`);
  else if (med !== null && Math.abs(med) > BEAT_TOLERANCE.AUDIO_SHIFT) failures.push(`the narration in the final file sits ${sign(med)} s from the timeline the shots were placed on`);
  else {
    // a step also tilts the fitted line, so when a step rule fires the summary names the step, not a drift
    const steps: string[] = [];
    if (shape.run && Math.abs(shape.run.value) > AUDIO_SHAPE.RUN) steps.push(`the narration steps ${sign(shape.run.value)} s from the timeline from ${shape.run.from} to ${shape.run.to} (a clip's length is wrong)`);
    if (shape.streak) {
      const { from, to, value, tail } = shape.streak;
      steps.push(`the narration steps ${sign(value)} s from the timeline from ${from} to ${to}${tail ? ", the last beats of the video" : ""} (a clip's length is wrong)`);
    }
    if (steps.length) failures.push(...steps);
    else if (shape.drift !== null && Math.abs(shape.drift) > AUDIO_SHAPE.DRIFT) failures.push(`the narration in the final file drifts ${sign(shape.drift)} s from the timeline over the video`);
  }
  return { anchored: shifts.length, medianShift: med, off: outliers.length, drift: shape.drift, worstRun: shape.run ? +shape.run.value.toFixed(3) : null, outliers, failures };
}

/**
 * Drift: Theil-Sen slope of shift against time (median of all pairwise slopes, unmoved by a few wild beats) times the
 * span of the video. Run: over every RUN_LEN consecutive anchored beats, the middle value nearer zero, so a window only
 * counts as shifted when most of its beats agree (5 of 8 past the threshold, the same way). A step leaves every later
 * window fully shifted; Whisper scatter, even a cluster of 4 bad beats with good ones between, does not.
 * Streak: STREAK or more consecutive anchored beats all past STREAK_MIN the same way. Catches a step too close to the
 * end for a full window (a wrong clip length 40 s before the end); flagged as the tail when it reaches the last beat.
 */
export function audioShape(pts: { id: string; t: number; s: number }[]): {
  drift: number | null; run: { from: string; to: string; value: number } | null;
  streak: { from: string; to: string; value: number; length: number; tail: boolean } | null;
} {
  let drift: number | null = null;
  if (pts.length >= 6) {
    const slopes: number[] = [];
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dt = pts[j].t - pts[i].t;
      if (Math.abs(dt) > 1) slopes.push((pts[j].s - pts[i].s) / dt);
    }
    const ts = pts.map(p => p.t);
    const m = median(slopes.map(x => x * 1e3)); // median() rounds to 3 places; scale so slow slopes survive
    drift = m === null ? null : +((m / 1e3) * (Math.max(...ts) - Math.min(...ts))).toFixed(3);
  }
  let run: { from: string; to: string; value: number } | null = null;
  const n = AUDIO_SHAPE.RUN_LEN;
  for (let i = 0; i + n <= pts.length; i++) {
    const w = pts.slice(i, i + n).map(p => p.s).sort((a, b) => a - b);
    const lo = w[(n - 1) >> 1], hi = w[n >> 1];
    const value = lo > 0 ? lo : hi < 0 ? hi : 0; // the middle value nearer zero (0 when the middle straddles it)
    if (!run || Math.abs(value) > Math.abs(run.value)) run = { from: pts[i].id, to: pts[i + n - 1].id, value };
  }
  // streaks of consecutive beats past STREAK_MIN the same way; keep the longest (the one at the end on a tie)
  let streak: { from: string; to: string; value: number; length: number; tail: boolean } | null = null;
  for (let i = 0; i < pts.length;) {
    const dir = Math.sign(pts[i].s);
    let j = i;
    while (j < pts.length && Math.abs(pts[j].s) > AUDIO_SHAPE.STREAK_MIN && Math.sign(pts[j].s) === dir) j++;
    const len = j - i;
    if (len >= AUDIO_SHAPE.STREAK && (!streak || len >= streak.length)) {
      const vals = pts.slice(i, j).map(p => p.s);
      streak = { from: pts[i].id, to: pts[j - 1].id, value: +(median(vals) ?? 0).toFixed(3), length: len, tail: j === pts.length };
    }
    i = Math.max(j, i + 1);
  }
  return { drift, run, streak };
}

// ------------------------------------------------------------------ 3) render: visual changes in the final file
/** Per-frame scene-change scores (30 fps, downscaled). About 25 s for a 12-minute 1080p60 video. */
export async function changeScores(video: string, workDir: string): Promise<{ t: number; s: number }[]> {
  const file = "qa-scene-scores.txt"; // relative: a Windows drive letter would break the filter syntax
  await run("ffmpeg", ["-hide_banner", "-nostats", "-loglevel", "error", "-y", "-i", video, "-an", "-vf",
    `fps=30,scale=320:180,select='gte(scene,0)',metadata=print:key=lavfi.scene_score:file=${file}`, "-f", "null", "-"], { quiet: true, cwd: workDir });
  const out: { t: number; s: number }[] = [];
  let t = 0;
  for (const line of readFileSync(join(workDir, file), "utf8").split("\n")) {
    const a = /pts_time:([\d.]+)/.exec(line); if (a) { t = +a[1]; continue; }
    const b = /scene_score=([\d.]+)/.exec(line); if (b) out.push({ t, s: +b[1] });
  }
  return out;
}

/** The engine's moves for the render check: what it moves itself, its sure impulses, and every cut (plan times). */
export interface EngineTrack extends EngineMoves { cuts: number[] }

/**
 * Engine impulse check (long-form, 2026-11-17 review). The engine's sure impulses (quick camera punches, and every cut
 * but a fade) have exact plan times. Share with a visible change in [-0.1, +0.35] s of their plan time, measured on
 * three 120 s renders (70 to 77 impulses each): in sync 1.00, 0.25 s late 0.96 (passes by design, inside the beat
 * band's 0.3 s lag), 0.5 s late 0.01 to 0.03, 1.0 s late 0.23 to 0.26, 2.0 s late 0.31 to 0.51, a 0 to 1 s drift
 * 0.34 to 0.39. SHARE_MIN 0.75 sits between them with about 0.2 of margin on each side.
 * First weeks (independent review, 2026-11-17): the in-sync sample is only two narrations and a false drop costs about
 * 2.3 h, so a share under BLOCK (0.6) fails the video, and a share from 0.6 to SHARE_MIN fails only when a second
 * signal agrees (pictureOffset found the picture shifted; in sync it stays 0), else it warns. Every late or drifting
 * test copy scored 0.51 or less or found a shift, so all of them still fail. Raise BLOCK to SHARE_MIN once live in-sync
 * videos have shown their shares (qa.beatSync.render.impulseShare in each report).
 */
export const IMPULSE = { MIN: 20, FROM: -0.1, TO: 0.35, SHARE_MIN: 0.75, BLOCK: 0.6, OFFSET_SHARE: 0.8, SEARCH: 3 };

const strongTimes = (scores: { t: number; s: number }[]) => scores.filter(x => x.s >= CHANGE).map(x => x.t).sort((a, b) => a - b);
const anyIn = (strong: number[], a: number, b: number) => {
  let lo = 0, hi = strong.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (strong[m] < a) lo = m + 1; else hi = m; }
  return lo < strong.length && strong[lo] <= b;
};

/** Share of the engine's impulses with a visible change in [p + d + FROM, p + d + TO] (d: picture offset tried). */
export function impulseShare(scores: { t: number; s: number }[], impulses: number[], d = 0, strong = strongTimes(scores)): number {
  if (!impulses.length) return 1;
  return impulses.reduce((n, p) => n + (anyIn(strong, p + d + IMPULSE.FROM, p + d + IMPULSE.TO) ? 1 : 0), 0) / impulses.length;
}

/**
 * Where the rendered picture sits against the plan (s, positive = late), from the engine's sure impulses: the offset
 * at which most of them line up with a visible change, searched over +-3 s in 1/30 s steps on a tight window. A
 * non-zero offset is used only when its own impulse share (wide window) is IMPULSE.OFFSET_SHARE or more and it
 * clearly beats 0; otherwise 0 (the review found a 2 s late picture locking onto -0.53 s on the cut rhythm).
 */
export function pictureOffset(scores: { t: number; s: number }[], impulses: number[]): number {
  if (impulses.length < 6) return 0;
  const strong = strongTimes(scores);
  const hits = (d: number) => impulses.reduce((n, p) => n + (anyIn(strong, p + d - 0.05, p + d + 0.1) ? 1 : 0), 0);
  const base = hits(0), K = Math.round(IMPULSE.SEARCH * 30);
  const all = Array.from({ length: 2 * K + 1 }, (_, k) => ({ d: (k - K) / 30, h: hits((k - K) / 30) }));
  const bestHits = Math.max(...all.map(x => x.h));
  if (!(bestHits >= base * 1.25 && bestHits - base >= 4)) return 0;
  // the matching window is 0.15 s wide, so the best offsets form a plateau: take the middle of the plateau nearest 0
  const top = all.filter(x => x.h === bestHits).sort((a, b) => Math.abs(a.d) - Math.abs(b.d));
  const run = top.filter(x => Math.abs(x.d - top[0].d) <= 0.2 && Math.sign(x.d) === Math.sign(top[0].d)).map(x => x.d).sort((a, b) => a - b);
  const d = +((run[0] + run[run.length - 1]) / 2).toFixed(3);
  return impulseShare(scores, impulses, d, strong) >= IMPULSE.OFFSET_SHARE ? d : 0;
}

/**
 * Long-form videos move on their own (2026-11-17 pacing engine: camera punches and pushes, hero hops and turns,
 * dives into the next shot). Those are not cuts: counted as "a change when the beat is said", they let a video
 * whose picture runs 0.5 s late still pass (review model: hit rate 0.71 at +0.5 s, pass level 0.5). So frames
 * inside an engine move (+-0.12 s), placed where the picture actually sits (pictureOffset), are ignored; frames
 * within 0.1 s of a cut never are.
 */
export function maskEngineMoves(scores: { t: number; s: number }[], engine: EngineTrack): { scores: { t: number; s: number }[]; offset: number; masked: number } {
  const offset = pictureOffset(scores, engine.impulses);
  const cuts = engine.cuts.map(c => c + offset);
  const keep = scores.filter(x => cuts.some(c => x.t >= c - 0.05 && x.t <= c + 0.1) || !engine.moves.some(([a, b]) => x.t >= a + offset - 0.12 && x.t <= b + offset + 0.12));
  return { scores: keep, offset, masked: scores.length - keep.length };
}

export function renderBeats(rows: BeatRow[], allScores: { t: number; s: number }[], engine?: EngineTrack) {
  // long-form: the engine's own impulses must land on their plan times (catches late and drifting pictures that the
  // per-beat band can miss: 2 s late, or a slow drift)
  const impulses = engine?.impulses.length ?? 0;
  const share0 = engine && impulses >= IMPULSE.MIN ? +impulseShare(allScores, engine.impulses).toFixed(2) : undefined;
  const masked = engine?.moves.length ? maskEngineMoves(allScores, engine) : undefined;
  const scores = masked?.scores ?? allScores;
  const at = (r: BeatRow) => r.heard ?? r.said;
  const offsets: number[] = [];
  let checked = 0, hits = 0;
  for (const r of rows) {
    const T = at(r);
    if (T == null || T < 0.5) continue; // the opening shot has no cut to find
    checked++;
    // first visible change inside the tolerance band; when Whisper's heard time and the timeline disagree by more
    // than 0.5 s, the band around the timeline time counts too (the picture follows the timeline, and a lone beat
    // that far off is Whisper noise, see audioBeats)
    const refs = r.heard != null && r.said != null && Math.abs(r.heard - r.said) > 0.5 ? [T, r.said] : [T];
    let inBand: { t: number; s: number } | undefined, ref = T;
    for (const R of refs) {
      inBand = scores.find(x => x.t >= R - BEAT_TOLERANCE.LEAD && x.t <= R + BEAT_TOLERANCE.LAG && x.s >= CHANGE);
      if (inBand) { ref = R; break; }
    }
    if (inBand) { hits++; r.change = r2(inBand.t); offsets.push(inBand.t - ref); continue; }
    // otherwise the nearest strong change within 3 s, for the report
    const near = scores.filter(x => Math.abs(x.t - T) <= 3 && x.s >= CHANGE * 2).sort((a, b) => Math.abs(a.t - T) - Math.abs(b.t - T))[0];
    r.change = near ? r2(near.t) : null;
    if (r.status === "ok" || r.status === "unverified") { r.status = "unverified"; r.note ??= near ? `no cut when said; nearest change ${(near.t - T > 0 ? "+" : "")}${(near.t - T).toFixed(2)} s` : "no visible change near it"; }
  }
  const hitRate = checked ? +(hits / checked).toFixed(2) : null;
  const failures: string[] = [];
  if (hitRate !== null && checked >= 5 && hitRate < MIN_RENDER_HIT) failures.push(`only ${Math.round(hitRate * 100)}% of beats get a visual change when they're said (published in-sync videos: 84 to 94%); the picture has drifted from the narration`);
  const warnings: string[] = [];
  if (share0 !== undefined && share0 < IMPULSE.SHARE_MIN) (share0 < IMPULSE.BLOCK || (masked?.offset ?? 0) !== 0 ? failures : warnings).push(`only ${Math.round(share0 * 100)}% of the engine's ${impulses} camera punches and cuts show on their planned frame (in-sync renders: about 96%); the picture runs late or drifts from the plan`);
  return {
    checked, hitRate, medianOffset: median(offsets), failures, ...(warnings.length ? { warnings } : {}),
    ...(masked ? { pictureOffset: masked.offset, maskedFrames: masked.masked } : {}), ...(share0 !== undefined ? { impulseShare: share0, impulses } : {}),
  };
}

// ------------------------------------------------------------------ the gate
export interface BeatGateInput {
  scenes: { id: string; on_screen_text?: string; spoken: string }[];
  video: string; workDir: string;
  /** pipeline only: the timeline the shots were placed on and the timed shots */
  tl?: Timeline; shots?: TimedShot[];
  /** Whisper words of the final file (the pipeline already has them from the mix check) */
  heard?: HeardWord[];
  /** Whisper words of the clean narration (from the narration check) */
  clean?: HeardWord[];
  /** long-form: the engine's own moves (composeAnimated pacing.engine), ignored by the render check */
  engine?: EngineMoves;
}

export async function beatSyncGate(v: BeatGateInput): Promise<BeatReport> {
  const report: BeatReport = { verdict: "pass", summary: "", tolerance: BEAT_TOLERANCE, beats: [] };
  const texts = v.scenes.map(s => ({ id: s.id, text: s.spoken }));
  const cleanAt = v.clean?.length ? anchorScenes(texts, v.clean) : undefined;
  let rows: BeatRow[];
  if (v.tl && v.shots) {
    const p = planBeats(v.scenes, v.shots, v.tl, cleanAt);
    rows = p.rows;
    report.plan = { checked: rows.length, off: p.off, worst: p.worst, failures: p.failures };
  } else {
    rows = v.scenes.map(s => ({ id: s.id, on_screen_text: s.on_screen_text, said: null, status: "ok" as const }));
  }
  if (v.heard?.length) {
    const heardAt = anchorScenes(texts, v.heard);
    if (v.tl) {
      const expected = cleanAt ?? new Map(v.tl.scenes.map(s => [s.id, s.words[0]?.start ?? null] as [string, number | null]));
      report.audio = audioBeats(rows, heardAt, expected);
    } else for (const r of rows) { const h = heardAt.get(r.id); r.heard = h == null ? null : r2(h); if (r.heard == null) r.status = "unverified"; }
  }
  try {
    const scores = await changeScores(v.video, v.workDir);
    const engine = v.engine?.moves.length ? { ...v.engine, cuts: (v.shots ?? []).slice(1).map(s => s.start) } : undefined;
    report.render = renderBeats(rows, scores, engine);
    for (const w of report.render.warnings ?? []) log.warn(`beat sync (warning only): ${w}`);
    if (!v.shots) for (const r of rows) if (r.change != null && (r.heard ?? r.said) != null && r.status === "ok") r.offset = r2(r.change - (r.heard ?? r.said)!);
  } catch (e) {
    log.warn(`beat sync: render check skipped (${(e as Error).message.slice(0, 200)})`);
  }
  report.beats = rows;
  const failures = [...(report.plan?.failures ?? []), ...(report.audio?.failures ?? []), ...(report.render?.failures ?? [])];
  report.verdict = failures.length ? "fail" : "pass";
  const bits = [
    report.plan && `plan ${report.plan.checked - report.plan.off}/${report.plan.checked} beats on time`,
    report.audio && `audio shift ${report.audio.medianShift ?? "n/a"} s`,
    report.render && `render ${report.render.hitRate === null ? "n/a" : Math.round(report.render.hitRate * 100) + "%"} of beats cut on time`,
  ].filter(Boolean);
  report.summary = `beat sync ${report.verdict.toUpperCase()}: ${bits.join(", ")}${failures.length ? `. ${failures.join(". ")}` : ""}`;
  return report;
}

/** Text for qa.blocking. Starts with "beat sync", which the Editor-in-Chief treats as a hard block. */
export const beatBlocking = (r: BeatReport) => (r.verdict === "fail" ? [`beat sync: beats drift from the narration (${r.summary.replace(/^beat sync FAIL: /, "").slice(0, 400)})`] : []);

// ------------------------------------------------------------------ CLI: audit any video against its script
export async function beatAudit(video: string, scriptFile: string, wordsFile?: string): Promise<BeatReport> {
  const script = JSON.parse(readFileSync(scriptFile, "utf8")) as { scenes: { id: string; narration: string; on_screen_text: string }[] };
  const dir = dirname(video);
  let heard: HeardWord[];
  if (wordsFile && existsSync(wordsFile)) heard = JSON.parse(readFileSync(wordsFile, "utf8")).words;
  else {
    const { transcribe } = await import("./audioQa.js");
    const { ffmpeg } = await import("../media/exec.js");
    const wav = join(dir, `${basename(video, ".mp4")}-audit.wav`);
    await ffmpeg(["-i", video, "-vn", "-ac", "1", "-ar", "16000", wav]);
    heard = await transcribe(wav, join(dir, `${basename(video, ".mp4")}-audit-words.json`));
  }
  const report = await beatSyncGate({ scenes: script.scenes.map(s => ({ id: s.id, on_screen_text: s.on_screen_text, spoken: s.narration })), video, workDir: dir, heard });
  writeJson(join(dir, `${basename(video, ".mp4")}-beats.json`), report);
  return report;
}
