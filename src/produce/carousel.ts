import { join } from "node:path";
import { ContentItem } from "../lib/items.js";
import { ensureDir } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { Carousel, carouselSchema } from "../lib/schemas.js";
import { renderComicCarousel } from "../media/comic.js";
import { packagingLoop, loadPiece, newItem, socialCopy, workDir, writeWithFactCheck } from "./common.js";

export async function produceCarousel(date: string, pieceId: string): Promise<ContentItem> {
  const { piece, index } = loadPiece(date, pieceId);
  const item = newItem(date, piece, index);
  const dir = workDir(date, item.id);
  const final = ensureDir(join(dir, "final"));
  log.step(`CAROUSEL ${item.id}: ${piece.working_title}`);

  const { content: carousel, factcheck, held, holdReason } = await writeWithFactCheck<Carousel>("carousel-designer", carouselSchema, { piece });
  item.carousel = carousel; item.factcheck = factcheck;
  if (held) { item.status = "held"; item.hold_reason = holdReason; }

  // comic-style infographic slides built from the illustration packs (no stock photos)
  const { files: slides, misfits } = await renderComicCarousel(carousel, final);
  item.media.slides = slides;
  if (misfits.length && item.status !== "held") {
    item.status = "held";
    item.hold_reason = `Quality check: slide ${misfits.join(", ")} doesn't fit the frame (text or icons run off the canvas or into the footer)`;
  }

  const summary = { title: carousel.title, slides: carousel.slides, sources: factcheck.verified_sources };
  const pk = await packagingLoop(item, await socialCopy(item, summary), factcheck.verified_sources, { slides: carousel.slides },
    (draft, fact_check) => socialCopy(item, summary, { draft, fact_check }), captions => ({ captions }));
  item.package = { title: carousel.title, social: pk.packaging };
  item.qa = { ...item.qa, packaging: { verdict: pk.check.verdict, issues: pk.check.issues } };
  if (pk.held && item.status !== "held") { item.status = "held"; item.hold_reason = pk.reason; }
  return item;
}
