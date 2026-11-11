import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA } from "../lib/config.js";
import { readText, writeJson, writeText } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { Learnings, learningsSchema } from "../lib/schemas.js";
import { igInsights } from "../publish/meta.js";
import { partnerProgress, videoAnalytics, videoRetention, videoStats, videoTitles, videoTrafficDetail } from "../publish/youtube.js";
import { addDaysIso, captureRetention, isoSeconds, retentionPath, retentionSummary, type RetentionFile, type RetentionVideo } from "./retention.js";

interface LogRow { at: string; date: string; id: string; kind: string; platform: string; format: string; slot: string; slotKey: string; status: string; remote_id?: string; title?: string; topic?: string; hook?: string; thumb_layout?: string; trend_stage?: string }

/** A YouTube video stays in the per-post analytics for a year: full detail for 28 days, compact rows after that. */
const YT_KEEP_DAYS = 365;
const RECENT_DAYS = 28;

/** Lifetime analytics keys get a life_ prefix so they sit beside the 28-day window numbers. */
export function lifetimeKeys(m: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(m).filter(([k]) => k !== "video").map(([k, v]) => [`life_${k}`, v]));
}

/** Rows older than 28 days keep identity fields, a short topic and the metrics (no hook text, url or timestamp). */
export function compactRow<T extends { topic?: string }>(r: T) {
  const { at, url, hook, ...rest } = r as any;
  return { ...rest, topic: r.topic ? r.topic.slice(0, 140) : r.topic };
}

/** Compare with the previous snapshot: how many YouTube rows moved. Zero moved means YouTube is lagging or the API call failed. */
export function changedSince(prev: any[], now: any[]): { compared: number; changed: number } {
  const key = (r: any) => `${r.platform}:${r.remote_id}`;
  const old = new Map(prev.map(r => [key(r), r]));
  let compared = 0, changed = 0;
  for (const r of now) {
    if (r.platform !== "youtube") continue;
    const o = old.get(key(r));
    if (!o) continue;
    compared++;
    const pick = (x: any) => JSON.stringify([x.metrics?.viewCount, x.metrics?.views, x.metrics?.estimatedMinutesWatched, x.metrics?.life_views, x.metrics?.impressions]);
    if (pick(o) !== pick(r)) changed++;
  }
  return { compared, changed };
}

