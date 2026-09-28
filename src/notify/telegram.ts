/**
 * Telegram: notifications (held content, posting reports, pipeline failures) and one-tap approvals.
 * Approve / Reject buttons are applied by `telegram-poll` (GitHub Actions, every 5 min): it reads the button
 * presses, labels the matching review issue and syncs the decision onto the queued item.
 * Only the configured chat (TELEGRAM_CHAT_ID) is listened to; everything else is ignored.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename } from "node:path";
import { config, DATA, env } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { ContentItem, itemPath, saveItem } from "../lib/items.js";
import { log } from "../lib/log.js";
import { ffmpeg, run } from "../media/exec.js";

type Button = { text: string; callback_data?: string; url?: string };
const token = () => env("TELEGRAM_BOT_TOKEN");
const chatId = () => env("TELEGRAM_CHAT_ID");
export const telegramEnabled = () => !!(token() && chatId());

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const repoUrl = () => (process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}` : "");
export const runUrl = () => (process.env.GITHUB_RUN_ID ? `${repoUrl()}/actions/runs/${process.env.GITHUB_RUN_ID}` : "");

async function tg<T = any>(method: string, body: object | FormData): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token()}/${method}`, body instanceof FormData
    ? { method: "POST", body }
    : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await res.json() as { ok: boolean; result: T; description?: string };
  if (!j.ok) throw new Error(`Telegram ${method}: ${j.description}`);
  return j.result;
}

/** Send a message (HTML). Never throws: notifications must not break the pipeline. */
export async function notify(html: string, opts: { silent?: boolean; buttons?: Button[][] } = {}) {
  if (!telegramEnabled()) return;
  try {
    await tg("sendMessage", {
      chat_id: chatId(), text: html.slice(0, 4000), parse_mode: "HTML", disable_web_page_preview: true,
      disable_notification: !!opts.silent, ...(opts.buttons ? { reply_markup: { inline_keyboard: opts.buttons } } : {}),
    });
  } catch (e) { log.warn(`telegram notify failed: ${(e as Error).message}`); }
}

