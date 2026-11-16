/**
 * Local test for the channel's first comment on long videos (src/publish/firstComment.ts): template rules, subject
 * pick, daily rotation, which videos are due, and idempotency across passes. Fake API, no network, nothing written.
 * Run: npm run test:firstcomment
 */
import assert from "node:assert/strict";
import { cleanViewerText } from "../src/lib/text.js";
import {
  BANNED_COMMENT_WORDS, COMMENT_TEMPLATES, FIRST_COMMENT_FROM, MAX_COMMENT_ATTEMPTS,
  dueFirstComments, firstCommentText, mainSubject, runFirstComments, type CommentApi, type CommentState,
} from "../src/publish/firstComment.js";

// ---- template rules: every version, with every subject the code can insert, passes the text checks
const REQUIRED_BANNED = ["dose", "dosing", "switch", "stop", "side effect", "your results"];
for (const w of REQUIRED_BANNED) assert.ok(BANNED_COMMENT_WORDS.includes(w), `banned list has "${w}"`);
assert.ok(COMMENT_TEMPLATES.length >= 6 && COMMENT_TEMPLATES.length <= 8, "6 to 8 templates");
const subjects = ["semaglutide", "tirzepatide", "liraglutide", "dulaglutide", "orforglipron", "retatrutide", "survodutide", "CagriSema", "cagrilintide", "petrelintide", "mazdutide", "amycretin", "GLP-1"];
const all = COMMENT_TEMPLATES.flatMap(t => [t.generic, ...subjects.map(s => t.withSubject(s))]);
for (const text of all) {
  assert.equal(cleanViewerText(text), text, `viewer-text cleaner changes nothing: ${text}`);
  assert.ok(!/[\u2013\u2014]/.test(text), `no en or em dash: ${text}`);
  for (const w of BANNED_COMMENT_WORDS) assert.ok(!text.toLowerCase().includes(w), `"${w}" in: ${text}`);
  assert.ok(/\?/.test(text), `asks a question: ${text}`);
  assert.ok(text.length < 200, `short: ${text}`);
}
assert.equal(new Set(COMMENT_TEMPLATES.map(t => t.generic)).size, COMMENT_TEMPLATES.length, "templates are distinct");

// ---- subject: first drug named in the title, then topic; brands map to the generic name; GLP-1 fallback; else none
const it = (title: string, topic = "") => ({ package: { title }, plan: { topic, working_title: "" } } as any);
assert.equal(mainSubject(it("Tirzepatide (Mounjaro) Nausea: Foods That May Help")), "tirzepatide");
assert.equal(mainSubject(it("Mounjaro vs Ozempic: what the trials show")), "tirzepatide", "earliest name in the title wins");
assert.equal(mainSubject(it("Wegovy and your heart")), "semaglutide");
assert.equal(mainSubject(it("Why food noise fades", "semaglutide and appetite")), "semaglutide", "topic when the title names none");
assert.equal(mainSubject(it("What GLP-1 does in your gut")), "GLP-1");
assert.equal(mainSubject(it("Plague explained", "Yersinia pestis")), undefined);

// ---- deterministic, rotated by content date: 8 days in a row use 8 different templates
const longItem = (date: string, title = "Tirzepatide: How Does It Actually Work?") => ({ date, plan: { topic: "", working_title: "" }, package: { title } } as any);
assert.equal(firstCommentText(longItem("2026-11-17")), firstCommentText(longItem("2026-11-17")));
const week = Array.from({ length: COMMENT_TEMPLATES.length }, (_, i) => firstCommentText(longItem(`2026-11-${String(17 + i).padStart(2, "0")}`)));
assert.equal(new Set(week).size, COMMENT_TEMPLATES.length, "a full rotation uses every template once");
assert.ok(week.every(t => t.includes("tirzepatide")));
assert.ok(!firstCommentText(longItem("2026-11-17", "Plague explained")).includes("undefined"));

