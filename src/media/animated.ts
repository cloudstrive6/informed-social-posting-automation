/**
 * Animated flat-vector video composer (docs/STYLE.md).
 * Turns Motion-Designer shot plans + narration timing into a HyperFrames composition,
 * and emits SFX cues for every visual event.
 */
import { copyFileSync } from "node:fs";
import { join } from "node:path";
import { config, ROOT } from "../lib/config.js";
import { ensureDir, writeText } from "../lib/fsx.js";
import { esc } from "../lib/html.js";
import { installBrandAssets } from "./fonts.js";
import { type AlignStats, subtitleWords } from "./captions.js";
import { Timeline, Word } from "./tts.js";

/** `narration` = written script, `spoken` = what the narrator actually said (captions follow the voice). */
export interface CaptionScene { id: string; narration: string; spoken?: string }
import { COMPONENTS, Tone } from "./vector/components.js";
import { iconSvg, resolveIcon } from "./vector/iconPack.js";
import { log } from "../lib/log.js";
import { hashStr, palette, Palette, rng } from "./vector/palettes.js";
import { Shot, ShotElement } from "./vector/shots.js";
import { backdropSvg, DOODLE_CSS, DOODLE_DEFS, faceSvg, LIGHT_BACKDROPS, stripFace } from "./vector/cartoon.js";
import { BLOCKED_ICON, DEVICE_STANDIN, safeMedicalArt } from "./vector/medicalSafety.js";

export type Theme = "vibrant" | "doodle";

export interface SfxCue { t: number; sfx: string; gain: number }
/** Long-form engine moves for the beat-sync render check (see engineMoves). Empty for Shorts. */
export interface EngineMoves { moves: [number, number][]; impulses: number[] }
export interface TimedShot extends Shot { start: number; end: number }

const f3 = (n: number) => Math.max(0, n).toFixed(3);
const TRANS_DUR = 0.55;

/**
 * Opening craft rules (owner-approved 2026-11-12, from the 2026-11-11 craft audit):
 *  - frame 0 is fully composed: the first shot's hero art and its hook text are on screen at t = 0, with no
 *    fade/pop entrance (the voice is already at full level at t = 0, and frame 0 is the Shorts feed preview);
 *  - pacing: a visual change (cut, punch-in, big new element, headline/stat/chips in or out) at least every `gap` s
 *    within `window` s,
 *    filled with deterministic camera punch-ins where the plan leaves a longer static stretch;
 *  - Shorts (any video with burned-in captions): captions win. Only the first shot may show a title, for at most
 *    OPENING_TITLE s from t = 0 (the hook, which the scriptwriter makes equal to the first spoken line); captions
 *    are hidden only in that window and later titles are not drawn, so the captions run uninterrupted (big-number
 *    stats stay: they are art above the caption band, and the captions keep running under them);
 *  - long-form: the main character in the first 30 s is at least 35% of the frame height.
 */
export const PACING = {
  short: { window: 10, gap: 2.5, firstPunch: 1.2, scale: 1.15, sfxWindow: 10 },
  /**
   * Long-form (2026-11-17, from the Infographics Show style study): the gap rule covers the WHOLE video (it used to
   * stop at 60 s with a 5 s gap). Engine moves alternate a quick punch-in, a slower push and a punch back out so the
   * rhythm is not a metronome. Punch SFX only in the opening `sfxWindow` s (a swoosh every 2.5 s for 11 minutes
   * would grate); silent after that.
   */
  long: { window: Infinity, gap: 2.5, firstPunch: 2.5, scale: 1.12, sfxWindow: 60 },
};
/** Long-form plan pacing gate (report and revise, never drop): planned content changes, whole video. */
export const PLAN_PACE = { medianMax: 3, gapMax: 4 };
/** Shorts safe zone on 1080x1920 (clear of the right-hand button rail and the bottom UI). */
export const SHORTS_SAFE = { left: 60, right: 900, top: 180, bottom: 1500 };
/**
 * Long-form idle swings are drawn "on twos": they advance in 12 steps a second instead of gliding at 60 fps (the
 * cartoon convention; camera moves, entrances and punches stay smooth). Measured 2026-11-17 on the first 30 s of the
 * new 120 s plan, motion share (frames with ffmpeg scene score >= 0.003): smooth 45.7%, 12 steps/s 50.8%, 8 steps/s
 * 47.6%. The scene score is min(frame change, change of that change), so a smooth swing of a mid-size character
 * scores 0.001 to 0.002 however big it is (gain 1.5: 41.6%, 2.2: 43.2%; double speed, a camera float, 1.8x bigger
 * camera moves: each within +-0.5 points); a step registers. Shorts and sombre beats stay smooth.
 */
const IDLE_STEPS = 12;
/** Long-form slow swings (float, breathe, orbit) run at this fraction of their period, so each step moves far enough. */
const SLOW_SWING_LONG = 0.6;
/** Idle-motion swing on long videos (see motionTween). */
const IDLE_GAIN_LONG = 2.2;
/** Long-form hero reactions: shots at least this long (s) get one in their second half (see shotHtml). */
const REACT_MIN = 1.8;
const LONG_HERO_MIN = 35; // % of frame height, first 30 s of a long video
/** After the first 30 s: small characters in wide flat rooms barely move on the scene score (2026-11-17 new-plan render) */
const LONG_HERO_MIN_LATER = 30;
/** With burned-in captions, the opening title (first shot only) holds this long, then the captions take over. */
const OPENING_TITLE = 2.0;
/** Punch-ins stay this far from any cut, so the beat-sync render check can't mistake one for an on-time cut. */
const PUNCH_CLEAR = 0.8;
/** Change times closer than this are one change. */
const dedupe = (ts: number[], eps = 0.1) => [...ts].sort((a, b) => a - b).filter((t, i, a) => i === 0 || t - a[i - 1] >= eps);

// ------------------------------------------------------------------ animated numbers (stat titles, long-form)
interface NumTok { at: number; raw: string; value: number; dec: number; comma: boolean; counts: boolean; /** counts from here (default 0) */ from?: number }
/** A dose unit or dose word anywhere in a stat: nothing in it ever counts (a counter must never animate a dose). */
const DOSE_UNIT = /(?:^|[\s\d./(])(?:mg|mcg|µg|ug|iu|ml|units?|doses?|injections?|shots?|pills?|tablets?|capsules?)(?![a-z])/i;
/**
 * Every number in a stat's text, and whether it counts up. Only a number attached to "%", "×" or a trailing "x"
 * multiplier counts (2026-11-17 review): a range shares its unit, so in "12.8–14.4%" both ends count. Everything
 * else stays exactly as written while the others count: dose units (0.5 mg), readings (120/80), label numbers
 * (Phase 3, Type 2, COVID-19, years, trial names), "1 in 3", and bounds like "<6%" (a "less than" is not a tally).
 */
export function statTokens(text: string): NumTok[] {
  const toks = [...text.matchAll(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g)].map((m): NumTok => {
    const raw = m[0], plain = raw.replace(/,/g, "");
    return { at: m.index!, raw, value: Number(plain), dec: plain.includes(".") ? plain.split(".")[1].length : 0, comma: raw.includes(","), counts: false };
  });
  if (DOSE_UNIT.test(text)) return toks; // "20 x 5 mg", "0.5 mg": never animated
  // "%" (a space allowed), or a "×" / "x" multiplier glued to the number and not followed by a word, "/" or digit:
  // "2×", "3x more"; not "20 x 5", "12x/week"
  const unitAfter = (t: NumTok) => /^(?:\s?%|[×xX](?![\w/]))/.test(text.slice(t.at + t.raw.length));
  const glued = (t: NumTok) => /[A-Za-z\-/]$/.test(text.slice(0, t.at)) || /^(?:\/|[A-Za-z])/.test(text.slice(t.at + t.raw.length).replace(/^\s?(?:%|×)/, "%"));
  toks.forEach((t, i) => {
    const before = text.slice(0, t.at);
    if (/[<>≤≥]\s*$/.test(before) || /[A-Za-z]-$/.test(before) || /\/$/.test(before)) return; // "<6%", "COVID-19", "120/80"
    if (unitAfter(t)) { t.counts = true; return; }
    // the low end of a range shares the unit of the high end: "25-29%", "12.8–14.4%", "8.9 to 13.6%"
    const next = toks[i + 1];
    if (next && /^\s*(?:[-–—]|to)\s*$/.test(text.slice(t.at + t.raw.length, next.at)) && unitAfter(next) && !glued(t)) t.counts = true;
  });
  // a change, not a range: "50% to 25%" (both ends carry the unit) shows the first and counts the second from it
  toks.forEach((t, i) => {
    const next = toks[i + 1];
    if (t.counts && next?.counts && unitAfter(t) && /^\s?%?\s*(?:to|→|->)\s*$/.test(text.slice(t.at + t.raw.length, next.at))) { t.counts = false; next.from = t.value; }
  });
  return toks;
}
/**
 * Count up, or pop? A stat counts when it has a counting number, unless every counting number is a small integer
 * ("2×": counting 0 to 2 is noise). "1 in 3" style ratios always pop.
 */
export function countable(text: string): boolean {
  const toks = statTokens(text).filter(t => t.counts);
  if (!toks.length) return false;
  if (/\d\s*(?:in|out of)\s*\d/i.test(text)) return false;
  return !toks.every(t => t.dec === 0 && t.value <= 10);
}
const fmtNum = (t: NumTok, v: number) => {
  const s = t.dec ? v.toFixed(t.dec) : String(Math.round(v));
  if (!t.comma) return s;
  const [i, d] = s.split(".");
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? `.${d}` : "");
};
/**
 * The texts a counter shows: steps + 1 of them, from zero, eased out (fast, then settling). Counting numbers move
 * together in their own format (decimals, commas); every other character, other numbers included, stays exactly as
 * planned. The last one is exactly the planned text. Nothing is invented: only the in-between values a counter
 * passes through.
 */
