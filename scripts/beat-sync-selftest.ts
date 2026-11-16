/**
 * Offline self-test of the beat-sync ship gate (src/qa/beatSync.ts) and the snapshot ordering fix
 * (src/qa/visualQa.ts). No media, no network, no agents: `npx tsx scripts/beat-sync-selftest.ts`.
 *
 * Uses a real script (data/queue/2026-11-06 fatigue long-form, 82 beats) with a synthetic narration timeline, the
 * real shot timer (timeShots) and broken variants of the shot plan, audio and snapshot list.
 * The render check needs a real video; test it with `npx tsx src/cli.ts beat-audit <video.mp4> <script.json>`.
 */
import { readFileSync } from "node:fs";
import { timeShots, TimedShot } from "../src/media/animated.js";
import type { Timeline } from "../src/media/tts.js";
import type { Shot } from "../src/media/vector/shots.js";
import { anchorScenes, audioBeats, BeatRow, commonStems, planBeats, renderBeats, titleSpoken } from "../src/qa/beatSync.js";
import { orderSnapshots } from "../src/qa/visualQa.js";

const item = JSON.parse(readFileSync("data/queue/2026-11-06/L1-fatigue-on-tirzepatide-how-often-it-was.json", "utf8"));
const scenes: { id: string; narration: string; on_screen_text: string }[] = item.script.scenes;

// synthetic Chirp-style timeline: 0.15 s breath, 0.36 s per word, 0.4 s pause between scenes
function timeline(): Timeline {
  let t = 0;
  const tl: Timeline = { duration: 0, scenes: [] };
  for (const s of scenes) {
    const start = t, ws = s.narration.split(/\s+/).filter(Boolean);
    const words = ws.map((w, i) => ({ text: w, start: +(start + 0.15 + i * 0.36).toFixed(3), end: +(start + 0.15 + i * 0.36 + 0.3).toFixed(3) }));
    const end = start + 0.15 + ws.length * 0.36;
    tl.scenes.push({ id: s.id, start: +start.toFixed(3), end: +end.toFixed(3), words });
    t = end + 0.4;
  }
  tl.duration = +t.toFixed(3);
  return tl;
}

// a plausible Motion Designer plan: 1 shot per scene, a 2nd shot cued 5 words in for longer scenes
function plan(): Shot[] {
  return scenes.flatMap(s => {
    const ws = s.narration.split(/\s+/);
    const base = { mood: "brand", background: "bokeh", camera: "push-in", transition: "fade", elements: [] } as unknown as Shot;
    const first = { ...base, scene_id: s.id, cue: ws.slice(0, 3).join(" "), title: { style: "headline", text: s.on_screen_text, sub: "", items: [] } } as Shot;
    return ws.length > 14 ? [first, { ...base, scene_id: s.id, cue: ws.slice(5, 8).join(" "), title: { style: "none", text: "", sub: "", items: [] } } as Shot] : [first];
  });
}

