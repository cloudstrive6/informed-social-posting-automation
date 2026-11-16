/**
 * The channel's first comment on every long YouTube upload (growth strategy F1, owner approved 2026-11-16).
 * One top-level comment per long video: a NON-health question that invites topic suggestions. Deterministic text
 * (no LLM): a reviewed list of templates rotated by content date, with the video's main drug name when the title or
 * topic names one. No health claims, no dosing or switching talk, no prompt for personal health stories.
 * The API cannot pin, so pinning stays a manual owner step. Shorts never get one.
 *
 * Runs from the ops watchdog (every ~10 min inside the publish loop). Posts only once the video is public and
 * processed, never twice: the comment id is recorded in data/ops/first-comments.json (keyed by YouTube video id, so a
 * rerun or the finalize copy step cannot lose it) and on the post (first_comment_id), and before posting it checks
 * the video for a comment the channel already left. A failed post is retried on a later pass (at least an hour
 * apart), at most 3 attempts per video, and never throws into the publisher.
 * Kill switch: config.youtube.firstComment.enabled=false, or env YT_FIRST_COMMENT=off.
 */
import { join } from "node:path";
import { config, DATA } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import type { ContentItem, PostTarget } from "../lib/items.js";
import { log } from "../lib/log.js";

/** Only items whose content date is on or after the day the feature ships: older videos keep their comment section as is. */
export const FIRST_COMMENT_FROM = "2026-11-17";
export const MAX_COMMENT_ATTEMPTS = 3;
const RETRY_GAP_MS = 55 * 60_000;
const STATE = join(DATA, "ops", "first-comments.json");

// ---------- text ----------

/** Each template has a version with the video's drug (or "GLP-1") and a generic version without one. */
export const COMMENT_TEMPLATES: { withSubject: (s: string) => string; generic: string }[] = [
  { withSubject: s => `Which ${s} headline should we check against the evidence next?`, generic: "Which health headline should we check against the evidence next?" },
  { withSubject: s => `What ${s} question should our next deep dive answer?`, generic: "What question should our next deep dive answer?" },
  { withSubject: s => `Which ${s} study would you like us to break down next?`, generic: "Which study would you like us to break down next?" },
  { withSubject: s => `What ${s} claim have you seen online that we should fact-check in a future video?`, generic: "What health claim have you seen online that we should fact-check in a future video?" },
  { withSubject: s => `Which ${s} term or trial name should we explain in plain English next?`, generic: "Which medical term or trial name should we explain in plain English next?" },
  { withSubject: s => `Which ${s} news story do you want us to explain next?`, generic: "Which health news story do you want us to explain next?" },
  { withSubject: s => `What part of the ${s} research should we cover in more detail next time?`, generic: "What part of the research should we cover in more detail next time?" },
  { withSubject: s => `What ${s} topic should we take on next? Suggestions welcome below.`, generic: "What topic should we take on next? Suggestions welcome below." },
];

/** Words no comment may contain (owner rules: no dosing, switching or stopping talk, no asking for personal results). */
export const BANNED_COMMENT_WORDS = ["dose", "dosing", "switch", "stop", "side effect", "side-effect", "your results", "your experience", "your journey", "your story", "your weight", "your doctor", "cure"];

/** Generic names the comment may use, matched by generic or brand name (brands only to recognise the drug). */
const DRUGS: [RegExp, string][] = [
  [/\b(semaglutide|ozempic|wegovy|rybelsus)\b/i, "semaglutide"],
  [/\b(tirzepatide|mounjaro|zepbound)\b/i, "tirzepatide"],
  [/\b(liraglutide|saxenda|victoza)\b/i, "liraglutide"],
  [/\b(dulaglutide|trulicity)\b/i, "dulaglutide"],
  [/\borforglipron\b/i, "orforglipron"],
  [/\bretatrutide\b/i, "retatrutide"],
  [/\bsurvodutide\b/i, "survodutide"],
  [/\bcagrisema\b/i, "CagriSema"],
  [/\bcagrilintide\b/i, "cagrilintide"],
  [/\bpetrelintide\b/i, "petrelintide"],
  [/\bmazdutide\b/i, "mazdutide"],
  [/\bamycretin\b/i, "amycretin"],
];

/** The drug the video is mainly about: the one named first in the title, else in the topic; "GLP-1" for GLP-1 videos without one. */
export function mainSubject(item: Pick<ContentItem, "plan" | "package">): string | undefined {
  for (const text of [item.package?.title, item.plan?.working_title, item.plan?.topic]) {
    if (!text) continue;
    let best: { at: number; name: string } | undefined;
    for (const [re, name] of DRUGS) {
      const m = re.exec(text);
      if (m && (!best || m.index < best.at)) best = { at: m.index, name };
    }
    if (best) return best.name;
  }
  return [item.package?.title, item.plan?.topic].some(t => /\bglp-?1\b/i.test(t ?? "")) ? "GLP-1" : undefined;
}

/** Days since 1970-01-01 of a YYYY-MM-DD content date: rotates the templates one per day. */
const dayNumber = (date: string) => Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400_000);

export function firstCommentText(item: Pick<ContentItem, "date" | "plan" | "package">): string {
  const n = COMMENT_TEMPLATES.length;
  const t = COMMENT_TEMPLATES[((dayNumber(item.date) % n) + n) % n];
  const s = mainSubject(item);
  return s ? t.withSubject(s) : t.generic;
}

