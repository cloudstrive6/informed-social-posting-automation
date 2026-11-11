/**
 * Local test of the opening craft rules (2026-11-12): frame 0 composed, first-seconds pacing, one text block at a
 * time in Shorts, Shorts caption safe zone, long-form hero size. No paid API and no agent: it re-composes a saved
 * shot plan (shots.json) with its saved narration timeline (narration.json) through the real engine
 * (timeShots + composeAnimated) and measures the composed page with Playwright. `--render` also renders it with
 * HyperFrames and muxes the saved narration.wav onto it.
 *
 *   npx tsx scripts/opening-craft-test.ts --src out/chirp-S2 --out <dir> [--long] [--seconds 65] [--hook "text"] [--render]
 *
 * --src: a work folder from a past production (shots.json + narration.json [+ narration.wav]); --long: horizontal
 * long-form (default: vertical Short); --seconds: only the first N seconds (long videos take long to render).
 * Exit code 1 if a blocking rule fails.
 */
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { composeAnimated, PACING, SHORTS_SAFE, timeShots } from "../src/media/animated.js";
import { ffmpeg } from "../src/media/exec.js";
import { renderComposition } from "../src/media/render.js";
import type { Timeline } from "../src/media/tts.js";
import type { Shot } from "../src/media/vector/shots.js";
import { ensureDir, writeJson } from "../src/lib/fsx.js";
import { frameZeroAudit, keyTimes, layoutAudit, pacingReport, sparseShots } from "../src/qa/visualQa.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const src = resolve(opt("src") ?? "out/chirp-S2");
const out = resolve(ensureDir(opt("out") ?? join("out", "opening-craft-test")));
const vertical = !args.includes("--long");
const limit = opt("seconds") ? Number(opt("seconds")) : undefined;
const W = vertical ? 1080 : 1920, H = vertical ? 1920 : 1080;

const narration = JSON.parse(readFileSync(join(src, "narration.json"), "utf8"));
let tl: Timeline = narration.timeline ?? narration;
let shots: Shot[] = JSON.parse(readFileSync(join(src, "shots.json"), "utf8"));
if (limit) {
  const scenes = tl.scenes.filter(s => s.start < limit);
  const end = Math.min(tl.duration, scenes[scenes.length - 1]?.end ?? limit);
  tl = { duration: end, scenes };
  const ids = new Set(scenes.map(s => s.id));
  shots = shots.filter(s => ids.has(s.scene_id));
}
// captions read what the narrator said; the saved timeline words are exactly that
const captionScenes = vertical ? tl.scenes.map(s => ({ id: s.id, narration: s.words.map(w => w.text).join(" ") })) : undefined;
const hook = opt("hook") ?? tl.scenes[0]?.words.slice(0, 6).map(w => w.text).join(" ");

const timed = timeShots(shots, tl);
const { dir: project, pacing, captionCoverage } = await composeAnimated(join(out, "hf"), timed, tl, { vertical, captionScenes, hook });
const f0 = await frameZeroAudit(project, W, H);
const pace = pacingReport(pacing.changes, vertical, tl.duration);
// the pipeline's own pre-render layout audit, at the Visual Critic's key frames
const layout = [...await layoutAudit(project, keyTimes(timed).map(k => k.t), W, H), ...sparseShots(timed, W, H)];

