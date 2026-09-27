/**
 * Cartoon YouTube thumbnails (1280×720), built from the same character engine as the videos.
 * Built for click-through: one huge expressive face, 1–4 word text readable at phone size, strong colour
 * contrast, and a visual cue (arrow, circle, question mark) that points the eye at the curiosity gap.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, Browser } from "playwright";
import { ROOT } from "../lib/config.js";
import { esc } from "../lib/html.js";
import type { ThumbConcept } from "../lib/schemas.js";
import { fontFile } from "./fonts.js";
import { faceSvg, stripFace } from "./vector/cartoon.js";
import { COMPONENTS } from "./vector/components.js";
import { iconSvg, resolveIcon } from "./vector/iconPack.js";
import { hashStr, palette, Palette } from "./vector/palettes.js";

const W = 1280, H = 720;
const INK = "#140b2e";
const b64 = (f: string) => readFileSync(f).toString("base64");

const THEMES: Record<string, { bg: [string, string]; ray: string; hi: string; mood: string }> = {
  alert: { bg: ["#c8102e", "#3a0610"], ray: "rgba(255,210,80,.13)", hi: "#FFE14D", mood: "immune" },
  highlight: { bg: ["#7b2ff7", "#1a0b45"], ray: "rgba(255,225,77,.14)", hi: "#FFE14D", mood: "body" },
  green: { bg: ["#1fbf8f", "#0b4d5e"], ray: "rgba(255,255,255,.12)", hi: "#FFE14D", mood: "brand" },
  blue: { bg: ["#1f8fe0", "#0b1f5e"], ray: "rgba(255,255,255,.12)", hi: "#FFE14D", mood: "night" },
};

const PEOPLE = /\b(man|woman|men|women|person|people|boy|girl|baby|child|kid|family|doctor|nurse|worker|runner|face|pregnant|elder|old)\b/i;

/** Art for a character: a built-in component ("liver", "cell:cancer", "mascot") or any illustration ("avocado"). */
function art(spec: string, face: string, p: Palette, seed: number, id: string): string {
  const [type, variant = ""] = spec.split(":");
  let inner = "";
  let faceable = true;
  if (COMPONENTS[type]) {
    inner = COMPONENTS[type]({ p, tone: "primary", seed, variant });
    faceable = type !== "person";
  } else {
    const q = spec.replace(/^icon:/, "");
    const words = q.split(/\s+/).filter(w => w.length > 2).sort((a, b) => b.length - a.length);
    const hit = [q, ...words].map(x => resolveIcon(x, seed)).find(Boolean);
    inner = hit ? iconSvg(hit, p, "primary") : COMPONENTS.mascot({ p, tone: "primary", seed });
    faceable = !PEOPLE.test(q);
  }
  const f = face && face !== "none" && faceable ? faceSvg(face, id, 0.8) : undefined;
  return `<div class="art"><svg viewBox="-60 -60 120 120" width="100%" height="100%" overflow="visible">${f ? stripFace(inner) : inner}</svg>${f ? f.svg : ""}</div>`;
}

const PROPS: Record<string, (x: number, y: number, s: number, hi: string, flip?: boolean) => string> = {
  // hand-drawn red arrow pointing right-down at (x, y)
  arrow: (x, y, s, _hi, flip = false) => `<svg class="prop" style="left:${x - s}px;top:${y - s * 0.55}px;${flip ? "transform:scaleX(-1) rotate(-12deg)" : ""}" width="${s}" height="${s * 0.7}" viewBox="0 0 100 70"><path d="M6,14 C38,4 66,14 82,46" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round"/><path d="M6,14 C38,4 66,14 82,46" fill="none" stroke="#ff2638" stroke-width="10" stroke-linecap="round"/><path d="M66,44 L86,58 L90,34" fill="none" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M66,44 L86,58 L90,34" fill="none" stroke="#ff2638" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "red-circle": (x, y, s) => `<svg class="prop" style="left:${x - s / 2}px;top:${y - s * 0.4}px" width="${s}" height="${s * 0.8}" viewBox="0 0 100 80"><ellipse cx="50" cy="40" rx="44" ry="33" fill="none" stroke="#fff" stroke-width="9" transform="rotate(-8 50 40)"/><ellipse cx="50" cy="40" rx="44" ry="33" fill="none" stroke="#ff2638" stroke-width="5.5" transform="rotate(-8 50 40)" stroke-dasharray="240 30"/></svg>`,
  question: (x, y, s, hi) => `<div class="prop qm" style="left:${x - s / 2}px;top:${y - s / 2}px;font-size:${s}px;color:${hi}">?</div>`,
  cross: (x, y, s) => `<div class="prop mark" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;background:#ff2638">✕</div>`,
  check: (x, y, s) => `<div class="prop mark" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;background:#22c55e">✓</div>`,
  alarm: (x, y, s) => { const h = resolveIcon("police car light"); return h ? `<svg class="prop stk" style="left:${x - s / 2}px;top:${y - s / 2}px" width="${s}" height="${s}" viewBox="-60 -60 120 120">${iconSvg(h, palette("immune"), "accent")}</svg>` : ""; },
  magnifier: (x, y, s) => { const h = resolveIcon("magnifying glass tilted left"); return h ? `<svg class="prop stk" style="left:${x - s / 2}px;top:${y - s / 2}px" width="${s}" height="${s}" viewBox="-60 -60 120 120">${iconSvg(h, palette("brand"), "accent")}</svg>` : ""; },
};

