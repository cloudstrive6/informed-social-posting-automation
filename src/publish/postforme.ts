/**
 * TikTok via Post for Me (https://postforme.dev), project "InforMed". Post for Me's approved TikTok app
 * lets videos go public right away (a self-built TikTok app stays private-only until TikTok's audit).
 * Safety: we only ever post to the TikTok account whose external id / username is @informedlab.
 */
import { readFileSync } from "node:fs";
import { env } from "../lib/config.js";
import { http, httpJson, sleep } from "../lib/http.js";
import { log } from "../lib/log.js";

const API = "https://api.postforme.dev/v1";
const headers = () => ({ authorization: `Bearer ${env("POSTFORME_API_KEY", true)}`, "content-type": "application/json" });
const get = <T>(path: string) => httpJson<T>(`${API}${path}`, { headers: headers() });
const postJson = <T>(path: string, body: object) => httpJson<T>(`${API}${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });

const HANDLE = "informedlab";

export const postForMeEnabled = () => !!env("POSTFORME_API_KEY");

/** The connected @informedlab TikTok account in the InforMed project (never any other account). */
async function tiktokAccount(): Promise<string> {
  const j = await get<{ data: { id: string; username: string; external_id?: string; status: string }[] }>(`/social-accounts?platform=tiktok&limit=50`);
  const acct = j.data.find(a => a.external_id === HANDLE || a.username?.replace(/^@/, "").toLowerCase() === HANDLE);
  if (!acct) throw new Error(`Post for Me: no TikTok account for @${HANDLE} in this project (found: ${j.data.map(a => a.username).join(", ") || "none"})`);
  if (acct.status !== "connected") throw new Error(`Post for Me: @${HANDLE} TikTok is ${acct.status}; reconnect it at app.postforme.dev`);
  return acct.id;
}

/** Upload a local file to Post for Me's storage; returns the media URL to attach to a post. */
async function uploadMedia(file: string): Promise<string> {
  const { upload_url, media_url } = await postJson<{ upload_url: string; media_url: string }>("/media/create-upload-url", {});
  const put = await http(upload_url, { method: "PUT", timeoutMs: 30 * 60_000, retries: 1, headers: { "content-type": "video/mp4" }, body: readFileSync(file) });
  if (!put.ok) throw new Error(`Post for Me upload ${put.status}: ${(await put.text()).slice(0, 300)}`);
  return media_url;
}

/** TikTok photo carousel (the same slides as Instagram), with TikTok's auto-added music. */
export async function tiktokPhotosViaPostForMe(imageUrls: string[], caption: string, title: string) {
  const account = await tiktokAccount();
  const post = await postJson<{ id: string; status: string }>("/social-posts", {
    caption: caption.slice(0, 2200), social_accounts: [account],
    media: imageUrls.slice(0, 35).map(url => ({ url })),
    platform_configurations: { tiktok: { title: title.slice(0, 90), privacy_status: env("TIKTOK_PRIVACY") ?? "public", allow_comment: true, auto_add_music: true } },
  });
  return waitResult(post.id);
}

async function waitResult(postId: string) {
  for (let i = 0; i < 40; i++) {
    await sleep(15_000);
    const r = await get<{ data: { success: boolean; error?: unknown; platform_data?: { id?: string; url?: string } }[] }>(`/social-post-results?post_id=${postId}`);
    const res = r.data[0];
    if (!res) continue;
    if (!res.success) throw new Error(`TikTok (Post for Me) failed: ${JSON.stringify(res.error).slice(0, 400)}`);
    return { id: res.platform_data?.id ?? postId, url: res.platform_data?.url };
  }
  return { id: postId, url: undefined };
}

export async function tiktokViaPostForMe(file: string, caption: string) {
  const account = await tiktokAccount();
  const url = await uploadMedia(file);
  const post = await postJson<{ id: string; status: string }>("/social-posts", {
    caption: caption.slice(0, 2200),
    social_accounts: [account],
    media: [{ url, thumbnail_timestamp_ms: 1000 }],
    platform_configurations: {
      tiktok: {
        privacy_status: env("TIKTOK_PRIVACY") ?? "public",
        allow_comment: true, allow_duet: true, allow_stitch: true,
        // narration is an AI voice: TikTok asks creators to label realistic AI-generated content
        is_ai_generated: true,
      },
    },
  });
  log.info(`Post for Me post ${post.id} ${post.status}`);
  // poll the per-account result (TikTok processing usually takes 1–3 minutes)
  for (let i = 0; i < 40; i++) {
    await sleep(15_000);
    const r = await get<{ data: { success: boolean; error?: unknown; platform_data?: { id?: string; url?: string } }[] }>(`/social-post-results?post_id=${post.id}`);
    const res = r.data[0];
    if (!res) continue;
    if (!res.success) throw new Error(`TikTok (Post for Me) failed: ${JSON.stringify(res.error).slice(0, 400)}`);
    return { id: res.platform_data?.id ?? post.id, url: res.platform_data?.url };
  }
  return { id: post.id, url: undefined };
}
