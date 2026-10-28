/**
 * Growth Strategist (weekly, growth.yml): judges whether production is moving the channel toward the Partner Program
 * and $1,000/day, rewrites data/growth-playbook.md (read by every agent), tracks experiments, and reports on Telegram.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA, ROOT } from "../lib/config.js";
import { readJson, readText, writeJson, writeText } from "../lib/fsx.js";
import { loadItems } from "../lib/items.js";
import { log } from "../lib/log.js";
import { addDays, localDate } from "../lib/time.js";

interface Experiment { name: string; hypothesis: string; change: string; metric: string; min_sample: string; status: "running" | "won" | "lost" | "inconclusive"; result: string }
interface GrowthReview { verdict: "on_track" | "behind" | "off_track"; summary: string; bottleneck: string; playbook_markdown: string; experiments: Experiment[]; owner_decisions: string[] }

const str = { type: "string" } as const;
const schema = {
  type: "object", additionalProperties: false, required: ["verdict", "summary", "bottleneck", "playbook_markdown", "experiments", "owner_decisions"],
  properties: {
    verdict: { enum: ["on_track", "behind", "off_track"] }, summary: str, bottleneck: str, playbook_markdown: str,
    experiments: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "hypothesis", "change", "metric", "min_sample", "status", "result"],
      properties: { name: str, hypothesis: str, change: str, metric: str, min_sample: str, status: { enum: ["running", "won", "lost", "inconclusive"] }, result: str } } },
    owner_decisions: { type: "array", items: str },
  },
};

const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };

function performance() {
  const dir = join(DATA, "analytics");
  const latest = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(".json")).sort().pop() : undefined;
  if (!latest) return { posts: [], medians: {} };
  const rows = JSON.parse(readFileSync(join(dir, latest), "utf8")) as any[];
  const since = addDays(localDate(config.audience.timezone), -28);
  const posts = rows.filter(r => r.date >= since).map(r => ({
    date: r.date, kind: r.kind, platform: r.platform, title: r.title, topic: r.topic, trend_stage: r.trend_stage, slot: r.slot,
    views: Number(r.metrics?.viewCount ?? r.metrics?.views ?? r.metrics?.reach ?? 0) || 0,
    minutes: r.metrics?.estimatedMinutesWatched ?? null, avg_view_pct: r.metrics?.averageViewPercentage ?? null, subs: r.metrics?.subscribersGained ?? null,
    impressions: r.metrics?.impressions ?? null, ctr_pct: r.metrics?.impressions_ctr_pct ?? null,
    traffic: r.metrics?.traffic_sources ? Object.fromEntries(Object.entries(r.metrics.traffic_sources as Record<string, { views: number }>).map(([k, v]) => [k, v.views])) : null,
  }));
  const medians: Record<string, number | null> = {};
  for (const k of ["long", "short", "carousel"]) for (const p of ["youtube", "instagram", "tiktok", "facebook", "threads"]) {
    const v = posts.filter(x => x.kind === k && x.platform === p).map(x => x.views);
    if (v.length) medians[`${k}:${p}`] = median(v);
  }
  return { snapshot: latest, posts, medians };
}

function production() {
  const today = localDate(config.audience.timezone);
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, -i));
  const items = loadItems(dates);
  const produced = new Set(items.map(i => i.date));
  return {
    days_without_content: dates.filter(d => !produced.has(d) && d < today),
    items: items.map(i => ({ date: i.date, id: i.id.split("-")[0], kind: i.kind, status: i.status, title: i.package.title ?? i.plan.working_title, why_held: i.status !== "ready" ? (i.hold_reason ?? "").slice(0, 220) : undefined })),
  };
}

export async function runGrowthReview() {
  log.step("GROWTH REVIEW");
  let progress = readJson<any>(join(DATA, "usage", "ypp.json"), null);
  try { const { partnerProgress } = await import("../publish/youtube.js"); progress = await partnerProgress(); writeJson(join(DATA, "usage", "ypp.json"), progress); }
  catch (e) { log.warn(`partner progress unavailable: ${(e as Error).message.slice(0, 160)}`); }
  const historyFile = join(DATA, "usage", "ypp-history.jsonl");
  const history = existsSync(historyFile) ? readFileSync(historyFile, "utf8").trim().split("\n").filter(Boolean).map(l => JSON.parse(l)).slice(-60) : [];
  const expFile = join(DATA, "growth", "experiments.json");
  const out = await runAgent<GrowthReview>({
    agent: "growth-strategist", model: config.models.analyst, schema, effort: "high", web: true, maxTurns: 40,
    input: {
      today: localDate(config.audience.timezone),
      growth_plan: readText(join(ROOT, "docs", "GROWTH-PLAN.md")),
      current_playbook: readText(join(DATA, "growth-playbook.md"), "_none yet_"),
      experiments: readJson<Experiment[]>(expFile, []),
      partner_progress: progress, partner_history: history,
      performance: performance(), analyst_learnings: readText(join(DATA, "learnings.md"), ""),
      production: production(),
      config: { focus: config.niche?.enabled ? config.niche.name : "general health", cadence: config.cadence, schedule: config.schedule, spacing: config.spacing },
    },
  });
  const today = new Date().toISOString().slice(0, 10);
  writeText(join(DATA, "growth-playbook.md"), `# Growth playbook (Growth Strategist, ${today})\n\n_Verdict: ${out.verdict.replace("_", " ")}. Bottleneck: ${out.bottleneck}_\n\n${out.playbook_markdown.trim()}\n`);
  writeJson(expFile, out.experiments);
  writeJson(join(DATA, "growth", `review-${today}.json`), out);
  const { notify } = await import("../notify/telegram.js");
  const esc = (t: string) => t.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
  const icon = { on_track: "🟢", behind: "🟡", off_track: "🔴" }[out.verdict];
  await notify([
    `${icon} <b>Weekly growth review: ${out.verdict.replace("_", " ")}</b>`, esc(out.summary),
    ...(out.experiments.filter(e => e.status === "running").length ? ["", "<b>Experiments running:</b>", ...out.experiments.filter(e => e.status === "running").map(e => `• ${esc(e.name)}: ${esc(e.metric)}`)] : []),
    ...(out.owner_decisions.length ? ["", "<b>Decisions for you:</b>", ...out.owner_decisions.map(d => `• ${esc(d)}`)] : []),
  ].join("\n"));
  log.info(`growth review: ${out.verdict} — ${out.bottleneck}`);
}