/** Headline with the highlight word on a marker swash. */
function headlineHtml(c: ThumbConcept, hi: string) {
  const hw = (c.highlight_word ?? "").toLowerCase();
  return esc(c.headline.toUpperCase()).split(/(\s+)/).map(w =>
    hw && w.toLowerCase().replace(/[^a-z0-9%+.,-]/g, "") === hw.replace(/[^a-z0-9%+.,-]/g, "") ? `<span class="hw" style="color:${hi}">${w}</span>` : w).join("");
}

function pageHtml(c: ThumbConcept, fonts: { mont: string; bang: string }, logo: string): string {
  const t = THEMES[c.accent] ?? THEMES.highlight;
  const p = palette(t.mood);
  const seed = hashStr(c.headline + c.hero_art);
  const hero = (spec: string, face: string, x: number, y: number, size: number, id: string, extra = "") =>
    `<div class="hero" style="left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;${extra}">${art(spec, face, p, seed, id)}</div>`;
  const badge = c.badge ? `<div class="badge">${esc(c.badge.toUpperCase())}</div>` : "";
  const sub = c.subtext ? `<div class="sub">${esc(c.subtext)}</div>` : "";
  const prop = (x: number, y: number, s: number) => (PROPS[c.prop] ?? (() => ""))(x, y, s, t.hi);
  let body = "";
  switch (c.layout) {
    case "versus":
      body = `<div class="text top"><div class="h1" data-maxh="150">${headlineHtml(c, t.hi)}</div></div>
        ${hero(c.hero_art, c.hero_face, 300, 440, 430, "fa", "")}${hero(c.second_art || c.hero_art, c.second_face, 980, 440, 430, "fb")}
        <div class="vs">VS</div>
        <div class="lab" style="left:120px"><span class="dot" style="background:#ff2638">✕</span>${esc(c.versus_left)}</div>
        <div class="lab" style="right:120px"><span class="dot" style="background:#22c55e">✓</span>${esc(c.versus_right)}</div>`;
      break;
    case "before-after":
      body = `<div class="half gray"></div>
        ${hero(c.hero_art, c.hero_face || "sad", 330, 430, 420, "fa", "filter:grayscale(.85) brightness(.9)")}${hero(c.second_art || c.hero_art, c.second_face || "proud", 950, 430, 420, "fb")}
        ${PROPS.arrow(700, 420, 170, t.hi)}
        <div class="text top"><div class="h1" data-maxh="150">${headlineHtml(c, t.hi)}</div></div>`;
      break;
    case "big-number":
      body = `<div class="text left"><div class="h1 num" data-maxh="330">${headlineHtml(c, t.hi)}</div>${sub}</div>
        ${hero(c.hero_art, c.hero_face, 975, 410, 600, "fa")}${c.prop === "arrow" ? PROPS.arrow(1250, 150, 230, t.hi, true) : prop(1120, 165, 190)}`;
      break;
    case "mystery":
      body = `<div class="text left"><div class="h1" data-maxh="420">${headlineHtml(c, t.hi)}</div>${sub}</div>
        ${hero(c.hero_art, "none", 960, 400, 600, "fa", "filter:brightness(0) drop-shadow(0 0 30px rgba(255,255,255,.55))")}
        ${PROPS.question(960, 395, 380, t.hi)}`;
      break;
    default: // reaction, warning
      body = `<div class="text left"><div class="h1" data-maxh="430">${headlineHtml(c, t.hi)}</div>${sub}</div>
        ${hero(c.hero_art, c.hero_face, 975, 410, 600, "fa")}${c.prop === "arrow" ? PROPS.arrow(1250, 150, 230, t.hi, true) : prop(1120, 165, 190)}`;
  }
  const hazard = c.layout === "warning" ? `<div class="hazard"></div>` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Mont;src:url(data:font/ttf;base64,${fonts.mont});font-weight:100 900}
@font-face{font-family:Bang;src:url(data:font/ttf;base64,${fonts.bang})}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:Mont,sans-serif;
  background:radial-gradient(ellipse at 72% 50%, ${t.bg[0]} 0%, ${t.bg[1]} 78%)}
