import { readFileSync, statSync } from "node:fs";
import { env } from "../lib/config.js";
import { http, httpJson, sleep } from "../lib/http.js";
import { log } from "../lib/log.js";

const API = "https://open.tiktokapis.com/v2";

async function accessToken(): Promise<string> {
  const j = await httpJson<any>(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY", true)!, client_secret: env("TIKTOK_CLIENT_SECRET", true)!,
      grant_type: "refresh_token", refresh_token: env("TIKTOK_REFRESH_TOKEN", true)!,
    }),
  });
  if (!j.access_token) throw new Error(`TikTok token refresh failed: ${JSON.stringify(j).slice(0, 300)}`);
  if (j.refresh_token && j.refresh_token !== env("TIKTOK_REFRESH_TOKEN")) {
    log.warn("TikTok issued a new refresh token — update the TIKTOK_REFRESH_TOKEN secret (run `npm run auth:tiktok`) before the old one expires.");
  }
  return j.access_token;
}

const api = (token: string, path: string, body: object) => httpJson<any>(`${API}${path}`, {
  method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json; charset=UTF-8" }, body: JSON.stringify(body),
});

/**
 * Direct Post a video. Until your TikTok app passes the Content Posting API audit, TikTok only allows
 * SELF_ONLY (private) posts — the code picks the most public level your account/app is allowed.
 */
export async function tiktokPost(file: string, caption: string) {
  const token = await accessToken();
  const info = (await api(token, "/post/publish/creator_info/query/", {})).data;
  const wanted = env("TIKTOK_PRIVACY") ?? "PUBLIC_TO_EVERYONE";
  const options: string[] = info?.privacy_level_options ?? ["SELF_ONLY"];
  const privacy = options.includes(wanted) ? wanted : options[0];
  if (privacy !== wanted) log.warn(`TikTok privacy ${wanted} not allowed yet (options: ${options.join(", ")}); posting as ${privacy}`);

  const size = statSync(file).size;
  // TikTok: single chunk up to 64 MB; otherwise 10 MB chunks with the final chunk taking the remainder
  const chunk = size <= 64 * 1024 * 1024 ? size : 10 * 1024 * 1024;
  const chunks = Math.floor(size / chunk);
  const init = await api(token, "/post/publish/video/init/", {
    post_info: {
      title: caption.slice(0, 2200), privacy_level: privacy,
      disable_comment: false, disable_duet: false, disable_stitch: false, video_cover_timestamp_ms: 1000,
    },
    source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunk, total_chunk_count: chunks },
  });
  if (init.error?.code && init.error.code !== "ok") throw new Error(`TikTok init: ${JSON.stringify(init.error)}`);
  const { publish_id, upload_url } = init.data;
  const bytes = readFileSync(file);
  for (let i = 0; i < chunks; i++) {
    const a = i * chunk, b = i === chunks - 1 ? size : a + chunk; // last chunk absorbs the remainder
    const put = await http(upload_url, {
      method: "PUT", timeoutMs: 30 * 60_000, retries: 1,
      headers: { "content-type": "video/mp4", "content-range": `bytes ${a}-${b - 1}/${size}`, "content-length": String(b - a) },
      body: bytes.subarray(a, b),
    });
    if (!put.ok && put.status !== 206) throw new Error(`TikTok upload ${put.status}: ${(await put.text()).slice(0, 300)}`);
  }

  for (let i = 0; i < 40; i++) {
    await sleep(15_000);
    const s = (await api(token, "/post/publish/status/fetch/", { publish_id })).data;
    if (s?.status === "PUBLISH_COMPLETE") {
      const postId = s.publicaly_available_post_id?.[0] ?? s.publicly_available_post_id?.[0];
      return { id: String(postId ?? publish_id), url: postId ? `https://www.tiktok.com/@informedlab/video/${postId}` : undefined, privacy };
    }
    if (s?.status === "FAILED") throw new Error(`TikTok publish failed: ${s.fail_reason}`);
  }
  return { id: publish_id as string, url: undefined, privacy };
}