// ---- which videos are due
const NOW = Date.parse("2026-11-18T20:00:00Z");
const mk = (id: string, over: any = {}, post: any = {}): any => ({
  id, date: "2026-11-18", kind: "long", status: "ready", plan: { topic: "", working_title: "" }, package: { title: "Semaglutide and the heart" }, ...over,
  posts: [{ platform: "youtube", format: "long", slotKey: "long", slot: "2026-11-18T19:00:00Z", status: "scheduled", attempts: 1, remote_id: `yt-${id}`, ...post }],
});
const items = [
  mk("L1"),
  mk("old", { date: "2026-11-16" }),                              // before the feature ships
  mk("short", { kind: "short" }, { format: "short" }),             // Shorts never
  mk("held", { status: "held" }),                                  // held
  mk("future", {}, { slot: "2026-11-19T19:00:00Z" }),              // not live yet
  mk("done", {}, { first_comment_id: "c-done" }),                  // already commented (post field)
  mk("noid", {}, { remote_id: undefined, status: "pending" }),     // never uploaded
];
assert.ok(FIRST_COMMENT_FROM === "2026-11-17");
assert.deepEqual(dueFirstComments(items, {}, NOW).map(d => d.item.id), ["L1"]);
assert.deepEqual(dueFirstComments(items, { "yt-L1": { item: "x", comment_id: "c1", attempts: 1 } }, NOW).length, 0, "state record blocks a second comment");
assert.deepEqual(dueFirstComments(items, { "yt-L1": { item: "x", attempts: MAX_COMMENT_ATTEMPTS } }, NOW).length, 0, "3 failed attempts: give up");
assert.equal(dueFirstComments(items, { "yt-L1": { item: "x", attempts: 1, last_try: new Date(NOW - 10 * 60_000).toISOString() } }, NOW).length, 0, "retry waits about an hour");
assert.equal(dueFirstComments(items, { "yt-L1": { item: "x", attempts: 1, last_try: new Date(NOW - 61 * 60_000).toISOString() } }, NOW).length, 1);

// ---- runs: posts once, never twice; private videos use no attempt; failures stop after 3; existing comment is adopted
function harness(opts: { privacy?: string; failPost?: string; existing?: string } = {}) {
  let state: CommentState = {};
  const calls = { info: 0, find: 0, post: 0 };
  const api: CommentApi = {
    info: async ids => { calls.info++; return Object.fromEntries(ids.map(id => [id, { privacyStatus: opts.privacy ?? "public", uploadStatus: "processed" }])); },
    find: async () => { calls.find++; return opts.existing; },
    post: async () => { calls.post++; if (opts.failPost) throw new Error(opts.failPost); return "thread-1"; },
  };
  const fresh = () => [mk("L1")];
  const run = (its: any[], now: number) => runFirstComments({ items: its, api, now, loadState: () => JSON.parse(JSON.stringify(state)), saveState: s => { state = JSON.parse(JSON.stringify(s)); } });
  return { calls, run, fresh, state: () => state };
}

{ // happy path, then a rerun with a fresh copy of the item (as if the queue file was rewritten): no second post
  const h = harness();
  const its = h.fresh();
  const r1 = await h.run(its, NOW);
  assert.deepEqual(r1.posted, ["yt-L1"]);
  assert.equal(its[0].posts[0].first_comment_id, "thread-1", "recorded on the post");
  assert.equal(h.state()["yt-L1"].comment_id, "thread-1", "recorded in the state file");
  const r2 = await h.run(h.fresh(), NOW + 2 * 3600_000);
  assert.equal(r2.posted.length, 0); assert.equal(h.calls.post, 1, "never posts twice");
}
{ // private (scheduled, not live yet): waits without using an attempt
  const h = harness({ privacy: "private" });
  const r = await h.run(h.fresh(), NOW);
  assert.equal(r.waiting, 1); assert.equal(h.calls.post, 0); assert.equal(h.state()["yt-L1"], undefined);
}
{ // API failure: warning, retried on later passes an hour apart, at most 3 attempts, never throws
  const h = harness({ failPost: "HTTP 503 for https://www.googleapis.com/youtube/v3/commentThreads: backendError" });
  for (let i = 0; i < 6; i++) await h.run(h.fresh(), NOW + i * 3600_000);
  assert.equal(h.calls.post, MAX_COMMENT_ATTEMPTS);
  assert.equal(h.state()["yt-L1"].attempts, MAX_COMMENT_ATTEMPTS);
  assert.match(h.state()["yt-L1"].last_error ?? "", /backendError/);
}
{ // quota errors wait for the reset (an hour apart) without using an attempt
  const h = harness({ failPost: "HTTP 403 for https://www.googleapis.com/youtube/v3/commentThreads: quotaExceeded" });
  for (let i = 0; i < 6; i++) await h.run(h.fresh(), NOW + i * 3600_000);
  assert.equal(h.calls.post, 6);
  assert.equal(h.state()["yt-L1"].attempts, 0);
}
{ // the channel already commented (local record lost): adopt it, post nothing
  const h = harness({ existing: "thread-old" });
  const r = await h.run(h.fresh(), NOW);
  assert.deepEqual(r.found, ["yt-L1"]); assert.equal(h.calls.post, 0); assert.equal(h.state()["yt-L1"].comment_id, "thread-old");
}
{ // kill switch
  process.env.YT_FIRST_COMMENT = "off";
  const h = harness();
  await h.run(h.fresh(), NOW);
  assert.equal(h.calls.info + h.calls.post, 0, "switched off: no API calls");
  delete process.env.YT_FIRST_COMMENT;
}

console.log("first comment self-test passed");
