/**
 * The beat-sync gate's RENDER check on a test render (2026-11-17): the old gate (every beat needs a visible change
 * when it is said) against the new long-form gate (the engine's own moves ignored, and its impulses must land on
 * their plan frames). Use it to show an in-sync render passes and a late or drifting one fails.
 *
 *   npx tsx scripts/beat-render-check.ts --src <work dir: shots.json + narration.json> --video <mp4> [--html <index.html>]
 *     [--seconds N] [--shift S | --drift D]
 *
 * Beats are the narration's scenes, said at their first word (narrationStarts, as the pipeline). The engine's moves:
 * the plan is re-composed with the current engine (composeAnimated pacing.engine, as production uses them); if that
 * composition differs from the one the video was rendered from (<video dir>/hf/index.html or --html, e.g. a render
 * made by an earlier engine version), the moves are read from the rendered composition instead, with every tween's
 * own durations. --shift S checks a copy whose picture is S s late (ffmpeg -itsoffset, audio kept); --drift D one
 * whose picture slides from 0 to D s late over its length (re-encoded). No agent, no network.
 */
import { existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { ffmpeg, probeDuration } from "../src/media/exec.js";
import { composeAnimated, timeShots } from "../src/media/animated.js";
import type { Timeline } from "../src/media/tts.js";
import type { Shot } from "../src/media/vector/shots.js";
import { BeatRow, changeScores, EngineTrack, narrationStarts, renderBeats } from "../src/qa/beatSync.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const src = resolve(opt("src") ?? "out/replan-L3-120");
let video = resolve(opt("video") ?? "");
const limit = opt("seconds") ? Number(opt("seconds")) : undefined;
const shift = opt("shift") ? Number(opt("shift")) : 0, drift = opt("drift") ? Number(opt("drift")) : 0;
const htmlFile = resolve(opt("html") ?? join(dirname(video), "hf", "index.html"));
const html = readFileSync(htmlFile, "utf8");

const narration = JSON.parse(readFileSync(join(src, "narration.json"), "utf8"));
let tl: Timeline = narration.timeline ?? narration;
let shots: Shot[] = JSON.parse(readFileSync(join(src, "shots.json"), "utf8"));
if (limit) {
  const scenes = tl.scenes.filter(s => s.start < limit);
  tl = { duration: Math.min(tl.duration, scenes[scenes.length - 1]?.end ?? limit), scenes };
  const ids = new Set(scenes.map(s => s.id));
  shots = shots.filter(s => ids.has(s.scene_id));
}
const timed = timeShots(shots, tl);

/** The engine's moves as a rendered composition contains them (plan times, each tween's own durations). */
function engineFromHtml(page: string): EngineTrack {
  const moves: [number, number][] = [], impulses: number[] = [];
  const durOf = (tween: string) => [...tween.matchAll(/duration:([\d.]+)/g)].reduce((a, m) => a + +m[1], 0);
  for (const m of page.matchAll(/tl\.fromTo\("#pn\d+",\{scale:[\d.]+\},\{scale:[\d.]+,duration:([\d.]+)[^}]*\},([\d.]+)\)/g)) {
    const d = +m[1], t = +m[2];
    moves.push([t, t + d]);
    if (d < 0.3) impulses.push(t);
  }
  for (const m of page.matchAll(/tl\.(?:to|fromTo)\("#el\d+r",(.*?)\},([\d.]+)\);/g)) moves.push([+m[2], +m[2] + durOf(m[1])]);
  for (const m of page.matchAll(/tl\.to\("#cam\d+",\{scale:2\.5,duration:([\d.]+)[^}]*\},([\d.]+)\)/g)) moves.push([+m[2], +m[2] + +m[1] - 0.05]);
  const fades = new Set([...page.matchAll(/tl\.fromTo\("#(shot\d+)",\{opacity:0\},\{opacity:1,duration:0\.55/g)].map(m => m[1]));
  const starts = [...page.matchAll(/id="(shot\d+)" class="clip shot[^"]*" data-start="([\d.]+)"/g)].map(m => ({ id: m[1], t: +m[2] })).filter(s => s.t > 0.05);
  impulses.push(...starts.filter(s => !fades.has(s.id)).map(s => s.t));
  return { moves: moves.sort((a, b) => a[0] - b[0]), impulses: impulses.sort((a, b) => a - b), cuts: starts.map(s => s.t) };
}

// production engine moves when the current engine reproduces the rendered composition exactly
const tmp = join(tmpdir(), `beat-render-check-${process.pid}`);
const hook = tl.scenes[0]?.words.slice(0, 6).map(w => w.text).join(" ");
const comp = await composeAnimated(tmp, timed, tl, { vertical: false, hook });
const same = readFileSync(join(tmp, "index.html"), "utf8") === html;
rmSync(tmp, { recursive: true, force: true });
const engine: EngineTrack = same ? { ...comp.pacing.engine, cuts: timed.slice(1).map(s => s.start) } : engineFromHtml(html);

if (shift) {
  const late = join(dirname(video), `${basename(video, ".mp4")}-late${shift}.mp4`);
  if (!existsSync(late)) await ffmpeg(["-i", video, "-itsoffset", String(shift), "-i", video, "-map", "1:v", "-map", "0:a", "-c", "copy", late]);
  video = late;
} else if (drift) {
  const out = join(dirname(video), `${basename(video, ".mp4")}-drift${drift}.mp4`);
  const D = await probeDuration(video);
  if (!existsSync(out)) await ffmpeg(["-i", video, "-an", "-vf", `setpts=PTS*${(1 + drift / D).toFixed(6)}`, "-c:v", "libx264", "-preset", "ultrafast", "-crf", "16", out]);
  video = out;
}
const said = narrationStarts(tl);
const rows = (): BeatRow[] => tl.scenes.map(s => ({ id: s.id, said: said.get(s.id) ?? null, status: "ok" as const }));
const scores = await changeScores(video, dirname(video));
const oldGate = renderBeats(rows(), scores);
const newGate = renderBeats(rows(), scores, engine);
console.log(JSON.stringify({
  video: basename(video), engineSource: same ? "composeAnimated" : "rendered html", beats: tl.scenes.length, engineMoves: engine.moves.length, impulses: engine.impulses.length,
  oldGate: { hitRate: oldGate.hitRate, verdict: oldGate.failures.length ? "FAIL" : "pass" },
  newGate: { hitRate: newGate.hitRate, impulseShare: newGate.impulseShare, pictureOffset: newGate.pictureOffset, verdict: newGate.failures.length ? "FAIL" : "pass", failures: newGate.failures.map(f => f.slice(0, 60)) },
}));
