/**
 * Self-test of caption timing (owner, 2026-11-24: "the spoken words are not in sync with the subtitles").
 * Whisper splits and drops words; every shown word must still take the time of the word the narrator said, and
 * words nothing matches must be counted as guessed so the build log warns. Also checks the composed captions:
 * each caption and word lights a beat early (CAPTION_LEAD), one word at a time, one caption at a time.
 * No paid API, no agent, no render: `npx tsx scripts/caption-sync-selftest.ts`.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CAPTION_LEAD, composeAnimated, timeShots } from "../src/media/animated.js";
import { type AlignStats, alignTimes } from "../src/media/captions.js";
import type { Timeline, Word } from "../src/media/tts.js";
import type { Shot } from "../src/media/vector/shots.js";

let fails = 0;
const check = (ok: boolean, what: string) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) fails++; };
/** heard words, 0.3 s each from t0 (a gap where a word is "") */
const heard = (text: string, t0 = 0, step = 0.3): Word[] => text.split(" ").map((w, i) => ({ text: w, start: +(t0 + i * step).toFixed(2), end: +(t0 + i * step + step * 0.9).toFixed(2) })).filter(w => w.text !== "_");
const at = (ws: Word[], text: string, k = 0) => ws.filter(w => w.text === text)[k];
const stats = (): AlignStats => ({ tokens: 0, timed: 0, guessedSeconds: 0 });
const mono = (ws: Word[]) => ws.every((w, i) => w.end >= w.start - 1e-9 && (!i || w.start >= ws[i - 1].start - 1e-9));

// 1) a drug name heard in pieces: every word keeps its own time (the old rule spread the whole scene evenly)
{
  const toks = "Orforglipron, or Foundayo, lists hair loss as a side effect on its label.".split(" ");
  const h = heard("Or for glipron, or foundaeo, lists hair loss as a side effect on its label.");
  const st = stats(), out = alignTimes(toks, h, st);
  check(out[0].start === h[0].start && out[0].end === h[2].end, `"Orforglipron" spans the three heard pieces (${out[0].start}-${out[0].end})`);
  const ok = toks.slice(1).every((t, i) => out[i + 1].start === h[i + 3].start);
  check(ok, "every later word starts exactly when it was heard");
  check(st.timed === toks.length && st.guessedSeconds === 0, `all ${toks.length} words timed from the voice (${st.timed})`);
}
// 2) numbers said as words, a contraction heard as one word
{
  const toks = "Fullness returns in six to nine months, it is common.".split(" ");
  const h = heard("Fullness returns in 6 to 9 months, it's common.");
  const out = alignTimes(toks, h);
  check(at(out, "six").start === h[3].start && at(out, "nine").start === h[5].start, "\"six\"/\"nine\" take the times of \"6\"/\"9\"");
  check(at(out, "it").start === h[7].start && at(out, "is").start > at(out, "it").start && at(out, "is").end <= h[7].end + 1e-9, "\"it is\" shares the time of \"it's\"");
  check(at(out, "common.").start === h[8].start, "the word after the contraction is on time");
}
// 3) Whisper dropped six words: they are guessed (and counted), the words around them keep their own times
{
  const toks = "your doctor can check whether this medicine suits your kidneys before you start".split(" ");
  const h = heard("your doctor can _ _ _ _ _ _ kidneys before you start", 0, 0.35);
  const st = stats(), out = alignTimes(toks, h, st);
  check(at(out, "kidneys").start === h[3].start && at(out, "can").start === h[2].start, "words either side of the dropout are on time");
  check(st.timed === 7 && st.tokens === 13, `the 6 dropped words count as guessed (timed ${st.timed}/${st.tokens})`);
  check(st.guessedSeconds >= 1.8, `the guess is flagged as long (${st.guessedSeconds.toFixed(2)} s)`);
  check(at(out, "check").start >= at(out, "can").end - 1e-9 && at(out, "suits").end <= at(out, "kidneys").start + 1e-9, "guessed words stay inside the gap");
  check(mono(out), "times only move forward");
}
// 4) filler words heard that are not in the script: they are skipped, not merged into a word
{
  const out = alignTimes(["hello", "world"], heard("um uh so hello there my world"));
  check(out[0].start === 0.9 && out[1].start === 1.8, `"hello" and "world" on their own heard times (${out[0].start}, ${out[1].start})`);
}
// 5) far fewer heard words than tokens: most are guessed, and the squeeze is flagged
{
  const st = stats(), out = alignTimes("one two three four five six seven eight nine ten".split(" "), heard("one ten"), st);
  check(out.length === 10 && st.timed <= 2 && st.guessedSeconds >= 2.4, `10 tokens vs 2 heard: timed ${st.timed}, guess ${st.guessedSeconds.toFixed(2)} s flagged`);
  check(mono(out), "times only move forward");
}
// 6) nothing heard
check(alignTimes(["a", "b"], []).length === 0 && alignTimes([], heard("a b")).length === 0, "empty inputs give no captions (no crash)");

