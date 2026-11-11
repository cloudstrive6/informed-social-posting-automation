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
import { subtitleWords } from "./captions.js";
import { Timeline, Word } from "./tts.js";

/** `narration` = written script, `spoken` = what the narrator actually said (captions follow the voice). */
export interface CaptionScene { id: string; narration: string; spoken?: string }
import { COMPONENTS, Tone } from "./vector/components.js";
import { iconSvg, resolveIcon } from "./vector/iconPack.js";
import { log } from "../lib/log.js";
import { hashStr, palette, Palette, rng } from "./vector/palettes.js";
import { Shot, ShotElement } from "./vector/shots.js";
import { backdropSvg, DOODLE_CSS, DOODLE_DEFS, faceSvg, LIGHT_BACKDROPS, stripFace } from "./vector/cartoon.js";

export type Theme = "vibrant" | "doodle";

export interface SfxCue { t: number; sfx: string; gain: number }
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
  short: { window: 10, gap: 2.5, firstPunch: 1.2, scale: 1.15 },
  long: { window: 60, gap: 5, firstPunch: 2.5, scale: 1.12 },
};
/** Shorts safe zone on 1080x1920 (clear of the right-hand button rail and the bottom UI). */
export const SHORTS_SAFE = { left: 60, right: 900, top: 180, bottom: 1500 };
const LONG_HERO_MIN = 35; // % of frame height, first 30 s of a long video
/** With burned-in captions, the opening title (first shot only) holds this long, then the captions take over. */
const OPENING_TITLE = 2.0;
/** Punch-ins stay this far from any cut, so the beat-sync render check can't mistake one for an on-time cut. */
const PUNCH_CLEAR = 0.8;
/** Change times closer than this are one change. */
const dedupe = (ts: number[], eps = 0.1) => [...ts].sort((a, b) => a - b).filter((t, i, a) => i === 0 || t - a[i - 1] >= eps);

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
interface ShotMeta { start: number; end: number; punchId: string }
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
}
const uid = (c: Ctx, p: string) => `${p}${c.n++}`;