/** Preview media for a review: the video itself (Telegram bots can upload up to 50 MB) or the carousel slides. */
async function sendPreview(item: ContentItem, files: { video?: string; slides?: string[]; thumbnail?: string }, caption: string) {
  try {
    if (files.slides?.length) {
      const fd = new FormData();
      fd.append("chat_id", chatId()!);
      const slides = files.slides.slice(0, 10);
      fd.append("media", JSON.stringify(slides.map((f, i) => ({ type: "photo", media: `attach://p${i}`, ...(i === 0 ? { caption, parse_mode: "HTML" } : {}) }))));
      slides.forEach((f, i) => fd.append(`p${i}`, new Blob([readFileSync(f)], { type: "image/jpeg" }), basename(f)));
      await tg("sendMediaGroup", fd);
      return;
    }
    if (files.video && existsSync(files.video)) {
      // bots may upload at most 50 MB: send a 720p preview copy of bigger videos
      let video = files.video;
      if (statSync(video).size >= 49 * 1024 * 1024) {
        video = files.video.replace(/\.mp4$/, "-preview.mp4");
        if (!existsSync(video)) await ffmpeg(["-i", files.video, "-vf", "scale=-2:720", "-r", "30", "-c:v", "libx264", "-crf", "28", "-preset", "veryfast", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", video]);
      }
      if (statSync(video).size >= 49 * 1024 * 1024) throw new Error("preview still over 50 MB");
      const fd = new FormData();
      fd.append("chat_id", chatId()!); fd.append("caption", caption); fd.append("parse_mode", "HTML"); fd.append("supports_streaming", "true");
      fd.append("video", new Blob([readFileSync(video)], { type: "video/mp4" }), basename(video));
      await tg("sendVideo", fd);
      return;
    }
    if (files.thumbnail && existsSync(files.thumbnail)) {
      const fd = new FormData();
      fd.append("chat_id", chatId()!); fd.append("caption", caption); fd.append("parse_mode", "HTML");
      fd.append("photo", new Blob([readFileSync(files.thumbnail)], { type: "image/jpeg" }), basename(files.thumbnail));
      await tg("sendPhoto", fd);
    }
  } catch (e) { log.warn(`telegram preview failed for ${item.id}: ${(e as Error).message}`); }
}

/** Held content: preview + reasons + Approve / Reject buttons (tied to the GitHub review issue). */
export async function notifyReview(item: ContentItem, issue: number, files: { video?: string; slides?: string[]; thumbnail?: string }, mediaUrl?: string) {
  if (!telegramEnabled()) return;
  const title = item.package.title ?? item.plan.working_title;
  await sendPreview(item, files, `🎬 <b>${esc(item.kind.toUpperCase())}</b> · ${esc(title)}`);
  const issues = (item.factcheck?.issues ?? []).filter(i => i.severity !== "minor").slice(0, 4);
  await notify([
    `🟡 <b>Needs your review</b> (${esc(item.kind)}, ${esc(item.date)})`,
    `<b>${esc(title)}</b>`,
    "", `<b>Why it was held:</b> ${esc((item.hold_reason ?? "n/a").slice(0, 900))}`,
    ...(issues.length ? ["", "<b>Checker findings:</b>", ...issues.map(i => `• <i>${esc(i.severity)}</i> ${esc(i.location)}: ${esc(i.problem.slice(0, 220))}`)] : []),
    "", "Approve to post it at its next slot (or right away if the slot has passed).",
  ].join("\n"), {
    buttons: [
      [{ text: "✅ Approve", callback_data: `ap:${issue}` }, { text: "🛑 Reject", callback_data: `rj:${issue}` }],
      [{ text: `Issue #${issue}`, url: `${repoUrl()}/issues/${issue}` }, ...(mediaUrl ? [{ text: "Media", url: mediaUrl }] : [])],
    ],
  });
}

/** Fully automated mode: FYI on the Editor-in-Chief's call, with a veto button for anything it publishes. */
export async function notifyDecision(item: ContentItem, d: { decision: string; reason: string; risk: string }) {
  if (!telegramEnabled()) return;
  const title = esc(item.package.title ?? item.plan.working_title);
  const ref = `${item.date}/${item.id}`;
  if (d.decision === "publish") {
    const first = item.posts.map(p => Date.parse(p.slot)).sort((a, b) => a - b)[0];
    await notify(`🟢 <b>Auto-approved</b> (${esc(item.kind)}, ${esc(d.risk)} risk)\n<b>${title}</b>\n\n${esc(d.reason)}${first ? `\n\nFirst post: ${new Date(first).toLocaleString("en-US", { timeZone: config.audience.timezone, dateStyle: "medium", timeStyle: "short" })}` : ""}`,
      { silent: true, buttons: `veto:${ref}`.length <= 64 ? [[{ text: "🛑 Don't post", callback_data: `veto:${ref}` }]] : undefined });
  } else {
    await notify(`⚪ <b>Dropped by the Editor-in-Chief</b> (${esc(item.kind)})\n<b>${title}</b>\n\n${esc(d.reason)}`, { silent: true });
  }
}

// ------------------------------------------------------------------ approvals (polled from Actions)
const STATE = `${DATA}/telegram/state.json`;
const gh = (args: string[]) => run("gh", args, { quiet: true });

/**
 * Listen for button presses and commands. Long-polls Telegram for up to `seconds`, answering each tap within
 * a second (Telegram only accepts a tap confirmation for a few seconds) and applying the decision right away
 * via `onDecision` (label the review issue + sync it onto the queued item).
 */
export async function pollTelegram(seconds = 0, onDecision: () => Promise<void> = async () => {}): Promise<boolean> {
  if (!token()) { log.warn("TELEGRAM_BOT_TOKEN not set"); return false; }
  const state = readJson<{ offset: number }>(STATE, { offset: 0 });
  const until = Date.now() + seconds * 1000;
  let decided = false;
  do {
    const wait = Math.max(0, Math.min(50, Math.floor((until - Date.now()) / 1000)));
    let updates: any[] = [];
    try { updates = await tg<any[]>("getUpdates", { offset: state.offset, timeout: wait, allowed_updates: ["callback_query", "message"] }); }
    catch (e) { log.warn(`telegram getUpdates: ${(e as Error).message}`); await new Promise(r => setTimeout(r, 5000)); continue; }
    for (const u of updates) {
      state.offset = u.update_id + 1;
      writeJson(STATE, state);
      const from = String(u.callback_query?.message?.chat?.id ?? u.message?.chat?.id ?? "");
      if (!chatId() || from !== chatId()) { log.warn(`telegram: ignoring update from chat ${from}`); continue; }
      if (u.callback_query) { if (await handleTap(u.callback_query, onDecision)) decided = true; }
      else if (u.message?.text) await handleCommand(u.message.text);
    }
  } while (Date.now() < until - 2000);
  writeJson(STATE, state);
  return decided;
}

/** Owner veto of an auto-approved item: nothing that hasn't gone out yet will be posted. */
async function handleVeto(q: any, ref: string) {
  await tg("answerCallbackQuery", { callback_query_id: q.id, text: "Stopping it 🛑" }).catch(() => undefined);
  const [date, id] = ref.split("/");
  const item = readJson<ContentItem | undefined>(itemPath(date, id), undefined);
  if (!item) { await notify(`⚠️ Couldn't find ${esc(ref)}`); return; }
  const ytScheduled = item.posts.filter(p => p.platform === "youtube" && p.status === "scheduled");
  item.status = "held"; item.hold_reason = "Vetoed by the owner on Telegram";
  for (const p of item.posts) if (p.status === "pending" || p.status === "held") p.status = "skipped";
  saveItem(item);
  await tg("editMessageReplyMarkup", { chat_id: chatId(), message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => undefined);
  const done = item.posts.filter(p => p.status === "published").map(p => p.platform);
  await notify(`🛑 <b>Stopped</b>: ${esc(item.package.title ?? id)}${done.length ? `\nAlready live on: ${done.join(", ")}` : ""}${ytScheduled.length ? `\n⚠️ YouTube already has it scheduled; delete it in YouTube Studio if needed.` : ""}`);
}

async function handleTap(q: any, onDecision: () => Promise<void>): Promise<boolean> {
  if (typeof q.data === "string" && q.data.startsWith("veto:")) { await handleVeto(q, q.data.slice(5)); return false; }
  const m = /^(ap|rj):(\d+)$/.exec(q.data ?? "");
  if (!m) return false;
  const label = m[1] === "ap" ? "approved" : "rejected";
  // acknowledge immediately; this fails harmlessly if the tap is older than Telegram's window
  await tg("answerCallbackQuery", { callback_query_id: q.id, text: label === "approved" ? "Approving ✅" : "Rejecting 🛑" }).catch(() => undefined);
  try {
    await gh(["issue", "edit", m[2], "--add-label", label]);
    await onDecision();
  } catch (e) {
    await notify(`⚠️ Couldn't apply your ${label === "approved" ? "approval" : "rejection"} of #${m[2]}: ${esc((e as Error).message.slice(0, 300))}`);
    return false;
  }
  // the review message: drop the buttons and stamp the decision
  await tg("editMessageReplyMarkup", { chat_id: chatId(), message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => undefined);
  await notify(label === "approved"
    ? `✅ <b>Approved</b> #${m[2]}. It's queued and will post at its next slots (right away where a slot has passed). You'll get a report for each platform.`
    : `🛑 <b>Rejected</b> #${m[2]}. It won't be posted.`, { buttons: [[{ text: `Issue #${m[2]}`, url: `${repoUrl()}/issues/${m[2]}` }]] });
  return true;
}

async function handleCommand(text: string) {
  const cmd = text.trim().split(/\s+/)[0].toLowerCase();
  if (cmd === "/pending") {
    const list = JSON.parse(await gh(["issue", "list", "--state", "open", "--label", "needs-review", "--json", "number,title", "--limit", "20"]));
    if (!list.length) await notify("✅ Nothing is waiting for review.");
    for (const i of list) await notify(`🟡 #${i.number} ${esc(i.title)}`, { buttons: [[{ text: "✅ Approve", callback_data: `ap:${i.number}` }, { text: "🛑 Reject", callback_data: `rj:${i.number}` }, { text: "Open", url: `${repoUrl()}/issues/${i.number}` }]] });
  } else if (cmd === "/start" || cmd === "/help") {
    await notify("👋 InforMed bot is connected.\n\nYou'll get: items that need review (with Approve / Reject), posting reports and pipeline failures.\n\n/pending: list everything waiting for review");
  }
}
