import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { config, DATA } from "../lib/config.js";
import { ContentItem, loadItems } from "../lib/items.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { currentDescription, updateDescription, videoInfo } from "./youtube.js";

/**
 * Shorts → long-form funnel. Every YouTube Short gets a "Full breakdown" link to a related long video on line 1 of its
 * description, and every long video a "Watch next" link to another one. The link is chosen by code (never by an agent)
 * and checked on YouTube first: the video must exist, be processed, and be public (or scheduled to go public) by the
 * time the post goes live. Agents used to write links themselves; one pointed to a video that didn't exist.
 *
 * (YouTube's "related video" button on a Short is Studio-only; descriptions are what the API can set.)
 */

export interface WatchNext { id: string; title: string; url: string; why: string }

const STATE = join(DATA, "funnel.json");
const LIVE_UPLOAD = new Set(["processed", "uploaded"]);
type FunnelState = Record<string, string>; // YouTube video id → linked long video id

interface LongCandidate { item: ContentItem; videoId: string; views: number }

/** Lines an agent wrote that point viewers to a video: unverified links or "[title]" placeholders. */
const AGENT_LINK = /(youtu\.be\/|youtube\.com\/(watch|shorts|live)|\[[^\]]*(title|link|url|L\d)[^\]]*\]|^\s*▶?\s*(full breakdown|watch (the )?(full|next)|full video)\b)/i;

