/**
 * YouTube playlists: every uploaded video goes into its content-pillar playlist (and Shorts also into the Shorts
 * playlist). Playlists are created on first use and their ids cached in data/youtube-playlists.json.
 * Needs the youtube.force-ssl scope on the refresh token.
 */
import { join } from "node:path";
import { config, DATA } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { httpJson } from "../lib/http.js";
import type { ContentItem } from "../lib/items.js";
import { log } from "../lib/log.js";
import { runAgent } from "../lib/agent.js";
import { youtubeToken } from "./youtube.js";
import { nicheMatch } from "./funnel.js";

const CACHE = join(DATA, "youtube-playlists.json");
const API = "https://www.googleapis.com/youtube/v3";

async function yt<T>(path: string, init: { method?: string; body?: object } = {}): Promise<T> {
  const token = await youtubeToken();
  return httpJson<T>(`${API}/${path}`, {
    method: init.method ?? "GET",
    headers: { authorization: `Bearer ${token}`, ...(init.body ? { "content-type": "application/json" } : {}) },
    ...(init.body ? { body: JSON.stringify(init.body) } : {}),
  });
}

/** Id of the playlist with this title, creating it (public) if the channel doesn't have it yet. */
async function playlistId(title: string, description: string): Promise<string> {
  const cache = readJson<Record<string, string>>(CACHE, {});
  if (cache[title]) return cache[title];
  let page: string | undefined;
  do {
    const j = await yt<any>(`playlists?part=snippet&mine=true&maxResults=50${page ? `&pageToken=${page}` : ""}`);
    for (const p of j.items ?? []) if (!cache[p.snippet.title]) cache[p.snippet.title] = p.id;
    page = j.nextPageToken;
  } while (page);
  if (!cache[title]) {
    const created = await yt<any>("playlists?part=snippet,status", { method: "POST", body: { snippet: { title, description, defaultLanguage: "en" }, status: { privacyStatus: "public" } } });
    cache[title] = created.id;
    log.info(`YouTube playlist created: ${title}`);
  }
  writeJson(CACHE, cache);
  return cache[title];
}

/** Pillar for items planned before pillar tagging existed. */
async function classifyPillar(item: ContentItem): Promise<string | undefined> {
  const lists = config.youtube?.playlists ?? [];
  try {
    const r = await runAgent<{ pillar: string }>({
      agent: "playlist-curator", model: config.models.polish, effort: "low",
      schema: { type: "object", additionalProperties: false, required: ["pillar"], properties: { pillar: { enum: lists.map(l => l.pillar) } } },
      input: { title: item.package.title ?? item.plan.working_title, topic: item.plan.topic, playlists: lists },
    });
    return r.pillar;
  } catch { return undefined; }
}

/** The playlists a video belongs in: its pillar's playlist, plus the Shorts playlist for Shorts. */
export function playlistsFor(item: ContentItem): { title: string; description: string }[] {
  // a topic focus with its own playlists (e.g. plague) replaces the GLP-1 pillar lists while it's on
  const nicheLists = config.niche?.enabled ? config.niche.youtube : undefined;
  if (nicheLists) return [nicheLists.playlist, ...(item.kind === "short" && nicheLists.shortsPlaylist ? [nicheLists.shortsPlaylist] : [])];
  const lists = config.youtube?.playlists ?? [];
  const pillar = lists.find(l => l.pillar === item.plan.pillar) ?? lists.find(l => l.pillar === "general");
  const series = seriesFor(item);
  return [...(pillar ? [pillar] : []), ...(series && series.title !== pillar?.title ? [series] : []), ...(item.kind === "short" && config.youtube?.shortsPlaylist ? [config.youtube.shortsPlaylist] : [])];
}

/** The series playlist of an in-niche long video (see config.youtube.series), if any. */
export function seriesFor(item: ContentItem): { title: string; description: string } | undefined {
  if (item.kind !== "long" || !nicheMatch(item)) return;
  const text = `${item.package?.title ?? ""} ${item.plan.topic}`;
  return (config.youtube?.series ?? []).find(s => !s.match || new RegExp(s.match, "i").test(text));
}

/** Put every uploaded in-niche long video into its series playlist (adds missing ones only). */
export async function syncSeriesPlaylists(items: ContentItem[]): Promise<Record<string, number>> {
  const have = new Map<string, Set<string>>(), added: Record<string, number> = {};
  for (const item of items) {
    const s = seriesFor(item);
    const yt0 = item.posts.find(p => p.platform === "youtube" && p.format === "long" && p.remote_id && (p.status === "published" || p.status === "scheduled"));
    if (!s || !yt0?.remote_id || item.status !== "ready") continue;
    const id = await playlistId(s.title, s.description);
    if (!have.has(id)) {
      const set = new Set<string>();
      let page: string | undefined;
      do {
        const j = await again(() => yt<any>(`playlistItems?part=snippet&playlistId=${id}&maxResults=50${page ? `&pageToken=${page}` : ""}`));
        for (const it of j.items ?? []) set.add(it.snippet.resourceId.videoId);
        page = j.nextPageToken;
      } while (page);
      have.set(id, set);
    }
    if (have.get(id)!.has(yt0.remote_id)) continue;
    await again(() => yt("playlistItems?part=snippet", { method: "POST", body: { snippet: { playlistId: id, resourceId: { kind: "youtube#video", videoId: yt0.remote_id } } } }));
    have.get(id)!.add(yt0.remote_id);
    added[s.title] = (added[s.title] ?? 0) + 1;
    log.info(`${item.date}/${item.id} → series "${s.title}"`);
  }
  return added;
}

