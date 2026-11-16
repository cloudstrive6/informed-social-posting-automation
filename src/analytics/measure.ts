/**
 * Measurement helpers (growth strategy step 0, 2026-11-16). Pure functions where possible, so the local test
 * (scripts/measurement-selftest.ts) runs on fixtures without network or credentials:
 *  - per-post metadata (experiments, spoken words, rendered duration, scene count) for the log and for backfill
 *  - arm tables per experiment key (n, views at day 3 and 7, average view %, hold at 5 s and 15 s, duration, words)
 *  - the scene and chapter at a retention drop second (script word shares times rendered duration, about 3 s accurate)
 *  - expiry of dated playbook rules "(until YYYY-MM-DD)"
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DATA } from "../lib/config.js";
import { loadItems, type ContentItem, type PostMeta } from "../lib/items.js";
import { addDaysIso, readRetentionFile, retentionPath, type RetentionFile } from "./retention.js";

type ScriptLike = { scenes?: { section?: string; narration?: string; retention_device?: string }[] };

export const wordCount = (s?: string) => (s ?? "").split(/\s+/).filter(Boolean).length;

export const median = (xs: number[]): number | null => {
  const v = xs.filter(x => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = v.length >> 1;
  return Math.round((v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2) * 10) / 10;
};

/** What the publisher logs per post and what the backfill restores from the queue item. */
export function postMeta(item: Pick<ContentItem, "kind" | "experiments" | "script" | "media">): PostMeta {
  const scenes = item.script?.scenes ?? [];
  const dur = Number(item.media?.duration);
  return {
    experiments: item.experiments && Object.keys(item.experiments).length ? item.experiments : undefined,
    words: scenes.length ? scenes.reduce((n, s) => n + wordCount(s.narration), 0) : undefined,
    length_s: Number.isFinite(dur) && dur > 0 ? Math.round(dur * 10) / 10 : undefined,
    scenes: scenes.length || undefined,
  };
}

/** Fill fields a log row lacks from its queue item (joined by date and id, else by remote id). Never overwrites. */
export function enrichRows<T extends { date?: string; id?: string; remote_id?: string; platform?: string }>(rows: T[], items: ContentItem[]): (T & Partial<PostMeta>)[] {
  const byKey = new Map(items.map(i => [`${i.date}/${i.id}`, i]));
  const byRemote = new Map<string, ContentItem>();
  for (const i of items) for (const p of i.posts ?? []) if (p.remote_id) byRemote.set(`${p.platform}:${p.remote_id}`, i);
  return rows.map(r => {
    const item = byKey.get(`${r.date}/${r.id}`) ?? byRemote.get(`${r.platform}:${r.remote_id}`);
    if (!item) return r;
    const m = postMeta(item), out: any = { ...r };
    for (const [k, v] of Object.entries(m)) if (v !== undefined && out[k] === undefined) out[k] = v;
    return out;
  });
}

// ---------- scene and chapter at a drop second ----------

export interface SceneAt { scene_index: number; section: string; first_words: string; retention_device: string; start_sec: number; end_sec: number }

/** Scene that is on screen at `sec`: each scene's share of the spoken words times the rendered duration. */
export function sceneAtSecond(script: ScriptLike | undefined, durationSec: number, sec: number): SceneAt | null {
  const scenes = script?.scenes ?? [];
  const total = scenes.reduce((n, s) => n + wordCount(s.narration), 0);
  if (!scenes.length || !total || !(durationSec > 0)) return null;
  let cum = 0;
  for (const [i, s] of scenes.entries()) {
    const start = (cum / total) * durationSec;
    cum += wordCount(s.narration);
    const end = (cum / total) * durationSec;
    if (sec < end || i === scenes.length - 1) {
      return {
        scene_index: i, section: s.section ?? "", first_words: (s.narration ?? "").split(/\s+/).filter(Boolean).slice(0, 12).join(" "),
        retention_device: s.retention_device ?? "", start_sec: Math.round(start), end_sec: Math.round(end),
      };
    }
  }
  return null;
}

