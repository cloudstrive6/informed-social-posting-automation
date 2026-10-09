_Based on 59 QA records from 2026-09-26 to 2026-10-09: 15 carousels, 30 Shorts and 14 long-form videos. 17 were held:_
- _7 for scope errors. The latest is **S3 10-08**, which applied a finding about the killed USP vaccine to the live EV vaccine._
- _3 for crediting a claim to a body or date the source doesn't support: **L1 10-07** (CDC), **S1 10-08** (WHO) and **L1 10-09**. L1 10-09 gave Rospotrebnadzor and Oct 8 as the source of the "about 5,000 tests" figure. One source actually credits the Irkutsk governor, and the other gives no date._
- _3 for phonetic respellings or misread numbers. None since 10-01._
- _2 for broken YouTube descriptions: **L1 10-07** pasted raw JSON, and **L1 10-09** was cut off mid-URL._
- _1 for a status that was both too strong and out of date (**S1 10-09**)._
- _1 each for a dropped expert limitation, a causal and over-long title, and a sample size that didn't match across the package (C1 09-26)._
- _2 Shorts were held for running over 90 s (S1 10-07, S1 10-08). The limit is now 178 s, so they would pass today._

_15 records are about plague (10-07 to 10-09), and 6 of them were held. On 10-09, overlaps in Shorts fell to 3 across three Shorts, down from 14 on 10-08. But the bug where "NOT" drops out of a caption hit 2 of the 3 Shorts, and the long-form description was cut off again after one clean day._

### Motion Designer
- **Never let "NOT" or "NO" fall off a status caption.** Treat these phrases as single units that never split across caption screens: "NOT CONFIRMED", "NOT RULED OUT", "NO EVIDENCE PNEUMONIC PLAGUE PLAYED A PART". Before rendering, check every caption that contains "confirmed", "ruled out", "evidence" or "found" and make sure its negation is on the same screen. (5 cases: S2 10-07 showed "CONFIRMED" on its own. S1 10-08 and S1 10-09 showed "HAS/HAD BEEN OFFICIALLY CONFIRMED" with no "NOT". S1 10-09 also showed "EVIDENCE PNEUMONIC PLAGUE" with no "NO". S2 10-09 showed "BEEN OFFICIALLY CONFIRMED," followed by "AS RULED OUT." The S1 10-09 case contributed to its hold.)
- **Caption rules:**
  - Numbers and dates are numerals that match the pill exactly: "80%+", "OCT 6, 2026", "2026". Not "OVER EIGHTY PERCENT", "OCTOBER SIXTH" or "TWENTY TWENTY-SIX" (S1 10-09).
  - Never split a number or a label across lines or screens. "AT BSL-" / "2 PRACTICES" is wrong (S1 10-09).
  - Captions are 2 lines or fewer, and each is a complete phrase. Never end a caption on a comma, and never leave a fragment like "OF A SECOND" or "OR LOCAL HEALTH".
  - (About 30 number findings and about 15 fragment findings, in S3 10-07, S1/S2/S3 10-08 and S1/S2/S3 10-09.)
- **Shorts: keep the bottom ~35% of the frame free of labels, because the caption pill goes there, and fade out every tag from the previous beat before the next caption appears.** This improved on 10-09 (3 overlaps, down from 14 on 10-08), but a ghost "Lungs" label still showed in S2 10-09. Put tags above or beside the hero art. (Ghost labels in 7 Shorts.)
- **All text at least ~40px on a 1080 frame, or drop the label. This applies to Shorts too.** Examples: "Irkutsk oblast", "Pneumonia" and "Close contact" (23px) in the 10-09 Shorts, and "Air in" and "Down" in L1 10-09. (170 long-form tiny-text findings, 11 of them in L1 10-09, plus 3 in the 10-09 Shorts.)
- **Keep every box and character inside the safe frame:**
  - Bottom edge at or above 92% of the height: y ≤ 994 on 1080 and y ≤ 1766 on 1920.
  - 5% margins at the sides and top.
  - Long words like "ROSPOTREBNADZOR" must fit their pill. Shrink the text or wrap it to 2 lines. It was clipped in S2 10-09.
  - Never crop a mascot or icon at the frame edge. The doctor icon in S2 10-09 and the "BSL-3" tag at y 1089 in L1 10-09 were cropped.
  - (133 long-form off-screen findings, 10 of them in L1 10-09.)
