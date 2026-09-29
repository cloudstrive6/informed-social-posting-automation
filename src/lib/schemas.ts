/* JSON Schemas (draft-07) for every agent's structured output, plus matching TS types. */

const str = { type: "string" } as const;
const num = { type: "number" } as const;
const strArr = { type: "array", items: str } as const;
const obj = (properties: Record<string, object>, required = Object.keys(properties)) =>
  ({ type: "object", properties, required, additionalProperties: false });
const arr = (items: object, extra: object = {}) => ({ type: "array", items, ...extra });

// ---------- Trend radar ----------
export interface TrendCandidate {
  topic: string; angle: string; keywords: string[];
  stage: "emerging" | "rising" | "peaking" | "evergreen";
  momentum: number; predicted_peak: string; why_now: string; competition: "low" | "medium" | "high";
  evidence: { source: string; signal: string; url: string }[];
  safety: "ok" | "caution" | "reject"; formats: ("long" | "short" | "carousel")[];
}
export interface Radar { summary: string; candidates: TrendCandidate[] }
export const radarSchema = obj({
  summary: str,
  candidates: arr(obj({
    topic: str, angle: str, keywords: strArr,
    stage: { enum: ["emerging", "rising", "peaking", "evergreen"] },
    momentum: { type: "number", minimum: 0, maximum: 100 },
    predicted_peak: str, why_now: str,
    competition: { enum: ["low", "medium", "high"] },
    evidence: arr(obj({ source: str, signal: str, url: str })),
    safety: { enum: ["ok", "caution", "reject"] },
    formats: arr({ enum: ["long", "short", "carousel"] }),
  }), { minItems: 5 }),
});

// ---------- Daily plan ----------
export interface PlannedPiece {
  id: string; kind: "long" | "short" | "carousel"; topic: string; angle: string;
  working_title: string; target_keyword: string; trend_stage: string; why: string;
  /** content pillar (config.youtube.playlists[].pillar): decides the YouTube playlist */
  pillar?: string;
}
export interface DayPlan { rationale: string; pieces: PlannedPiece[] }
export const planSchema = obj({
  rationale: str,
  pieces: arr(obj({
    id: str, kind: { enum: ["long", "short", "carousel"] }, topic: str, angle: str,
    working_title: str, target_keyword: str, trend_stage: str, why: str, pillar: str,
  })),
});

// ---------- Fact-check: topic screen ----------
export interface TopicScreen { decisions: { id: string; verdict: "approve" | "modify" | "reject"; notes: string; safer_angle: string }[] }
export const topicScreenSchema = obj({
  decisions: arr(obj({ id: str, verdict: { enum: ["approve", "modify", "reject"] }, notes: str, safer_angle: str })),
});

// ---------- Scripts ----------
export type VisualKind = "broll" | "stat" | "list" | "myth_fact" | "quote" | "chapter";
export interface Scene {
  id: string; section: string; narration: string; on_screen_text: string;
  visual: {
    kind: VisualKind; stock_query: string;
    stat_value?: string; stat_label?: string; items?: string[];
    myth?: string; fact?: string; quote?: string; attribution?: string;
  };
  retention_device: string; source_ids: string[];
}
export interface Source { id: string; title: string; publisher: string; year: string; url: string }
export interface Script {
  working_title: string; target_keyword: string; hook_pattern: string;
  scenes: Scene[]; sources: Source[]; cta: string;
}
const sceneSchema = obj({
  id: str, section: str, narration: str, on_screen_text: str,
  visual: obj({
    kind: { enum: ["broll", "stat", "list", "myth_fact", "quote", "chapter"] }, stock_query: str,
    stat_value: str, stat_label: str, items: strArr, myth: str, fact: str, quote: str, attribution: str,
  }, ["kind", "stock_query"]),
  retention_device: str, source_ids: strArr,
});
export const scriptSchema = obj({
  working_title: str, target_keyword: str, hook_pattern: str,
  scenes: arr(sceneSchema, { minItems: 3 }),
  sources: arr(obj({ id: str, title: str, publisher: str, year: str, url: str })),
  cta: str,
});

// ---------- Fact-check: content ----------
export interface FactCheck {
  verdict: "PASS" | "REVISE" | "HOLD"; summary: string;
  issues: { location: string; claim: string; problem: string; severity: "minor" | "major" | "critical"; fix: string }[];
  verified_sources: Source[];
}
export const factCheckSchema = obj({
  verdict: { enum: ["PASS", "REVISE", "HOLD"] }, summary: str,
  issues: arr(obj({ location: str, claim: str, problem: str, severity: { enum: ["minor", "major", "critical"] }, fix: str })),
  verified_sources: arr(obj({ id: str, title: str, publisher: str, year: str, url: str })),
});

// ---------- Narration direction ----------
export interface Narration { voice_notes: string; scenes: { id: string; spoken_text: string; speed: number; pause_after_ms: number }[] }
export const narrationSchema = obj({
  voice_notes: str,
  scenes: arr(obj({
    id: str, spoken_text: str,
    speed: { type: "number", minimum: 0.8, maximum: 1.2 },
    pause_after_ms: { type: "number", minimum: 0, maximum: 1500 },
  })),
});

