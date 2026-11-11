import { gunzipSync } from "node:zlib";
import { join } from "node:path";
import { DATA } from "../lib/config.js";
import { readJson, writeJson, writeText } from "../lib/fsx.js";
import { http, httpJson } from "../lib/http.js";
import { log } from "../lib/log.js";
import { youtubeToken } from "../publish/youtube.js";

/**
 * Thumbnail impressions and click-through rate per video, plus where views come from.
 *
 * Impressions/CTR aren't in the Analytics API; YouTube publishes them only as daily bulk "reach" reports through the
 * Reporting API. Those need a reporting job (created once, here), and YouTube then drops one CSV per day (the first
 * ones about 1–2 days after the job is created). We download each new CSV once and keep per-day rows per video.
 * Traffic sources (Shorts feed, search, suggested, browse, channel page…) come from the Analytics API directly.
 */

const STATE = join(DATA, "reach", "state.json");
const DAILY = join(DATA, "reach", "daily.json");
const BY_SOURCE = join(DATA, "reach", "daily-by-source.json");
const API = "https://youtubereporting.googleapis.com/v1";
/** Rows older than this are dropped from the per-source file (keeps it small). */
const KEEP_DAYS = 90;

/**
 * The reach report's traffic_source_type column is a number. Best-known meanings (Reporting API traffic source codes);
 * from the Reporting API traffic_source_type table (recalled, not re-checked against this channel's data), so unknown codes are kept as src_<n> and logged, never guessed.
 */
export const REACH_SOURCE_LABELS: Record<string, string> = { "0": "DIRECT_OR_UNKNOWN", "1": "ADVERTISING", "3": "BROWSE", "4": "YT_CHANNEL", "5": "YT_SEARCH", "7": "RELATED_VIDEO", "8": "OTHER_YT_FEATURES", "9": "EXT_URL", "11": "CARDS", "14": "PLAYLIST", "17": "NOTIFICATION", "18": "PLAYLIST_PAGE", "20": "END_SCREEN", "23": "STORIES", "24": "SHORTS", "25": "PRODUCT_PAGE", "26": "HASHTAG_PAGE", "27": "SOUND_PAGE" };
export const reachSourceName = (raw: string) => REACH_SOURCE_LABELS[raw] ?? (/^[0-9]+$/.test(raw) ? `src_${raw}` : raw.toUpperCase() || "UNKNOWN");

interface ReachState { jobs: Record<string, string>; seen: string[]; report_types?: string[]; checked_at?: string; src_backfilled?: boolean; last_report_date?: string }
/** `${date}|${videoId}|${source}` → [impressions, ctr 0-1] */
type BySource = Record<string, [number, number]>;
/** `${date}|${videoId}` → { impressions, ctr (0–1) } */
type Daily = Record<string, { impressions: number; ctr: number }>;
export interface VideoReach { impressions: number; ctr: number | null; days: number; first?: string; last?: string; by_source?: Record<string, { impressions: number; ctr_pct: number | null }> }

async function auth() { return { authorization: `Bearer ${await youtubeToken()}` }; }

/** Create the reach reporting job(s) if missing. Returns the report types we have jobs for. */
async function ensureJobs(s: ReachState): Promise<string[]> {
  const headers = await auth();
  const types: string[] = ((await httpJson<any>(`${API}/reportTypes`, { headers })).reportTypes ?? []).map((t: any) => t.id as string);
  s.report_types = types;
  // the basic reach report: impressions + CTR per day × video (one job is enough)
  const want = types.filter(t => /^channel_reach_basic/.test(t)).slice(0, 1);
  if (!want.length) want.push(...types.filter(t => /^channel_reach/.test(t)).slice(0, 1));
  if (!want.length) { log.warn(`reach: no reach report type offered (types: ${types.join(", ")})`); return []; }
  const jobs = (await httpJson<any>(`${API}/jobs`, { headers })).jobs ?? [];
  for (const t of want) {
    const existing = jobs.find((j: any) => j.reportTypeId === t);
    if (existing) { s.jobs[t] = existing.id; continue; }
    const j = await httpJson<any>(`${API}/jobs`, { method: "POST", headers: { ...headers, "content-type": "application/json" }, body: JSON.stringify({ reportTypeId: t, name: `InforMed ${t}` }) });
    s.jobs[t] = j.id;
    log.info(`reach: created reporting job ${j.id} for ${t} (first reports in ~1–2 days)`);
  }
  return want;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  const head = lines.shift()?.split(",") ?? [];
  return lines.map(l => Object.fromEntries(l.split(",").map((v, i) => [head[i], v])));
}

