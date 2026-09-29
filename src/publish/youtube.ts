import { createReadStream, readFileSync, statSync } from "node:fs";
import { Readable } from "node:stream";
import { env } from "../lib/config.js";
import { http, httpJson } from "../lib/http.js";

let cached: { token: string; exp: number } | undefined;

export async function youtubeToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const j = await httpJson<any>("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("YOUTUBE_CLIENT_ID", true)!, client_secret: env("YOUTUBE_CLIENT_SECRET", true)!,
      refresh_token: env("YOUTUBE_REFRESH_TOKEN", true)!, grant_type: "refresh_token",
    }),
  });
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return cached.token;
}

export interface YtUpload {
  file: string; title: string; description: string; tags: string[];
  /** ISO time; the video is uploaded private and YouTube publishes it at this time. Omit to publish now. */
  publishAt?: string;
  categoryId?: string;
}

/** A YouTube description must never carry other platforms' captions (an agent once pasted them in). */
export function cleanDescription(d: string): string {
  const lines = d.split("\n");
  const cut = lines.findIndex(l => /^\s*(INSTAGRAM|TIKTOK|FACEBOOK|THREADS)\s*(CAPTION)?\s*:/i.test(l));
  const kept = cut >= 0 ? lines.slice(0, cut) : lines;
  while (kept.length && /^\s*(-{3,}|—+)?\s*$/.test(kept[kept.length - 1])) kept.pop(); // trailing separators
  return kept.join("\n");
}

/** Update the description of an uploaded video (keeps title, tags, category). */
export async function updateDescription(videoId: string, description: string) {
  const token = await youtubeToken();
  const cur = await httpJson<any>(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}`, { headers: { authorization: `Bearer ${token}` } });
  const snippet = cur.items?.[0]?.snippet;
  if (!snippet) throw new Error(`video ${videoId} not found`);
  await httpJson<any>("https://www.googleapis.com/youtube/v3/videos?part=snippet", {
    method: "PUT", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ id: videoId, snippet: { title: snippet.title, categoryId: snippet.categoryId, tags: snippet.tags, defaultLanguage: snippet.defaultLanguage, defaultAudioLanguage: snippet.defaultAudioLanguage, description: description.slice(0, 4900) } }),
  });
}

/** Resumable upload (quota: 1,600 units). Returns the video id. */
export async function uploadVideo(v: YtUpload): Promise<string> {
  const token = await youtubeToken();
  const size = statSync(v.file).size;
  const future = v.publishAt && Date.parse(v.publishAt) > Date.now() + 5 * 60_000;
  const meta = {
    snippet: {
      title: v.title.slice(0, 100), description: cleanDescription(v.description).slice(0, 4900),
      tags: trimTags(v.tags), categoryId: v.categoryId ?? "27", defaultLanguage: "en", defaultAudioLanguage: "en",
    },
    status: {
      privacyStatus: future ? "private" : "public", ...(future ? { publishAt: v.publishAt } : {}),
      selfDeclaredMadeForKids: false, embeddable: true, license: "youtube",
    },
  };
  const init = await http("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST", retries: 2,
    headers: {
      authorization: `Bearer ${token}`, "content-type": "application/json; charset=UTF-8",
      "x-upload-content-length": String(size), "x-upload-content-type": "video/mp4",
    },
    body: JSON.stringify(meta),
  });
  if (!init.ok) throw new Error(`YouTube init ${init.status}: ${(await init.text()).slice(0, 500)}`);
  const location = init.headers.get("location")!;
  const res = await fetch(location, {
    method: "PUT",
    headers: { authorization: `Bearer ${token}`, "content-type": "video/mp4", "content-length": String(size) },
    body: Readable.toWeb(createReadStream(v.file)) as any,
    // @ts-expect-error Node fetch streaming body
    duplex: "half",
    signal: AbortSignal.timeout(60 * 60_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`YouTube upload ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text).id;
}

/** Custom thumbnail (50 units). Channel must be phone-verified for custom thumbnails. */
export async function setThumbnail(videoId: string, jpg: string) {
  const token = await youtubeToken();
  await httpJson(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "image/jpeg" }, body: readFileSync(jpg),
  });
}

function trimTags(tags: string[]): string[] {
  const out: string[] = [];
  let len = 0;
  for (const t of tags.map(t => t.replace(/[<>#]/g, "").trim()).filter(Boolean)) {
    const add = t.length + (t.includes(" ") ? 2 : 0) + 1;
    if (len + add > 480) break;
    out.push(t); len += add;
  }
  return out;
}

export async function videoStats(ids: string[]): Promise<any[]> {
  const token = await youtubeToken();
  const out: any[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const j = await httpJson<any>(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids.slice(i, i + 50).join(",")}`, { headers: { authorization: `Bearer ${token}` } });
    out.push(...(j.items ?? []));
  }
  return out;
}

/** Per-video watch metrics from the YouTube Analytics API (separate quota). */
export async function videoAnalytics(ids: string[], startDate: string, endDate: string): Promise<Record<string, any>> {
  const token = await youtubeToken();
  const out: Record<string, any> = {};
  for (let i = 0; i < ids.length; i += 200) {
    const filter = `video==${ids.slice(i, i + 200).join(",")}`;
    const j = await httpJson<any>(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=${startDate}&endDate=${endDate}&metrics=views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,likes,comments,shares,subscribersGained&dimensions=video&filters=${encodeURIComponent(filter)}`, { headers: { authorization: `Bearer ${token}` } });
    const cols = (j.columnHeaders ?? []).map((c: any) => c.name);
    for (const row of j.rows ?? []) out[row[0]] = Object.fromEntries(cols.map((c: string, k: number) => [c, row[k]]));
  }
  return out;
}
