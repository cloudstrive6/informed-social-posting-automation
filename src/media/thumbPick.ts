/**
 * Render all 3 thumbnail concepts, let the Thumbnail Judge compare them at full and phone size, and keep the
 * winner as the video's thumbnail. The runners-up are saved as -thumb-b/-thumb-c for YouTube's "Test & compare".
 */
import { copyFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { runAgent } from "../lib/agent.js";
import { config } from "../lib/config.js";
import { ensureDir } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { ThumbConcept, ThumbJudgement, thumbJudgementSchema, Thumbnails } from "../lib/schemas.js";
import { closeThumbs, renderCartoonThumb } from "./thumbCartoon.js";

async function contactSheet(files: string[], out: string) {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1340, height: 1500 } });
  const img = (f: string) => `data:image/jpeg;base64,${readFileSync(f).toString("base64")}`;
  const cells = files.map((f, i) => `<div class="row"><div class="lab">#${i}</div><img src="${img(f)}" style="width:640px"/><img src="${img(f)}" style="width:240px"/><img src="${img(f)}" style="width:168px"/></div>`);
  await page.setContent(`<html><body style="margin:0;background:#f4f4f4;font-family:sans-serif;padding:20px">
    <div style="font:700 22px sans-serif;margin-bottom:12px">Full · phone feed (240 px) · small (168 px)</div>${cells.join("")}
    <style>.row{display:flex;align-items:flex-start;gap:24px;margin-bottom:26px}.lab{font:900 40px sans-serif;width:70px}img{border-radius:10px}</style></body></html>`);
  await page.screenshot({ path: out, type: "jpeg", quality: 88, fullPage: true });
  await b.close();
}

export async function pickThumbnail(thumbs: Thumbnails, title: string, finalDir: string, id: string) {
  const work = ensureDir(join(finalDir, "..", "thumbs"));
  const concepts = thumbs.concepts.slice(0, 3);
  const files: string[] = [];
  for (const [i, c] of concepts.entries()) {
    try { files.push(await renderCartoonThumb(c, join(work, `candidate-${i}.jpg`))); }
    catch (e) { log.warn(`thumbnail concept ${i} failed to render: ${(e as Error).message}`); files.push(""); }
  }
  await closeThumbs();
  const ok = files.map((f, i) => (f ? i : -1)).filter(i => i >= 0);
  if (!ok.length) throw new Error("no thumbnail concept could be rendered");
  let best = ok.includes(Math.round(thumbs.chosen_index)) ? Math.round(thumbs.chosen_index) : ok[0];
  let judgement: ThumbJudgement | undefined;
  try {
    const sheet = join(work, "sheet.jpg");
    await contactSheet(ok.map(i => files[i]), sheet);
    judgement = await runAgent<ThumbJudgement>({
      agent: "thumbnail-judge", model: config.models.critic, schema: thumbJudgementSchema, tools: ["Read"], cwd: work, maxTurns: 6, effort: "medium",
      input: {
        title, instructions: `Open the contact sheet with the Read tool: ${resolve(sheet)}. Rows #0…#${ok.length - 1} are the candidates, in this order.`,
        candidates: ok.map((i, row) => ({ row, headline: concepts[i].headline, layout: concepts[i].layout, psychology: concepts[i].psychology })),
      },
    });
    const row = Math.round(judgement.best_index);
    if (ok[row] !== undefined) best = ok[row];
    log.info(`thumbnail judge: picked #${row} (${concepts[best].layout}, "${concepts[best].headline}") — ${judgement.reasoning.slice(0, 160)}`);
  } catch (e) { log.warn(`thumbnail judge failed, keeping the designer's pick: ${(e as Error).message}`); }

  const main = join(finalDir, `${id}-thumb.jpg`);
  copyFileSync(files[best], main);
  // runners-up for YouTube Studio's Test & compare
  ok.filter(i => i !== best).forEach((i, k) => copyFileSync(files[i], join(finalDir, `${id}-thumb-${"bc"[k]}.jpg`)));
  return {
    concept: concepts[best] as ThumbConcept, file: main, judgement,
    /** re-render the winner after the packaging check edits its text */
    rerender: async (c: ThumbConcept) => { const f = await renderCartoonThumb(c, main); await closeThumbs(); return f; },
  };
}
