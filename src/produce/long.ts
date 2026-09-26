import { copyFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config } from "../lib/config.js";
import { ContentItem } from "../lib/items.js";
import { ensureDir, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { creditsThisRun } from "../lib/usage.js";
import { LongPackaging, longPackagingSchema, Script, scriptSchema, Seo, seoSchema, Thumbnails, thumbnailsSchema, Titles, titlesSchema } from "../lib/schemas.js";
import { fmtTimestamp } from "../lib/time.js";
import { buildVideo } from "../media/buildVideo.js";
import { closeStills, renderThumbnail } from "../media/stills.js";
import { aiImage, stockPhoto } from "../media/stock.js";
import type { Timeline } from "../media/tts.js";
import { packagingLoop, directNarration, narrateChecked, qaBlockers, loadPiece, newItem, workDir, writeWithFactCheck } from "./common.js";

/** YouTube chapters: first at 0:00, each ≥ 10 s, at least 3 — otherwise omitted. */
export function chapters(script: Script, tl: Timeline): string {
  const starts = new Map(tl.scenes.map(s => [s.id, s.start]));
  const rows: { t: number; title: string }[] = [];
  for (const s of script.scenes) {
    if (rows.length && rows[rows.length - 1].title === s.section) continue;
    rows.push({ t: rows.length ? starts.get(s.id) ?? 0 : 0, title: s.section });
  }
  const merged = rows.filter((r, i) => i === 0 || r.t - rows[i - 1].t >= 10);
  const ok = merged.filter((r, i) => (merged[i + 1]?.t ?? tl.duration) - r.t >= 10);
  if (ok.length < 3) return "";
  ok[0].t = 0;
  return ok.map(r => `${fmtTimestamp(r.t)} ${r.title}`).join("\n");
}

export async function produceLong(date: string, pieceId: string): Promise<ContentItem> {
  const { plan, piece, index } = loadPiece(date, pieceId);
  const item = newItem(date, piece, index);
  const dir = workDir(date, item.id);
  const final = ensureDir(join(dir, "final"));
  log.step(`LONG ${item.id}: ${piece.working_title}`);

  // 1) script ⇄ fact-check
  const { content: script, factcheck, held, holdReason } = await writeWithFactCheck<Script>("scriptwriter-long", scriptSchema, {
    piece, target_minutes: config.cadence.longTargetMinutes, other_pieces_today: plan.pieces.filter(p => p.id !== piece.id).map(p => p.working_title),
  });
  item.script = script; item.factcheck = factcheck;
  if (held) { item.status = "held"; item.hold_reason = holdReason; }
  writeJson(join(dir, "script.json"), script);

  // 2) voice
  const spoken = await directNarration(script.scenes);
  const narration = await narrateChecked(spoken, dir, undefined, "long");
  const { wav, timeline } = narration;
  log.info(`narration: ${(timeline.duration / 60).toFixed(1)} min`);

  // 3) visuals + render (animated flat-vector style by default; see docs/STYLE.md)
  const built = await buildVideo({
    id: item.id, dir, out: join(final, `${item.id}.mp4`), vertical: false, topic: piece.topic, fallbackQuery: piece.target_keyword,
    scenes: script.scenes, sources: factcheck.verified_sources.length ? factcheck.verified_sources : script.sources, timeline, narrationWav: wav,
    spokenText: narration.spokenText, narrationWer: narration.wer, spokenScenes: spoken,
  });
  item.media.video = built.video;
  item.qa = { narrationWer: narration.wer, voice: narration.provider, elevenCredits: creditsThisRun(), ...built.qa };
  const blockers = qaBlockers(narration, built.qa);
  if (blockers.length && item.status !== "held") { item.status = "held"; item.hold_reason = `Quality check: ${blockers.join("; ")}`; }
  item.media.duration = timeline.duration;

  // 4) packaging: title → thumbnail → SEO description
  const ch = chapters(script, timeline);
  const summary = { topic: piece.topic, angle: piece.angle, target_keyword: piece.target_keyword, hook: script.scenes[0].narration, sections: [...new Set(script.scenes.map(s => s.section))], cta: script.cta };
  const titles = await runAgent<Titles>({ agent: "title-writer", model: config.models.packaging, schema: titlesSchema, input: { ...summary, working_title: script.working_title } });
  const thumbs = await runAgent<Thumbnails>({ agent: "thumbnail-designer", model: config.models.packaging, schema: thumbnailsSchema, input: { ...summary, title: titles.chosen } });
  const concept = thumbs.concepts[Math.min(Math.max(0, Math.round(thumbs.chosen_index)), thumbs.concepts.length - 1)];
  const imgDir = join(dir, "thumb");
  const main = (await aiImage(concept.image_prompt, 1280, 720, imgDir)) ?? (await stockPhoto(concept.stock_query, "landscape", imgDir));
  const images = concept.layout === "versus"
    ? { main, left: await stockPhoto(concept.versus_left, "portrait", imgDir), right: await stockPhoto(concept.versus_right, "portrait", imgDir) }
    : { main };
  item.media.thumbnail = await renderThumbnail(concept, images, join(final, `${item.id}-thumb.jpg`));
  await closeStills();

  const seo = await runAgent<Seo>({
    agent: "seo-writer", model: config.models.packaging, schema: seoSchema,
    input: {
      title: titles.chosen, ...summary, chapters: ch, verified_sources: factcheck.verified_sources.length ? factcheck.verified_sources : script.sources,
      key_points: script.scenes.filter(s => s.visual.kind !== "broll").map(s => s.on_screen_text), disclaimer: config.safety.disclaimer, accounts: config.accounts,
    },
  });
  item.package = {
    title: titles.chosen, title_candidates: titles.candidates.map(c => c.title), description: seo.description,
    tags: seo.tags, pinned_comment: seo.pinned_comment, thumbnail: concept, chapters: ch,
  };

  // 5) packaging must not overclaim: check → Packaging Editor applies fixes → re-check
  const draft: LongPackaging = { title: titles.chosen, thumbnail_headline: concept.headline, thumbnail_subtext: concept.subtext, description: seo.description, pinned_comment: seo.pinned_comment };
  const pk = await packagingLoop(item, draft, factcheck.verified_sources,
    { script: script.scenes.map(s => ({ section: s.section, narration: s.narration, on_screen_text: s.on_screen_text })) },
    (current, fact_check) => runAgent<LongPackaging>({ agent: "packaging-editor", model: config.models.packaging, schema: longPackagingSchema, effort: "medium", input: { packaging: current, fact_check } }),
    p => ({ ...p, description: p.description.slice(0, 1500) }));
  const fixed = pk.packaging;
  if (fixed.thumbnail_headline !== concept.headline || fixed.thumbnail_subtext !== concept.subtext) {
    concept.headline = fixed.thumbnail_headline; concept.subtext = fixed.thumbnail_subtext;
    item.media.thumbnail = await renderThumbnail(concept, images, join(final, `${item.id}-thumb.jpg`));
    await closeStills();
  }
  item.package = { ...item.package, title: fixed.title, description: fixed.description, pinned_comment: fixed.pinned_comment, thumbnail: concept };
  item.qa = { ...item.qa, packaging: { verdict: pk.check.verdict, issues: pk.check.issues } };
  if (pk.held && item.status !== "held") {
    const alt = titles.candidates.find(c => c.title !== fixed.title);
    item.status = "held"; item.hold_reason = `${pk.reason}${alt ? ` (alternative title: ${alt.title})` : ""}`;
  }
  copyFileSync(join(dir, "script.json"), join(final, `${item.id}-script.json`));
  return item;
}
