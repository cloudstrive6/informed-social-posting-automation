import { XMLParser } from "fast-xml-parser";
import { env } from "../lib/config.js";
import { http, httpJson } from "../lib/http.js";
import { log } from "../lib/log.js";

/** One raw observation from the outside world. Kept compact: the Trend Scout agent reads all of these. */
export interface Signal { source: string; title: string; url?: string; metric?: string; published?: string }

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const HOURS = 3600_000;

// word-start match so e.g. "liver" doesn't fire on "Oliver"; plus medical suffixes (-itis, -osis, -emia)
const HEALTH_RX = new RegExp(String.raw`\b(?:health|medic|disease|syndrome|virus|viral|infect|vaccin|flu|covid|measles|cancer|tumou?r|heart|cardio|stroke|diabet|insulin|glucose|obes|weight|diet|nutri|vitamin|mineral|protein|supplement|sleep|insomnia|brain|dementia|alzheim|parkinson|mental|anxiety|depress|adhd|autism|gut|microbio|probiotic|liver|kidney|blood|cholesterol|hormone|estrogen|testosterone|menopaus|pregnan|fertility|longevity|aging|fitness|exercise|muscle|fasting|keto|sugar|caffeine|coffee|alcohol|smok|vape|ozempic|semaglutide|tirzepatide|glp-1|wegovy|mounjaro|fda|cdc|who|outbreak|allergy|asthma|skin|eczema|migraine|pain|inflamm|immune|arthritis|osteopor|bone|eye|hearing|dental|tooth|nicotine|drug|pill)|\w(?:itis|osis|emia)\b`, "i");

async function rss(source: string, url: string, maxAgeHours = 72, limit = 30): Promise<Signal[]> {
  const res = await http(url, { retries: 1, timeoutMs: 30_000 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const doc = xml.parse(await res.text());
  const items: any[] = [].concat(doc?.rss?.channel?.item ?? doc?.feed?.entry ?? []);
  const cutoff = Date.now() - maxAgeHours * HOURS;
  return items
    .map(i => ({
      source,
      title: String(i.title?.["#text"] ?? i.title ?? "").trim(),
      url: typeof i.link === "string" ? i.link : i.link?.["@_href"],
      published: i.pubDate ?? i.published ?? i.updated,
      metric: i["ht:approx_traffic"] ? `~${i["ht:approx_traffic"]} searches` : undefined,
    }))
    .filter(s => s.title && (!s.published || Date.parse(s.published) >= cutoff || Number.isNaN(Date.parse(s.published))))
    .slice(0, limit);
}

/** Google Trends "trending now" daily searches (all categories; the agent picks the health ones). */
async function googleTrends(): Promise<Signal[]> {
  const out: Signal[] = [];
  for (const geo of ["US", "GB", "CA", "AU"]) {
    try { out.push(...(await rss(`google-trends-${geo}`, `https://trends.google.com/trending/rss?geo=${geo}`, 48, 25))); }
    catch (e) { log.warn(`google trends ${geo}: ${(e as Error).message}`); }
  }
  return out;
}

/** Wikipedia: health-looking articles whose daily views jumped vs a week earlier (great early-interest signal). */
async function wikipediaSpikes(): Promise<Signal[]> {
  const day = (n: number) => {
    const d = new Date(Date.now() - n * 24 * HOURS);
    return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}`;
  };
  const top = async (n: number) => {
    const j = await httpJson<any>(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${day(n)}`);
    return new Map<string, number>(j.items[0].articles.map((a: any) => [a.article, a.views]));
  };
  const [now, before] = await Promise.all([top(1), top(8)]);
  const rows: Signal[] = [];
  for (const [article, views] of now) {
    const title = article.replace(/_/g, " ");
    if (!HEALTH_RX.test(title) || /^(Main Page|Special:|Wikipedia:)/.test(title)) continue;
    const prev = before.get(article);
    const ratio = prev ? views / prev : Infinity;
    if (ratio >= 1.5) rows.push({
      source: "wikipedia-spike", title,
      url: `https://en.wikipedia.org/wiki/${article}`,
      metric: prev ? `${views.toLocaleString()} views/day, ${ratio.toFixed(1)}x vs last week` : `${views.toLocaleString()} views/day, new in top 1000`,
    });
  }
  return rows.slice(0, 40);
}

const SUBREDDITS = ["Health", "nutrition", "longevity", "Supplements", "sleep", "Fitness", "ScientificNutrition",
  "Biohackers", "intermittentfasting", "loseit", "Menopause", "HealthyFood", "medicine", "science"];

async function redditToken(): Promise<string | undefined> {
  const id = env("REDDIT_CLIENT_ID"), secret = env("REDDIT_CLIENT_SECRET");
  if (!id || !secret) return undefined;
  const j = await httpJson<any>("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: { authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"), "content-type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  return j.access_token;
}

/** Reddit rising posts. Uses app-only OAuth when REDDIT_CLIENT_ID/SECRET are set (cloud IPs are often blocked otherwise). */
async function reddit(): Promise<Signal[]> {
  const token = await redditToken().catch(() => undefined);
  const out: Signal[] = [];
  for (const sub of SUBREDDITS) {
    try {
      const url = token ? `https://oauth.reddit.com/r/${sub}/rising?limit=15` : `https://www.reddit.com/r/${sub}/rising.json?limit=15`;
      const j = await httpJson<any>(url, { retries: 1, headers: token ? { authorization: `Bearer ${token}` } : {} });
      for (const c of j.data?.children ?? []) {
        const p = c.data;
        if (p.stickied || (sub === "science" && !HEALTH_RX.test(p.title))) continue;
        out.push({ source: `reddit/r/${sub}`, title: p.title, url: `https://reddit.com${p.permalink}`, metric: `${p.score} upvotes, ${p.num_comments} comments` });
      }
    } catch (e) { log.warn(`reddit r/${sub}: ${(e as Error).message.slice(0, 120)}`); }
  }
  return out;
}

