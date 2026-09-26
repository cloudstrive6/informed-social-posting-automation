/**
 * Flat, rim-lit vector components (docs/STYLE.md). Every component draws inside viewBox -60 -60 120 120,
 * centred on 0,0, so the composer can place/scale/animate it uniformly.
 */
import { Palette, rng } from "./palettes.js";

export type Tone = "primary" | "secondary" | "accent";
export interface Look { p: Palette; tone: Tone; seed: number; variant?: string }

const fillOf = (l: Look) => ({ primary: [l.p.primary, l.p.primaryRim], secondary: [l.p.secondary, l.p.secondaryRim], accent: [l.p.accent, l.p.accentRim] })[l.tone];

/** Smooth closed blob through `n` jittered polar points (Catmull-Rom → Bézier). */
export function blobPath(r: number, jitter: number, seed: number, n = 9, cx = 0, cy = 0, sx = 1, sy = 1): string {
  const rand = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 - jitter / 2 + rand() * jitter);
    return [cx + Math.cos(a) * rr * sx, cy + Math.sin(a) * rr * sy];
  });
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

const spikes = (n: number, r0: number, r1: number, color: string, w: number, knob: number, seed = 1) => {
  const rand = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rand() * 0.15;
    const [x0, y0, x1, y1] = [Math.cos(a) * r0, Math.sin(a) * r0, Math.cos(a) * r1, Math.sin(a) * r1];
    return `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>` +
      (knob ? `<circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="${knob}" fill="${color}"/>` : "");
  }).join("");
};

const eyes = (y = -4, gap = 11, r = 5, color = "#1b1030") =>
  `<g class="eyes"><ellipse cx="${-gap}" cy="${y}" rx="${r * 0.8}" ry="${r}" fill="${color}"/><ellipse cx="${gap}" cy="${y}" rx="${r * 0.8}" ry="${r}" fill="${color}"/>` +
  `<circle cx="${-gap + 1.5}" cy="${y - 2}" r="${r * 0.3}" fill="#fff"/><circle cx="${gap + 1.5}" cy="${y - 2}" r="${r * 0.3}" fill="#fff"/></g>`;

