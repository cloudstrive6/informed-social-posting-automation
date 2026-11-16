/**
 * Local test for the measurement step (fixtures only: no network, no credentials, nothing written).
 * Run: npm run test:measurement
 */
import assert from "node:assert/strict";
import { compactRow } from "../src/analytics/analyze.js";
import { armTables, buildArmPosts, dropContext, enrichRows, expireRules, parseChapters, postMeta, sceneAtSecond, viewsAtAge } from "../src/analytics/measure.js";
import { captureRetention, MILESTONES, type Fetchers, type RetentionFile, type RetentionVideo, type Table } from "../src/analytics/retention.js";
import { matchTikTok } from "../src/analytics/tiktok.js";
import { holdFromGraph, nearestReel, parseVideoInsights, recentFacebookRows, redactToken } from "../src/analytics/facebook.js";

const scene = (section: string, narration: string, retention_device = "") => ({ id: "x", section, narration, on_screen_text: "", visual: { kind: "broll" as const, stock_query: "" }, retention_device, source_ids: [] });
const words = (n: number, w = "w") => Array.from({ length: n }, (_, i) => `${w}${i}`).join(" ");
const mkItem = (id: string, exp: Record<string, string> | undefined, nWords: number, dur: number): any => ({
  id, date: "2026-11-13", kind: "short", experiments: exp, plan: {}, package: {}, posts: [{ platform: "youtube", format: "short", remote_id: `yt-${id}` }],
  script: { scenes: [scene("Short", words(nWords / 2)), scene("Short", words(nWords / 2))] }, media: { duration: dur },
});

// ---- postMeta (what logPost writes) and the backfill join
const it1 = mkItem("S1", { "short-length": "tight", "hook-archetype": "negation" }, 100, 45.04);
assert.deepEqual(postMeta(it1), { experiments: { "short-length": "tight", "hook-archetype": "negation" }, words: 100, length_s: 45, scenes: 2 });
assert.equal(postMeta({ kind: "long", media: {}, script: undefined } as any).words, undefined);
const rows0 = [{ date: "2026-11-13", id: "S1", remote_id: "yt-S1", platform: "youtube" }, { date: "2026-11-09", id: "gone", remote_id: "zz", platform: "youtube" }];
const enriched = enrichRows(rows0, [it1]) as any[];
assert.equal(enriched[0].words, 100); assert.equal(enriched[0].experiments["short-length"], "tight");
assert.equal(enriched[1].words, undefined, "no queue item: row unchanged");
assert.equal((enrichRows([{ ...rows0[0], words: 7 }], [it1]) as any[])[0].words, 7, "never overwrites a logged value");

// ---- compactRow keeps the test fields and drops only hook, url, at
const old = { at: "t", url: "u", hook: "long free text", id: "S1", kind: "short", platform: "youtube", remote_id: "r", topic: "x".repeat(300), experiments: { "short-length": "tight" }, words: 100, length_s: 45, scenes: 2, metrics: { views: 5 } };
const c = compactRow(old) as any;
assert.deepEqual(c.experiments, { "short-length": "tight" });
assert.equal(c.words, 100); assert.equal(c.length_s, 45); assert.equal(c.scenes, 2); assert.equal(c.kind, "short");
assert.equal(c.hook, undefined); assert.equal(c.url, undefined); assert.equal(c.at, undefined); assert.equal(c.topic.length, 140);

