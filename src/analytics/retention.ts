import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DATA } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";

/**
 * Retention curves and traffic detail, captured once per milestone (long: day 7 and day 28, Short: day 7) and stored in
 * data/analytics/retention/<videoId>.json. The pure functions here (no network) are what the local test exercises;
 * the fetchers are injected so CI uses the YouTube Analytics API and the test uses fixtures.
 */

export const RETENTION_DIR = join(DATA, "analytics", "retention");
export const MILESTONES: Record<string, number[]> = { long: [7, 28], short: [7] };
/** YouTube Analytics data lags about two days: wait this many extra days after a milestone before querying it. */
const LAG_DAYS = 2;
const MAX_TRIES = 4;
const DETAIL_TYPES = ["RELATED_VIDEO", "YT_SEARCH"] as const;

export interface Table { cols: string[]; rows: any[][] }
export interface Drop { at_sec: number; at_pct: number; from_pct: number; to_pct: number; drop_pts: number }
export interface Hold { s5: number | null; s15: number | null; s30: number | null; s60: number | null }
export interface Milestone {
  captured_at: string; window: [string, string];
  /** % of viewers still watching at 1%, 2% ... 100% of the video (audienceWatchRatio x 100, can pass 100 on rewatches) */
  curve_pct: number[];
  /** relativeRetentionPerformance x 100 at the same points (0-100, 50 = typical for this length); empty if not returned */
  relative_pct: number[];
  hold_pct: Hold; biggest_drop: Drop | null; empty?: boolean;
  traffic_detail?: Record<string, { key: string; title?: string; views: number; minutes: number }[]>;
}
export interface RetentionFile { video_id: string; format: string; published: string; duration_sec: number; tries: Record<string, number>; milestones: Record<string, Milestone> }