// ---------- Packaging ----------
export interface Titles { candidates: { title: string; formula: string; ctr_score: number }[]; chosen: string; reasoning: string }
export const titlesSchema = obj({
  candidates: arr(obj({ title: str, formula: str, ctr_score: num }), { minItems: 5 }),
  chosen: str, reasoning: str,
});

export type ThumbLayout = "reaction" | "big-number" | "warning" | "versus" | "mystery" | "before-after";
export const THUMB_FACES = ["none", "happy", "worried", "shocked", "sad", "angry", "sick", "proud", "sleepy"] as const;
export const THUMB_PROPS = ["none", "arrow", "red-circle", "question", "cross", "check", "alarm", "magnifier"] as const;
export interface ThumbConcept {
  headline: string; highlight_word: string; subtext: string; layout: ThumbLayout;
  /** the click trigger this concept uses and why it fits the title (curiosity gap, loss aversion, surprise…) */
  psychology: string; emotion: string;
  hero_art: string; hero_face: (typeof THUMB_FACES)[number];
  second_art: string; second_face: (typeof THUMB_FACES)[number];
  prop: (typeof THUMB_PROPS)[number]; accent: "alert" | "highlight" | "green" | "blue";
  badge: string; versus_left: string; versus_right: string;
}
export interface Thumbnails { concepts: ThumbConcept[]; chosen_index: number; reasoning: string }
export const thumbnailsSchema = obj({
  concepts: arr(obj({
    headline: str, highlight_word: str, subtext: str,
    layout: { enum: ["reaction", "big-number", "warning", "versus", "mystery", "before-after"] },
    psychology: str, emotion: str,
    hero_art: str, hero_face: { enum: [...THUMB_FACES] }, second_art: str, second_face: { enum: [...THUMB_FACES] },
    prop: { enum: [...THUMB_PROPS] }, accent: { enum: ["alert", "highlight", "green", "blue"] },
    badge: str, versus_left: str, versus_right: str,
  }), { minItems: 3, maxItems: 3 }),
  chosen_index: num, reasoning: str,
});

export interface ThumbJudgement { scores: { index: number; ctr: number; legibility: number; issues: string[] }[]; best_index: number; reasoning: string }
export const thumbJudgementSchema = obj({
  scores: arr(obj({ index: num, ctr: num, legibility: num, issues: strArr })),
  best_index: num, reasoning: str,
});

export interface Seo { description: string; tags: string[]; hashtags: string[]; pinned_comment: string }
export const seoSchema = obj({ description: str, tags: strArr, hashtags: strArr, pinned_comment: str });

export interface LongPackaging { title: string; thumbnail_headline: string; thumbnail_subtext: string; description: string; pinned_comment: string }
export const longPackagingSchema = obj({ title: str, thumbnail_headline: str, thumbnail_subtext: str, description: str, pinned_comment: str });

export interface SocialCopy {
  youtube_short_title: string; youtube_short_description: string;
  instagram_caption: string; tiktok_caption: string; facebook_caption: string; threads_caption: string;
}
export const socialCopySchema = obj({
  youtube_short_title: str, youtube_short_description: str,
  instagram_caption: str, tiktok_caption: str, facebook_caption: str, threads_caption: str,
});

// ---------- Carousels (comic infographics) ----------
export type SlideKind = "hook" | "stat" | "pictogram" | "comparison" | "steps" | "chart" | "icon_grid" | "body_map" | "myth_fact" | "checklist" | "cta";
export interface SlideItem { label: string; detail: string; icon: string; value: string }
export interface Slide {
  kind: SlideKind;
  headline: string; body: string;
  /** big number for stat/pictogram ("1 in 3", "58%") */
  stat: string;
  /** main illustration, plain English ("woman sleeping", "health:liver"); "" for none */
  icon: string;
  /** what the Medi mascot says in a speech bubble; "" for no mascot */
  bubble: string;
  /** pictogram: filled of total people (e.g. 3 of 10) */
  filled: number; total: number;
  /** comparison column titles + illustrations */
  columns: string[]; column_icons: string[];
  /** rows/tips/steps/bars/callouts depending on kind */
  items: SlideItem[];
}
export interface Carousel { title: string; slides: Slide[]; sources: Source[] }
const slideItem = obj({ label: str, detail: str, icon: str, value: str });
export const carouselSchema = obj({
  title: str,
  slides: arr(obj({
    kind: { enum: ["hook", "stat", "pictogram", "comparison", "steps", "chart", "icon_grid", "body_map", "myth_fact", "checklist", "cta"] },
    headline: str, body: str, stat: str, icon: str, bubble: str,
    filled: { type: "number", minimum: 0, maximum: 10 }, total: { type: "number", minimum: 0, maximum: 10 },
    columns: arr(str, { maxItems: 2 }), column_icons: arr(str, { maxItems: 2 }),
    items: arr(slideItem, { maxItems: 6 }),
  }), { minItems: 5, maxItems: 10 }),
  sources: arr(obj({ id: str, title: str, publisher: str, year: str, url: str })),
});

// ---------- Analytics ----------
export interface Learnings { learnings_markdown: string; schedule_suggestions: string; topics_to_double_down: string[] }
export const learningsSchema = obj({ learnings_markdown: str, schedule_suggestions: str, topics_to_double_down: strArr });