const JOURNALS = ["N Engl J Med", "Lancet", "JAMA", "BMJ", "Nat Med", "JAMA Intern Med", "JAMA Netw Open", "Ann Intern Med",
  "Nature", "Science", "Cell", "Sci Transl Med", "Circulation", "Eur Heart J", "Diabetes Care", "Am J Clin Nutr", "Gut",
  "Lancet Public Health", "Lancet Diabetes Endocrinol", "Nat Aging", "Cell Metab", "Sleep", "Br J Sports Med", "JAMA Neurol", "JAMA Pediatr"];

/** New papers in top journals (last 3 days): the earliest possible signal of a coming news cycle. */
async function pubmed(): Promise<Signal[]> {
  const key = env("NCBI_API_KEY") ? `&api_key=${env("NCBI_API_KEY")}` : "";
  const term = `(${JOURNALS.map(j => `"${j}"[ta]`).join(" OR ")}) AND (randomized controlled trial[pt] OR meta-analysis[pt] OR systematic review[pt] OR cohort[tiab] OR trial[tiab])`;
  const s = await httpJson<any>(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=60&datetype=edat&reldate=3&sort=relevance&term=${encodeURIComponent(term)}${key}`);
  const ids: string[] = s.esearchresult?.idlist ?? [];
  if (!ids.length) return [];
  const sum = await httpJson<any>(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}${key}`);
  return ids.map(id => sum.result?.[id]).filter(Boolean).map((r: any) => ({
    source: `pubmed/${r.source}`, title: r.title, url: `https://pubmed.ncbi.nlm.nih.gov/${r.uid}/`, published: r.epubdate || r.pubdate,
  }));
}

const FEEDS: [string, string][] = [
  ["sciencedaily-health", "https://www.sciencedaily.com/rss/health_medicine.xml"],
  ["medicalxpress", "https://medicalxpress.com/rss-feed/"],
  ["google-news-health", "https://news.google.com/rss/headlines/section/topic/HEALTH?hl=en-US&gl=US&ceid=US:en"],
  ["google-news-study", "https://news.google.com/rss/search?q=%22new+study%22+health+when:2d&hl=en-US&gl=US&ceid=US:en"],
  ["statnews", "https://www.statnews.com/feed/"],
  ["nih-news", "https://www.nih.gov/news-releases/feed.xml"],
  ["fda-press", "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml"],
  ["who-news", "https://www.who.int/rss-feeds/news-english.xml"],
];

async function newsFeeds(): Promise<Signal[]> {
  const res = await Promise.allSettled(FEEDS.map(([n, u]) => rss(n, u, 72, 25)));
  return res.flatMap((r, i) => {
    if (r.status === "rejected") { log.warn(`feed ${FEEDS[i][0]}: ${String(r.reason).slice(0, 100)}`); return []; }
    return r.value;
  });
}

const YT_QUERIES = ["health", "nutrition science", "longevity", "sleep", "gut health", "supplements", "weight loss study", "doctor explains"];

/** YouTube videos from the last 72h with outsized views-per-hour. Needs YOUTUBE_API_KEY (use a separate Google Cloud project from uploads — search costs 100 quota units). */
async function youtubeOutliers(): Promise<Signal[]> {
  const key = env("YOUTUBE_API_KEY");
  if (!key) { log.warn("youtube research skipped: no YOUTUBE_API_KEY"); return []; }
  const after = new Date(Date.now() - 72 * HOURS).toISOString();
  const ids = new Set<string>();
  for (const q of YT_QUERIES) {
    const j = await httpJson<any>(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&order=viewCount&maxResults=15&relevanceLanguage=en&publishedAfter=${after}&q=${encodeURIComponent(q)}&key=${key}`);
    for (const it of j.items ?? []) ids.add(it.id.videoId);
  }
  if (!ids.size) return [];
  const vids: any[] = [];
  const all = [...ids];
  for (let i = 0; i < all.length; i += 50) {
    const j = await httpJson<any>(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${all.slice(i, i + 50).join(",")}&key=${key}`);
    vids.push(...(j.items ?? []));
  }
  return vids
    .map(v => {
      const hours = Math.max(1, (Date.now() - Date.parse(v.snippet.publishedAt)) / HOURS);
      const vph = Number(v.statistics.viewCount ?? 0) / hours;
      return { v, vph };
    })
    .sort((a, b) => b.vph - a.vph)
    .slice(0, 30)
    .map(({ v, vph }) => ({
      source: "youtube-rising", title: `${v.snippet.title} — ${v.snippet.channelTitle}`,
      url: `https://www.youtube.com/watch?v=${v.id}`, metric: `${Math.round(vph).toLocaleString()} views/hour`,
    }));
}

export async function collectSignals(): Promise<Signal[]> {
  const sources: [string, () => Promise<Signal[]>][] = [
    ["google-trends", googleTrends], ["wikipedia", wikipediaSpikes], ["reddit", reddit],
    ["pubmed", pubmed], ["news", newsFeeds], ["youtube", youtubeOutliers],
  ];
  const results = await Promise.allSettled(sources.map(([, f]) => f()));
  const all: Signal[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") { log.info(`signals: ${sources[i][0]} → ${r.value.length}`); all.push(...r.value); }
    else log.warn(`signals: ${sources[i][0]} failed: ${String(r.reason).slice(0, 200)}`);
  });
  const seen = new Set<string>();
  return all.filter(s => { const k = s.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}
