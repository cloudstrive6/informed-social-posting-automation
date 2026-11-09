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
import { anchorScenes, audioBeats, planBeats } from "../src/qa/beatSync.js";
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
console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
