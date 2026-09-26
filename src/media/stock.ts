import { createWriteStream, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { env } from "../lib/config.js";
import { ensureDir, slugify } from "../lib/fsx.js";
import { http, httpJson } from "../lib/http.js";
import { log } from "../lib/log.js";

export type Orientation = "landscape" | "portrait";

async function download(url: string, file: string): Promise<string> {
  if (existsSync(file) && statSync(file).size > 0) return file;
  const res = await http(url, { timeoutMs: 180_000, retries: 2 });
  if (!res.ok || !res.body) throw new Error(`download ${res.status} ${url.slice(0, 80)}`);
  await pipeline(Readable.fromWeb(res.body as any), createWriteStream(file));
  return file;
}

interface Found { id: string; url: string; duration?: number }

async function pexelsVideos(query: string, orientation: Orientation): Promise<Found[]> {
  const key = env("PEXELS_API_KEY");
  if (!key) return [];
  const j = await httpJson<any>(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=15&size=medium`, { headers: { authorization: key } });
  const target = orientation === "landscape" ? 1920 : 1080;
  return (j.videos ?? []).map((v: any) => {
    const files = (v.video_files ?? []).filter((f: any) => f.file_type === "video/mp4" && f.width && f.height);
    const dim = (f: any) => orientation === "landscape" ? f.width : Math.min(f.width, f.height);
    files.sort((a: any, b: any) => Math.abs(dim(a) - target) - Math.abs(dim(b) - target));
    return files[0] ? { id: `pexels-${v.id}`, url: files[0].link, duration: v.duration } : null;
  }).filter(Boolean);
}

async function pixabayVideos(query: string, orientation: Orientation): Promise<Found[]> {
  const key = env("PIXABAY_API_KEY");
  if (!key) return [];
  const j = await httpJson<any>(`https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&per_page=15&safesearch=true`);
  return (j.hits ?? [])
    .filter((h: any) => (orientation === "portrait") === (h.videos.medium.height > h.videos.medium.width) || orientation === "landscape")
    .map((h: any) => ({ id: `pixabay-${h.id}`, url: (h.videos.large?.url || h.videos.medium.url), duration: h.duration }));
}

/** Find + download a stock clip for `query`, avoiding clips already used in this video. */
export async function stockVideo(query: string, orientation: Orientation, dir: string, used: Set<string>): Promise<string | undefined> {
  ensureDir(dir);
  const queries = [query, query.split(" ").slice(0, 2).join(" "), query.split(" ")[0]].filter((q, i, a) => q && a.indexOf(q) === i);
  for (const q of queries) {
    let found: Found[] = [];
    try { found = await pexelsVideos(q, orientation); } catch (e) { log.warn(`pexels: ${(e as Error).message.slice(0, 120)}`); }
    if (!found.length) { try { found = await pixabayVideos(q, orientation); } catch (e) { log.warn(`pixabay: ${(e as Error).message.slice(0, 120)}`); } }
    const pick = found.find(f => !used.has(f.id)) ?? found[0];
    if (pick) {
      used.add(pick.id);
      try { return await download(pick.url, join(dir, `${pick.id}.mp4`)); } catch (e) { log.warn((e as Error).message); }
    }
  }
  return undefined;
}

export async function stockPhoto(query: string, orientation: Orientation | "square", dir: string, offset = 0): Promise<string | undefined> {
  ensureDir(dir);
  const key = env("PEXELS_API_KEY");
  try {
    if (key) {
      const j = await httpJson<any>(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=10`, { headers: { authorization: key } });
      const p = j.photos?.[offset % Math.max(1, j.photos.length)];
      if (p) return await download(p.src.large2x, join(dir, `pexels-photo-${p.id}.jpg`));
    }
    const pk = env("PIXABAY_API_KEY");
    if (pk) {
      const j = await httpJson<any>(`https://pixabay.com/api/?key=${pk}&q=${encodeURIComponent(query)}&image_type=photo&safesearch=true&per_page=10`);
      const h = j.hits?.[offset % Math.max(1, j.hits.length)];
      if (h) return await download(h.largeImageURL, join(dir, `pixabay-photo-${h.id}.jpg`));
    }
  } catch (e) { log.warn(`stock photo "${query}": ${(e as Error).message.slice(0, 150)}`); }
  return undefined;
}

/**
 * Free AI image generation via Pollinations (no key needed; POLLINATIONS_TOKEN raises limits).
 * Used for thumbnails; falls back to stock photos when unavailable.
 */
export async function aiImage(prompt: string, width: number, height: number, dir: string, seed = 7): Promise<string | undefined> {
  ensureDir(dir);
  const file = join(dir, `ai-${slugify(prompt, 40)}-${seed}.jpg`);
  const token = env("POLLINATIONS_TOKEN");
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux${token ? `&token=${token}` : ""}`;
  try {
    const res = await http(url, { timeoutMs: 120_000, retries: 1 });
    if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) throw new Error(`HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body as any), createWriteStream(file));
    return file;
  } catch (e) {
    log.warn(`AI image failed (${(e as Error).message}); falling back to stock`);
    return undefined;
  }
}