export function countSteps(text: string, steps: number): string[] {
  const toks = statTokens(text).filter(t => t.counts);
  const out: string[] = [];
  for (let i = 0; i <= steps; i++) {
    if (i === steps) { out.push(text); break; }
    const f = 1 - Math.pow(1 - i / steps, 3);
    let s = "", last = 0;
    for (const t of toks) {
      const v = (t.from ?? 0) + (t.value - (t.from ?? 0)) * f;
      let pre = text.slice(last, t.at);
      // a signed number shows no sign while it reads zero ("-3.1%" starts at "0.0%", not "-0.0%")
      const signed = /[-+−]/.test(text[t.at - 1] ?? "") && !/[\d.%]/.test(text[t.at - 2] ?? "");
      if (signed && !/[1-9]/.test(fmtNum(t, v))) pre = pre.slice(0, -1);
      s += pre + fmtNum(t, v);
      last = t.at + t.raw.length;
    }
    out.push(s + text.slice(last));
  }
  return out;
}
/** When a long-form stat's number has landed, and how long it counts (shared with the critic's key frames). */
export function statTiming(start: number, end: number, text: string) {
  const t = start + 0.3, dur = end - start;
  const cd = Math.max(0.6, Math.min(1.3, dur * 0.45, end - 0.35 - t));
  const count = countable(text) && dur >= 1.4;
  return { t, cd, count, settled: t + (count ? cd : 0.6) };
}
/** Typewriter timing of a long-form `typed` title (shared with the critic's key frames). */
export function typedTiming(start: number, end: number, text: string) {
  const n = [...text.trim().replace(/\s+/g, "")].length, t = start + 0.25;
  const per = Math.min(0.055, Math.max(0.02, Math.min(1.3, (end - start) * 0.4) / Math.max(1, n)));
  return { t, n, per, settled: t + n * per };
}
/** Typewriter markup: one span per character (words kept unbreakable), the last character marked for the caret. */
export function typedHtml(text: string): string {
  const words = text.trim().split(/\s+/);
  return words.map((w, wi) => `<span class="tw">${[...w].map((ch, ci) => `<span class="ch${wi === words.length - 1 && ci === [...w].length - 1 ? " lc" : ""}">${esc(ch)}</span>`).join("")}</span>`).join(" ");
}
/** Sombre beats (a `fade` shot, the night palette or a sad/sick/worried hero) get no flash, hop or comic effect. */
const SOMBRE_FACES = new Set(["sad", "sick", "worried"]);
/** Shorts render exactly as before 2026-11-17: a newer enum in a vertical plan falls back to the old behaviour. */
const VERTICAL_TRANSITION: Record<string, Shot["transition"]> = { lens: "iris", wave: "slide-up", corner: "slide-up", flash: "cut" };
/** A shot as a Short draws it: newer enums (lens, wave, corner, flash, dive, typed) mapped onto the old ones. */
export function verticalShot<S extends Shot>(shot: S): S {
  return {
    ...shot, transition: VERTICAL_TRANSITION[shot.transition] ?? shot.transition, camera: shot.camera === "dive" ? "push-in" : shot.camera,
    title: shot.title.style === "typed" ? { ...shot.title, style: "headline" } : shot.title,
  };
}
/** Medical guardrail: the engine never draws extra attention (a hop, a late entrance) to dosing or injecting art. */
export const DOSING = (e: ShotElement) => e.type === "syringe" || e.type === "pill" || /syringe|needle|inject|\bpen\b|pill|tablet|capsule|dose|vial/i.test(e.variant);
// medical safety (devices never drawn, no dose talk): see vector/medicalSafety.ts
export { safeMedicalArt } from "./vector/medicalSafety.js";

// ------------------------------------------------------------------ timing
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);

/** Place each shot at the moment its cue words are spoken (fallback: evenly split within its scene). */
export function timeShots(shots: Shot[], tl: Timeline): TimedShot[] {
  const byScene = new Map<string, Shot[]>();
  for (const s of shots) byScene.set(s.scene_id, [...(byScene.get(s.scene_id) ?? []), s]);
  const out: TimedShot[] = [];
  tl.scenes.forEach((sc, si) => {
    const list = byScene.get(sc.id) ?? [];
    const sceneStart = si === 0 ? 0 : sc.start;
    const sceneEnd = tl.scenes[si + 1]?.start ?? tl.duration;
    const words = sc.words.map(w => ({ ...w, n: norm(w.text)[0] ?? "" }));
    let minIdx = 0;
    list.forEach((shot, k) => {
      let start = sceneStart + ((sceneEnd - sceneStart) * k) / Math.max(1, list.length);
      const cue = norm(shot.cue).slice(0, 3);
      if (k > 0 && cue.length) {
        for (let i = minIdx; i < words.length; i++) {
          if (cue.every((c, j) => words[i + j]?.n === c)) { start = words[i].start - 0.1; minIdx = i + 1; break; }
        }
      }
      if (k === 0) start = sceneStart;
      out.push({ ...shot, start, end: sceneEnd });
    });
    if (!list.length && out.length) out[out.length - 1].end = sceneEnd; // scene without shots: extend previous
  });
  out.sort((a, b) => a.start - b.start);
  for (let i = 0; i < out.length; i++) {
    out[i].end = i + 1 < out.length ? out[i + 1].start : tl.duration;
    if (out[i].end - out[i].start < 0.8 && i + 1 < out.length) out[i + 1].start = out[i].start; // absorb micro-shots
  }
  return out.filter(s => s.end - s.start >= 0.3);
}

// ------------------------------------------------------------------ builders
interface ShotMeta { start: number; end: number; punchId: string; /** sombre beat: slow camera pushes only */ sombre?: boolean; /** dive length (s) */ dive?: number }
interface Ctx {
  els: string[]; anims: string[]; cues: SfxCue[]; n: number; W: number; H: number; vertical: boolean; theme: Theme;
  /** scene 1's on-screen hook text, used as the first shot's headline when it has no title and no captions carry it */
  hook?: string;
  /** the first spoken words (fallback hook when scene 1 has no on-screen text) */
  firstWords?: string;
  /** captions are burned in: titles then hold briefly and captions hide while a title is up */
  captions: boolean;
  /** times of clear visual changes (cuts, big entrances, titles in/out, punch-ins) for pacing */
  changes: number[];
  /** intervals in which a title block is on screen (captions are hidden there) */
  textWin: [number, number][];
  meta: ShotMeta[];
  /** in-place events (counters, hero reactions): engine punches keep clear of them so changes spread out */
  events: number[];
  /** cuts the scene score sees for sure (every transition but a fade): the long-form pacing fills between these */
  strong: number[];
  /** time of the last white flash (photosensitivity: at most one per 3 s) */
  lastFlash: number;
  /** long-form: what the engine itself moves (camera punches and pushes, hero hops and turns, dives), as [from, to]
   *  in seconds; `dive` marks a zoom that ends on a cut. The beat-sync render check must not count these as cuts. */
  engine: { a: number; b: number; quick?: boolean; dive?: boolean }[];
  /** long-form sombre shots [start, end]: exempt from the plan pacing gate */
  sombreWin: [number, number][];
}
const uid = (c: Ctx, p: string) => `${p}${c.n++}`;

function svgOf(type: string, p: Palette, tone: Tone, seed: number, variant: string) {
  if (type === "icon") {
    let hit = resolveIcon(variant, seed);
    if (hit && BLOCKED_ICON.test(hit.name)) hit = resolveIcon(DEVICE_STANDIN, seed); // medical safety: see safeMedicalArt
    if (hit) return `<svg viewBox="-60 -60 120 120" width="100%" height="100%" overflow="visible">${iconSvg(hit, p, tone)}</svg>`;
    log.warn(`no illustration matches "${variant}"; using built-in art`);
  }
  const fn = COMPONENTS[type] ?? COMPONENTS.cell;
  return `<svg viewBox="-60 -60 120 120" width="100%" height="100%" overflow="visible">${fn({ p, tone, seed, variant })}</svg>`;
}

function background(c: Ctx, shot: TimedShot, p: Palette, seed: number): string {
  const { W, H } = c;
  const r = rng(seed);
  const [c0, c1] = p.bg;
  const doodle = c.theme === "doodle";
  const scene = LIGHT_BACKDROPS.has(shot.background);
  let html = doodle && !scene ? `<div class="paper"></div>` : `<div style="position:absolute;inset:-6%;background:radial-gradient(ellipse at 50% 45%, ${c0} 0%, ${c1} 78%)"></div>`;
  const dots = (n: number, rmin: number, rmax: number, colors: string[], op: number) => Array.from({ length: n }, () => {
    const rr = rmin + r() * (rmax - rmin), col = colors[Math.floor(r() * colors.length)];
    return `<div class="bk" style="position:absolute;left:${(r() * 110 - 5).toFixed(1)}%;top:${(r() * 110 - 5).toFixed(1)}%;width:${rr}px;height:${rr}px;margin:-${rr / 2}px;border-radius:50%;background:radial-gradient(circle, ${col} 0%, ${col}00 70%);opacity:${op}"></div>`;
  }).join("");
  switch (shot.background) {
    case "cells": {
      const tone: Tone = "primary";
      for (let i = 0; i < 14; i++) {
        const s = (c.vertical ? 0.22 : 0.18) * H * (0.7 + r() * 0.6);
        html += `<div class="bgcell" style="position:absolute;left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;width:${s}px;height:${s}px;margin:-${s / 2}px;opacity:.28">${svgOf("cell", p, tone, seed + i, "healthy")}</div>`;
      }
      html += dots(10, 60, 180, p.bokeh, 0.35);
      break;
    }
    case "bloodstream":
      if (!doodle) html += `<div style="position:absolute;inset:-6%;background:linear-gradient(180deg, #5c0a1f 0%, #b3122a 50%, #5c0a1f 100%)"></div>`;
      for (let i = 0; i < 16; i++) {
        const s = 0.14 * H * (0.6 + r() * 0.8);
        html += `<div class="flow" style="position:absolute;left:${(r() * 100).toFixed(1)}%;top:${(15 + r() * 70).toFixed(1)}%;width:${s}px;height:${s}px;margin:-${s / 2}px;opacity:${(0.22 + r() * 0.25).toFixed(2)}">${svgOf("cell", p, "primary", seed + i, "red")}</div>`;
      }
      break;
    case "tissue":
      for (let i = 0; i < 4; i++) html += `<div style="position:absolute;left:-10%;right:-10%;top:${55 + i * 12}%;height:40%;border-radius:50% 50% 0 0;background:${i % 2 ? p.primary : p.secondary};opacity:${0.25 + i * 0.12}"></div>`;
      html += dots(12, 40, 140, p.bokeh, 0.3);
      break;
    case "stars":
      html += Array.from({ length: 70 }, () => { const s = 1 + r() * 3; return `<div style="position:absolute;left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;width:${s}px;height:${s}px;border-radius:50%;background:#fff;opacity:${(0.3 + r() * 0.7).toFixed(2)}"></div>`; }).join("");
      html += dots(6, 200, 500, p.bokeh, 0.18);
      break;
    case "clinic":
      html += `<div style="position:absolute;left:-10%;right:-10%;bottom:-6%;height:30%;background:${p.primaryRim};opacity:.45;border-radius:50% 50% 0 0 / 30% 30% 0 0"></div>`;
      html += dots(8, 80, 260, p.bokeh, 0.5);
      break;
    case "bokeh":
      html += dots(22, 60, 320, p.bokeh, 0.4);
      break;
    case "room": case "kitchen": case "outdoors":
      html = backdropSvg(shot.background, W, H, p, r);
      break;
    case "body":
      html += backdropSvg("body", W, H, p, r) + dots(8, 80, 240, p.bokeh, 0.25);
      break;
    default:
      html += dots(8, 100, 300, p.bokeh, 0.25);
  }
  // floating particles on every shot: the world is never static
  html += Array.from({ length: scene ? 8 : 26 }, () => { const s = 3 + r() * 7; return `<div class="pt" style="position:absolute;left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;width:${s}px;height:${s}px;border-radius:50%;background:${p.bokeh[Math.floor(r() * p.bokeh.length)]};opacity:${(0.35 + r() * 0.5).toFixed(2)}"></div>`; }).join("");
  html += `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${p.dark && !scene && !doodle ? 0.45 : 0.1}) 100%)"></div>`;
  return html;
}

/**
 * Idle motion. `gain` scales the swing of the oscillating moves (1 = the original amounts, used by Shorts and
 * sombre beats). Long-form uses IDLE_GAIN_LONG: on the 2026-11-17 test render a bobbing element on the 1080-high
 * frame scored about 0.0015 per frame, under the 0.003 a viewer (and the style study) counts as motion.
 */