- **Never open on, or hold, a lone icon on a plain gradient or a frame with only chips.** Every sampled frame needs a headline plus hero art or a scene covering at least ~25% of the frame. 10-09 examples: a lone shield, a small building, a trash can and a PPE figure (L1), and a lone clipboard and a lone scale (S2). For lab-safety topics, use a full lab-room scene. (167 long-form sparse findings, 17 of them in L1 10-09, plus about 6 in plague Shorts.)
- **Keep captions and stat titles off faces and hero art,** placing them above or beside the hero, and give charts their own box. Each beat's headline must appear on its own shot: in L1 10-09, "The risk is the air" showed up one shot late. (About 47 findings.)

### Scriptwriters
- **Shorts: write 170 words or fewer (about 60–75 s), and drop a beat rather than run long.** S1 10-09 ran over the guide and S2 10-09 was about 188 words. That's under the 178 s limit, but we keep going over the guide. (4 over-length plague scripts.)
- **Write narration in normal spelling, with every stat and date as numerals ("Yersinia pestis", "1 in 802", "Oct 6, 2026"). Never use phonetic respellings.** Captions and subtitles are built from the script. That's how "OCTOBER SIXTH" reached the screen in S1 10-09. (3 holds.)
- **Tie every claim to the exact form, product, place and scope its source covers, and use the source's own verbs:**
  - A finding about one vaccine, drug or study arm never moves to another (S3 10-08 hold).
  - "requires direct and close contact", not "typically". "can be considered for exposed lab workers", not "offered" (L1 10-09).
  - Never widen a claim about pneumonic plague to all plague, on screen or in narration (L1 10-07, L1 10-08, S3 10-09).
  - "Irkutsk oblast", not "Irkutsk". "WHO European Region", not "Europe".
  - (7 scope holds, plus about 10 findings about plague certainty.)
- **Every number gets its comparator, timeframe, denominator and absolute figure.** Report null or unproven results exactly: not confirmed ≠ ruled out ≠ "myth". Any count on screen must match the narration: the chip in S3 10-09 said "3" while the narration listed 4 exposures. (About 38 findings.)
- **State the limits the result depends on, and never make on-screen text stronger or narrower than the narration.** Examples to avoid: "no evidence of plague" when the source says "pneumonic plague played a part" (S1 10-09). "If early" when the source says "especially when started early", and an exposure presented as if it proves plague (S3 10-09). "Stopped" when the source says "brought under control" (L1 10-08). (About 30 findings, including 2 holds.)