export interface Chapter { t: string; sec: number; title: string }
/** "0:00 Intro\n1:21 The trial" (YouTube chapter text) to start seconds. */
export function parseChapters(text?: string): Chapter[] {
  const out: Chapter[] = [];
  for (const line of (text ?? "").split("\n")) {
    const m = /^\s*(?:(\d+):)?(\d{1,2}):(\d{2})\s+(.+?)\s*$/.exec(line);
    if (m) out.push({ t: `${m[1] ? m[1] + ":" : ""}${m[2]}:${m[3]}`, sec: Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]), title: m[4] });
  }
  return out;
}

/** Chapter start times plus, per retention milestone, the biggest drop with the chapter and scene it falls in. */
export function dropContext(item: Pick<ContentItem, "script" | "media" | "package"> | undefined, ret: RetentionFile | undefined) {
  if (!item || !ret) return undefined;
  const chapters = parseChapters(item.package?.chapters);
  const dur = Number(item.media?.duration) > 0 ? Number(item.media.duration) : ret.duration_sec;
  const drops: Record<string, unknown> = {};
  for (const [k, m] of Object.entries(ret.milestones)) {
    const d = m.biggest_drop;
    if (m.empty || !d) continue;
    const ch = [...chapters].reverse().find(c => c.sec <= d.at_sec);
    drops[k] = { ...d, chapter: ch ? `${ch.t} ${ch.title}` : undefined, scene: sceneAtSecond(item.script, dur, d.at_sec) ?? undefined };
  }
  if (!Object.keys(drops).length && !chapters.length) return undefined;
  return { chapters: chapters.length ? chapters.map(c => `${c.t} ${c.title}`) : undefined, drops, scene_timing: "script word shares times rendered duration, about 3 s accurate" };
}

// ---------- arm tables ----------

export interface ArmPost {
  id: string; published: string; experiments: Record<string, string>;
  words?: number; length_s?: number; avg_view_pct?: number | null;
  views_d3: number | null; views_d7: number | null; hold: Record<"d3" | "d7", { s5: number | null; s15: number | null }>;
}
export interface Snapshot { date: string; rows: any[] }
export interface ArmStats {
  n: number; n_views_d3: number; n_views_d7: number; n_hold_d3: number; n_hold_d7: number;
  median_views_d3: number | null; median_views_d7: number | null; median_avg_view_pct: number | null;
  median_hold_s5_d3: number | null; median_hold_s15_d3: number | null; median_hold_s5_d7: number | null; median_hold_s15_d7: number | null; median_duration_s: number | null; median_words: number | null;
}
export type ArmTables = Record<string, Record<string, ArmStats>>;

const viewsOf = (m: any): number | null => { const v = Number(m?.viewCount ?? m?.views ?? m?.life_views); return Number.isFinite(v) ? v : null; };

/** Views from the snapshot taken closest to `published + days` (within one day), or null when no snapshot is that close. */
export function viewsAtAge(snaps: Snapshot[], key: string, published: string, days: number): number | null {
  const target = Date.parse(`${addDaysIso(published, days)}T00:00:00Z`);
  let best: { gap: number; v: number; date: string } | null = null;
  for (const s of snaps) {
    const gap = Math.abs(Date.parse(`${s.date}T00:00:00Z`) - target) / 86400_000;
    if (gap > 1) continue;
    const row = s.rows.find(r => `${r.platform}:${r.remote_id}` === key);
    const v = viewsOf(row?.metrics);
    if (v === null) continue;
    if (!best || gap < best.gap || (gap === best.gap && s.date > best.date)) best = { gap, v, date: s.date };
  }
  return best ? best.v : null;
}

/** One ArmPost per YouTube Short that carries an experiments field (from its row, else its queue item). */
export function buildArmPosts(snaps: Snapshot[], items: ContentItem[], readRet: (id: string) => RetentionFile | undefined = id => readRetentionFile(retentionPath(id))): ArmPost[] {
  const sorted = [...snaps].sort((a, b) => a.date.localeCompare(b.date));
  const latest = new Map<string, any>();
  for (const s of sorted) for (const r of enrichRows(s.rows.filter(r => r.platform === "youtube" && r.kind === "short" && r.remote_id), items)) latest.set(r.remote_id, r);
  const out: ArmPost[] = [];
  for (const [id, r] of latest) {
    if (!r.experiments || !Object.keys(r.experiments).length) continue;
    const published = String(r.slot ?? r.date).slice(0, 10);
    const ret = readRet(id);
    const h = (k: "d3" | "d7") => { const m = ret?.milestones[k]; return m && !m.empty ? { s5: m.hold_pct.s5, s15: m.hold_pct.s15 } : { s5: null, s15: null }; };
    const key = `youtube:${id}`;
    out.push({
      id, published, experiments: r.experiments, words: r.words, length_s: r.length_s,
      avg_view_pct: Number.isFinite(Number(r.metrics?.averageViewPercentage)) && r.metrics?.averageViewPercentage != null ? Number(r.metrics.averageViewPercentage) : null,
      views_d3: viewsAtAge(sorted, key, published, 3), views_d7: viewsAtAge(sorted, key, published, 7),
      hold: { d3: h("d3"), d7: h("d7") },
    });
  }
  return out;
}