// sample the composition every 0.1 s: title and caption on screen together? caption boxes inside the safe zone?
// the main character's height in the first 30 s
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.addInitScript("window.__name = (f) => f");
await page.goto(pathToFileURL(join(project, "index.html")).href, { waitUntil: "load" });
await page.waitForFunction(() => !!(window as any).__timelines?.main, null, { timeout: 30_000 });
const sample = await page.evaluate(([D, safe, vertical]) => {
  const vis = (el: Element) => {
    let e: Element | null = el, op = 1;
    while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") return 0; op *= +cs.opacity; e = e.parentElement; }
    return op;
  };
  const both: number[] = [], statBad: { t: number; box: number[] }[] = [], unsafe: { t: number; text: string; box: number[] }[] = [], hero: { t: number; h: number }[] = [];
  let capBottom = 0, capRight = 0, capLeft = 1e9, capTop = 1e9;
  for (let t = 0; t < D; t += 0.1) {
    document.querySelectorAll<HTMLElement>("[data-start]").forEach(el => {
      if (el.id === "root") return;
      const s = +el.dataset.start!, d = +(el.dataset.duration ?? 1e9);
      el.style.visibility = t >= s && t < s + d ? "visible" : "hidden";
    });
    (window as any).__timelines.main.seek(t, false);
    // big-number stats are art (they may share the screen with captions); other title blocks may not
    const titles = [...document.querySelectorAll(".headline,.chips,.label")].filter(el => vis(el) > 0.3);
    for (const el of [...document.querySelectorAll<HTMLElement>(".stat")].filter(el => vis(el) > 0.3)) {
      let x = 0, y = 0, e: HTMLElement | null = el;
      while (e && e.id !== "root") { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent as HTMLElement | null; }
      if (vertical && (x < safe.left - 1 || x + el.offsetWidth > safe.right + 1 || y < safe.top - 1 || y + el.offsetHeight > 1170)) statBad.push({ t: +t.toFixed(1), box: [x, y, x + el.offsetWidth, y + el.offsetHeight] });
    }
    const caps = [...document.querySelectorAll(".cap")].filter(el => vis(el) > 0.3);
    if (titles.length && caps.length) both.push(+t.toFixed(1));
    for (const el of caps as HTMLElement[]) {
      if (vis(el) < 0.95) continue; // mid-pop
      // layout box (ignores the 0.12 s pop overshoot of the scale tween)
      const o = el.offsetParent!.getBoundingClientRect();
      const r = { left: o.left + el.offsetLeft, top: o.top + el.offsetTop, right: o.left + el.offsetLeft + el.offsetWidth, bottom: o.top + el.offsetTop + el.offsetHeight };
      capBottom = Math.max(capBottom, r.bottom); capRight = Math.max(capRight, r.right); capLeft = Math.min(capLeft, r.left); capTop = Math.min(capTop, r.top);
      if (vertical && (r.left < safe.left - 1 || r.right > safe.right + 1 || r.top < safe.top - 1 || r.bottom > safe.bottom + 1)) unsafe.push({ t: +t.toFixed(1), text: (el.textContent ?? "").slice(0, 30), box: [r.left, r.top, r.right, r.bottom].map(Math.round) });
    }
    if (t < 30) {
      const hs = [...document.querySelectorAll(".el")].filter(el => vis(el) > 0.9).map(el => el.getBoundingClientRect().height / innerHeight);
      hero.push({ t: +t.toFixed(1), h: +Math.max(0, ...hs).toFixed(2) });
    }
  }
  return { both, statBad, unsafe, captionBox: [capLeft, capTop, capRight, capBottom].map(Math.round), hero };
}, [tl.duration, SHORTS_SAFE, vertical] as const);
await browser.close();

// per shot starting in the first 30 s: the tallest fully visible element at its best moment (after entrances)
const heroPerShot = timed.filter(s => s.start < 30).map(s => +Math.max(0, ...sample.hero.filter(h => h.t >= s.start && h.t < s.end).map(h => h.h)).toFixed(2));
const minHero30 = heroPerShot.length ? Math.min(...heroPerShot) : 0;
const report = {
  src, project, vertical, duration: tl.duration, shots: timed.length,
  frameZero: f0, pacing: pace, changes: pacing.changes.map(t => +t.toFixed(2)), textWindows: pacing.textWindows, captionCoverage,
  layoutFindings: layout.length, layoutKinds: layout.reduce<Record<string, number>>((a, l) => ({ ...a, [l.kind]: (a[l.kind] ?? 0) + 1 }), {}),
  layoutAtOpening: layout.filter(l => l.t <= 1.2), layout: layout.slice(0, 20),
  titleAndCaptionTogether: sample.both.length, statOutsideItsZone: sample.statBad.slice(0, 5), titleAndCaptionTimes: sample.both.slice(0, 20),
  captionBox: vertical ? sample.captionBox : undefined, captionOutsideSafe: sample.unsafe.slice(0, 10),
  ...(vertical ? {} : { smallestTallestElementFirst30s: minHero30, tallestElementPerShotFirst30s: heroPerShot, rule: `main character >= 35% of height (PACING.long gap ${PACING.long.gap} s)` }),
};
writeJson(join(out, "opening-report.json"), report);
console.log(JSON.stringify(report, null, 1));

if (args.includes("--render")) {
  const silent = await renderComposition(project, join(out, "silent.mp4"));
  const wav = join(src, "narration.wav");
  const final = join(out, vertical ? "short-test.mp4" : "long-test.mp4");
  if (existsSync(wav)) await ffmpeg(["-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-shortest", final]);
  else copyFileSync(silent, final);
  console.log(`rendered ${final}`);
}

const failed = !f0.ok || (vertical && (sample.both.length > 0 || sample.unsafe.length > 0 || sample.statBad.length > 0 || (captionCoverage?.wordShare ?? 1) < 0.95));
if (failed) { console.error("FAIL: a blocking opening rule failed (see report)"); process.exit(1); }
console.log(`OK: ${f0.detail}; ${pace.detail}${captionCoverage ? `; captions ${captionCoverage.captioned}/${captionCoverage.words} words (${Math.round(captionCoverage.wordShare * 100)}%), ${Math.round(captionCoverage.timeShare * 100)}% of speech time` : ""}`);
