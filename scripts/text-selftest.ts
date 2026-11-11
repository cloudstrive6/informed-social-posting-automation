/**
 * Local test for the viewer-text cleaner (src/lib/text.ts). No network, nothing written.
 * Run: npm run test:text
 */
import assert from "node:assert/strict";
import { cleanDeep, cleanViewerText, plainDashes } from "../src/lib/text.js";

const EN = "–", EM = "—", MINUS = "−", TIMES = "×";
const eq = (input: string, want: string) => assert.equal(cleanViewerText(input), want, `input: ${JSON.stringify(input)}`);

// chapter timestamps keep a space-hyphen-space so YouTube still parses them
eq(`0:00 ${EM} Intro\n1:30 ${EM} 2 drugs compared\n2:45 ${EN} Side effects\n1:02:10${EN}Wrap up`,
   "0:00 - Intro\n1:30 - 2 drugs compared\n2:45 - Side effects\n1:02:10 - Wrap up");
// no comma after sentence punctuation
eq(`Was it worth it? ${EM} No.`, "Was it worth it? No.");
eq(`Stop! ${EM}Really.`, "Stop! Really.");
// numeric ranges and ordinary dashes
eq(`It usually starts 2${EN}4 months in`, "It usually starts 2-4 months in");
eq(`12${EN}week plan, 5%${EN}10%`, "12-week plan, 5%-10%");
eq(`Stay hydrated ${EM} it helps`, "Stay hydrated, it helps");
eq(`A ${EN} B`, "A - B");
// untouched text
eq(`a “2${TIMES}” boost`, `a “2${TIMES}” boost`);
eq(`2${TIMES}${EN}3${TIMES} faster`.replace(EN, "-"), "2×-3× faster");
eq(`${MINUS}5 kg in 12 weeks`, `${MINUS}5 kg in 12 weeks`);
eq("café · ≥ 5 kg → go", "café · ≥ 5 kg → go");
eq("Tips #GLP1 #Health 👇💪", "Tips #GLP1 #Health 👇💪");
// URLs unchanged
const url = `https://example.com/a${EN}b?x=1`;
assert.equal(cleanDeep(url), url);
assert.deepEqual(cleanDeep({ u: url, t: `2${EN}4 months`, n: 3, a: [`x ${EM} y`] }), { u: url, t: "2-4 months", n: 3, a: ["x, y"] });
// watch-next titles
assert.equal(plainDashes(`GLP-1 ${EM} what changes after 6 months`), "GLP-1, what changes after 6 months");
console.log("text selftest: all checks passed");
