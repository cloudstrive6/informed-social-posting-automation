/**
 * Facebook Reel metrics through the Graph API (`/{video-id}/video_insights` with the Page token, which has
 * read_insights since 2026-11-16). Read-only, sequential and capped per run; the caller swallows every failure, so a
 * Meta problem never breaks the analytics run. Zero plays are real data and stay zero.
 * Matching: the publisher logs the reel's video id as remote_id (facebookReel returns the upload's video_id; Shorts
 * over 90 s go up as Page videos and log that video id), so rows join by id. Only when a row's own read fails and its
 * id is not among the Page's reels does it fall back to the unclaimed reel created closest to the logged time (20 min).
 * The token is sent in a header, never in a URL, and any `access_token=` in an error is redacted before logging.
 */
import { env } from "../lib/config.js";
import { httpJson, sleep } from "../lib/http.js";

const MAX_AGE_DAYS = 60;
const MAX_READS = 90;
const GAP_MS = 400;
const MATCH_MS = 20 * 60_000;
const V = () => env("META_GRAPH_VERSION") ?? "v26.0";
const G = (path: string) => `https://graph.facebook.com/${V()}/${path}`;

export interface FacebookReel { id: string; created_time: string; description?: string; length?: number }
export interface FacebookMetrics {
  /** total plays (fb_reels_total_plays; initial plays or total_video_views when that is missing) */
  views: number | null; plays_initial: number | null; replays: number | null;
  avg_watch_s: number | null; view_time_s: number | null;
  /** % of viewers still watching at 3 s and at half the video, from the retention graph (null when not reported) */
  hold_3s_pct: number | null; hold_50pct_pct: number | null;
  followers: number | null; reactions: number | null; social_actions: Record<string, number> | null;
  video_id: string; fetched: string;
}

/** Remove token values from text that may be logged (error bodies, URLs). */
export function redactToken(s: string): string {
  let out = s.replace(/(access_token=)[^&\s"']+/gi, "$1REDACTED");
  const t = process.env.META_PAGE_ACCESS_TOKEN;
  if (t && t.length > 8) out = out.split(t).join("REDACTED");
  return out;
}

const valueOf = (d: any) => d?.values?.[0]?.value ?? d?.total_value?.value;
const num = (v: unknown): number | null => (typeof v === "number" || (typeof v === "string" && v.trim() !== "")) && Number.isFinite(Number(v)) ? Number(v) : null;
const r1 = (x: number) => Math.round(x * 10) / 10;

/**
 * Hold at 3 s and at 50% from post_video_retention_graph: an object of segment -> share of viewers. Segments are
 * taken as evenly spaced over the whole video (first key = start, last key = end), which also holds when the keys
 * are seconds. Shares in 0..1 become percent. 3 s needs the video length; null without it or when shorter.
 */
export function holdFromGraph(graph: unknown, lengthSec?: number): { s3: number | null; mid: number | null } {
  if (!graph || typeof graph !== "object") return { s3: null, mid: null };
  const pts = Object.entries(graph as Record<string, unknown>).map(([k, v]) => [Number(k), Number(v)] as [number, number])
    .filter(([k, v]) => Number.isFinite(k) && Number.isFinite(v)).sort((a, b) => a[0] - b[0]);
  if (pts.length < 2) return { s3: null, mid: null };
  const scale = Math.max(...pts.map(p => p[1])) > 1.5 ? 1 : 100;
  const first = pts[0][0], last = pts[pts.length - 1][0];
  const at = (x: number) => {
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        return r1((y0 + ((x - x0) / (x1 - x0 || 1)) * (y1 - y0)) * scale);
      }
    }
    return r1(pts[pts.length - 1][1] * scale);
  };
  const span = last - first;
  return {
    s3: lengthSec && lengthSec > 3 ? at(first + (3 / lengthSec) * span) : null,
    mid: at(first + span / 2),
  };
}

/** Pure: a video_insights response to the stored metrics. undefined when the response holds no metrics at all. */
export function parseVideoInsights(json: any, videoId: string, lengthSec: number | undefined, fetched: string): FacebookMetrics | undefined {
  const by = new Map<string, any>();
  for (const d of json?.data ?? []) if (d?.name) by.set(d.name, valueOf(d));
  if (!by.size) return undefined;
  const pick = (...names: string[]) => { for (const n of names) if (by.has(n)) { const v = num(by.get(n)); if (v !== null) return v; } return null; };
  const ms = (...names: string[]) => { const v = pick(...names); return v === null ? null : r1(v / 1000); };
  const obj = (name: string): Record<string, number> | null => {
    const v = by.get(name);
    if (!v || typeof v !== "object") return null;
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, Number(x)]).filter(([, x]) => Number.isFinite(x as number)));
  };
  const reactions = obj("post_video_likes_by_reaction_type");
  const hold = holdFromGraph(by.get("post_video_retention_graph") ?? by.get("total_video_retention_graph"), lengthSec);
  return {
    views: pick("fb_reels_total_plays", "blue_reels_play_count", "total_video_views"),
    plays_initial: pick("blue_reels_play_count"), replays: pick("fb_reels_replay_count"),
    avg_watch_s: ms("post_video_avg_time_watched", "total_video_avg_time_watched"),
    view_time_s: ms("post_video_view_time", "total_video_view_time"),
    hold_3s_pct: hold.s3, hold_50pct_pct: hold.mid,
    followers: pick("post_video_followers"),
    reactions: reactions ? Object.values(reactions).reduce((a, b) => a + b, 0) : null,
    social_actions: obj("post_video_social_actions"),
    video_id: videoId, fetched,
  };
}

