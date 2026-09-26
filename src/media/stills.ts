import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium, Browser } from "playwright";
import { config, ROOT } from "../lib/config.js";
import type { ThumbConcept } from "../lib/schemas.js";
import { esc } from "../lib/html.js";
import { ensureFont } from "./fonts.js";

const C = config.brand.colors;
const GRAD = config.brand.gradient;

const dataUri = (file: string) => {
  const ext = extname(file).slice(1).toLowerCase();
  const mime = ext === "png" ? "image/png" : ext === "ttf" ? "font/ttf" : "image/jpeg";
  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
};

let browser: Browser | undefined;
async function shoot(html: string, w: number, h: number, out: string, type: "jpeg" | "png" = "jpeg") {
  browser ??= await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type, ...(type === "jpeg" ? { quality: 92 } : {}) });
  await page.close();
  return out;
}
export async function closeStills() { await browser?.close(); browser = undefined; }

async function head(w: number, h: number, extraCss = "") {
  const font = dataUri(await ensureFont());
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Brand;src:url(${font}) format("truetype");font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;overflow:hidden;font-family:Brand,sans-serif;position:relative}
.bgimg{position:absolute;inset:0;background-size:cover;background-position:center}
${extraCss}</style></head><body>`;
}

const logo = (file: string) => dataUri(join(ROOT, "brand", file));
const accentColor = (a: ThumbConcept["accent"]) => ({ alert: C.alert, highlight: C.highlight, green: C.green, blue: C.blue })[a] ?? C.highlight;

function hlWord(text: string, word: string, color: string) {
  const t = esc(text.toUpperCase());
  if (!word) return t;
  const w = esc(word.toUpperCase());
  const i = t.indexOf(w);
  return i < 0 ? t : `${t.slice(0, i)}<span style="color:${color}">${w}</span>${t.slice(i + w.length)}`;
}

// ------------------------------------------------------------------ YouTube thumbnail 1280x720
export async function renderThumbnail(concept: ThumbConcept, images: { main?: string; left?: string; right?: string }, out: string) {
  const W = 1280, H = 720;
  const acc = accentColor(concept.accent);
  const img = (f?: string) => (f ? `url(${dataUri(f)})` : GRAD);
  const text = `-webkit-text-stroke:4px #000;paint-order:stroke fill;text-shadow:0 10px 30px rgba(0,0,0,.65)`;
  const headline = hlWord(concept.headline, concept.highlight_word, acc);
  let body = "";

  switch (concept.layout) {
    case "big-number":
      body = `<div class="bgimg" style="background-image:${img(images.main)};filter:saturate(1.25) contrast(1.1)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,20,20,.92) 0%,rgba(20,20,20,.75) 45%,rgba(0,0,0,0) 75%)"></div>
      <div style="position:absolute;left:60px;top:90px;width:760px">
        <div style="font-weight:900;font-size:${concept.headline.length <= 3 ? 260 : concept.headline.length <= 5 ? 200 : 150}px;line-height:.9;white-space:nowrap;color:${acc};${text}">${esc(concept.headline)}</div>
        <div style="font-weight:900;font-size:72px;line-height:1;color:#fff;margin-top:20px;text-transform:uppercase;${text}">${esc(concept.subtext)}</div></div>`;
      break;
    case "versus":
      body = `<div class="bgimg" style="right:50%;background-image:${img(images.left ?? images.main)}"></div>
      <div class="bgimg" style="left:50%;background-image:${img(images.right ?? images.main)}"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.8) 100%)"></div>
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-60%);width:170px;height:170px;border-radius:50%;background:${acc};border:8px solid #fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:78px;color:#111">VS</div>
      <div style="position:absolute;left:30px;width:590px;bottom:40px;text-align:center;font-weight:900;font-size:84px;color:#fff;${text}">${esc(concept.versus_left.toUpperCase())}</div>
      <div style="position:absolute;right:30px;width:590px;bottom:40px;text-align:center;font-weight:900;font-size:84px;color:${acc};${text}">${esc(concept.versus_right.toUpperCase())}</div>`;
      break;
    case "object-hero":
      body = `<div class="bgimg" style="background-image:${img(images.main)};filter:saturate(1.2) contrast(1.08)"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 35%,rgba(0,0,0,.7) 100%)"></div>
      <div style="position:absolute;left:40px;right:40px;bottom:36px;text-align:center;font-weight:900;font-size:124px;line-height:.95;color:#fff;${text}">${headline}</div>`;
      break;
    case "warning":
      body = `<div class="bgimg" style="left:38%;background-image:${img(images.main)};filter:saturate(1.2)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,#141414 0%,#141414 36%,rgba(20,20,20,.0) 62%)"></div>
      <div style="position:absolute;left:56px;top:70px;background:${C.alert};color:#fff;font-weight:900;font-size:62px;padding:10px 30px;border-radius:14px;transform:rotate(-3deg);box-shadow:0 10px 30px rgba(0,0,0,.5)">⚠ ${esc((concept.badge || "WARNING").toUpperCase())}</div>
      <div style="position:absolute;left:56px;top:210px;width:720px;font-weight:900;font-size:118px;line-height:.95;color:#fff;${text}">${headline}</div>`;
      break;
    default: // split-reveal
      body = `<div class="bgimg" style="left:40%;background-image:${img(images.main)};filter:saturate(1.2) contrast(1.08)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,${C.dark} 0%,${C.dark} 38%,rgba(35,35,35,0) 60%)"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:${GRAD}"></div>
      <div style="position:absolute;left:60px;top:50%;transform:translateY(-50%);width:700px;font-weight:900;font-size:128px;line-height:.95;color:#fff;${text}">${headline}
      ${concept.subtext ? `<div style="font-size:52px;margin-top:22px;color:${C.light}">${esc(concept.subtext.toUpperCase())}</div>` : ""}</div>`;
  }
  if (concept.badge && concept.layout !== "warning") {
    body += `<div style="position:absolute;right:40px;top:40px;background:${acc};color:#111;font-weight:900;font-size:44px;padding:8px 22px;border-radius:12px;transform:rotate(3deg)">${esc(concept.badge.toUpperCase())}</div>`;
  }
  // logo bug: bottom-left normally; top-left where the headline sits at the bottom
  const logoPos = concept.layout === "versus" || concept.layout === "object-hero" ? "left:26px;top:22px" : "left:26px;bottom:22px";
  body += `<img src="${logo("icon-white.png")}" style="position:absolute;${logoPos};width:84px;opacity:.95;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5))"/>`;
  return shoot(`${await head(W, H)}${body}</body></html>`, W, H, out);
}