/** Pull metrics for recent posts and let the Performance Analyst rewrite the shared playbook (data/learnings.md). */
export async function runAnalytics() {
  const file = join(DATA, "published", "log.jsonl");
  if (!existsSync(file)) { log.warn("nothing published yet"); return; }
  const cutoff = Date.now() - RECENT_DAYS * 86400_000;
  const ytCutoff = Date.now() - YT_KEEP_DAYS * 86400_000;
  const latest = new Map<string, LogRow>();
  for (const line of readFileSync(file, "utf8").split("\n").filter(Boolean)) {
    const r = JSON.parse(line) as LogRow;
    const from = r.platform === "youtube" ? ytCutoff : cutoff; // YouTube keeps a year of history, the other platforms 28 days
    if ((r.status === "published" || r.status === "scheduled") && r.remote_id && Date.parse(r.slot) > from && Date.parse(r.slot) < Date.now() - 24 * 3600_000) {
      latest.set(`${r.platform}:${r.remote_id}`, r);
    }
  }
  const rows = [...latest.values()];
  if (rows.length < 3) { log.info("not enough published posts (need ≥ 3 older than 24h) for analysis yet"); return; }

  const metrics: Record<string, any> = {};
  const yt = rows.filter(r => r.platform === "youtube").map(r => r.remote_id!);
  if (yt.length && process.env.YOUTUBE_REFRESH_TOKEN) {
    try {
      for (const v of await videoStats(yt)) metrics[`youtube:${v.id}`] = { ...v.statistics, duration: v.contentDetails?.duration };
      const end = new Date().toISOString().slice(0, 10), start = new Date(cutoff).toISOString().slice(0, 10);
      const a = await videoAnalytics(yt, start, end);
      // a video with no views in the 28-day window returns no row: that is a real zero, not a missing value
      const slotOf = new Map(rows.map(r => [r.remote_id!, Date.parse(r.slot)]));
      for (const id of yt) {
        // no row = no views in the window, but only a real zero once the Analytics lag (about 3 days) has passed
        const settled = (slotOf.get(id) ?? 0) < Date.now() - 3 * 86400_000;
        const zero = settled ? { video: id, views: 0, estimatedMinutesWatched: 0, subscribersGained: 0 } : {};
        metrics[`youtube:${id}`] = { ...metrics[`youtube:${id}`], ...(a[id] ?? zero) };
      }
      // lifetime totals (from the oldest kept publish date) so old winners stay visible after they leave the 28-day window
      const oldest = rows.filter(r => r.platform === "youtube").map(r => r.slot.slice(0, 10)).sort()[0];
      const first = oldest ? addDaysIso(oldest, -1) : start; // -1 day: Analytics dates are Pacific time
      const life = await videoAnalytics(yt, first, end);
      for (const [id, m] of Object.entries(life)) metrics[`youtube:${id}`] = { ...metrics[`youtube:${id}`], ...lifetimeKeys(m) };
    } catch (e) { log.warn(`youtube metrics: ${(e as Error).message.slice(0, 200)}`); }
    // impressions + click-through rate (Reporting API, with the split by surface) and traffic sources (recent long videos)
    try {
      const { refreshReach, trafficSources } = await import("./reach.js");
      const reach = await refreshReach();
      for (const id of yt) if (reach[id]) metrics[`youtube:${id}`] = { ...metrics[`youtube:${id}`], impressions: reach[id].impressions, impressions_ctr_pct: reach[id].ctr, reach_days: reach[id].days, ...(reach[id].by_source ? { reach_by_source: reach[id].by_source } : {}) };
      const longs = [...new Set(rows.filter(r => r.platform === "youtube" && r.format === "long" && Date.parse(r.slot) > cutoff).map(r => r.remote_id!))];
      const end = new Date().toISOString().slice(0, 10), start = new Date(cutoff).toISOString().slice(0, 10);
      const traffic = await trafficSources(longs, start, end);
      for (const [id, t] of Object.entries(traffic)) metrics[`youtube:${id}`] = { ...metrics[`youtube:${id}`], traffic_sources: t };
    } catch (e) { log.warn(`youtube reach/traffic: ${(e as Error).message.slice(0, 200)}`); }
    // retention curves, referring videos and search terms: captured once per milestone (long: day 7 and 28, Short: day 7)
    try {
      const today = new Date().toISOString().slice(0, 10);
      const vids: RetentionVideo[] = rows.filter(r => r.platform === "youtube").map(r => ({
        id: r.remote_id!, format: r.format, published: addDaysIso(r.slot.slice(0, 10), -1), // -1 day: Analytics dates are Pacific time
        durationSec: isoSeconds(metrics[`youtube:${r.remote_id}`]?.duration),
      })).filter(v => v.durationSec > 0);
      const res = await captureRetention(vids, { curve: videoRetention, detail: videoTrafficDetail, titles: videoTitles }, today);
      log.info(`retention: captured ${res.captured.length}, failed ${res.failed.length}, still waiting ${res.pending}`);
      for (const id of yt) {
        const sum = retentionSummary(existsSync(retentionPath(id)) ? JSON.parse(readFileSync(retentionPath(id), "utf8")) as RetentionFile : undefined);
        if (sum) metrics[`youtube:${id}`] = { ...metrics[`youtube:${id}`], retention: sum };
      }
    } catch (e) { log.warn(`youtube retention: ${(e as Error).message.slice(0, 200)}`); }
  }
  if (process.env.META_PAGE_ACCESS_TOKEN) {
    for (const r of rows.filter(r => r.platform === "instagram")) {
      const j = await igInsights(r.remote_id!);
      if (j?.data) metrics[`instagram:${r.remote_id}`] = Object.fromEntries(j.data.map((d: any) => [d.name, d.values?.[0]?.value ?? d.total_value?.value]));
    }
  }

  const dataset = rows.map(r => {
    const row = { ...r, metrics: metrics[`${r.platform}:${r.remote_id}`] ?? null };
    return Date.parse(r.slot) > cutoff ? row : compactRow(row);
  });
  const today = new Date().toISOString().slice(0, 10);

  // freshness: never silently re-save the same numbers. Say how many videos moved and how far behind the reach reports are.
  try {
    const dir = join(DATA, "analytics");
    const prevFile = readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) < today).sort().pop();
    const prev = prevFile ? JSON.parse(readFileSync(join(dir, prevFile), "utf8")) as any[] : [];
    const { compared, changed } = changedSince(prev, dataset);
    const reachFile = join(DATA, "reach", "state.json");
    const reachState = existsSync(reachFile) ? JSON.parse(readFileSync(reachFile, "utf8")) as { last_report_date?: string } : {};
    const reachLag = reachState.last_report_date ? Math.floor((Date.parse(today) - Date.parse(reachState.last_report_date)) / 86400_000) : null;
    writeJson(join(DATA, "analytics-status.json"), { run_at: new Date().toISOString(), previous_snapshot: prevFile ?? null, youtube_rows_compared: compared, youtube_rows_changed: changed, reach_last_report_date: reachState.last_report_date ?? null, reach_lag_days: reachLag });
    if (compared && changed === 0) log.warn(`FRESHNESS: no YouTube video changed since ${prevFile} (${compared} compared). YouTube Analytics is lagging or an API call failed; this snapshot repeats the last one.`);
    else log.info(`freshness: ${changed}/${compared} YouTube videos changed since ${prevFile ?? "n/a"}; reach reports end ${reachState.last_report_date ?? "n/a"}${reachLag !== null ? ` (${reachLag} d behind)` : ""}`);
    if (reachLag !== null && reachLag > 4) log.warn(`FRESHNESS: reach reports are ${reachLag} days behind (YouTube normally delivers within 2-3 days); impressions and CTR are stale.`);
  } catch (e) { log.warn(`freshness check: ${(e as Error).message.slice(0, 160)}`); }
  writeJson(join(DATA, "analytics", `${today}.json`), dataset);

  // monetization progress (YouTube Partner Program): tracked daily, sent to the owner, given to the analyst
  let ypp: Awaited<ReturnType<typeof partnerProgress>> | undefined;
  try {
    ypp = await partnerProgress();
    writeJson(join(DATA, "usage", "ypp.json"), ypp);
    const { appendFileSync } = await import("node:fs");
    appendFileSync(join(DATA, "usage", "ypp-history.jsonl"), JSON.stringify(ypp) + "\n");
    const pct = (a: number, b: number) => `${Math.min(100, Math.round((a / b) * 100))}%`;
    const { notify } = await import("../notify/telegram.js");
    await notify([
      "📈 <b>Monetization progress (YouTube Partner Program)</b>",
      `Subscribers: ${ypp.subscribers.toLocaleString()} / 1,000 (${pct(ypp.subscribers, 1000)})`,
      `Long-form watch hours (365 d): ${ypp.watchHours365.toLocaleString()} / 4,000 (${pct(ypp.watchHours365, 4000)})`,
      `or Shorts views (90 d): ${ypp.shortsViews90.toLocaleString()} / 10,000,000 (${pct(ypp.shortsViews90, 10_000_000)})`,
      `Long-form views, last 28 days: ${ypp.longViews28.toLocaleString()}`,
    ].join("\n"), { silent: true });
  } catch (e) { log.warn(`partner progress: ${(e as Error).message.slice(0, 200)}`); }

  // YouTube videos older than 28 days (up to a year): the best 40 by lifetime watch minutes plus totals, so old winners reach the analyst
  const older = dataset.filter(r => r.platform === "youtube" && Date.parse(r.slot) <= cutoff);
  const olderTop = [...older].sort((a, b) => Number(b.metrics?.life_estimatedMinutesWatched ?? 0) - Number(a.metrics?.life_estimatedMinutesWatched ?? 0)).slice(0, 40);
  const olderTotals = { videos: older.length, life_views: older.reduce((n, r) => n + Number(r.metrics?.life_views ?? 0), 0), life_minutes: older.reduce((n, r) => n + Number(r.metrics?.life_estimatedMinutesWatched ?? 0), 0) };

  const out = await runAgent<Learnings>({
    agent: "performance-analyst", model: config.models.analyst, schema: learningsSchema,
    input: { current_playbook: readText(join(DATA, "learnings.md")), schedule: config.schedule, timezone: config.audience.timezone, posts: dataset.filter(r => Date.parse(r.slot) > cutoff), older_youtube_top: olderTop, older_youtube_totals: olderTotals, monetization_progress: ypp },
  });
  writeText(join(DATA, "learnings.md"),
    `${out.learnings_markdown.trim()}\n\n## Topics to double down on\n${out.topics_to_double_down.map(t => `- ${t}`).join("\n")}\n\n## Schedule suggestions (for the owner — edit config/channel.json to apply)\n${out.schedule_suggestions}\n\n_Updated ${today} from ${dataset.length} posts._\n`);
  log.info("learnings updated");
}