/** Download any new reach reports into data/reach/daily.json. */
async function pullReports(s: ReachState) {
  const headers = await auth();
  const daily = readJson<Daily>(DAILY, {});
  const bySrc = readJson<BySource>(BY_SOURCE, {});
  // first run with per-source support: re-read every report still on offer once, so history gets its source split
  const redo = !s.src_backfilled;
  let files = 0;
  const newIds: string[] = []; // marked seen only after the data is saved, so a failed run re-reads them
  for (const [type, jobId] of Object.entries(s.jobs)) {
    let page: string | undefined;
    do {
      const j = await httpJson<any>(`${API}/jobs/${jobId}/reports${page ? `?pageToken=${page}` : ""}`, { headers });
      for (const r of j.reports ?? []) {
        if (!redo && s.seen.includes(r.id)) continue;
        const res = await http(r.downloadUrl, { headers, retries: 2 });
        if (!res.ok) { log.warn(`reach: report ${r.id} HTTP ${res.status}`); continue; }
        let buf = Buffer.from(await res.arrayBuffer());
        if (buf[0] === 0x1f && buf[1] === 0x8b) buf = gunzipSync(buf);
        // the reach report has one row per day × video × (traffic source / surface): sum impressions, weight CTR by them
        const agg = new Map<string, { imp: number; clicks: number }>();
        const aggSrc = new Map<string, { imp: number; clicks: number }>();
        for (const row of parseCsv(buf.toString("utf8"))) {
          const date = row.date, video = row.video_id;
          const imp = Number(row.video_thumbnail_impressions ?? 0), ctr = Number(row.video_thumbnail_impressions_ctr ?? 0);
          if (!date || !video || !imp) continue;
          const k = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}|${video}`;
          const a = agg.get(k) ?? { imp: 0, clicks: 0 };
          a.imp += imp; a.clicks += imp * ctr;
          agg.set(k, a);
          if (row.traffic_source_type !== undefined && row.traffic_source_type !== "") {
            const ks = `${k}|${reachSourceName(row.traffic_source_type)}`;
            const b = aggSrc.get(ks) ?? { imp: 0, clicks: 0 };
            b.imp += imp; b.clicks += imp * ctr;
            aggSrc.set(ks, b);
          }
        }
        for (const [k, a] of agg) daily[k] = { impressions: a.imp, ctr: a.imp ? a.clicks / a.imp : 0 };
        for (const [k, a] of aggSrc) bySrc[k] = [a.imp, a.imp ? Math.round((a.clicks / a.imp) * 10000) / 10000 : 0];
        newIds.push(r.id);
        files++;
      }
      page = j.nextPageToken;
    } while (page);
    log.info(`reach: ${type}: ${files} new report file(s)`);
  }
  writeJson(DAILY, daily);
  const floor = new Date(Date.now() - KEEP_DAYS * 86400_000).toISOString().slice(0, 10);
  for (const k of Object.keys(bySrc)) if (k.slice(0, 10) < floor) delete bySrc[k];
  writeText(BY_SOURCE, JSON.stringify(bySrc)); // compact on purpose: many small rows
  for (const id of newIds) if (!s.seen.includes(id)) s.seen.push(id); // only now that both files are saved
  s.seen = s.seen.slice(-400);
  s.src_backfilled = true;
  const dates = Object.keys(daily).map(k => k.slice(0, 10)).sort();
  s.last_report_date = dates[dates.length - 1];
  const srcCodes = [...new Set(Object.keys(bySrc).map(k => k.split("|")[2]))];
  if (files) log.info(`reach: per-source rows for ${srcCodes.join(", ") || "none (report has no traffic_source_type column)"}`);
}

/** Totals per video from the stored daily rows. */
export function reachByVideo(): Record<string, VideoReach> {
  const out: Record<string, VideoReach & { clicks: number }> = {};
  const src: Record<string, Record<string, { imp: number; clicks: number }>> = {};
  for (const [k, [imp, ctr]] of Object.entries(readJson<BySource>(BY_SOURCE, {}))) {
    const [, id, name] = k.split("|");
    const o = ((src[id] ??= {})[name] ??= { imp: 0, clicks: 0 });
    o.imp += imp; o.clicks += imp * ctr;
  }
  for (const [k, v] of Object.entries(readJson<Daily>(DAILY, {}))) {
    const [date, id] = k.split("|");
    const o = out[id] ?? (out[id] = { impressions: 0, ctr: null, days: 0, clicks: 0 });
    o.impressions += v.impressions; o.clicks += v.impressions * v.ctr; o.days++;
    if (!o.first || date < o.first) o.first = date;
    if (!o.last || date > o.last) o.last = date;
  }
  return Object.fromEntries(Object.entries(out).map(([id, { clicks, ...o }]) => [id, {
    ...o, ctr: o.impressions ? Math.round((clicks / o.impressions) * 10000) / 100 : null,
    ...(src[id] ? { by_source: Object.fromEntries(Object.entries(src[id]).map(([n, v]) => [n, { impressions: v.imp, ctr_pct: v.imp ? Math.round((v.clicks / v.imp) * 10000) / 100 : null }])) } : {}),
  }]));
}

/** Ensure the job exists and pull new reports. Never throws (analytics must go on). */
export async function refreshReach(): Promise<Record<string, VideoReach>> {
  const s = readJson<ReachState>(STATE, { jobs: {}, seen: [] });
  try {
    await ensureJobs(s);
    await pullReports(s);
  } catch (e) { log.warn(`reach: ${(e as Error).message.slice(0, 300)}`); }
  s.checked_at = new Date().toISOString();
  writeJson(STATE, s);
  return reachByVideo();
}

/** Views and watch minutes by traffic source for each video (Analytics API; one call per video). */
export async function trafficSources(ids: string[], startDate: string, endDate: string): Promise<Record<string, Record<string, { views: number; minutes: number }>>> {
  const headers = await auth();
  const out: Record<string, Record<string, { views: number; minutes: number }>> = {};
  for (const id of ids) {
    try {
      const j = await httpJson<any>(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&metrics=views,estimatedMinutesWatched&dimensions=insightTrafficSourceType&filters=video==${id}`, { headers });
      out[id] = Object.fromEntries((j.rows ?? []).map(([src, views, minutes]: [string, number, number]) => [src, { views: Number(views), minutes: Number(minutes) }]));
    } catch (e) { log.warn(`traffic sources ${id}: ${(e as Error).message.slice(0, 160)}`); }
  }
  return out;
}
