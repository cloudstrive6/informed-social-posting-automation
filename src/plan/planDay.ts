import { appendFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA } from "../lib/config.js";
import { queueDir } from "../lib/items.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { DayPlan, planSchema, Radar, TopicScreen, topicScreenSchema } from "../lib/schemas.js";

export interface CoveredTopic { date: string; kind: string; topic: string; angle: string; title?: string }
export const coveredPath = join(DATA, "published", "topics.json");

export async function planDay(date: string): Promise<DayPlan> {
  log.step(`Planning ${date}`);
  const radar = readJson<Radar & { at?: string }>(join(DATA, "radar", "latest.json"), { summary: "No radar yet", candidates: [] });
  const covered = readJson<CoveredTopic[]>(coveredPath, []).filter(c => Date.parse(c.date) > Date.now() - 45 * 86400_000);
  const quota = { long: config.cadence.longPerDay, short: config.cadence.shortPerDay, carousel: config.cadence.carouselPerDay };

  let plan = await runAgent<DayPlan>({
    agent: "content-strategist",
    schema: planSchema,
    input: { date, quota, pillars: (config.youtube?.playlists ?? []).map(p => ({ pillar: p.pillar, playlist: p.title })), radar_generated_at: radar.at, radar: radar.candidates.filter(c => c.safety !== "reject"), recently_covered: covered },
  });

  // Fact-checker screens topics before any production money/time is spent. Rejected slots get re-planned once.
  for (let round = 0; round < 2; round++) {
    const screen = await runAgent<TopicScreen>({
      agent: "fact-checker",
      model: config.models.factChecker,
      web: true,
      maxTurns: 25,
      schema: topicScreenSchema,
      input: { mode: "topic_screen", topics: plan.pieces.map(p => ({ id: p.id, kind: p.kind, topic: p.topic, angle: p.angle, working_title: p.working_title })) },
    });
    const byId = new Map(screen.decisions.map(d => [d.id, d]));
    const rejected = plan.pieces.filter(p => byId.get(p.id)?.verdict === "reject");
    for (const p of plan.pieces) {
      const d = byId.get(p.id);
      if (d?.verdict === "modify" && d.safer_angle) { p.angle = d.safer_angle; p.why += ` | fact-check: ${d.notes}`; }
    }
    if (!rejected.length) break;
    log.warn(`Fact-checker rejected: ${rejected.map(r => `${r.id} "${r.topic}" (${byId.get(r.id)?.notes})`).join("; ")}`);
    if (round === 1) { plan.pieces = plan.pieces.filter(p => !rejected.includes(p)); break; }
    const replacement = await runAgent<DayPlan>({
      agent: "content-strategist",
      schema: planSchema,
      input: {
        date, task: "Replace ONLY the rejected pieces. Return just the replacement pieces with the same ids.",
        rejected: rejected.map(r => ({ ...r, reason: byId.get(r.id)?.notes })),
        keep: plan.pieces.filter(p => !rejected.includes(p)),
        radar: radar.candidates.filter(c => c.safety === "ok"),
        recently_covered: covered,
      },
    });
    const repl = new Map(replacement.pieces.map(p => [p.id, p]));
    plan.pieces = plan.pieces.map(p => repl.get(p.id) ?? p);
  }

  writeJson(join(queueDir(date), "plan.json"), { date, created_at: new Date().toISOString(), ...plan });
  log.info(`Plan: ${plan.pieces.map(p => `${p.id}: ${p.working_title}`).join(" | ")}`);
  emitMatrix(plan);
  return plan;
}

/** Expose ids to GitHub Actions as job matrices. */
function emitMatrix(plan: DayPlan) {
  const out = process.env.GITHUB_OUTPUT;
  const ids = (k: string) => JSON.stringify(plan.pieces.filter(p => p.kind === k).map(p => p.id));
  const lines = `long=${ids("long")}\nshort=${ids("short")}\ncarousel=${ids("carousel")}\n`;
  if (out) appendFileSync(out, lines); else log.info(lines.trim());
}

