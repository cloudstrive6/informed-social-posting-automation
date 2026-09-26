/**
 * Illustration asset packs (both MIT, commercial use OK, no attribution required):
 *  - Microsoft Fluent Emoji Flat (@iconify-json/fluent-emoji-flat): ~3,000 colourful flat-vector illustrations
 *    (people, food, anatomy, microbes, medicine, objects, nature).
 *  - Healthicons (@iconify-json/healthicons): ~2,700 medical icons (organs, conditions, procedures, lab gear),
 *    drawn as rim-lit badges in the shot's palette.
 * The Motion Designer asks in plain words ("avocado", "liver", "woman running"); `resolveIcon` finds the best match.
 */
import { createRequire } from "node:module";
import type { Palette } from "./palettes.js";

const require = createRequire(import.meta.url);
interface IconSet { prefix: string; width?: number; height?: number; icons: Record<string, { body: string; width?: number; height?: number }>; aliases?: Record<string, { parent: string }> }
let fluent: IconSet | undefined, health: IconSet | undefined;
const load = () => {
  fluent ??= require("@iconify-json/fluent-emoji-flat/icons.json");
  health ??= require("@iconify-json/healthicons/icons.json");
};

const SKIN = /-(light|medium-light|medium|medium-dark|dark)$/;
const HEALTH_VARIANT = /-(outline|negative|24px|outline-24px|negative-24px)$/;
// never pick zodiac signs ("cancer"!), flags, keycaps or blood-type buttons
const BLOCK = /^(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces|ophiuchus)$|^flag-|^keycap|button-blood-type|^regional-indicator/;
const STOP = new Set(["a", "an", "the", "of", "with", "and", "icon", "illustration", "emoji", "symbol"]);
const SYN: Record<string, string> = {
  // plain-English → pack vocabulary
  doctor: "health worker", nurse: "health worker", physician: "health worker", scientist: "scientist", researcher: "scientist",
  virus: "microbe", germ: "microbe", bacterium: "bacteria", intestine: "intestine", intestines: "intestine", gut: "intestine",
  sleep: "sleeping", bed: "bed", run: "running", runner: "running", jog: "running", walk: "walking", workout: "weight lifting",
  gym: "weight lifting", blood: "drop of blood", water: "droplet", cigarette: "cigarette", smoking: "cigarette", alcohol: "wine glass",
  sugar: "candy", sweets: "candy", fish: "fish", salmon: "fish", vegetables: "broccoli", fruit: "red apple", pill: "pill", medicine: "pill",
  vaccine: "syringe", injection: "syringe", pregnant: "pregnant woman", baby: "baby", elderly: "old woman", heart: "anatomical heart",
  "older woman": "old woman", "older man": "old man", "elderly woman": "old woman", "elderly man": "old man", coffee: "hot beverage", tea: "teacup without handle",
  cancer: "cancerous cell nuclei", tumor: "cancerous cell nuclei", tumour: "cancerous cell nuclei", "cancer cell": "cancerous cell nuclei", diet: "nutrition",
  obesity: "overweight", overweight: "overweight", "heart organ": "heart organ",
};

export interface IconHit { pack: "fluent" | "health"; name: string; score: number }

function words(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 -]/g, " ").split(/[\s-]+/).filter(w => w && !STOP.has(w));
}