// ---- arm table on fixtures: 4 Shorts, 2 length arms, snapshots on days 3 and 7
const items = [mkItem("A", { "short-length": "tight", "hook-archetype": "negation" }, 100, 45), mkItem("B", { "short-length": "tight", "hook-archetype": "myth-flip" }, 110, 50), mkItem("C", { "short-length": "standard", "hook-archetype": "negation" }, 150, 70), mkItem("D", { "short-length": "standard", "hook-archetype": "myth-flip" }, 160, 80)];
const views: Record<string, [number, number]> = { A: [10, 30], B: [20, 50], C: [4, 8], D: [6, 12] };
const snap = (date: string, day: 0 | 1) => ({ date, rows: items.map(i => ({ date: i.date, id: i.id, kind: "short", platform: "youtube", remote_id: `yt-${i.id}`, slot: "2026-11-13T18:00:00.000Z", metrics: { viewCount: String(views[i.id][day]), averageViewPercentage: i.id === "A" ? 80 : i.id === "B" ? 60 : 40 } })) });
const snaps = [snap("2026-11-16", 0), snap("2026-11-20", 1), snap("2026-11-18", 0) /* 2 days off day 3: ignored */];
assert.equal(viewsAtAge(snaps, "youtube:yt-A", "2026-11-13", 3), 10);
assert.equal(viewsAtAge(snaps, "youtube:yt-A", "2026-11-13", 7), 30);
assert.equal(viewsAtAge([snaps[0]], "youtube:yt-A", "2026-11-13", 7), null, "no snapshot near day 7");
const ret = (s5: number, s15: number): RetentionFile => ({ video_id: "", format: "short", published: "", duration_sec: 45, tries: {}, milestones: { d7: { captured_at: "", window: ["", ""], curve_pct: [], relative_pct: [], hold_pct: { s5, s15, s30: null, s60: null }, biggest_drop: null } } });
const rets: Record<string, RetentionFile> = { "yt-A": ret(90, 70), "yt-B": ret(80, 60) };
const posts = buildArmPosts(snaps.slice(0, 2), items, id => rets[id]);
assert.equal(posts.length, 4);
const t = armTables(posts);
assert.deepEqual(Object.keys(t), ["hook-archetype", "short-length"]);
const tight = t["short-length"].tight, std = t["short-length"].standard;
assert.equal(tight.n, 2); assert.equal(tight.median_views_d3, 15); assert.equal(tight.median_views_d7, 40);
assert.equal(tight.median_avg_view_pct, 70); assert.equal(tight.median_hold_s5_d7, 85); assert.equal(tight.median_hold_s15_d7, 65); assert.equal(tight.n_hold_d7, 2); assert.equal(tight.n_hold_d3, 0); assert.equal(tight.median_hold_s5_d3, null);
assert.equal(tight.median_duration_s, 47.5); assert.equal(tight.median_words, 105);
assert.equal(std.median_views_d7, 10); assert.equal(std.median_hold_s5_d7, null); assert.equal(std.n_hold_d7, 0);
// hold never mixes ages: a d3-only curve lands in the d3 columns, a d7 curve in d7
const rets2: Record<string, RetentionFile> = { "yt-C": { ...ret(50, 40), milestones: { d3: ret(50, 40).milestones.d7 } }, "yt-D": ret(70, 60) };
const t2 = armTables(buildArmPosts(snaps.slice(0, 2), items, id => rets2[id]))["short-length"].standard;
assert.equal(t2.median_hold_s5_d3, 50); assert.equal(t2.n_hold_d3, 1); assert.equal(t2.median_hold_s5_d7, 70); assert.equal(t2.n_hold_d7, 1);
assert.equal(t["hook-archetype"].negation.n, 2); assert.equal(t["hook-archetype"]["myth-flip"].median_views_d3, 13);
assert.equal(buildArmPosts([{ date: "2026-11-16", rows: [{ platform: "youtube", kind: "short", remote_id: "q", date: "d", id: "i", slot: "2026-11-13T00:00:00Z" }] }], []).length, 0, "no experiments field: not in a table");

