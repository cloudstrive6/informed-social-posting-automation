/**
 * Local test for the retention / history transformations, on fixture data (no network, no credentials, nothing written).
 * Run: npm run test:analytics
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { changedSince, compactRow, lifetimeKeys } from "../src/analytics/analyze.js";
import { reachSourceName } from "../src/analytics/reach.js";
import { captureRetention, dueMilestones, holdAt, isoSeconds, retentionPath, readRetentionFile, retentionSummary, type Fetchers, type RetentionFile, type Table } from "../src/analytics/retention.js";

// a 14:03 long video: 100 points, steep fall in the first 10 %, a cliff at 40 %, slow fade
const long: Table = {
  cols: ["elapsedVideoTimeRatio", "audienceWatchRatio", "relativeRetentionPerformance"],
  rows: Array.from({ length: 100 }, (_, i) => {
    const x = (i + 1) / 100;
    let w = 1 - 0.5 * Math.min(x, 0.1) / 0.1 * 0.5 - 0.3 * x;
    if (x >= 0.4) w -= 0.12;
    return [x, Math.max(w, 0.05), 0.55];
  }),
};
const short: Table = { cols: ["elapsedVideoTimeRatio", "audienceWatchRatio"], rows: Array.from({ length: 100 }, (_, i) => [(i + 1) / 100, 0.9 - i / 200]) };
const detail = (type: string): Table => ({ cols: ["insightTrafficSourceDetail", "views", "estimatedMinutesWatched"], rows: type === "YT_SEARCH" ? [["tirzepatide vs semaglutide", 41, 120], ["zepbound", 9, 20]] : [["AAAAAAAAAAA", 30, 90], ["BBBBBBBBBBB", 5, 8]] });

const calls: string[] = [];
const f: Fetchers = {
  curve: async (id, s, e) => { calls.push(`curve ${id} ${s}..${e}`); return id.startsWith("S") ? short : long; },
  detail: async (id, type) => { calls.push(`detail ${id} ${type}`); return detail(type); },
  titles: async ids => Object.fromEntries(ids.map(i => [i, `Title of ${i}`])),
};

const files = new Map<string, any>();
const io = { read: (p: string) => files.get(p) as RetentionFile | undefined, write: (p: string, v: unknown) => { files.set(p, JSON.parse(JSON.stringify(v))); } };

assert.equal(isoSeconds("PT14M3S"), 843);
assert.equal(isoSeconds("PT45S"), 45);
assert.equal(isoSeconds("PT1H2M"), 3720);

const vids = [
  { id: "LONG0000001", format: "long", published: "2026-10-20", durationSec: 843 },  // 22 days old: day 7 due, day 28 not
  { id: "LONG0000002", format: "long", published: "2026-09-30", durationSec: 600 },  // 42 days old: both due
  { id: "SHORT000001", format: "short", published: "2026-11-01", durationSec: 40 }, // day 7 only
  { id: "LONG0000003", format: "long", published: "2026-11-08", durationSec: 700 },  // 4 days old: nothing due
];

const run1 = await (async () => captureRetention(vids, f, "2026-11-12", io))();
console.log("run 1", run1);
assert.equal(run1.captured.length, 4); // L1:d7, L2:d7, L2:d28, S:d7
const callsAfter1 = calls.length;
const run2 = await captureRetention(vids, f, "2026-11-13", io);
console.log("run 2 (nothing new, no API calls)", run2, "extra calls:", calls.length - callsAfter1);
assert.equal(run2.captured.length, 0);
assert.equal(calls.length, callsAfter1);
// day 28 of LONG0000001 becomes due 2026-11-19 (10-20 + 28 + 2 lag days = 11-19)
assert.deepEqual(dueMilestones(files.get(retentionPath("LONG0000001")), "long", "2026-10-20", "2026-11-18"), []);
assert.deepEqual(dueMilestones(files.get(retentionPath("LONG0000001")), "long", "2026-10-20", "2026-11-19"), [28]);

console.log("\nstored file for the long video (curve shortened to 12 points for printing):");
const stored = JSON.parse(JSON.stringify(files.get(retentionPath("LONG0000001"))));
stored.milestones.d7.curve_pct = stored.milestones.d7.curve_pct.filter((_: number, i: number) => i % 9 === 0);
stored.milestones.d7.relative_pct = stored.milestones.d7.relative_pct.slice(0, 3).concat(["..."]);
console.log(JSON.stringify(stored, null, 1));
const m = files.get(retentionPath("LONG0000001")).milestones.d7;
assert.equal(m.curve_pct.length, 100);
assert.equal(m.biggest_drop.at_pct, 40); // the cliff
assert.ok(m.hold_pct.s5 !== null && m.hold_pct.s60 !== null && m.hold_pct.s60 <= m.hold_pct.s15);
assert.equal(m.traffic_detail.YT_SEARCH[0].key, "tirzepatide vs semaglutide");
assert.equal(m.traffic_detail.RELATED_VIDEO[0].title, "Title of AAAAAAAAAAA");

const sh = files.get(retentionPath("SHORT000001")).milestones.d7;
console.log("\nShort (40 s) hold + drop:", sh.hold_pct, sh.biggest_drop, "traffic_detail:", sh.traffic_detail);
assert.equal(sh.hold_pct.s60, null); // video shorter than 60 s
assert.equal(sh.traffic_detail, undefined); // detail is long-form only
assert.equal(holdAt([0.5, 1], [90, 50], 100, 75), 70);

console.log("\nsummary that goes on the analytics row:\n", JSON.stringify(retentionSummary(files.get(retentionPath("LONG0000002"))), null, 1));

// API refused (403): stop for this run, nothing stored, no tries burnt
const files2 = new Map<string, any>();
const io2 = { read: (p: string) => files2.get(p), write: (p: string, v: unknown) => { files2.set(p, JSON.parse(JSON.stringify(v))); } };
const bad: Fetchers = { ...f, curve: async () => { throw new Error("HTTP 403 for reports: forbidden"); } };
const r3 = await captureRetention([vids[0], vids[1]], bad, "2026-11-12", io2);
console.log("refused API:", r3, "files stored:", files2.size);
assert.equal(files2.size, 0);
// no rows yet: counts a try, gives up after MAX_TRIES and stores an empty marker
const empty: Fetchers = { ...f, curve: async () => ({ cols: long.cols, rows: [] }) };
for (let i = 0; i < 4; i++) await captureRetention([vids[0]], empty, "2026-11-12", io2);
const rec = files2.get(retentionPath("LONG0000001"));
console.log("empty curve x4:", rec.tries, Object.keys(rec.milestones));
assert.equal(rec.tries.d7, 3);
assert.equal(rec.milestones.d7.empty, true);

// default reader on a real temp folder: missing file, corrupt file, good file
const dir = mkdtempSync(join(tmpdir(), "ret-"));
assert.equal(readRetentionFile(join(dir, "nope.json")), undefined);
writeFileSync(join(dir, "bad.json"), "{not json");
assert.equal(readRetentionFile(join(dir, "bad.json")), undefined);
writeFileSync(join(dir, "ok.json"), JSON.stringify(files.get(retentionPath("SHORT000001"))));
assert.equal(readRetentionFile(join(dir, "ok.json"))?.video_id, "SHORT000001");
rmSync(dir, { recursive: true });
console.log("default reader: missing, corrupt and good files all handled");

// 365-day history rows
const old = { at: "x", date: "2026-10-14", id: "L1", platform: "youtube", format: "long", slot: "2026-10-14T18:00:00.000Z", remote_id: "OLD", url: "u", hook: "long hook text", topic: "t".repeat(300), title: "Did EloraTZP Beat Tirzepatide?", metrics: { viewCount: "3000", views: 0, ...lifetimeKeys({ video: "OLD", views: 3000, estimatedMinutesWatched: 1619, subscribersGained: 7 }) } };
const c = compactRow(old);
console.log("\ncompact old row:", JSON.stringify(c).slice(0, 420), "... bytes", JSON.stringify(c).length, "vs", JSON.stringify(old).length);
assert.ok(!("hook" in c) && !("url" in c) && c.topic.length === 140 && c.metrics.life_views === 3000);

// freshness
const prev = [{ platform: "youtube", remote_id: "OLD", metrics: { viewCount: "3000", views: 0, life_views: 3000 } }];
console.log("freshness same:", changedSince(prev, [c]), "moved:", changedSince(prev, [{ ...c, metrics: { ...c.metrics, life_views: 3100 } }]));

assert.equal(reachSourceName("5"), "YT_SEARCH");
assert.equal(reachSourceName("24"), "SHORTS");
assert.equal(reachSourceName("99"), "src_99");
assert.equal(reachSourceName("shorts"), "SHORTS");
console.log("\nALL OK");
