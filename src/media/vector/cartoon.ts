/**
 * Cartoon layer: personified faces (MapWarden-style googly eyes + expressions), illustrated scene
 * backdrops for human-scale shots, and the hand-drawn "doodle" theme filter.
 */
import type { Palette } from "./palettes.js";

const INK = "#1b1030";

// ------------------------------------------------------------------ faces
export type Expression = "happy" | "worried" | "shocked" | "sad" | "angry" | "sick" | "proud" | "sleepy";

const brow = (x1: number, y1: number, x2: number, y2: number) =>
  `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 3} ${x2},${y2}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;

/** Open googly eyes (white + pupil), pupils nudged toward +x so flipped characters face each other. */
const openEyes = (r = 9, pupil = 4.5, dy = 0) =>
  [-14, 14].map(x => `<circle cx="${x}" cy="-8" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>` +
    `<circle cx="${x + 2}" cy="${-8 + dy}" r="${pupil}" fill="${INK}"/><circle cx="${x + 3.5}" cy="${-10 + dy}" r="${pupil * 0.35}" fill="#fff"/>`).join("");

const EXPRESSIONS: Record<Expression, { eyes: string; blink: boolean; brows: string; mouth: string; extra: string }> = {
  happy: {
    eyes: openEyes(), blink: true, brows: brow(-21, -22, -8, -23) + brow(8, -23, 21, -22),
    mouth: `<path d="M-10,11 Q0,21 10,11" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    extra: `<circle cx="-24" cy="6" r="5" fill="#ff8fb3" opacity=".55"/><circle cx="24" cy="6" r="5" fill="#ff8fb3" opacity=".55"/>`,
  },
  proud: {
    eyes: `<path d="M-21,-6 Q-14,-15 -7,-6" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M7,-6 Q14,-15 21,-6" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    blink: false, brows: "",
    mouth: `<path d="M-12,9 Q0,26 12,9 Z" fill="#6b1030" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M-6,16 Q0,21 6,16" fill="#ff6b8a"/>`,
    extra: `<circle cx="-24" cy="5" r="5" fill="#ff8fb3" opacity=".6"/><circle cx="24" cy="5" r="5" fill="#ff8fb3" opacity=".6"/>`,
  },
  worried: {
    eyes: openEyes(9, 4, 1), blink: true, brows: brow(-22, -20, -8, -26) + brow(8, -26, 22, -20),
    mouth: `<path d="M-10,15 q5,-4 10,0 q5,4 10,0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    extra: `<path d="M30,-22 q-5,8 0,11 q5,-3 0,-11Z" fill="#8fd8ff" stroke="${INK}" stroke-width="1.5"/>`,
  },
  shocked: {
    eyes: openEyes(11, 3), blink: false, brows: brow(-23, -26, -8, -28) + brow(8, -28, 23, -26),
    mouth: `<ellipse cx="0" cy="15" rx="6.5" ry="8.5" fill="#6b1030" stroke="${INK}" stroke-width="3"/>`,
    extra: "",
  },
  sad: {
    eyes: openEyes(8.5, 4.5, 2), blink: true, brows: brow(-22, -19, -8, -25) + brow(8, -25, 22, -19),
    mouth: `<path d="M-10,18 Q0,9 10,18" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    extra: `<path d="M-16,2 q-4,7 0,9 q4,-2 0,-9Z" fill="#8fd8ff" stroke="${INK}" stroke-width="1.5"/>`,
  },
  angry: {
    eyes: openEyes(8, 4.5, 1), blink: true, brows: `<path d="M-23,-24 L-7,-17" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/><path d="M7,-17 L23,-24" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`,
    mouth: `<path d="M-10,17 Q0,10 10,17" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    extra: `<g stroke="#ff2e4d" stroke-width="3" stroke-linecap="round"><path d="M22,-34 l5,5 M31,-36 l0,7 M36,-30 l-6,2"/></g>`,
  },
  sick: {
    eyes: [-14, 14].map(x => `<path d="M${x - 9},-8 a9,9 0 0,0 18,0 Z" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="${x + 1}" cy="-4" r="3.5" fill="${INK}"/><path d="M${x - 10},-9 h20" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`).join(""),
    blink: false, brows: "",
    mouth: `<path d="M-11,15 q3.7,-4 7.3,0 q3.7,4 7.3,0 q3.7,-4 7.3,0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    extra: `<ellipse cx="-24" cy="5" rx="6" ry="4" fill="#9be15d" opacity=".7"/><ellipse cx="24" cy="5" rx="6" ry="4" fill="#9be15d" opacity=".7"/>`,
  },
  sleepy: {
    eyes: `<path d="M-21,-8 Q-14,-2 -7,-8" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M7,-8 Q14,-2 21,-8" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    blink: false, brows: "",
    mouth: `<ellipse cx="0" cy="14" rx="4" ry="3.5" fill="#6b1030" stroke="${INK}" stroke-width="2.5"/>`,
    extra: `<text x="24" y="-26" font-family="Fredoka,sans-serif" font-weight="700" font-size="16" fill="#fff" stroke="${INK}" stroke-width="3" paint-order="stroke">z</text><text x="33" y="-38" font-family="Fredoka,sans-serif" font-weight="700" font-size="12" fill="#fff" stroke="${INK}" stroke-width="2.5" paint-order="stroke">z</text>`,
  },
};

/**
 * Face overlay drawn in the component viewBox (-60..60). Returns the SVG and the ids to animate:
 * `eyes` (blink with scaleY), `mouth` (expression mouth) and `talk` / `jaw` (talking mouth).
 */
export function faceSvg(expr: string, id: string, scale = 0.75) {
  const e = EXPRESSIONS[expr as Expression] ?? EXPRESSIONS.happy;
  const svg = `<svg viewBox="-60 -60 120 120" width="100%" height="100%" overflow="visible" style="position:absolute;inset:0">` +
    `<g transform="scale(${scale})">${e.extra}${e.brows}<g id="${id}e">${e.eyes}</g><g id="${id}m">${e.mouth}</g>` +
    `<g id="${id}t" opacity="0"><g id="${id}j"><ellipse cx="0" cy="14" rx="8.5" ry="8" fill="#6b1030" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="18" rx="5" ry="3" fill="#ff6b8a"/></g></g></g></svg>`;
  return { svg, eyes: `${id}e`, mouth: `${id}m`, talk: `${id}t`, jaw: `${id}j`, blinks: e.blink };
}

/** Remove a component's built-in eyes/mouth so an overlay face doesn't double up. */
export const stripFace = (svg: string) => svg.replace(/<g class="eyes">.*?<\/g>/g, "").replace(/<path class="mouth"[^>]*\/>/g, "");

// ------------------------------------------------------------------ backdrops
/** Human-scale backdrops are light, so titles on them use dark text. */
export const LIGHT_BACKDROPS = new Set(["room", "kitchen", "outdoors"]);

const cloud = (x: number, y: number, s: number, fill = "#fff") =>
  `<g class="cloud"><g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${s.toFixed(2)})"><ellipse cx="0" cy="0" rx="60" ry="30" fill="${fill}"/><ellipse cx="-38" cy="8" rx="38" ry="22" fill="${fill}"/><ellipse cx="40" cy="8" rx="42" ry="24" fill="${fill}"/><ellipse cx="6" cy="-18" rx="36" ry="28" fill="${fill}"/></g></g>`;

