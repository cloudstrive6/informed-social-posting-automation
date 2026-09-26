import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA } from "../lib/config.js";
import { readText, writeJson, writeText } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { Learnings, learningsSchema } from "../lib/schemas.js";
import { igInsights } from "../publish/meta.js";
import { videoAnalytics, videoStats } from "../publish/youtube.js";

interface LogRow { at: string; date: string; id: string; kind: string; platform: string; format: string; slot: string; slotKey: string; status: string; remote_id?: string; title?: string; topic?: string; hook?: string; thumb_layout?: string; trend_stage?: string }

/** Pull metrics for recent posts and let the Performance Analyst rewrite the shared playbook (data/learnings.md). */
export async function runAnalytics() {
  const file = join(DATA, "published", "log.jsonl");
  if (!existsSync(file)) { log.warn("nothing published yet"); return; }
  const cutoff = Date.now() - 28 * 86400_000;
  const latest = new Map<string, LogRow>();
  for (const line of readFileSync(file, "utf8").split("\n").filter(Boolean)) {
    const r = JSON.parse(line) as LogRow;
    if ((r.status === "published" || r.status === "scheduled") && r.remote_id && Date.parse(r.slot) > cutoff && Date.parse(r.slot) < Date.now() - 24 * 3600_000) {
      latest.set(`${r.platform}:${r.remote_id}`, r);
    }
  }
  const rows = [...latest.values()];
  if (rows.length < 3) { log.info("not enough published posts (need ≥ 3 older than 24h) for analysis yet"); return; }

  const metrics: Record<string, any> = {};
  const yt = rows.filter(r => r.platform === "youtube").map(r => r.remote_id!);
  if (yt.length && process.env.YOUTUBE_REFRESH_TOKEN) {
    try {
      for (const v of await videoStats(yt)) metrics[`youtube:${v.id}`] = { ...v.statistics, duration: v.contentDetails?.duration };
      const end = new Date().toISOString().slice(0, 10), start = new Date(cutoff).toISOString().slice(0, 10);
      const a = await videoAnalytics(yt, start, end);
      for (const [id, m] of Object.entries(a)) metrics[`youtube:${id}`] = { ...metrics[`youtube:${id}`], ...m };
    } catch (e) { log.warn(`youtube metrics: ${(e as Error).message.slice(0, 200)}`); }
  }
  if (process.env.META_PAGE_ACCESS_TOKEN) {
    for (const r of rows.filter(r => r.platform === "instagram")) {
      const j = await igInsights(r.remote_id!);
      if (j?.data) metrics[`instagram:${r.remote_id}`] = Object.fromEntries(j.data.map((d: any) => [d.name, d.values?.[0]?.value ?? d.total_value?.value]));
    }
  }

  const dataset = rows.map(r => ({ ...r, metrics: metrics[`${r.platform}:${r.remote_id}`] ?? null }));
  const today = new Date().toISOString().slice(0, 10);
  writeJson(join(DATA, "analytics", `${today}.json`), dataset);

  const out = await runAgent<Learnings>({
    agent: "performance-analyst", model: config.models.analyst, schema: learningsSchema,
    input: { current_playbook: readText(join(DATA, "learnings.md")), schedule: config.schedule, timezone: config.audience.timezone, posts: dataset },
  });
  writeText(join(DATA, "learnings.md"),
    `${out.learnings_markdown.trim()}\n\n## Topics to double down on\n${out.topics_to_double_down.map(t => `- ${t}`).join("\n")}\n\n## Schedule suggestions (for the owner — edit config/channel.json to apply)\n${out.schedule_suggestions}\n\n_Updated ${today} from ${dataset.length} posts._\n`);
  log.info("learnings updated");
}