// ---- rule expiry
const md = ["# Playbook", "- keep forever", "- test arm rule (until 2026-11-26)", "- stale rule (until 2026-11-09)", "- today rule (until 2026-11-16)"].join("\n");
assert.equal(expireRules(md, "2026-11-16"), ["# Playbook", "- keep forever", "- test arm rule (until 2026-11-26)", "- today rule (until 2026-11-16)"].join("\n"));
assert.equal(expireRules("- a (until 2026-11-15)\n- b", "2026-11-16"), "- b");
// indented children go with an expired parent; siblings and later lines stay
const nested = ["- keep", "  - keep child", "- old (until 2026-11-09)", "  - child of old", "    - grandchild", "- next", "  - next child", "  - old child (until 2026-11-01)", "    - its child", "  - last"].join("\n");
assert.equal(expireRules(nested, "2026-11-16"), ["- keep", "  - keep child", "- next", "  - next child", "  - last"].join("\n"));
assert.equal(expireRules("- a (until 2026-11-20)\n  - kept child", "2026-11-16"), "- a (until 2026-11-20)\n  - kept child");

// ---- scene at the drop second: 3 scenes of 10, 30 and 60 words over 100 s
const script = { scenes: [scene("Hook", words(10, "a"), "open loop"), scene("Why", words(30, "b"), "stat"), scene("Checklist", words(60, "c"), "payoff")] };
assert.equal(sceneAtSecond(script, 100, 5)!.section, "Hook");
const at25 = sceneAtSecond(script, 100, 25)!;
assert.equal(at25.section, "Why"); assert.equal(at25.retention_device, "stat"); assert.equal(at25.start_sec, 10); assert.equal(at25.end_sec, 40);
assert.equal(at25.first_words, words(12, "b"));
assert.equal(sceneAtSecond(script, 100, 99)!.section, "Checklist");
assert.equal(sceneAtSecond(script, 100, 500)!.section, "Checklist", "past the end clamps to the last scene");
assert.equal(sceneAtSecond(undefined, 100, 5), null);
assert.deepEqual(parseChapters("0:00 The short answer\n1:21 The trial\n1:02:03 Late").map(c => c.sec), [0, 81, 3723]);
const rf: RetentionFile = { video_id: "v", format: "long", published: "", duration_sec: 100, tries: {}, milestones: { d7: { ...ret(1, 1).milestones.d7, biggest_drop: { at_sec: 25, at_pct: 25, from_pct: 70, to_pct: 55, drop_pts: 15 } } } };
const dc: any = dropContext({ script, media: { duration: 100 }, package: { chapters: "0:00 Short answer\n0:20 The trial\n1:30 Checklist" } } as any, rf);
assert.equal(dc.drops.d7.scene.section, "Why"); assert.equal(dc.drops.d7.chapter, "0:20 The trial"); assert.equal(dc.chapters.length, 3);
assert.equal(dropContext(undefined, rf), undefined);

// ---- Shorts retention: d3 and d7, experiment arms first, 40 a run on top of the long ones
assert.deepEqual(MILESTONES.short, [3, 7]); assert.deepEqual(MILESTONES.long, [7, 28]);
const tbl: Table = { cols: ["elapsedVideoTimeRatio", "audienceWatchRatio"], rows: Array.from({ length: 100 }, (_, i) => [(i + 1) / 100, 0.9 - i / 200]) };
const f: Fetchers = { curve: async () => tbl, detail: async () => ({ cols: [], rows: [] }), titles: async () => ({}) };
const files = new Map<string, any>();
const io = { read: (p: string) => files.get(p), write: (p: string, v: unknown) => { files.set(p, JSON.parse(JSON.stringify(v))); } };
const vids: RetentionVideo[] = [];
for (let i = 0; i < 25; i++) vids.push({ id: `L${i}`, format: "long", published: "2026-10-01", durationSec: 600 }); // 2 milestones each: only 20 are captured
for (let i = 0; i < 50; i++) vids.push({ id: `S${i}`, format: "short", published: "2026-11-01", durationSec: 45, experiment: i >= 45 }); // 100 due, 40 captured
const res = await captureRetention(vids, f, "2026-11-16", io);
assert.equal(res.captured.filter(x => x.startsWith("L")).length, 20, "long cap unchanged");
const shorts = res.captured.filter(x => x.startsWith("S"));
assert.equal(shorts.length, 40, "40 Shorts captures");
assert.ok(shorts.slice(0, 10).every(x => Number(x.slice(1, x.indexOf(":"))) >= 45), "all 10 experiment captures (5 Shorts, d3 and d7) come first");
assert.ok(shorts.slice(10).every(x => x.endsWith(":d3")), "then the other Shorts, earlier milestone first");
assert.equal(res.pending, 25 * 2 - 20 + 100 - 40);
const young = await captureRetention([{ id: "Y", format: "short", published: "2026-11-11", durationSec: 45, experiment: true }], f, "2026-11-16", { ...io, read: () => undefined });
assert.deepEqual(young.captured, ["Y:d3"], "day 3 is due at age 5 (2 day data lag), day 7 is not yet");

