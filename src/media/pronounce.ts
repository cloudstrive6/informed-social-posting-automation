/**
 * Pronunciation lexicon: one checked respelling per hard term (drugs, brands, medical terms, acronyms), applied
 * deterministically to every narration before any voice reads it, so a term sounds the same every time.
 * Curated terms: config/pronunciations.json. Terms learned from new scripts: data/pronunciations.json
 * (added by the Pronunciation Coach, merged at finalize). Captions still show the written word.
 */
import { join } from "node:path";
import { runAgent } from "../lib/agent.js";
import { config, DATA, ROOT } from "../lib/config.js";
import { readJson, writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";

export type Lexicon = Record<string, string>;
const CURATED = join(ROOT, "config", "pronunciations.json");
const LEARNED = join(DATA, "pronunciations.json");

/** Curated entries win over learned ones. */
export function loadLexicon(): Lexicon {
  const learned = readJson<{ terms?: Lexicon }>(LEARNED, {}).terms ?? {};
  const curated = readJson<{ terms?: Lexicon }>(CURATED, {}).terms ?? {};
  return { ...learned, ...curated };
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Replace every lexicon term (whole word, any case, plural/possessive kept) with its respelling. */
export function applyLexicon(text: string, lex: Lexicon = loadLexicon()): { text: string; used: string[] } {
  const used = new Set<string>();
  // longest terms first so "nucleus accumbens" beats "nucleus", "GLP-1RA" beats "GLP-1"
  let out = text;
  for (const term of Object.keys(lex).sort((a, b) => b.length - a.length)) {
    const rx = new RegExp(`(?<![\\p{L}\\p{N}-])${esc(term)}('s|s)?(?![\\p{L}\\p{N}-])`, "giu");
    out = out.replace(rx, (_m, suffix?: string) => {
      used.add(term);
      const say = lex[term];
      return suffix === "'s" ? `${say}'s` : suffix === "s" && !/s$/i.test(term) ? `${say}z` : say;
    });
  }
  return { text: out, used: [...used] };
}

/** Terms spelled as the script writes them, so Whisper can be told what vocabulary to expect. */
export const lexiconTerms = (used: string[]) => used.filter(t => /[a-z]/i.test(t));

const schema = {
  type: "object", additionalProperties: false, required: ["terms"],
  properties: {
    terms: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["term", "say", "source"],
        properties: { term: { type: "string" }, say: { type: "string" }, source: { type: "string" } },
      },
    },
  },
};

/**
 * Before narration: find words in the script a voice could get wrong that the lexicon doesn't cover yet,
 * and look up their correct pronunciation. Returns the new entries (also applied to this narration).
 */
export async function learnPronunciations(scriptText: string): Promise<Lexicon> {
  const lex = loadLexicon();
  const known = Object.keys(lex).map(k => k.toLowerCase());
  try {
    const out = await runAgent<{ terms: { term: string; say: string; source: string }[] }>({
      agent: "pronunciation-coach", model: config.models.factChecker, schema, web: true, maxTurns: 20, effort: "medium",
      input: { script: scriptText.slice(0, 30_000), already_in_lexicon: Object.keys(lex) },
    });
    const fresh: Lexicon = {};
    for (const t of out.terms) {
      const term = t.term.trim(), say = t.say.trim();
      if (!term || !say || known.includes(term.toLowerCase()) || term.toLowerCase() === say.toLowerCase()) continue;
      if (!/^[\p{L}\p{N}' -]+$/u.test(say)) continue; // respellings are letters, hyphens and spaces only
      fresh[term] = say;
    }
    if (Object.keys(fresh).length) log.info(`pronunciation: learned ${Object.entries(fresh).map(([k, v]) => `${k} → ${v}`).join(", ")}`);
    return fresh;
  } catch (e) {
    log.warn(`pronunciation coach failed (${(e as Error).message.slice(0, 150)}); using the existing lexicon`);
    return {};
  }
}

/** Merge newly learned terms into data/pronunciations.json (called where data/ gets committed). */
export function saveLearned(fresh: Lexicon) {
  if (!Object.keys(fresh).length) return;
  const cur = readJson<{ terms?: Lexicon }>(LEARNED, {});
  writeJson(LEARNED, { _comment: "Learned automatically from scripts by the Pronunciation Coach. Curated entries live in config/pronunciations.json.", terms: { ...(cur.terms ?? {}), ...fresh } });
}
