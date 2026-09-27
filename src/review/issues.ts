import { join } from "node:path";
import { ROOT } from "../lib/config.js";
import { ContentItem, itemPath, saveItem } from "../lib/items.js";
import { ensureDir, readJson, writeText } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { run } from "../media/exec.js";
import { notify, runUrl } from "../notify/telegram.js";

const gh = (args: string[]) => run("gh", args, { quiet: true });
const marker = (item: ContentItem) => `<!-- informed-item:${item.date}/${item.id} -->`;

async function ensureLabels() {
  for (const [name, color, desc] of [
    ["needs-review", "fbca04", "Held by the fact-checker; needs a human decision"],
    ["approved", "0e8a16", "Approve held content for publishing"],
    ["rejected", "b60205", "Do not publish this content"],
    ["pipeline-failure", "d93f0b", "An automated job failed"],
  ]) {
    await gh(["label", "create", name, "--color", color, "--description", desc, "--force"]).catch(() => undefined);
  }
}

/** Open a GitHub issue so the owner can approve/reject held content from their phone. */
export async function openReviewIssue(item: ContentItem): Promise<number | undefined> {
  await ensureLabels();
  const fc = item.factcheck;
  const repo = process.env.GITHUB_REPOSITORY;
  const assets = item.release_tag && repo ? `https://github.com/${repo}/releases/tag/${item.release_tag}` : "(see release)";
  const body = [
    marker(item),
    `**${item.kind.toUpperCase()}** for ${item.date} — ${item.plan.topic}`,
    `**Proposed title:** ${item.package.title ?? item.plan.working_title}`,
    `**Why it was held:** ${item.hold_reason ?? "n/a"}`,
    "", "### Fact-checker findings",
    ...(fc?.issues ?? []).map(i => `- **${i.severity}** (${i.location}): ${i.claim}\n  - Problem: ${i.problem}\n  - Suggested fix: ${i.fix}`),
    "", `### Media\n${assets}`,
    "", "### Your decision",
    "- Add the label **`approved`** to publish as-is (it goes out at the next publisher run).",
    "- Add the label **`rejected`** to drop it.",
  ].join("\n");
  const file = join(ensureDir(join(ROOT, ".cache", "tmp")), `issue-${item.id}.md`);
  writeText(file, body);
  const out = await gh(["issue", "create", "--title", `Review: ${item.package.title ?? item.plan.working_title}`, "--label", "needs-review", "--body-file", file]);
  const num = Number(out.trim().split("/").pop());
  log.info(`review issue #${num} opened for ${item.id}`);
  return Number.isFinite(num) ? num : undefined;
}

/** Apply approve/reject labels from GitHub issues back onto queued items. */
export async function syncReviews() {
  for (const label of ["approved", "rejected"] as const) {
    const list = JSON.parse(await gh(["issue", "list", "--state", "open", "--label", label, "--json", "number,body", "--limit", "100"]));
    for (const issue of list) {
      const m = /informed-item:(\d{4}-\d{2}-\d{2})\/([^\s]+) -->/.exec(issue.body ?? "");
      if (!m) continue;
      const item = readJson<ContentItem>(itemPath(m[1], m[2]));
      if (label === "approved") {
        item.status = "ready"; item.approved_by = `issue #${issue.number}`;
        for (const p of item.posts) if (p.status === "held") p.status = "pending";
      } else {
        item.status = "held";
        for (const p of item.posts) if (p.status === "held" || p.status === "pending") p.status = "skipped";
      }
      saveItem(item);
      await gh(["issue", "close", String(issue.number), "--comment", label === "approved" ? "✅ Approved — queued for the next publisher run." : "🛑 Rejected — will not be published."]);
      log.info(`${item.id}: ${label}`);
    }
  }
}

export async function reportFailure(title: string, details: string) {
  try {
    await ensureLabels();
    const file = join(ensureDir(join(ROOT, ".cache", "tmp")), `fail-${Date.now()}.md`);
    const run_url = process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : "";
    writeText(file, `${details}\n\n${run_url}`);
    await gh(["issue", "create", "--title", title, "--label", "pipeline-failure", "--body-file", file]);
  } catch (e) { log.warn(`could not open failure issue: ${(e as Error).message}`); }
  const plain = details.replace(/```/g, "").replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!)).slice(0, 1500);
  await notify(`🚨 <b>${title.replace(/[<>&]/g, "")}</b>\n\n<pre>${plain}</pre>${runUrl() ? `\n<a href="${runUrl()}">Open the run</a>` : ""}`);
}