/** ISO 8601 duration ("PT14M3S", "PT45S", "PT1H2M") to seconds. */
export function isoSeconds(d?: string): number {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(d ?? "");
  if (!m) return 0;
  return Number(m[1] ?? 0) * 86400 + Number(m[2] ?? 0) * 3600 + Number(m[3] ?? 0) * 60 + Number(m[4] ?? 0);
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Table from the API (elapsedVideoTimeRatio, audienceWatchRatio[, relativeRetentionPerformance]) to two compact arrays. */
export function curveFromTable(t: Table): { ratios: number[]; watch: number[]; rel: number[] } {
  const ci = (n: string) => t.cols.indexOf(n);
  const ri = ci("elapsedVideoTimeRatio"), wi = ci("audienceWatchRatio"), qi = ci("relativeRetentionPerformance");
  const rows = t.rows.filter(r => Number.isFinite(Number(r[ri])) && Number.isFinite(Number(r[wi]))).sort((a, b) => Number(a[ri]) - Number(b[ri]));
  return {
    ratios: rows.map(r => Number(r[ri])),
    watch: rows.map(r => r1(Number(r[wi]) * 100)),
    rel: qi >= 0 ? rows.map(r => r1(Number(r[qi] ?? 0) * 100)) : [],
  };
}

/** % still watching at `sec` seconds, by linear interpolation. Null when the video is shorter than `sec`. The first API point is at 1% of the length, so earlier seconds clamp to it (about 8 s on a 14 minute video). */
export function holdAt(ratios: number[], watch: number[], durationSec: number, sec: number): number | null {
  if (!ratios.length || !durationSec || sec > durationSec) return null;
  const x = sec / durationSec;
  if (x <= ratios[0]) return watch[0];
  for (let i = 1; i < ratios.length; i++) {
    if (x <= ratios[i]) {
      const f = (x - ratios[i - 1]) / (ratios[i] - ratios[i - 1] || 1);
      return r1(watch[i - 1] + f * (watch[i] - watch[i - 1]));
    }
  }
  return watch[watch.length - 1];
}

/** Largest single-step fall in the curve, ignoring the last 5% of the video (the natural end-of-video exit). */
export function biggestDrop(ratios: number[], watch: number[], durationSec: number): Drop | null {
  let best: Drop | null = null;
  for (let i = 1; i < ratios.length; i++) {
    if (ratios[i] > 0.95) break;
    const d = watch[i - 1] - watch[i];
    if (d > 0 && (!best || d > best.drop_pts)) {
      best = { at_sec: Math.round(ratios[i] * durationSec), at_pct: Math.round(ratios[i] * 100), from_pct: watch[i - 1], to_pct: watch[i], drop_pts: r1(d) };
    }
  }
  return best;
}

export function buildMilestone(t: Table, durationSec: number, window: [string, string], now: string): Milestone {
  const { ratios, watch, rel } = curveFromTable(t);
  return {
    captured_at: now, window, curve_pct: watch, relative_pct: rel,
    hold_pct: { s5: holdAt(ratios, watch, durationSec, 5), s15: holdAt(ratios, watch, durationSec, 15), s30: holdAt(ratios, watch, durationSec, 30), s60: holdAt(ratios, watch, durationSec, 60) },
    biggest_drop: biggestDrop(ratios, watch, durationSec), ...(ratios.length ? {} : { empty: true }),
  };
}

export function addDaysIso(d: string, n: number): string { return new Date(Date.parse(`${d}T00:00:00Z`) + n * 86400_000).toISOString().slice(0, 10); }
const daysBetween = (a: string, b: string) => Math.floor((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400_000);

/** Milestones (in days) that are due now and not stored yet or given up on. */
export function dueMilestones(file: RetentionFile | undefined, format: string, published: string, today: string): number[] {
  const age = daysBetween(published, today);
  return (MILESTONES[format] ?? []).filter(m => age >= m + LAG_DAYS && !file?.milestones[`d${m}`] && (file?.tries[`d${m}`] ?? 0) < MAX_TRIES);
}

export interface RetentionVideo { id: string; format: string; published: string; durationSec: number }
export interface Fetchers {
  curve(id: string, start: string, end: string): Promise<Table>;
  detail(id: string, type: string, start: string, end: string): Promise<Table>;
  titles(ids: string[]): Promise<Record<string, string>>;
}

export const retentionPath = (id: string) => join(RETENTION_DIR, `${id}.json`);

/** Default reader: a missing or corrupt file means no record yet. Never throws. */
export function readRetentionFile(p: string): RetentionFile | undefined {
  try { return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) as RetentionFile : undefined; } catch { return undefined; }
}

class EmptyCurve extends Error {}

/**
 * Capture every due milestone (long videos first, oldest milestone first), at most `maxCaptures` per run so quota and
 * run time stay small and a backlog drains over a few days. Never throws. `write` is injectable for the test.
 */
export async function captureRetention(videos: RetentionVideo[], f: Fetchers, today: string, opts: { maxCaptures?: number; read?: (p: string) => RetentionFile | undefined; write?: (p: string, v: unknown) => void } = {}): Promise<{ captured: string[]; failed: string[]; pending: number }> {
  const read = opts.read ?? readRetentionFile;
  const write = opts.write ?? writeJson;
  const recs = new Map<string, RetentionFile | undefined>(); // one live record per video (a video can have two milestones due)
  const todo: { v: RetentionVideo; m: number }[] = [];
  for (const v of videos) {
    const file = read(retentionPath(v.id));
    recs.set(v.id, file);
    for (const m of dueMilestones(file, v.format, v.published, today)) todo.push({ v, m });
  }
  todo.sort((a, b) => (a.v.format === "long" ? 0 : 1) - (b.v.format === "long" ? 0 : 1) || a.m - b.m || a.v.published.localeCompare(b.v.published));
  const captured: string[] = [], failed: string[] = [];
  let stopped = false;
  for (const { v, m } of todo.slice(0, opts.maxCaptures ?? 20)) {
    const key = `d${m}`;
    const rec: RetentionFile = recs.get(v.id) ?? { video_id: v.id, format: v.format, published: v.published, duration_sec: v.durationSec, tries: {}, milestones: {} };
    recs.set(v.id, rec);
    const win: [string, string] = [v.published, addDaysIso(v.published, m)];
    try {
      const ms = buildMilestone(await f.curve(v.id, win[0], win[1]), v.durationSec || rec.duration_sec, win, new Date().toISOString());
      if (ms.empty && (rec.tries[key] ?? 0) < MAX_TRIES - 1) throw new EmptyCurve("no retention rows yet (data lag or too few views)");
      if (v.format === "long" && !ms.empty) {
        ms.traffic_detail = {};
        for (const type of DETAIL_TYPES) {
          try {
            const rows = (await f.detail(v.id, type, win[0], win[1])).rows.slice(0, 10);
            ms.traffic_detail[type] = rows.map(r => ({ key: String(r[0]), views: Number(r[1]), minutes: Number(r[2]) }));
          } catch (e) { log.warn(`traffic detail ${v.id} ${type}: ${(e as Error).message.slice(0, 140)}`); }
        }
        const refs = (ms.traffic_detail.RELATED_VIDEO ?? []).map(r => r.key);
        if (refs.length) {
          try { const t = await f.titles(refs); for (const r of ms.traffic_detail.RELATED_VIDEO) if (t[r.key]) r.title = t[r.key]; } catch { /* titles are optional */ }
        }
      }
      rec.duration_sec = v.durationSec || rec.duration_sec;
      rec.milestones[key] = ms;
      write(retentionPath(v.id), rec);
      captured.push(`${v.id}:${key}`);
    } catch (e) {
      const msg = (e as Error).message;
      if (!(e instanceof EmptyCurve)) {
        // an API error (4xx from a bad parameter, auth, quota, 5xx) says nothing about this video: do not burn its tries
        log.warn(`retention ${v.id} ${key} not counted as a try: ${msg.slice(0, 400)}`);
        if (/HTTP 4[0-9][0-9]/.test(msg) && !captured.length && !failed.length) { log.warn("retention: first query of the run was refused; stopping for this run"); stopped = true; break; }
        failed.push(`${v.id}:${key}`);
        continue;
      }
      rec.tries[key] = (rec.tries[key] ?? 0) + 1;
      write(retentionPath(v.id), rec);
      failed.push(`${v.id}:${key}`);
      log.warn(`retention ${v.id} ${key} (try ${rec.tries[key]}/${MAX_TRIES}): ${(e as Error).message.slice(0, 160)}`);
    }
  }
  return { captured, failed, pending: stopped ? todo.length : Math.max(0, todo.length - (opts.maxCaptures ?? 20)) };
}

/** Small summary of a stored retention file for the per-post analytics row (what the analyst reads). */
export function retentionSummary(file: RetentionFile | undefined) {
  if (!file) return undefined;
  const out: Record<string, any> = {};
  for (const [k, m] of Object.entries(file.milestones)) {
    if (m.empty) continue;
    out[k] = { hold_pct: m.hold_pct, biggest_drop: m.biggest_drop, relative_pct_mid: m.relative_pct.length ? m.relative_pct[Math.floor(m.relative_pct.length / 2)] : null };
    if (m.traffic_detail) out[k].traffic_detail = Object.fromEntries(Object.entries(m.traffic_detail).map(([t, rows]) => [t, rows.slice(0, 5).map(r => ({ key: r.title ?? r.key, views: r.views }))]));
  }
  return Object.keys(out).length ? out : undefined;
}