.rays{position:absolute;left:-40%;top:-60%;width:180%;height:220%;background:repeating-conic-gradient(from 0deg at 72% 50%, ${t.ray} 0deg 7deg, transparent 7deg 18deg)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)}
.half.gray{position:absolute;left:0;top:0;width:52%;height:100%;background:#4a4a55;clip-path:polygon(0 0,100% 0,88% 100%,0 100%)}
.hero{position:absolute}
.hero .art{position:relative;width:100%;height:100%;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(10px 16px 0 rgba(0,0,0,.35))}
.text{position:absolute;z-index:5;display:flex;flex-direction:column;gap:14px}
.text.left{left:48px;top:50%;transform:translateY(-50%);width:640px}
.text.top{left:40px;right:40px;top:26px;align-items:center;text-align:center}
.h1{font-weight:900;color:#fff;line-height:.98;letter-spacing:-1px;font-size:130px;-webkit-text-stroke:9px ${INK};paint-order:stroke fill;text-shadow:0 10px 0 rgba(0,0,0,.35);text-wrap:balance}
.h1.num{font-size:300px}
.hw{display:inline-block;transform:rotate(-2deg)}
.sub{align-self:flex-start;font-weight:800;font-size:40px;color:${INK};background:#fff;padding:8px 22px 10px;border-radius:14px;border:5px solid ${INK};box-shadow:6px 6px 0 ${INK};transform:rotate(-1.5deg)}
.badge{position:absolute;z-index:6;left:40px;top:34px;font-family:Bang,Mont,sans-serif;font-size:58px;letter-spacing:2px;color:#fff;background:#ff2638;padding:4px 26px 0;border:6px solid ${INK};border-radius:16px;box-shadow:7px 7px 0 ${INK};transform:rotate(-4deg)}
.hazard{position:absolute;left:0;right:0;bottom:0;height:34px;background:repeating-linear-gradient(-45deg,#ffd000 0 34px,${INK} 34px 68px);z-index:4}
.prop{position:absolute;z-index:6;overflow:visible}
.qm{font-family:Bang,Mont,sans-serif;line-height:1;text-align:center;width:1em;-webkit-text-stroke:12px ${INK};paint-order:stroke fill;text-shadow:0 12px 0 rgba(0,0,0,.35)}
.mark{display:flex;align-items:center;justify-content:center;border-radius:50%;border:6px solid ${INK};color:#fff;font-weight:900;font-size:0.6em;box-shadow:6px 6px 0 ${INK}}
.vs{position:absolute;z-index:6;left:50%;top:430px;transform:translate(-50%,-50%) rotate(-6deg);font-family:Bang,Mont,sans-serif;font-size:170px;color:${t.hi};-webkit-text-stroke:10px ${INK};paint-order:stroke fill;text-shadow:0 12px 0 rgba(0,0,0,.4)}
.lab{position:absolute;z-index:6;bottom:34px;display:flex;align-items:center;gap:12px;font-weight:900;font-size:46px;color:${INK};background:#fff;padding:8px 22px 8px 10px;border-radius:40px;border:5px solid ${INK};box-shadow:6px 6px 0 ${INK}}
.dot{display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;border:4px solid ${INK};color:#fff;font-size:34px;font-weight:900;line-height:1}
.stk{filter:drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff)}
.logo{position:absolute;right:26px;bottom:${c.layout === "warning" ? 48 : 20}px;height:62px;z-index:7;opacity:.95;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}
</style></head><body><div class="rays"></div><div class="vig"></div>${hazard}${body}${badge}
<img class="logo" src="data:image/png;base64,${logo}"/></body></html>`;
}

let browser: Browser | undefined;
export async function closeThumbs() { await browser?.close(); browser = undefined; }

/** Render one concept to a JPEG; text is auto-fitted so it never overflows its zone. */
export async function renderCartoonThumb(c: ThumbConcept, out: string): Promise<string> {
  browser ??= await chromium.launch();
  const fonts = { mont: b64(await fontFile("Montserrat")), bang: b64(await fontFile("Bangers")) };
  const logo = b64(join(ROOT, "brand", "icon-white.png"));
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(pageHtml(c, fonts, logo), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate("window.__name = (f) => f");
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>(".h1").forEach(h => {
      const maxH = Number(h.dataset.maxh ?? 400), box = h.parentElement!;
      let fs = parseFloat(getComputedStyle(h).fontSize);
      // shrink until it fits its height budget and no word overflows the text column
      while (fs > 40 && (h.scrollHeight > maxH || h.scrollWidth > box.clientWidth + 2)) { fs *= 0.94; h.style.fontSize = `${fs}px`; }
    });
  });
  await page.screenshot({ path: out, type: "jpeg", quality: 92 });
  await page.close();
  return out;
}