function motionTween(sel: string, m: ShotElement["motion"], t0: number, dur: number, r: () => number, gain = 1): string {
  const reps = (period: number) => Math.max(0, Math.ceil(dur / period) - 1);
  // long-form slow swings (float, breathe, orbit) run at SLOW_SWING_LONG of their period, so each on-twos step moves
  // far enough to read
  const per = (1.4 + r() * 1.2) * (gain !== 1 ? SLOW_SWING_LONG : 1);
  const g = (v: number) => +(v * gain).toFixed(gain === 1 ? 2 : 1);
  const out = motionSwitch();
  // drawn "on twos": every idle move (swings, pulses, spins, drifts) advances in IDLE_STEPS steps a second instead
  // of gliding
  return gain !== 1 ? out.replace(/duration:([\d.]+),((?:yoyo:true,repeat:\d+,)?)ease:"[^"]+"/g, (_, d, rep) => `duration:${d},${rep}ease:"steps(${Math.max(1, Math.round(+d * IDLE_STEPS))})"`) : out;
  function motionSwitch(): string {
  switch (m) {
    case "float": return `tl.to("${sel}",{y:-${((10 + r() * 14) * gain).toFixed(0)},duration:${per.toFixed(2)},yoyo:true,repeat:${reps(per)},ease:"sine.inOut"},${f3(t0)});`;
    case "bob": return `tl.to("${sel}",{y:-${g(8)},rotation:${g(3)},duration:0.5,yoyo:true,repeat:${reps(0.5)},ease:"sine.inOut"},${f3(t0)});`;
    case "breathe": return `tl.to("${sel}",{scale:${+(1 + 0.07 * gain).toFixed(3)},duration:${per.toFixed(2)},yoyo:true,repeat:${reps(per)},ease:"sine.inOut"},${f3(t0)});`;
    case "pulse": return `tl.to("${sel}",{scale:1.15,duration:0.35,yoyo:true,repeat:${reps(0.35)},ease:"power1.inOut"},${f3(t0)});`;
    case "spin": return `tl.to("${sel}",{rotation:${r() > 0.5 ? "" : "-"}${Math.round(40 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`;
    case "wobble": return `tl.to("${sel}",{rotation:${g(7)},duration:0.6,yoyo:true,repeat:${reps(0.6)},ease:"sine.inOut"},${f3(t0)});`;
    case "drift-left": return `tl.to("${sel}",{x:-${Math.round(40 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`;
    case "drift-right": return `tl.to("${sel}",{x:${Math.round(40 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`;
    case "swim": return `tl.to("${sel}",{x:${Math.round(30 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});tl.to("${sel}",{y:-${g(16)},rotation:-${g(6)},duration:0.8,yoyo:true,repeat:${reps(0.8)},ease:"sine.inOut"},${f3(t0)});`;
    case "orbit": return `tl.to("${sel}",{x:${g(30)},duration:${per.toFixed(2)},yoyo:true,repeat:${reps(per)},ease:"sine.inOut"},${f3(t0)});tl.to("${sel}",{y:${g(30)},duration:${(per / 2).toFixed(2)},yoyo:true,repeat:${reps(per / 2)},ease:"sine.inOut"},${f3(t0 + per / 4)});`;
    default: return "";
  }
  }
}

function enterTween(sel: string, e: ShotElement["enter"], t: number, W: number): string {
  switch (e) {
    case "pop": return `tl.fromTo("${sel}",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.5,ease:"back.out(2.2)"},${f3(t)});`;
    case "grow": return `tl.fromTo("${sel}",{scale:0.2,opacity:0},{scale:1,opacity:1,duration:1.1,ease:"power3.out"},${f3(t)});`;
    case "fade": return `tl.fromTo("${sel}",{opacity:0},{opacity:1,duration:0.6},${f3(t)});`;
    case "slide-left": return `tl.fromTo("${sel}",{x:${W * 0.6},opacity:0},{x:0,opacity:1,duration:0.7,ease:"power3.out"},${f3(t)});`;
    case "slide-right": return `tl.fromTo("${sel}",{x:${-W * 0.6},opacity:0},{x:0,opacity:1,duration:0.7,ease:"power3.out"},${f3(t)});`;
    case "rise": return `tl.fromTo("${sel}",{y:300,opacity:0},{y:0,opacity:1,duration:0.7,ease:"back.out(1.4)"},${f3(t)});`;
    default: return "";
  }
}

// ------------------------------------------------------------------ characters
const PEOPLE = /\b(man|woman|men|women|person|people|boy|girl|baby|child|kid|family|doctor|nurse|worker|teacher|runner|face|pregnant|elder|old|student|athlete)\b/i;
/** People already have faces; everything else (organs, food, cells, pills...) can be personified. */
const canHaveFace = (el: ShotElement) => el.type !== "person" && !(el.type === "icon" && PEOPLE.test(el.variant));

interface Speaker { el: ShotElement; face?: ReturnType<typeof faceSvg>; x: number; y: number; sizePx: number; enterT: number }

/** Comic speech bubbles for up to two talking elements per shot, spoken one after the other (mouth animates). */
function speechBubbles(c: Ctx, shot: TimedShot, speakers: Speaker[], starts: number[] = []): string {
  let html = "", prevEnd = 0;
  const fs = c.vertical ? 50 : 40, maxW = c.vertical ? 800 : 640;
  for (const sp of speakers.slice(0, 2)) {
    const text = sp.el.says.trim().replace(/\s+/g, " ").slice(0, 80);
    const words = text.split(" ").length;
    const start = Math.max(sp.enterT + 0.35, prevEnd + 0.1);
    const end = Math.min(shot.end - 0.05, start + Math.min(3.6, Math.max(1.6, words * 0.3 + 1.2)));
    if (end - start < 1) continue;
    prevEnd = end;
    starts.push(start);
    // where does it fit: above the speaker, else below, else pinned near the top
    const lines = Math.ceil((text.length * fs * 0.52) / (maxW - 70));
    const hPct = ((lines * fs * 1.12 + 70) / c.H) * 100;
    const half = ((sp.sizePx * 0.42) / c.H) * 100;
    const top = sp.y - half, bottom = sp.y + half;
    const floor = c.vertical ? 60 : 92;
    let pos: string, dir: "down" | "up";
    if (top - 2 - hPct >= 3) { pos = `top:${(top - 2).toFixed(1)}%`; dir = "down"; }
    else if (bottom + 2 + hPct <= floor) { pos = `top:${(bottom + 2).toFixed(1)}%`; dir = "up"; }
    else { pos = `top:${(3 + hPct).toFixed(1)}%`; dir = "down"; }
    const ax = Math.min(100, Math.max(0, ((sp.x - 5) / 90) * 100)); // anchor across the padded band
    const tail = Math.min(86, Math.max(14, ax));
    const bid = uid(c, "sb");
    html += `<div class="bwrap" style="${pos}"><div class="banchor" style="left:${ax.toFixed(1)}%;transform:translateX(-${ax.toFixed(1)}%);${dir === "down" ? "bottom:0" : "top:0"};max-width:${maxW}px">` +
      `<div id="${bid}" class="bubble" style="font-size:${fs}px;opacity:0;transform-origin:${tail.toFixed(0)}% ${dir === "down" ? "100%" : "0%"}">${esc(text)}<i class="tail ${dir}" style="left:${tail.toFixed(0)}%"></i></div></div></div>`;
    c.anims.push(`tl.fromTo("#${bid}",{scale:0.3,opacity:0},{scale:1,opacity:1,duration:0.3,ease:"back.out(2.4)"},${f3(start)});`);
    c.anims.push(`tl.fromTo("#${bid}",{opacity:1},{opacity:0,duration:0.18,immediateRender:false},${f3(end - 0.18)});`);
    c.cues.push({ t: start, sfx: "blip", gain: 0.5 });
    if (sp.face) {
      const talk = Math.min(end - start - 0.2, Math.max(0.6, words * 0.28));
      const flaps = Math.max(1, Math.round(talk / 0.22)) * 2 - 1;
      c.anims.push(`tl.set("#${sp.face.mouth}",{opacity:0},${f3(start)});tl.set("#${sp.face.talk}",{opacity:1},${f3(start)});` +
        `tl.fromTo("#${sp.face.jaw}",{scaleY:0.25},{scaleY:1,duration:0.11,yoyo:true,repeat:${flaps},ease:"sine.inOut",transformOrigin:"50% 20%"},${f3(start)});` +
        `tl.set("#${sp.face.mouth}",{opacity:1},${f3(start + talk)});tl.set("#${sp.face.talk}",{opacity:0},${f3(start + talk)});`);
    }
  }
  return html;
}

/** Big-number size that always fits the frame width (heavy display font ≈ 0.64 em per character). */
const statSize = (text: string, c: Ctx) => {
  const base = c.vertical ? 230 : 210, room = c.vertical ? (SHORTS_SAFE.right - SHORTS_SAFE.left) * 0.95 : c.W * 0.7;
  return Math.round(Math.max(96, Math.min(base, room / (Math.max(1, [...text].length) * 0.64))));
};