export interface FbRow { remote_id?: string; at?: string; slot?: string; platform?: string; format?: string; length_s?: number }

/** Pure: Facebook rows posted in the last 60 days, newest first, at most `max`. */
export function recentFacebookRows<T extends FbRow>(rows: T[], now: number, max = MAX_READS): T[] {
  const from = now - MAX_AGE_DAYS * 86400_000;
  return rows.filter(r => r.platform === "facebook" && r.format === "reel" && r.remote_id && Date.parse(r.at ?? r.slot ?? "") > from)
    .sort((a, b) => Date.parse(b.at ?? b.slot ?? "") - Date.parse(a.at ?? a.slot ?? "")).slice(0, max);
}

/** Pure: the unclaimed reel created closest to the row's logged time, within 20 minutes. */
export function nearestReel(row: FbRow, reels: FacebookReel[], used: Set<string>): FacebookReel | undefined {
  const t = Date.parse(row.at ?? row.slot ?? "");
  if (!Number.isFinite(t)) return undefined;
  let best: FacebookReel | undefined, gap = MATCH_MS + 1;
  for (const r of reels) {
    if (used.has(r.id)) continue;
    const g = Math.abs(Date.parse(r.created_time) - t);
    if (g < gap) { gap = g; best = r; }
  }
  return best && gap <= MATCH_MS ? best : undefined;
}

const isRateLimit = (msg: string) => /HTTP 429|"code":\s*(4|17|32|613|80001|80002|80004)\b/.test(msg);

async function graph<T>(path: string): Promise<T> {
  try {
    return await httpJson<T>(G(path), { headers: { authorization: `Bearer ${env("META_PAGE_ACCESS_TOKEN", true)}` }, retries: 1 });
  } catch (e) { throw new Error(redactToken((e as Error).message)); }
}

/** The Page's reels created in the last 60 days (up to 5 pages of 50). */
export async function listRecentReels(now = Date.now()): Promise<FacebookReel[]> {
  const from = now - MAX_AGE_DAYS * 86400_000;
  const out: FacebookReel[] = [];
  const page = env("META_PAGE_ID", true)!;
  let path: string | undefined = `${page}/video_reels?fields=id,created_time,description,length&limit=50`;
  for (let i = 0; path && i < 5; i++) {
    let j: { data: FacebookReel[]; paging?: { next?: string; cursors?: { after?: string } } };
    try { j = await graph(path); }
    catch (e) {
      // `length` is not documented for this edge: ask again without it rather than fail the list
      if (i === 0 && path.includes(",length") && /HTTP 400/.test((e as Error).message)) { path = path.replace(",length", ""); i--; continue; }
      throw e;
    }
    out.push(...j.data);
    const after = j.paging?.cursors?.after;
    const oldest = Math.min(...j.data.map(r => Date.parse(r.created_time)));
    path = j.paging?.next && after && oldest > from ? `${path.replace(/&after=[^&]*/, "")}&after=${encodeURIComponent(after)}` : undefined;
    if (path) await sleep(GAP_MS);
  }
  return out.filter(r => Date.parse(r.created_time) > from);
}

/**
 * Network: metrics per row remote id for Facebook Reels posted in the last 60 days. Sequential, 0.4 s apart, at most
 * 90 reads; stops at the first rate-limit answer. Throws only if the reel list cannot be read (the caller catches).
 */
export async function fetchFacebookMetrics(rows: FbRow[], now = Date.now()): Promise<{ metrics: Record<string, FacebookMetrics>; read: number; failed: number; rateLimited: boolean; firstError?: string }> {
  const fetched = new Date(now).toISOString().slice(0, 10);
  const reels = await listRecentReels(now);
  const reelById = new Map(reels.map(r => [r.id, r]));
  const used = new Set<string>();
  const metrics: Record<string, FacebookMetrics> = {};
  let read = 0, failed = 0, rateLimited = false, firstError: string | undefined;
  const insights = async (id: string, len?: number) =>
    parseVideoInsights(await graph(`${id}/video_insights`), id, len, fetched);
  for (const row of recentFacebookRows(rows, now)) {
    const id = row.remote_id!;
    const len = Number(row.length_s) > 0 ? Number(row.length_s) : reelById.get(id)?.length;
    try {
      const m = await insights(id, len);
      if (m) { metrics[id] = m; used.add(id); read++; }
    } catch (e) {
      const msg = (e as Error).message;
      firstError ??= msg.slice(0, 200);
      if (isRateLimit(msg)) { rateLimited = true; break; }
      const alt = reelById.has(id) ? undefined : nearestReel(row, reels.filter(r => !rows.some(x => x.remote_id === r.id)), used);
      if (!alt) { failed++; continue; }
      try {
        await sleep(GAP_MS);
        const m = await insights(alt.id, len ?? alt.length);
        if (m) { metrics[id] = m; used.add(alt.id); read++; }
      } catch (e2) {
        failed++;
        if (isRateLimit((e2 as Error).message)) { rateLimited = true; break; }
      }
    }
    await sleep(GAP_MS);
  }
  return { metrics, read, failed, rateLimited, firstError };
}
