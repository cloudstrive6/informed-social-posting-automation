/**
 * Visual QA.
 *  1. technicalFrameChecks: every rendered frame, via ffmpeg (black frames, frozen animation, photosensitive flashing).
 *  2. layoutAudit: measures every visible text element at sample times in the live composition
 *     (off-screen, text-on-text overlap, too small, text sitting on the hero artwork).
 *  3. critiqueShots: renders key frames (pre-render snapshots), lays them out as contact sheets
 *     and has the Visual Critic agent score appeal/readability per shot.
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { runAgent } from "../lib/agent.js";
import { config } from "../lib/config.js";
import { ensureDir, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import type { TimedShot } from "../media/animated.js";
import { run } from "../media/exec.js";

// ------------------------------------------------------------------ 1) every frame, technically
export interface FrameIssue { kind: "black" | "freeze" | "flash"; start: number; end: number; detail: string }

export async function technicalFrameChecks(video: string): Promise<FrameIssue[]> {
  const issues: FrameIssue[] = [];
  const out = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", video, "-vf",
    "blackdetect=d=0.25:pix_th=0.06,freezedetect=n=0.0008:d=1.6,signalstats,metadata=mode=print:key=lavfi.signalstats.YAVG:file=-",
    "-an", "-f", "null", "-"], { quiet: true }).catch(e => String(e));
  for (const m of out.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)) issues.push({ kind: "black", start: +m[1], end: +m[2], detail: "black frames" });
  const fs = [...out.matchAll(/freeze_start: ([\d.]+)/g)].map(m => +m[1]);
  const fe = [...out.matchAll(/freeze_end: ([\d.]+)/g)].map(m => +m[1]);
  fs.forEach((s, i) => issues.push({ kind: "freeze", start: s, end: fe[i] ?? s + 2, detail: "no motion (animation stalled?)" }));
  // photosensitivity (WCAG 2.3.1): > 3 large luminance flashes within any 1 s window
  const yavg = [...out.matchAll(/pts_time:([\d.]+)[\s\S]*?YAVG=([\d.]+)/g)].map(m => [+m[1], +m[2]] as const);
  const flashes: number[] = [];
  for (let i = 1; i < yavg.length; i++) if (Math.abs(yavg[i][1] - yavg[i - 1][1]) > 45) flashes.push(yavg[i][0]);
  for (let i = 0; i + 3 < flashes.length; i++) if (flashes[i + 3] - flashes[i] < 1) { issues.push({ kind: "flash", start: flashes[i], end: flashes[i + 3], detail: "possible photosensitive flashing" }); i += 3; }
  return issues;
}

// ------------------------------------------------------------------ 2) layout audit of text
export interface LayoutIssue { t: number; kind: "offscreen" | "overlap" | "tiny" | "on-hero" | "sparse"; text: string; detail: string }

/**
 * Near-empty shots (a few small props on a plain background) read as unfinished. Estimated straight from the
 * shot plan: artwork area / frame area. Illustrated backdrops and title beats need less artwork.
 */
export function sparseShots(shots: { start: number; end: number; background: string; elements: { size: number; count: number; depth: string }[]; title: { style: string } }[], W: number, H: number): LayoutIssue[] {
  const filled = new Set(["room", "kitchen", "outdoors", "body", "cells", "bloodstream", "tissue"]);
  return shots.flatMap(s => {
    const area = s.elements.reduce((a, e) => a + Math.min(30, Math.max(1, Math.round(e.count))) * ((e.size / 100) * H) ** 2 * (e.depth === "bg" ? 0.64 : 1), 0) / (W * H);
    const titled = s.title.style === "stat" || s.title.style === "headline";
    const min = filled.has(s.background) ? 0.06 : 0.12;
    return !titled && area < min ? [{
      t: (s.start + s.end) / 2, kind: "sparse" as const, text: "",
      detail: `shot looks empty: the artwork covers only ~${Math.round(area * 100)}% of the frame on a ${s.background} background. Use one hero at size 35+, or make grouped items bigger (size 18+), or switch to an illustrated backdrop (room/kitchen/outdoors/body).`,
    }] : [];
  });
}

