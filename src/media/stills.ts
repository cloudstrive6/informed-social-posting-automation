import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium, Browser } from "playwright";
import { config, ROOT } from "../lib/config.js";
import type { Carousel, Slide, ThumbConcept } from "../lib/schemas.js";
import { esc } from "./compose.js";
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

// ------------------------------------------------------------------ carousel slides 1080x1350 (4:5)
export async function renderCarousel(carousel: Carousel, photos: (string | undefined)[], outDir: string): Promise<string[]> {
  const W = 1080, H = 1350, total = carousel.slides.length;
  const files: string[] = [];
  const css = `
  .pad{position:absolute;inset:0;padding:110px 90px}
  .num{display:inline-block;font-weight:900;font-size:34px;padding:10px 22px;border-radius:40px;background:${GRAD};color:#fff}
  .h{font-weight:900;line-height:1.02;letter-spacing:-.01em}
  .b{font-weight:500;line-height:1.35}
  .foot{position:absolute;left:90px;right:90px;bottom:60px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:28px}
  .dots{display:flex;gap:10px}.dots i{width:14px;height:14px;border-radius:50%;background:currentColor;opacity:.3}.dots i.on{opacity:1}`;
  const foot = (i: number, dark: boolean) => `<div class="foot" style="color:${dark ? "#fff" : C.dark}">
    <img src="${logo(dark ? "logo-horizontal-white.png" : "logo-horizontal-dark.png")}" style="height:44px"/>
    <div class="dots">${Array.from({ length: total }, (_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
    <div>${esc(config.brand.handle)}</div></div>`;

  for (let i = 0; i < total; i++) {
    const s: Slide = carousel.slides[i];
    const photo = photos[i];
    let body = "";
    const dark = s.kind === "hook" || s.kind === "stat" || s.kind === "cta" || (s.kind === "point" && i % 2 === 0);
    if (s.kind === "hook") {
      body = `<div class="bgimg" style="background-image:${photo ? `url(${dataUri(photo)})` : GRAD};filter:saturate(1.15)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,20,20,.15) 0%,rgba(20,20,20,.35) 40%,rgba(20,20,20,.95) 78%)"></div>
      <div class="pad" style="display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:190px">
        <div class="h" style="font-size:104px;color:#fff;text-shadow:0 8px 30px rgba(0,0,0,.5)">${esc(s.headline)}</div>
        <div class="b" style="font-size:40px;color:${C.green};margin-top:28px;font-weight:700">${esc(s.body)}</div>
        <div style="margin-top:36px;align-self:flex-start;font-weight:800;font-size:32px;color:#111;background:#fff;border-radius:40px;padding:14px 30px">Swipe →</div></div>`;
    } else if (s.kind === "stat") {
      body = `<div style="position:absolute;inset:0;background:${GRAD}"></div>
      <div class="pad" style="display:flex;flex-direction:column;justify-content:center;color:#fff">
        <div class="h" style="font-size:250px;line-height:.9">${esc(s.stat)}</div>
        <div class="h" style="font-size:62px;margin-top:30px">${esc(s.headline)}</div>
        <div class="b" style="font-size:40px;margin-top:26px;color:rgba(255,255,255,.92)">${esc(s.body)}</div></div>`;
    } else if (s.kind === "myth_fact") {
      body = `<div style="position:absolute;inset:0;background:${C.light}"></div>
      <div class="pad" style="display:flex;flex-direction:column;gap:40px;justify-content:center">
        <div style="background:${C.dark};color:#ddd;border-radius:30px;padding:46px"><div style="color:${C.alert};font-weight:900;font-size:34px;letter-spacing:.15em">✕ MYTH</div>
          <div class="h" style="font-size:58px;margin-top:14px;text-decoration:line-through;text-decoration-color:${C.alert};text-decoration-thickness:6px">${esc(s.headline)}</div></div>
        <div style="background:#fff;color:${C.dark};border-radius:30px;padding:46px;box-shadow:0 20px 50px rgba(0,0,0,.08);border-left:14px solid ${C.green}"><div style="color:#3f8f21;font-weight:900;font-size:34px;letter-spacing:.15em">✓ FACT</div>
          <div class="b" style="font-size:44px;margin-top:14px;font-weight:600">${esc(s.body)}</div></div></div>`;
    } else if (s.kind === "checklist") {
      body = `<div style="position:absolute;inset:0;background:${C.light}"></div>
      <div class="pad" style="color:${C.dark}"><div class="h" style="font-size:78px">${esc(s.headline)}</div>
        <div style="margin-top:50px;display:flex;flex-direction:column;gap:26px">${(s.items ?? []).map(it => `<div style="display:flex;gap:26px;align-items:center;background:#fff;border-radius:24px;padding:28px 34px;box-shadow:0 10px 30px rgba(0,0,0,.06)"><div style="flex:none;width:64px;height:64px;border-radius:50%;background:${GRAD};color:#fff;font-weight:900;font-size:38px;display:flex;align-items:center;justify-content:center">✓</div><div class="b" style="font-size:40px;font-weight:600">${esc(it)}</div></div>`).join("")}</div></div>`;
    } else if (s.kind === "cta") {
      body = `<div style="position:absolute;inset:0;background:${C.dark}"></div>
      <div style="position:absolute;right:-160px;top:-160px;width:620px;height:620px;border-radius:50%;background:${GRAD};opacity:.9"></div>
      <div class="pad" style="display:flex;flex-direction:column;justify-content:center;color:#fff">
        <img src="${logo("icon-gradient.png")}" style="width:150px;margin-bottom:40px"/>
        <div class="h" style="font-size:88px">${esc(s.headline)}</div>
        <div class="b" style="font-size:42px;margin-top:30px;color:${C.light}">${esc(s.body)}</div>
        <div style="margin-top:50px;display:flex;gap:20px;font-weight:800;font-size:34px">
          <span style="background:#fff;color:#111;border-radius:40px;padding:16px 32px">🔖 Save</span>
          <span style="background:${GRAD};border-radius:40px;padding:16px 32px">Follow ${esc(config.brand.handle)}</span></div></div>`;
    } else { // point
      const fg = dark ? "#fff" : C.dark;
      body = `<div style="position:absolute;inset:0;background:${dark ? C.dark : C.light}"></div>
      ${photo ? `<div class="bgimg" style="top:auto;height:520px;background-image:url(${dataUri(photo)});opacity:.9"></div><div style="position:absolute;left:0;right:0;bottom:0;height:520px;background:linear-gradient(180deg,${dark ? C.dark : C.light} 0%,rgba(0,0,0,0) 45%)"></div>` : ""}
      <div style="position:absolute;right:40px;top:40px;font-weight:900;font-size:420px;line-height:1;color:${fg};opacity:.05">${String(i).padStart(2, "0")}</div>
      <div class="pad" style="color:${fg};display:flex;flex-direction:column;justify-content:${photo ? "flex-start" : "center"};padding-bottom:${photo ? 110 : 170}px"><span class="num" style="align-self:flex-start">${String(i).padStart(2, "0")}</span>
        <div class="h" style="font-size:${photo ? 84 : 100}px;margin-top:40px">${esc(s.headline)}</div>
        <div style="width:120px;height:10px;border-radius:5px;background:${GRAD};margin-top:36px"></div>
        <div class="b" style="font-size:${photo ? 44 : 50}px;margin-top:36px;opacity:.9">${esc(s.body)}</div></div>`;
    }
    const out = join(outDir, `slide-${String(i + 1).padStart(2, "0")}.jpg`);
    await shoot(`${await head(W, H, css)}${body}${foot(i, dark)}</body></html>`, W, H, out);
    files.push(out);
  }
  return files;
}
