/**
 * Comic-style infographic carousels (1080×1350) for Instagram / Facebook.
 * Look: thick ink outlines, hard offset shadows, halftone dots, sticker illustrations (cartoon asset pack),
 * speech bubbles from the "Medi" mascot, starbursts for stats. Every slide is data-driven (see Slide in schemas.ts).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { config, ROOT } from "../lib/config.js";
import type { Carousel, Slide, SlideItem } from "../lib/schemas.js";
import { esc } from "../lib/html.js";
import { fontFile } from "./fonts.js";
import { COMPONENTS } from "./vector/components.js";
import { iconSvg, resolveIcon } from "./vector/iconPack.js";
import { hashStr, palette } from "./vector/palettes.js";

const W = 1080, H = 1350;
const INK = "#1d1440";
const C = config.brand.colors;
const BGS = ["#FFF6E5", "#DDF7EE", "#DDF1FB", "#FFF3B8", "#FFE6EC"]; // cream, mint, sky, lemon, blush
const POPS = ["#FF6B6B", "#23b1dc", "#95ca5b", "#FFB020", "#9B6BFF", "#FF8FB3"]; // accent cycle
const brandP = palette("brand");

const b64 = (f: string) => readFileSync(f).toString("base64");

function sticker(query: string, seed: number, size: number, extra = ""): string {
  if (!query) return "";
  // try the full request, then its individual words (longest first), before giving up
  const words = query.replace(/^health:/, "").split(/\s+/).filter(w => w.length > 2).sort((a, b) => b.length - a.length);
  const hit = [query, ...words].map(q => resolveIcon(q, seed)).find(Boolean);
  if (!hit) return "";
  const inner = iconSvg(hit, brandP, "secondary");
  return `<svg class="stk" viewBox="-60 -60 120 120" width="${size}" height="${size}" style="${extra}">${inner}</svg>`;
}
const mascot = (size: number, extra = "") =>
  `<svg class="stk" viewBox="-60 -70 120 130" width="${size}" height="${size * 1.08}" style="${extra}">${COMPONENTS.mascot({ p: brandP, tone: "primary", seed: 3 })}</svg>`;
const bubble = (text: string, tail: "left" | "right" | "down" = "left", extra = "") =>
  text ? `<div class="bubble tail-${tail}" style="${extra}">${esc(text)}</div>` : "";
function burst(text: string, size: number, color = "#FFD83D") {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 ? 0.78 : 1, a = (i / 32) * Math.PI * 2;
    return `${(Math.cos(a) * r * 50).toFixed(1)},${(Math.sin(a) * r * 50).toFixed(1)}`;
  }).join(" ");
  const fs = text.length <= 3 ? 150 : text.length <= 5 ? 118 : text.length <= 7 ? 92 : 72;
  return `<div class="burst" style="width:${size}px;height:${size}px"><svg viewBox="-56 -56 112 112" width="${size}" height="${size}"><polygon points="${pts}" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" transform="translate(3,3)" opacity=".95" style="fill:${INK}"/><polygon points="${pts}" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></svg><span style="font-size:${fs * size / 520}px">${esc(text)}</span></div>`;
}
const headline = (t: string, size = 84, extra = "") => t ? `<h1 style="font-size:${size}px;${extra}">${esc(t)}</h1>` : "";
const body = (t: string, extra = "") => t ? `<p class="body" style="${extra}">${esc(t)}</p>` : "";

function css(fonts: { mont: string; fred: string; bang: string }) {
  return `
@font-face{font-family:Brand;src:url(data:font/ttf;base64,${fonts.mont});font-weight:100 900}
@font-face{font-family:Fredoka;src:url(data:font/ttf;base64,${fonts.fred});font-weight:300 700}
@font-face{font-family:Bangers;src:url(data:font/ttf;base64,${fonts.bang})}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:Brand,sans-serif;color:${INK}}
.bg{position:absolute;inset:0}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(29,20,64,.11) 2.6px,transparent 2.9px);background-size:28px 28px}
.page{position:absolute;inset:0;padding:90px 78px 150px;display:flex;flex-direction:column;justify-content:center;gap:34px}
h1{font-family:Fredoka,sans-serif;font-weight:700;line-height:1.02;letter-spacing:-.01em;text-wrap:balance}
.body{font-size:38px;font-weight:600;line-height:1.3;text-wrap:pretty}
.card{background:#fff;border:6px solid ${INK};border-radius:34px;box-shadow:12px 12px 0 ${INK};padding:34px 38px}
.stk{filter:drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(7px 8px 0 rgba(29,20,64,.85));overflow:visible;flex:none}
.bubble{position:relative;background:#fff;border:5px solid ${INK};border-radius:38px;padding:24px 30px;font-family:Fredoka,sans-serif;font-weight:600;font-size:38px;line-height:1.15;box-shadow:8px 8px 0 ${INK};max-width:640px}
.bubble:after{content:"";position:absolute;width:34px;height:34px;background:#fff;border-right:5px solid ${INK};border-bottom:5px solid ${INK}}
.tail-left:after{left:54px;bottom:-21px;transform:rotate(45deg)}
.tail-right:after{right:54px;bottom:-21px;transform:rotate(45deg)}
.tail-down:after{left:50%;bottom:-21px;transform:translateX(-50%) rotate(45deg)}
.tag{display:inline-block;align-self:flex-start;font-family:Bangers,sans-serif;font-size:46px;letter-spacing:.04em;padding:8px 26px 4px;border:5px solid ${INK};border-radius:16px;box-shadow:7px 7px 0 ${INK};transform:rotate(-3deg)}
.burst{position:relative;flex:none}.burst span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Fredoka,sans-serif;font-weight:700;color:${INK};text-align:center;line-height:.95}
.foot{position:absolute;left:78px;right:78px;bottom:48px;display:flex;justify-content:space-between;align-items:center;font-family:Fredoka,sans-serif;font-weight:600;font-size:30px}
.dotsnav{display:flex;gap:10px}.dotsnav i{width:16px;height:16px;border-radius:50%;border:3px solid ${INK};background:#fff}.dotsnav i.on{background:${INK}}
.num{flex:none;width:78px;height:78px;border-radius:50%;border:5px solid ${INK};display:flex;align-items:center;justify-content:center;font-family:Fredoka,sans-serif;font-weight:700;font-size:42px;box-shadow:5px 5px 0 ${INK}}
.lbl{font-family:Fredoka,sans-serif;font-weight:700;font-size:44px;line-height:1.05}
.det{font-size:31px;font-weight:600;line-height:1.28;margin-top:6px;opacity:.85}
`;
}

// ------------------------------------------------------------------ slide layouts
type Ctx = { i: number; total: number; seed: number; bg: string; pop: string };

function layout(s: Slide, x: Ctx): { bg: string; html: string; dark?: boolean } {
  const items: SlideItem[] = s.items ?? [];
  const pop = (k: number) => POPS[(x.i + k) % POPS.length];
  switch (s.kind) {
    case "hook":
      return {
        bg: `linear-gradient(150deg, ${C.blue} 0%, #3cc2b4 55%, ${C.green} 100%)`, dark: true, html: `
        <div class="page" style="padding-top:110px;justify-content:flex-start">
          <div class="tag" style="background:#FFD83D">${esc(s.body ? "NEW" : "HEALTH FACTS")}</div>
          ${headline(s.headline, 104, `color:#fff;-webkit-text-stroke:3px ${INK};paint-order:stroke fill;text-shadow:8px 8px 0 ${INK};margin-top:18px`)}
          ${s.body ? `<div class="card" style="font-size:36px;font-weight:700;align-self:flex-start;padding:20px 30px;transform:rotate(-1.5deg)">${esc(s.body)}</div>` : ""}
        </div>
        <div style="position:absolute;right:40px;bottom:170px">${sticker(s.icon, x.seed, 430)}</div>
        <div style="position:absolute;left:70px;bottom:170px;display:flex;flex-direction:column;align-items:flex-start;gap:30px">
          ${bubble(s.bubble || "Swipe, this one surprised me →", "left", "max-width:520px;font-size:36px")}${mascot(240)}</div>`,
      };
    case "stat":
      return {
        bg: x.bg, html: `
        <div class="page">${headline(s.headline, 76)}
          <div style="display:flex;justify-content:center;margin:10px 0">${burst(s.stat, 600)}</div>
          <div class="card">${body(s.body, "font-size:36px")}</div></div>
        ${s.icon ? `<div style="position:absolute;right:60px;top:${360}px">${sticker(s.icon, x.seed, 200)}</div>` : ""}
        ${s.bubble ? `<div style="position:absolute;left:60px;top:330px;display:flex;flex-direction:column;gap:22px;align-items:flex-start">${bubble(s.bubble, "left", "max-width:330px;font-size:30px")}${mascot(130)}</div>` : ""}`,
      };
    case "pictogram": {
      const total = Math.max(2, Math.min(10, Math.round(s.total || 10))), filled = Math.max(0, Math.min(total, Math.round(s.filled)));
      const icon = s.icon || "person standing";
      const people = Array.from({ length: total }, (_, k) => `<div style="${k < filled ? "" : "opacity:.28;filter:grayscale(1)"}">${sticker(icon, x.seed + k, 165)}</div>`).join("");
      return {
        bg: x.bg, html: `
        <div class="page">${headline(s.headline, 76)}
          <div style="display:flex;align-items:center;gap:26px"><div class="stat" style="font-family:Fredoka;font-weight:700;font-size:${s.stat.length <= 10 ? 150 : s.stat.length <= 22 ? 96 : 66}px;line-height:1.05;text-wrap:balance;color:${pop(0)};-webkit-text-stroke:4px ${INK};paint-order:stroke fill;text-shadow:7px 7px 0 ${INK}">${esc(s.stat)}</div></div>
          <div class="card" style="display:flex;flex-wrap:wrap;justify-content:center;gap:18px 26px;padding:36px">${people}</div>
          ${body(s.body)}</div>`,
      };
    }
    case "comparison": {
      const [l, r] = [s.columns?.[0] ?? "", s.columns?.[1] ?? ""];
      const [li, ri] = [s.column_icons?.[0] ?? "", s.column_icons?.[1] ?? ""];
      const col = (t: string, ic: string, color: string) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:12px">${sticker(ic, x.seed + t.length, 200)}<div class="tag" style="align-self:center;background:${color};font-size:40px;transform:rotate(0)">${esc(t)}</div></div>`;
      const rows = items.slice(0, 5).map((it, k) => `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:stretch">
          <div style="grid-column:1/3;text-align:center;font-family:Fredoka;font-weight:700;font-size:34px;opacity:.7;margin-top:${k ? 6 : 0}px">${esc(it.label)}</div>
          <div class="card" style="padding:24px 26px;font-size:34px;font-weight:700;box-shadow:7px 7px 0 ${INK};border-width:5px;background:#FFE3E3">${esc(it.detail)}</div>
          <div class="card" style="padding:24px 26px;font-size:34px;font-weight:700;box-shadow:7px 7px 0 ${INK};border-width:5px;background:#E3F7D9">${esc(it.value)}</div></div>`).join("");
      return { bg: x.bg, html: `<div class="page" style="gap:22px">${headline(s.headline, 70)}<div style="display:flex;gap:30px">${col(l, li, "#FF8A8A")}${col(r, ri, "#9BE07A")}</div>${rows}${body(s.body, "font-size:30px")}</div>` };
    }
    case "steps":
      return {
        bg: x.bg, html: `<div class="page" style="gap:22px">${headline(s.headline, 72)}
        ${items.slice(0, 5).map((it, k) => `
          <div style="display:flex;align-items:center;gap:22px">
            <div class="num" style="background:${pop(k)}">${k + 1}</div>
            <div class="card" style="flex:1;display:flex;align-items:center;gap:24px;padding:26px 28px">${sticker(it.icon, x.seed + k, 120)}<div><div class="lbl">${esc(it.label)}</div>${it.detail ? `<div class="det">${esc(it.detail)}</div>` : ""}</div></div>
          </div>${k < Math.min(items.length, 5) - 1 ? `<div style="margin:-18px 0 -18px 30px;height:34px;border-left:7px dashed ${INK}"></div>` : ""}`).join("")}
        ${body(s.body, "font-size:30px")}</div>`,
      };
    case "chart": {
      const nums = items.map(it => parseFloat(String(it.value).replace(/[^\d.]/g, "")) || 0);
      const max = Math.max(...nums, 1);
      return {
        bg: x.bg, html: `<div class="page">${headline(s.headline, 72)}
        <div class="card" style="display:flex;flex-direction:column;gap:30px;padding:40px">
          ${items.slice(0, 6).map((it, k) => `
            <div><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div style="display:flex;align-items:center;gap:14px">${sticker(it.icon, x.seed + k, 84)}<span class="lbl" style="font-size:42px">${esc(it.label)}</span></div></div>
              <div style="display:flex;align-items:center;gap:16px;margin-top:10px"><div style="height:70px;width:${Math.max(6, (nums[k] / max) * 78)}%;background:${pop(k)};border:5px solid ${INK};border-radius:14px;box-shadow:6px 6px 0 ${INK}"></div><span style="font-family:Fredoka;font-weight:700;font-size:52px">${esc(it.value)}</span></div></div>`).join("")}
        </div>${body(s.body, "font-size:30px")}</div>`,
      };
    }
    case "icon_grid":
      return {
        bg: x.bg, html: `<div class="page">${headline(s.headline, 74)}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
          ${items.slice(0, 6).map((it, k) => `<div class="card" style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:28px 22px;background:${k % 2 ? "#fff" : "#FFFDF5"}">${sticker(it.icon, x.seed + k, 160)}<div class="lbl" style="font-size:40px">${esc(it.label)}</div>${it.detail ? `<div class="det" style="font-size:29px">${esc(it.detail)}</div>` : ""}</div>`).join("")}
        </div>${body(s.body, "font-size:32px")}</div>`,
      };
    case "body_map": {
      // two flowing columns of callout cards around the central illustration, body text below them:
      // everything is in normal flow, so nothing can overlap however many items there are
      const card = (it: typeof items[number], k: number) => `<div class="card" style="width:370px;padding:22px 24px;border-width:5px;box-shadow:7px 7px 0 ${INK};background:${k % 2 ? "#fff" : "#FFFDF0"}">
            <div style="display:flex;align-items:center;gap:14px">${sticker(it.icon, x.seed + k, 76)}<div class="lbl" style="font-size:38px">${esc(it.label)}</div></div>${it.detail ? `<div class="det" style="font-size:28px">${esc(it.detail)}</div>` : ""}</div>`;
      const six = items.slice(0, 6);
      const col = (side: number) => `<div style="display:flex;flex-direction:column;justify-content:space-around;gap:24px">${six.map((it, k) => [it, k] as const).filter(([, k]) => k % 2 === side).map(([it, k]) => card(it, k)).join("")}</div>`;
      return {
        bg: x.bg, html: `<div class="page" style="justify-content:flex-start">${headline(s.headline, 76)}</div>
        <div style="position:absolute;left:50%;top:300px;transform:translateX(-50%)">${sticker(s.icon || "person standing", x.seed, 640)}</div>
        <div class="flowbox" style="position:absolute;left:44px;right:44px;top:290px;bottom:140px;display:flex;flex-direction:column;gap:26px">
          <div style="flex:1;display:flex;justify-content:space-between;min-height:0">${col(0)}${col(1)}</div>
          ${s.body ? `<div style="padding:0 34px">${body(s.body, "font-size:30px;text-align:center")}</div>` : ""}
        </div>`,
      };
    }
    case "myth_fact":
      return {
        bg: x.bg, html: `<div class="page" style="gap:34px;padding-top:80px">
          <div class="card" style="background:#FFE3E3;position:relative;padding-top:56px">
            <div class="tag" style="position:absolute;top:-34px;left:34px;background:#FF6B6B;color:#fff">MYTH!</div>
            <div style="display:flex;align-items:center;gap:24px">${sticker("cross mark", x.seed, 120)}<div style="font-family:Fredoka;font-weight:700;font-size:52px;line-height:1.08;text-decoration:line-through;text-decoration-color:#FF3B5C;text-decoration-thickness:7px">${esc(s.headline)}</div></div></div>
          <div class="card" style="background:#E3F7D9;position:relative;padding-top:56px">
            <div class="tag" style="position:absolute;top:-34px;left:34px;background:#3fbf6a;color:#fff;transform:rotate(2deg)">FACT!</div>
            <div style="display:flex;align-items:flex-start;gap:24px">${sticker("check mark button", x.seed + 1, 120)}<div class="body" style="font-size:40px;font-weight:700">${esc(s.body)}</div></div></div>
          ${s.bubble ? `<div style="display:flex;align-items:flex-end;gap:20px;justify-content:flex-end">${bubble(s.bubble, "right", "font-size:36px;max-width:600px;margin-bottom:90px")}${mascot(210)}</div>` : ""}
        </div>`,
      };
    case "checklist":
      return {
        bg: x.bg, html: `<div class="page">${headline(s.headline, 76)}
        <div class="card" style="display:flex;flex-direction:column;gap:26px">
          ${items.slice(0, 6).map((it, k) => `<div style="display:flex;align-items:center;gap:22px"><div class="num" style="background:#9BE07A;width:70px;height:70px;font-size:40px">✓</div>${sticker(it.icon, x.seed + k, 80)}<div><div class="lbl" style="font-size:36px">${esc(it.label)}</div>${it.detail ? `<div class="det">${esc(it.detail)}</div>` : ""}</div></div>`).join("")}
        </div>${body(s.body, "font-size:30px")}</div>`,
      };
    case "cta":
    default:
      return {
        bg: `linear-gradient(150deg, ${C.green} 0%, #3cc2b4 50%, ${C.blue} 100%)`, dark: true, html: `
        <div class="page" style="align-items:center;text-align:center;padding-top:120px">
          ${headline(s.headline || "Save this for later", 96, `color:#fff;-webkit-text-stroke:3px ${INK};paint-order:stroke fill;text-shadow:8px 8px 0 ${INK}`)}
          ${s.body ? `<div class="card" style="font-size:36px;font-weight:700;max-width:860px">${esc(s.body)}</div>` : ""}
          <div style="display:flex;align-items:flex-end;gap:26px;margin-top:20px">${mascot(230)}${bubble(s.bubble || "Send this to someone who needs it!", "left", "max-width:460px;font-size:34px;margin-bottom:170px")}</div>
          <div style="display:flex;gap:22px;flex-wrap:wrap;justify-content:center">
            ${["🔖 SAVE", "📤 SHARE", `➕ FOLLOW ${config.brand.handle}`].map((b, k) => `<div class="tag" style="background:${["#FFD83D", "#fff", "#FF8FB3"][k]};transform:rotate(${[-3, 2, -1][k]}deg);font-size:42px;align-self:center">${esc(b)}</div>`).join("")}
          </div></div>`,
      };
  }
}

/** Render every slide to a JPEG (Instagram carousels require JPEG). */
/** Renders every slide; `misfits` lists slides (1-based) whose content still runs off the canvas after auto-fit. */
export async function renderComicCarousel(carousel: Carousel, outDir: string): Promise<{ files: string[]; misfits: number[] }> {
  const fonts = { mont: b64(await fontFile("Montserrat")), fred: b64(await fontFile("Fredoka")), bang: b64(await fontFile("Bangers")) };
  const style = css(fonts);
  const logoDark = b64(join(ROOT, "brand", "logo-horizontal-dark.png")), logoLight = b64(join(ROOT, "brand", "logo-horizontal-white.png"));
  const browser = await chromium.launch();
  const files: string[] = [];
  const misfits: number[] = [];
  const total = carousel.slides.length;
  const seed = hashStr(carousel.title);
  for (const [i, s] of carousel.slides.entries()) {
    const { bg, html, dark } = layout(s, { i, total, seed: seed + i * 13, bg: BGS[i % BGS.length], pop: POPS[i % POPS.length] });
    const foot = `<div class="foot" style="color:${dark ? "#fff" : INK}"><img src="data:image/png;base64,${dark ? logoLight : logoDark}" style="height:46px"/>
      <div class="dotsnav">${Array.from({ length: total }, (_, k) => `<i class="${k === i ? "on" : ""}" style="${dark ? "border-color:#fff;" + (k === i ? "background:#fff" : "background:transparent") : ""}"></i>`).join("")}</div>
      <div>${esc(config.brand.handle)}</div></div>`;
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${style}</style></head><body>
      <div class="bg" style="background:${bg}"></div><div class="dots" style="${dark ? "background-image:radial-gradient(rgba(255,255,255,.16) 2.6px,transparent 2.9px)" : ""}"></div>
      ${html}${foot}</body></html>`, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate("window.__name = (f) => f"); // esbuild/tsx keepNames helper used inside evaluate()
    // auto-fit: shrink text until nothing runs into the footer or off the canvas
    const stillOver = await page.evaluate(([H, W]) => {
      const limit = H - 128;
      // text boxes must stay above the footer AND never overlap each other
      const boxes = () => [...document.querySelectorAll<HTMLElement>("h1, .card, .bubble, .body")].filter(e => e.offsetParent !== null);
      const hits = (a: DOMRect, b: DOMRect) => a.left < b.right - 4 && b.left < a.right - 4 && a.top < b.bottom - 4 && b.top < a.bottom - 4;
      const overlap = () => {
        const bs = boxes();
        return bs.some((a, i) => bs.slice(i + 1).some(b => !a.contains(b) && !b.contains(a) && hits(a.getBoundingClientRect(), b.getBoundingClientRect())));
      };
      const flowOver = () => [...document.querySelectorAll<HTMLElement>(".flowbox")].some(f => f.scrollHeight > f.clientHeight + 2);
      // off the canvas at the top or sides counts too (a centred page that overflows grows both ways)
      const offCanvas = () => [...document.querySelectorAll(".page > *, .card, .bubble")].some(e => {
        const r = e.getBoundingClientRect();
        return r.bottom > limit || r.top < 24 || r.left < 0 || r.right > W;
      });
      const overflow = () => flowOver() || overlap() || offCanvas();
      for (let k = 0; k < 12 && overflow(); k++) {
        document.querySelectorAll<HTMLElement>("h1, .stat, .body, .det, .lbl, .card, .bubble").forEach(e => {
          e.style.fontSize = `${parseFloat(getComputedStyle(e).fontSize) * 0.93}px`;
        });
        // fixed-size stickers inside cards (pictogram people, grid icons) shrink with the text
        document.querySelectorAll<SVGSVGElement>(".card .stk").forEach(e => {
          const w = parseFloat(e.getAttribute("width") || "0") * 0.93;
          e.setAttribute("width", `${w}`); e.setAttribute("height", `${w}`);
        });
        document.querySelectorAll<HTMLElement>(".page").forEach(e => { e.style.gap = `${parseFloat(getComputedStyle(e).gap || "30") * 0.85}px`; });
      }
      return overflow();
    }, [H, W] as const);
    if (stillOver) misfits.push(i + 1);
    const out = join(outDir, `slide-${String(i + 1).padStart(2, "0")}.jpg`);
    await page.screenshot({ path: out, type: "jpeg", quality: 93 });
    await page.close();
    files.push(out);
  }
  await browser.close();
  return { files, misfits };
}
