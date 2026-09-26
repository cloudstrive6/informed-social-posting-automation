import { join } from "node:path";
import { ContentItem } from "../lib/items.js";
import { ensureDir } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { Carousel, carouselSchema } from "../lib/schemas.js";
import { renderComicCarousel } from "../media/comic.js";
import { checkPackaging, loadPiece, newItem, socialCopy, workDir, writeWithFactCheck } from "./common.js";

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
  const slides = await renderComicCarousel(carousel, final);
  item.media.slides = slides;

  const social = await socialCopy(item, { title: carousel.title, slides: carousel.slides, sources: factcheck.verified_sources });
  item.package = { title: carousel.title, social };
  const pc = await checkPackaging(item, { hook_slide: carousel.slides[0], captions: social }, factcheck.verified_sources);
  if (pc.verdict !== "PASS" && item.status !== "held") { item.status = "held"; item.hold_reason = `Packaging check ${pc.verdict}: ${pc.summary}`; }
  return item;
}