function svgOf(type: string, p: Palette, tone: Tone, seed: number, variant: string) {
  if (type === "icon") {
    const hit = resolveIcon(variant, seed);
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

function motionTween(sel: string, m: ShotElement["motion"], t0: number, dur: number, r: () => number): string {
  const reps = (period: number) => Math.max(0, Math.ceil(dur / period) - 1);
  const per = 1.4 + r() * 1.2;
  switch (m) {
    case "float": return `tl.to("${sel}",{y:-${(10 + r() * 14).toFixed(0)},duration:${per.toFixed(2)},yoyo:true,repeat:${reps(per)},ease:"sine.inOut"},${f3(t0)});`;
    case "bob": return `tl.to("${sel}",{y:-8,rotation:3,duration:0.5,yoyo:true,repeat:${reps(0.5)},ease:"sine.inOut"},${f3(t0)});`;
    case "breathe": return `tl.to("${sel}",{scale:1.07,duration:${per.toFixed(2)},yoyo:true,repeat:${reps(per)},ease:"sine.inOut"},${f3(t0)});`;
    case "pulse": return `tl.to("${sel}",{scale:1.15,duration:0.35,yoyo:true,repeat:${reps(0.35)},ease:"power1.inOut"},${f3(t0)});`;
    case "spin": return `tl.to("${sel}",{rotation:${r() > 0.5 ? "" : "-"}${Math.round(40 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`;
    case "wobble": return `tl.to("${sel}",{rotation:7,duration:0.6,yoyo:true,repeat:${reps(0.6)},ease:"sine.inOut"},${f3(t0)});`;
    case "drift-left": return `tl.to("${sel}",{x:-${Math.round(40 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`;
    case "drift-right": return `tl.to("${sel}",{x:${Math.round(40 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});`;
    case "swim": return `tl.to("${sel}",{x:${Math.round(30 * dur)},duration:${f3(dur)},ease:"none"},${f3(t0)});tl.to("${sel}",{y:-16,rotation:-6,duration:0.8,yoyo:true,repeat:${reps(0.8)},ease:"sine.inOut"},${f3(t0)});`;
    case "orbit": return `tl.to("${sel}",{x:30,duration:${per.toFixed(2)},yoyo:true,repeat:${reps(per)},ease:"sine.inOut"},${f3(t0)});tl.to("${sel}",{y:30,duration:${(per / 2).toFixed(2)},yoyo:true,repeat:${reps(per / 2)},ease:"sine.inOut"},${f3(t0 + per / 4)});`;
    default: return "";
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
function speechBubbles(c: Ctx, shot: TimedShot, speakers: Speaker[]): string {
  let html = "", prevEnd = 0;
  const fs = c.vertical ? 50 : 40, maxW = c.vertical ? 800 : 640;
  for (const sp of speakers.slice(0, 2)) {
    const text = sp.el.says.trim().replace(/\s+/g, " ").slice(0, 80);
    const words = text.split(" ").length;
    const start = Math.max(sp.enterT + 0.35, prevEnd + 0.1);
    const end = Math.min(shot.end - 0.05, start + Math.min(3.6, Math.max(1.6, words * 0.3 + 1.2)));
    if (end - start < 1) continue;
    prevEnd = end;
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
  // long-form: tiny characters in the first 30 s read as an empty frame; the main character is >= 35% of the height
  let planned = shot.elements;
  const hero0 = heroOf(planned);
  if (!c.vertical && t0 < 30 && hero0 && Math.round(hero0.count) <= 1 && hero0.size < LONG_HERO_MIN)
    planned = planned.map(e => (e === hero0 ? { ...e, size: LONG_HERO_MIN, y: Math.min(e.y, 100 - 3 - LONG_HERO_MIN / 2) } : e));
  // Title band: when the shot has a headline or stat, keep every foreground/mid element's top below it
  const titled = shot.title.style === "headline" || shot.title.style === "stat";
  const bandBottom = c.vertical ? 34 : 44; // % of frame height the title may use
  const elements = !titled ? planned : planned.map(e => {
    if (e.depth === "bg") return e;
    const half = e.size / 2;
    const size = Math.min(e.size, (100 - 3 - bandBottom)); // must fit between the band and the bottom edge
    const y = Math.min(100 - 3 - size / 2, Math.max(e.y, bandBottom + size / 2 + (c.vertical ? 0 : 2)));
    return y !== e.y || size !== e.size ? { ...e, y, size, spread: Math.min(e.spread, 100 - y - half) } : e;
  });
  const hero = heroOf(elements);
  // punch-ins zoom toward the main character
  const origin = hero ? `${Math.min(80, Math.max(20, hero.x)).toFixed(0)}% ${Math.min(75, Math.max(25, hero.y)).toFixed(0)}%` : "50% 50%";
  c.meta[index] = { start: t0, end: shot.end, punchId };
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
        // layers: #id = entrance, #idp = camera parallax, #idi = idle motion (one writer per property per layer)
        `<div class="par" id="${id}p"><div class="spin" id="${id}i"><div class="art" style="position:relative;width:100%;height:100%;${el.flip ? "transform:scaleX(-1)" : ""}">${art}</div></div></div>${label}</div>`;
      let enterT = t0 + Math.min(dur - 0.4, el.enter_at * dur) + (copies > 1 ? k * Math.min(0.08, 1.2 / copies) : 0);
      // opening shot: the hero and anything due in the first 0.6 s are already there at frame 0 (no fade/pop)
      const present = first && (el === hero || enterT - t0 < 0.6 || el.enter === "none");
      if (present) enterT = t0;
      if (face?.blinks) {
        for (let bt = enterT + 0.8 + r() * 1.5; bt < shot.end - 0.3; bt += 2.2 + r() * 1.8)
          c.anims.push(`tl.fromTo("#${face.eyes}",{scaleY:1},{scaleY:0.1,duration:0.07,yoyo:true,repeat:1,transformOrigin:"50% 50%"},${f3(bt)});`);
      }
      if (el.says && k === 0) speakers.push({ el, face, x, y, sizePx, enterT });
      if (present) {
        // alive from the first frame: a gentle settle that starts fully visible (scale 1 -> 1.04)
        if (el === hero && k === 0) c.anims.push(`tl.fromTo("#${id}",{scale:1},{scale:1.04,duration:${f3(Math.min(1.6, dur))},ease:"sine.out"},${f3(t0)});`);
      } else {
        c.anims.push(enterTween(`#${id}`, el.enter, enterT, c.W));
        // only entrances big enough to read as a change count for pacing (a small prop popping in barely registers:
        // measured with ffmpeg scene scores on a test render, 2026-11-12)
        if (el.enter !== "none" && el.depth !== "bg" && k === 0 && (el.size >= 30 || copies > 3)) c.changes.push(enterT);
      }
      c.anims.push(motionTween(`#${id}i`, el.motion, t0, dur, r));
      // parallax drift with the camera
      if (shot.camera !== "static") c.anims.push(`tl.fromTo("#${id}p",{x:0},{x:${((r() - 0.5) * 30 * depthPar[el.depth]).toFixed(0)},duration:${f3(dur)},ease:"none"},${f3(t0)});`);
      if (el.enter !== "none" && k < 6 && !present) c.cues.push({ t: enterT, sfx: el.enter === "pop" ? (copies > 3 ? "bubble" : "pop") : el.enter === "grow" ? "swell" : "swoosh", gain: copies > 3 ? 0.35 : 0.6 });
    }
  }
  const bubbles = speechBubbles(c, shot, speakers);

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
  } else if (tt.style === "headline" && tt.text) {
    const hid = uid(c, "hd");
    overlay += `<div id="${hid}" class="headline" style="font-size:${c.vertical ? 96 : 104}px;top:${c.vertical ? 14 : 11}%">${esc(tt.text)}${tt.sub ? `<div class="hsub">${esc(tt.sub)}</div>` : ""}</div>`;
    const t = first ? t0 : t0 + 0.25;
    if (!first) {
      c.anims.push(`tl.fromTo("#${hid}",{opacity:0,scale:1.25},{opacity:1,scale:1,duration:0.45,ease:"power4.out"},${f3(t)});`);
      c.cues.push({ t, sfx: "hit", gain: 0.7 });
    }
    hold("headline", `#${hid}`, t);
  } else if (tt.style === "stat" && tt.text) {
    const sid = uid(c, "st");
    overlay += `<div id="${sid}" class="stat" style="top:${c.vertical ? 13 : 11}%"><div class="sv" style="font-size:${statSize(tt.text, c)}px">${esc(tt.text)}</div><div class="sl" style="font-size:${c.vertical ? 50 : 46}px">${esc(tt.sub)}</div></div>`;
    const t = first ? t0 : t0 + 0.3;
    if (!first) {
      c.anims.push(`tl.fromTo("#${sid} .sv",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.6,ease:"elastic.out(1,0.55)"},${f3(t)});`);
      c.anims.push(`tl.fromTo("#${sid} .sl",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${f3(t + 0.35)});`);
      c.cues.push({ t, sfx: "ding", gain: 0.6 });
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
  const tr = index === 0 ? "cut" : shot.transition;
  if (tr === "iris") c.anims.push(`tl.fromTo("#${shotId}",{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(75% at 50% 50%)",duration:${TRANS_DUR},ease:"power2.inOut"},${f3(t0)});`);
  // zoom-through: the incoming shot starts overscaled so it always covers the frame. (It used to grow from 40%,
  // which drew a translucent hard-edged rectangle over the previous shot mid-transition: the "overlay artifact"
  // in the 2026-11-02 Hair Loss long video at 5 s.)
  if (tr === "zoom") c.anims.push(`tl.fromTo("#${shotId}",{scale:1.35,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"power3.out"},${f3(t0)});`);
  if (tr === "whip") c.anims.push(`tl.fromTo("#${shotId}",{x:${c.W}},{x:0,duration:0.35,ease:"expo.out"},${f3(t0)});`);
  if (tr === "fade") c.anims.push(`tl.fromTo("#${shotId}",{opacity:0},{opacity:1,duration:${TRANS_DUR}},${f3(t0)});`);
  if (tr === "slide-up") c.anims.push(`tl.fromTo("#${shotId}",{y:${c.H}},{y:0,duration:0.5,ease:"power3.out"},${f3(t0)});`);
  if (tr !== "cut") c.cues.push({ t: t0, sfx: tr === "whip" ? "whip" : "whoosh", gain: 0.6 });
  else if (index > 0) c.cues.push({ t: t0, sfx: "tick", gain: 0.25 });

  // the previous shot stays visible under this one while it transitions in
  const visibleEnd = shot.end + TRANS_DUR + 0.05;
  // layers: #punch = pacing punch-ins (see pace()), #cam = the planned camera move
  return `<div id="${shotId}" class="clip shot${p.dark && !LIGHT_BACKDROPS.has(bg) && c.theme !== "doodle" ? "" : " light"}${LIGHT_BACKDROPS.has(bg) ? " scene" : ""}" data-start="${f3(t0)}" data-duration="${f3(visibleEnd - t0)}" style="z-index:${10 + index}">` +
    `<div id="${punchId}" class="punch" style="transform-origin:${origin}"><div id="${camId}" class="cam">${inner}</div></div>${overlay}</div>`;
}

/**
 * Pacing: a visual change at least every `gap` s in the opening `window` s (Shorts: 2.5 s over 10 s, with a
 * punch-in by 1.2 s; long-form: 5 s over the first minute). Where the plan leaves a longer static stretch, a quick
 * camera punch-in (or punch-back-out on a shot already punched in) toward the main character fills it.
 * Deterministic: no model call. Returns every change time in the window.
 */
function pace(c: Ctx, D: number): number[] {
  const rule = c.vertical ? PACING.short : PACING.long;
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
  // the opening punch-in lands by ~1.2 s on a Short (2.5 s on a long video) unless a cut already lands by then
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

function css(W: number, H: number, fontFace: string) {
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
.elabel{position:absolute;left:50%;top:100%;transform:translateX(-50%);margin-top:10px;white-space:nowrap;font-weight:800;color:#fff;background:rgba(20,10,45,.75);padding:6px 16px;border-radius:30px}
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
.cap{position:absolute;left:8%;right:8%;width:fit-content;margin:0 auto;padding:6px 26px 10px;border-radius:22px;background:rgba(18,10,40,.88);text-wrap:balance;text-align:center;font-weight:900;color:#fff;text-transform:uppercase;-webkit-text-stroke:3px #1b1030;paint-order:stroke fill;text-shadow:0 8px 24px rgba(0,0,0,.6);z-index:900}
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
${DOODLE_CSS}`;
}

/** Shorts caption top (px on 1920): a 3-line caption at the largest size still ends above SHORTS_SAFE.bottom. */
const CAP_TOP_V = 1170;

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

export interface CaptionCoverage { words: number; captioned: number; wordShare: number; speechSeconds: number; timeShare: number }

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
  let nWords = 0, captioned = 0;
  const speech: [number, number][] = [], shown: [number, number][] = [];
  for (const sc of scenes) {
    const t = byId.get(sc.id);
    if (!t) continue;
    const words = subtitleWords(sc.narration, sc.spoken ?? sc.narration, t.words);
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
    for (const g of groups) {
      let s = g[0].start, e = Math.max(g[g.length - 1].end, s + 0.3);
      nWords += g.length;
      g.forEach(w => speech.push([w.start, Math.max(w.end, w.start + 0.05)]));
      // frame 0: when no title carries the hook, the opening caption is up from t = 0 (no pop), even if the first
      // word starts late
      const opening = firstGroup && !c.textWin.some(([a]) => a < 0.05);
      firstGroup = false;
      if (opening) s = 0;
      // one text block at a time: no caption during the opening title
      const span = outsideTitles(s, e, c.textWin);
      if (!span) continue;
      [s, e] = span;
      captioned += g.length;
      shown.push([s, e]);
      const base = uid(c, "cp");
      // Shorts: fixed top inside the safe zone; long lines get a smaller size so 3 lines still end above y 1500
      const chars = g.reduce((a, w) => a + w.text.length + 1, 0);
      const style = c.vertical ? `top:${CAP_TOP_V}px;font-size:${chars <= 26 ? 80 : chars <= 40 ? 72 : 64}px` : "top:64%;font-size:86px";
      c.els.push(`<div class="clip" data-start="${f3(s)}" data-duration="${f3(e - s)}" style="z-index:900"><div id="${base}" class="cap" style="${style}">${g.map((w, k) => `<span id="${base}_${k}">${esc(w.text)}</span>`).join(" ")}</div></div>`);
      if (!opening) c.anims.push(`tl.fromTo("#${base}",{scale:0.8,opacity:0},{scale:1,opacity:1,duration:0.12,ease:"back.out(2)"},${f3(s)});`);
      g.forEach((w, k) => c.anims.push(`tl.set("#${base}_${k}",{color:"${config.brand.colors.highlight}"},${f3(w.start)});tl.set("#${base}_${k}",{color:"#ffffff"},${f3(w.end + 0.02)});`));
    }
  }
  // coverage: share of spoken words ever captioned, share of speech time with a caption on screen
  const speechSeconds = unionLen(speech);
  const overlap = unionLen(speech) + unionLen(shown) - unionLen([...speech, ...shown]);
  return {
    words: nWords, captioned, wordShare: nWords ? +(captioned / nWords).toFixed(3) : 1,
    speechSeconds: +speechSeconds.toFixed(2), timeShare: speechSeconds ? +(overlap / speechSeconds).toFixed(3) : 1,
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
  const c: Ctx = { els: [], anims: [], cues: [], n: 0, W, H, vertical: opts.vertical, theme, hook: opts.hook, firstWords: fw.join(" ").replace(/[,;:]$/, ""), captions: !!opts.captionScenes, changes: [], textWin: [], meta: [] };
  // hand-drawn line boil: re-seed the wobble noise ~8x per second
  if (theme === "doodle") c.anims.push(`tl.fromTo("#wobt",{attr:{seed:1}},{attr:{seed:${Math.round(D * 8) + 1}},duration:${f3(D)},ease:"none"},0);`);
  shots.forEach((s, i) => c.els.push(shotHtml(c, s, i)));
  const changes = pace(c, D);
  const captionCoverage = opts.captionScenes ? captions(c, opts.captionScenes, tl) : undefined;
  const logo = opts.vertical ? "left:410px;top:90px;width:260px" : "right:44px;top:36px;width:200px";
  c.els.push(`<div class="clip" data-start="0" data-duration="${f3(D)}" style="z-index:950"><img class="logo" src="assets/logo-horizontal-${theme === "doodle" ? "dark" : "white"}.png" style="${logo};height:auto;opacity:.85;${theme === "doodle" ? "" : "filter:drop-shadow(0 2px 8px rgba(0,0,0,.45))"}"/></div>`);

  const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=${W}, height=${H}"/>
<script src="assets/gsap.min.js"></script>
<style>${css(W, H, fontFace)}</style></head>
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
  return { dir, cues, captionCoverage, pacing: { changes, textWindows: c.textWin.map(([a, b]) => [+a.toFixed(2), +b.toFixed(2)] as [number, number]) } };
}