/** Add an uploaded video to its playlists. Never throws: a playlist problem must not fail a publish. */
export async function addToPlaylists(item: ContentItem, videoId: string): Promise<string[]> {
  if (!item.plan.pillar && !(config.niche?.enabled && config.niche.youtube)) item.plan.pillar = await classifyPillar(item);
  const added: string[] = [];
  for (const pl of playlistsFor(item)) {
    try {
      const id = await playlistId(pl.title, pl.description);
      // a just-created playlist or just-uploaded video can answer 409/5xx for a few seconds: retry with backoff
      for (let attempt = 1; ; attempt++) {
        try {
          await yt("playlistItems?part=snippet", { method: "POST", body: { snippet: { playlistId: id, resourceId: { kind: "youtube#video", videoId } } } });
          break;
        } catch (e) {
          if (attempt >= 5 || !/HTTP (409|5\d\d)/.test((e as Error).message)) throw e;
          await new Promise(r => setTimeout(r, attempt * 5000));
        }
      }
      added.push(pl.title);
    } catch (e) {
      log.warn(`playlist "${pl.title}" for ${videoId}: ${(e as Error).message.slice(0, 200)}`);
    }
  }
  if (added.length) log.info(`${item.id} → playlists: ${added.join(", ")}`);
  return added;
}

/**
 * Maintenance: put a video in exactly the playlists it belongs in now. Removes it from any of our other
 * playlists (pillar, Shorts, focus playlists, including saved focuses) and adds it where it's missing.
 */
export async function syncPlaylists(item: ContentItem, videoId: string): Promise<{ removed: string[]; added: string[] }> {
  if (!item.plan.pillar && !(config.niche?.enabled && config.niche.youtube)) item.plan.pillar = await classifyPillar(item);
  const want = playlistsFor(item);
  const ours = new Set<string>([
    ...(config.youtube?.playlists ?? []).map(p => p.title),
    ...(config.youtube?.shortsPlaylist ? [config.youtube.shortsPlaylist.title] : []),
    ...[config.niche, ...Object.values((config as any)._saved_niches ?? {})].flatMap((n: any) =>
      n?.youtube ? [n.youtube.playlist?.title, n.youtube.shortsPlaylist?.title].filter(Boolean) : []),
  ]);
  for (const pl of want) await playlistId(pl.title, pl.description); // creates missing ones, fills the id cache
  const ids = readJson<Record<string, string>>(CACHE, {});
  const entries = async (title: string) =>
    ((await yt<any>(`playlistItems?part=id&playlistId=${ids[title]}&videoId=${videoId}&maxResults=5`)).items ?? []) as { id: string }[];
  const removed: string[] = [], added: string[] = [];
  for (const title of ours) {
    if (want.some(w => w.title === title) || !ids[title]) continue;
    for (const it of await entries(title)) { await yt(`playlistItems?id=${it.id}`, { method: "DELETE" }); removed.push(title); }
  }
  for (const pl of want) {
    if ((await entries(pl.title)).length) continue;
    await yt("playlistItems?part=snippet", { method: "POST", body: { snippet: { playlistId: ids[pl.title], resourceId: { kind: "youtube#video", videoId } } } });
    added.push(pl.title);
  }
  log.info(`${item.id} → playlists: ${want.map(w => w.title).join(", ")}${removed.length ? ` (removed from ${removed.join(", ")})` : ""}${added.length ? ` (added to ${added.join(", ")})` : ""}`);
  return { removed, added };
}

/**
 * Curated playlist from config/playlists/<name>.json (title, description, ordered video ids): created if missing,
 * then made to contain exactly those videos in that order.
 */
/** YouTube answers 409/5xx for a few seconds after a playlist is created or edited: retry with backoff. */
async function again<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try { return await fn(); }
    catch (e) {
      if (attempt >= 6 || !/HTTP (409|5\d\d)/.test((e as Error).message)) throw e;
      await new Promise(r => setTimeout(r, attempt * 5000));
    }
  }
}

export async function syncCuratedPlaylist(name: string) {
  const { ROOT } = await import("../lib/config.js");
  const spec = readJson<{ title: string; description: string; videos: string[] }>(join(ROOT, "config", "playlists", `${name}.json`), undefined as any);
  if (!spec?.videos?.length) throw new Error(`config/playlists/${name}.json missing or empty`);
  const id = await playlistId(spec.title, spec.description);
  await again(() => yt("playlists?part=snippet", { method: "PUT", body: { id, snippet: { title: spec.title, description: spec.description, defaultLanguage: "en" } } }));
  const items: { id: string; videoId: string; position: number }[] = [];
  let page: string | undefined;
  do {
    const j = await again(() => yt<any>(`playlistItems?part=snippet&playlistId=${id}&maxResults=50${page ? `&pageToken=${page}` : ""}`));
    for (const it of j.items ?? []) items.push({ id: it.id, videoId: it.snippet.resourceId.videoId, position: it.snippet.position });
    page = j.nextPageToken;
  } while (page);
  for (const it of items.filter(i => !spec.videos.includes(i.videoId))) await again(() => yt(`playlistItems?id=${it.id}`, { method: "DELETE" }));
  for (const [position, videoId] of spec.videos.entries()) {
    const existing = items.find(i => i.videoId === videoId);
    const snippet = { playlistId: id, resourceId: { kind: "youtube#video", videoId }, position };
    if (existing) await again(() => yt("playlistItems?part=snippet", { method: "PUT", body: { id: existing.id, snippet } }));
    else await again(() => yt("playlistItems?part=snippet", { method: "POST", body: { snippet } }));
  }
  log.info(`playlist "${spec.title}" synced: ${spec.videos.length} videos — https://www.youtube.com/playlist?list=${id}`);
  return id;
}