function shotHtml(c: Ctx, shot: TimedShot, index: number): string {
  const p = palette(shot.mood);
  const seed = hashStr(shot.scene_id + shot.cue + index);
  const r = rng(seed);
  const dur = shot.end - shot.start;
  const shotId = uid(c, "shot");
  const camId = uid(c, "cam");
  const t0 = shot.start;
  const punchId = uid(c, "pn");
  // the opening shot: everything that matters is already on screen at frame 0
  const first = index === 0 && t0 < 0.05;
  const long = !c.vertical;
  // Shorts keep the pre-2026-11-17 engine byte for byte: newer enums map onto the old behaviour
  if (!long) shot = verticalShot(shot);
  // medical safety first, so the hook check, hero choice, faces and bubbles all see what is drawn
  shot = { ...shot, elements: shot.elements.map(safeMedicalArt) };
  let inner = background(c, shot, p, seed);
  if (index > 0) c.changes.push(t0);

  // frame 0 needs the hook text: without burned-in captions (long-form) the first shot always opens on a headline:
  // scene 1's on-screen text, or the first spoken words when there is none or the hero talks (a bubble line is not a hook)
  if (first && shot.title.style === "none" && !c.captions) {
    const text = (shot.elements.some(e => e.says?.trim()) ? "" : c.hook?.trim()) || c.firstWords?.trim();
    if (text) shot = { ...shot, title: { style: "headline", text, sub: "", items: [] } };
  }
  // with burned-in captions, captions win: only the first shot keeps its title (for OPENING_TITLE s); later titles are
  // not drawn, and their shots don't reserve the title band. Big-number stats are art, not a second sentence: they
  // stay (number + a label of at most 8 words, above the caption band) and the captions keep running under them
  if (c.captions && !first && shot.title.style !== "none" && shot.title.style !== "stat") shot = { ...shot, title: { style: "none", text: "", sub: "", items: [] } };
  if (c.captions && shot.title.style === "stat") shot = { ...shot, title: { ...shot.title, sub: shot.title.sub.split(/\s+/).filter(Boolean).slice(0, 8).join(" ") } };

  // ---- elements (swarm = count > 1)
  const depthZ = { bg: 1, mid: 2, fg: 3 };
  const depthPar = { bg: 0.4, mid: 1, fg: 1.6 };
  const speakers: Speaker[] = [];
  // the shot's main character: the biggest single (non-swarm) foreground/mid element
  const heroOf = (els: ShotElement[]) => els.filter(e => e.depth !== "bg").sort((a, b) => (Math.round(a.count) > 1 ? 1 : 0) - (Math.round(b.count) > 1 ? 1 : 0) || b.size - a.size)[0];
  // long-form: tiny characters read as an empty frame (and their motion barely registers); the main character is at
  // least 35% of the height in the first 30 s and 30% after that (the title band below still applies)
  let planned = shot.elements;
  const hero0 = heroOf(planned);
  const heroMin = t0 < 30 ? LONG_HERO_MIN : LONG_HERO_MIN_LATER;
  if (long && hero0 && Math.round(hero0.count) <= 1 && hero0.size < heroMin)
    planned = planned.map(e => (e === hero0 ? { ...e, size: heroMin, y: Math.min(e.y, 100 - 3 - heroMin / 2) } : e));
  // Title band: when the shot has a headline or stat, keep every foreground/mid element's top below it
  const titled = shot.title.style === "headline" || shot.title.style === "stat" || shot.title.style === "typed";
  const bandBottom = c.vertical ? 34 : 44; // % of frame height the title may use
  const elements = !titled ? planned : planned.map(e => {
    if (e.depth === "bg") return e;
    // a swarm's copies scatter `spread` up and down and are drawn up to 1.3x (people at least 14%), so the whole crowd
    // must fit below the band, not just its centre (2026-11-18: a crowd covered the "478" stat's caption)
    if (Math.round(e.count) > 1) {
      const floor = c.vertical ? 70 : 97; // a Short's captions sit from ~70% down (owner, 2026-11-24): no crowd behind them
      const room = floor - bandBottom - 2;
      const size = Math.min(e.size, room / 1.3);
      const reach = (Math.max(e.type === "person" ? 14 : 4, size) * 1.3) / 2;
      const spread = Math.max(0, Math.min(e.spread, room / 2 - reach));
      const y = Math.min(floor - reach - spread, Math.max(e.y, bandBottom + 2 + reach + spread));
      return y !== e.y || size !== e.size || spread !== e.spread ? { ...e, y, size, spread } : e;
    }
    const half = e.size / 2;
    const size = Math.min(e.size, (100 - 3 - bandBottom)); // must fit between the band and the bottom edge
    const y = Math.min(100 - 3 - size / 2, Math.max(e.y, bandBottom + size / 2 + (c.vertical ? 0 : 2)));
    return y !== e.y || size !== e.size ? { ...e, y, size, spread: Math.min(e.spread, 100 - y - half) } : e;
  });
  const hero = heroOf(elements);
  // punch-ins zoom toward the main character
  const heroOrigin = hero ? `${Math.min(80, Math.max(20, hero.x)).toFixed(0)}% ${Math.min(75, Math.max(25, hero.y)).toFixed(0)}%` : "50% 50%";
  let origin = heroOrigin;
  if (long) {
    // long-form punches run all video: a labelled element near an edge would have its label pushed off frame, so
    // the zoom is anchored on that edge instead (it then grows away from it)
    const lab = elements.filter(e => e.label && e.depth !== "bg");
    const lowest = Math.max(0, ...lab.map(e => e.y + e.size / 2 + (60 / c.H) * 100));
    const sideR = lab.some(e => e.x + ((e.size / 2) * c.H) / c.W > 88), sideL = lab.some(e => e.x - ((e.size / 2) * c.H) / c.W < 12);
    if (lowest > 92 || sideR || sideL) {
      const [ox, oy] = origin.split(" ");
      origin = `${sideR && !sideL ? "100%" : sideL && !sideR ? "0%" : ox} ${lowest > 92 ? "100%" : oy}`;
    }
  }
  c.meta[index] = { start: t0, end: shot.end, punchId };
  // sombre beat (a `fade` into the shot, the night palette or a sad/sick/worried character): no flash, no hop, no
  // snap zoom (slow camera pushes only), planned stillness kept, gentle idle swing, and the plan pacing gate leaves it
  // alone. The first shot's planned transition is never played, so it doesn't count.
  const sombre = shot.mood === "night" || elements.some(e => e.depth !== "bg" && SOMBRE_FACES.has(e.face)) || (index > 0 && shot.transition === "fade");
  if (long && sombre) c.sombreWin.push([t0, shot.end]);
  // in-place event floor (long-form, 2026-11-17): a shot of 3 s or more gets something happening after its first
  // half. If the plan has nothing there (a late entrance or a second speaker), the hero reacts (hop or turn); on a
  // sombre beat the last planned supporting element's entrance moves into the second half instead (no new art)
  const mid = dur / 2;
  const lateInPlan = elements.some(e => e.enter !== "none" && e.depth !== "bg" && e.enter_at * dur >= mid) ||
    elements.filter(e => e.says?.trim()).length >= 2 || elements.some(e => e.says?.trim() && e.enter_at * dur + 0.35 >= mid);
  let retime: ShotElement | undefined;
  if (long && dur >= 3 && !lateInPlan && sombre) {
    retime = elements.filter(e => e !== hero && !DOSING(e) && e.depth !== "bg" && e.enter !== "none" && e.enter_at <= 0.5).sort((a, b) => b.enter_at - a.enter_at)[0];
  }
  let heroRx: string | undefined;
  let side: { rx: string; at: number; size: number } | undefined;
  for (const el of elements) {
    const expr = el.face && el.face !== "none" ? el.face : el.says && canHaveFace(el) ? "happy" : "none";
    const maxCopies = el.type === "person" ? 6 : (["heart", "brain", "liver", "stomach", "lungs", "kidney", "gut"].includes(el.type) ? 2 : 30);
    const copies = Math.max(1, Math.min(maxCopies, Math.round(el.count)));
    const minSize = el.type === "person" ? 14 : copies > 1 ? 4 : 6; // % of frame height
    for (let k = 0; k < copies; k++) {
      const jx = copies > 1 ? (r() - 0.5) * 2 * el.spread : 0, jy = copies > 1 ? (r() - 0.5) * 2 * el.spread : 0;
      const sizePx = (Math.max(minSize, el.size) / 100) * c.H * (copies > 1 ? 0.7 + r() * 0.6 : 1) * (el.depth === "bg" ? 0.8 : 1);
      const id = uid(c, "el");
      const halfX = sizePx > c.H * 0.15 ? (sizePx / 2 / c.W) * 100 + 2 : -5, halfY = sizePx > c.H * 0.15 ? (sizePx / 2 / c.H) * 100 + 2 : -5;
      const x = Math.min(100 - halfX, Math.max(halfX, el.x + jx)), y = Math.min(100 - halfY, Math.max(halfY, el.y + jy));
      const face = expr !== "none" && canHaveFace(el) && k < 6 ? faceSvg(expr, uid(c, "fc")) : undefined;
      let art = svgOf(el.type, p, el.tone, seed + k * 7 + hashStr(el.type + el.variant + el.x), el.variant);
      if (face) art = stripFace(art) + face.svg;
      const label = el.label && k === 0 ? `<div class="elabel" style="font-size:${Math.max(22, Math.min(40, sizePx * 0.14)).toFixed(0)}px">${esc(el.label)}</div>` : "";
      inner += `<div id="${id}" class="el" style="left:${x}%;top:${y}%;width:${sizePx.toFixed(0)}px;height:${sizePx.toFixed(0)}px;margin:-${(sizePx / 2).toFixed(0)}px;z-index:${depthZ[el.depth] ?? 2};${el.depth === "bg" ? "opacity:.55;" : ""}">` +
        // layers: #id = entrance, #idp = camera parallax, #idi = idle motion, #idr = hero reaction (one writer per
        // property per layer)
        `<div class="par" id="${id}p"><div class="spin" id="${id}i">${long ? `<div class="rx" id="${id}r">` : ""}<div class="art" style="position:relative;width:100%;height:100%;${el.flip ? "transform:scaleX(-1)" : ""}">${art}</div>${long ? "</div>" : ""}</div></div>${label}</div>`;
      if (long && el === hero && k === 0) heroRx = `${id}r`;
      const enterAt = el === retime ? Math.max(el.enter_at, 0.55) : el.enter_at;
      let enterT = t0 + Math.min(dur - 0.4, enterAt * dur) + (copies > 1 ? k * Math.min(0.08, 1.2 / copies) : 0);
      // opening shot: the hero and anything due in the first 0.6 s are already there at frame 0 (no fade/pop)
      const present = first && (el === hero || enterT - t0 < 0.6 || el.enter === "none");
      if (present) enterT = t0;
      if (face?.blinks) {
        for (let bt = enterT + 0.8 + r() * 1.5; bt < shot.end - 0.3; bt += 2.2 + r() * 1.8)
          c.anims.push(`tl.fromTo("#${face.eyes}",{scaleY:1},{scaleY:0.1,duration:0.07,yoyo:true,repeat:1,transformOrigin:"50% 50%"},${f3(bt)});`);
      }
      if (el.says && k === 0) speakers.push({ el, face, x, y, sizePx, enterT });
      if (long && k === 0 && copies === 1 && el !== hero && el.depth !== "bg" && el.size >= 12 && !DOSING(el) && (!side || el.size > side.size))
        side = { rx: `${id}r`, at: enterT, size: el.size };
      if (present) {
        // alive from the first frame: a gentle settle that starts fully visible (scale 1 -> 1.04)
        if (el === hero && k === 0) c.anims.push(`tl.fromTo("#${id}",{scale:1},{scale:1.04,duration:${f3(Math.min(1.6, dur))},ease:"sine.out"},${f3(t0)});`);
      } else {
        c.anims.push(enterTween(`#${id}`, el.enter, enterT, c.W));
        // only entrances big enough to read as a change count for pacing (a small prop popping in barely registers:
        // measured with ffmpeg scene scores on a test render, 2026-11-12)
        if (el.enter !== "none" && el.depth !== "bg" && k === 0 && (el.size >= 30 || copies > 3)) c.changes.push(enterT);
        // data art draws itself: chart bars grow one by one, an arrow draws on from its tail
        // (SVG: the origin goes in BOTH ends with smoothOrigin off, or GSAP shifts each bar up by its height)
        if (long && el.type === "chart") c.anims.push(`tl.fromTo("#${id} .bar",{scaleY:0,transformOrigin:"50% 100%",smoothOrigin:false},{scaleY:1,transformOrigin:"50% 100%",smoothOrigin:false,duration:0.35,stagger:0.14,ease:"back.out(1.6)"},${f3(enterT + 0.15)});`);
        if (long && el.type === "arrow") c.anims.push(`tl.fromTo("#${id} .art",{clipPath:"inset(0% 100% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",duration:0.45,ease:"power2.out"},${f3(enterT + 0.1)});`);
      }
      // idle-motion floor: nothing planned as "none" stays dead still, except on a sombre beat (stillness reads
      // as weight there). Big single elements breathe, small or grouped ones float.
      const motion = long && el.motion === "none" && !sombre ? (el.size >= 20 && copies === 1 ? "breathe" : "float") : el.motion;
      c.anims.push(motionTween(`#${id}i`, motion, t0, dur, r, long && !sombre ? IDLE_GAIN_LONG : 1));
      // parallax drift with the camera
      if (shot.camera !== "static") c.anims.push(`tl.fromTo("#${id}p",{x:0},{x:${((r() - 0.5) * 30 * depthPar[el.depth]).toFixed(0)},duration:${f3(dur)},ease:"none"},${f3(t0)});`);
      if (el.enter !== "none" && k < 6 && !present) c.cues.push({ t: enterT, sfx: el.enter === "pop" ? (copies > 3 ? "bubble" : "pop") : el.enter === "grow" ? "swell" : "swoosh", gain: copies > 3 ? 0.35 : 0.6 });
    }
  }
  const bubbleStarts: number[] = [];
  const bubbles = speechBubbles(c, shot, speakers, bubbleStarts);
  if (long && dur >= REACT_MIN && !lateInPlan && !retime && !bubbleStarts.some(b => b >= t0 + mid) && heroRx && !sombre && hero && !DOSING(hero)) {
    // hero reaction in the second half, clear of the cut: four kinds in turn so it never reads as a tic. A smooth
    // idle swing barely registers on the scene score (2026-11-17: float and breathe at double speed moved the motion
    // share by 0.2 points), but a short gesture does, and it is what keeps a cartoon character alive between cuts.
    const t = +Math.min(shot.end - 0.9, t0 + dur * (0.5 + r() * 0.15)).toFixed(3);
    const kind = index % 4, H = c.H;
    const tween = [
      // squash and hop
      `tl.to("#${heroRx}",{keyframes:[{scaleX:1.1,scaleY:0.86,duration:0.12,ease:"power1.in"},{scaleX:0.95,scaleY:1.07,y:${-Math.round(H * 0.045)},duration:0.2,ease:"power2.out"},{scaleX:1,scaleY:1,y:0,duration:0.3,ease:"bounce.out"}],transformOrigin:"50% 100%"},${f3(t)});`,
      // a nod: tip forward, back, settle
      `tl.to("#${heroRx}",{keyframes:[{rotation:-9,duration:0.12,ease:"power2.out"},{rotation:6,duration:0.15,ease:"power2.inOut"},{rotation:0,duration:0.2,ease:"power2.out"}],transformOrigin:"50% 90%"},${f3(t)});`,
      // a turn (a flat character turning round)
      `tl.fromTo("#${heroRx}",{rotationY:0},{rotationY:360,duration:0.6,ease:"power2.inOut",transformOrigin:"50% 50%"},${f3(t)});`,
      // a quick swell, as if it just noticed something
      `tl.to("#${heroRx}",{keyframes:[{scale:1.12,duration:0.14,ease:"power2.out"},{scale:1,duration:0.32,ease:"back.out(2)"}],transformOrigin:"50% 70%"},${f3(t)});`,
    ][kind];
    c.anims.push(tween);
    // a soft pop on a hop, only in the opening minute (an engine sound every few seconds for 11 minutes would mask
    // the voice)
    if (kind === 0 && t <= PACING.long.sfxWindow) c.cues.push({ t: t + 0.12, sfx: "pop", gain: 0.3 });
    c.events.push(t);
    c.engine.push({ a: t, b: t + [0.62, 0.47, 0.6, 0.46][kind] });
  }
  // secondary action (long-form, not on a sombre beat): the biggest supporting element answers with a small swell in
  // the first half, after it has entered, so the hero is not the only thing alive between cuts
  if (long && side && dur >= REACT_MIN && !sombre) {
    const ts = +Math.max(side.at + 0.6, t0 + dur * (0.22 + r() * 0.1)).toFixed(3);
    if (ts < t0 + dur * 0.45 && ts < shot.end - 0.9) {
      c.anims.push(`tl.to("#${side.rx}",{keyframes:[{scale:1.14,duration:0.13,ease:"power2.out"},{scale:1,duration:0.3,ease:"back.out(2.2)"}],transformOrigin:"50% 75%"},${f3(ts)});`);
      c.events.push(ts);
      c.engine.push({ a: ts, b: ts + 0.43 });
    }
  }

  // particles + background life
  c.anims.push(`tl.to("#${shotId} .pt",{y:-${Math.round(25 * dur)},x:${Math.round(6 * dur)},duration:${f3(dur)},ease:"none",stagger:0},${f3(t0)});`);
  const bg = shot.background;
  if (bg !== "bloodstream") c.anims.push(`tl.to("#${shotId} .bk",{y:-${Math.round(8 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`);
  if (bg === "cells") c.anims.push(`tl.to("#${shotId} .bgcell",{rotation:${Math.round(4 * dur)},scale:1.05,duration:${f3(dur)},ease:"none"},${f3(t0)});`);
  if (bg === "bloodstream") c.anims.push(`tl.to("#${shotId} .flow",{x:-${Math.round(90 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`);
  if (bg === "outdoors" || bg === "room" || bg === "kitchen") c.anims.push(`tl.fromTo("#${shotId} .cloud",{x:0},{x:${Math.round(14 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`);

  // ---- camera
  const cam = shot.camera;
  if (cam === "push-in") c.anims.push(`tl.fromTo("#${camId}",{scale:1},{scale:1.09,duration:${f3(dur)},ease:"none"},${f3(t0)});`);
  if (cam === "pull-out") c.anims.push(`tl.fromTo("#${camId}",{scale:1.12},{scale:1,duration:${f3(dur)},ease:"power1.out"},${f3(t0)});`);
  if (cam === "pan-left") c.anims.push(`tl.fromTo("#${camId}",{x:${c.W * 0.04},scale:1.1},{x:${-c.W * 0.04},scale:1.1,duration:${f3(dur)},ease:"none"},${f3(t0)});`);
  if (cam === "pan-right") c.anims.push(`tl.fromTo("#${camId}",{x:${-c.W * 0.04},scale:1.1},{x:${c.W * 0.04},scale:1.1,duration:${f3(dur)},ease:"none"},${f3(t0)});`);
  if (cam === "drift") c.anims.push(`tl.fromTo("#${camId}",{x:-20,y:10,scale:1.04},{x:20,y:-10,scale:1.07,duration:${f3(dur)},ease:"sine.inOut"},${f3(t0)});`);
  // dive: a slow creep, then in the last ~0.7 s a hard zoom into the main character (scale 2.5 about its position),
  // so the cut reads as diving into it. One layer scales (the camera), never the individual SVG groups.
  if (cam === "dive") {
    const dd = Math.min(0.7, dur * 0.4);
    c.anims.push(`tl.fromTo("#${camId}",{scale:1},{scale:1.05,duration:${f3(dur - dd)},ease:"sine.inOut"},${f3(t0)});`);
    c.anims.push(`tl.to("#${camId}",{scale:2.5,duration:${f3(dd)},ease:"power3.in",immediateRender:false},${f3(shot.end - dd)});`);
    c.meta[index].dive = dd;
    c.engine.push({ a: shot.end - dd, b: shot.end, dive: true });
  }

  // ---- titles (outside the camera, so they stay crisp)
  let overlay = bubbles;
  const tt = shot.title;
  const labelSize = c.vertical ? 46 : 40;
  // long-form: a title appearing counts as a change (a small label pill doesn't; bubbles don't either). With burned-in
  // captions only the first shot has a title: it holds OPENING_TITLE s, the captions are hidden only in that window
  const hold = (kind: string, sel: string, tIn: number) => {
    if (!first && kind !== "label") c.changes.push(tIn);
    if (!c.captions || kind === "stat") return; // a stat is art: it stays for the shot and the captions keep running
    const out = Math.min(shot.end, tIn + OPENING_TITLE);
    if (out < shot.end - 0.25) {
      c.anims.push(`tl.fromTo("${sel}",{opacity:1},{opacity:0,duration:0.18,immediateRender:false},${f3(out - 0.18)});`);
      c.changes.push(out);
      c.textWin.push([tIn, out]);
    } else c.textWin.push([tIn, shot.end + TRANS_DUR]);
  };
  if (tt.style === "label" && tt.text) {
    const lid = uid(c, "lab");
    overlay += `<div id="${lid}" class="label" style="font-size:${labelSize}px;${c.vertical ? `left:${SHORTS_SAFE.left}px;right:${c.W - SHORTS_SAFE.right}px;width:fit-content;margin:0 auto;top:15%` : "left:5%;top:7%"}"><span class="ldot"></span>${esc(tt.text)}</div>`;
    const t = first ? t0 : t0 + Math.min(0.6, dur * 0.2);
    if (!first) {
      c.anims.push(`tl.fromTo("#${lid}",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.4,ease:"back.out(2)"},${f3(t)});`);
      c.cues.push({ t, sfx: "blip", gain: 0.55 });
    }
    hold("label", `#${lid}`, t);
  } else if ((tt.style === "headline" || tt.style === "typed") && tt.text) {
    const hid = uid(c, "hd");
    // typed: a typewriter section opener (one span per character, a caret on the newest one). On frame 0 it is
    // simply there (frame 0 is fully composed).
    const typed = tt.style === "typed" && !first;
    overlay += `<div id="${hid}" class="headline${typed ? " typed" : ""}" style="font-size:${c.vertical ? 96 : 104}px;top:${c.vertical ? 14 : 11}%">${typed ? typedHtml(tt.text) : esc(tt.text)}${tt.sub ? `<div class="hsub">${esc(tt.sub)}</div>` : ""}</div>`;
    const t = first ? t0 : t0 + 0.25;
    if (typed) {
      const { n, per } = typedTiming(t0, shot.end, tt.text);
      const caret = p.dark && !LIGHT_BACKDROPS.has(shot.background) && c.theme !== "doodle" ? "rgba(255,255,255,1)" : "rgba(29,20,64,1)";
      const none = caret.replace(",1)", ",0)");
      // the card (a boxed headline on illustrated backdrops) pops in first, then the characters type into it
      c.anims.push(`tl.fromTo("#${hid}",{opacity:0,scale:0.92},{opacity:1,scale:1,duration:0.18,ease:"power2.out"},${f3(t0)});`);
      c.anims.push(`tl.fromTo("#${hid} .ch",{opacity:0},{opacity:1,duration:0.01,stagger:${per.toFixed(4)}},${f3(t)});`);
      c.anims.push(`tl.fromTo("#${hid} .ch",{borderRightColor:"${none}"},{borderRightColor:"${caret}",duration:0.01,stagger:${per.toFixed(4)}},${f3(t)});`);
      c.anims.push(`tl.to("#${hid} .ch:not(.lc)",{borderRightColor:"${none}",duration:0.01,stagger:${per.toFixed(4)}},${f3(t + per)});`);
      const tEnd = t + n * per;
      // the caret blinks twice on the finished line, then goes
      for (const [dt, col] of [[0.25, none], [0.5, caret], [0.75, none]] as const) c.anims.push(`tl.set("#${hid} .lc",{borderRightColor:"${col}"},${f3(tEnd + dt)});`);
      if (tt.sub) c.anims.push(`tl.fromTo("#${hid} .hsub",{opacity:0,y:20},{opacity:1,y:0,duration:0.3},${f3(tEnd + 0.1)});`);
      c.cues.push({ t, sfx: "blip", gain: 0.45 });
      c.events.push(tEnd);
    } else if (!first) {
      c.anims.push(`tl.fromTo("#${hid}",{opacity:0,scale:1.25},{opacity:1,scale:1,duration:0.45,ease:"power4.out"},${f3(t)});`);
      c.cues.push({ t, sfx: "hit", gain: 0.7 });
    }
    hold("headline", `#${hid}`, t);
  } else if (tt.style === "stat" && tt.text && !long) {
    const sid = uid(c, "st");
    overlay += `<div id="${sid}" class="stat" style="top:${c.vertical ? 13 : 11}%"><div class="sv" style="font-size:${statSize(tt.text, c)}px">${esc(tt.text)}</div><div class="sl" style="font-size:${c.vertical ? 50 : 46}px">${esc(tt.sub)}</div></div>`;
    const t = first ? t0 : t0 + 0.3;
    if (!first) {
      c.anims.push(`tl.fromTo("#${sid} .sv",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.6,ease:"elastic.out(1,0.55)"},${f3(t)});`);
      c.anims.push(`tl.fromTo("#${sid} .sl",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${f3(t + 0.35)});`);
      c.cues.push({ t, sfx: "ding", gain: 0.6 });
    }
    hold("stat", `#${sid}`, t);
  } else if (tt.style === "stat" && tt.text) {
    // long-form: the number counts up (or pops) and sits on an accent bar that draws on with it (decoration, not
    // data: its length means nothing)
    const sid = uid(c, "st");
    const fs = statSize(tt.text, c);
    const barW = Math.round(Math.min(c.W * 0.36, [...tt.text].length * fs * 0.5));
    overlay += `<div id="${sid}" class="stat" style="top:11%"><div class="sv" style="font-size:${fs}px">${esc(tt.text)}</div><div class="sbar" style="width:${barW}px"><i></i></div><div class="sl" style="font-size:46px">${esc(tt.sub)}</div></div>`;
    const { t: tc, cd, count, settled } = statTiming(t0, shot.end, tt.text);
    const t = first ? t0 : tc;
    if (!first) {
      // count up from 0 in the planned format, landing exactly on the planned text; each step is a timeline set, so
      // any frame can be seeked to (GSAP onUpdate callbacks are skipped on a seek)
      if (count) {
        c.anims.push(`tl.fromTo("#${sid} .sv",{scale:0.55,opacity:0},{scale:1,opacity:1,duration:0.35,ease:"back.out(1.8)"},${f3(t)});`);
        // before t the block is hidden and holds the planned text; from t it shows 0, then counts
        const steps = Math.max(8, Math.min(26, Math.round(cd / 0.05)));
        // (escaped "<": the steps live inside the inline <script>)
        countSteps(tt.text, steps).forEach((s, i) => c.anims.push(`tl.set("#${sid} .sv",{textContent:${JSON.stringify(s).replace(/</g, "\\u003c")}},${f3(t + (cd * i) / steps)});`));
      } else {
        c.anims.push(`tl.fromTo("#${sid} .sv",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.6,ease:"elastic.out(1,0.55)"},${f3(t)});`);
      }
      c.anims.push(`tl.fromTo("#${sid} .sbar i",{scaleX:0},{scaleX:1,duration:${f3(count ? cd : 0.7)},ease:"power3.out"},${f3(t)});`);
      c.anims.push(`tl.fromTo("#${sid} .sl",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${f3(t + 0.35)});`);
      c.cues.push({ t: count ? t + cd : t, sfx: "ding", gain: 0.6 });
      c.events.push(settled);
    }
    hold("stat", `#${sid}`, t);
  } else if (tt.style === "chips" && tt.items?.length) {
    const base = uid(c, "ch");
    overlay += `<div id="${base}" class="chips" style="${c.vertical ? `top:11%;left:${SHORTS_SAFE.left}px;right:${c.W - SHORTS_SAFE.right}px;flex-wrap:wrap` : "top:8%"}">${tt.items.map((it, i) => `<span id="${base}_${i}" class="chip" style="font-size:${c.vertical ? 44 : 34}px">${esc(it)}</span>`).join("")}</div>`;
    tt.items.forEach((_, i) => {
      if (first) return;
      const t = t0 + 0.3 + i * Math.min(0.5, (dur * 0.6) / tt.items.length);
      c.anims.push(`tl.fromTo("#${base}_${i}",{opacity:0,y:-30},{opacity:1,y:0,duration:0.35,ease:"back.out(2)"},${f3(t)});`);
      c.cues.push({ t, sfx: "blip", gain: 0.45 });
    });
    hold("chips", `#${base}`, first ? t0 : t0 + 0.3);
  }

  // ---- transition in
  let tr: string = index === 0 ? "cut" : shot.transition;
  // a sombre beat (or, for flash, the shot straight after one) gets no comic or energetic transition: whip, lens,
  // wave, corner and flash become a fade; and at most one flash in any 3 s (photosensitivity), else a plain cut
  if (long && sombre && ["whip", "lens", "wave", "corner", "flash"].includes(tr)) tr = "fade";
  if (tr === "flash" && c.meta[index - 1]?.sombre) tr = "fade";
  if (tr === "flash" && t0 - c.lastFlash < 3) tr = "cut";
  if (tr === "flash") c.lastFlash = t0;
  c.meta[index].sombre = long && sombre;
  if (index > 0 && tr !== "fade") c.strong.push(t0);
  const clipOff = (d: number) => c.anims.push(`tl.set("#${shotId}",{clipPath:"none"},${f3(t0 + d + 0.02)});`);
  if (tr === "lens") {
    // a lens opening from where the incoming main character stands
    const at = hero ? `${Math.min(85, Math.max(15, hero.x)).toFixed(0)}% ${Math.min(85, Math.max(15, hero.y)).toFixed(0)}%` : "50% 50%";
    c.anims.push(`tl.fromTo("#${shotId}",{clipPath:"circle(0% at ${at})"},{clipPath:"circle(145% at ${at})",duration:0.5,ease:"power2.out"},${f3(t0)});`);
    clipOff(0.5);
  }
  if (tr === "wave") {
    // a soft wavy edge sweeping across (left to right or right to left)
    const ltr = r() > 0.5, ph = r() * 6, N = 9;
    // GSAP only interpolates the polygon when both ends are written the way the browser serializes them
    // (", " between points, no "12.0%"): otherwise the shot stays clipped away (seen on the first test render)
    const n1 = (v: number) => +v.toFixed(1);
    const edge = (base: number) => Array.from({ length: N }, (_, i) => `${n1(ltr ? base + 7 * Math.sin(ph + i * 1.1) : 100 - base - 7 * Math.sin(ph + i * 1.1))}% ${n1((i * 100) / (N - 1))}%`);
    const far = ltr ? "-20%" : "120%";
    const poly = (base: number) => `polygon(${far} 0%, ${edge(base).join(", ")}, ${far} 100%)`;
    c.anims.push(`tl.fromTo("#${shotId}",{clipPath:"${poly(-10)}"},{clipPath:"${poly(115)}",duration:0.5,ease:"power2.out"},${f3(t0)});`);
    clipOff(0.5);
  }
  if (tr === "corner") {
    // a diagonal wipe out of one corner
    const cx = r() > 0.5 ? 100 : 0, cy = r() > 0.5 ? 100 : 0, sx = cx ? -1 : 1, sy = cy ? -1 : 1;
    const tri = (L: number) => `polygon(${cx}% ${cy}%, ${cx + sx * L}% ${cy}%, ${cx}% ${cy + sy * L}%)`;
    c.anims.push(`tl.fromTo("#${shotId}",{clipPath:"${tri(0)}"},{clipPath:"${tri(205)}",duration:0.5,ease:"power2.out"},${f3(t0)});`);
    clipOff(0.5);
  }
  if (tr === "flash") c.anims.push(`tl.fromTo("#${shotId} .flash",{opacity:0.9},{opacity:0,duration:0.25,ease:"power2.out"},${f3(t0)});`);
  if (tr === "iris") c.anims.push(`tl.fromTo("#${shotId}",{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(75% at 50% 50%)",duration:${TRANS_DUR},ease:"power2.inOut"},${f3(t0)});`);
  // zoom-through: the incoming shot starts overscaled so it always covers the frame. (It used to grow from 40%,
  // which drew a translucent hard-edged rectangle over the previous shot mid-transition: the "overlay artifact"
  // in the 2026-11-02 Hair Loss long video at 5 s.)
  if (tr === "zoom") c.anims.push(`tl.fromTo("#${shotId}",{scale:1.35,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"power3.out"},${f3(t0)});`);
  if (tr === "whip") c.anims.push(`tl.fromTo("#${shotId}",{x:${c.W}},{x:0,duration:0.35,ease:"expo.out"},${f3(t0)});`);
  if (tr === "fade") c.anims.push(`tl.fromTo("#${shotId}",{opacity:0},{opacity:1,duration:${TRANS_DUR}},${f3(t0)});`);
  if (tr === "slide-up") c.anims.push(`tl.fromTo("#${shotId}",{y:${c.H}},{y:0,duration:0.5,ease:"power3.out"},${f3(t0)});`);
  if (tr !== "cut") c.cues.push({ t: t0, sfx: tr === "whip" ? "whip" : tr === "flash" ? "hit" : "whoosh", gain: tr === "flash" ? 0.5 : 0.6 });
  else if (index > 0) c.cues.push({ t: t0, sfx: "tick", gain: 0.25 });

  // the previous shot stays visible under this one while it transitions in
  const visibleEnd = shot.end + TRANS_DUR + 0.05;
  // layers: #punch = pacing punch-ins (see pace()), #cam = the planned camera move
  return `<div id="${shotId}" class="clip shot${p.dark && !LIGHT_BACKDROPS.has(bg) && c.theme !== "doodle" ? "" : " light"}${LIGHT_BACKDROPS.has(bg) ? " scene" : ""}" data-start="${f3(t0)}" data-duration="${f3(visibleEnd - t0)}" style="z-index:${10 + index}">` +
    `<div id="${punchId}" class="punch" style="transform-origin:${origin}"><div id="${camId}" class="cam"${cam === "dive" ? ` style="transform-origin:${heroOrigin}"` : ""}>${inner}</div></div>${overlay}` +
    `${tr === "flash" ? `<div class="flash" style="position:absolute;inset:0;background:#fff;opacity:0;z-index:800"></div>` : ""}</div>`;
}

