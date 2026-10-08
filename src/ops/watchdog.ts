/**
 * Ops watchdog: runs inside the always-on publisher (every ~10 min) and keeps production and posting moving
 * without anyone watching. Known problems get a known fix (start a late production run, re-run a failed job,
 * give a transient publish failure a second chance, re-upload a YouTube video that never processed, make a
 * scheduled video public). Anything new or persistent is handed to the Ops Engineer agent (ops.yml), which
 * diagnoses, fixes and reports on Telegram. Every action is recorded in data/ops/state.json (no repeats).
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { config, DATA } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { loadItems, saveItem, type ContentItem, type PostTarget } from "../lib/items.js";
import { log } from "../lib/log.js";
import { addDays, localDate } from "../lib/time.js";

const STATE = join(DATA, "ops", "state.json");
const EVERY_MIN = 10;
const MAX_ESCALATIONS_PER_DAY = 4;

interface State { last_run?: string; done: Record<string, string>; escalations: Record<string, number> }
const H = 3600_000;

function load(): State {
  const s = readJson<State>(STATE, { done: {}, escalations: {} });
  // forget actions older than 7 days
  for (const [k, t] of Object.entries(s.done)) if (Date.now() - Date.parse(t) > 7 * 24 * H) delete s.done[k];
  return s;
}

// WATCHDOG_DRY=1: report what would be started/re-run instead of doing it (local testing)
const DRY = process.env.WATCHDOG_DRY === "1";
const gh = (args: string[]) => {
  if (DRY && ((args[0] === "workflow" && args[1] === "run") || (args[0] === "run" && args[1] === "rerun"))) {
    log.info(`[dry] gh ${args.map(a => a.split("\n")[0].slice(0, 160)).join(" ")}`);
    return "";
  }
  return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 120_000 }).trim();
};
const ghJson = <T>(args: string[]): T => JSON.parse(gh(args) || "null");

const TRANSIENT = /\b(410|429|5\d\d)\b|Gone|timeout|timed out|ETIMEDOUT|ECONNRESET|socket hang up|fetch failed|network|temporar|try again|is_transient":true|Invalid Carousel Children|not ready after|rate.?limit|overloaded/i;

type Run = { databaseId: number; status: string; conclusion: string; createdAt: string; updatedAt: string; event: string; attempt: number; displayTitle: string };

export async function watchdog(force = false) {
  const s = load();
  if (!force && s.last_run && Date.now() - Date.parse(s.last_run) < EVERY_MIN * 60_000) return;
  s.last_run = new Date().toISOString();
  const { notify } = await import("../notify/telegram.js");
  const once = (key: string, cooldownH = 24 * 7) => {
    const t = s.done[key];
    if (t && Date.now() - Date.parse(t) < cooldownH * H) return false;
    s.done[key] = new Date().toISOString();
    return true;
  };
  const escalate = async (key: string, title: string, details: string) => {
    if (!once(`escalate:${key}`, 12)) return;
    const day = new Date().toISOString().slice(0, 10);
    s.escalations[day] = (s.escalations[day] ?? 0) + 1;
    for (const d of Object.keys(s.escalations)) if (d < addDays(day, -7)) delete s.escalations[d];
    if (s.escalations[day] > MAX_ESCALATIONS_PER_DAY) {
      await notify(`🚧 <b>Blocker</b> (Ops Engineer daily limit reached, needs a look)\n${esc(title)}\n\n<code>${esc(details.slice(0, 1500))}</code>`);
      return;
    }
    const incident = `${title}\n\n${details}`.slice(0, 12_000);
    try {
      gh(["workflow", "run", "ops.yml", "--ref", "main", "-f", `incident=${incident}`]);
      await notify(`🛠️ <b>Ops Engineer called in</b>\n${esc(title)}`, { silent: true });
      log.warn(`watchdog: escalated ${key}`);
    } catch (e) {
      await notify(`🚧 <b>Blocker</b> (couldn't start the Ops Engineer: ${esc((e as Error).message.slice(0, 200))})\n${esc(title)}\n\n<code>${esc(details.slice(0, 1500))}</code>`);
    }
  };

  const checks: [string, () => Promise<void>][] = [
    ["production", () => checkProduction(once, escalate, notify)],
    ["posts", () => checkPosts(once, escalate, notify)],
    ["youtube", () => checkYouTube(once, escalate, notify)],
  ];
  for (const [name, fn] of checks) {
    try { await fn(); } catch (e) { log.warn(`watchdog ${name} check failed: ${(e as Error).message.slice(0, 300)}`); }
  }
  writeJson(STATE, s);
}

type Once = (key: string, cooldownH?: number) => boolean;
type Escalate = (key: string, title: string, details: string) => Promise<void>;
type Notify = (html: string, opts?: { silent?: boolean }) => Promise<void>;
const esc = (t: string) => t.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));

/** WATCHDOG_NOW=<ISO time>: pretend it's that time in the production check (local testing). */
const now = () => (process.env.WATCHDOG_NOW ? new Date(process.env.WATCHDOG_NOW) : new Date());

