/**
 * Text hygiene for everything a viewer can read (titles, descriptions, captions, on-screen text).
 *
 * 1. fixMojibake: repairs UTF-8 that was decoded as Windows-1252 ("2â€“4 months" -> "2-4 months" after dash
 *    cleanup, "cafÃ©" -> "café"). Only runs of characters that decode cleanly as UTF-8 are touched.
 * 2. plainDashes: the owner bans em and en dashes in viewer-facing text. Numeric ranges become hyphens
 *    ("2–4" -> "2-4"), spaced or unspaced dashes between words become a comma or a plain hyphen.
 *
 * The minus sign U+2212 is NOT touched (it is used on purpose in numbers such as "−5 kg").
 */

const CP1252: Record<string, number> = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87,
  "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91,
  "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98,
  "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f,
};

// a UTF-8 lead byte as seen in 1252 (U+00C2..U+00F4), then 1-3 continuation bytes as seen in 1252
const CONT = "\\u0080-\\u00bf\\u20ac\\u201a\\u0192\\u201e\\u2026\\u2020\\u2021\\u02c6\\u2030\\u0160\\u2039\\u0152\\u017d\\u2018\\u2019\\u201c\\u201d\\u2022\\u2013\\u2014\\u02dc\\u2122\\u0161\\u203a\\u0153\\u017e\\u0178";
const RUN = new RegExp(`[\\u00c2-\\u00f4][${CONT}]{1,3}`, "g");
const decoder = new TextDecoder("utf-8", { fatal: true });

function toByte(ch: string): number | undefined {
  const c = ch.charCodeAt(0);
  if (c <= 0xff) return c;
  return CP1252[ch];
}

/** Repair UTF-8-read-as-Windows-1252 sequences. Safe on clean text (returns it unchanged). */
export function fixMojibake(s: string): string {
  if (!s || !/[Â-ô]/.test(s)) return s;
  let out = s;
  for (let pass = 0; pass < 2; pass++) { // twice: double-encoded text needs two rounds
    const next = out.replace(RUN, run => {
      const bytes: number[] = [];
      for (const ch of run) { const b = toByte(ch); if (b === undefined) return run; bytes.push(b); }
      try { return decoder.decode(Uint8Array.from(bytes)); } catch { return run; }
    });
    if (next === out) break;
    out = next;
  }
  return out;
}

/** Replace en and em dashes (and the horizontal bar) with plain hyphens or commas. */
export function plainDashes(s: string): string {
  if (!s || !/[–—―]/.test(s)) return s;
  return s
    .replace(/^(\d{1,2}:\d{2}(?::\d{2})?)[ 	]*[–—][ 	]*/gm, "$1 - ") // chapter lines keep "0:00 - Title"
    .replace(/([?!.:])\s*[—―]\s*/g, "$1 ")                         // "worth it? — No." -> "worth it? No."
    .replace(/(\d)\s*[–—]\s*(\d)/g, "$1-$2")            // 2–4 months -> 2-4 months
    .replace(/(\d%?)[–—](?=[A-Za-z$£€])/g, "$1-")  // 12–week, 3–month
    .replace(/\s+[—―]\s+/g, ", ")                         // pause: "word — word" -> "word, word"
    .replace(/\s+–\s+/g, " - ")                                // spaced en dash -> spaced hyphen
    .replace(/(\w)[—―](?=\w)/g, "$1, ")                   // unspaced em dash between words
    .replace(/(\w)–(?=\w)/g, "$1-")                            // unspaced en dash between words
    .replace(/[–—―]/g, "-")                          // anything left (line starts or ends)
    .replace(/,\s*,/g, ",").replace(/,\s*([.!?])/g, "$1");
}

/** Viewer-facing text: mojibake repaired, dashes plain. */
export function cleanViewerText(s: string): string {
  return plainDashes(s); // fixMojibake is deliberately not applied: it can corrupt real text such as "2×–3×"
}

const URLISH = /^(https?:\/\/|www\.)\S+$/i;

/** Apply cleanViewerText to every string in a JSON-like value (strings that are bare URLs are left alone). */
export function cleanDeep<T>(v: T): T {
  if (typeof v === "string") return (URLISH.test(v) ? v : cleanViewerText(v)) as unknown as T;
  if (Array.isArray(v)) return v.map(cleanDeep) as unknown as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = cleanDeep(x);
    return o as T;
  }
  return v;
}
