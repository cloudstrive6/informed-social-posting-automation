import { join } from "node:path";
import type { VideoQa } from "../media/buildVideo.js";
import { narrate } from "../media/tts.js";
import { checkNarration, SceneCheck } from "../qa/audioQa.js";
import { writeJson } from "../lib/fsx.js";
import { runAgent, AgentName } from "../lib/agent.js";
import { config, DATA, OUT } from "../lib/config.js";
import { ContentItem, queueDir, targetsFor } from "../lib/items.js";
import { ensureDir, readJson, slugify } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { DayPlan, FactCheck, factCheckSchema, Narration, narrationSchema, PlannedPiece, Scene, SocialCopy, socialCopySchema, Source } from "../lib/schemas.js";

export function loadPiece(date: string, pieceId: string): { plan: DayPlan; piece: PlannedPiece; index: number } {
  const plan = readJson<DayPlan>(join(queueDir(date), "plan.json"));
  const piece = plan.pieces.find(p => p.id === pieceId);
  if (!piece) throw new Error(`piece ${pieceId} not in plan for ${date}`);
  const index = plan.pieces.filter(p => p.kind === piece.kind).indexOf(piece);
  return { plan, piece, index };
}

export function workDir(date: string, id: string) { return ensureDir(join(OUT, date, id)); }

export function newItem(date: string, piece: PlannedPiece, index: number): ContentItem {
  return {
    id: `${piece.id}-${slugify(piece.topic, 40)}`,
    date, kind: piece.kind, plan: piece, status: "ready",
    package: {}, media: {}, posts: targetsFor(piece.kind, index, date),
    created_at: new Date().toISOString(),
  };
}

export interface CheckedContent<T> { content: T; factcheck: FactCheck; held: boolean; holdReason?: string }

/**
 * Writer ⇄ Fact-checker loop. The writer drafts, the fact-checker verifies against real sources,
 * the writer applies fixes; repeat up to maxRevisionRounds. Anything not PASS at the end is held.
 */
export async function writeWithFactCheck<T>(writer: AgentName, schema: object, brief: object): Promise<CheckedContent<T>> {
  let content = await runAgent<T>({ agent: writer, model: config.models.writer, schema, input: brief, effort: "high" });
  let fc: FactCheck | undefined;
  for (let round = 0; round <= config.safety.maxRevisionRounds; round++) {
    fc = await runAgent<FactCheck>({
      agent: "fact-checker", model: config.models.factChecker, web: true, maxTurns: 45, schema: factCheckSchema,
      input: { mode: "content_check", content },
    });
    log.info(`fact-check round ${round + 1}: ${fc.verdict} (${fc.issues.length} issues) — ${fc.summary.slice(0, 160)}`);
    if (fc.verdict === "HOLD") break;
    if (fc.verdict === "PASS" && fc.issues.length === 0) break;
    if (round === config.safety.maxRevisionRounds) break;
    content = await runAgent<T>({
      agent: writer, model: config.models.writer, schema, effort: "high",
      input: { ...brief, task: "REVISE the draft. Apply every fact-checker fix exactly; keep everything else that works.", draft: content, fact_check: fc },
    });
    // PASS with minor fixes: fixes are applied, no need for another round
    if (fc.verdict === "PASS") break;
  }
  // Out of rounds but only minor, precisely-specified fixes left: apply them and accept (majors/critical still hold)
  if (fc!.verdict === "REVISE" && fc!.issues.length && fc!.issues.every(i => i.severity === "minor")) {
    content = await runAgent<T>({
      agent: writer, model: config.models.writer, schema, effort: "high",
      input: { ...brief, task: "Apply these final minor fact-checker fixes exactly. Change nothing else.", draft: content, fact_check: fc },
    });
    log.info(`fact-check: ${fc!.issues.length} minor fixes applied after the final round — accepted`);
    fc = { ...fc!, verdict: "PASS", summary: `Minor fixes applied after final review: ${fc!.issues.map(i => i.location).join("; ")}` };
  }
  const held = fc!.verdict !== "PASS";
  return { content, factcheck: fc!, held, holdReason: held ? `Fact-checker verdict ${fc!.verdict}: ${fc!.summary}` : undefined };
}

/** Narration Director pass: rewrite scene narration for the ear. Falls back to the raw text on failure. */
export async function directNarration(scenes: Scene[]): Promise<{ id: string; text: string; speed: number; pause_after_ms: number }[]> {
  try {
    const n = await runAgent<Narration>({
      agent: "narration-director", model: config.models.writer, schema: narrationSchema, effort: "medium",
      input: { scenes: scenes.map(s => ({ id: s.id, section: s.section, narration: s.narration, visual: s.visual.kind })) },
    });
    const byId = new Map(n.scenes.map(s => [s.id, s]));
    return scenes.map(s => {
      const d = byId.get(s.id);
      return { id: s.id, text: d?.spoken_text || s.narration, speed: d?.speed ?? 1, pause_after_ms: d?.pause_after_ms ?? 250 };
    });
  } catch (e) {
    log.warn(`narration director failed, using raw narration: ${(e as Error).message}`);
    return scenes.map(s => ({ id: s.id, text: s.narration, speed: 1, pause_after_ms: 250 }));
  }
}

/**
 * Narrate, then have Whisper listen to every scene and compare it with the script.
 * ElevenLabs: re-voice only the scenes that came out wrong (up to N retakes). Chatterbox: one full retake.
 */