/**
 * Shorts pacing (unchanged since 2026-11-12): a visual change at least every 2.5 s in the opening 10 s, with a
 * punch-in by 1.2 s. Where the plan leaves a longer static stretch, a quick camera punch-in (or punch-back-out on a
 * shot already punched in) toward the main character fills it. Deterministic: no model call. Returns every change
 * time in the window.
 */
function pace(c: Ctx, D: number): number[] {
  const rule = PACING.short;
  const end = Math.min(rule.window, D - 0.3);
  const punched = new Map<number, boolean>();
  const shotAt = (t: number) => c.meta.findIndex(m => m && t >= m.start && t < m.end);
  const punch = (t: number) => {
    const i = shotAt(t);
    if (i < 0) return false;
    const m = c.meta[i];
    if (c.meta.some(x => x && Math.abs(x.start - t) < PUNCH_CLEAR)) return false; // too close to a cut
    const inNow = punched.get(i) ?? false;
    const [a, b] = inNow ? [rule.scale, 1] : [1, rule.scale];
    c.anims.push(`tl.fromTo("#${m.punchId}",{scale:${a}},{scale:${b},duration:0.16,ease:"power3.out",immediateRender:false},${f3(t)});`);
    c.cues.push({ t, sfx: "swoosh", gain: 0.3 });
    punched.set(i, !inNow);
    c.changes.push(t);
    return true;
  };
  const near = (t: number, w: number) => c.changes.some(x => Math.abs(x - t) < w);
  // the opening punch-in lands by ~1.2 s unless a cut already lands by then
  if (end > rule.firstPunch + 0.5 && !c.meta.some((m, i) => i > 0 && m.start > 0.4 && m.start <= rule.firstPunch + 0.15)) {
    for (const t of [rule.firstPunch, rule.firstPunch - 0.25, rule.firstPunch + 0.2, rule.firstPunch - 0.4, rule.firstPunch + 0.4])
      if (!near(t, 0.2) && punch(t)) break;
  }
  // then fill every stretch longer than `gap`
  const unfillable = new Set<string>();
  for (let guard = 0; guard < 200; guard++) {
    const ev = [0, ...c.changes.filter(x => x > 0 && x <= end).sort((a, b) => a - b), end];
    let filled = false;
    for (let i = 1; i < ev.length && !filled; i++) {
      const key = ev[i - 1].toFixed(3);
      if (ev[i] - ev[i - 1] <= rule.gap || unfillable.has(key)) continue;
      // aim a little before the limit; step earlier if that moment sits on a shot boundary or another change
      let t = ev[i - 1] + rule.gap * 0.85;
      for (let k = 0; k < 8 && !filled; k++, t -= 0.2) if (t > ev[i - 1] + 0.5 && !near(t, 0.4)) filled = punch(+t.toFixed(3));
      if (!filled) unfillable.add(key);
    }
    if (!filled) break;
  }
  return dedupe(c.changes.filter(x => x > 0 && x <= rule.window));
}