// ---------------------------------------------------------------- 7) composed captions: lead, one word, one caption
{
  const text = "Get enough protein unless your clinician limits it and see a doctor if it lasts";
  const words = heard(text, 0.5, 0.32); // words run on with no pause
  const tl: Timeline = { duration: 7, scenes: [{ id: "s1", start: 0, end: 7, words }] };
  const shot: Shot = { scene_id: "s1", cue: "", mood: "body", background: "gradient", camera: "push-in", transition: "cut", elements: [], title: { style: "none", text: "", sub: "", items: [] } };
  const out = resolve(join("out", "caption-sync-selftest"));
  const { dir } = await composeAnimated(out, timeShots([shot], tl), tl, { vertical: true, captionScenes: [{ id: "s1", narration: text }] });
  const html = readFileSync(join(dir, "index.html"), "utf8");
  const clips = [...html.matchAll(/data-start="([\d.]+)" data-duration="([\d.]+)"[^>]*><div id="(cp\d+)" class="cap"/g)].map(m => ({ s: +m[1], e: +m[1] + +m[2], id: m[3] }));
  const lits = [...html.matchAll(/tl\.set\("#(cp\d+)_(\d+)",\{color:"#ffd83d"\},([\d.]+)\)/gi)].map(m => ({ id: m[1], k: +m[2], t: +m[3] }));
  check(clips.length >= 3, `${clips.length} captions composed`);
  check(clips.slice(1).every((c, i) => c.s >= clips[i].e - 1e-3), "never two captions on screen at once");
  // after the opening caption, each caption appears CAPTION_LEAD before its first word, even with no pause
  const later = clips.slice(1);
  const firstWordOf = (id: string) => words[lits.filter(l => lits.findIndex(x => x.id === id) <= lits.indexOf(l)).length ? lits.findIndex(l => l.id === id) : 0];
  check(later.every(c => { const w = firstWordOf(c.id); return Math.abs(c.s - (w.start - CAPTION_LEAD)) < 0.002; }), `later captions appear ${CAPTION_LEAD} s before their first word`);
  check(lits.every((l, i) => i === 0 || l.t >= lits[i - 1].t + 0.049), "one word lights at a time, in order");
  check(lits.slice(1).every((l, i) => Math.abs(l.t - Math.max(words[i + 1].start - CAPTION_LEAD, 0)) < 0.002 || l.t >= words[i + 1].start - CAPTION_LEAD), "each word lights a beat before it is said");
  check(/class="cap" style="bottom:390px;font-size:(52|48|44)px"/.test(html), "Shorts captions anchored at y 1530 (bottom 390 px), 52/48/44 px");
  check(!/\.cap\{[^}]*background/.test(html), "no box behind the caption words");
}

console.log(fails ? `\n${fails} FAILED` : "\nall caption-sync checks passed");
process.exit(fails ? 1 : 0);