/**
 * Replacement long video: the day's long video was dropped (or failed), so plan ONE new long piece, add it to the
 * day's plan under the next free id (L2, L3…) and expose only that id to the production matrix. The rest of the
 * day's plan and items are left untouched.
 */
export async function planReplacementLong(date: string): Promise<DayPlan> {
  log.step(`Planning a replacement long video for ${date}`);
  const planFile = join(queueDir(date), "plan.json");
  const existing = readJson<DayPlan & { date: string; created_at: string }>(planFile, { date, created_at: new Date().toISOString(), pieces: [] } as any);
  const { loadItems } = await import("../lib/items.js");
  const dropped = loadItems([date]).filter(i => i.kind === "long" && i.status !== "ready")
    .map(i => ({ id: i.id, title: i.package.title ?? i.plan.working_title, topic: i.plan.topic, why_dropped: i.hold_reason ?? i.status }));
  const radar = readJson<Radar & { at?: string }>(join(DATA, "radar", "latest.json"), { summary: "No radar yet", candidates: [] });
  const covered = readJson<CoveredTopic[]>(coveredPath, []).filter(c => Date.parse(c.date) > Date.now() - 45 * 86400_000);
  const used = new Set(existing.pieces.map(p => p.id));
  let n = 2; while (used.has(`L${n}`)) n++;
  const id = `L${n}`;

  let piece: DayPlan["pieces"][number] | undefined;
  for (let round = 0; round < 2 && !piece; round++) {
    const r = await runAgent<DayPlan>({
      agent: "content-strategist", schema: planSchema,
      input: {
        date, task: `REPLACEMENT: today's long-form video was dropped by the fact-check/editorial review (see dropped). Plan exactly ONE new long-form piece with id "${id}". It must be within the current channel focus, NOT repeat the dropped topic or today's other pieces, and be easy to verify from strong primary sources (evergreen explainer > fast-moving news) so it passes the fact-checker first time. Avoid attributing claims to sources unless the source clearly says it.`,
        dropped, todays_other_pieces: existing.pieces.filter(p => p.kind !== "long").map(p => ({ id: p.id, kind: p.kind, working_title: p.working_title })),
        pillars: (config.youtube?.playlists ?? []).map(p => ({ pillar: p.pillar, playlist: p.title })),
        radar: radar.candidates.filter(c => c.safety === "ok"), recently_covered: covered,
      },
    });
    const cand = r.pieces.find(p => p.kind === "long") ?? r.pieces[0];
    if (!cand) continue;
    cand.id = id; cand.kind = "long";
    const screen = await runAgent<TopicScreen>({
      agent: "fact-checker", model: config.models.factChecker, web: true, maxTurns: 25, schema: topicScreenSchema,
      input: { mode: "topic_screen", topics: [{ id: cand.id, kind: cand.kind, topic: cand.topic, angle: cand.angle, working_title: cand.working_title }] },
    });
    const d = screen.decisions.find(x => x.id === id);
    if (d?.verdict === "reject") { log.warn(`replacement topic rejected: ${cand.topic} (${d.notes})`); dropped.push({ id, title: cand.working_title, topic: cand.topic, why_dropped: `topic screen: ${d.notes}` }); continue; }
    if (d?.verdict === "modify" && d.safer_angle) { cand.angle = d.safer_angle; cand.why += ` | fact-check: ${d.notes}`; }
    piece = cand;
  }
  if (!piece) throw new Error("no replacement long topic passed the topic screen");
  const plan = { ...existing, pieces: [...existing.pieces, piece] };
  writeJson(planFile, plan);
  log.info(`Replacement long: ${id}: ${piece.working_title}`);
  emitMatrix({ ...plan, pieces: [piece] });
  return plan;
}
