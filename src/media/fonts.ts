import { copyFileSync, createWriteStream, existsSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ROOT } from "../lib/config.js";
import { ensureDir } from "../lib/fsx.js";
import { http } from "../lib/http.js";

// Montserrat is the typeface of the InforMed brand guidelines (SIL Open Font License).
const MONTSERRAT = "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf";

/** Cache the brand font locally so renders are deterministic and offline-safe. Returns the cached path. */
export async function ensureFont(): Promise<string> {
  const dir = ensureDir(join(ROOT, ".cache", "fonts"));
  const file = join(dir, "Montserrat.ttf");
  if (!existsSync(file)) {
    const res = await http(MONTSERRAT, { timeoutMs: 60_000 });
    if (!res.ok || !res.body) throw new Error(`font download failed: ${res.status}`);
    await pipeline(Readable.fromWeb(res.body as any), createWriteStream(file));
  }
  return file;
}

/** Copy font + logos into a render project folder and return the CSS @font-face block. */
export async function installBrandAssets(projectDir: string): Promise<string> {
  const font = await ensureFont();
  const assets = ensureDir(join(projectDir, "assets"));
  copyFileSync(font, join(assets, "Montserrat.ttf"));
  for (const f of ["icon-gradient.png", "icon-white.png", "logo-horizontal-light.png", "logo-horizontal-white.png", "logo-horizontal-dark.png"]) {
    copyFileSync(join(ROOT, "brand", f), join(assets, f));
  }
  return `@font-face{font-family:"Brand";src:url("assets/Montserrat.ttf") format("truetype");font-weight:100 900;font-display:block;}`;
}