/** Strip agent-written video links and our own earlier funnel line from a description. */
export function stripVideoLinks(description: string): string {
  const lines = description.split("\n").filter(l => !AGENT_LINK.test(l));
  while (lines.length && !lines[0].trim()) lines.shift();
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

export function nicheMatch(item: ContentItem): boolean {
  const n = (config as any).niche;
  if (!n?.enabled || !n.match) return true;
  return new RegExp(n.match, "i").test(`${item.package?.title ?? ""} ${item.plan.topic}`);
}

function latestViews(): Record<string, number> {
  const dir = join(DATA, "analytics");
  const files = existsSync(dir) ? readdirSync(dir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort() : [];
  const last = files[files.length - 1];
  if (!last) return {};
  const rows = readJson<any[]>(join(dir, last), []);
  return Object.fromEntries(rows.filter(r => r.platform === "youtube" && r.remote_id).map(r => [r.remote_id, Number(r.metrics?.viewCount ?? 0)]));
}

function longCandidates(): LongCandidate[] {
  const views = latestViews();
  const out: LongCandidate[] = [];
  for (const item of loadItems()) {
    if (item.kind !== "long" || item.status !== "ready") continue;
    const p = item.posts.find(p => p.platform === "youtube" && p.format === "long");
    if (!p?.remote_id || (p.status !== "published" && p.status !== "scheduled")) continue;
    out.push({ item, videoId: p.remote_id, views: views[p.remote_id] ?? 0 });
  }
  return out;
}

const STOP = new Set("the and for with what how why does did your you are its this that from into than more most over after about have has was were will can not new study trial trials data results result weight loss glp-1 glp1 people adults shorts".split(" "));
const DRUGS = /^(semaglutide|ozempic|wegovy|rybelsus|tirzepatide|mounjaro|zepbound|liraglutide|saxenda|orforglipron|foundayo|retatrutide|reta|amylin|cagrilintide|cagrisema|petrelintide|survodutide|mazdutide|maridebart|maritide|eloralintide|eloratzp|danuglipron|dulaglutide|compounded|counterfeit)$/;
const tokens = (i: ContentItem) => new Set(`${i.package?.title ?? ""} ${i.plan.topic} ${i.plan.target_keyword}`.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).map(w => w.replace(/^-+|-+$/g, "")).filter(w => w.length >= 4 && !STOP.has(w)));

/** Is this Short planned as a spin-off of its day's long video? */
const spinOff = (i: ContentItem) => /spin-?\s?off|\bL1\b/i.test(`${i.plan.angle} ${i.plan.why}`);

/**
 * Pick the long video a post should send viewers to, live by `liveBy` (the post's own publish time).
 * Order: the day's long video when the Short was planned as its spin-off → the most related long video (shared terms,
 * drug names weighted, rare terms count more) → same pillar, most viewed → most viewed. In-niche only; never itself.
 */
export async function watchNextFor(item: ContentItem, liveBy: Date, excludeVideoId?: string): Promise<WatchNext | undefined> {
  const all = longCandidates().filter(c => c.videoId !== excludeVideoId && c.item.id + c.item.date !== item.id + item.date && nicheMatch(c.item));
  if (!all.length) return;
  const byViews = (a: LongCandidate, b: LongCandidate) => b.views - a.views || b.item.date.localeCompare(a.item.date);
  const df = new Map<string, number>();
  const toks = new Map(all.map(c => [c, tokens(c.item)]));
  for (const t of toks.values()) for (const w of t) df.set(w, (df.get(w) ?? 0) + 1);
  const mine = tokens(item);
  const score = (c: LongCandidate) => [...toks.get(c)!].filter(w => mine.has(w)).reduce((a, w) => a + Math.log((all.length + 1) / df.get(w)!) * (DRUGS.test(w) ? 2 : 1), 0);
  const ranked: [LongCandidate, string][] = [];
  const add = (c: LongCandidate, why: string) => { if (!ranked.some(([r]) => r === c)) ranked.push([c, why]); };
  if (item.kind !== "long" && spinOff(item)) all.filter(c => c.item.date === item.date && score(c) > 0).forEach(c => add(c, "spin-off of the day's long video"));
  all.map(c => [c, score(c)] as const).filter(([, s]) => s >= 1.5).sort((a, b) => b[1] - a[1] || byViews(a[0], b[0])).slice(0, 15)
    .forEach(([c, s]) => add(c, `most related (score ${s.toFixed(1)}, ${c.views} views)`));
  all.filter(c => item.plan.pillar && c.item.plan.pillar === item.plan.pillar).sort(byViews).slice(0, 10).forEach(c => add(c, `same pillar (${c.views} views)`));
  [...all].sort(byViews).slice(0, 10).forEach(c => add(c, `top long video (${c.views} views)`));
  const info = await videoInfo([...new Set(ranked.map(([c]) => c.videoId))].slice(0, 50));
  for (const [c, why] of ranked) {
    const v = info[c.videoId];
    if (!v || !LIVE_UPLOAD.has(v.uploadStatus)) continue;
    const live = v.privacyStatus === "public" || (v.privacyStatus === "private" && !!v.publishAt && Date.parse(v.publishAt) <= liveBy.getTime());
    if (!live) continue;
    return { id: c.videoId, title: v.title, url: `https://youtu.be/${c.videoId}`, why };
  }
}

/** A Short's description with the verified funnel link on line 1 (agent-written links removed). */
export function shortDescription(description: string, w?: WatchNext): string {
  const body = stripVideoLinks(description);
  return w ? `▶ Full breakdown: ${w.title}\n${w.url}\n\n${body}` : body;
}

/** A long video's description with a verified "Watch next" link after the first paragraph. */
export function longDescription(description: string, w?: WatchNext): string {
  const body = stripVideoLinks(description);
  if (!w) return body;
  const cut = body.indexOf("\n\n");
  const line = `▶ Watch next: ${w.title}\n${w.url}`;
  return cut < 0 ? `${body}\n\n${line}` : `${body.slice(0, cut)}\n\n${line}${body.slice(cut)}`;
}

export function rememberFunnel(videoId: string, longId: string) {
  const s = readJson<FunnelState>(STATE, {});
  s[videoId] = longId;
  writeJson(STATE, s);
}

/**
 * Add or upgrade the funnel link on already-uploaded YouTube videos. Picks Shorts (and long videos) whose link is
 * missing or would now point somewhere better (e.g. the same day's long video went up after the Short), most viewed
 * first. Each update costs ~51 quota units, so it's capped (uploads need ~1,600 each).
 */
export async function refreshFunnel(opts: { dates?: string[]; max?: number; dry?: boolean; longs?: boolean } = {}): Promise<{ updated: string[]; skipped: number }> {
  const max = opts.max ?? 15;
  const state = readJson<FunnelState>(STATE, {});
  const views = latestViews();
  const targets: { item: ContentItem; videoId: string; kind: "short" | "long"; views: number; slot: string }[] = [];
  for (const item of loadItems(opts.dates)) {
    if (item.status !== "ready" || !nicheMatch(item)) continue;
    for (const p of item.posts) {
      if (p.platform !== "youtube" || !p.remote_id || (p.status !== "published" && p.status !== "scheduled")) continue;
      if (p.format === "short" || (opts.longs && p.format === "long")) targets.push({ item, videoId: p.remote_id, kind: p.format === "short" ? "short" : "long", views: views[p.remote_id] ?? 0, slot: p.slot });
    }
  }
  targets.sort((a, b) => b.views - a.views || b.item.date.localeCompare(a.item.date));
  const updated: string[] = [];
  let skipped = 0;
  for (const t of targets) {
    if (updated.length >= max) break;
    // live by the time this video is (a scheduled Short may link a long video scheduled before it)
    const w = await watchNextFor(t.item, new Date(Math.max(Date.parse(t.slot), Date.now())), t.videoId);
    if (!w) { skipped++; continue; }
    // keep an existing link unless the day's long video it was spun off from is now live (no churn as view rankings shift)
    if (state[t.videoId] === w.id || (state[t.videoId] && !w.why.startsWith("spin-off"))) { skipped++; continue; }
    const cur = await currentDescription(t.videoId);
    if (cur === undefined) { skipped++; continue; }
    if (cur.includes(w.url)) { state[t.videoId] = w.id; skipped++; continue; }
    const next = t.kind === "short" ? shortDescription(cur, w) : longDescription(cur, w);
    log.info(`funnel ${t.item.date}/${t.item.id} (${t.videoId}) → ${w.id} "${w.title}" [${w.why}]${opts.dry ? " (dry run)" : ""}`);
    if (!opts.dry) {
      try { await updateDescription(t.videoId, next); } catch (e) { log.warn(`funnel ${t.videoId}: ${(e as Error).message}`); continue; }
      state[t.videoId] = w.id;
    }
    updated.push(`${t.item.date}/${t.item.id} → ${w.title}`);
  }
  if (!opts.dry) writeJson(STATE, state);
  return { updated, skipped };
}
