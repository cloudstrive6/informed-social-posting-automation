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
