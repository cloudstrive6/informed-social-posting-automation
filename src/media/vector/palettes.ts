/** Mood palettes: saturated, flat, rim-lit (see docs/STYLE.md). */
export interface Palette {
  bg: [string, string];        // radial gradient center → edge
  dark: boolean;               // text colour decisions
  primary: string; primaryRim: string;
  secondary: string; secondaryRim: string;
  accent: string; accentRim: string;
  nucleus: string;
  bokeh: string[];
  ink: string;                 // text / outlines on this background
  skin: string[]; cloth: string[]; hair: string[];
}

const people = { skin: ["#f2c6a0", "#d99a6c", "#a8673f", "#6e3f22"], hair: ["#2b1b3d", "#6b3a1f", "#e8b04a", "#1a1a2e", "#b8412c"] };

export const PALETTES: Record<string, Palette> = {
  body: {
    bg: ["#6a1f9e", "#1c0b45"], dark: true,
    primary: "#c42a82", primaryRim: "#ff79c6", secondary: "#1d9fd0", secondaryRim: "#8feaff",
    accent: "#7cf24a", accentRim: "#d4ff9e", nucleus: "#ff4fa0",
    bokeh: ["#ff79c6", "#b04bff", "#8feaff", "#ff4fa0"], ink: "#ffffff",
    ...people, cloth: ["#7c5cff", "#ff6fb5", "#26c6da", "#ffb74d"],
  },
  immune: {
    bg: ["#ff7a3d", "#4a137f"], dark: true,
    primary: "#ffa51e", primaryRim: "#ffe36b", secondary: "#e8338f", secondaryRim: "#ff9ad0",
    accent: "#ff2e4d", accentRim: "#ff9aa8", nucleus: "#e8338f",
    bokeh: ["#ff4d6d", "#ff9ad0", "#ffe36b", "#b04bff"], ink: "#ffffff",
    ...people, cloth: ["#5b2a86", "#ff6f61", "#2ec4b6", "#ffd166"],
  },
  clinic: {
    bg: ["#e9fbf5", "#aee9d9"], dark: false,
    primary: "#23b1dc", primaryRim: "#9ee4f7", secondary: "#95ca5b", secondaryRim: "#d6f0b8",
    accent: "#ff6b6b", accentRim: "#ffc2c2", nucleus: "#1a6f8f",
    bokeh: ["#ffffff", "#c8f5e8", "#9ee4f7"], ink: "#232323",
    ...people, cloth: ["#5b8def", "#ff8a65", "#4db6ac", "#9575cd"],
  },
  night: {
    bg: ["#23398f", "#070f33"], dark: true,
    primary: "#3d7bff", primaryRim: "#9cc2ff", secondary: "#ffd166", secondaryRim: "#fff0b3",
    accent: "#7cf24a", accentRim: "#d4ff9e", nucleus: "#ff6fb5",
    bokeh: ["#9cc2ff", "#ffd166", "#b28dff"], ink: "#ffffff",
    ...people, cloth: ["#ff7aa2", "#5bc0eb", "#9bc53d", "#fde74c"],
  },
  warm: {
    bg: ["#ffc15e", "#ff6b4a"], dark: false,
    primary: "#ff3f6c", primaryRim: "#ffa3b8", secondary: "#5b2a86", secondaryRim: "#b48ee0",
    accent: "#00b3a4", accentRim: "#8ff0e6", nucleus: "#5b2a86",
    bokeh: ["#fff3c4", "#ffd0a8", "#ff9f80"], ink: "#2a1740",
    ...people, cloth: ["#5b2a86", "#00b3a4", "#ff3f6c", "#1d3557"],
  },
  brand: {
    bg: ["#35c3b0", "#0b5e80"], dark: true,
    primary: "#95ca5b", primaryRim: "#d6f0b8", secondary: "#23b1dc", secondaryRim: "#a8ecff",
    accent: "#ffd83d", accentRim: "#fff1a6", nucleus: "#0b5e80",
    bokeh: ["#d6f0b8", "#a8ecff", "#ffffff"], ink: "#ffffff",
    ...people, cloth: ["#ffd83d", "#ff6b6b", "#f2f1f0", "#232323"],
  },
};

export const MOODS = Object.keys(PALETTES);
export const palette = (mood: string): Palette => PALETTES[mood] ?? PALETTES.body;

/** Deterministic PRNG (renders must be reproducible). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hashStr = (s: string) => [...s].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 2166136261);