export async function layoutAudit(projectDir: string, times: number[], W: number, H: number): Promise<LayoutIssue[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.addInitScript("window.__name = (f) => f"); // esbuild/tsx keepNames helper used inside evaluate()
  await page.goto(pathToFileURL(resolve(projectDir, "index.html")).href, { waitUntil: "load" });
  await page.waitForFunction(() => !!(window as any).__timelines?.main, null, { timeout: 30_000, polling: 250 });
  const issues: LayoutIssue[] = [];
  for (const t of times) {
    const found = await page.evaluate(([t, W, H]) => {
      // emulate the renderer: only elements whose [start, start+duration) covers t are visible
      document.querySelectorAll<HTMLElement>("[data-start]").forEach(el => {
        if (el.id === "root") return;
        const s = +el.dataset.start!, d = +(el.dataset.duration ?? 1e9);
        el.style.visibility = t >= s && t < s + d ? "visible" : "hidden";
      });
      (window as any).__timelines.main.seek(t, false);
      const vis = (el: Element) => {
        let e: Element | null = el, op = 1;
        while (e && e !== document.body) {
          const cs = getComputedStyle(e);
          if (cs.visibility === "hidden" || cs.display === "none") return 0;
          op *= +cs.opacity; e = e.parentElement;
        }
        return op;
      };
      const texts = [...document.querySelectorAll(".label,.headline,.stat .sv,.stat .sl,.chip,.cap,.elabel")]
        .filter(el => vis(el) > 0.6 && (el.textContent ?? "").trim())
        .map(el => { const r = el.getBoundingClientRect(); return { el, r, text: (el.textContent ?? "").trim().slice(0, 40), px: parseFloat(getComputedStyle(el).fontSize) * (r.height / ((el as HTMLElement).offsetHeight || r.height)) }; });
      const heroes = [...document.querySelectorAll(".el")].filter(el => vis(el) > 0.6).map(el => el.getBoundingClientRect()).filter(r => r.height > H * 0.2);
      const out: { kind: string; text: string; detail: string }[] = [];
      const inter = (a: DOMRect, b: DOMRect) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      texts.forEach((a, i) => {
        if (a.r.left < -2 || a.r.top < -2 || a.r.right > W + 2 || a.r.bottom > H + 2) out.push({ kind: "offscreen", text: a.text, detail: `box ${Math.round(a.r.left)},${Math.round(a.r.top)},${Math.round(a.r.right)},${Math.round(a.r.bottom)}` });
        if (a.px < (Math.min(W, H) >= 1080 ? 26 : 20)) out.push({ kind: "tiny", text: a.text, detail: `${a.px.toFixed(0)}px` });
        texts.slice(i + 1).forEach(b => {
          const x = inter(a.r, b.r);
          if (x > 0.12 * Math.min(a.r.width * a.r.height, b.r.width * b.r.height)) out.push({ kind: "overlap", text: `${a.text} / ${b.text}`, detail: "text overlaps text" });
        });
        if (!a.el.classList.contains("elabel") && !a.el.classList.contains("cap")) {
          for (const h of heroes) if (inter(a.r, h) > 0.35 * a.r.width * a.r.height) { out.push({ kind: "on-hero", text: a.text, detail: "title sits on top of the main artwork" }); break; }
        }
      });
      return out;
    }, [t, W, H] as const);
    for (const f of found) issues.push({ t, ...(f as any) });
  }
  await browser.close();
  return issues;
}

// ------------------------------------------------------------------ 3) key frames + critic
export interface ShotReview { shot: number; score: number; readability: "ok" | "issue"; issues: string[]; fix: string }
const reviewSchema = {
  type: "object", additionalProperties: false, required: ["reviews", "overall"],
  properties: {
    overall: { type: "string" },
    reviews: {
      type: "array", items: {
        type: "object", additionalProperties: false, required: ["shot", "score", "readability", "issues", "fix"],
        properties: { shot: { type: "number" }, score: { type: "number", minimum: 1, maximum: 10 }, readability: { enum: ["ok", "issue"] }, issues: { type: "array", items: { type: "string" } }, fix: { type: "string" } },
      },
    },
  },
};

