/**
 * Fully automated review: the Editor-in-Chief agent makes the final publish / drop call on content the checks
 * held, instead of waiting for a human. Published backlog is spread over upcoming free slots so it never
 * floods a platform. The owner is informed on Telegram (with an optional "Don't post" veto).
 */
import { runAgent } from "../lib/agent.js";
import { config } from "../lib/config.js";
import { ContentItem, loadItems, PostTarget } from "../lib/items.js";
import { log } from "../lib/log.js";
import { addDays, localDate, zonedToUtc } from "../lib/time.js";

export interface EditorDecision { decision: "publish" | "drop"; reason: string; risk: "low" | "medium" | "high" }
const schema = {
  type: "object", additionalProperties: false, required: ["decision", "reason", "risk"],
  properties: { decision: { enum: ["publish", "drop"] }, reason: { type: "string" }, risk: { enum: ["low", "medium", "high"] } },
};

/** Media problems no editor should wave through. */
const HARD_BLOCKS = /photosensitive|black frames|voice masked|runs .* min \(allowed|Short runs/i;

export async function editorDecision(item: ContentItem): Promise<EditorDecision> {
  const qa = (item.qa ?? {}) as any;
  const blocking: string[] = qa.blocking ?? [];
  const hard = [...blocking, item.hold_reason ?? ""].find(b => HARD_BLOCKS.test(b));
  if (hard) return { decision: "drop", reason: `Automatic drop: ${hard.slice(0, 200)}`, risk: "high" };
  try {
    return await runAgent<EditorDecision>({
      agent: "editor-in-chief", model: config.models.factChecker, schema, effort: "high",
      input: {
        kind: item.kind, title: item.package.title ?? item.plan.working_title, topic: item.plan.topic,
        thumbnail_text: item.package.thumbnail ? `${item.package.thumbnail.headline} / ${item.package.thumbnail.subtext}` : undefined,
        captions: item.package.social, description_start: item.package.description?.slice(0, 800),
        hold_reason: item.hold_reason,
        fact_check: item.factcheck ? { verdict: item.factcheck.verdict, summary: item.factcheck.summary, issues: item.factcheck.issues } : undefined,
        packaging_check: qa.packaging,
        qa: { narration_wer: qa.narrationWer, subtitles: qa.subtitles, audio: qa.audio, visual_score: qa.visual?.avgScore, duration_min: item.media.duration ? +(item.media.duration / 60).toFixed(1) : undefined, blocking },
      },
    });
  } catch (e) {
    // if the editor can't run, be conservative: keep it off the channel
    return { decision: "drop", reason: `Editor-in-Chief unavailable (${(e as Error).message.slice(0, 120)}); not published`, risk: "high" };
  }
}

/**
 * Move an item's past-due posts into upcoming free slots. Today: the regular schedule slots nobody else uses;
 * later days: regular slot + 75 min, so backlog never collides with that day's own production.
 */
export function rescheduleIntoFreeSlots(item: ContentItem) {
  const tz = config.audience.timezone;
  const now = Date.now() + 10 * 60_000;
  const due = item.posts.filter(p => p.status === "pending" && Date.parse(p.slot) <= now);
  if (!due.length) return;
  // one shared slot for the whole piece, free on every platform it posts to
  const taken = new Set(loadItems().filter(i => i.id !== item.id).flatMap(i => i.posts)
    .filter(p => p.status === "pending" || p.status === "scheduled").map(p => `${p.platform}:${p.slot}`));
  const times = config.schedule[item.kind] ?? [];
  const today = localDate(tz);
  for (let d = 0; d < 7; d++) {
    for (const hhmm of times) {
      const iso = new Date(zonedToUtc(addDays(today, d), hhmm, tz).getTime() + (d === 0 ? 0 : 75 * 60_000)).toISOString();
      if (Date.parse(iso) > now && due.every(p => !taken.has(`${p.platform}:${iso}`))) { for (const p of due) p.slot = iso; return; }
    }
  }
}

/** Apply a decision to a held item (does not save). */
export function applyDecision(item: ContentItem, d: EditorDecision) {
  if (d.decision === "publish") {
    item.status = "ready";
    item.approved_by = `editor-in-chief (${d.risk} risk): ${d.reason}`.slice(0, 500);
    for (const p of item.posts as PostTarget[]) if (p.status === "held") { p.status = "pending"; p.attempts = 0; }
    rescheduleIntoFreeSlots(item);
  } else {
    item.status = "held";
    item.hold_reason = `Dropped by Editor-in-Chief: ${d.reason}`.slice(0, 1000);
    for (const p of item.posts) if (p.status === "held" || p.status === "pending") p.status = "skipped";
  }
  log.info(`editor-in-chief: ${item.id} → ${d.decision} (${d.risk}) ${d.reason.slice(0, 160)}`);
}
