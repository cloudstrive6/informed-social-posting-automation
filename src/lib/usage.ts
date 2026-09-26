/** Monthly ElevenLabs credit tracking (committed in data/, so CI runs share it). */
import { join } from "node:path";
import { config, DATA } from "./config.js";
import { readJson, writeJson } from "./fsx.js";

const file = join(DATA, "usage", "elevenlabs.json");
/** Billing cycle key: cycles start on the plan's renewal day (e.g. the 26th). */
const month = () => {
  const d = new Date(), day = config.voice.elevenlabs.renewDay ?? 1;
  if (d.getUTCDate() < day) d.setUTCMonth(d.getUTCMonth() - 1);
  return `${d.toISOString().slice(0, 7)}-${String(day).padStart(2, "0")}`;
};

interface Usage { month: string; credits: number; byKind: Record<string, number> }

export function elevenUsage(): Usage {
  const u = readJson<Usage>(file, { month: month(), credits: 0, byKind: {} });
  return u.month === month() ? u : { month: month(), credits: 0, byKind: {} };
}

let runCredits = 0;
/** Credits spent by this process (stored on the content item so parallel CI jobs can be merged in finalize). */
export const creditsThisRun = () => Math.round(runCredits);

export function addElevenUsage(kind: string, credits: number, countForRun = true) {
  if (countForRun) runCredits += credits;
  const u = elevenUsage();
  u.credits = Math.round(u.credits + credits);
  u.byKind[kind] = Math.round((u.byKind[kind] ?? 0) + credits);
  writeJson(file, u);
}

/** Credits a TTS request of `chars` characters costs on the configured model. */
export const ttsCredits = (chars: number) => chars * (config.voice.elevenlabs.creditsPerChar ?? 1);

/**
 * May this piece use ElevenLabs? Only for the configured content kinds, and only if the whole
 * narration fits in what's left of the month (keeping a safety margin), so a video never switches voice midway.
 */
export function canUseEleven(kind: string, chars: number): boolean {
  const e = config.voice.elevenlabs;
  if (!process.env.ELEVENLABS_API_KEY || !e.useFor.includes(kind)) return false;
  const left = e.monthlyCredits * 0.95 - elevenUsage().credits;
  return ttsCredits(chars) * 1.3 <= left; // 30% headroom for Whisper-triggered retakes
}

/** Fraction of the monthly budget still available. */
export const elevenBudgetLeft = () => Math.max(0, 1 - elevenUsage().credits / config.voice.elevenlabs.monthlyCredits);
