/**
 * Threads (@informedlab) via our Meta app "InforMed Publisher" (Threads app id 1856163135549786, account added
 * as a Threads Tester, so no app review is needed). Carousels: 2–20 images plus up to 500 characters of text.
 *
 * Token: Threads user tokens last 60 days. `refreshThreadsToken()` (run daily) renews it and keeps the current
 * token in the private B2 bucket, so the pipeline never needs a human to paste a new one.
 */
import { env } from "../lib/config.js";
import { httpJson, sleep } from "../lib/http.js";
import { log } from "../lib/log.js";
import { readFromB2, writeToB2 } from "./b2.js";

const G = "https://graph.threads.net/v1.0";
const TOKEN_KEY = "secrets/threads-token.json";
type Stored = { access_token: string; refreshed_at: string; expires_at?: string };

let cached: string | undefined;
async function token(): Promise<string> {
  if (cached) return cached;
  const stored = await readFromB2<Stored>(TOKEN_KEY).catch(() => undefined);
  const t = stored?.access_token ?? env("THREADS_ACCESS_TOKEN", true)!;
  cached = t;
  return t;
}

const post = async (path: string, params: Record<string, string>) =>
  httpJson<any>(`${G}/${path}`, { method: "POST", body: new URLSearchParams({ ...params, access_token: await token() }) });
const get = async (path: string) => httpJson<any>(`${G}/${path}${path.includes("?") ? "&" : "?"}access_token=${await token()}`);

async function waitReady(id: string, minutes = 5) {
  const until = Date.now() + minutes * 60_000;
  while (Date.now() < until) {
    const s = await get(`${id}?fields=status,error_message`);
    if (s.status === "FINISHED") return;
    if (s.status === "ERROR" || s.status === "EXPIRED") throw new Error(`Threads container ${id} ${s.status}: ${s.error_message ?? ""}`);
    await sleep(5_000);
  }
  throw new Error(`Threads container ${id} not ready after ${minutes} min`);
}

/** Keep Threads text within its 500-character limit, cutting at a sentence or line break. */
export function threadsText(text: string) {
  if (text.length <= 500) return text;
  const cut = text.slice(0, 497);
  const at = Math.max(cut.lastIndexOf("\n"), cut.lastIndexOf(". "));
  return (at > 250 ? cut.slice(0, at + 1) : cut).trim() + (at > 250 ? "" : "…");
}

export async function threadsCarousel(imageUrls: string[], text: string) {
  const urls = imageUrls.slice(0, 20);
  if (urls.length < 2) throw new Error("Threads carousels need at least 2 images");
  const children: string[] = [];
  for (const url of urls) children.push((await post("me/threads", { media_type: "IMAGE", image_url: url, is_carousel_item: "true" })).id);
  for (const c of children) await waitReady(c);
  const container = await post("me/threads", { media_type: "CAROUSEL", children: children.join(","), text: threadsText(text) });
  await waitReady(container.id);
  const { id } = await post("me/threads_publish", { creation_id: container.id });
  const p = await get(`${id}?fields=permalink`).catch(() => ({}));
  return { id: id as string, url: p.permalink as string | undefined };
}

export async function threadsVideo(videoUrl: string, text: string) {
  const c = await post("me/threads", { media_type: "VIDEO", video_url: videoUrl, text: threadsText(text) });
  await waitReady(c.id, 10);
  const { id } = await post("me/threads_publish", { creation_id: c.id });
  const p = await get(`${id}?fields=permalink`).catch(() => ({}));
  return { id: id as string, url: p.permalink as string | undefined };
}

/** Renew the 60-day token (allowed once it's a day old) and store it in B2. Daily; never throws. */
export async function refreshThreadsToken(): Promise<boolean> {
  try {
    const current = await token();
    const j = await httpJson<{ access_token: string; expires_in: number }>(`https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${current}`);
    const stored: Stored = { access_token: j.access_token, refreshed_at: new Date().toISOString(), expires_at: new Date(Date.now() + j.expires_in * 1000).toISOString() };
    await writeToB2(TOKEN_KEY, stored);
    cached = j.access_token;
    log.info(`Threads token renewed, valid until ${stored.expires_at?.slice(0, 10)}`);
    return true;
  } catch (e) {
    log.warn(`Threads token refresh failed: ${(e as Error).message.slice(0, 200)}`);
    return false;
  }
}