// ---------- which videos are due ----------

export interface CommentRecord { item: string; comment_id?: string; attempts: number; last_try?: string; last_error?: string; at?: string; found_existing?: boolean }
export type CommentState = Record<string, CommentRecord>;

export interface DueComment { item: ContentItem; post: PostTarget; videoId: string }

const isTestHold = (i: ContentItem) => /test run/i.test(i.hold_reason ?? "");

/** Long videos that may get their first comment now (before the public check): pure, no network. */
export function dueFirstComments(items: ContentItem[], state: CommentState, now: number): DueComment[] {
  const out: DueComment[] = [];
  for (const item of items) {
    if (item.kind !== "long" || item.date < FIRST_COMMENT_FROM || item.status !== "ready" || isTestHold(item)) continue;
    for (const p of item.posts) {
      if (p.platform !== "youtube" || p.format !== "long" || !p.remote_id) continue;
      if (p.status !== "scheduled" && p.status !== "published") continue;
      if (Date.parse(p.slot) > now || p.first_comment_id) continue;
      const rec = state[p.remote_id];
      if (rec?.comment_id || (rec?.attempts ?? 0) >= MAX_COMMENT_ATTEMPTS) continue;
      if (rec?.last_try && now - Date.parse(rec.last_try) < RETRY_GAP_MS) continue;
      out.push({ item, post: p, videoId: p.remote_id });
    }
  }
  return out;
}

export const firstCommentEnabled = () =>
  !/^(0|off|false|no)$/i.test(process.env.YT_FIRST_COMMENT ?? "") && config.youtube?.firstComment?.enabled !== false;

// ---------- run ----------

export interface CommentApi {
  /** privacy and upload status of up to 50 videos */
  info: (ids: string[]) => Promise<Record<string, { privacyStatus: string; uploadStatus: string }>>;
  /** a comment the channel already left on the video (or one with this exact text) */
  find: (videoId: string, text: string) => Promise<string | undefined>;
  post: (videoId: string, text: string) => Promise<string>;
}

export interface CommentDeps {
  items: ContentItem[]; api: CommentApi; now?: number; dry?: boolean;
  loadState?: () => CommentState; saveState?: (s: CommentState) => void; saveItem?: (i: ContentItem) => void;
}

/** One pass: comment on every due long video that is public and processed. Never throws. */
export async function runFirstComments(deps: CommentDeps): Promise<{ posted: string[]; found: string[]; failed: string[]; waiting: number }> {
  const res = { posted: [] as string[], found: [] as string[], failed: [] as string[], waiting: 0 };
  if (!firstCommentEnabled()) return res;
  const now = deps.now ?? Date.now();
  const loadState = deps.loadState ?? (() => readJson<CommentState>(STATE, {}));
  const saveState = deps.saveState ?? ((s: CommentState) => writeJson(STATE, s));
  try {
    const state = loadState();
    const due = dueFirstComments(deps.items, state, now);
    if (!due.length) return res;
    const info = await deps.api.info(due.map(d => d.videoId).slice(0, 50));
    let changed = false;
    for (const d of due) {
      const st = info[d.videoId];
      if (!st || st.privacyStatus !== "public" || st.uploadStatus !== "processed") { res.waiting++; continue; } // not live yet: no attempt used
      const text = firstCommentText(d.item);
      if (deps.dry) { log.info(`[dry] first comment on ${d.videoId}: ${text}`); continue; }
      const ref = `${d.item.date}/${d.item.id}`;
      const rec: CommentRecord = state[d.videoId] ?? { item: ref, attempts: 0 };
      rec.attempts++; rec.last_try = new Date(now).toISOString();
      try {
        const existing = await deps.api.find(d.videoId, text);
        const id = existing ?? await deps.api.post(d.videoId, text);
        rec.comment_id = id; rec.at = new Date(now).toISOString(); rec.last_error = undefined;
        if (existing) { rec.found_existing = true; res.found.push(d.videoId); } else res.posted.push(d.videoId);
        d.post.first_comment_id = id;
        deps.saveItem?.(d.item);
        log.info(`first comment ${existing ? "already there" : "posted"} on ${ref} (${d.videoId}): ${text}`);
      } catch (e) {
        rec.last_error = (e as Error).message.slice(0, 300);
        if (/quotaExceeded|dailyLimitExceeded|rateLimitExceeded/.test(rec.last_error)) rec.attempts--; // quota: wait for the reset, no attempt used
        res.failed.push(d.videoId);
        log.warn(`first comment on ${ref} (${d.videoId}) failed, ${/quotaExceeded|dailyLimitExceeded|rateLimitExceeded/.test(rec.last_error) ? "quota, waiting for the reset" : `attempt ${rec.attempts}/${MAX_COMMENT_ATTEMPTS}${rec.attempts < MAX_COMMENT_ATTEMPTS ? ", retrying on a later pass" : ", giving up"}`}: ${rec.last_error.slice(0, 200)}`);
      }
      state[d.videoId] = rec; changed = true;
    }
    // keep 90 days of records
    for (const [id, r] of Object.entries(state)) if (r.last_try && now - Date.parse(r.last_try) > 90 * 86400_000) { delete state[id]; changed = true; }
    if (changed) saveState(state);
  } catch (e) {
    log.warn(`first comments: ${(e as Error).message.slice(0, 300)}`);
  }
  return res;
}