// ---- TikTok feed matching (publish id differs from the video id: match by logged time)
const feed = [
  { platform_post_id: "111", posted_at: "2026-11-15T18:00:20.000Z", metrics: { view_count: 92, like_count: 1, comment_count: 0, share_count: 2 } },
  { platform_post_id: "222", posted_at: "2026-11-16T01:00:12.000Z", metrics: { view_count: 3 } },
];
const tm = matchTikTok([{ remote_id: "v_pub~a", at: "2026-11-15T18:02:32.524Z" }, { remote_id: "v_pub~b", at: "2026-11-16T01:00:54.003Z" }, { remote_id: "v_pub~c", at: "2026-11-14T10:00:00Z" }], feed);
assert.equal(tm["v_pub~a"].views, 92); assert.equal(tm["v_pub~a"].shares, 2); assert.equal(tm["v_pub~b"].video_id, "222"); assert.equal(tm["v_pub~c"], undefined);

// ---- Facebook Reel insights (fixture shaped like GET /{reel-id}/video_insights, v26.0, 2026-11-16)
const lifetime = (name: string, value: unknown) => ({ name, period: "lifetime", values: [{ value }], title: name, description: "", id: `123/video_insights/${name}/lifetime` });
const graph40 = Object.fromEntries(Array.from({ length: 41 }, (_, i) => [String(i), Math.round((1 - i * 0.015) * 1000) / 1000])); // 1.0 down to 0.4
const fbFixture = { data: [
  lifetime("blue_reels_play_count", 120), lifetime("fb_reels_total_plays", 150), lifetime("fb_reels_replay_count", 30),
  lifetime("post_video_avg_time_watched", 12345), lifetime("post_video_view_time", 1851750),
  lifetime("post_video_retention_graph", graph40), lifetime("post_video_followers", 2),
  lifetime("post_video_social_actions", { SHARE: 3, COMMENT: 1 }), lifetime("post_video_likes_by_reaction_type", { REACTION_LIKE: 5, REACTION_LOVE: 2 }),
] };
const fbm = parseVideoInsights(fbFixture, "123", 40, "2026-11-17")!;
assert.equal(fbm.views, 150); assert.equal(fbm.plays_initial, 120); assert.equal(fbm.replays, 30);
assert.equal(fbm.avg_watch_s, 12.3); assert.equal(fbm.view_time_s, 1851.8);
assert.equal(fbm.followers, 2); assert.equal(fbm.reactions, 7); assert.deepEqual(fbm.social_actions, { SHARE: 3, COMMENT: 1 });
assert.equal(fbm.hold_3s_pct, 95.5, "3 s of 40 s = segment 3 of 40"); assert.equal(fbm.hold_50pct_pct, 70);
assert.equal(fbm.fetched, "2026-11-17"); assert.equal(fbm.video_id, "123");
const zero = parseVideoInsights({ data: [lifetime("blue_reels_play_count", 0), lifetime("fb_reels_total_plays", 0), lifetime("post_video_avg_time_watched", 0)] }, "9", undefined, "2026-11-17")!;
assert.equal(zero.views, 0, "zero plays stay zero"); assert.equal(zero.avg_watch_s, 0); assert.equal(zero.hold_3s_pct, null); assert.equal(zero.followers, null);
assert.equal(parseVideoInsights({ data: [] }, "9", 40, "2026-11-17"), undefined);
assert.deepEqual(holdFromGraph({ 0: 100, 1: 80, 2: 60 }, 10), { s3: 88, mid: 80 }, "percent graph, keys as three even segments");
assert.deepEqual(holdFromGraph(undefined, 10), { s3: null, mid: null });
assert.equal(holdFromGraph(graph40, 2).s3, null, "video shorter than 3 s");
// only reels from the last 60 days, newest first; Instagram, TikTok and Facebook album posts are left out
const FB_NOW = Date.parse("2026-11-17T12:00:00Z");
const fbRows = [
  { platform: "facebook", format: "reel", remote_id: "a", at: "2026-11-16T13:00:00Z" },
  { platform: "facebook", format: "reel", remote_id: "b", at: "2026-11-15T01:00:00Z" },
  { platform: "facebook", format: "reel", remote_id: "old", at: "2026-09-01T13:00:00Z" },
  { platform: "facebook", format: "post", remote_id: "album", at: "2026-11-16T13:00:00Z" },
  { platform: "instagram", format: "reel", remote_id: "ig", at: "2026-11-16T13:00:00Z" },
];
assert.deepEqual(recentFacebookRows(fbRows, FB_NOW).map(r => r.remote_id), ["a", "b"]);
// time fallback: nearest unclaimed reel within 20 minutes
const reels = [{ id: "r1", created_time: "2026-11-16T13:05:00+0000" }, { id: "r2", created_time: "2026-11-16T14:00:00+0000" }];
assert.equal(nearestReel({ at: "2026-11-16T13:00:00Z" }, reels, new Set())?.id, "r1");
assert.equal(nearestReel({ at: "2026-11-16T13:00:00Z" }, reels, new Set(["r1"])), undefined, "r2 is 60 min away");
// tokens never reach a log line
process.env.META_PAGE_ACCESS_TOKEN = "EAAtesttokenvalue123";
assert.equal(redactToken("HTTP 400 for https://graph.facebook.com/v26.0/1/video_insights?access_token=EAAtesttokenvalue123&x=1"), "HTTP 400 for https://graph.facebook.com/v26.0/1/video_insights?access_token=REDACTED&x=1");
assert.equal(redactToken('{"error":"bad token EAAtesttokenvalue123"}'), '{"error":"bad token REDACTED"}');
delete process.env.META_PAGE_ACCESS_TOKEN;
// Facebook plays land in the arm tables beside YouTube views (joined by content date and id)
const fbSnap = (date: string, day: 0 | 1) => { const sn = snap(date, day); return { date, rows: [...sn.rows, ...items.map(i => ({ date: i.date, id: i.id, kind: "short", platform: "facebook", format: "reel", remote_id: `fb-${i.id}`, slot: "2026-11-13T18:00:00.000Z", metrics: { views: i.id === "A" ? [0, 4][day] : [7, 9][day] } }))] }; };
const tFb = armTables(buildArmPosts([fbSnap("2026-11-16", 0), fbSnap("2026-11-20", 1)], items, () => undefined))["short-length"];
assert.equal(tFb.tight.median_fb_views_d3, 3.5, "A has 0 plays at day 3 (a real zero), B has 7"); assert.equal(tFb.tight.median_fb_views_d7, 6.5); assert.equal(tFb.tight.n_fb_views_d7, 2);
assert.equal(t["short-length"].tight.n_fb_views_d7, 0, "no Facebook rows: no Facebook numbers");

console.log("measurement self-test passed");
