import { readFileSync, statSync } from "node:fs";
import { basename } from "node:path";
import { env } from "../lib/config.js";
import { http, httpJson, sleep } from "../lib/http.js";

const V = () => env("META_GRAPH_VERSION") ?? "v23.0";
const G = (path: string) => `https://graph.facebook.com/${V()}/${path}`;
const token = () => env("META_PAGE_ACCESS_TOKEN", true)!;
const igUser = () => env("META_IG_USER_ID", true)!;
const pageId = () => env("META_PAGE_ID", true)!;

async function post(path: string, params: Record<string, string>) {
  return httpJson<any>(G(path), { method: "POST", body: new URLSearchParams({ ...params, access_token: token() }) });
}

async function waitContainer(id: string, minutes = 15) {
  const until = Date.now() + minutes * 60_000;
  while (Date.now() < until) {
    const j = await httpJson<any>(G(`${id}?fields=status_code,status&access_token=${token()}`));
    if (j.status_code === "FINISHED") return;
    if (j.status_code === "ERROR" || j.status_code === "EXPIRED") throw new Error(`IG container ${id} ${j.status_code}: ${j.status}`);
    await sleep(10_000);
  }
  throw new Error(`IG container ${id} not ready after ${minutes} min`);
}

async function igPublish(creationId: string) {
  const { id } = await post(`${igUser()}/media_publish`, { creation_id: creationId });
  const p = await httpJson<any>(G(`${id}?fields=permalink&access_token=${token()}`)).catch(() => ({}));
  return { id: id as string, url: p.permalink as string | undefined };
}

/** Instagram Reel via resumable binary upload (no public video URL needed). */
export async function instagramReel(file: string, caption: string) {
  const c = await post(`${igUser()}/media`, { media_type: "REELS", upload_type: "resumable", caption, share_to_feed: "true" });
  const size = statSync(file).size;
  const up = await http(`https://rupload.facebook.com/ig-api-upload/${V()}/${c.id}`, {
    method: "POST", timeoutMs: 30 * 60_000, retries: 1,
    headers: { authorization: `OAuth ${token()}`, offset: "0", file_size: String(size), "content-type": "application/octet-stream" },
    body: readFileSync(file),
  });
  if (!up.ok) throw new Error(`IG upload ${up.status}: ${(await up.text()).slice(0, 400)}`);
  await waitContainer(c.id);
  return igPublish(c.id);
}

/** Instagram carousel. The IG API only accepts public image URLs (we host them on the repo's `media` branch). */
export async function instagramCarousel(imageUrls: string[], caption: string) {
  const children: string[] = [];
  for (const image_url of imageUrls.slice(0, 10)) {
    const c = await post(`${igUser()}/media`, { image_url, is_carousel_item: "true" });
    children.push(c.id);
  }
  for (const id of children) await waitContainer(id, 5);
  const parent = await post(`${igUser()}/media`, { media_type: "CAROUSEL", children: children.join(","), caption });
  await waitContainer(parent.id, 5);
  return igPublish(parent.id);
}

/** Facebook Page Reel: start → binary upload → finish/publish. */
export async function facebookReel(file: string, description: string) {
  const start = await post(`${pageId()}/video_reels`, { upload_phase: "start" });
  const size = statSync(file).size;
  const up = await http(start.upload_url ?? `https://rupload.facebook.com/video-upload/${V()}/${start.video_id}`, {
    method: "POST", timeoutMs: 30 * 60_000, retries: 1,
    headers: { authorization: `OAuth ${token()}`, offset: "0", file_size: String(size) },
    body: readFileSync(file),
  });
  if (!up.ok) throw new Error(`FB reel upload ${up.status}: ${(await up.text()).slice(0, 400)}`);
  await post(`${pageId()}/video_reels`, { upload_phase: "finish", video_id: start.video_id, video_state: "PUBLISHED", description });
  return { id: start.video_id as string, url: `https://www.facebook.com/reel/${start.video_id}` };
}

/** Facebook multi-photo post: upload photos unpublished, then attach them to one feed post. */
export async function facebookAlbumPost(images: string[], message: string) {
  const ids: string[] = [];
  for (const img of images) {
    const form = new FormData();
    form.append("published", "false");
    form.append("access_token", token());
    form.append("source", new Blob([readFileSync(img)], { type: "image/jpeg" }), basename(img));
    const j = await httpJson<any>(G(`${pageId()}/photos`), { method: "POST", body: form });
    ids.push(j.id);
  }
  const params: Record<string, string> = { message };
  ids.forEach((id, i) => { params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id }); });
  const j = await post(`${pageId()}/feed`, params);
  return { id: j.id as string, url: `https://www.facebook.com/${j.id}` };
}

export async function igInsights(mediaId: string) {
  return httpJson<any>(G(`${mediaId}/insights?metric=reach,likes,comments,shares,saved,views&access_token=${token()}`)).catch(() => undefined);
}