/** The content date daily.yml would produce right now: tomorrow when within 6 h of midnight (audience time). */
function contentDate(at = now()) { return localDate(config.audience.timezone, new Date(at.getTime() + 6 * H)); }
function localHour(at = now()) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: config.audience.timezone, hour: "numeric", hourCycle: "h23" }).format(at));
}

/** Production starts at 22:00 audience time (GitHub's cron is often hours late), finishes, and gets re-run if it fails. */
async function checkProduction(once: Once, escalate: Escalate, notify: Notify) {
  const D = contentDate();
  const hour = localHour();
  const produced = existsSync(join(DATA, "queue", D, "plan.json"));
  const runs = ghJson<Run[]>(["run", "list", "--workflow", "daily.yml", "--limit", "15", "--json", "databaseId,status,conclusion,createdAt,updatedAt,event,attempt,displayTitle"]) ?? [];
  const recent = runs.filter(r => Date.now() - Date.parse(r.createdAt) < 12 * H);
  // scheduled starts that only hit the duplicate guard succeed in well under a minute: ignore them
  const real = recent.filter(r => !(r.conclusion === "success" && Date.parse(r.updatedAt) - Date.parse(r.createdAt) < 3 * 60_000));
  const active = real.find(r => r.status !== "completed");

  // 1) kick off: from 22:05 until 10:00 audience time, if nothing has started for D
  const inWindow = hour >= 22 || hour < 10;
  if (inWindow && !produced && !active && !real.some(r => r.conclusion === "success")) {
    const minute = Number(new Intl.DateTimeFormat("en-US", { timeZone: config.audience.timezone, minute: "numeric" }).format(now()));
    if ((hour > 22 || hour < 10 || minute >= 5) && once(`kickoff:${D}`, 3)) {
      gh(["workflow", "run", "daily.yml", "--ref", "main", "-f", `date=${D}`]);
      log.info(`watchdog: started production for ${D}`);
      await notify(`▶️ Watchdog started production for <b>${D}</b> (GitHub's schedule hadn't started it yet).`, { silent: true });
    }
  }

  // 2) a run that failed: re-run its failed jobs once, then escalate
  for (const r of real.filter(r => r.status === "completed" && ["failure", "timed_out", "startup_failure"].includes(r.conclusion))) {
    if (produced && real.some(o => o.conclusion === "success" && Date.parse(o.createdAt) > Date.parse(r.createdAt))) continue;
    if (r.attempt < 2 && once(`rerun:${r.databaseId}`)) {
      gh(["run", "rerun", String(r.databaseId), "--failed"]);
      log.info(`watchdog: re-running failed jobs of daily run ${r.databaseId}`);
      await notify(`🔁 Watchdog re-running the failed jobs of today's production (run ${r.databaseId}).`, { silent: true });
    } else if (r.attempt >= 2) {
      let logTail = "";
      try { logTail = gh(["run", "view", String(r.databaseId), "--log-failed"]).split("\n").slice(-120).join("\n"); } catch { /* logs may not be ready */ }
      await escalate(`daily-failed:${r.databaseId}`, `Daily production failed twice (run ${r.databaseId}, content date ${D})`,
        `Run: https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${r.databaseId}\nThe watchdog already re-ran the failed jobs once.\n\nLast lines of the failed jobs:\n${logTail}`);
    }
  }

  // 3) a run that's been going far longer than usual (~3.5 h)
  if (active && Date.now() - Date.parse(active.createdAt) > 5.5 * H) {
    await escalate(`daily-slow:${active.databaseId}`, `Daily production still running after ${((Date.now() - Date.parse(active.createdAt)) / H).toFixed(1)} h (run ${active.databaseId})`,
      `Run: https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${active.databaseId}\nUsual duration is about 3–3.5 h. Find the stuck job and decide whether to let it finish or cancel and re-run it.`);
  }

  // 4) past the first slot of D and still nothing produced
  if (!produced && !active && hour >= 7 && hour < 22 && D === localDate(config.audience.timezone, now())) {
    await escalate(`no-content:${D}`, `No content produced for ${D} and no production run active`,
      `Recent daily.yml runs:\n${recent.map(r => `${r.databaseId} ${r.event} ${r.status} ${r.conclusion} ${r.createdAt}`).join("\n") || "(none)"}`);
  }
}

