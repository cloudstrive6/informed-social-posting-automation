import { join } from "node:path";
import { config, DATA, ScheduleKey } from "./config.js";
import { listDirs, readJson, writeJson } from "./fsx.js";
import type { Carousel, FactCheck, PlannedPiece, Script, SocialCopy, ThumbConcept } from "./schemas.js";
import { slotTime } from "./time.js";
import { readdirSync, existsSync } from "node:fs";

export type Platform = "youtube" | "instagram" | "facebook" | "tiktok" | "threads";
export type PostFormat = "long" | "short" | "reel" | "carousel" | "post";

export interface PostTarget {
  platform: Platform; format: PostFormat; slotKey: ScheduleKey; slot: string;
  status: "pending" | "scheduled" | "published" | "failed" | "held" | "skipped";
  remote_id?: string; url?: string; error?: string; attempts: number; published_at?: string;
}

export interface ContentItem {
  id: string; date: string; kind: "long" | "short" | "carousel"; plan: PlannedPiece;
  status: "ready" | "held" | "failed";
  hold_reason?: string; review_issue?: number; approved_by?: string;
  factcheck?: FactCheck; script?: Script; carousel?: Carousel;
  package: {
    title?: string; title_candidates?: string[]; description?: string; tags?: string[]; pinned_comment?: string;
    thumbnail?: ThumbConcept; social?: SocialCopy; chapters?: string;
  };
  media: { video?: string; thumbnail?: string; slides?: string[]; duration?: number };
  /** Whisper + visual QA results */
  qa?: Record<string, unknown>;
  release_tag?: string;
  /** permanent copy in Backblaze B2 (b2://bucket/content/<date>/<id>/) */
  archive_url?: string;
  /** Public URLs of carousel images (needed by the Instagram API). */
  image_urls?: string[];
  posts: PostTarget[];
  created_at: string;
}

export const queueDir = (date: string) => join(DATA, "queue", date);
export const itemPath = (date: string, id: string) => join(queueDir(date), `${id}.json`);
export const saveItem = (item: ContentItem) => writeJson(itemPath(item.date, item.id), item);

export function loadItems(dates?: string[]): ContentItem[] {
  const ds = dates ?? listDirs(join(DATA, "queue"));
  const out: ContentItem[] = [];
  for (const d of ds) {
    const dir = queueDir(d);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (f.endsWith(".json") && f !== "plan.json") out.push(readJson<ContentItem>(join(dir, f)));
    }
  }
  return out;
}

/** Which platforms/slots each kind of content goes to. Index i = i-th piece of that kind today. */
export function targetsFor(kind: ContentItem["kind"], index: number, date: string): PostTarget[] {
  const tz = config.audience.timezone;
  const p = config.platforms;
  // every platform of a kind shares the kind's slot, so a piece drops everywhere at the same moment
  const times = config.schedule[kind] ?? [];
  if (!times.length) return [];
  const slot = slotTime(date, times[index % times.length], tz).toISOString();
  const mk = (platform: Platform, format: PostFormat): PostTarget[] =>
    p[platform] ? [{ platform, format, slotKey: kind, slot, status: "pending", attempts: 0 }] : [];
  if (kind === "long") return mk("youtube", "long");
  if (kind === "short") return [...mk("youtube", "short"), ...mk("instagram", "reel"), ...mk("tiktok", "short"), ...mk("facebook", "reel")];
  return [...mk("instagram", "carousel"), ...mk("facebook", "post"), ...mk("tiktok", "carousel"), ...mk("threads", "carousel")];
}
