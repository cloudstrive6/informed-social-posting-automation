/**
 * Self-test of the long-form pacing engine (2026-11-17): animated stat numbers, typewriter titles, the new
 * transitions and dive camera, the idle-motion floor, whole-video pacing and the plan pacing gate.
 * No paid API, no agent, no render: `npx tsx scripts/pace-selftest.ts`.
 *
 *  1. pure functions: count-up steps (format kept, last step exactly the planned text), count vs pop, typewriter
 *     markup, plan pacing and its revision list, the post-render pace parser;
 *  2. a synthetic long plan composed by the real engine (timeShots + composeAnimated), then seeked in Chromium:
 *     every stat ends on exactly its planned text, the typed headline ends complete, flash never lands on a sombre
 *     beat, engine camera moves cover the whole video and keep clear of cuts, the dive ends zoomed in.
 * Exit code 1 on any failure.
 */
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { composeAnimated, countable, countSteps, DOSING, PACING, statTokens, timeShots, typedHtml } from "../src/media/animated.js";
import type { Timeline } from "../src/media/tts.js";
import type { Shot, ShotElement } from "../src/media/vector/shots.js";
import { paceFromScores, pacingRevisions, planPacing } from "../src/qa/visualQa.js";

let fails = 0;
const check = (ok: boolean, what: string) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails++; };

// ---------------------------------------------------------------- 1) pure functions
// stat texts from real plans (2026-11 long and Short), plus the 2026-11-17 review's cases. Only numbers attached to
// "%", "×" or a trailing "x" (and the low end of such a range) count; every other number never changes mid-count
const stats = ["12.8–14.4%", "2×", "3,000+", "72 weeks", "~12% vs ~1%", "Up to 83%", "Up to 13.6%", "8.9–13.6%", "~15% vs <10%",
  "~140–170", "2+ days", "80,000+", "+58%", "1 in 3", "1,234,567", "0.5 mg", "2024", "-3.1%", "25-29% vs 8%", "100%",
  "Phase 3: 68%", "Type 2 diabetes: 1 in 3", "120/80 mmHg", "COVID-19 cut visits 40%", "2.5 mg vs 15 mg", "SURMOUNT-1: 20.9%", "<6%",
  "3x more likely", "1.5x", "250 mcg", "10 IU", "STEP 1: 14.9%", "2023: 45%", "5 µg/ml", "8.9 to 13.6%"];
// what counts (the rest pops or stays put): [text, numbers that count]
const counting: [string, string[]][] = [
  ["12.8–14.4%", ["12.8", "14.4"]], ["Phase 3: 68%", ["68"]], ["Type 2 diabetes: 1 in 3", []], ["120/80 mmHg", []],
  ["COVID-19 cut visits 40%", ["40"]], ["2.5 mg vs 15 mg", []], ["SURMOUNT-1: 20.9%", ["20.9"]], ["<6%", []], ["~15% vs <10%", ["15"]],
  ["3x more likely", ["3"]], ["1.5x", ["1.5"]], ["250 mcg", []], ["10 IU", []], ["STEP 1: 14.9%", ["14.9"]], ["2023: 45%", ["45"]],
  ["3,000+", []], ["72 weeks", []], ["25-29% vs 8%", ["25", "29", "8"]], ["8.9 to 13.6%", ["8.9", "13.6"]], ["5 µg/ml", []],
];
for (const [s, want] of counting) {
  const got = statTokens(s).filter(t => t.counts).map(t => t.raw);
  check(JSON.stringify(got) === JSON.stringify(want), `"${s}": counts ${want.length ? want.join(", ") : "nothing"} (got ${got.join(", ") || "nothing"})`);
}
for (const s of stats) {
  const steps = countSteps(s, 20);
  check(steps.length === 21 && steps[20] === s, `count "${s}" ends exactly on the planned text`);
  const toks = statTokens(s);
  check(statTokens(steps[0]).every((t, k) => (toks[k].counts ? t.value === 0 : t.raw === toks[k].raw)), `count "${s}" starts its counting numbers at 0 (${steps[0]})`);
  // a number that does not count is never touched, at any step
  check(steps.every(x => statTokens(x).every((t, k) => toks[k].counts || t.raw === toks[k].raw)), `count "${s}": non-counting numbers never change mid-count`);
  // format kept at every step: same non-digit skeleton
  // (a leading sign may hide while its number reads zero: "-3.1%" starts at "0.0%")
  const skel = (x: string) => x.replace(/[\d,]/g, "").replace(/(^|\s)[-+−]/g, "$1");
  check(steps.every(x => skel(x) === skel(s)), `count "${s}" keeps its format at every step`);
  const vals = steps.map(x => statTokens(x).map(t => t.value));
  check(vals.every((v, i) => i === 0 || v.every((n, k) => n >= vals[i - 1][k])), `count "${s}" never goes down`);
}
for (const [s, want] of [["2×", false], ["2+ days", false], ["1 in 3", false], ["2024", false], ["72 weeks", false], ["3,000+", false], ["+58%", true],
  ["12.8–14.4%", true], ["Phase 3: 68%", true], ["<6%", false], ["0.5 mg", false], ["120/80 mmHg", false], ["3x more likely", false], ["no number", false]] as const)
  check(countable(s) === want, `"${s}" ${want ? "counts up" : "pops"}`);
