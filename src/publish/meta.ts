import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { log } from "../lib/log.js";
import { ffmpeg } from "../media/exec.js";
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

/**
 * Instagram's Reels spec: H.264 + AAC stereo 48 kHz at up to 128 kbps, moov atom first.
 * Our masters carry higher-bitrate mono audio, so re-encode just the audio (video is copied untouched).
 */
async function igRendition(file: string): Promise<string> {
  const out = join(dirname(file), `${basename(file, ".mp4")}-ig.mp4`);
  if (!existsSync(out)) await ffmpeg(["-i", file, "-map", "0:v:0", "-map", "0:a:0?", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-ac", "2", "-ar", "48000", "-movflags", "+faststart", out]);
  return out;
}

/**
 * Instagram Reel. Preferred: Instagram fetches the video from its public URL (the GitHub release asset).
 * Fallback when there's no public URL: resumable binary upload of an IG-compliant rendition.
 */
export async function instagramReel(file: string, caption: string, publicUrl?: string) {
  if (publicUrl) {
    try {
      const c = await post(`${igUser()}/media`, { media_type: "REELS", video_url: publicUrl, caption, share_to_feed: "true" });
      await waitContainer(c.id);
      return await igPublish(c.id);
    } catch (e) { log.warn(`IG reel from URL failed (${(e as Error).message.slice(0, 200)}); trying a direct upload`); }
  }
  const video = await igRendition(file);
  const c = await post(`${igUser()}/media`, { media_type: "REELS", upload_type: "resumable", caption, share_to_feed: "true" });
  const size = statSync(video).size;
  const up = await http(`https://rupload.facebook.com/ig-api-upload/${V()}/${c.id}`, {
    method: "POST", timeoutMs: 30 * 60_000, retries: 1,
    headers: { authorization: `OAuth ${token()}`, offset: "0", file_size: String(size) },
    body: readFileSync(video),
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

/**
 * Facebook Page video, for verticals longer than the Reels API's 90 s limit (Facebook still shows them in Reels).
 * Facebook fetches the file from its public URL (the GitHub release asset); a direct upload is the fallback.
 */
export async function facebookVideo(file: string, description: string, publicUrl?: string) {
  const host = `https://graph-video.facebook.com/${V()}/${pageId()}/videos`;
  let id: string;
  if (publicUrl) {
    id = (await httpJson<any>(host, { method: "POST", body: new URLSearchParams({ file_url: publicUrl, description, access_token: token() }) })).id;
  } else {
    const form = new FormData();
    form.append("access_token", token()); form.append("description", description);
    form.append("source", new Blob([readFileSync(file)], { type: "video/mp4" }), basename(file));
    id = (await httpJson<any>(host, { method: "POST", body: form, timeoutMs: 30 * 60_000 })).id;
  }
  return { id, url: `https://www.facebook.com/${pageId()}/videos/${id}` };
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

/** Image URLs (Facebook CDN, publicly fetchable) and text of a Page post, for checking what actually went out. */
export async function facebookPostImages(postId: string): Promise<{ message: string; images: string[] }> {
  const j = await httpJson<any>(G(`${postId}?fields=message,attachments{media{image{src}},subattachments.limit(30){media{image{src}}}}&access_token=${token()}`));
  const a = j.attachments?.data?.[0];
  const subs = a?.subattachments?.data ?? (a ? [a] : []);
  return { message: j.message ?? "", images: subs.map((s: any) => s.media?.image?.src).filter(Boolean) };
}

export async function deleteFacebookPost(postId: string) {
  const j = await httpJson<any>(G(`${postId}?access_token=${token()}`), { method: "DELETE" });
  if (!j.success) throw new Error(`delete ${postId}: ${JSON.stringify(j).slice(0, 200)}`);
}

export async function igInsights(mediaId: string) {
  return httpJson<any>(G(`${mediaId}/insights?metric=reach,likes,comments,shares,saved,views&access_token=${token()}`)).catch(() => undefined);
}