/** Posts: give transient failures one more round, escalate the rest, and catch anything overdue. */
async function checkPosts(once: Once, escalate: Escalate, notify: Notify) {
  const today = localDate(config.audience.timezone);
  const items = loadItems([-2, -1, 0, 1].map(d => addDays(today, d)));
  for (const item of items) {
    if (item.status !== "ready") continue;
    let changed = false;
    for (const p of item.posts) {
      const ref = `${item.date}/${item.id.split("-")[0]}`;
      const key = `${item.date}/${item.id}:${p.platform}`;
      if (p.status === "failed") {
        if (TRANSIENT.test(p.error ?? "") && once(`retry:${key}`)) {
          p.status = "pending"; p.attempts = 0; changed = true;
          log.info(`watchdog: second chance for ${key} (${(p.error ?? "").slice(0, 120)})`);
          await notify(`🔁 Watchdog retrying <b>${esc(p.platform)}</b> for ${esc(ref)} after a temporary error.`, { silent: true });
        } else {
          await escalate(`post-failed:${key}`, `Publishing failed: ${p.platform} ${p.format} for ${ref} (${item.kind})`,
            `Item file: data/queue/${item.date}/${item.id}.json\nTitle: ${item.package.title ?? item.plan.working_title}\nSlot: ${p.slot}\nAttempts: ${p.attempts}${s2(key)}\nError:\n${p.error ?? "(none recorded)"}`);
        }
      } else if (p.status === "pending" && Date.now() - Date.parse(p.slot) > 45 * 60_000) {
        await escalate(`post-overdue:${key}`, `Post overdue: ${p.platform} ${p.format} for ${ref} is ${Math.round((Date.now() - Date.parse(p.slot)) / 60_000)} min past its slot`,
          `Item file: data/queue/${item.date}/${item.id}.json\nSlot: ${p.slot}\nAttempts: ${p.attempts}\nLast error: ${p.error ?? "(none)"}\nThe publisher loop runs every minute; find out why this post isn't going out.`);
      }
    }
    if (changed) saveItem(item);
  }
  function s2(key: string) { return readJson<State>(STATE, { done: {}, escalations: {} }).done[`retry:${key}`] ? "\nThe watchdog already gave it a second round of attempts." : ""; }
}

