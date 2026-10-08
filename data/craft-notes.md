_Based on 54 QA records from 2026-09-26 to 2026-10-08: 14 carousels, 27 Shorts and 13 long-form videos. 15 were held:_
- _7 for scope errors. The latest is **S3 10-08**, which applied a finding about the killed USP vaccine to the live EV vaccine.)_
- _3 for phonetic respellings or misread numbers._
- _2 for Shorts over 90 s: **S1 10-07** ran 91 s and **S1 10-08** ran about 102 s._
- _2 for crediting a claim to a source that doesn't say it: **L1 10-07** credited CDC, and **S1 10-08** credited WHO with a statement from Russia's health watchdog._
- _1 for a dropped expert limitation, 1 for a causal, over-long title, and 1 for a raw-JSON YouTube description (L1 10-07)._

_10 records are about plague (10-07 and 10-08), and 4 of them were held. That's still a small sample, but the same plague problems now appear on both days, so the notes below treat them as patterns. The 10-08 long-form description passed, which is the first clean one._

### Motion Designer
- **Shorts: keep the bottom ~35% of the frame free of labels, because the caption pill goes there. Fade out every tag from the last beat before the next caption appears.** Ghost labels like "Reuters", "Pneumonia", "Unconfirmed" and "Port health" stayed visible behind captions in S2 10-08. Put tags such as "Antibiotic", "EV vaccine" and "WHO risk" above or beside the hero art. (Shorts overlaps: 12 on 10-07 and 14 on 10-08. Ghost labels in 6 Shorts.)
- **Caption rules:**
  - Numbers are numerals that match the stat pill exactly ("80%+", not "OVER EIGHTY PERCENT"). Never split a number across screens.
  - Captions are 2 lines or fewer, and each one reads as a complete phrase. Never end a caption on a comma, and never leave an orphan like "NOT CONFIRMED ISN'T" or "HARSH ITS SIDE".
  - A status word and its negation stay on the same line. S1 10-08 showed "HAS BEEN OFFICIALLY CONFIRMED" with no "NOT", and S2 10-07 showed "CONFIRMED" on its own.
  - (About 25 number findings, plus 9 fragment findings across S3 10-07, S1 10-08, S2 10-08 and S3 10-08.)
- **All text at least ~40px on a 1080 frame, or drop the label.** This covers "Lymph nodes", "Plague bacteria", "Alarms", "Daily checks", "Confirmed/Ruled out" and other chips. (Long-form tiny text: 159 findings, including 17 in L1 10-07 and 18 in L1 10-08.)
- **Keep every box and character inside the safe frame:**
  - Bottom edge at or above 92% of the height: y ≤ 994 on 1080 and y ≤ 1766 on 1920.
  - 5% margins at the sides and top, and x ≥ 0.
  - Split long pills onto 2 lines.
  - Never crop a mascot, icon or label at the frame edge. Examples: the "Clinician" and "Lungs" labels in L1 10-08, the shield in S2 10-08 and the squirrel in S3 10-07.
  - (123 long-form off-screen findings, 12 of them in L1 10-08.)
- **Never open on a lone icon on a plain gradient, or a frame of chips only, and never hold one.** Every sampled frame needs a headline plus hero art or a scene covering at least ~25% of the frame. On 10-08 the problem frames were a lone globe (L1 and S3), a lone magnifying glass, a lone newspaper (S1) and a frame with only "Treat/Protect" chips. Use a map scene, lab scene or room scene instead. (150 long-form sparse findings, plus 4 in plague Shorts.)
- **Keep captions and stat titles off faces and hero art,** and above or beside the hero. Captions sat on the lungs art in both S2 10-07 and S3 10-08. Charts get their own box. (About 45 findings.)

### Scriptwriters
- **Shorts: write 170 words or fewer, aiming for 60–75 s, and drop a beat rather than run long.** The hard limit is now 178 s (raised from 90 s on 2026-10-08; YouTube counts up to 3 min as Shorts), so 91 s and 102 s would pass today, but shorter still performs better. The S1 10-08 script was over the ~200-word guide, so that guide is too loose. (2 holds.)
- **Write narration in normal spelling and every stat as numerals ("Yersinia pestis", "1 in 802"). Never use phonetic respellings.** Subtitles are built from the script. (3 holds.)
- **Tie every claim to the exact form, product, place and scope its source covers, and match the source's certainty:**
  - A finding about one vaccine, drug or arm never moves to another. S3 10-08 was held for applying a killed-USP-vaccine finding to the live EV vaccine.
  - Use the source's verbs: "requires direct and close contact", not "typically" or "usually" (C1 10-08, S1 10-07).
  - Don't widen a statement about people-to-people spread or about pneumonic plague to all plague (L1 10-07, L1 10-08).
  - Name places as the source does: "Irkutsk oblast", not "Irkutsk", and "WHO European Region", not "Europe".
  - When two reviews agree, don't write "one review says".
  - (7 scope holds, plus about 8 plague certainty findings.)