### Carousel Designer
- **Every stat, range or table cell needs a qualifier saying what it counts, and each table cell keeps the source's hedge** ("Can, with close contact", not "Yes"). Each row cites the source that actually says it. (19 findings, including C1 10-07 and C1 10-08.)
- **Every claim slide gets a source tag that actually says that line.** Never put our own qualifier inside an agency's claim: "in recent decades" isn't on the CDC page (C1 10-09). Background facts need a source too: "the Black Death was Y. pestis" had none (C1 10-09). Helplines show their real hours, and the title promises only what the slides deliver. (13 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text, 1,500 characters or fewer measured after assembly, and a complete last line.** If it's too long, cut chapters first, then the last source. Never cut off part of a line or a URL: L1 10-09 ended mid-URL and was held. Never paste JSON or a literal "\n". The order is:
  1. A quick answer in 3 lines or fewer, including the dated status hedge.
  2. The disclaimer plus "If you're worried, talk to a health professional."
  3. Up to 4 sources (short title + full URL).
  4. Chapters.

  Don't merge two dated statements into one, like "Oct 6–7". (12 of 14 long-form descriptions were broken, including 2 holds.)
- **Titles: 100 characters or fewer, starting with "Plague" or "Pneumonic plague".** S2 10-09 started with "Suspected", and S2 10-08 never said "plague".
  - Status titles carry "as of [date]".
  - Keep the hedge words "human", "average", "suspected" and "reported".
  - Use correct grammar ("Bacteria Stay"), no absolutes like "Stays Contained", and one abbreviation at most (L1 10-09).
  - (1 hold, about 30 findings.)
- **Fill every field and end each one with the disclaimer plus the exact line "If you're worried, talk to a health professional."** The fields are YouTube, Instagram, TikTok, Facebook, Threads, the pinned comment and the thumbnail.
  - TikTok is the field most often missing something: the closing line, the disclaimer or the safety line was missing in S1 10-09, S3 10-09 and C1 10-07.
  - Every caption keeps "contact a doctor or local health authority urgently" and CDC's 4 pneumonic warning signs. Threads in S1 10-09 and Instagram in C1 10-09 dropped them.
  - Keep Threads bodies to about 350 characters.
  - (About 27 findings.)
- **Copy facts and attributions word for word from the verified script.** Use "played a part in", not "caused", and "Russian authorities", not "Russia" (TikTok, S1 10-09). Use "Reuters reports" wherever the script credits Reuters. Errors in the script that carry into captions become holds. (5 holds share this cause.)
- **Carry every hedge, qualifier and red-flag line into every caption, with the hedge in the first line before the fold.** In S2 10-09, the TikTok caption dropped "suspected". Never make a claim stronger: no "always", "at all", "responds well", "proven" or "only recommends". Write "health authorities give preventive antibiotics to close contacts". (About 85 findings, 20 of them on plague.)
- **Tone:**
  - No emojis in plague captions on Meta.
  - No agency hashtags like #CDC or #WHO, and no #outbreak.
  - No "near you" phrasing.
  - No open-ended prompts that invite people to post rumours, myths or links (Facebook in S2 10-07 and S3 10-09).
  - (11 findings.)

### Everyone
- **Status must be current, scoped and up front.**
  - Re-check every named body's latest statement at publish time. Include the newest dated development and put it in the opening beat, not near the end. S1 10-09 was held partly for leaving out WHO's Oct 8 request about a second employee. L1 10-09 saved Rospotrebnadzor's position until s63.
  - Quote each statement at its exact scope: "no evidence pneumonic plague played a part" ≠ "no evidence of plague". "None among contacts tested so far" ≠ "nothing found".
  - Date each statement to the day the body said it, and never merge statements from two days.
  - Not confirmed ≠ ruled out.
  - (1 hold, about 22 findings.)
- **Every source tag must say the line, credited to the body that actually said it, on the day it said it.**
  - (3 holds: L1 10-07 credited CDC, S1 10-08 credited WHO, and L1 10-09 credited Rospotrebnadzor on Oct 8 for a figure one source gives to the governor and the other leaves undated.)
  - Don't single-source general facts to a source that doesn't state them, such as HEPA filter specs credited to BMBL (L1 10-09).
  - Don't present our inferences as theirs.
  - Never put quote marks around a paraphrase. "Fake" was AP's word, not Rospotrebnadzor's (S2 10-09).
  - Keep a source's own caveat, such as "could not independently verify" (Kyiv Independent, L1 10-09).
  - (About 58 findings.)
- **Keep the source list clean:**
  - Use direct, stable URLs on the canonical domain (abcnews.go.com, not abcnews.com). No profile, search, AMP or region-blocked URLs.
  - List only sources a scene actually cites.
  - Use exact published titles and the issue year.
  - Give living pages their current "last reviewed" or "updated" date. Examples: the CDC plague page shows Aug 24, 2026 and the BMBL page Mar 18, 2026 (C1 10-09, L1 10-09).
  - (About 46 findings.)
- **Urgency and safety caveats go with the advice in every output.** Write "contact a doctor or local health authority urgently", and tie red flags to possible exposure. List CDC's pneumonic signs in full: fever, cough, shortness of breath and chest pain. Add practical caveats such as "dog flea products can be toxic to cats". Use calming facts from the sources, such as no US person-to-person spread since 1924. (About 22 findings.)
- **Say exactly what was measured or reported.** Human cases ≠ animal cases, an average ≠ a fixed figure, and a person under observation ≠ a case. For the US plague count, copy CDC's page wording as it reads at publish time. The 10-09 check read "an average of five human plague cases are reported each year" (range 0–17), not 7, so re-verify before using 7. Use the same pronouns throughout for the person who died, and never lead with her name. (About 30 findings.)

_Updated 2026-10-09 from 59 QA records (15 on plague)._

_Updated 2026-10-09 from 59 QA records._
