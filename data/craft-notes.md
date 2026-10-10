_Based on 55 QA records from 2026-09-27 to 2026-10-09: 13 carousels, 27 Shorts and 15 long-form videos. 15 were held:_
- _5 for scope errors: **S1 09-28** said "or both" when the finding was for people with both markers. **L1 09-29** left tirzepatide out of a study's drug list. **S2 10-01** described every participant as having T2D/obesity when only the controls did. **L1 10-06** credited a result to the wrong dose arms. **S3 10-08** applied a finding about the killed USP vaccine to the live EV vaccine._
- _3 for crediting a claim to a body or date the source doesn't support: **L1 10-07** (CDC), **S1 10-08** (WHO) and **L1 10-09** (Rospotrebnadzor, Oct 8, for a figure one source gives to the Irkutsk governor and the other leaves undated)._
- _3 for spelling or misread numbers: L2 09-27, L3 09-27 ("twenty" was voiced as "two thousand") and S1 10-01 (phonetic respellings in the subtitles). None since 10-01, but spelled-out numbers keep reaching captions._
- _3 for broken YouTube descriptions: L1 09-27, **L1 10-07** (raw JSON) and **L1 10-09** (cut off mid-URL). 11 of 15 long-form descriptions were broken. 10-08 was clean, but the problem came back on 10-09._
- _1 each for a status that was too strong and out of date (**S1 10-09**), a causal title over 100 characters (S2 09-30) and a dropped expert limitation (L1 09-27)._
- _S1 10-07 and S1 10-08 were held under the old 90 s limit. The limit is now 178 s, so they would pass today and that rule has been removed._

_16 records are about plague (10-07 to 10-09), and 6 of them were held. The bug where "NOT" drops off a caption keeps coming back (5 cases). Long-form tiny, off-screen and sparse frames haven't improved (L2 10-09 had 30 tiny-text findings)._

### Motion Designer
- **Never let "NOT" or "NO" fall off a status caption.** "NOT CONFIRMED", "NOT RULED OUT" and "NO EVIDENCE PNEUMONIC PLAGUE PLAYED A PART" are single units that never split across caption screens. Before rendering, check every caption that contains "confirmed", "ruled out", "evidence" or "found" and make sure its negation is on the same screen. (5 cases: S2 10-07, S1 10-08, S1 10-09 ×2 and S2 10-09. It contributed to the S1 10-09 hold.)
- **Captions show numbers and dates as numerals that match the pill exactly: "1 in 802", "80%+", "OCT 6, 2026", "2026".** Never split a number or a label across screens ("AT BSL-" / "2 PRACTICES"). A spelled-out number can become a factual error: in S3 10-05, "1 in 802" turned into "ONE IN EIGHT" and "119 hospitals" turned into "AND NINETEEN". (Spelled-out numbers in 6 Shorts: S1 09-30, S1 10-01, S2 10-05, S3 10-05, S3 10-07 and S1 10-09.)
- **Captions are 2 lines or fewer, and each one is a complete phrase.** Never end on a comma, and never leave a fragment like "OF A SECOND", "OR LOCAL HEALTH" or "HAVE TO,". (About 25 fragment findings across 10 Shorts. 3-line captions in S3 09-29 and S1 10-05.)
- **Shorts: keep the bottom ~35% of the frame free of labels, because the caption pill goes there, and fully fade out every tag from the previous beat before the next caption appears.** Put tags above or beside the hero art. (Ghost or overlapping labels in 14 of 27 Shorts. S2 09-30 had 19 overlaps and S2 09-28 had 17. The latest was a ghost "Lungs" label in S2 10-09.)
- **All text at least ~40px on a 1080 frame, or drop the label. This applies to Shorts too.** Recurring offenders are the small pill tags ("Pneumonia", "Close contact", "Promptly" at 23–26px). (About 230 tiny-text findings in long-form, 30 of them in L2 10-09, plus about 8 in Shorts.)
- **Keep every box and character inside the safe frame.**
  - The bottom edge sits at or above 92% of the height: y ≤ 994 on 1080 and y ≤ 1766 on 1920. Keep 5% margins at the sides and top.
  - Long words like "ROSPOTREBNADZOR" must fit their pill: shrink or wrap the text.
  - Never crop a mascot, a face or a head at the frame edge. Examples: heads cut off at the neck in L2 10-09, the doctor in S2 10-09, the squirrel in S3 10-07 and the faces in S3 09-29.
  - (About 170 off-screen findings in long-form, plus 8 cropped characters in Shorts.)
