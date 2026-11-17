/**
 * Do shot transitions still read as on time to the beat-sync render check? (2026-11-17, for the lens / wave /
 * corner / flash transitions and the dive camera.) Re-times a saved shot plan on its narration (timeShots), reads
 * the rendered video's per-frame scene scores exactly as the beat-sync gate does (src/qa/beatSync.ts changeScores:
 * 30 fps, 320x180) and, for every shot after the first, finds the first visible change (score >= 0.015) inside the
 * gate's band [T - LEAD, T + LAG] around the moment its cue is said (T = shot start + 0.1). Reports per transition.
 *
 *   npx tsx scripts/transition-beat-check.ts --src <work dir with shots.json + narration.json> --video <mp4> [--seconds N]
 *
 * No agent, no network. Exit code 1 if any shot using a new transition misses the band.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { timeShots } from "../src/media/animated.js";
import type { Timeline } from "../src/media/tts.js";
import type { Shot } from "../src/media/vector/shots.js";
import { BEAT_TOLERANCE, changeScores } from "../src/qa/beatSync.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const src = resolve(opt("src") ?? "out/remake-L3"), video = resolve(opt("video") ?? "");
const limit = opt("seconds") ? Number(opt("seconds")) : undefined;
const narration = JSON.parse(readFileSync(resolve(src, "narration.json"), "utf8"));
let tl: Timeline = narration.timeline ?? narration;
let shots: Shot[] = JSON.parse(readFileSync(resolve(src, "shots.json"), "utf8"));
if (limit) {
  const scenes = tl.scenes.filter(s => s.start < limit);
  tl = { duration: Math.min(tl.duration, scenes[scenes.length - 1]?.end ?? limit), scenes };
  const ids = new Set(scenes.map(s => s.id));
  shots = shots.filter(s => ids.has(s.scene_id));
}
const timed = timeShots(shots, tl);
const scores = await changeScores(video, dirname(video));
const CHANGE = 0.015;
const NEW = new Set(["lens", "wave", "corner", "flash"]);
const rows = timed.slice(1).map((s, k) => {
  const T = s.start + 0.1;
  const hit = scores.find(x => x.t >= T - BEAT_TOLERANCE.LEAD && x.t <= T + BEAT_TOLERANCE.LAG && x.s >= CHANGE);
  const peak = Math.max(0, ...scores.filter(x => x.t >= s.start - 0.02 && x.t <= s.start + 0.25).map(x => x.s));
  return { shot: k + 1, start: +s.start.toFixed(2), transition: s.transition, camera: s.camera, firstChange: hit ? +(hit.t - T).toFixed(2) : null, scoreAtStart: +peak.toFixed(3), ok: !!hit };
});
for (const r of rows) console.log(`${r.ok ? "ok  " : "MISS"} shot ${r.shot} @${r.start}s ${r.transition}${r.camera === "dive" ? " (after a dive? see previous)" : ""}: first change ${r.firstChange ?? "none"} s from the cue, peak score ${r.scoreAtStart}`);
const by = new Map<string, { n: number; ok: number; peak: number[] }>();
for (const r of rows) { const b = by.get(r.transition) ?? { n: 0, ok: 0, peak: [] }; b.n++; if (r.ok) b.ok++; b.peak.push(r.scoreAtStart); by.set(r.transition, b); }
console.log("\nper transition: on time / shots, median peak scene score in the first 0.25 s");
for (const [t, b] of by) console.log(`  ${t.padEnd(9)} ${b.ok}/${b.n}  ${b.peak.sort((a, c) => a - c)[Math.floor(b.peak.length / 2)].toFixed(3)}`);
const missNew = rows.filter(r => !r.ok && NEW.has(r.transition));
process.exit(missNew.length ? 1 : 0);