/** Best match for a plain-English query across both packs. `prefer` biases towards one pack. */
export function resolveIcon(query: string, seed = 0, prefer?: "fluent" | "health"): IconHit | undefined {
  load();
  const q0 = query.toLowerCase().replace(/^(fluent|health)[:/]/, "");
  const forced = query.startsWith("health:") ? "health" : query.startsWith("fluent:") ? "fluent" : undefined;
  const qw = words(SYN[q0.trim()] ?? q0);
  if (!qw.length) return undefined;
  let best: IconHit | undefined;
  const consider = (pack: "fluent" | "health", name: string) => {
    if (forced && pack !== forced) return;
    const nw = name.split("-");
    let score = 0;
    if (name === qw.join("-")) score += 20;
    const hits = qw.filter(w => nw.includes(w) || nw.some(n => n.startsWith(w) && w.length > 4)).length;
    if (!hits || hits / qw.length < 0.67) return; // must match most of the request, or fall back to the built-in art
    score += hits * 5 - (nw.length - hits) * 0.8;          // cover the query, stay specific
    if (hits === qw.length) score += 4;
    if (pack === prefer) score += 1.5;
    if (!best || score > best.score) best = { pack, name, score };
  };
  for (const n of Object.keys(fluent!.icons)) if (!SKIN.test(n) && !BLOCK.test(n)) consider("fluent", n);
  for (const n of Object.keys(health!.icons)) if (!HEALTH_VARIANT.test(n)) consider("health", n);
  const hit: IconHit | undefined = best;
  if (!hit) return undefined;
  // people: pick a realistic skin tone deterministically (varied across the video)
  if (hit.pack === "fluent") {
    const tones = ["-light", "-medium-light", "-medium", "-medium-dark", "-dark"].map(t => hit.name + t).filter(n => fluent!.icons[n]);
    if (tones.length) return { ...hit, name: tones[seed % tones.length] };
  }
  return hit;
}

/** SVG markup for a resolved icon, sized to the component viewBox (-60..60). */
export function iconSvg(hit: IconHit, p: Palette, tone: "primary" | "secondary" | "accent"): string {
  load();
  if (hit.pack === "fluent") {
    const ic = fluent!.icons[hit.name];
    const w = ic.width ?? fluent!.width ?? 32, h = ic.height ?? fluent!.height ?? 32;
    // soft contact shadow + the illustration
    return `<ellipse cx="0" cy="52" rx="34" ry="6" fill="#000" opacity=".18"/>` +
      `<g transform="translate(-54,-54) scale(${(108 / Math.max(w, h)).toFixed(4)})">${ic.body}</g>`;
  }
  const ic = health!.icons[hit.name];
  const w = ic.width ?? health!.width ?? 48;
  const [fill, rim] = tone === "secondary" ? [p.secondary, p.secondaryRim] : tone === "accent" ? [p.accent, p.accentRim] : [p.primary, p.primaryRim];
  // rim-lit badge with a white glyph (the reference's round "icon badge" look)
  return `<circle r="54" fill="${fill}" stroke="${rim}" stroke-width="6"/>` +
    `<g transform="translate(-36,-36) scale(${(72 / w).toFixed(4)})" color="#ffffff" fill="#ffffff">${ic.body}</g>`;
}

/** Names worth suggesting to the Motion Designer (it may also ask for anything else in plain words). */
export const ICON_SUGGESTIONS = [
  "anatomical heart", "brain", "lungs", "bone", "tooth", "drop of blood", "microbe", "dna", "pill", "syringe", "adhesive bandage", "thermometer",
  "stethoscope", "microscope", "test tube", "petri dish", "health worker", "scientist", "pregnant woman", "baby", "older woman", "older man",
  "person running", "person walking", "person lifting weights", "person in bed", "sleeping face", "yawning face", "tired face", "hot face",
  "avocado", "broccoli", "red apple", "banana", "carrot", "leafy green", "fish", "egg", "bread", "rice", "cheese", "hamburger", "french fries",
  "pizza", "doughnut", "candy", "soft drink", "hot beverage", "teacup", "wine glass", "beer mug", "cigarette", "droplet", "glass of milk",
  "alarm clock", "hourglass", "mobile phone", "laptop", "bed", "bathtub", "sun", "crescent moon", "fire", "snowflake", "sparkles", "chart increasing",
  "chart decreasing", "magnifying glass", "light bulb", "shield", "check mark button", "cross mark", "warning", "red question mark",
  "health:liver", "health:kidneys", "health:stomach", "health:intestine", "health:pancreas", "health:thyroid", "health:uterus", "health:blood cells",
  "health:virus", "health:bacteria", "health:diabetes", "health:insulin pen", "health:blood pressure", "health:vaccine", "health:mosquito",
  "health:skin", "health:allergies", "health:weight", "health:sleep", "health:exercise", "health:nutrition", "health:mental health", "health:hospital",
];