- **Never open on, or hold, a lone icon on a plain gradient or a frame with only chips.** Every sampled frame needs a headline plus hero art or a scene covering at least ~25% of the frame. For lab or clinic topics, use a full room scene. (About 210 sparse findings in long-form, 17 of them in L1 10-09, plus about 10 in Shorts.)
- **Keep headlines, stat titles and captions off faces and hero art, and never let a chart or icon cut through a number or its qualifier line.** Give charts their own box below the text. (About 50 findings, for example headline over the mascot's eyes in L1 09-27 and L2 09-28, and bars through the stat in L3 09-27, L2 09-28 and L3 09-28.)
- **Each beat shows its own headline and its own chip set, on its own shot.** Examples: "The risk is the air" showed up a shot late in L1 10-09. L2 10-09 showed the wrong chips and never showed "Crossing into the cycle". L1 09-28 showed "What You Can Do" in the wrong section. (4 long-form videos.)

### Scriptwriters
- **Shorts: write 170 words or fewer (about 60–75 s), and drop a beat rather than run long.** (S1 10-08 was about 200 words, S1 10-09 was over and S2 10-09 was about 188.)
- **Write narration in normal spelling, with every stat and date as numerals ("Yersinia pestis", "Mounjaro", "1 in 802", "Oct 6, 2026"). Never use phonetic respellings.** Captions and subtitles are built from the script. (3 holds, plus 5 subtitle-mismatch blocks: S2/S3 09-28, S1 10-01, S2/S3 10-05.)
- **Tie every claim to the exact form, drug list, dose arm, group and place its source covers, and use the source's own verbs.**
  - A finding about one vaccine, arm or subgroup never moves to another.
  - Never say "all participants" when the source describes only one group.
  - Never widen a pneumonic-plague claim to all plague (L1 10-07, S3 10-09).
  - Use the source's words: "requires direct and close contact", "can be considered", "brought under control", "Irkutsk oblast", "WHO European Region".
  - (5 scope holds.)
- **Every number gets its comparator, timeframe, denominator and absolute figure.**
  - A relative figure (HR, %) always comes with the absolute rates.
  - Dropout and side-effect rates come with the placebo figure.
  - "Many more" always needs the numbers.
  - On-screen counts match the narration (S3 10-09 showed "3" while the narration listed 4).
  - (About 40 findings, for example S3 10-01, L1 10-06, S1 10-01 and S1 09-29.)
- **Report null or unproven results exactly, keep the limits the result depends on, and never make on-screen text stronger or narrower than the narration.** "Not significant" ≠ "no drop", and not confirmed ≠ ruled out ≠ "myth" (S2 10-01, S1 10-08). Keep independent experts' limitations (L1 09-27 hold). (About 30 findings, 2 holds.)

### Carousel Designer
- **Every stat, range or table cell says what it counts and keeps the source's hedge.** Write "Can, with close contact", not "Yes". Model estimates show their uncertainty range. Cells in the same row use matching intensity. (About 15 findings: C1 10-07, C1 10-08, C2 09-28, C2 09-30, C1 09-28 and C1 10-01.)
- **Every claim slide gets a source tag that actually says that line, and every listed source is cited on a slide.**
  - Never put our own qualifier inside an agency's claim ("in recent decades", C1 10-09).
  - Background facts need a source too.
  - Helplines show their real hours (C1 10-01).
  - The title promises only what the slides deliver (C1 09-28, C2 09-30).
  - (About 12 findings.)
- **General advice carries its safety caveat on the slide:** "unless you've been told to limit fluids", and a kidney-disease caveat for protein advice. (C2 09-29, C1 09-30, plus the pinned comment in L1 10-06.)

### Social Copywriter & packaging
- **YouTube description: plain text, 1,500 characters or fewer measured after assembly, and a complete last line.**
  - If it's too long, cut chapters first, then the last source.
  - Never cut off part of a line or a URL. Never paste JSON or a literal "\n".
  - The order is:
    1. A quick answer in 3 lines or fewer, including the dated status hedge.
    2. The disclaimer plus "If you're worried, talk to a health professional."
    3. Up to 4 sources (short title + full URL).
    4. Chapters.
  - (11 of 15 long-form descriptions were broken, 3 of them in held videos.)
- **Titles: 100 characters or fewer, starting with "Plague" or "Pneumonic plague".**
  - Status titles carry "as of [date]".
  - Keep "human", "average", "suspected" and "reported", and name the population and the comparator.
  - No causal verbs for observational data ("Cuts", S2 09-30 hold), no absolutes ("Stays Contained") and one abbreviation at most.
  - (1 hold, about 30 findings: S2 10-08 and S2 10-09 didn't start with "Plague".)
- **Fill every field and end each one with the disclaimer plus "If you're worried, talk to a health professional."** The fields are YouTube, Instagram, TikTok, Facebook, Threads, the pinned comment and the thumbnail.
  - TikTok drops lines most often (S1 10-09, S3 10-09 and C1 10-07).
  - Every caption keeps "contact a doctor or local health authority urgently" and CDC's 4 pneumonic signs.
  - Keep Threads bodies to about 350 characters so the safety lines fit under 500.
  - 3 long-form videos on 09-28 had no platform captions at all.
  - (About 30 findings.)
- **Copy facts and attributions word for word from the verified script.**
  - Use "played a part in", not "caused", and "Russian authorities", not "Russia".
  - Write "Reuters reports" and "Lilly reported", and keep funder and company credits (C1 10-05, S1 10-01, S1 10-06).
  - Captions that state a benefit also carry the side-effect line (S1 10-06 major, S3 10-01).
  - (5 holds share this cause.)
- **Carry every hedge and qualifier into every caption, with the hedge in the first line before the fold.** Watch "suspected", "on average", the population, "observational" and "highest dose". Never make a claim stronger: no "always", "at all", "proven", "responds well" or "only recommends". (About 85 findings. TikTok in S2 10-09 dropped "suspected".)
- **Tone:**
  - No emojis in plague or safety captions (S3 09-28, S3 10-01, S1 10-07).
  - No agency hashtags and no #outbreak.
  - No "near you" phrasing.
  - No open-ended prompts that invite rumours, myths or links (Facebook in S2 10-07 and S3 10-09).
  - (About 11 findings.)

### Everyone
- **Status must be current, scoped, dated and up front.**
  - Re-check every named body's latest statement at publish time, and put the newest dated development in the opening beat. S1 10-09 left out WHO's Oct 8 request and was held. L1 10-09 saved Rospotrebnadzor's position until s63.
  - Quote each statement at its exact scope: "no evidence pneumonic plague played a part" ≠ "no evidence of plague".
  - Date each statement to the day the body said it, and never merge two days.
  - Any "as of [month]" or "not yet published" line must still be true on publish day (S2 10-01, S3 09-28, L3 09-28).
  - (1 hold, about 25 findings.)
- **Every source tag must say the line, credited to the body that actually said it, on the day it said it.**
  - Never present our inferences or summaries as theirs ("precaution", "3 tools", "kept apart"; S2 10-08, L1 10-08).
  - Never put quote marks around a paraphrase ("fake" was AP's word).
  - Keep a source's own caveat ("could not independently verify").
  - (3 holds, about 60 findings.)
- **Keep the source list clean.**
  - Use direct, stable URLs on the canonical domain: no search, profile, AMP or redirect URLs (S3 10-05, L1 10-07, L1 10-09).
  - List only sources a scene actually cites, and use exact published titles and the issue year.
  - Give living pages their current "updated" date (CDC plague page Aug 24, 2026; BMBL Mar 18, 2026).
  - (About 45 findings.)
- **Urgency and safety caveats go with the advice in every output.**
  - Write "contact a doctor or local health authority urgently", and tie red flags to possible exposure.
  - List CDC's pneumonic signs in full: fever, cough, shortness of breath and chest pain.
  - Add practical caveats such as "dog flea products can be toxic to cats".
  - Use calming sourced facts, such as no US person-to-person spread since 1924.
  - (About 22 findings.)
- **Say exactly what was measured or reported.**
  - Human ≠ animal cases, an average ≠ a fixed figure, and a person under observation ≠ a case.
  - For the US count, copy CDC's wording as it reads at publish time. The 10-09 check read "an average of five human plague cases are reported each year" (range 0–17), not 7.
  - Use consistent pronouns for the person who died, and never lead with her name.
  - (About 30 findings.)

_Updated 2026-10-10 from 55 QA records (16 on plague)._

_Updated 2026-10-10 from 55 QA records._
