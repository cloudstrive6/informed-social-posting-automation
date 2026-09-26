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
interface Ctx { els: string[]; anims: string[]; cues: SfxCue[]; n: number; W: number; H: number; vertical: boolean; theme: Theme }
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
  const base = c.vertical ? 230 : 210, room = c.W * (c.vertical ? 0.8 : 0.7);
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
  let inner = background(c, shot, p, seed);

  // ---- elements (swarm = count > 1)
  const depthZ = { bg: 1, mid: 2, fg: 3 };
  const depthPar = { bg: 0.4, mid: 1, fg: 1.6 };
  const speakers: Speaker[] = [];
  for (const el of shot.elements) {
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
      const enterT = t0 + Math.min(dur - 0.4, el.enter_at * dur) + (copies > 1 ? k * Math.min(0.08, 1.2 / copies) : 0);
      if (face?.blinks) {
        for (let bt = enterT + 0.8 + r() * 1.5; bt < shot.end - 0.3; bt += 2.2 + r() * 1.8)
          c.anims.push(`tl.fromTo("#${face.eyes}",{scaleY:1},{scaleY:0.1,duration:0.07,yoyo:true,repeat:1,transformOrigin:"50% 50%"},${f3(bt)});`);
      }
      if (el.says && k === 0) speakers.push({ el, face, x, y, sizePx, enterT });
      c.anims.push(enterTween(`#${id}`, el.enter, enterT, c.W));
      c.anims.push(motionTween(`#${id}i`, el.motion, t0, dur, r));
      // parallax drift with the camera
      if (shot.camera !== "static") c.anims.push(`tl.fromTo("#${id}p",{x:0},{x:${((r() - 0.5) * 30 * depthPar[el.depth]).toFixed(0)},duration:${f3(dur)},ease:"none"},${f3(t0)});`);
      if (el.enter !== "none" && k < 6) c.cues.push({ t: enterT, sfx: el.enter === "pop" ? (copies > 3 ? "bubble" : "pop") : el.enter === "grow" ? "swell" : "swoosh", gain: copies > 3 ? 0.35 : 0.6 });
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
  if (tt.style === "label" && tt.text) {
    const lid = uid(c, "lab");
    overlay += `<div id="${lid}" class="label" style="font-size:${labelSize}px;${c.vertical ? "left:50%;top:15%;transform:translateX(-50%)" : "left:5%;top:7%"}"><span class="ldot"></span>${esc(tt.text)}</div>`;
    const t = t0 + Math.min(0.6, dur * 0.2);
    c.anims.push(`tl.fromTo("#${lid}",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.4,ease:"back.out(2)"},${f3(t)});`);
    c.cues.push({ t, sfx: "blip", gain: 0.55 });
  } else if (tt.style === "headline" && tt.text) {
    const hid = uid(c, "hd");
    overlay += `<div id="${hid}" class="headline" style="font-size:${c.vertical ? 96 : 118}px;top:${c.vertical ? 14 : 36}%">${esc(tt.text)}${tt.sub ? `<div class="hsub">${esc(tt.sub)}</div>` : ""}</div>`;
    const t = t0 + 0.25;
    c.anims.push(`tl.fromTo("#${hid}",{opacity:0,scale:1.25},{opacity:1,scale:1,duration:0.45,ease:"power4.out"},${f3(t)});`);
    c.cues.push({ t, sfx: "hit", gain: 0.7 });
  } else if (tt.style === "stat" && tt.text) {
    const sid = uid(c, "st");
    overlay += `<div id="${sid}" class="stat" style="top:${c.vertical ? 13 : 28}%"><div class="sv" style="font-size:${statSize(tt.text, c)}px">${esc(tt.text)}</div><div class="sl" style="font-size:${c.vertical ? 50 : 46}px">${esc(tt.sub)}</div></div>`;
    const t = t0 + 0.3;
    c.anims.push(`tl.fromTo("#${sid} .sv",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.6,ease:"elastic.out(1,0.55)"},${f3(t)});`);
    c.anims.push(`tl.fromTo("#${sid} .sl",{y:40,opacity:0},{y:0,opacity:1,duration:0.4},${f3(t + 0.35)});`);
    c.cues.push({ t, sfx: "ding", gain: 0.6 });
  } else if (tt.style === "chips" && tt.items?.length) {
    const base = uid(c, "ch");
    overlay += `<div class="chips" style="${c.vertical ? "top:11%;left:5%;right:5%;flex-wrap:wrap" : "top:8%"}">${tt.items.map((it, i) => `<span id="${base}_${i}" class="chip" style="font-size:${c.vertical ? 44 : 34}px">${esc(it)}</span>`).join("")}</div>`;
    tt.items.forEach((_, i) => {
      const t = t0 + 0.3 + i * Math.min(0.5, (dur * 0.6) / tt.items.length);
      c.anims.push(`tl.fromTo("#${base}_${i}",{opacity:0,y:-30},{opacity:1,y:0,duration:0.35,ease:"back.out(2)"},${f3(t)});`);
      c.cues.push({ t, sfx: "blip", gain: 0.45 });
    });
  }

  // ---- transition in
  const tr = index === 0 ? "cut" : shot.transition;
  if (tr === "iris") c.anims.push(`tl.fromTo("#${shotId}",{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(75% at 50% 50%)",duration:${TRANS_DUR},ease:"power2.inOut"},${f3(t0)});`);
  if (tr === "zoom") c.anims.push(`tl.fromTo("#${shotId}",{scale:0.4,opacity:0},{scale:1,opacity:1,duration:${TRANS_DUR},ease:"power3.out"},${f3(t0)});`);
  if (tr === "whip") c.anims.push(`tl.fromTo("#${shotId}",{x:${c.W}},{x:0,duration:0.35,ease:"expo.out"},${f3(t0)});`);
  if (tr === "fade") c.anims.push(`tl.fromTo("#${shotId}",{opacity:0},{opacity:1,duration:${TRANS_DUR}},${f3(t0)});`);
  if (tr === "slide-up") c.anims.push(`tl.fromTo("#${shotId}",{y:${c.H}},{y:0,duration:0.5,ease:"power3.out"},${f3(t0)});`);
  if (tr !== "cut") c.cues.push({ t: t0, sfx: tr === "whip" ? "whip" : "whoosh", gain: 0.6 });
  else if (index > 0) c.cues.push({ t: t0, sfx: "tick", gain: 0.25 });

  // the previous shot stays visible under this one while it transitions in
  const visibleEnd = shot.end + TRANS_DUR + 0.05;
  return `<div id="${shotId}" class="clip shot${p.dark && !LIGHT_BACKDROPS.has(bg) && c.theme !== "doodle" ? "" : " light"}${LIGHT_BACKDROPS.has(bg) ? " scene" : ""}" data-start="${f3(t0)}" data-duration="${f3(visibleEnd - t0)}" style="z-index:${10 + index}">` +
    `<div id="${camId}" class="cam">${inner}</div>${overlay}</div>`;
}

