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