const windowPane = (x: number, y: number, w: number, h: number, u: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${u}" fill="#9fe0ff" stroke="#ffffff" stroke-width="${2.2 * u}"/>` +
  `<rect x="${x}" y="${y + h * 0.62}" width="${w}" height="${h * 0.38}" fill="#b9ecff"/>` +
  cloud(x + w * 0.35, y + h * 0.3, w * 0.0022, "#ffffff") +
  `<path d="M${x + w / 2},${y} v${h} M${x},${y + h / 2} h${w}" stroke="#ffffff" stroke-width="${1.6 * u}"/>`;

function room(W: number, H: number, r: () => number): string {
  const u = Math.min(W, H) / 100, floor = H * 0.72;
  const stripes = Array.from({ length: Math.ceil(W / (8 * u)) }, (_, i) => `<rect x="${i * 8 * u}" y="0" width="${4 * u}" height="${floor}" fill="#ffd9ad" opacity=".45"/>`).join("");
  const boards = Array.from({ length: 6 }, (_, i) => `<path d="M0,${floor + (i + 1) * (H - floor) / 6} H${W}" stroke="#a86a3d" stroke-width="${0.5 * u}" opacity=".5"/>`).join("");
  const ww = W * (W > H ? 0.22 : 0.34), wx = W * 0.1;
  const px = W * (W > H ? 0.68 : 0.62), pw = W * (W > H ? 0.14 : 0.24);
  return `<svg class="bd" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;inset:0">` +
    `<rect width="${W}" height="${H}" fill="#ffe8c9"/>${stripes}` +
    windowPane(wx, H * 0.2, ww, ww * 1.1, u) +
    `<rect x="${px}" y="${H * 0.26}" width="${pw}" height="${pw * 0.75}" rx="${u}" fill="#ffb74d" stroke="#8a5a2b" stroke-width="${1.6 * u}"/>` +
    `<path d="M${px + pw * 0.1},${H * 0.26 + pw * 0.65} l${pw * 0.3},${-pw * 0.35} l${pw * 0.2},${pw * 0.2} l${pw * 0.15},${-pw * 0.12} l${pw * 0.15},${pw * 0.27}Z" fill="#6fb248"/>` +
    `<circle cx="${px + pw * 0.75}" cy="${H * 0.26 + pw * 0.2}" r="${pw * 0.08}" fill="#fff3b0"/>` +
    `<rect x="0" y="${floor}" width="${W}" height="${H - floor}" fill="#d49563"/>${boards}` +
    `<rect x="0" y="${floor - 1.4 * u}" width="${W}" height="${2 * u}" fill="#fff5e8"/>` +
    // potted plant
    `<g transform="translate(${W * 0.88},${floor})"><path d="M${-6 * u},0 l${u},${-9 * u} h${10 * u} l${u},${9 * u}Z" fill="#e8784a"/>` +
    Array.from({ length: 5 }, (_, i) => `<ellipse cx="${(i - 2) * 3 * u}" cy="${-14 * u - (r() * 5 * u)}" rx="${2.6 * u}" ry="${7 * u}" transform="rotate(${(i - 2) * 18} ${(i - 2) * 3 * u} ${-11 * u})" fill="${i % 2 ? "#5da13a" : "#7cc653"}"/>`).join("") + `</g>` +
    `</svg>`;
}

function kitchen(W: number, H: number): string {
  const u = Math.min(W, H) / 100, counter = H * 0.7, tile = 7 * u;
  const tiles = `<defs><pattern id="kt" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse"><rect width="${tile}" height="${tile}" fill="#e6f7f2"/><path d="M${tile},0 V${tile} H0" stroke="#c4e8de" stroke-width="${0.4 * u}" fill="none"/></pattern></defs>`;
  const cabW = W / (W > H ? 6 : 3);
  const upper = Array.from({ length: Math.ceil(W / cabW) }, (_, i) => `<rect x="${i * cabW + u}" y="0" width="${cabW - 2 * u}" height="${H * 0.14}" rx="${u}" fill="#6cbfae"/><rect x="${i * cabW + cabW / 2 - 3 * u}" y="${H * 0.11}" width="${6 * u}" height="${u}" rx="${0.5 * u}" fill="#e6f7f2"/>`).join("");
  const lower = Array.from({ length: Math.ceil(W / cabW) }, (_, i) => `<rect x="${i * cabW + u}" y="${counter + 4 * u}" width="${cabW - 2 * u}" height="${H - counter}" rx="${u}" fill="#4e9f8e"/><rect x="${i * cabW + cabW / 2 - 3 * u}" y="${counter + 8 * u}" width="${6 * u}" height="${u}" rx="${0.5 * u}" fill="#d8f1ea"/>`).join("");
  const ww = W * (W > H ? 0.24 : 0.4);
  return `<svg class="bd" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;inset:0">${tiles}` +
    `<rect width="${W}" height="${H}" fill="url(#kt)"/>${upper}` +
    windowPane((W - ww) / 2, H * 0.2, ww, ww * 0.8, u) +
    // hanging utensils
    [0.15, 0.2, 0.8, 0.85].map((f, i) => `<g transform="translate(${W * f},${H * 0.15})"><line y2="${8 * u}" stroke="#8a8a9a" stroke-width="${0.6 * u}"/>${i % 2 ? `<circle cy="${11 * u}" r="${3.4 * u}" fill="#ff8a65"/>` : `<ellipse cy="${11 * u}" rx="${2.2 * u}" ry="${3.2 * u}" fill="#c9c9d6"/>`}</g>`).join("") +
    `<rect x="0" y="${counter}" width="${W}" height="${4.5 * u}" fill="#fafafa"/><rect x="0" y="${counter + 4.5 * u}" width="${W}" height="${u}" fill="#cfd8dc"/>${lower}` +
    `</svg>`;
}

function outdoors(W: number, H: number, r: () => number): string {
  const u = Math.min(W, H) / 100, ground = H * 0.72;
  const trees = Array.from({ length: W > H ? 5 : 3 }, (_, i) => {
    const x = (i + 0.5) * W / (W > H ? 5 : 3) + (r() - 0.5) * 8 * u, s = 0.8 + r() * 0.5;
    return `<g transform="translate(${x.toFixed(0)},${(ground - 2 * u).toFixed(0)}) scale(${s.toFixed(2)})"><rect x="${-1.5 * u}" y="${-12 * u}" width="${3 * u}" height="${12 * u}" fill="#8a5a2b"/><circle cy="${-18 * u}" r="${9 * u}" fill="${i % 2 ? "#5da13a" : "#6fbf4a"}"/><circle cx="${-5 * u}" cy="${-14 * u}" r="${6 * u}" fill="${i % 2 ? "#6fbf4a" : "#5da13a"}"/></g>`;
  }).join("");
  return `<svg class="bd" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;inset:0">` +
    `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fcfff"/><stop offset="1" stop-color="#d9f4ff"/></linearGradient></defs>` +
    `<rect width="${W}" height="${H}" fill="url(#sky)"/>` +
    `<circle cx="${W * 0.8}" cy="${H * 0.14}" r="${14 * u}" fill="#fff3b0" opacity=".6"/><circle cx="${W * 0.8}" cy="${H * 0.14}" r="${9 * u}" fill="#ffd54f"/>` +
    cloud(W * 0.22, H * 0.12, u / 7) + cloud(W * 0.62, H * 0.26, u / 10) +
    `<ellipse cx="${W * 0.2}" cy="${ground + 6 * u}" rx="${W * 0.55}" ry="${18 * u}" fill="#8fd26a"/>` +
    `<ellipse cx="${W * 0.85}" cy="${ground + 8 * u}" rx="${W * 0.5}" ry="${16 * u}" fill="#7cc653"/>` +
    trees +
    `<rect x="0" y="${ground + 6 * u}" width="${W}" height="${H - ground}" fill="#6fb248"/>` +
    `<path d="M${W * 0.42},${H} Q${W * 0.5},${ground + 20 * u} ${W * 0.56},${ground + 6 * u} L${W * 0.6},${ground + 6 * u} Q${W * 0.58},${ground + 22 * u} ${W * 0.62},${H}Z" fill="#e8d3a0"/>` +
    `</svg>`;
}

/** Giant glowing human silhouette: "where in the body" establishing shots. */
function bodyMap(W: number, H: number, p: Palette): string {
  const s = (H * 0.92) / 230, ox = W / 2 - 50 * s, oy = H * 0.04;
  const shape = `<circle cx="50" cy="20" r="16"/><rect x="43" y="33" width="14" height="10" rx="4"/>` +
    `<path d="M22,48 Q22,40 32,40 H68 Q78,40 78,48 L76,120 Q76,128 68,128 H32 Q24,128 24,120Z"/>` +
    `<rect x="6" y="44" width="15" height="72" rx="7.5" transform="rotate(8 13 44)"/><rect x="79" y="44" width="15" height="72" rx="7.5" transform="rotate(-8 86 44)"/>` +
    `<rect x="30" y="124" width="18" height="100" rx="9"/><rect x="52" y="124" width="18" height="100" rx="9"/>`;
  return `<svg class="bd" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;inset:0">` +
    `<g transform="translate(${ox.toFixed(0)},${oy.toFixed(0)}) scale(${s.toFixed(3)})">` +
    `<g fill="${p.primary}" opacity=".16">${shape}</g><g fill="none" stroke="${p.primaryRim}" stroke-width="1.6" opacity=".55">${shape}</g></g></svg>`;
}

export function backdropSvg(kind: string, W: number, H: number, p: Palette, r: () => number): string {
  if (kind === "room") return room(W, H, r);
  if (kind === "kitchen") return kitchen(W, H);
  if (kind === "outdoors") return outdoors(W, H, r);
  if (kind === "body") return bodyMap(W, H, p);
  return "";
}

// ------------------------------------------------------------------ doodle theme
/** Hand-drawn look: wobbly displaced edges (the seed is animated for a "line boil") + marker outlines. */
export const DOODLE_DEFS = `<svg width="0" height="0" style="position:absolute"><filter id="wob" x="-10%" y="-10%" width="120%" height="120%">` +
  `<feTurbulence id="wobt" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter></svg>`;

export const DOODLE_CSS = `
.doodle .art{filter:url(#wob) drop-shadow(3px 0 0 #2a2a2a) drop-shadow(-3px 0 0 #2a2a2a) drop-shadow(0 3px 0 #2a2a2a) drop-shadow(0 -3px 0 #2a2a2a)}
.doodle .bd{filter:url(#wob)}
.doodle .paper{position:absolute;inset:-6%;background:#fbf7ee;background-image:linear-gradient(#e7e2d4 2px,transparent 2px);background-size:100% 64px}
.doodle .headline,.doodle .stat .sv{font-family:"Fredoka","Brand",sans-serif}
`;