/**
 * Long-form pacing (2026-11-17, from the Infographics Show style study), over the WHOLE video:
 *  1. quick camera moves (a 0.16 s punch-in toward the main character, or a 0.18 s punch back out) so a change the
 *     viewer (and the ffmpeg scene score) clearly sees lands at least every PACING.long.gap s. Only cuts count as
 *     sure changes here: on the 2026-11-17 test render most planned entrances and titles scored under the 0.08
 *     "visual change" level, while every quick punch scored 0.1 to 0.2. The aim point varies (0.72 to 0.95 of
 *     the gap), so the rhythm is uneven;
 *  2. between them, where 2 s or more pass with nothing, a slower 0.6 s push (motion, not a cut);
 *  3. per shot the moves alternate in, push, out, push, in..., never a metronome of the same zoom.
 * Every move keeps PUNCH_CLEAR from a cut (the beat-sync render check must not read one as an on-time cut) and
 * 0.4 s from other changes and in-place events (counters, hero reactions). Swoosh SFX only on quick moves in the
 * opening PACING.long.sfxWindow s. Transform-only tweens on one layer per shot: render cost stays flat.
 */
/** Ease of the long-form slow camera push (see paceLong): a quick start that settles (+1 point of motion share on the
 *  2026-11-17 test against power2.inOut, and the move reads as a camera operator's nudge). */
