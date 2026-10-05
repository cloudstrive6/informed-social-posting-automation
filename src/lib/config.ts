import { readFileSync } from "node:fs";
import { join } from "node:path";

export const ROOT = process.cwd();
// local runs: load git-ignored .env (CI passes secrets as real environment variables)
try { process.loadEnvFile(join(ROOT, ".env")); } catch { /* no .env */ }
export const DATA = join(ROOT, "data");
export const OUT = join(ROOT, "out");

/** One posting slot list per content kind: every platform of that kind posts at the same time. */
export type ScheduleKey = "short" | "long" | "carousel";

export interface ChannelConfig {
  brand: {
    name: string; handle: string; tagline: string; mission: string;
    colors: Record<"blue" | "green" | "dark" | "light" | "alert" | "highlight", string>;
    gradient: string;
    fonts: { display: string; body: string; googleFontsCss: string };
    logos: Record<"horizontalOnLight" | "horizontalOnDark" | "horizontalWhite" | "icon" | "iconWhite", string>;
  };
  audience: { description: string; timezone: string; language: string };
  accounts: Record<string, string>;
  cadence: {
    longPerDay: number; shortPerDay: number; carouselPerDay: number;
    longTargetMinutes: [number, number]; shortTargetSeconds: [number, number];
  };
  schedule: Record<ScheduleKey, string[]>;
  platforms: Record<"youtube" | "instagram" | "facebook" | "tiktok" | "threads", boolean>;
  voice: {
    provider: "elevenlabs" | "chirp" | "chatterbox" | "kokoro"; chatterboxModel: "turbo" | "base"; voiceRef?: string; exaggeration: number;
    chirp?: { voice: string; monthlyFreeChars: number };
    elevenlabs: { voiceId: string; model: string; stability: number; similarity: number; style: number; monthlyCredits: number; creditsPerChar: number; useFor: string[]; renewDay: number };
    kokoroVoice: string; kokoroShortVoice: string; baseSpeed: number; sampleRate: number;
  };
  video: {
    style: "animated"; theme: "vibrant" | "doodle"; fps: number; quality: "draft" | "standard" | "high";
    burnCaptionsLong: boolean; musicVolume: number; sfxVolume: number;
  };
  music: { provider: "library" | "elevenlabs" | "generated"; elevenModel: string; prompts: Record<string, string> };
  sfx: { provider: "kit" | "synth"; customPerVideo: number };
  qa: { enabled: boolean; narrationMaxRetakes: number; sceneWerThreshold: number; maskingWerDelta: number; visualRounds: number; minShotScore: number };
  safety: { policy: string; maxRevisionRounds: number; disclaimer: string; bannedTopics: string[] };
  review: { mode: "auto" | "human" };
  youtube?: { playlists: { pillar: string; title: string; description: string }[]; shortsPlaylist?: { title: string; description: string } };
  spacing: Record<"long" | "short" | "carousel", number>;
  niche: {
    enabled: boolean; name: string; brief: string; pillars: string[]; guardrails: string[];
    radar: { match: string; subreddits: string[]; youtube: string[]; news: string[]; pubmed: string };
  };
  /** Backup Anthropic API key (secret ANTHROPIC_API_KEY → env ANTHROPIC_FALLBACK_API_KEY), used only when the subscription is capped. */
  fallbackApi?: { enabled: boolean; monthlyBudgetUsd: number };
  models: Record<"default" | "trendScout" | "factChecker" | "writer" | "packaging" | "analyst" | "motionShort" | "motionLong" | "critic" | "polish", string>;
}

export const config: ChannelConfig = JSON.parse(readFileSync(join(ROOT, "config", "channel.json"), "utf8"));
// optional overrides for one-off runs
if (process.env.MUSIC_PROVIDER) config.music.provider = process.env.MUSIC_PROVIDER as ChannelConfig["music"]["provider"];

export function env(name: string, required = false): string | undefined {
  const v = process.env[name];
  if (required && !v) throw new Error(`Missing required environment variable ${name}`);
  return v || undefined;
}

export const DRY_RUN = process.env.DRY_RUN === "1";
