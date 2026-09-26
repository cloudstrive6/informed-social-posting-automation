import { copyFileSync, createWriteStream, existsSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { ROOT } from "../lib/config.js";
import { ensureDir } from "../lib/fsx.js";
import { http } from "../lib/http.js";

// All SIL Open Font License, cached locally so renders are deterministic and offline-safe.
const FONTS: Record<string, string> = {
  Montserrat: "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf", // brand typeface
  Fredoka: "https://github.com/google/fonts/raw/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf",       // friendly rounded headlines (cartoon posts)
  Bangers: "https://github.com/google/fonts/raw/main/ofl/bangers/Bangers-Regular.ttf",              // comic accents ("MYTH!", "FACT!")
};

/** Path of a cached font file, downloading it once if needed. */
export async function fontFile(name: keyof typeof FONTS | string = "Montserrat"): Promise<string> {
  const dir = ensureDir(join(ROOT, ".cache", "fonts"));
  const file = join(dir, `${name}.ttf`);
  if (!existsSync(file)) {
    const res = await http(FONTS[name], { timeoutMs: 60_000 });
    if (!res.ok || !res.body) throw new Error(`font ${name} download failed: ${res.status}`);
    await pipeline(Readable.fromWeb(res.body as any), createWriteStream(file));
  }
  return file;
}
export const ensureFont = () => fontFile("Montserrat");

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