const PUSH_EASE = "power3.out";
function paceLong(c: Ctx, D: number): number[] {
  const rule = PACING.long;
  const end = D - 0.3;
  const shotAt = (t: number) => c.meta.findIndex(m => m && t >= m.start && t < m.end);
  const cutNear = (t: number) => c.meta.some(x => x && Math.abs(x.start - t) < PUNCH_CLEAR);
  const quick: number[] = [], slow: number[] = [];
  const busy = (t: number, w: number) => [quick, slow, c.changes, c.events].some(l => l.some(x => Math.abs(x - t) < w));
  const ok = (t: number) => t > 0.3 && t < end && shotAt(t) >= 0 && !cutNear(t);
  // 1) quick moves between sure changes
  const aims = [0.9, 0.78, 0.95, 0.84, 0.72, 0.92];
  let ai = 0, prev = 0;
  for (const next of [...dedupe(c.strong.filter(x => x > 0 && x <= end)), end]) {
    while (next - prev > rule.gap) {
      let placed: number | undefined;
      let t = prev + rule.gap * aims[ai++ % aims.length];
      for (let k = 0; k < 8 && placed === undefined; k++, t -= 0.2) if (t > prev + 0.5 && ok(t) && !busy(t, 0.4)) placed = +t.toFixed(3);
      if (placed === undefined) {
        // a soft cut (a fade) sits where the move would go: restart the count from it, else give up on this stretch
        const soft = c.meta.find(m => m && m.start > prev + 0.05 && m.start < next - 0.05);
        if (!soft) break;
        prev = soft.start;
        continue;
      }
      quick.push(placed);
      prev = placed;
    }
    prev = Math.max(prev, next);
  }
  // 2) slow pushes in the remaining quiet stretches (inside one shot, clear of its cut)
  const marks = dedupe([...quick, ...c.changes, ...c.events, ...c.meta.filter(Boolean).map(m => m.start), end]);
  for (let i = 1; i < marks.length; i++) {
    const [a, b] = [marks[i - 1], marks[i]];
    if (b - a < 2) continue;
    const t = +(a + (b - a) / 2 - 0.3).toFixed(3);
    if (ok(t) && shotAt(t) === shotAt(t + 0.65) && !cutNear(t + 0.65) && !busy(t, 0.4)) slow.push(t);
  }
  // 3) emit per shot in time order: quick = in (+0.12) from near 1, else back out to 1; slow = +0.07 (max 1.26).
  // A sombre beat gets only slow pushes (no snap zoom and no swoosh there)
  const scale = new Map<number, number>();
  for (const [t, k0] of [...quick.map(t => [t, "q"] as const), ...slow.map(t => [t, "s"] as const)].sort((x, y) => x[0] - y[0])) {
    const i = shotAt(t), m = c.meta[i], s = scale.get(i) ?? 1;
    const kind = m.sombre ? "s" : k0;
    const [to, d, ease] = kind === "q" ? (s < 1.03 ? [+(s + rule.scale - 1).toFixed(3), 0.16, "power3.out"] : [1, 0.18, "power3.out"]) : [+Math.min(1.26, s + 0.07).toFixed(3), 0.6, PUSH_EASE];
    c.anims.push(`tl.fromTo("#${m.punchId}",{scale:${s}},{scale:${to},duration:${d},ease:"${ease}",immediateRender:false},${f3(t)});`);
    scale.set(i, to);
    c.engine.push({ a: t, b: t + d, quick: kind === "q" });
    if (kind === "q") {
      c.changes.push(t);
      if (t <= rule.sfxWindow) c.cues.push({ t, sfx: "swoosh", gain: 0.3 });
    } else c.events.push(t);
  }
  // a dive shot hands its punch zoom back while the camera dives, so the two never multiply past 2.5
  c.meta.forEach((m, i) => {
    const s = scale.get(i) ?? 1;
    if (m?.dive && s > 1.001) c.anims.push(`tl.fromTo("#${m.punchId}",{scale:${s}},{scale:1,duration:${f3(m.dive)},ease:"power2.in",immediateRender:false},${f3(m.end - m.dive)});`);
  });
  return dedupe(c.changes.filter(x => x > 0 && x <= end));
}

/**
 * The engine's own moves for the beat-sync render check: `moves` (what to ignore, as [from, to]; a dive stops just
 * before its cut) and `impulses` (sure changes whose plan time is known: quick punches and every cut but a fade),
 * from which the check estimates how far the picture sits from the plan.
 */
function engineMoves(c: Ctx): EngineMoves {
  if (c.vertical) return { moves: [], impulses: [] };
  const r2 = (x: number) => +x.toFixed(3);
  return {
    moves: c.engine.map(m => [r2(m.a), r2(m.dive ? m.b - 0.05 : m.b)] as [number, number]).sort((a, b) => a[0] - b[0]),
    impulses: dedupe([...c.strong, ...c.engine.filter(m => m.quick).map(m => m.a)]).map(r2),
  };
}

/** Long-form only rules (2026-11-17): Shorts keep the old stylesheet byte for byte. */
const LONG_CSS = `.el .rx{width:100%;height:100%}
.stat .sv{font-variant-numeric:tabular-nums}
.stat .sbar{height:14px;margin:16px auto 0;border-radius:8px;background:rgba(255,255,255,.18);overflow:hidden}
.stat .sbar i{display:block;height:100%;border-radius:8px;background:${config.brand.gradient};transform-origin:left center}
.light .stat .sbar{background:rgba(29,20,64,.14)}
.headline.typed .ch{border-right:.06em solid transparent;margin-right:-.06em}
.headline.typed .tw{white-space:nowrap}`;

function css(W: number, H: number, fontFace: string, vertical = false) {
  const safeL = SHORTS_SAFE.left, safeR = W - SHORTS_SAFE.right;
  return `${fontFace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#12072e}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Brand",Montserrat,sans-serif}
.clip{position:absolute;inset:0}
.shot{overflow:hidden}
.cam{position:absolute;inset:0;transform-origin:50% 50%}
.punch{position:absolute;inset:0}
.el{position:absolute}
.el .par,.el .spin{width:100%;height:100%}
.elabel{position:absolute;left:50%;top:100%;transform:translateX(-50%);margin-top:10px;white-space:nowrap;font-weight:800;color:#fff;-webkit-text-stroke:7px rgba(20,10,45,.92);paint-order:stroke fill;text-shadow:0 4px 12px rgba(0,0,0,.6),0 2px 3px rgba(0,0,0,.45)}
.label{position:absolute;display:flex;align-items:center;gap:16px;font-weight:800;white-space:nowrap;color:#fff;background:#e8338f;padding:12px 30px 12px 14px;border-radius:50px;box-shadow:0 8px 30px rgba(0,0,0,.35);transform-origin:left center}
.label .ldot{width:44px;height:44px;border-radius:50%;background:${config.brand.gradient};border:4px solid #fff}
.headline{position:absolute;left:6%;right:6%;text-align:center;font-weight:900;color:#fff;line-height:1.02;text-wrap:balance;text-shadow:0 10px 40px rgba(0,0,0,.45)}
.hsub{font-size:.46em;font-weight:800;margin-top:18px}
.light .headline,.light .stat{color:#1d1440;text-shadow:none}
.light .headline>span,.light .stat .sl{color:#1d1440}
.stat{position:absolute;left:0;right:0;text-align:center;color:#fff}
.stat .sv{font-weight:900;line-height:1;text-shadow:0 12px 40px rgba(0,0,0,.4)}
.stat .sl{font-weight:800;margin-top:10px;text-wrap:balance;padding:0 6%}
.chips{position:absolute;left:0;right:0;display:flex;justify-content:center;gap:18px}
.chip{font-weight:800;color:#fff;background:#5b2a86;border:4px solid #ff79c6;padding:12px 28px;border-radius:14px;white-space:nowrap}
.cap{position:absolute;left:8%;right:8%;width:fit-content;margin:0 auto;text-wrap:balance;text-align:center;font-weight:900;line-height:1.12;color:#fff;text-transform:uppercase;-webkit-text-stroke:7px rgba(20,10,45,.92);paint-order:stroke fill;text-shadow:0 4px 12px rgba(0,0,0,.6),0 2px 3px rgba(0,0,0,.45);z-index:900}
.logo{position:absolute}
.scene .headline{padding:20px 30px 26px;background:rgba(255,253,245,.92);border:5px solid #1d1440;border-radius:36px;box-shadow:0 10px 0 rgba(29,20,64,.18)}
.scene .stat{left:6%;right:6%;padding:18px 20px 26px;background:rgba(255,253,245,.92);border:5px solid #1d1440;border-radius:40px;box-shadow:0 10px 0 rgba(29,20,64,.18)}
.bwrap{position:absolute;left:5%;right:5%;height:0;z-index:40}
.banchor{position:absolute;width:max-content}
.bubble{position:relative;font-family:"Fredoka","Brand",sans-serif;font-weight:600;color:#1b1030;background:#fff;border:6px solid #1b1030;border-radius:44px;padding:18px 34px 22px;text-align:center;line-height:1.12;text-wrap:balance;box-shadow:0 12px 0 rgba(0,0,0,.18)}
.bubble .tail{position:absolute;width:40px;height:40px;margin-left:-20px;background:#fff;border-right:6px solid #1b1030;border-bottom:6px solid #1b1030}
.bubble .tail.down{bottom:-24px;transform:rotate(45deg)}
.bubble .tail.up{top:-24px;transform:rotate(225deg)}
#root.vert .headline,#root.vert .stat,#root.vert .bwrap,#root.vert .cap{left:${safeL}px;right:${safeR}px}
${DOODLE_CSS}${vertical ? "" : `\n${LONG_CSS}`}`;
}