/** YouTube: a scheduled upload must be public and processed after its slot. */
async function checkYouTube(once: Once, escalate: Escalate, notify: Notify) {
  const { videoStatus, makePublicNow } = await import("../publish/youtube.js");
  const today = localDate(config.audience.timezone);
  const items = loadItems([-2, -1, 0].map(d => addDays(today, d)));
  const verified = readJson<Record<string, string>>(join(DATA, "ops", "youtube-verified.json"), {});
  let checked = 0;
  for (const item of items) {
    for (const p of item.posts.filter(p => p.platform === "youtube" && p.remote_id && (p.status === "scheduled" || p.status === "published"))) {
      if (verified[p.remote_id!] || Date.now() - Date.parse(p.slot) < 30 * 60_000 || checked >= 12) continue;
      checked++;
      const key = `${item.date}/${item.id}:youtube`;
      const st = await videoStatus(p.remote_id!);
      if (!st || st.uploadStatus === "deleted") {
        // gone from YouTube: may have been deleted on purpose (e.g. replaced by hand), so never re-upload blindly
        await escalate(`yt-missing:${key}`, `YouTube video for ${item.date}/${item.id} is missing or deleted`,
          `Video id ${p.remote_id} (${p.url ?? ""}) no longer exists on the channel. Check whether the owner removed it on purpose before doing anything; if it was lost by mistake, re-upload it.`);
        verified[p.remote_id!] = new Date().toISOString();
      } else if (["failed", "rejected"].includes(st.uploadStatus)) {
        if (once(`yt-reupload:${key}`)) {
          reupload(item, p);
          await notify(`🔁 Watchdog re-uploading ${esc(item.package.title ?? item.id)} to YouTube (previous upload ${esc(st?.uploadStatus ?? "missing")}${st?.failureReason ? `: ${esc(st.failureReason)}` : ""}${st?.rejectionReason ? `: ${esc(st.rejectionReason)}` : ""}).`);
        } else {
          await escalate(`yt-broken:${key}`, `YouTube upload broken again for ${item.date}/${item.id}`, `Video ${p.remote_id}: ${JSON.stringify(st)}`);
        }
      } else if (st.uploadStatus === "uploaded") {
        // still "processing" well after its slot: the upload never finished on YouTube's side
        if (Date.now() - Date.parse(p.slot) > 2 * H && once(`yt-reupload:${key}`)) {
          reupload(item, p);
          await notify(`🔁 Watchdog re-uploading ${esc(item.package.title ?? item.id)}: YouTube never finished processing the first upload.`);
        }
      } else if (st.privacyStatus !== "public") {
        if (once(`yt-public:${key}`)) {
          await makePublicNow(p.remote_id!);
          p.status = "published"; p.published_at = new Date().toISOString(); saveItem(item);
          await notify(`🔓 Watchdog made ${esc(item.package.title ?? item.id)} public on YouTube (it was still ${esc(st.privacyStatus)} after its slot).`, { silent: true });
        } else {
          await escalate(`yt-private:${key}`, `YouTube video still ${st.privacyStatus} after its slot: ${item.date}/${item.id}`, `Video ${p.remote_id}: ${JSON.stringify(st)}`);
        }
      } else {
        verified[p.remote_id!] = new Date().toISOString();
      }
    }
  }
  for (const [id, t] of Object.entries(verified)) if (Date.now() - Date.parse(t) > 14 * 24 * H) delete verified[id];
  writeJson(join(DATA, "ops", "youtube-verified.json"), verified);

  function reupload(item: ContentItem, p: PostTarget) {
    log.warn(`watchdog: re-uploading ${item.date}/${item.id} to YouTube (old id ${p.remote_id})`);
    p.status = "pending"; p.remote_id = undefined; p.url = undefined; p.attempts = 0;
    p.slot = new Date().toISOString();
    saveItem(item);
  }
}