// 2026-11-17 second review: dose counts and multipliers. A trailing x counts only glued to the number and not followed
// by a word, "/" or a digit; any stat with a dose unit never counts
for (const [s, want] of [["20 x 5 mg", []], ["40 x 0.25 mg doses", []], ["12x/week", []], ["3x more likely", ["3"]], ["2.5x", ["2.5"]], ["4 x 2", []],
  ["1.5×", ["1.5"]], ["68% at 2.5 mg", []], ["10 units daily", []], ["5 ml", []], ["14.9% vs 2.4%", ["14.9", "2.4"]]] as [string, string[]][]) {
  const got = statTokens(s).filter(t => t.counts).map(t => t.raw);
  check(JSON.stringify(got) === JSON.stringify(want), `"${s}": counts ${want.length ? want.join(", ") : "nothing"} (got ${got.join(", ") || "nothing"})`);
}
for (const s of ["20 x 5 mg", "40 x 0.25 mg doses", "12x/week", "68% at 2.5 mg", "10 units daily"]) check(!countable(s) && countSteps(s, 10).every(x => x === s), `"${s}" never animates its numbers`);
// cosmetics: a signed number shows no "-0.0"; a change "50% to 25%" shows the first and counts the second from it
check(countSteps("-3.1%", 10)[0] === "0.0%" && countSteps("-3.1%", 10)[10] === "-3.1%", `"-3.1%" starts at "0.0%" (${countSteps("-3.1%", 10)[0]})`);
const chg = countSteps("50% to 25%", 10);
check(chg[0] === "50% to 50%" && chg.every(x => x.startsWith("50% to ")) && chg[10] === "50% to 25%", `"50% to 25%": 50% stays, the second counts from 50 (${chg[0]} ... ${chg[5]})`);
// the dosing guardrail matches the word "pen", not "open" or "happen"
check(DOSING({ type: "icon", variant: "insulin pen" } as ShotElement) && !DOSING({ type: "icon", variant: "open door" } as ShotElement) && !DOSING({ type: "icon", variant: "what might happen" } as ShotElement), "dosing guardrail: \bpen\b only");
const th = typedHtml("Why weight returns");
check(th.replace(/<[^>]+>/g, "") === "Why weight returns", "typed markup keeps the exact text");
check((th.match(/class="ch( lc)?"/g) ?? []).length === "Whyweightreturns".length && (th.match(/ lc"/g) ?? []).length === 1, "typed markup: one span per character, one caret end");

// plan pacing: 60 s with changes every 6 s fails the median, a 10 s hole is listed, the engine numbers ride along
const slowPlan = [6, 12, 18, 24, 30, 36, 42, 48, 54];
const pp = planPacing(slowPlan, [...slowPlan, 3, 9, 15, 21, 27, 33, 39, 45, 51, 57], 60);
check(!pp.ok && pp.medianGap === 6 && pp.longGaps.length === 10 && pp.withEngine.maxGap === 3, `plan pacing flags a 6 s rhythm (${pp.detail})`);
const shotsT = Array.from({ length: 12 }, (_, i) => ({ start: i * 5, end: i * 5 + 5 }));
const rev = pacingRevisions(pp, slowPlan, shotsT, 60, 8);
check(rev.length === 8 && rev.every(r => r.pacing.startsWith("pacing:")), "revision list is capped and explains itself");
const fast = planPacing([2, 4.5, 7, 9.5, 12, 14.5], [], 15);
check(fast.ok && !pacingRevisions(fast, [2, 4.5, 7, 9.5, 12, 14.5], shotsT.slice(0, 3), 15).length, "a 2.5 s plan passes and sends nothing back");
const scoreText = Array.from({ length: 100 }, (_, i) => `frame:${i} pts:${i} pts_time:${(i / 10).toFixed(1)}\nlavfi.scene_score=${i % 25 === 10 ? 0.2 : i < 50 ? 0.005 : 0.0005}`).join("\n");
const rp = paceFromScores(scoreText);
check(rp.visualChangesPerMin > 0 && Math.abs(rp.movingShare - 0.52) < 0.02 && rp.longestStill >= 2.2 && rp.longestStill <= 2.4, `post-render pace parser (${JSON.stringify(rp)})`);

// ---------------------------------------------------------------- 2) a synthetic long plan through the real engine
const el = (o: Partial<ShotElement>): ShotElement => ({ type: "heart", variant: "", tone: "primary", x: 50, y: 60, size: 40, count: 1, spread: 0, motion: "bob", enter: "pop", enter_at: 0, depth: "mid", label: "", flip: false, face: "none", says: "", ...o });
const shot = (o: Partial<Shot>): Shot => ({ scene_id: "s1", cue: "", mood: "body", background: "gradient", camera: "push-in", transition: "cut", elements: [el({})], title: { style: "none", text: "", sub: "", items: [] }, ...o });
const plan: Shot[] = [
  shot({ scene_id: "s1", title: { style: "headline", text: "Hook line", sub: "", items: [] } }),
  shot({ scene_id: "s2", transition: "lens", title: { style: "stat", text: "12.8–14.4%", sub: "average loss", items: [] }, elements: [el({ type: "chart", motion: "none", enter: "grow" }), el({ type: "arrow", x: 20, size: 16, enter: "pop", enter_at: 0.2 })] }),
  shot({ scene_id: "s3", transition: "wave", camera: "dive", title: { style: "typed", text: "Why weight returns", sub: "", items: [] } }),
  shot({ scene_id: "s4", transition: "flash", mood: "night", elements: [el({ face: "sad", motion: "none" })] }), // sombre: flash must fall back
  shot({ scene_id: "s5", transition: "corner", title: { style: "stat", text: "3,000+", sub: "adults", items: [] } }),
  shot({ scene_id: "s6", transition: "flash", title: { style: "stat", text: "2×", sub: "pop, not count", items: [] } }),
];
// 6 scenes of 8 s: one shot per scene, no cue search needed
const words = (start: number) => Array.from({ length: 16 }, (_, i) => ({ text: `w${i}`, start: +(start + 0.2 + i * 0.45).toFixed(2), end: +(start + 0.5 + i * 0.45).toFixed(2) }));
const tl: Timeline = { duration: 48, scenes: plan.map((s, i) => ({ id: s.scene_id, start: i * 8, end: i * 8 + 7.6, words: words(i * 8) })) };
const timed = timeShots(plan, tl);
const out = resolve(join("out", "pace-selftest"));
const { dir, pacing, cues } = await composeAnimated(join(out, "hf"), timed, tl, { vertical: false });
const html = (await import("node:fs")).readFileSync(join(dir, "index.html"), "utf8");

check(/circle\(0% at \d+% \d+%\)/.test(html), "lens transition opens from the hero's position");
check(/polygon\(-20% 0%, /.test(html) || /polygon\(120% 0%, /.test(html), "wave transition has a wavy edge");
check(/clipPath:"polygon\((0|100)% (0|100)%, /.test(html), "corner wipe starts from a corner");
check((html.match(/class="flash"/g) ?? []).length === 1, "flash: one white flash (the sombre night shot fell back)");
check(/scale:2\.5,duration:0\.700,ease:"power3\.in"/.test(html), "dive zooms to 2.5 in the shot's last 0.7 s");
check(/\.bar",\{scaleY:0,/.test(html) && /inset\(0% 100% 0% 0%\)/.test(html), "chart bars grow, arrow draws on");
check(!/tl\.to\("#el\d+i",\{\}/.test(html), "no empty idle tweens");
check(/ease:"steps\(\d+\)"/.test(html) && /ease:"sine\.inOut"/.test(html), "long idle swings drawn on twos (steps), sombre ones smooth");
// engine moves cover the whole 48 s (not only the opening) and keep clear of cuts
const allMoves = [...html.matchAll(/tl\.fromTo\("#pn\d+",\{scale:([\d.]+)\},\{scale:([\d.]+),duration:([\d.]+)[^}]*\},([\d.]+)\)/g)].map(m => ({ from: +m[1], to: +m[2], d: +m[3], t: +m[4] }));
const cuts = timed.slice(1).map(s => s.start);
// a dive shot hands its punch zoom back during the dive (it ends on the cut): checked separately below
const diveResets = allMoves.filter(m => m.to === 1 && cuts.some(c => Math.abs(m.t + m.d - c) < 0.01));
const moves = allMoves.filter(m => !diveResets.includes(m));
check(moves.some(m => m.t > 30) && moves.every(m => cuts.every(c => Math.abs(c - m.t) >= 0.8)), `engine moves run past 30 s and stay 0.8 s from cuts (${moves.length} moves)`);
check(diveResets.length <= 1 && diveResets.every(m => m.from <= 1.26 && m.from * 2.5 > 2.5), `a punched-in dive shot zooms its punch back to 1 during the dive (${diveResets.length})`);
check(moves.some(m => m.d >= 0.5) && moves.some(m => m.d < 0.2 && m.to > m.from) && moves.some(m => m.d < 0.2 && m.to < m.from), "moves vary: quick in, slow push, quick out");
// the sombre night shot (24-32 s) keeps slow pushes only: its stillness is designed; everywhere else a change ~2.5 s
const outside = [0, ...pacing.changes.filter(t => t < 24 || t >= 32), 24, 32, 48].sort((a, b) => a - b);
const gaps = outside.map((t, i, a) => (i && !(a[i - 1] === 24 && t === 32) ? t - a[i - 1] : 0));
check(Math.max(...gaps) <= PACING.long.gap + 0.6, `planned changes every ${PACING.long.gap} s or so outside the sombre beat (longest ${Math.max(...gaps).toFixed(2)} s)`);
const sombreMoves = moves.filter(m => m.t > 24 && m.t < 32);
check(sombreMoves.length > 0 && sombreMoves.every(m => m.d >= 0.5), `sombre beat: slow pushes only (${sombreMoves.length})`);
check(!cues.some(q => q.sfx === "swoosh" && q.t > PACING.long.sfxWindow), "no punch swoosh after the opening window");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.addInitScript("window.__name = (f) => f");
const errors: string[] = [];
page.on("pageerror", e => errors.push(e.message));
await page.goto(pathToFileURL(join(dir, "index.html")).href, { waitUntil: "load" });
await page.waitForFunction(() => !!(window as any).__timelines?.main, null, { timeout: 30_000 });
const seek = (t: number) => page.evaluate(t => { const tl = (window as any).__timelines.main; tl.totalTime(t + 0.001, true); tl.totalTime(t, true); }, t);
// clip-path transitions really open (GSAP silently skips a polygon it can't match): mid-way the shot is partly shown
const clipAt = async (t: number, sel: string) => { await seek(t); return page.evaluate(s => getComputedStyle(document.querySelector(s)!).clipPath, sel); };
const svs = () => page.evaluate(() => [...document.querySelectorAll(".stat .sv")].map(e => e.textContent));
const shotIds = await page.evaluate(() => [...document.querySelectorAll(".shot")].map(e => e.id));
const [wA, wB] = [await clipAt(16.05, `#${shotIds[2]}`), await clipAt(16.3, `#${shotIds[2]}`)];
check(wA !== wB && wB.startsWith("polygon"), `wave clip moves (${wA.slice(0, 40)} -> ${wB.slice(0, 40)})`);
const [cA, cB] = [await clipAt(32.05, `#${shotIds[4]}`), await clipAt(32.3, `#${shotIds[4]}`)];
check(cA !== cB, "corner clip moves");
await seek(9.0); // early in the first stat's count
const mid = await svs();
await seek(47.9);
const end = await svs();
await seek(4.0); // seek backward: everything reverts
const back = await svs();
check(mid[0] !== "12.8–14.4%" && /^\d+\.\d–\d+\.\d%$/.test(mid[0] ?? ""), `stat counts with its format mid-way (${mid[0]})`);
check(JSON.stringify(end) === JSON.stringify(["12.8–14.4%", "3,000+", "2×"]), `every stat ends on exactly its planned text (${end.join(" | ")})`);
check(JSON.stringify(back) === JSON.stringify(["12.8–14.4%", "3,000+", "2×"]), "seeking back restores the planned text");
await seek(16.6);
const typedMid = await page.evaluate(() => [...document.querySelectorAll(".typed .ch")].filter(e => getComputedStyle(e).opacity === "1").length);
await seek(18.5);
const typedEnd = await page.evaluate(() => ({ n: [...document.querySelectorAll(".typed .ch")].filter(e => getComputedStyle(e).opacity === "1").length, all: document.querySelectorAll(".typed .ch").length }));
check(typedMid > 0 && typedMid < typedEnd.all && typedEnd.n === typedEnd.all, `typed headline types out (${typedMid} then ${typedEnd.n}/${typedEnd.all} characters)`);
await seek(23.99);
const dive = await page.evaluate(() => { const cams = [...document.querySelectorAll(".cam")] as HTMLElement[]; return Math.max(...cams.map(c => new DOMMatrix(getComputedStyle(c).transform).a)); });
check(dive > 2.2, `dive camera is zoomed in at the end of its shot (scale ${dive.toFixed(2)})`);
// punch layer x camera never past ~2.6 (a punched-in shot that dives hands its punch back)
const product = await page.evaluate(() => Math.max(...[...document.querySelectorAll(".punch")].map(pn => new DOMMatrix(getComputedStyle(pn).transform).a * new DOMMatrix(getComputedStyle(pn.querySelector(".cam")!).transform).a)));
check(product <= 2.6, `dive: punch x camera scale ${product.toFixed(2)} stays at or under 2.6`);
// chart bars end exactly where the art draws them (an SVG transform-origin slip once floated them up a staircase)
const barShift = await page.evaluate(() => [...document.querySelectorAll(".bar")].map(b => { const m = (b as SVGGraphicsElement).transform.baseVal.consolidate()?.matrix; return m ? Math.abs(m.f) + Math.abs(m.d - 1) : 0; }));
check(barShift.length > 0 && barShift.every(v => v < 0.01), `chart bars land on their baseline (max offset ${Math.max(0, ...barShift).toFixed(3)})`);
check(!errors.length, `no page errors${errors.length ? `: ${errors[0]}` : ""}`);
await browser.close();

// sombre beats (fade-in, worried, sad, sick, night) never get an energetic transition: whip, lens, wave, corner and
// flash become a fade
{
  const sp: Shot[] = [shot({ scene_id: "s1" }), shot({ scene_id: "s2", transition: "whip", elements: [el({ face: "worried" })] }),
    shot({ scene_id: "s3", transition: "lens", elements: [el({ face: "sad" })] }), shot({ scene_id: "s4", transition: "corner", elements: [el({ face: "sick" })] }),
    shot({ scene_id: "s5", transition: "whip" })];
  const stl: Timeline = { duration: 40, scenes: sp.map((s, i) => ({ id: s.scene_id, start: i * 8, end: i * 8 + 7.6, words: words(i * 8) })) };
  const sc = await composeAnimated(join(out, "hf-sombre"), timeShots(sp, stl), stl, { vertical: false });
  const sh = (await import("node:fs")).readFileSync(join(sc.dir, "index.html"), "utf8");
  const ids = [...sh.matchAll(/id="(shot\d+)" class="clip shot/g)].map(m => m[1]);
  const fadeIn = (id: string) => sh.includes(`tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:0.55}`);
  check(fadeIn(ids[1]) && fadeIn(ids[2]) && fadeIn(ids[3]) && !/circle\(0% at/.test(sh) && !/clipPath:"polygon/.test(sh), "sombre: worried whip, sad lens, sick corner all fade in");
  check(sh.includes(`tl.fromTo("#${ids[4]}",{x:1920},{x:0`), "a whip on a normal shot stays a whip");
}

// Shorts keep the old engine: the same plan composed vertical has none of the long-form additions (the byte-for-byte
// proof against the HEAD engine is in the 2026-11-17 report; this guards against a regression)
{
  const tv = timeShots(plan, tl);
  const cap = tl.scenes.map(s => ({ id: s.id, narration: s.words.map(w => w.text).join(" ") }));
  const v = await composeAnimated(join(out, "hf-vertical"), tv, tl, { vertical: true, captionScenes: cap });
  const vh = (await import("node:fs")).readFileSync(join(v.dir, "index.html"), "utf8");
  const leaks = ['class="rx"', "sbar", " typed", 'class="flash"', 'clipPath:"polygon', "rotationY", "keyframes:", "textContent", "scale:2.5", "steps("].filter(k => vh.includes(k));
  check(!leaks.length && !v.pacing.engine.moves.length, `vertical composition has no long-form additions${leaks.length ? `: ${leaks.join(", ")}` : ""}`);
  check(/clipPath:"circle\(0% at 50% 50%\)"/.test(vh) && (vh.match(/\{y:1920\},\{y:0/g) ?? []).length >= 2, "vertical: lens maps to iris, wave and corner to slide-up");
}

console.log(fails ? `\n${fails} check(s) FAILED` : "\nall pace checks passed");
process.exit(fails ? 1 : 0);
