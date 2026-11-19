/**
 * Self-test of the medical-safety guards and the crowd-under-title layout (owner, 2026-11-18, after the first
 * fast-style long video drew syringes with faces and a pen-readying sound, and a crowd covered a stat caption).
 * No paid API, no agent, no render: `npx tsx scripts/medical-safety-selftest.ts`.
 *
 *  1. pure functions: which elements become a closed medicine box (pill characters stay), which custom sound
 *     prompts are dropped;
 *  2. a synthetic plan composed by the real engine (long and Short): no syringe art reaches the page (built-in or
 *     illustration), and every person in a crowd under a stat stays below the stat's caption at several moments.
 * Exit code 1 on any failure.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { composeAnimated, safeMedicalArt, timeShots } from "../src/media/animated.js";
import { sticker } from "../src/media/comic.js";
import { art as thumbArt } from "../src/media/thumbCartoon.js";
import { palette } from "../src/media/vector/palettes.js";
import type { Timeline } from "../src/media/tts.js";
import type { Shot, ShotElement } from "../src/media/vector/shots.js";
import { MEDICAL_SFX } from "../src/qa/soundDesign.js";

let fails = 0;
const check = (ok: boolean, what: string) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails++; };
const el = (o: Partial<ShotElement>): ShotElement => ({ type: "heart", variant: "", tone: "primary", x: 50, y: 60, size: 40, count: 1, spread: 0, motion: "bob", enter: "pop", enter_at: 0, depth: "mid", label: "", flip: false, face: "none", says: "", ...o });

// ---------------------------------------------------------------- 1) pure functions
const toBox: Partial<ShotElement>[] = [
  { type: "syringe", face: "happy", says: "I'm the pen!" }, { type: "icon", variant: "syringe" }, { type: "icon", variant: "injection pen" },
  { type: "icon", variant: "vial" }, { type: "icon", variant: "KwikPen" }, { type: "icon", variant: "single-dose pen" },
  { type: "icon", variant: "health:syringe-vaccine" }, { type: "icon", variant: "needle" }, { type: "icon", variant: "auto-injector" },
  { type: "icon", variant: "insulin pen" }, { type: "icon", variant: "IV drip" }, { type: "icon", variant: "multi-dose pen" },
  { type: "icon", variant: "vaccine" }, { type: "icon", variant: "health:vaccine" }, { type: "icon", variant: "jab" }, { type: "icon", variant: "flu shot" },
  { type: "icon", variant: "Ozempic pen" }, { type: "icon", variant: "Mounjaro pens" }, { type: "icon", variant: "ampule" }, { type: "icon", variant: "lancet" },
];
for (const o of toBox) {
  const r = safeMedicalArt(el(o));
  check(r.type === "icon" && r.variant === "package" && !r.says, `${o.type}${o.variant ? ` "${o.variant}"` : ""} → closed medicine box, no bubble`);
}
for (const v of ["pen", "fountain pen", "pencil", "package", "document", "pharmacy", "doctor", "insulin resistance", "coffee drip", "penguin", "frying pan"]) {
  const e = el({ type: "icon", variant: v });
  check(safeMedicalArt(e) === e, `"${v}" left alone`);
}
// dose talk and dose amounts leave bubbles and labels, on any element; other words stay
const syrLabel = safeMedicalArt(el({ type: "syringe", label: "Inject weekly" }));
check(syrLabel.variant === "package" && syrLabel.label === "", "a device's dose label goes with it");
check(safeMedicalArt(el({ type: "syringe", label: "Single-use" })).label === "Single-use", "a neutral device label stays on the box");
for (const [o, field] of [[{ type: "pill", says: "Take two tablets!" }, "says"], [{ type: "pill", says: "Highest dose, reporting in!" }, "says"], [{ type: "chart", label: "2.5 mg" }, "label"], [{ type: "pill", label: "Dose step" }, "label"]] as [Partial<ShotElement>, "says" | "label"][])
  check(safeMedicalArt(el(o))[field] === "", `${o.type} "${o[field]}" removed`);
for (const s of ["Wait, we're different?", "Same medicine!", "1 in 3", "Take two minutes to breathe!", "5 units of alcohol a week"]) { const e = el({ type: "pill", says: s, face: "worried" }); check(safeMedicalArt(e) === e, `pill says "${s}": kept`); }

// pill characters stay (the Pill vs Patch Shorts star one); only injection devices are redrawn
for (const o of [{ type: "pill", face: "worried", says: "Wait, we're different?" }, { type: "icon", variant: "pill", face: "happy" }, { type: "icon", variant: "pill bottle" }] as Partial<ShotElement>[]) {
  const e = el(o);
  check(safeMedicalArt(e) === e, `${o.type} ${o.variant ?? ""} left alone`);
}

const drop = ["A soft plastic click followed by a faint pneumatic hiss, like an injection pen cap being removed and the pen being readied, clean and subtle",
  "needle prick", "syringe plunger squeak", "pill bottle rattle", "someone swallowing a tablet", "glass vial clink", "insulin pen dial clicks", "blister pack pop",
  "a quick jab", "flu shot", "plunger squeak", "lancet click", "prescription bottle rattle", "pop of a foil blister", "tablets rattling in a jar",
  "A soft plastic click, like a pen cap being removed and the pen being readied", "pen cap snaps off and clicks", "a cap pulled off, then a dial turning"];
const keep = ["A soft, slow nighttime breathing sound with a gentle snore catch at the end", "sizzling frying pan", "page turn", "soft chime",
  "a cardboard box set down on a table", "pen writing on paper", "crowd murmur in a hospital hallway", "slow deep heartbeat",
  "ballpoint pen click", "time capsule opening", "tablet computer tap", "swallow bird chirping", "a dose of drama sting", "pen writing a note"];
for (const p of drop) check(MEDICAL_SFX.test(p), `sound dropped: "${p.slice(0, 60)}"`);
for (const p of keep) check(!MEDICAL_SFX.test(p), `sound kept: "${p.slice(0, 60)}"`);

// ---------------------------------------------------------------- 2) through the real engine
const shot = (o: Partial<Shot>): Shot => ({ scene_id: "s1", cue: "", mood: "body", background: "gradient", camera: "push-in", transition: "cut", elements: [el({})], title: { style: "none", text: "", sub: "", items: [] }, ...o });
const crowd = (y: number, spread: number, size: number) => el({ type: "person", count: 6, spread, y, size, x: 45, motion: "bob" });
const plan: Shot[] = [
  shot({ scene_id: "s1", title: { style: "headline", text: "Same medicine?", sub: "", items: [] } }),
  shot({ scene_id: "s2", elements: [el({ type: "syringe", face: "happy", x: 30, says: "Me first!" }), el({ type: "icon", variant: "syringe", x: 70, face: "happy" })] }),
  shot({ scene_id: "s3", title: { style: "stat", text: "478", sub: "adults with type 2 diabetes, SURPASS-1", items: [] }, elements: [crowd(40, 25, 18), el({ type: "icon", variant: "document", x: 80, y: 70, size: 20 })] }),
  shot({ scene_id: "s4", title: { style: "stat", text: "2,539", sub: "adults enrolled in SURMOUNT-1", items: [] }, elements: [crowd(30, 40, 30)] }),
  shot({ scene_id: "s5", elements: [el({ type: "icon", variant: "vial", x: 40 }), el({ type: "icon", variant: "KwikPen", says: "Take two!", x: 70 })] }),
];
const words = (start: number) => Array.from({ length: 16 }, (_, i) => ({ text: `w${i}`, start: +(start + 0.2 + i * 0.45).toFixed(2), end: +(start + 0.5 + i * 0.45).toFixed(2) }));
const tl: Timeline = { duration: plan.length * 8, scenes: plan.map((s, i) => ({ id: s.scene_id, start: i * 8, end: i * 8 + 7.6, words: words(i * 8) })) };
const timed = timeShots(plan, tl);
const out = resolve(join("out", "medical-safety-selftest"));
const syringeIcon = createRequire(import.meta.url)("@iconify-json/fluent-emoji-flat/icons.json").icons.syringe.body as string;
const iconMark = syringeIcon.match(/d="([^"]{24})/)![1];
const healthSyringe = createRequire(import.meta.url)("@iconify-json/healthicons/icons.json").icons.syringe.body as string;
const healthMark = healthSyringe.match(/d="([^"]{24})/)![1];

// thumbnails and carousels draw from free text: a device request gives the closed box, never a syringe
const pal = palette("brand");
for (const q of ["syringe", "icon:syringe", "vaccine", "injection pen", "Ozempic pen", "needle"]) {
  const svg = thumbArt(q, "happy", pal, 3, "t1");
  check(!/x1="34" y1="0" x2="60"/.test(svg) && !svg.includes(iconMark), `thumbnail "${q}": no syringe drawn`);
}
for (const q of ["syringe", "health:vaccine", "vaccine", "insulin pen", "jab"]) {
  const svg = sticker(q, 3, 120);
  check(!!svg && !svg.includes(iconMark) && !svg.includes(healthMark), `carousel "${q}": no syringe drawn (closed box instead)`);
}

const browser = await chromium.launch();
for (const vertical of [false, true]) {
  const fmt = vertical ? "Short" : "long";
  const { dir } = await composeAnimated(join(out, vertical ? "v" : "h"), timed, tl, { vertical });
  const html = readFileSync(join(dir, "index.html"), "utf8");
  check(!/x1="34" y1="0" x2="60"/.test(html), `${fmt}: no built-in syringe drawn`);
  check(!html.includes(iconMark), `${fmt}: no syringe illustration drawn`);
  check(!/Me first!|Take two!/.test(html), `${fmt}: no speech bubble from an injection device`);

  const page = await browser.newPage({ viewport: vertical ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 } });
  await page.addInitScript("window.__name = (f) => f");
  await page.goto(pathToFileURL(join(dir, "index.html")).href, { waitUntil: "load" });
  await page.waitForFunction(() => !!(window as any).__timelines?.main, null, { timeout: 30_000 });
  const seek = (t: number) => page.evaluate(t => { const m = (window as any).__timelines.main; m.totalTime(t + 0.001, true); m.totalTime(t, true); }, t);
  for (const [i, sh] of [[2, timed[2]], [3, timed[3]]] as const) {
    for (const f of [0.35, 0.6, 0.9]) {
      const t = sh.start + (sh.end - sh.start) * f;
      await seek(t);
      // the stat block on screen now, and the art boxes of every visible person
      const r = await page.evaluate(i => {
        const vis = (e: Element) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.visibility !== "hidden" && +s.opacity > 0.05 && b.width > 0 && b.height > 0; };
        const stat = [...document.querySelectorAll(".stat")].filter(e => vis(e) && +getComputedStyle(e).opacity > 0.5).map(e => e.querySelector(".sl")!.getBoundingClientRect().bottom);
        const shotEl = document.querySelectorAll(".shot")[i]; // shots are laid out in plan order
        const tops = shotEl ? [...shotEl.querySelectorAll(".el .art")].filter(vis).map(a => a.getBoundingClientRect().top) : [];
        return { statBottom: stat.length ? Math.max(...stat) : -1, minTop: tops.length ? Math.min(...tops) : -1, n: tops.length };
      }, i);
      check(r.statBottom > 0 && r.n >= 6 && r.minTop >= r.statBottom - 4,
        `${fmt}: "${sh.title.text}" crowd stays under its caption at ${t.toFixed(1)} s (caption bottom ${r.statBottom.toFixed(0)} px, highest art ${r.minTop.toFixed(0)} px, ${r.n} elements)`);
    }
  }
  await page.close();
}
await browser.close();
console.log(fails ? `\n${fails} FAILED` : "\nall medical-safety checks passed");
process.exit(fails ? 1 : 0);