const tl = timeline();
const said = (rows: { id: string; said: number | null }[]) => rows.length;
let failed = 0;
function expect(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: ${detail}`);
  if (!ok) failed++;
}
const heard = (shift: number, jitter = 0) => tl.scenes.flatMap((s, k) => s.words.map((w, i) => ({ ...w, start: w.start + shift + (((k * 7 + i) % 5) - 2) * jitter / 2, prob: 0.9 })));

// 1) a correct plan passes
{
  const p = planBeats(scenes, timeShots(plan(), tl), tl);
  expect("correct plan", p.failures.length === 0, `${said(p.rows) - p.off}/${p.rows.length} beats on time${p.failures.length ? `; ${p.failures[0]}` : ""}`);
}
// 2) the feared bug: a Motion Designer batch comes back re-indexed (scenes s31 to s40 labelled s01 to s10);
//    the real planShots then adds fallback shots for s31 to s40
{
  const shots = plan().map(s => {
    const n = Number(s.scene_id.slice(1));
    return n >= 31 && n <= 40 ? { ...s, scene_id: `s${String(n - 30).padStart(2, "0")}` } : s;
  });
  for (let n = 31; n <= 40; n++) shots.push({ ...plan()[0], scene_id: `s${n}`, cue: "", title: { style: "none", text: "", sub: "", items: [] } } as Shot);
  const p = planBeats(scenes, timeShots(shots, tl), tl);
  expect("re-indexed batch is blocked", p.failures.length > 0, p.failures[0] ?? "not caught");
}
// 3) shots placed on a timeline that runs 1 s late (e.g. a stale or mis-measured narration timeline)
{
  const lateTl: Timeline = { ...tl, scenes: tl.scenes.map(s => ({ ...s, start: s.start + 1, end: s.end + 1, words: s.words.map(w => ({ ...w, start: w.start + 1, end: w.end + 1 })) })) };
  const shifted: TimedShot[] = timeShots(plan(), lateTl);
  const p = planBeats(scenes, shifted, tl);
  expect("1 s late shots are blocked", p.failures.length > 0, p.failures[0] ?? "not caught");
}
// 4) 0.2 s late shots stay inside tolerance
{
  const s2: TimedShot[] = timeShots(plan(), tl).map(s => ({ ...s, start: s.start + 0.2 }));
  const p = planBeats(scenes, s2, tl);
  expect("0.2 s late shots pass", p.failures.length === 0, `${p.rows.length - p.off}/${p.rows.length} on time${p.failures[0] ? `; ${p.failures[0]}` : ""}`);
}
// 5) audio: the final mix narration moved 0.6 s is blocked; Whisper jitter of ±0.1 s is not
{
  const texts = scenes.map(s => ({ id: s.id, text: s.narration }));
  const clean = anchorScenes(texts, heard(0));
  const rows = planBeats(scenes, timeShots(plan(), tl), tl).rows;
  const a = audioBeats(rows, anchorScenes(texts, heard(0.6)), clean);
  expect("narration moved 0.6 s is blocked", a.failures.length > 0, a.failures[0] ?? `median ${a.medianShift}`);
  const b = audioBeats(rows, anchorScenes(texts, heard(0, 0.2)), clean);
  expect("Whisper jitter passes", b.failures.length === 0, `median shift ${b.medianShift} s, ${b.anchored} anchored`);
}
// 6) snapshot ordering: 150 HyperFrames-style names come back in time order
{
  const times = Array.from({ length: 150 }, (_, i) => +(i * 2.37 + 1.1).toFixed(2));
  const files = times.map((t, i) => `frame-${String(i).padStart(2, "0")}-at-${Number(t.toFixed(3))}s.png`).sort(); // readdir-ish text order
  const got = orderSnapshots(files, times);
  const wrong = got.filter((f, i) => f !== `frame-${String(i).padStart(2, "0")}-at-${Number(times[i].toFixed(3))}s.png`).length;
  const oldWay = files.filter((f, i) => f !== `frame-${String(i).padStart(2, "0")}-at-${Number(times[i].toFixed(3))}s.png`).length;
  expect("snapshot order", wrong === 0, `${wrong} mislabelled now, ${oldWay} of 150 with the old text sort`);
}
// 2b) the re-indexed batch is still blocked when the gate has each beat's spoken text (the support check must not hide it)
{
  const spokenScenes = scenes.map(s => ({ ...s, spoken: s.narration }));
  const shots = plan().map(s => {
    const n = Number(s.scene_id.slice(1));
    return n >= 31 && n <= 40 ? { ...s, scene_id: `s${String(n - 30).padStart(2, "0")}` } : s;
  });
  for (let n = 31; n <= 40; n++) shots.push({ ...plan()[0], scene_id: `s${n}`, cue: "", title: { style: "none", text: "", sub: "", items: [] } } as Shot);
  const p = planBeats(spokenScenes, timeShots(shots, tl), tl);
  expect("re-indexed batch is blocked with spoken text", p.failures.length > 0, p.failures[0] ?? "not caught");
}

// ------------------------------------------------------------------ 2026-11-17 audio shape, title support, render band
const rnd = (() => { let x = 20261117; return () => ((x = (x * 1103515245 + 12345) >>> 0) / 2 ** 32); })();
/** 76 beats over a 12-minute video, Whisper jitter of +-jitter s (default 0.1), shift(i, t) added on top */
function synth(shift: (i: number, t: number) => number, n = 76, jitter = 0.1) {
  const rows: BeatRow[] = [], heardAt = new Map<string, number | null>(), expAt = new Map<string, number | null>();
  for (let i = 0; i < n; i++) {
    const id = `s${i + 1}`, t = 2 + i * 9.4;
    rows.push({ id, said: t, status: "ok" });
    expAt.set(id, t);
    heardAt.set(id, t + shift(i, t) + (rnd() - 0.5) * 2 * jitter);
  }
  return { rows, heardAt, expAt };
}
const audioCase = (name: string, wantFail: boolean, shift: (i: number, t: number) => number) => {
  const s = synth(shift);
  const a = audioBeats(s.rows, s.heardAt, s.expAt);
  const info = `median ${a.medianShift}, drift ${a.drift}, worst run ${a.worstRun}, ${a.off} outliers`;
  expect(name, wantFail ? a.failures.length > 0 : a.failures.length === 0, a.failures[0] ? `${a.failures[0]} (${info})` : info);
  return a;
};
const T_END = 2 + 75 * 9.4;
audioCase("synthetic: whole track +0.5 s fails", true, () => 0.5);
audioCase("synthetic: stretch to 0.6 s by the end fails", true, (_i, t) => (0.6 * (t - 2)) / (T_END - 2));
audioCase("synthetic: 0.6 s step from beat 40 of 76 fails", true, i => (i >= 39 ? 0.6 : 0));
{
  const bad = new Set<number>(); while (bad.size < 6) bad.add(Math.floor(rnd() * 76));
  const mag = [0.6, -0.75, 0.9, -0.65, 0.8, -0.9];
  const order = [...bad];
  const a = audioCase("synthetic: 6 scattered beats 0.6 to 0.9 s off pass", false, i => (bad.has(i) ? mag[order.indexOf(i)] : 0));
  expect("scattered outliers stay in the report", a.off >= 6 && (a.outliers?.length ?? 0) === a.off, `${a.off} outliers listed: ${a.outliers?.slice(0, 3).join(", ")}`);
}
// the 2026-11-16 L1 pattern: s39 to s45 heard early with s40, s41, s43 fine in between
{
  const cluster: Record<number, number> = { 38: -0.56, 39: -0.3, 40: 0.02, 41: -0.68, 42: 0.02, 43: -0.59, 44: -0.78 };
  audioCase("synthetic: L1 cluster pattern passes", false, i => cluster[i] ?? 0);
}
// a step in the last 3 or 4 beats (a wrong clip length about 40 s before the end), Whisper jitter +-0.2 s, 25 seeded trials
{
  const TRIALS = 25;
  const rates: string[] = [];
  let mustFailMissed = 0;
  for (const size of [0.5, 1.0, 2.0]) for (const last of [3, 4]) {
    let caught = 0;
    for (let k = 0; k < TRIALS; k++) {
      const s = synth(i => (i >= 76 - last ? size : 0), 76, 0.2);
      if (audioBeats(s.rows, s.heardAt, s.expAt).failures.length) caught++;
    }
    if (size >= 1 && caught < TRIALS) mustFailMissed++;
    rates.push(`${size} s on last ${last}: ${caught}/${TRIALS}`);
  }
  expect("synthetic: tail steps of 1.0 and 2.0 s on the last 3 or 4 beats all fail", mustFailMissed === 0, rates.join("; "));
  let falseAlarms = 0;
  for (let k = 0; k < TRIALS; k++) { const s = synth(() => 0, 76, 0.2); if (audioBeats(s.rows, s.heardAt, s.expAt).failures.length) falseAlarms++; }
  expect("synthetic: clean track with +-0.2 s jitter passes", falseAlarms === 0, `${falseAlarms}/${TRIALS} false alarms`);
}
// render: a missing beat in the plan fails; a 0.3 hit rate fails; the band around the timeline counts when Whisper is far off
{
  const shots = timeShots(plan().filter(s => s.scene_id !== "s40"), tl);
  const p = planBeats(scenes.map(s => ({ ...s, spoken: s.narration })), shots, tl);
  expect("synthetic: a missing beat fails", p.failures.length > 0 && p.rows.some(r => r.id === "s40" && r.status === "missing"), p.failures[0] ?? "not caught");
  const rows: BeatRow[] = tl.scenes.map(s => ({ id: s.id, said: s.start + 0.2, heard: s.start + 0.2, status: "ok" }));
  const scores = rows.map((r, i) => ({ t: (r.said as number) - (i % 10 < 3 ? 0.1 : 2.5), s: 0.05 }));
  const rb = renderBeats(rows, scores);
  expect("synthetic: render hit rate 0.3 fails", rb.failures.length > 0, rb.failures[0] ?? `hit rate ${rb.hitRate}`);
  const rows2: BeatRow[] = tl.scenes.map((s, i) => ({ id: s.id, said: s.start + 0.2, heard: s.start + 0.2 + (i % 4 === 0 ? 0.8 : 0), status: "ok" }));
  const rb2 = renderBeats(rows2, rows2.map(r => ({ t: r.said as number, s: 0.05 })));
  expect("render: a cut at the timeline time counts when Whisper hears the beat 0.8 s later", rb2.hitRate !== null && rb2.hitRate > 0.95, `hit rate ${rb2.hitRate}`);
}
// title support: the 2026-11-09 L1 titles against their own narration
{
  const cases: [string, string, boolean][] = [
    ["6–8%", "Add tirzepatide, and it rose to six to eight percent.", true],
    ["Local emergency number", "Call your local emergency number or go to emergency care.", true],
    ["Call your prescriber", "Spreading redness, heat, pus, fever or worsening means calling your prescriber.", true],
    ["Same arm, different results", "Same medicine, different bodies. The trial shows gaps like that between people on the same arm.", true],
    ["80,000 people", "About eighty thousand people took part.", true],
    ["Same or different?", "Is it the same medicine or a different one?", false],
    ["Same dose, different results", "The pen looks the same in a different box.", false],
    ["Kidney function check", "Most people never notice anything at the injection site.", false],
  ];
  const wrong = cases.filter(([t, n, want]) => titleSpoken(t, n) !== want);
  expect("title support rules", wrong.length === 0, wrong.length ? `wrong on: ${wrong.map(c => c[0]).join("; ")}` : `${cases.length} cases`);
}

// ------------------------------------------------------------------ real data: 2026-11-16 L1, L2, L3 and 2026-11-09 L1
interface RealRow { id: string; said: number | null; shown: number | null; heard: number | null; change: number | null }
interface RealVideo {
  reported: { verdict: string; audio: { anchored: number; medianShift: number; off: number }; renderHitRate: number | null };
  scenes: { id: string; on_screen_text: string; narration: string }[]; rows: RealRow[]; extraShots: { scene_id: string; start: number; title: string }[];
}
const real: Record<string, RealVideo> = JSON.parse(readFileSync("scripts/fixtures/beat-sync-real.json", "utf8")).videos;

/**
 * Rebuild the plan inputs from a stored report: each scene's clip starts at its first shot (`shown`, which timeShots
 * puts at the clip start) and its narration starts at `said`; one shot per scene titled with its on-screen text,
 * plus the titled shots the old check flagged (extraShots) at the times its notes gave.
 */
function rebuild(v: RealVideo) {
  const rs = v.rows.filter(r => r.said != null);
  const start = (r: RealRow) => Math.min(r.shown ?? r.said!, r.said!);
  const dur = Math.max(...rs.map(r => r.said!)) + 8;
  const tl: Timeline = { duration: dur, scenes: rs.map((r, i) => ({ id: r.id, start: start(r), end: rs[i + 1] ? start(rs[i + 1]) : dur, words: [{ text: "x", start: r.said!, end: r.said! + 0.3 }] })) };
  const base = { mood: "brand", background: "bokeh", camera: "push-in", transition: "fade", elements: [], cue: "" } as unknown as Shot;
  const text = new Map(v.scenes.map(s => [s.id, s.on_screen_text]));
  const raw: TimedShot[] = tl.scenes.map(s => ({ ...base, scene_id: s.id, start: s.start, end: 0, title: { style: "headline", text: text.get(s.id) ?? "", sub: "", items: [] } }) as TimedShot);
  for (const x of v.extraShots) {
    const same = raw.find(s => s.scene_id === x.scene_id && Math.abs(s.start - x.start) < 0.05);
    if (same) same.title = { ...same.title, text: x.title };
    else raw.push({ ...base, scene_id: x.scene_id, start: x.start, end: 0, title: { style: "headline", text: x.title, sub: "", items: [] } } as TimedShot);
  }
  raw.sort((a, b) => a.start - b.start).forEach((s, i, a) => (s.end = a[i + 1]?.start ?? dur));
  return { tl, shots: raw };
}

/**
 * The stored rows hold `said`, the clean-narration anchor clamped into [clip start, clip start + 0.75], not the raw
 * clean anchor the audio check used. Variant A takes expected = said (exact for unclamped beats). Variant B also
 * moves clamped beats outward (the only side their raw anchor can be on) until the old per-beat rule counts exactly
 * the number of beats it reported: beats it has to clear go to 0.45 s, beats it has to add go to 0.7 s, fewest moves
 * first. The new rules use medians, so the size of a moved beat does not matter, only which beats are outliers.
 */
function expectedVariants(v: RealVideo) {
  const A = new Map<string, number | null>(v.rows.map(r => [r.id, r.said]));
  const heard = new Map<string, number | null>(v.rows.map(r => [r.id, r.heard]));
  const shift = new Map(v.rows.filter(r => r.heard != null && r.said != null).map(r => [r.id, r.heard! - r.said!]));
  const side = (r: RealRow) => (r.shown == null || r.said == null ? 0 : Math.abs(r.said - r.shown) < 0.011 ? -1 : Math.abs(r.said - r.shown - 0.75) < 0.011 ? 1 : 0);
  const B = new Map(A);
  let off = [...shift.values()].filter(s => Math.abs(s) > 0.5).length;
  const target = v.reported.audio.off;
  const clamped = v.rows.filter(r => side(r) !== 0 && shift.has(r.id));
  // raw anchor earlier than said (side -1) makes the shift larger; later (side +1) makes it smaller
  const moveTo = (r: RealRow, s: number) => B.set(r.id, r.heard! - s);
  if (off > target) {
    const can = clamped.filter(r => Math.abs(shift.get(r.id)!) > 0.5 && Math.sign(shift.get(r.id)!) === side(r)).sort((a, b) => Math.abs(shift.get(a.id)!) - Math.abs(shift.get(b.id)!));
    for (const r of can) { if (off <= target) break; moveTo(r, 0.45 * Math.sign(shift.get(r.id)!)); off--; }
  } else if (off < target) {
    const need = (r: RealRow) => 0.5 + side(r) * shift.get(r.id)!;
    const can = clamped.filter(r => Math.abs(shift.get(r.id)!) <= 0.5).sort((a, b) => need(a) - need(b));
    for (const r of can) { if (off >= target) break; moveTo(r, -0.7 * side(r)); off++; }
  }
  return { A, B, heard, reached: off };
}

for (const [name, v] of Object.entries(real)) {
  const { tl: rtl, shots } = rebuild(v);
  const withSpoken = v.scenes.map(s => ({ ...s, spoken: s.narration }));
  const oldPlan = planBeats(v.scenes, shots, rtl);
  const p = planBeats(withSpoken, shots, rtl);
  const flaggedOld = oldPlan.rows.filter(r => r.status === "wrong-content").map(r => r.id);
  expect(`${name} plan`, p.failures.length === 0, `${p.rows.length - p.off}/${p.rows.length} on time; wrong-content without spoken text: [${flaggedOld.join(", ")}], with it: [${p.rows.filter(r => r.status === "wrong-content").map(r => r.id).join(", ")}]${p.failures[0] ? `; ${p.failures[0]}` : ""}`);
  const ev = expectedVariants(v);
  for (const [label, exp] of [["A", ev.A], ["B", ev.B]] as const) {
    const rows = p.rows.map(r => ({ ...r }));
    const a = audioBeats(rows, ev.heard, exp);
    const extra = label === "B" ? `, rebuilt ${ev.reached} outliers vs ${v.reported.audio.off} reported, median ${a.medianShift} vs ${v.reported.audio.medianShift}` : "";
    expect(`${name} audio (${label})`, a.failures.length === 0, `${a.failures[0] ? a.failures[0] + "; " : ""}drift ${a.drift} s, worst run ${a.worstRun} s, ${a.off} outliers${extra}`);
    if (label === "A") {
      const scores = v.rows.filter(r => r.change != null).map(r => ({ t: r.change!, s: 0.05 }));
      const rb = renderBeats(rows, scores);
      expect(`${name} render`, rb.failures.length === 0, `hit rate ${rb.hitRate} (stored ${v.reported.renderHitRate}; scores rebuilt from the stored change times)`);
    }
  }
}
// review 2026-11-17: titles a single-drug video's beat only seems to say must still flag (every number said with
// both range ends and its percent, a number word alone is no support, per-video common words only count in the
// title's own phrase). Each is put on 2026-11-16 L2 s10 with that beat's narration replaced, while the title is
// also s60's on-screen text (5 minutes away).
{
  const v = real["2026-11-16-L2"];
  const common = commonStems(v.scenes.map(s => s.narration));
  const tricky: [string, string][] = [
    ["15% weight loss", "Most people lost weight on it, and 15 percent felt sick in the first weeks."],
    ["6–8% tirzepatide vs 2% placebo", "On tirzepatide, 8 percent stopped early, and some needed two or more dose changes."],
    ["Twenty percent", "Twenty people in the trial, or two percent, left for other reasons."],
  ];
  const s10 = v.rows.find(r => r.id === "s10")!;
  const res = tricky.map(([title, narr]) => {
    const scenes = v.scenes.map(s => (s.id === "s10" ? { ...s, narration: narr } : s.id === "s60" ? { ...s, on_screen_text: title } : s));
    const { tl: rtl, shots } = rebuild({ ...v, scenes, extraShots: [...v.extraShots, { scene_id: "s10", start: +(s10.shown! + 2).toFixed(2), title }] });
    const p = planBeats(scenes.map(s => ({ ...s, spoken: s.narration })), shots, rtl);
    return { title, flagged: p.rows.find(r => r.id === "s10")?.status === "wrong-content", direct: titleSpoken(title, narr, common) };
  });
  expect("look-alike titles in a single-drug video still flag", res.every(r => r.flagged && !r.direct), res.map(r => `"${r.title}" ${r.flagged ? "flagged" : "NOT flagged"}`).join("; "));
  // a common word said in the title's own phrase still counts (s31 "Same arm" vs "people on the same arm"); alone it does not
  const s31 = v.scenes.find(s => s.id === "s31")!.narration;
  expect("common words: phrase counts, lone word does not", common.has("arm") && titleSpoken("Same arm, different results", s31, common)
    && titleSpoken("Same arm", "Each arm got the same dose.") && !titleSpoken("Same arm", "Each arm got the same dose.", common), `common stems in L2: ${[...common].join(", ")}`);
}
// a truly misplaced headline still flags: s10 of 2026-11-09 L1 shows s64's text, which s10 never says
{
  const v = real["2026-11-09-L1"];
  const s10 = v.rows.find(r => r.id === "s10")!, s64 = v.scenes.find(s => s.id === "s64")!;
  const { tl: rtl, shots } = rebuild({ ...v, extraShots: [...v.extraShots, { scene_id: "s10", start: +(s10.shown! + 2).toFixed(2), title: s64.on_screen_text }] });
  const p = planBeats(v.scenes.map(s => ({ ...s, spoken: s.narration })), shots, rtl);
  const flagged = p.rows.filter(r => r.status === "wrong-content");
  expect("misplaced headline still flags", flagged.length === 1 && flagged[0].id === "s10" && p.failures.length > 0, p.failures[0] ?? "not caught");
}
console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