function css(W: number, H: number, fontFace: string) {
  return `${fontFace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#12072e}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Brand",Montserrat,sans-serif}
.clip{position:absolute;inset:0}
.shot{overflow:hidden}
.cam{position:absolute;inset:0;transform-origin:50% 50%}
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
${DOODLE_CSS}`;
}

function captions(c: Ctx, scenes: CaptionScene[], tl: Timeline) {
  const byId = new Map(tl.scenes.map(s => [s.id, s]));
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
      const s = g[0].start, e = Math.max(g[g.length - 1].end, s + 0.3);
      const base = uid(c, "cp");
      c.els.push(`<div class="clip" data-start="${f3(s)}" data-duration="${f3(e - s)}" style="z-index:900"><div id="${base}" class="cap" style="top:64%;font-size:86px">${g.map((w, k) => `<span id="${base}_${k}">${esc(w.text)}</span>`).join(" ")}</div></div>`);
      c.anims.push(`tl.fromTo("#${base}",{scale:0.8,opacity:0},{scale:1,opacity:1,duration:0.12,ease:"back.out(2)"},${f3(s)});`);
      g.forEach((w, k) => c.anims.push(`tl.set("#${base}_${k}",{color:"${config.brand.colors.highlight}"},${f3(w.start)});tl.set("#${base}_${k}",{color:"#ffffff"},${f3(w.end + 0.02)});`));
    }
  }
}

/** Build the composition. Returns the project dir and the SFX cue sheet. */
export async function composeAnimated(dir: string, shots: TimedShot[], tl: Timeline, opts: { vertical: boolean; captionScenes?: CaptionScene[]; theme?: Theme }) {
  const W = opts.vertical ? 1080 : 1920, H = opts.vertical ? 1920 : 1080, D = tl.duration;
  ensureDir(dir);
  const fontFace = await installBrandAssets(dir);
  // bundle GSAP locally: deterministic, offline-safe, and loadable by the QA browser
  copyFileSync(join(ROOT, "node_modules", "gsap", "dist", "gsap.min.js"), join(dir, "assets", "gsap.min.js"));
  const theme: Theme = opts.theme ?? (process.env.VIDEO_THEME as Theme | undefined) ?? config.video.theme ?? "vibrant";
  const c: Ctx = { els: [], anims: [], cues: [], n: 0, W, H, vertical: opts.vertical, theme };
  // hand-drawn line boil: re-seed the wobble noise ~8x per second
  if (theme === "doodle") c.anims.push(`tl.fromTo("#wobt",{attr:{seed:1}},{attr:{seed:${Math.round(D * 8) + 1}},duration:${f3(D)},ease:"none"},0);`);
  shots.forEach((s, i) => c.els.push(shotHtml(c, s, i)));
  if (opts.captionScenes) captions(c, opts.captionScenes, tl);
  const logo = opts.vertical ? "left:410px;top:90px;width:260px" : "right:44px;top:36px;width:200px";
  c.els.push(`<div class="clip" data-start="0" data-duration="${f3(D)}" style="z-index:950"><img class="logo" src="assets/logo-horizontal-${theme === "doodle" ? "dark" : "white"}.png" style="${logo};height:auto;opacity:.85;${theme === "doodle" ? "" : "filter:drop-shadow(0 2px 8px rgba(0,0,0,.45))"}"/></div>`);

  const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=${W}, height=${H}"/>
<script src="assets/gsap.min.js"></script>
<style>${css(W, H, fontFace)}</style></head>
<body>
${theme === "doodle" ? DOODLE_DEFS : ""}
<div id="root" class="${theme}" data-composition-id="main" data-start="0" data-duration="${f3(D)}" data-width="${W}" data-height="${H}" data-fps="${config.video.fps}">
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
  return { dir, cues };
}
