/**
 * TikTok per-video metrics through Post for Me's account feed (the "Feeds" permission granted when @informedlab was
 * connected). The feed lists the account's videos with view, like, comment and share counts. Read-only, and every
 * failure is swallowed by the caller: a broken feed never breaks the analytics run.
 * Matching: the publisher stores a Post for Me publish id (not the TikTok video id), so a log row is matched to the feed
 * video posted closest to the time the row was logged (three Shorts a day, hours apart).
 */
import { env } from "../lib/config.js";
import { httpJson } from "../lib/http.js";

const API = "https://api.postforme.dev/v1";
const HANDLE = "informedlab";
const MATCH_MS = 20 * 60_000;

export interface TikTokFeedItem { platform_post_id: string; posted_at: string; metrics?: { view_count?: number; like_count?: number; comment_count?: number; share_count?: number } }
export interface TikTokMetrics { views: number; likes: number; comments: number; shares: number; video_id: string }

/** Pure: row remote id -> metrics, matching each row to the unclaimed feed video nearest its logged time (within 20 minutes). */
export function matchTikTok(rows: { remote_id?: string; at?: string; slot?: string }[], feed: TikTokFeedItem[]): Record<string, TikTokMetrics> {
  const out: Record<string, TikTokMetrics> = {};
  const used = new Set<string>();
  for (const r of rows) {
    const t = Date.parse(r.at ?? r.slot ?? "");
    if (!r.remote_id || !Number.isFinite(t)) continue;
    let best: TikTokFeedItem | undefined, gap = MATCH_MS + 1;
    for (const f of feed) {
      if (used.has(f.platform_post_id)) continue;
      const g = Math.abs(Date.parse(f.posted_at) - t);
      if (g < gap) { gap = g; best = f; }
    }
    if (!best || gap > MATCH_MS) continue;
    used.add(best.platform_post_id);
    const m = best.metrics ?? {};
    out[r.remote_id] = { views: m.view_count ?? 0, likes: m.like_count ?? 0, comments: m.comment_count ?? 0, shares: m.share_count ?? 0, video_id: best.platform_post_id };
  }
  return out;
}

/** Network: up to 3 pages of 50 videos from the @informedlab feed. Throws on any problem (the caller catches). */
export async function fetchTikTokFeed(): Promise<TikTokFeedItem[]> {
  const headers = { authorization: `Bearer ${env("POSTFORME_API_KEY", true)}` };
  const accts = await httpJson<{ data: { id: string; username?: string; external_id?: string; status: string }[] }>(`${API}/social-accounts?platform=tiktok&limit=50`, { headers });
  const acct = accts.data.find(a => a.external_id === HANDLE || a.username?.replace(/^@/, "").toLowerCase() === HANDLE);
  if (!acct) throw new Error("no @informedlab TikTok account in this Post for Me project");
  const feed: TikTokFeedItem[] = [];
  let url: string | undefined = `${API}/social-account-feeds/${acct.id}?limit=50&expand=metrics`;
  for (let page = 0; url && page < 3; page++) {
    const j: { data: TikTokFeedItem[]; meta?: { next?: string; has_more?: boolean } } = await httpJson(url, { headers });
    feed.push(...j.data);
    url = j.meta?.has_more ? j.meta.next : undefined;
  }
  return feed;
}
