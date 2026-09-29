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
  const lists = config.youtube?.playlists ?? [];
  const pillar = lists.find(l => l.pillar === item.plan.pillar) ?? lists.find(l => l.pillar === "general");
  return [...(pillar ? [pillar] : []), ...(item.kind === "short" && config.youtube?.shortsPlaylist ? [config.youtube.shortsPlaylist] : [])];
}

/** Add an uploaded video to its playlists. Never throws: a playlist problem must not fail a publish. */
export async function addToPlaylists(item: ContentItem, videoId: string): Promise<string[]> {
  if (!item.plan.pillar) item.plan.pillar = await classifyPillar(item);
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
