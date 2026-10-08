/**
 * Ops Engineer: a Claude agent with shell access to this repo (inside ops.yml) that diagnoses an incident the
 * watchdog couldn't fix, unblocks it, fixes the cause in code when it's a bug, and reports on Telegram.
 */
import { config, ROOT } from "../lib/config.js";
import { runAgent } from "../lib/agent.js";
import { log } from "../lib/log.js";

interface Outcome { status: "fixed" | "mitigated" | "needs_owner" | "no_action"; summary: string; actions_taken: string[]; commits: string[]; owner_action: string }

const schema = {
  type: "object", additionalProperties: false, required: ["status", "summary", "actions_taken", "commits", "owner_action"],
  properties: {
    status: { enum: ["fixed", "mitigated", "needs_owner", "no_action"] },
    summary: { type: "string" },
    actions_taken: { type: "array", items: { type: "string" } },
    commits: { type: "array", items: { type: "string" } },
    owner_action: { type: "string", description: "What the owner must do, or empty" },
  },
};

export async function opsDoctor(incident: string) {
  if (!incident.trim()) throw new Error("no incident given (INCIDENT env)");
  log.step(`OPS ENGINEER: ${incident.split("\n")[0]}`);
  const { notify } = await import("../notify/telegram.js");
  const esc = (t: string) => t.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
  const run = process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : "";
  let out: Outcome;
  try {
    out = await runAgent<Outcome>({
      agent: "ops-engineer", model: config.models.default, schema, effort: "high", maxTurns: 150, cwd: ROOT,
      tools: ["Bash", "Read", "Edit", "Write", "Grep", "Glob"], web: true,
      input: { incident, now_utc: new Date().toISOString(), audience_timezone: config.audience.timezone, run },
    });
  } catch (e) {
    await notify(`🚧 <b>Blocker the Ops Engineer couldn't handle</b>\n${esc(incident.split("\n")[0])}\n\n${esc((e as Error).message.slice(0, 500))}${run ? `\n${run}` : ""}`);
    throw e;
  }
  const icon = { fixed: "✅", mitigated: "🩹", needs_owner: "🙋", no_action: "ℹ️" }[out.status];
  await notify([
    `${icon} <b>Ops Engineer: ${esc(out.status.replace("_", " "))}</b>`,
    esc(incident.split("\n")[0]),
    "", esc(out.summary),
    ...(out.owner_action ? ["", `<b>You need to:</b> ${esc(out.owner_action)}`] : []),
    ...(out.commits.length ? ["", `Code fix: ${esc(out.commits.join(", "))}`] : []),
    ...(run ? ["", run] : []),
  ].join("\n"), { silent: out.status === "fixed" || out.status === "no_action" });
  log.info(`ops engineer: ${out.status} — ${out.summary}`);
}