// ------------------------------------------------------------------ biology
export function cell(l: Look): string {
  const [fill, rim] = fillOf(l);
  const v = l.variant ?? "healthy";
  if (v === "cancer") {
    const d = blobPath(46, 0.45, l.seed, 13);
    return `<path d="${d}" fill="#3a1030" stroke="${l.p.accent}" stroke-width="6"/>` +
      `<path d="${blobPath(30, 0.5, l.seed + 3, 9)}" fill="#6b1a4f"/>` +
      `<path d="${blobPath(16, 0.4, l.seed + 5, 7, 4, -3)}" fill="${l.p.accent}" opacity=".85"/>` +
      `<circle cx="-18" cy="16" r="4" fill="${l.p.accentRim}"/><circle cx="20" cy="-18" r="3" fill="${l.p.accentRim}"/>`;
  }
  if (v === "immune") {
    return spikes(18, 38, 52, rim, 5, 4, l.seed) +
      `<circle r="40" fill="${fill}" stroke="${rim}" stroke-width="6"/>` +
      `<circle r="20" cx="4" cy="2" fill="${l.p.nucleus}" stroke="${l.p.accentRim}" stroke-width="4"/>` + eyes(-14, 12, 4);
  }
  if (v === "red") {
    return `<ellipse rx="48" ry="40" fill="#e0243c" stroke="#ff7a8a" stroke-width="5"/><ellipse rx="26" ry="20" fill="#b3122a"/>`;
  }
  if (v === "neuron") {
    const arms = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      return `<path d="M0,0 Q${(Math.cos(a + 0.4) * 30).toFixed(1)},${(Math.sin(a + 0.4) * 30).toFixed(1)} ${(Math.cos(a) * 57).toFixed(1)},${(Math.sin(a) * 57).toFixed(1)}" stroke="${rim}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    }).join("");
    return arms + `<circle r="22" fill="${fill}" stroke="${rim}" stroke-width="5"/><circle r="9" fill="${l.p.nucleus}"/>`;
  }
  if (v === "fat") {
    return `<path d="${blobPath(48, 0.12, l.seed, 8)}" fill="#ffe08a" stroke="#fff4c4" stroke-width="5"/><circle cx="10" cy="8" r="10" fill="#e8b93c"/>`;
  }
  // healthy: dark fill, bright rim, contrasting nucleus + organelles
  return `<path d="${blobPath(46, 0.14, l.seed, 8)}" fill="${fill}" stroke="${rim}" stroke-width="7"/>` +
    `<path d="${blobPath(17, 0.2, l.seed + 1, 7, 6, -4)}" fill="${l.p.nucleus}" stroke="${rim}" stroke-width="3"/>` +
    `<circle cx="-20" cy="14" r="4" fill="${rim}" opacity=".7"/><circle cx="-10" cy="24" r="2.5" fill="${rim}" opacity=".7"/><circle cx="24" cy="18" r="3" fill="${rim}" opacity=".6"/>`;
}

export function virus(l: Look): string {
  const [fill, rim] = fillOf(l);
  return spikes(14, 28, 48, rim, 5, 6, l.seed) + `<circle r="32" fill="${fill}" stroke="${rim}" stroke-width="5"/>` +
    `<circle cx="-9" cy="-8" r="6" fill="${rim}" opacity=".6"/><circle cx="10" cy="6" r="8" fill="${rim}" opacity=".45"/><circle cx="-4" cy="14" r="4" fill="${rim}" opacity=".5"/>`;
}

export function bacteria(l: Look): string {
  const [fill, rim] = fillOf(l);
  const fl = [0, 1, 2].map(i => `<path d="M40,${-8 + i * 8} q10,-6 16,0 t12,0" stroke="${rim}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("");
  return fl + `<rect x="-44" y="-20" width="88" height="40" rx="20" fill="${fill}" stroke="${rim}" stroke-width="5"/>` +
    `<circle cx="-18" cy="-4" r="5" fill="${rim}" opacity=".6"/><circle cx="6" cy="6" r="4" fill="${rim}" opacity=".6"/><circle cx="22" cy="-6" r="3" fill="${rim}" opacity=".6"/>`;
}

export function molecule(l: Look): string {
  const [fill, rim] = fillOf(l);
  const nodes = [[0, 0, 14], [-32, -20, 10], [30, -24, 11], [-26, 28, 9], [34, 22, 12]];
  const bonds = nodes.slice(1).map(([x, y]) => `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${rim}" stroke-width="6" stroke-linecap="round"/>`).join("");
  return bonds + nodes.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i ? fill : l.p.accent}" stroke="${rim}" stroke-width="3.5"/>`).join("");
}

export function dna(l: Look): string {
  const [fill, rim] = fillOf(l);
  let s = "";
  for (let i = 0; i <= 12; i++) {
    const y = -54 + i * 9, a = i * 0.55, x = Math.sin(a) * 26;
    s += `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(-x).toFixed(1)}" y2="${y}" stroke="${i % 2 ? l.p.accent : rim}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y}" r="5" fill="${fill}" stroke="${rim}" stroke-width="2"/><circle cx="${(-x).toFixed(1)}" cy="${y}" r="5" fill="${l.p.secondary}" stroke="${l.p.secondaryRim}" stroke-width="2"/>`;
  }
  return s;
}