export async function narrateChecked(spoken: { id: string; text: string; speed: number; pause_after_ms: number }[], dir: string, voice?: string, kind = "short") {
  const redo = new Map<string, number>();
  let res = await narrate(spoken, dir, voice, redo, kind);
  let checks: SceneCheck[] = [];
  if (!config.qa.enabled) return { ...res, checks, wer: 0, spokenText: spoken.map(s => s.text).join(" ") };
  const eleven = res.provider === "elevenlabs";
  for (let attempt = 0; attempt <= config.qa.narrationMaxRetakes; attempt++) {
    checks = await checkNarration(res.wav, res.timeline, spoken, dir);
    const bad = checks.filter(c => c.wer > config.qa.sceneWerThreshold);
    log.info(`narration QA: ${checks.length - bad.length}/${checks.length} scenes clean${bad.length ? ` — retake: ${bad.map(b => `${b.id} (${Math.round(b.wer * 100)}% ${b.diffs[0] ?? ""})`).join("; ")}` : ""}`);
    if (!bad.length || attempt === config.qa.narrationMaxRetakes) break;
    if (eleven) { bad.forEach(b => redo.set(b.id, (redo.get(b.id) ?? 0) + 1)); res = await narrate(spoken, dir, voice, redo, kind); }
    else if (res.provider === "chatterbox" && attempt === 0) res = await narrate(spoken, dir, voice, new Map(), kind);
    else break;
  }
  const words = spoken.reduce((a, s) => a + s.text.split(/\s+/).length, 0);
  const wer = checks.reduce((a, c) => a + c.wer * (spoken.find(s => s.id === c.id)?.text.split(/\s+/).length ?? 0), 0) / Math.max(1, words);
  writeJson(join(dir, "qa-narration.json"), { wer, checks });
  return { ...res, checks, wer: +wer.toFixed(3), spokenText: spoken.map(s => s.text).join(" ") };
}

/** QA problems that should stop auto-publishing (the item is held for human review instead). */
export function qaBlockers(narration: { checks: SceneCheck[] }, video: VideoQa): string[] {
  const out = [...video.blocking];
  const broken = narration.checks.filter(c => c.wer > config.qa.sceneWerThreshold * 2);
  if (broken.length) out.push(`narration doesn't match script in ${broken.length} scene(s): ${broken.map(b => b.diffs[0]).join("; ")}`);
  return out;
}

export async function socialCopy(item: ContentItem, summary: object, revision?: { draft: SocialCopy; fact_check: FactCheck }): Promise<SocialCopy> {
  return runAgent<SocialCopy>({
    agent: "social-copywriter", model: config.models.polish, schema: socialCopySchema, effort: "medium",
    input: {
      kind: item.kind, topic: item.plan.topic, disclaimer: config.safety.disclaimer, accounts: config.accounts, content: summary,
      ...(revision ? { task: "REVISE the draft captions. Apply every packaging-check fix exactly; keep everything else that works.", ...revision } : {}),
    },
  });
}

/**
 * Final consistency check of the packaging (title, thumbnail text, captions) against the fact-checked content.
 * `verifiedContent` (the approved script or slides) is the source of truth, not the one-line plan topic.
 */
export async function checkPackaging(item: ContentItem, packaging: object, sources: Source[], verifiedContent?: object): Promise<FactCheck> {
  return runAgent<FactCheck>({
    agent: "fact-checker", model: config.models.factChecker, schema: factCheckSchema, web: true, maxTurns: 25, effort: "medium",
    input: {
      mode: "packaging_check",
      note: "Packaging check: are the title / thumbnail text / captions accurate, consistent with the verified content below, and not misleading or unsafe? The verified content already passed a full fact-check, so treat its numbers and wording as correct (the plan topic line is only an early summary and may be less precise). Use the web only to open a source when a packaging claim goes beyond the verified content. Give each problem a precise, copy-paste-ready `fix`.",
      plan_topic: item.plan.topic, verified_content: verifiedContent, verified_sources: sources, packaging,
    },
  });
}

/**
 * Packaging ⇄ checker loop: check, let the packaging writer apply the fixes, re-check (up to 2 revisions).
 * Only a HOLD verdict or unresolved major/critical issues hold the item for a human.
 */
export async function packagingLoop<P extends object>(item: ContentItem, packaging: P, sources: Source[], verifiedContent: object,
  revise: (current: P, fc: FactCheck) => Promise<P>, view: (p: P) => object = p => p): Promise<{ packaging: P; check: FactCheck; held: boolean; reason?: string }> {
  let pc = await checkPackaging(item, view(packaging), sources, verifiedContent);
  for (let round = 0; round < 2 && pc.verdict !== "HOLD" && pc.issues.length; round++) {
    log.info(`packaging check: ${pc.verdict} with ${pc.issues.length} fixes; revising (round ${round + 1})`);
    packaging = await revise(packaging, pc);
    if (pc.verdict === "PASS") return { packaging, check: pc, held: false }; // minor polish applied
    pc = await checkPackaging(item, view(packaging), sources, verifiedContent);
  }
  if (pc.verdict === "REVISE" && pc.issues.length && pc.issues.every(i => i.severity === "minor")) {
    packaging = await revise(packaging, pc);
    log.info(`packaging check: ${pc.issues.length} minor fixes applied after the final round; accepted`);
    return { packaging, check: { ...pc, verdict: "PASS" }, held: false };
  }
  const held = pc.verdict !== "PASS";
  log.info(`packaging check: ${pc.verdict}${held ? " (held for review)" : ""}`);
  return { packaging, check: pc, held, reason: held ? `Packaging check ${pc.verdict}: ${pc.summary}` : undefined };
}

export const dataPath = (...p: string[]) => join(DATA, ...p);
