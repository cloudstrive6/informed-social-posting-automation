import { copyFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../lib/config.js";
import { ensureDir, writeText } from "../lib/fsx.js";
import type { Scene, Source } from "../lib/schemas.js";
import { installBrandAssets } from "./fonts.js";
import { captionWords, Timeline, Word } from "./tts.js";

const C = config.brand.colors;
export const esc = (s: string) => (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f2 = (n: number) => Math.max(0, n).toFixed(3);

interface Ctx { els: string[]; anims: string[]; n: number }
const id = (c: Ctx, p: string) => `${p}${c.n++}`;

/** A timed element; `anim` receives the element's CSS selector and returns GSAP calls. */
function clip(c: Ctx, cls: string, start: number, dur: number, html: string, anim?: (sel: string) => string, extra = "") {
  const eid = id(c, "e");
  c.els.push(`<div id="${eid}" class="clip ${cls}" data-start="${f2(start)}" data-duration="${f2(dur)}" ${extra}>${html}</div>`);
  if (anim) c.anims.push(anim(`#${eid}`));
  return eid;
}

const popIn = (t: number) => (s: string) => `tl.fromTo("${s}",{opacity:0,y:40,scale:0.92},{opacity:1,y:0,scale:1,duration:0.45,ease:"back.out(1.7)"},${f2(t)});`;
const slideIn = (t: number) => (s: string) => `tl.fromTo("${s}",{opacity:0,x:-60},{opacity:1,x:0,duration:0.4,ease:"power3.out"},${f2(t)});`;

/** Group words into caption phrases (≤ max words, break on punctuation). */
function phrases(words: Word[], max: number): Word[][] {
  const out: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= max || /[.!?,;:—]$/.test(w.text)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
}

function highlight(text: string, word?: string) {
  const t = esc(text);
  if (!word) return t;
  const rx = new RegExp(`\\b(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "i");
  return t.replace(rx, `<span class="hl">$1</span>`);
}

function cardHtml(scene: Scene): string | undefined {
  const v = scene.visual;
  switch (v.kind) {
    case "stat": {
      const len = (v.stat_value ?? "").length;
      const scale = len <= 4 ? 1 : len <= 7 ? 0.75 : 0.55; // long values shrink instead of wrapping
      return `<div class="card stat"><div class="stat-v" style="font-size:calc(var(--stat) * ${scale})">${esc(v.stat_value ?? "")}</div><div class="stat-l">${esc(v.stat_label ?? scene.on_screen_text)}</div></div>`;
    }
    case "quote": return `<div class="card quote"><div class="q">“${esc(v.quote ?? "")}”</div><div class="attr">— ${esc(v.attribution ?? "")}</div></div>`;
    case "chapter": return `<div class="chapter"><div class="bar"></div><div class="ch-t">${esc(scene.section)}</div></div>`;
    default: return undefined;
  }
}

const baseCss = (W: number, H: number, fontFace: string) => `
${fontFace}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${C.dark}}
#root{position:relative;width:${W}px;height:${H}px;font-family:"Brand",Montserrat,sans-serif;color:#fff}
.clip{position:absolute;inset:0}
.bg{object-fit:cover;width:100%;height:100%}
.vignette{background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)}
.hl{color:${C.highlight}}
.logo{position:absolute}
.progress{position:absolute;left:0;bottom:0;height:8px;width:0;background:${config.brand.gradient}}
.card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;padding:48px 64px;border-radius:28px;background:rgba(35,35,35,.82);box-shadow:0 20px 60px rgba(0,0,0,.45);border:3px solid rgba(255,255,255,.08)}
.stat-v{font-weight:900;line-height:1;white-space:nowrap;background:${config.brand.gradient};-webkit-background-clip:text;background-clip:text;color:transparent}
.stat-l{font-weight:700;margin-top:18px;color:${C.light}}
.q{font-weight:700;line-height:1.25}
.attr{margin-top:24px;font-weight:600;color:${C.green}}
.chapter{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;background:rgba(35,35,35,.55)}
.chapter .bar{width:180px;height:10px;border-radius:5px;background:${config.brand.gradient};margin-bottom:28px}
.ch-t{font-weight:900;text-transform:uppercase;letter-spacing:.02em;text-align:center;padding:0 80px}
.list{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;gap:22px}
.li{display:flex;align-items:center;gap:22px;background:rgba(35,35,35,.85);border-radius:20px;padding:22px 34px;font-weight:700}
.li .dot{flex:none;border-radius:50%;background:${config.brand.gradient};color:${C.dark};font-weight:900;display:flex;align-items:center;justify-content:center}
.myth,.fact{position:absolute;left:50%;transform:translateX(-50%);border-radius:24px;padding:30px 44px;font-weight:800;text-align:center;box-shadow:0 16px 50px rgba(0,0,0,.4)}
.myth{background:rgba(35,35,35,.9);color:#ddd}
.myth b{display:block;color:${C.alert};letter-spacing:.12em;margin-bottom:10px}
.myth s{text-decoration-color:${C.alert};text-decoration-thickness:6px}
.fact{background:${C.light};color:${C.dark}}
.fact b{display:block;color:#3f8f21;letter-spacing:.12em;margin-bottom:10px}
.src{position:absolute;font-weight:600;color:rgba(255,255,255,.85);background:rgba(0,0,0,.45);border-radius:10px}
`;

function page(W: number, H: number, duration: number, css: string, c: Ctx) {
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=${W}, height=${H}"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${css}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${f2(duration)}" data-width="${W}" data-height="${H}" data-fps="${config.video.fps}">
${c.els.join("\n")}
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
${c.anims.join("\n")}
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body></html>`;
}

function sourceLabel(scene: Scene, sources: Source[]): string | undefined {
  const s = sources.find(x => scene.source_ids?.includes(x.id));
  return s ? `Source: ${s.publisher}${s.year ? `, ${s.year}` : ""}` : undefined;
}

// ------------------------------------------------------------------ long-form 16:9
export async function composeLong(dir: string, bgVideo: string, scenes: Scene[], sources: Source[], tl: Timeline): Promise<string> {
  const W = 1920, H = 1080, D = tl.duration;
  ensureDir(dir);
  const fontFace = await installBrandAssets(dir);
  copyFileSync(bgVideo, join(dir, "assets", "bg.mp4"));
  const c: Ctx = { els: [], anims: [], n: 0 };
  const byId = new Map(tl.scenes.map(s => [s.id, s]));

  c.els.push(`<video id="bg" class="clip bg" src="assets/bg.mp4" data-start="0" data-duration="${f2(D)}" muted playsinline></video>`);
  c.els.push(`<div id="vig" class="clip vignette" data-start="0" data-duration="${f2(D)}"></div>`);

  scenes.forEach((scene, i) => {
    const t = byId.get(scene.id);
    if (!t) return;
    const start = t.start, end = (tl.scenes[i + 1]?.start ?? D), len = end - start;
    const v = scene.visual;
    const card = cardHtml(scene);
    if (card) {
      clip(c, "", start + 0.15, len - 0.15, card, popIn(start + 0.15));
    } else if (v.kind === "list" && v.items?.length) {
      const items = v.items.slice(0, 5);
      const html = `<div class="list">${items.map((it, k) => `<div class="li" id="li${c.n}_${k}" style="font-size:44px"><span class="dot" style="width:62px;height:62px;font-size:32px">${k + 1}</span>${esc(it)}</div>`).join("")}</div>`;
      const base = c.n;
      clip(c, "", start, len, html);
      items.forEach((_, k) => c.anims.push(slideIn(start + 0.2 + (k * Math.max(0.5, len - 1)) / items.length)(`#li${base}_${k}`)));
    } else if (v.kind === "myth_fact") {
      const half = start + len * 0.42;
      clip(c, "", start + 0.1, len - 0.1, `<div class="myth" style="top:24%;font-size:46px;max-width:1400px"><b style="font-size:30px">MYTH</b><s>${esc(v.myth ?? "")}</s></div>`, popIn(start + 0.1));
      clip(c, "", half, end - half, `<div class="fact" style="top:55%;font-size:46px;max-width:1400px"><b style="font-size:30px">FACT</b>${esc(v.fact ?? "")}</div>`, popIn(half));
    } else if (scene.on_screen_text) {
      // kinetic kicker text, lower-left
      clip(c, "", start + 0.25, Math.max(0.5, len - 0.25),
        `<div style="position:absolute;left:90px;top:120px;max-width:1100px;font-weight:900;font-size:78px;line-height:1.05;text-transform:uppercase;text-shadow:0 6px 30px rgba(0,0,0,.6)">${esc(scene.on_screen_text)}<div style="width:140px;height:10px;border-radius:5px;margin-top:22px;background:${config.brand.gradient}"></div></div>`,
        slideIn(start + 0.25));
    }
    const src = sourceLabel(scene, sources);
    if (src && v.kind !== "chapter") clip(c, "", start + 0.5, Math.max(0.5, len - 0.5), `<div class="src" style="right:40px;bottom:36px;font-size:22px;padding:8px 16px">${esc(src)}</div>`);

    if (config.video.burnCaptionsLong) {
      const words = captionWords(scene.narration, t.words);
      for (const p of phrases(words, 7)) {
        const ps = p[0].start, pe = Math.max(p[p.length - 1].end, ps + 0.4);
        clip(c, "", ps, pe - ps, `<div style="position:absolute;left:50%;bottom:${v.kind === "myth_fact" ? 40 : 90}px;transform:translateX(-50%);max-width:1500px;text-align:center;font-weight:700;font-size:44px;line-height:1.2;padding:10px 22px;border-radius:12px;background:rgba(0,0,0,.55)">${esc(p.map(w => w.text).join(" "))}</div>`);
      }
    }
  });

  // the timed element is a full-frame wrapper: the renderer sizes timed elements, so an <img> clip gets stretched
  c.els.push(`<div id="logo" class="clip" data-start="0" data-duration="${f2(D)}"><img class="logo" src="assets/logo-horizontal-white.png" style="right:48px;top:40px;width:230px;height:auto;opacity:.85"/></div>`);
  c.els.push(`<div class="clip" data-start="0" data-duration="${f2(D)}"><div id="prog" class="progress" style="left:0;bottom:0"></div></div>`);
  c.anims.push(`tl.fromTo("#prog",{width:"0%"},{width:"100%",duration:${f2(D)},ease:"none"},0);`);

  const css = baseCss(W, H, fontFace) + `#root{--stat:220px}.stat-l{font-size:48px;max-width:1100px}.q{font-size:58px;max-width:1300px}.attr{font-size:34px}.ch-t{font-size:110px}`;
  writeText(join(dir, "index.html"), page(W, H, D, css, c));
  return dir;
}

// ------------------------------------------------------------------ vertical 9:16 (Shorts / Reels / TikTok)
export async function composeShort(dir: string, bgVideo: string, scenes: Scene[], sources: Source[], tl: Timeline): Promise<string> {
  const W = 1080, H = 1920, D = tl.duration;
  ensureDir(dir);
  const fontFace = await installBrandAssets(dir);
  copyFileSync(bgVideo, join(dir, "assets", "bg.mp4"));
  const c: Ctx = { els: [], anims: [], n: 0 };
  const byId = new Map(tl.scenes.map(s => [s.id, s]));

  c.els.push(`<video id="bg" class="clip bg" src="assets/bg.mp4" data-start="0" data-duration="${f2(D)}" muted playsinline></video>`);
  c.els.push(`<div id="shade" class="clip" data-start="0" data-duration="${f2(D)}" style="background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)"></div>`);

  scenes.forEach((scene, i) => {
    const t = byId.get(scene.id);
    if (!t) return;
    const start = t.start, end = (tl.scenes[i + 1]?.start ?? D), len = end - start;
    const v = scene.visual;

    if (i === 0) {
      // The hook must be on screen from frame 0 (sound-off viewers + the auto thumbnail).
      clip(c, "", 0, end, `<div style="position:absolute;left:60px;right:60px;top:250px;text-align:center;font-weight:900;font-size:96px;line-height:1.02;text-transform:uppercase;text-shadow:0 8px 40px rgba(0,0,0,.7)">${highlight(scene.on_screen_text, scene.on_screen_text.split(" ").slice(-1)[0])}</div>`,
        s => `tl.fromTo("${s}",{scale:1.08},{scale:1,duration:0.5,ease:"power2.out"},0);`);
    } else {
      const card = cardHtml(scene);
      if (card) clip(c, "", start + 0.1, len - 0.1, card, popIn(start + 0.1));
      else if (v.kind === "list" && v.items?.length) {
        const items = v.items.slice(0, 4);
        const base = c.n;
        clip(c, "", start, len, `<div class="list" style="top:40%;width:900px">${items.map((it, k) => `<div class="li" id="li${base}_${k}" style="font-size:46px"><span class="dot" style="width:66px;height:66px;font-size:34px">${k + 1}</span>${esc(it)}</div>`).join("")}</div>`);
        items.forEach((_, k) => c.anims.push(slideIn(start + 0.15 + (k * Math.max(0.4, len - 0.8)) / items.length)(`#li${base}_${k}`)));
      } else if (v.kind === "myth_fact") {
        const half = start + len * 0.42;
        clip(c, "", start, len, `<div class="myth" style="top:22%;width:920px;font-size:50px"><b style="font-size:32px">MYTH</b><s>${esc(v.myth ?? "")}</s></div>`, popIn(start));
        clip(c, "", half, end - half, `<div class="fact" style="top:42%;width:920px;font-size:50px"><b style="font-size:32px">FACT</b>${esc(v.fact ?? "")}</div>`, popIn(half));
      } else if (scene.on_screen_text) {
        clip(c, "", start + 0.1, len - 0.1, `<div style="position:absolute;left:70px;right:70px;top:260px;text-align:center;font-weight:900;font-size:78px;line-height:1.05;text-transform:uppercase;text-shadow:0 6px 30px rgba(0,0,0,.7)">${esc(scene.on_screen_text)}</div>`, popIn(start + 0.1));
      }
    }

    // word-by-word captions: 3-word groups, active word highlighted
    const words = captionWords(scene.narration, t.words);
    for (const p of phrases(words, 3)) {
      const ps = p[0].start, pe = Math.max(p[p.length - 1].end, ps + 0.3);
      const base = c.n;
      clip(c, "", ps, pe - ps,
        `<div style="position:absolute;left:60px;right:60px;top:1180px;text-align:center;font-weight:900;font-size:84px;line-height:1.05;text-transform:uppercase;-webkit-text-stroke:3px #000;paint-order:stroke fill;text-shadow:0 8px 24px rgba(0,0,0,.8)">${p.map((w, k) => `<span id="w${base}_${k}">${esc(w.text)}</span>`).join(" ")}</div>`,
        s => `tl.fromTo("${s}",{scale:0.85,opacity:0},{scale:1,opacity:1,duration:0.12,ease:"back.out(2)"},${f2(ps)});`);
      p.forEach((w, k) => c.anims.push(`tl.set("#w${base}_${k}",{color:"${C.highlight}"},${f2(w.start)});tl.set("#w${base}_${k}",{color:"#ffffff"},${f2(w.end + 0.02)});`));
    }
    const src = sourceLabel(scene, sources);
    if (src && i > 0) clip(c, "", start + 0.3, Math.max(0.4, len - 0.3), `<div class="src" style="left:50%;transform:translateX(-50%);top:1500px;font-size:26px;padding:8px 18px;white-space:nowrap">${esc(src)}</div>`);
  });

  c.els.push(`<div id="logo" class="clip" data-start="0" data-duration="${f2(D)}"><img class="logo" src="assets/logo-horizontal-white.png" style="left:410px;top:110px;width:260px;height:auto;opacity:.9"/></div>`);
  c.els.push(`<div class="clip" data-start="0" data-duration="${f2(D)}"><div id="prog" class="progress" style="left:0;top:0;height:10px"></div></div>`);
  c.anims.push(`tl.fromTo("#prog",{width:"0%"},{width:"100%",duration:${f2(D)},ease:"none"},0);`);

  const css = baseCss(W, H, fontFace) + `#root{--stat:230px}.card{width:900px;top:34%}.stat-l{font-size:54px}.q{font-size:58px}.attr{font-size:36px}.ch-t{font-size:96px}`;
  writeText(join(dir, "index.html"), page(W, H, D, css, c));
  return dir;
}