/** Shorts caption bottom (px on 1920). Owner, 2026-11-24: captions lower (they covered the pictures), just above
 *  the channel name and title YouTube draws at the bottom; the caption grows upward from here (3 lines end near 1350). */
export const CAP_BOTTOM_V = 1530;
/** Captions show a beat before the word: text a little early reads as in sync, a little late reads as out of sync. */
export const CAPTION_LEAD = 0.08;

/** The part of [s, e] outside every title window (the longer side when a window sits inside it), or null if < 0.35 s. */
export function outsideTitles(s: number, e: number, wins: [number, number][]): [number, number] | null {
  for (const [a0, b0] of wins) {
    const a = a0 - 0.05, b = b0 + 0.05;
    if (b <= s || a >= e) continue;
    if (a <= s && b >= e) return null;
    if (a <= s) s = b;
    else if (b >= e) e = a;
    else if (a - s >= e - b) e = a;
    else s = b;
  }
  return e - s >= 0.35 ? [s, e] : null;
}

export interface CaptionCoverage { words: number; captioned: number; wordShare: number; speechSeconds: number; timeShare: number;
  /** share of caption words timed from a heard word, and the longest stretch placed by guesswork (seconds) */
  timedShare: number; longestGuess: number }

/** Union length of intervals. */
const unionLen = (iv: [number, number][]) => {
  let total = 0, ce = -Infinity;
  for (const [a, b] of [...iv].sort((x, y) => x[0] - y[0])) {
    if (b <= ce) continue;
    total += b - Math.max(a, ce);
    ce = b;
  }
  return total;
};

function captions(c: Ctx, scenes: CaptionScene[], tl: Timeline): CaptionCoverage {
  const byId = new Map(tl.scenes.map(s => [s.id, s]));
  let firstGroup = true;
  let nWords = 0, captioned = 0, lastEnd = 0;
  const align: AlignStats = { tokens: 0, timed: 0, guessedSeconds: 0 };
  const speech: [number, number][] = [], shown: [number, number][] = [];
  const all: Word[][] = [];
  for (const sc of scenes) {
    const t = byId.get(sc.id);
    if (!t) continue;
    const words = subtitleWords(sc.narration, sc.spoken ?? sc.narration, t.words, align);
    const groups: Word[][] = [];
    let cur: Word[] = [];
    const weak = /^(the|a|an|of|to|and|or|but|in|on|at|for|with|your|our|their|its|is|are|was|that|this|by|from|as|than)$/i;
    for (const w of words) {
      cur.push(w);
      const full = cur.length >= 4 || (cur.length >= 3 && !weak.test(w.text.replace(/[^a-z]/gi, "")));
      if (/[.!?,;:—]$/.test(w.text) || full) { groups.push(cur); cur = []; }
    }
    if (cur.length) groups.push(cur);
    // never flash a lone word ("GEL,"): fold it into a neighbouring caption
    for (let i = 0; i < groups.length; i++) {
      if (groups.length > 1 && groups[i].length === 1) {
        const j = i > 0 && (groups[i - 1].length < 5 || i === groups.length - 1) ? i - 1 : i + 1;
        if (j < i) groups[j].push(...groups[i]); else groups[j].unshift(...groups[i]);
        groups.splice(i--, 1);
      }
    }
    all.push(...groups);
  }
  // each caption shows a beat early (CAPTION_LEAD) and makes way for the next one, so the lead also holds when the
  // words run on without a pause
  all.forEach((g, gi) => {
    {
      const next = all[gi + 1]?.[0].start;
      let s = Math.max(lastEnd, g[0].start - CAPTION_LEAD), e = Math.max(g[g.length - 1].end, s + 0.3);
      if (next !== undefined && next - CAPTION_LEAD > s + 0.15) e = Math.min(e, next - CAPTION_LEAD);
      nWords += g.length;
      g.forEach(w => speech.push([w.start, Math.max(w.end, w.start + 0.05)]));
      // frame 0: when no title carries the hook, the opening caption is up from t = 0 (no pop), even if the first
      // word starts late
      const opening = firstGroup && !c.textWin.some(([a]) => a < 0.05);
      firstGroup = false;
      if (opening) s = 0;
      // one text block at a time: no caption during the opening title
      const span = outsideTitles(s, e, c.textWin);
      if (!span) return;
      [s, e] = span;
      captioned += g.length;
      shown.push([s, e]);
      lastEnd = e;
      const base = uid(c, "cp");
      // Shorts: anchored at the bottom, just above the platform's title overlay; long lines get a smaller size.
      // Sizes: 80/72/64, then 64/58/52 (owner, 2026-11-16), then 52/48/44 (owner, 2026-11-24: smaller and lower)
      const chars = g.reduce((a, w) => a + w.text.length + 1, 0);
      const style = c.vertical ? `bottom:${c.H - CAP_BOTTOM_V}px;font-size:${chars <= 26 ? 52 : chars <= 40 ? 48 : 44}px` : "top:64%;font-size:86px";
      c.els.push(`<div class="clip" data-start="${f3(s)}" data-duration="${f3(e - s)}" style="z-index:900"><div id="${base}" class="cap" style="${style}">${g.map((w, k) => `<span id="${base}_${k}">${esc(w.text)}</span>`).join(" ")}</div></div>`);
      if (!opening) c.anims.push(`tl.fromTo("#${base}",{scale:0.8,opacity:0},{scale:1,opacity:1,duration:0.12,ease:"back.out(2)"},${f3(s)});`);
      // one word lit at a time: each goes back to white when the next one lights
      const lit = g.map(w => Math.max(s, w.start - CAPTION_LEAD));
      for (let k = 1; k < lit.length; k++) lit[k] = Math.max(lit[k], lit[k - 1] + 0.05);
      g.forEach((w, k) => c.anims.push(`tl.set("#${base}_${k}",{color:"${config.brand.colors.highlight}"},${f3(lit[k])});tl.set("#${base}_${k}",{color:"#ffffff"},${f3(Math.max(lit[k] + 0.05, Math.min(w.end + 0.02, lit[k + 1] ?? Infinity)))});`));
    }
  });
  // coverage: share of spoken words ever captioned, share of speech time with a caption on screen
  const speechSeconds = unionLen(speech);
  const overlap = unionLen(speech) + unionLen(shown) - unionLen([...speech, ...shown]);
  return {
    words: nWords, captioned, wordShare: nWords ? +(captioned / nWords).toFixed(3) : 1,
    speechSeconds: +speechSeconds.toFixed(2), timeShare: speechSeconds ? +(overlap / speechSeconds).toFixed(3) : 1,
    timedShare: align.tokens ? +(align.timed / align.tokens).toFixed(3) : 1, longestGuess: +align.guessedSeconds.toFixed(2),
  };
}

/** Build the composition. Returns the project dir and the SFX cue sheet. */
export async function composeAnimated(dir: string, shots: TimedShot[], tl: Timeline, opts: { vertical: boolean; captionScenes?: CaptionScene[]; theme?: Theme; hook?: string }) {
  // fallback hook: the first spoken words, up to 6, stopping at the end of the first sentence
  const fw: string[] = [];
  for (const w of tl.scenes[0]?.words ?? []) { fw.push(w.text); if (fw.length >= 6 || /[.!?]$/.test(w.text)) break; }
  const W = opts.vertical ? 1080 : 1920, H = opts.vertical ? 1920 : 1080, D = tl.duration;
  ensureDir(dir);
  const fontFace = await installBrandAssets(dir);
  // bundle GSAP locally: deterministic, offline-safe, and loadable by the QA browser
  copyFileSync(join(ROOT, "node_modules", "gsap", "dist", "gsap.min.js"), join(dir, "assets", "gsap.min.js"));
  const theme: Theme = opts.theme ?? (process.env.VIDEO_THEME as Theme | undefined) ?? config.video.theme ?? "vibrant";
  const c: Ctx = { els: [], anims: [], cues: [], n: 0, W, H, vertical: opts.vertical, theme, hook: opts.hook, firstWords: fw.join(" ").replace(/[,;:]$/, ""), captions: !!opts.captionScenes, changes: [], textWin: [], meta: [], events: [], strong: [], lastFlash: -99, engine: [], sombreWin: [] };
  // hand-drawn line boil: re-seed the wobble noise ~8x per second
  if (theme === "doodle") c.anims.push(`tl.fromTo("#wobt",{attr:{seed:1}},{attr:{seed:${Math.round(D * 8) + 1}},duration:${f3(D)},ease:"none"},0);`);
  shots.forEach((s, i) => c.els.push(shotHtml(c, s, i)));
  // planned content changes (cuts, big entrances, titles) before the engine adds camera moves: the plan pacing gate
  const planChanges = dedupe(c.changes.filter(x => x > 0 && x < D));
  const changes = opts.vertical ? pace(c, D) : paceLong(c, D);
  const captionCoverage = opts.captionScenes ? captions(c, opts.captionScenes, tl) : undefined;
  const logo = opts.vertical ? "left:410px;top:90px;width:260px" : "right:44px;top:36px;width:200px";
  c.els.push(`<div class="clip" data-start="0" data-duration="${f3(D)}" style="z-index:950"><img class="logo" src="assets/logo-horizontal-${theme === "doodle" ? "dark" : "white"}.png" style="${logo};height:auto;opacity:.85;${theme === "doodle" ? "" : "filter:drop-shadow(0 2px 8px rgba(0,0,0,.45))"}"/></div>`);

  const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=${W}, height=${H}"/>
<script src="assets/gsap.min.js"></script>
<style>${css(W, H, fontFace, opts.vertical)}</style></head>
<body>
${theme === "doodle" ? DOODLE_DEFS : ""}
<div id="root" class="${theme}${opts.vertical ? " vert" : ""}" data-composition-id="main" data-start="0" data-duration="${f3(D)}" data-width="${W}" data-height="${H}" data-fps="${config.video.fps}">
${c.els.join("\n")}
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
${c.anims.filter(Boolean).join("\n")}
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body></html>`;
  // fail fast on a broken timeline script instead of rendering a frozen video
  const js = c.anims.filter(Boolean).join("\n");
  try { new Function("tl", js); } catch (e) { throw new Error(`composition script invalid: ${(e as Error).message}`); }
  writeText(join(dir, "index.html"), html);
  // de-duplicate cues that land on top of each other
  const cues = c.cues.sort((a, b) => a.t - b.t).filter((q, i, a) => i === 0 || q.t - a[i - 1].t > 0.09 || q.sfx !== a[i - 1].sfx);
  return { dir, cues, captionCoverage, pacing: { changes, planChanges, events: dedupe(c.events), engine: engineMoves(c), sombre: c.sombreWin.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)] as [number, number]), textWindows: c.textWin.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)] as [number, number]) } };
}
