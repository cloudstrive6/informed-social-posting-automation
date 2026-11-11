/**
 * Local test for the watchdog's same-day restart after a Claude stop (claudeRetryTarget in src/ops/watchdog.ts).
 * Built from the real 2026-11-11 timeline: the run failed at 06:50 UTC on the weekly limit with the backup key
 * empty, scheduled backups exited on the duplicate guard, and a manual run at 12:19 UTC succeeded.
 * No network, nothing written. Run: npm run test:watchdog
 */
import assert from "node:assert/strict";
import { claudeRetryTarget, isClaudeDownLog, type Run } from "../src/ops/watchdog.js";

const DOWN_LOG = "Error: You've hit your weekly limit (resets Nov 15, 7pm (UTC))\nAPI fallback: Credit balance is too low to access the Anthropic API";
const OTHER_LOG = "Error: ffmpeg exited with code 1";

const run = (id: number, createdAt: string, updatedAt: string, status: string, conclusion: string, extra: Partial<Run> = {}): Run =>
  ({ databaseId: id, createdAt, updatedAt, status, conclusion, event: "workflow_dispatch", attempt: 1, displayTitle: "Daily production", ...extra });

const prevDay = run(42801013526, "2026-11-10T10:39:36Z", "2026-11-10T10:42:28Z", "completed", "success", { event: "schedule" });
const cancelled = run(42950881849, "2026-11-11T03:09:46Z", "2026-11-11T04:10:07Z", "completed", "cancelled");
const failed = run(42971194048, "2026-11-11T06:15:48Z", "2026-11-11T06:50:52Z", "completed", "failure");
const guard1 = run(42991179676, "2026-11-11T08:57:48Z", "2026-11-11T08:58:14Z", "completed", "success", { event: "schedule" });
const guard2 = run(43000986064, "2026-11-11T10:07:47Z", "2026-11-11T10:08:10Z", "completed", "success", { event: "schedule" });
const manualOk = run(43019369471, "2026-11-11T12:19:42Z", "2026-11-11T17:13:50Z", "completed", "success");
const replacement = run(43066509480, "2026-11-11T17:16:16Z", "2026-11-11T19:20:57Z", "completed", "failure", { displayTitle: "Replacement long video 2026-11-11" });

const D = "2026-11-11";
const logs: Record<number, string> = { [failed.databaseId]: DOWN_LOG, [replacement.databaseId]: DOWN_LOG };
const logOf = (r: Run) => logs[r.databaseId] ?? OTHER_LOG;
let calls = 0;
const counting = (r: Run) => { calls++; return logOf(r); };

assert.ok(isClaudeDownLog(DOWN_LOG));
assert.ok(!isClaudeDownLog("You've hit your weekly limit"), "subscription cap alone: the backup key still works");
assert.ok(!isClaudeDownLog(OTHER_LOG));

// at 11:00 UTC (before the manual run): the failed run is the target, despite the newer duplicate-guard exits
const before = [guard2, guard1, failed, cancelled, prevDay];
assert.equal(claudeRetryTarget(before, D, logOf)?.databaseId, failed.databaseId);

// the failed run is still found after 12 h (the main loop only looks back 12 h)
assert.equal(claudeRetryTarget([failed, cancelled, prevDay], D, logOf)?.databaseId, failed.databaseId);

// a re-run in progress: nothing to do
assert.equal(claudeRetryTarget([{ ...failed, status: "in_progress", conclusion: "" }, cancelled], D, logOf), undefined);

// after the manual success: nothing to do; a later failed replacement long video does not count
assert.equal(claudeRetryTarget([replacement, manualOk, guard2, guard1, failed], D, logOf), undefined);

// a failure for another reason is left to the normal re-run and escalation path
assert.equal(claudeRetryTarget([{ ...failed, databaseId: 1 }], D, logOf), undefined);

// another content date: the 2026-11-11 failure is not retried for 2026-11-12 (started 22:00 New York on 11-11)
assert.equal(claudeRetryTarget(before, "2026-11-12", logOf), undefined);
// a run started 17:30 New York (22:30 UTC) belongs to that day; 18:30 New York (23:30 UTC) to the next
assert.equal(claudeRetryTarget([run(7, "2026-11-11T22:30:00Z", "2026-11-11T22:40:00Z", "completed", "failure")], D, () => DOWN_LOG)?.databaseId, 7);
assert.equal(claudeRetryTarget([run(8, "2026-11-11T23:30:00Z", "2026-11-11T23:40:00Z", "completed", "failure")], D, () => DOWN_LOG), undefined);

// logs are read for the newest run only
calls = 0;
claudeRetryTarget(before, D, counting);
assert.equal(calls, 1);

console.log("watchdog self-test: all checks passed");