- **Every number gets its comparator, timeframe, denominator and absolute figure, and null or unproven results are reported exactly:**
  - "An average of 7 human cases a year (range 0–17)".
  - "32 of 1,878 notified pneumonic cases" (L1 10-08 pinned comment).
  - Not confirmed ≠ ruled out ≠ "myth". S1 10-08 used a myth/fact card for an unconfirmed report.
  - (About 36 findings.)
- **State the limits the result depends on, and never make on-screen text stronger or narrower than the narration.** Use "brought under control", not "stopped" (L1 10-08). (About 26 findings, including 1 hold.)

### Carousel Designer
- **Every stat, range or table cell needs a qualifier saying what it counts,** and every comparison-table cell keeps the source's hedge ("Can, with close contact", not "Yes"). Each table row cites the source that actually says it. C1 10-08's "How it starts" row came from WHO but read as CDC's. (19 findings.)
- **Every claim slide gets a source tag that actually says that line.** C1 10-07 credited a WHO statement to CDC. Helplines show their real hours, and the title promises only what the slides deliver. (10 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text only, 1,500 characters or fewer, and the last line complete.** Never paste the packaging JSON or literal "\n". The order is:
  1. A quick answer in 3 lines or fewer, including the status hedge.
  2. The disclaimer plus "If you're worried, talk to a health professional."
  3. Up to 4 sources (short title + full URL).
  4. Chapters, which are cut first if space runs short.

  The 10-08 description passed, so keep this order. (11 of 13 long-form descriptions were broken, including 1 hold.)
- **Titles: 100 characters or fewer, starting with "Plague" or "Pneumonic plague"**, and keeping the hedge words "human", "average", "suspected", "reported" and "as of [date]". S2 10-08's title never said "plague", and S3 10-07 dropped "human" and "average". Credit agency figures in the title ("CDC: …"). (1 hold, about 27 findings.)
- **Fill every field and end each one with the disclaimer plus the exact line "If you're worried, talk to a health professional."** The fields are YouTube, Instagram, TikTok, Facebook, Threads, the pinned comment and the thumbnail. On 10-08, Facebook and Threads used near-misses of the line (S1). Keep Threads bodies to about 350 characters so the closing lines fit under 500. (About 21 findings.)
- **Copy facts and their attributions word for word from the verified script, everywhere.** If the script credits something to Reuters, every caption says "Reuters reports" (S2 10-08). Script errors that carry into captions become holds: S1 10-08's attribution error and S3 10-08's vaccine error were both repeated in the Instagram captions. (4 holds share this cause.)
- **Carry every hedge, qualifier and red-flag line into every caption, and put the hedge in the first line before the fold** (Facebook C1 10-08). Never make a claim stronger: no "at all", "responds well", "proven" or "only recommends". Always write "health authorities give preventive antibiotics to close contacts", so it never reads as self-treatment. (About 80 findings, 13 of them on plague.)
- **Tone:**
  - No emojis in plague captions on Meta.
  - No hashtags that imply an endorsement, like #CDC or #WHO, or an outbreak, like #outbreak (S1 10-08).
  - No engagement questions that invite people to post myths or links.
  - No "near you" local-risk phrasing.
  - (9 findings.)

### Everyone
- **Status discipline: say "suspected" or "reported", and add "not confirmed isn't ruled out" where it helps.** Date each statement with the day the agency made it: WHO's Oct 6 statement is "as of Oct 6", not "as of Oct 8" (S1 10-08). Name the population a negative result covers: "none among contacts tested so far", not "nothing found" (S1 10-08). Report test coverage, for example that about 60% of contacts were tested. (About 16 findings.)
- **Every source tag must say the line, credited to the body that said it.** S1 10-08 was held for crediting the Russian watchdog's "no plague case recorded" to WHO, and L1 10-07 was held for CDC claims CDC doesn't make.
  - Don't present our inferences as theirs. Examples: "precaution" credited to Reuters/AP and a CDC motive (S2 10-08); "kept apart" and "3 tools" credited to WHO (L1 10-08).
  - Don't call a paraphrase "exact wording", and don't put it in quote marks.
  - (2 holds, about 52 findings.)
- **Keep the source list clean:**
  - Use direct, stable URLs: the specific X post, not the profile, and no search or region-blocked URLs.
  - Use exact published titles and the issue year.
  - Give living pages a "last reviewed" date.
  - (About 40 findings.)
- **Urgency and safety caveats go with the advice in every output.**
  - Write "contact a doctor or local health authority urgently", and tie red flags to possible exposure.
  - Give CDC's full list of pneumonic warning signs: fever, cough, shortness of breath and chest pain.
  - Add practical caveats, such as "dog flea products can be toxic to cats".
  - Use calming facts from the source when they're available. Examples: no US person-to-person spread since 1924, and no direct US–Russia flights since 2022.
  - (About 19 findings.)
- **Say exactly what was measured or reported.** Human cases ≠ animal cases, average ≠ a fixed figure, and a person under observation ≠ a case. Use the same pronouns throughout for the person who died, and never lead with her name. (About 28 findings.)

_Updated 2026-10-08 from 54 QA records (10 on plague)._

_Updated 2026-10-08 from 54 QA records._
