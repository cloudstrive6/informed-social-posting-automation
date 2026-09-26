import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { Radar, radarSchema } from "../lib/schemas.js";
import { collectSignals } from "./sources.js";

const RADAR_DIR = join(DATA, "radar");

function snapshots(): string[] {
  try { return readdirSync(RADAR_DIR).filter(f => /^\d{4}-\d{2}-\d{2}T\d{2}\.json$/.test(f)).sort(); } catch { return []; }
}

/** How often each topic appeared in recent snapshots and how its momentum moved — the acceleration signal. */
function recentHistory() {
  const rows = new Map<string, { topic: string; seen: number; momentum: number[]; stage: string }>();
  for (const f of snapshots().slice(-12)) {
    const r = readJson<Radar & { at: string }>(join(RADAR_DIR, f));
    for (const c of r.candidates) {
      const k = c.topic.toLowerCase().slice(0, 60);
      const row = rows.get(k) ?? { topic: c.topic, seen: 0, momentum: [], stage: c.stage };
      row.seen++; row.momentum.push(c.momentum); row.stage = c.stage;
      rows.set(k, row);
    }
  }
  return [...rows.values()].sort((a, b) => b.seen - a.seen).slice(0, 40);
}

export async function runRadar() {
  log.step("Trend radar: collecting signals");
  const signals = await collectSignals();
  log.info(`${signals.length} unique signals`);

  const radar = await runAgent<Radar>({
    agent: "trend-scout",
    model: config.models.trendScout,
    web: true,
    schema: radarSchema,
    input: {
      collected_at: new Date().toISOString(),
      audience: config.audience.description,
      previous_snapshots: recentHistory(),
      signals,
    },
  });

  const at = new Date().toISOString();
  const stamp = at.slice(0, 13);
  writeJson(join(RADAR_DIR, `${stamp}.json`), { at, ...radar });
  writeJson(join(RADAR_DIR, "latest.json"), { at, ...radar });

  // keep ~14 days of snapshots
  const all = snapshots();
  for (const f of all.slice(0, Math.max(0, all.length - 14 * 6))) rmSync(join(RADAR_DIR, f));

  log.info(`Radar: ${radar.candidates.length} candidates. Top: ${radar.candidates.slice(0, 3).map(c => `${c.topic} [${c.stage} ${c.momentum}]`).join(" | ")}`);
  return radar;
}