/** Moments worth looking at for each shot: just after titles land, and mid-shot. */
export function keyTimes(shots: TimedShot[]): { shot: number; t: number }[] {
  return shots.flatMap((s, i) => {
    const d = s.end - s.start;
    const ts = [s.start + Math.min(1.1, d * 0.45)];
    if (d > 3.5) ts.push(s.start + d * 0.75);
    return ts.map(t => ({ shot: i, t: +t.toFixed(2) }));
  });
}

async function snapshots(projectDir: string, times: number[], outDir: string): Promise<string[]> {
  ensureDir(outDir);
  await run("npx", ["-y", "hyperframes@0.8.77", "snapshot", ".", "--at", times.join(","), "--no-end", "--output", resolve(outDir)], {
    cwd: projectDir, quiet: true, env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1" },
  });
  return readdirSync(outDir).filter(f => /^frame-\d+.*\.png$/.test(f)).sort().map(f => join(outDir, f));
}

async function contactSheets(frames: { file: string; label: string }[], outDir: string, vertical: boolean): Promise<string[]> {
  const per = vertical ? 6 : 4, cols = vertical ? 6 : 2;
  const cw = vertical ? 300 : 640, ch = vertical ? 533 : 360;
  const browser = await chromium.launch();
  const sheets: string[] = [];
  for (let i = 0; i < frames.length; i += per) {
    const batch = frames.slice(i, i + per);
    const rows = Math.ceil(batch.length / cols);
    const page = await browser.newPage({ viewport: { width: cols * (cw + 8), height: rows * (ch + 40) } });
    await page.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:8px;font:bold 22px sans-serif;color:#ff0">` +
      batch.map(f => `<div><div style="height:32px">${f.label}</div><img src="data:image/png;base64,${readFileSync(f.file).toString("base64")}" style="width:${cw}px;height:${ch}px;object-fit:contain;background:#000"></div>`).join("") + "</body>");
    await page.waitForLoadState("load");
    const file = join(outDir, `sheet-${String(sheets.length + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, fullPage: true });
    await page.close();
    sheets.push(file);
  }
  await browser.close();
  return sheets;
}

export async function critiqueShots(projectDir: string, shots: TimedShot[], vertical: boolean, layout: LayoutIssue[], workDir: string, onlyShots?: Set<number>): Promise<ShotReview[]> {
  const dir = ensureDir(join(workDir, "qa-frames"));
  const kt = keyTimes(shots).filter(k => !onlyShots || onlyShots.has(k.shot));
  if (!kt.length) return [];
  const files = await snapshots(projectDir, kt.map(k => k.t), join(dir, `snap-${Date.now()}`));
  const frames = kt.map((k, i) => ({ file: files[i], label: `Shot ${k.shot} @ ${k.t.toFixed(1)}s` })).filter(f => f.file);
  const sheets = await contactSheets(frames, dir, vertical);
  const reviews: ShotReview[] = [];
  const groups: string[][] = [];
  for (let i = 0; i < sheets.length; i += 8) groups.push(sheets.slice(i, i + 8));
  const results = await Promise.all(groups.map(g => runAgent<{ reviews: ShotReview[]; overall: string }>({
    agent: "visual-critic", model: config.models.critic, schema: reviewSchema, tools: ["Read"], cwd: dir, maxTurns: 20, effort: "medium",
    input: {
      format: vertical ? "vertical 9:16" : "horizontal 16:9",
      instructions: `Open and inspect each contact sheet image with the Read tool, then review every shot shown. Sheets: ${g.map(f => resolve(f)).join(" ; ")}`,
      shots: shots.map((s, i) => ({ shot: i, start: +s.start.toFixed(1), mood: s.mood, title: s.title.style !== "none" ? s.title : undefined, elements: s.elements.map(e => e.type + (e.count > 1 ? ` x${e.count}` : "")) }))
        .filter(s => !onlyShots || onlyShots.has(s.shot)),
      automated_layout_findings: layout,
    },
  }).then(r => r.reviews).catch(e => { log.warn(`visual critic failed: ${(e as Error).message}`); return [] as ShotReview[]; })));
  results.forEach(r => reviews.push(...r));
  writeJson(join(workDir, "qa-visual-review.json"), { reviews, sheets: sheets.map(s => basename(s)) });
  return reviews;
}
