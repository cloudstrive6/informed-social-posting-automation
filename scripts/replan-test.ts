/**
 * Re-plan a saved video's shots with the CURRENT Motion Designer prompt (one real agent call per 10 scenes), so a
 * prompt change can be tested with scripts/opening-craft-test.ts before it reaches production.
 *
 *   npx tsx scripts/replan-test.ts --item data/queue/<date>/<id>.json --src out/<work> --out <dir> [--seconds 120] [--short]
 *
 * --item: the queue item that holds the script; --src: its work folder (narration.json [+ narration.wav]).
 * Writes <out>/shots.json, and copies narration.json and narration.wav, so <out> works as a --src folder.
 */
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { planShots } from "../src/media/motionPlan.js";
import type { Timeline } from "../src/media/tts.js";
import type { Scene } from "../src/lib/schemas.js";
import { ensureDir, writeJson } from "../src/lib/fsx.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const item = JSON.parse(readFileSync(resolve(opt("item")!), "utf8"));
const src = resolve(opt("src")!);
const out = resolve(ensureDir(opt("out") ?? join("out", "replan-test")));
const limit = opt("seconds") ? Number(opt("seconds")) : undefined;
const vertical = args.includes("--short");

const narration = JSON.parse(readFileSync(join(src, "narration.json"), "utf8"));
const tl: Timeline = narration.timeline ?? narration;
const keep = new Set(tl.scenes.filter(s => limit === undefined || s.start < limit).map(s => s.id));
const scenes: Scene[] = (item.script?.scenes ?? []).filter((s: Scene) => keep.has(s.id));
if (!scenes.length) throw new Error("no script scenes match the timeline");
const topic = item.plan?.topic ?? item.script?.working_title ?? "health explainer";

const t0 = Date.now();
const shots = await planShots(scenes, tl, vertical, topic);
writeJson(join(out, "shots.json"), shots);
copyFileSync(join(src, "narration.json"), join(out, "narration.json"));
if (existsSync(join(src, "narration.wav"))) copyFileSync(join(src, "narration.wav"), join(out, "narration.wav"));
const secs = tl.scenes.filter(s => keep.has(s.id));
const span = Math.min(limit ?? tl.duration, tl.duration);
console.log(JSON.stringify({ scenes: scenes.length, shots: shots.length, seconds: span, secondsPerShot: +(span / shots.length).toFixed(2), planMinutes: +((Date.now() - t0) / 60000).toFixed(1), lastSceneStart: secs[secs.length - 1]?.start }));
