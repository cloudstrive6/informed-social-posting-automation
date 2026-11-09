/**
 * Quality feedback loop. Every produced item leaves a record of what our own QA caught (Visual Critic notes,
 * layout findings, fact-check and packaging fixes, audio issues). Daily, the Quality Coach distills the
 * recurring problems into data/craft-notes.md, which every agent reads before working, so the same
 * mistake is prevented upstream instead of being fixed (or held) again and again.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA } from "../lib/config.js";
import { ensureDir, readText, writeText } from "../lib/fsx.js";
import type { ContentItem } from "../lib/items.js";
import { log } from "../lib/log.js";

const LOG = join(DATA, "quality", "log.jsonl");
export const CRAFT_NOTES = join(DATA, "craft-notes.md");

type Issue = { severity?: string; location?: string; problem?: string; fix?: string };

/** One compact line per item: scores plus the concrete problems QA found. */
export function recordQuality(item: ContentItem) {
  const qa = (item.qa ?? {}) as any;
  const pick = (issues: Issue[] | undefined) => (issues ?? []).slice(0, 12).map(i => [i.severity, i.location, i.problem].filter(Boolean).join(" | ").slice(0, 300));
  const rec = {
    date: item.date, id: item.id, kind: item.kind, status: item.status,
    hold_reason: item.hold_reason?.slice(0, 400),
    visual_score: qa.visual?.avgScore ?? null, weak_shots: qa.visual?.weakShots ?? null,
    visual_notes: (qa.visual?.notes ?? []).slice(0, 12),
    layout: qa.visual?.layoutKinds ?? {},
    frame_issues: (qa.visual?.frameIssues ?? []).map((f: any) => f.kind),
    narration_wer: qa.narrationWer ?? null, masking: qa.audio?.maskingDelta ?? null, subtitles_wer: qa.subtitles?.wer ?? null,
    blocking: qa.blocking ?? [],
    factcheck: pick(item.factcheck?.issues),
    packaging: pick((qa.packaging as { issues?: Issue[] } | undefined)?.issues),
  };
  ensureDir(join(DATA, "quality"));
  appendFileSync(LOG, JSON.stringify(rec) + "\n");
}

const craftSchema = {
  type: "object", additionalProperties: false, required: ["craft_notes_markdown", "summary"],
  properties: { craft_notes_markdown: { type: "string" }, summary: { type: "string" } },
};

/**
 * Until 2026-11-09 the Visual Critic got mislabelled frames on long videos (snapshot sort bug, fixed in
 * src/qa/visualQa.ts), so its "offset beat" / "wrong beat" findings from those records are false: the published
 * videos were checked and are in sync. Keep them out of the craft notes. Real drift is now caught by the
 * beat-sync gate (src/qa/beatSync.ts), which reports in qa.beats and qa.blocking.
 */
const FALSE_OFFSET_NOTE = "Offset-beat / wrong-beat findings in records up to 2026-11-09 were a QA bug (the Visual Critic was shown frames in the wrong order); the published videos were measured and are in sync, and the 'Not personal advice' disclaimer was on screen. Remove those claims from the notes. Beat timing is now checked automatically by the beat-sync gate.";
const OFFSET_CLAIM = /offset|scripted for|wrong beat|belongs to .*(beat|shot)|leaking in|minutes? early|content jump|collapsed into/i;
function dropFalseOffsetBeats<T extends { date: string; visual_notes?: string[] }>(r: T): T {
  if (r.date > "2026-11-09" || !r.visual_notes) return r;
  return { ...r, visual_notes: r.visual_notes.filter(n => !OFFSET_CLAIM.test(n)) };
}

/** Rewrite the craft notes from the last ~14 days of QA records. Never throws. */
export async function updateCraftNotes(days = 14) {
  if (!existsSync(LOG)) return;
  const since = Date.now() - days * 86400_000;
  const records = readFileSync(LOG, "utf8").split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return undefined; } })
    .filter(r => r && Date.parse(r.date) >= since)
    .map(dropFalseOffsetBeats);
  if (!records.length) return;
  try {
    const out = await runAgent<{ craft_notes_markdown: string; summary: string }>({
      agent: "quality-coach", model: config.models.analyst, schema: craftSchema, effort: "medium",
      input: { current_notes: readText(CRAFT_NOTES, ""), records, corrections: [FALSE_OFFSET_NOTE] },
    });
    writeText(CRAFT_NOTES, `${out.craft_notes_markdown.trim()}\n\n_Updated ${new Date().toISOString().slice(0, 10)} from ${records.length} QA records._\n`);
    log.info(`craft notes updated: ${out.summary.slice(0, 200)}`);
  } catch (e) {
    log.warn(`quality coach failed: ${(e as Error).message.slice(0, 200)}`);
  }
}