/** Per experiment key and arm: n and the medians the strategist reads. */
export function armTables(posts: ArmPost[]): ArmTables {
  const keys = [...new Set(posts.flatMap(p => Object.keys(p.experiments)))].sort();
  const num = (xs: (number | null | undefined)[]) => xs.filter((x): x is number => typeof x === "number" && Number.isFinite(x));
  const out: ArmTables = {};
  for (const k of keys) {
    const arms = [...new Set(posts.filter(p => p.experiments[k]).map(p => p.experiments[k]))].sort();
    out[k] = {};
    for (const a of arms) {
      const ps = posts.filter(p => p.experiments[k] === a);
      out[k][a] = {
        n: ps.length, n_views_d3: num(ps.map(p => p.views_d3)).length, n_views_d7: num(ps.map(p => p.views_d7)).length,
        n_hold_d3: ps.filter(p => p.hold.d3.s5 !== null || p.hold.d3.s15 !== null).length, n_hold_d7: ps.filter(p => p.hold.d7.s5 !== null || p.hold.d7.s15 !== null).length,
        median_views_d3: median(num(ps.map(p => p.views_d3))), median_views_d7: median(num(ps.map(p => p.views_d7))),
        median_avg_view_pct: median(num(ps.map(p => p.avg_view_pct))),
        median_hold_s5_d3: median(num(ps.map(p => p.hold.d3.s5))), median_hold_s15_d3: median(num(ps.map(p => p.hold.d3.s15))),
        median_hold_s5_d7: median(num(ps.map(p => p.hold.d7.s5))), median_hold_s15_d7: median(num(ps.map(p => p.hold.d7.s15))),
        median_duration_s: median(num(ps.map(p => p.length_s))), median_words: median(num(ps.map(p => p.words))),
      };
    }
  }
  return out;
}

/** Arm tables from the files on disk: every analytics snapshot, the queue items and the retention curves. */
export function buildArmTables(): { generated: string; note: string; tables: ArmTables } {
  const dir = join(DATA, "analytics");
  const snaps: Snapshot[] = existsSync(dir)
    ? readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map(f => ({ date: f.slice(0, 10), rows: JSON.parse(readFileSync(join(dir, f), "utf8")) as any[] }))
    : [];
  const tables = armTables(buildArmPosts(snaps, loadItems()));
  return { generated: new Date().toISOString().slice(0, 10), note: "YouTube Shorts with an experiments field. views_d3/d7 come from the daily snapshot closest to that age (within 1 day); medians skip missing values, n_* say how many were available. Hold is reported per curve age (_d3 from the day-3 curve, _d7 from the day-7 curve, never mixed) with its own n (n_hold_d3, n_hold_d7); compare arms on the same age.", tables };
}

// ---------- playbook rule expiry ----------

/** Drop playbook lines that carry "(until YYYY-MM-DD)" once that date is before `today`. Lines without a date are kept. */
export function expireRules(markdown: string, today: string): string {
  const indent = (l: string) => l.length - l.trimStart().length;
  const out: string[] = [];
  let dropIndent = -1; // inside an expired rule: skip the lines indented deeper than it
  for (const line of markdown.split("\n")) {
    if (dropIndent >= 0 && line.trim() !== "") {
      if (indent(line) > dropIndent) continue;
      dropIndent = -1;
    }
    const m = /\(until (\d{4}-\d{2}-\d{2})\)/i.exec(line);
    if (m && m[1] < today) { dropIndent = indent(line); continue; }
    out.push(line);
  }
  return out.join("\n");
}