// ------------------------------------------------------------------ organs (simplified, friendly)
export function heart(l: Look): string {
  return `<path d="M0,44 C-50,10 -52,-30 -26,-40 C-12,-45 -2,-36 0,-26 C2,-36 12,-45 26,-40 C52,-30 50,10 0,44Z" fill="#e8384f" stroke="#ff8fa0" stroke-width="6"/>` +
    `<path d="M-22,-26 q-12,6 -10,20" stroke="#ffc2cb" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<path d="M6,-40 v-12 M16,-38 v-14" stroke="#9b1c3a" stroke-width="8" stroke-linecap="round"/>`;
}
export function brain(l: Look): string {
  const lobes = [[-20, -12, 22], [2, -20, 22], [22, -8, 20], [-14, 12, 20], [12, 12, 21]].map(([x, y, r], i) =>
    `<path d="${blobPath(r, 0.15, l.seed + i, 7, x, y)}" fill="#f28fb3" stroke="#ffc6da" stroke-width="4"/>`).join("");
  return lobes + `<path d="M-30,0 q12,-8 22,2 t24,-2 M-18,-24 q8,10 0,18 M14,-26 q-6,10 4,18" stroke="#c9577f" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
    `<path d="M8,30 q4,14 -2,24" stroke="#f28fb3" stroke-width="10" stroke-linecap="round" fill="none"/>`;
}
export function gut(l: Look): string {
  return `<path d="M-40,-36 h66 q18,0 18,16 t-18,16 h-58 q-14,0 -14,14 t14,14 h58 q16,0 16,14 t-16,14 h-40" stroke="#f08a8a" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M-40,-36 h66 q18,0 18,16 t-18,16 h-58 q-14,0 -14,14 t14,14 h58 q16,0 16,14 t-16,14 h-40" stroke="#ffc2b8" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
}
export function lungs(l: Look): string {
  return `<path d="M-6,-44 v28 M6,-44 v28" stroke="#d9e6f2" stroke-width="8" stroke-linecap="round"/>` +
    `<path d="M-8,-18 C-30,-40 -52,-10 -48,24 C-46,44 -20,46 -10,34 C-4,20 -6,0 -8,-18Z" fill="#ff8fa3" stroke="#ffc2cf" stroke-width="5"/>` +
    `<path d="M8,-18 C30,-40 52,-10 48,24 C46,44 20,46 10,34 C4,20 6,0 8,-18Z" fill="#ff8fa3" stroke="#ffc2cf" stroke-width="5"/>`;
}
export function liver(l: Look): string {
  return `<path d="M-52,-10 C-50,-34 10,-40 48,-26 C58,-20 50,-2 36,6 C14,20 -20,34 -40,26 C-54,20 -54,4 -52,-10Z" fill="#a8434c" stroke="#e0808a" stroke-width="5"/>` +
    `<path d="M-8,-30 q6,20 -4,44" stroke="#7d2a33" stroke-width="3" fill="none"/>`;
}
export function stomach(l: Look): string {
  // J-shaped stomach with oesophagus inlet, duodenum outlet and rugae folds so it doesn't read as a flask
  return `<path d="M-6,-58 C-6,-46 -4,-40 -10,-32" stroke="#f59a8f" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    `<path d="M-12,-34 C-34,-30 -46,-6 -38,18 C-30,42 0,52 22,40 C36,32 40,18 34,8 C30,0 20,2 14,-4 C6,-12 4,-30 -12,-34Z" fill="#f59a8f" stroke="#ffd0c8" stroke-width="5"/>` +
    `<path d="M30,22 C42,22 50,30 50,42" stroke="#f59a8f" stroke-width="11" fill="none" stroke-linecap="round"/>` +
    `<path d="M-30,0 q10,-6 18,2 M-28,16 q12,-6 22,2 M-12,30 q12,-6 22,2" stroke="#d9655a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
export function kidney(l: Look): string {
  return `<path d="M-10,-44 C-44,-44 -50,-6 -40,20 C-30,46 4,50 14,28 C18,18 4,10 6,0 C8,-10 22,-14 18,-28 C14,-40 4,-44 -10,-44Z" fill="#b04a57" stroke="#e8909b" stroke-width="5"/>`;
}
export function bone(l: Look): string {
  return `<path d="M-40,-30 a12,12 0 1 1 16,-6 L30,26 a12,12 0 1 1 6,16 a12,12 0 1 1 -16,6 L-34,-10 a12,12 0 1 1 -6,-20Z" fill="#fff6e0" stroke="#ffffff" stroke-width="4"/>`;
}

// ------------------------------------------------------------------ objects
export function pill(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<g transform="rotate(-35)"><rect x="-44" y="-18" width="88" height="36" rx="18" fill="#ffffff" stroke="${rim}" stroke-width="4"/>` +
    `<path d="M0,-18 h26 a18,18 0 0 1 0,36 h-26Z" fill="${fill}"/><rect x="-34" y="-11" width="22" height="6" rx="3" fill="#fff" opacity=".7"/></g>`;
}
export function syringe(l: Look): string {
  const [fill] = fillOf(l);
  return `<g transform="rotate(-40)"><rect x="-40" y="-12" width="64" height="24" rx="5" fill="#dff6ff" stroke="#ffffff" stroke-width="4" opacity=".95"/>` +
    `<rect x="-36" y="-8" width="40" height="16" rx="3" fill="${fill}"/><rect x="24" y="-5" width="10" height="10" fill="#b8c7d6"/>` +
    `<line x1="34" y1="0" x2="60" y2="0" stroke="#e6eef5" stroke-width="3"/><rect x="-52" y="-16" width="10" height="32" rx="3" fill="#b8c7d6"/><rect x="-58" y="-3" width="8" height="6" fill="#b8c7d6"/></g>`;
}
export function drop(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<path d="M0,-50 C18,-22 36,0 36,18 A36,36 0 0 1 -36,18 C-36,0 -18,-22 0,-50Z" fill="${fill}" stroke="${rim}" stroke-width="5"/><path d="M-18,14 q0,14 12,20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
}
export function flame(l: Look): string {
  return `<path d="M0,50 C-34,50 -44,20 -30,-6 C-24,10 -12,12 -10,4 C-16,-20 0,-40 10,-52 C12,-30 44,-14 36,22 C32,40 18,50 0,50Z" fill="#ff5a36" stroke="#ffb13d" stroke-width="5"/><path d="M0,44 C-16,44 -20,26 -10,14 C-6,24 4,22 4,12 C16,20 18,40 0,44Z" fill="#ffd23d"/>`;
}
export function shield(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<path d="M0,-50 L42,-34 C42,4 26,34 0,50 C-26,34 -42,4 -42,-34Z" fill="${fill}" stroke="${rim}" stroke-width="6"/><path d="M-16,0 l12,12 l22,-24" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
export function clock(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<circle r="46" fill="#fff" stroke="${fill}" stroke-width="8"/><circle r="4" fill="${fill}"/><line y2="-30" stroke="${l.p.ink === "#ffffff" ? "#232323" : l.p.ink}" stroke-width="6" stroke-linecap="round" class="hand-m"/><line x2="20" stroke="${rim}" stroke-width="6" stroke-linecap="round" class="hand-h" stroke="#232323"/>`;
}
export function moon(l: Look): string {
  return `<path d="M10,-46 A46,46 0 1 0 46,14 A36,36 0 1 1 10,-46Z" fill="#ffe08a" stroke="#fff4c4" stroke-width="4"/><circle cx="-12" cy="10" r="5" fill="#f2c95c"/><circle cx="-2" cy="-14" r="3" fill="#f2c95c"/>`;
}
export function sun(l: Look): string {
  return spikes(12, 36, 54, "#ffd23d", 7, 0) + `<circle r="32" fill="#ffb627" stroke="#ffe27a" stroke-width="5"/>`;
}
export function glass(l: Look): string {
  return `<path d="M-30,-44 L30,-44 L24,46 L-24,46Z" fill="#dff6ff" fill-opacity=".45" stroke="#ffffff" stroke-width="4"/><path d="M-27,-14 L27,-14 L24,44 L-24,44Z" fill="#4fc3f7" opacity=".85"/><circle cx="-8" cy="10" r="4" fill="#fff" opacity=".6"/><circle cx="6" cy="26" r="3" fill="#fff" opacity=".6"/>`;
}
export function coffee(l: Look): string {
  return `<path d="M-34,-20 h60 l-6,56 h-48Z" fill="#fff" stroke="#e8e0d8" stroke-width="4"/><ellipse cx="-4" cy="-20" rx="30" ry="7" fill="#6b3f22"/><path d="M26,-8 q18,0 16,16 t-18,14" stroke="#fff" stroke-width="7" fill="none"/>` +
    `<path d="M-14,-34 q-6,-8 0,-16 M0,-34 q-6,-8 0,-16 M14,-34 q-6,-8 0,-16" stroke="#ffffff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7" class="steam"/>`;
}
export function apple(l: Look): string {
  return `<path d="M0,-26 C-30,-44 -54,-14 -44,16 C-36,42 -14,50 0,40 C14,50 36,42 44,16 C54,-14 30,-44 0,-26Z" fill="#ef3b4f" stroke="#ff8e9a" stroke-width="5"/><path d="M0,-28 q2,-14 10,-22" stroke="#6b3f22" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6,-40 q18,-12 26,4 q-18,6 -26,-4Z" fill="#7cc242"/><path d="M-26,-6 q-6,10 -2,22" stroke="#ffc2c8" stroke-width="5" fill="none" stroke-linecap="round"/>`;
}
export function avocado(l: Look): string {
  return `<path d="M0,-50 C22,-50 26,-20 36,6 C46,34 26,52 0,52 C-26,52 -46,34 -36,6 C-26,-20 -22,-50 0,-50Z" fill="#3f7d20" stroke="#6fae3f" stroke-width="5"/><path d="M0,-40 C16,-40 20,-14 28,8 C36,30 20,44 0,44 C-20,44 -36,30 -28,8 C-20,-14 -16,-40 0,-40Z" fill="#d4ea8a"/><circle cy="16" r="16" fill="#8a4f2a"/>`;
}
export function broccoli(l: Look): string {
  return `<path d="M-8,50 L-6,6 L6,6 L8,50Z" fill="#a8d672"/>` + [[-22, -8, 18], [0, -24, 22], [22, -8, 18], [-10, -2, 16], [12, -2, 16]].map(([x, y, r], i) => `<path d="${blobPath(r, 0.2, 40 + i, 8, x, y)}" fill="#3f9b3a" stroke="#7bd46a" stroke-width="3"/>`).join("");
}
export function fish(l: Look): string {
  return `<path d="M-44,0 C-24,-30 24,-30 38,0 C24,30 -24,30 -44,0Z" fill="#ff8a65" stroke="#ffc1a8" stroke-width="5"/><path d="M36,0 L58,-18 L58,18Z" fill="#ff8a65" stroke="#ffc1a8" stroke-width="4"/><circle cx="-26" cy="-6" r="5" fill="#1b1030"/>`;
}
export function sugar(l: Look): string {
  return `<g transform="rotate(-12)"><rect x="-34" y="-34" width="68" height="68" rx="8" fill="#ffffff" stroke="#e6f0ff" stroke-width="4"/><path d="M-34,-34 l14,-12 h68 l-14,12Z" fill="#f2f6ff"/><circle cx="-12" cy="-6" r="3" fill="#dde6f5"/><circle cx="10" cy="12" r="3" fill="#dde6f5"/></g>`;
}
export function dumbbell(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<rect x="-36" y="-5" width="72" height="10" rx="4" fill="#b8c7d6"/>` + [-40, 28].map(x => `<rect x="${x}" y="-24" width="12" height="48" rx="4" fill="${fill}" stroke="${rim}" stroke-width="3"/>`).join("") +
    [-50, 40].map(x => `<rect x="${x}" y="-16" width="10" height="32" rx="3" fill="${fill}" stroke="${rim}" stroke-width="3"/>`).join("");
}
export function bed(l: Look): string {
  return `<rect x="-54" y="0" width="108" height="26" rx="6" fill="#7c5cff"/><rect x="-54" y="-30" width="10" height="70" rx="4" fill="#5b3fd1"/><rect x="-40" y="-14" width="30" height="16" rx="8" fill="#fff"/><path d="M-12,-8 h62 v10 h-62Z" fill="#a78bff"/><rect x="44" y="-6" width="10" height="46" rx="4" fill="#5b3fd1"/>`;
}
export function phone(l: Look): string {
  return `<rect x="-28" y="-50" width="56" height="100" rx="10" fill="#232323" stroke="#555" stroke-width="3"/><rect x="-22" y="-40" width="44" height="78" rx="4" fill="#8feaff"/><circle cy="44" r="3" fill="#555"/>`;
}
export function chart(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<line x1="-50" y1="44" x2="54" y2="44" stroke="${l.p.ink}" stroke-width="4"/>` + [[-40, 20], [-14, 44], [12, 64], [38, 84]].map(([x, h], i) => `<rect class="bar" x="${x}" y="${44 - h}" width="20" height="${h}" rx="4" fill="${i === 3 ? l.p.accent : fill}" stroke="${rim}" stroke-width="3"/>`).join("");
}
export function arrow(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<path d="M-50,-12 h60 v-18 l40,30 l-40,30 v-18 h-60Z" fill="${fill}" stroke="${rim}" stroke-width="5" stroke-linejoin="round"/>`;
}
export function check(l: Look): string {
  return `<circle r="46" fill="#3fbf6a" stroke="#a8f0c0" stroke-width="6"/><path d="M-20,0 l14,14 l26,-28" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
export function cross(l: Look): string {
  return `<circle r="46" fill="#ff3b5c" stroke="#ffb0bf" stroke-width="6"/><path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`;
}
export function question(l: Look): string {
  const [fill, rim] = fillOf(l);
  return `<circle r="46" fill="${fill}" stroke="${rim}" stroke-width="6"/><text y="18" text-anchor="middle" font-size="60" font-weight="900" fill="#fff" font-family="Brand, sans-serif">?</text>`;
}

// ------------------------------------------------------------------ characters
/** Friendly flat person (full body). Variants: "doctor", "scientist", "patient", "default". */
export function person(l: Look): string {
  const r = rng(l.seed);
  const skin = l.p.skin[Math.floor(r() * l.p.skin.length)];
  const hair = l.p.hair[Math.floor(r() * l.p.hair.length)];
  const cloth = l.variant === "doctor" || l.variant === "scientist" ? "#ffffff" : l.p.cloth[Math.floor(r() * l.p.cloth.length)];
  const pants = "#3b3561";
  const long = r() > 0.5;
  const glasses = l.variant === "scientist" || r() > 0.6;
  return `<g class="body">` +
    `<rect x="-11" y="22" width="9" height="34" rx="4" fill="${pants}"/><rect x="2" y="22" width="9" height="34" rx="4" fill="${pants}"/>` +
    `<path d="M-18,-12 q0,-8 8,-8 h20 q8,0 8,8 v38 h-36Z" fill="${cloth}" stroke="${l.variant === "doctor" || l.variant === "scientist" ? "#dfe8f0" : "none"}" stroke-width="2"/>` +
    (l.variant === "doctor" ? `<path d="M-6,-18 q6,16 12,0" stroke="#23b1dc" stroke-width="3" fill="none"/><circle cx="6" cy="-2" r="3" fill="#23b1dc"/>` : "") +
    `<rect x="-26" y="-14" width="8" height="30" rx="4" fill="${cloth}" class="arm-l"/><rect x="18" y="-14" width="8" height="30" rx="4" fill="${cloth}" class="arm-r"/>` +
    `<circle cx="-22" cy="17" r="4.5" fill="${skin}"/><circle cx="22" cy="17" r="4.5" fill="${skin}"/>` +
    `<rect x="-4" y="-26" width="8" height="8" fill="${skin}"/>` +
    `<g class="head"><ellipse cy="-38" rx="15" ry="16" fill="${skin}"/>` +
    (long ? `<path d="M-16,-40 q0,-22 16,-22 q16,0 16,22 v16 q-6,-2 -6,-14 q-10,-6 -20,0 q0,12 -6,14Z" fill="${hair}"/>` : `<path d="M-16,-40 q0,-22 16,-22 q16,0 16,20 q-10,-10 -32,2Z" fill="${hair}"/>`) +
    `<circle cx="-5" cy="-38" r="2" fill="#1b1030"/><circle cx="6" cy="-38" r="2" fill="#1b1030"/><path d="M-4,-30 q4,3 8,0" stroke="#1b1030" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    (glasses ? `<circle cx="-5" cy="-38" r="5.5" fill="none" stroke="#e8338f" stroke-width="2"/><circle cx="6" cy="-38" r="5.5" fill="none" stroke="#e8338f" stroke-width="2"/><line x1="0.5" y1="-38" x2="0.5" y2="-38" stroke="#e8338f"/>` : "") +
    (l.variant === "scientist" || l.variant === "doctor" ? `<rect x="-9" y="-33" width="18" height="9" rx="3" fill="#8feaff" opacity=".9"/>` : "") +
    `</g></g>`;
}

/** "Medi" — InforMed's mascot: a heart-shaped buddy in the logo gradient. */
export function mascot(l: Look): string {
  return `<defs><linearGradient id="mg${l.seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#23b1dc"/><stop offset="1" stop-color="#95ca5b"/></linearGradient></defs>` +
    `<path d="M0,46 C-46,16 -54,-22 -30,-36 C-16,-44 -4,-36 0,-26 C4,-36 16,-44 30,-36 C54,-22 46,16 0,46Z" fill="url(#mg${l.seed})" stroke="#e8fff4" stroke-width="5"/>` +
    `<circle cx="14" cy="-50" r="9" fill="#95ca5b" stroke="#e8fff4" stroke-width="3"/>` +
    eyes(-6, 12, 6) + `<path d="M-8,12 q8,8 16,0" stroke="#1b1030" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
    `<circle cx="-22" cy="6" r="5" fill="#ff8fb3" opacity=".6"/><circle cx="22" cy="6" r="5" fill="#ff8fb3" opacity=".6"/>`;
}

export const COMPONENTS: Record<string, (l: Look) => string> = {
  cell, virus, bacteria, molecule, dna, heart, brain, gut, lungs, liver, stomach, kidney, bone,
  pill, syringe, drop, flame, shield, clock, moon, sun, glass, coffee, apple, avocado, broccoli, fish, sugar,
  dumbbell, bed, phone, chart, arrow, check, cross, question, person, mascot,
};
/** "icon" = any illustration from the asset packs, chosen by plain-English `variant` (see iconPack.ts). */
export const COMPONENT_NAMES = [...Object.keys(COMPONENTS), "icon"];
