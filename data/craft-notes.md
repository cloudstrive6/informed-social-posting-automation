_Based on 69 QA records from 2026-10-16 to 2026-10-29: 42 Shorts, 15 long-forms and 12 carousels, all GLP-1. **12 were held.** The 10-15 records are now out of the window. No carousels have been made since 10-27._

_**New since the last pass:** 4 records from 10-29. 2 were held._
- _**L1 10-29 was held.** Masking was 0.023, the voice dropped "point" from 2.2, 1.8, 19.5% and 20.9%, and it said "rheumatoid" for retatrutide. That's the second long-form in a row held for masking (L1 10-27 was 0.024). Off-screen labels jumped back up to 19 (L1 10-28 had 1), and placeholder shelves came back 3 times._
- _**S1 10-29 was held for a wrong count.** It said "five reported cases" of pancreatitis. The source reports 11 cases across 5 trials._
- _Overlap between tags and captions in Shorts fell from 48 on 10-28 to 12 on 10-29. Keep doing that._
- _Pronunciation spellings got into the captions again ("REH-TAH-TROO-TIDE" in S3 10-29, after "TRA-DIP-IH-TANT" on 10-28), along with "GLP-ONE" and "F D A". The captions are still being built from the narration._

_Why items were held:_
- _**8 involved music masking the voice:** S3 10-16 (0.07), S2 10-21, S3 10-21, S2 10-22, S1 10-24, S1 10-25 (all 0.034–0.039), L1 10-27 (0.024) and L1 10-29 (0.023)._
- _**3 had wrong subtitles or spoken numbers:** S3 10-22 (PAR1229 garbled), L1 10-27 (key numbers missing from the audio) and L1 10-29 ("point" dropped, drug name mangled)._
- _**1 had a wrong count:** S1 10-29 (5 vs 11 cases)._
- _**1 credited a claim to a source that didn't say it:** S2 10-24 (ACOG)._
- _**1 spoke a CTA naming a video nobody could confirm was live:** S3 10-26._

### Motion Designer
- **Masking must be 0.02 or lower in the final mix, for long-forms as well as Shorts. Measure it last.**
  - If it's above 0.02, lower the music and measure again.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - Anything above 0.03 is dropped automatically, and Editor-in-Chief now holds long-forms at 0.023–0.024.
  - (8 holds. Shipped above target: 0.034, 0.030, 0.029, 0.028, 0.026, 0.025 ×2, 0.021 ×2. Long-forms that shipped mixed at 0.003–0.018, so aim for that.)
- **After the voice render, check the speech-to-text transcript against the script for every number phrase and every drug name.**
  - If any "point", dose, count, decimal, code or drug name is missing or garbled, regenerate that scene before mixing.
  - (3 holds: L1 10-27, L1 10-29 and S3 10-22. "Point" was dropped in S1 10-22, S1 10-26 and L1 10-29. Retatrutide came out as "rita trutide" and "rheumatoid". "Thirteen" came out as "one thousand three" in S3 10-29.)
- **Build captions from the script's on-screen text, never from the narration or the pronunciation spellings.**
  - Every number, decimal, date, code and abbreviation matches its stat pill exactly and stays on one card ("43.0%", "58.5%", "1,879", "NK-1", "GLP-1", "Q1 2027", "PAR1229", "GFR", "BMI", "FDA").
  - Before render, search the captions and fix every hit for:
    - number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, GLP-ONE);
    - spaced single letters ("N K ONE", "F D A", "G F R", "B-M-I");
    - hyphenated pronunciation spellings ("TRA-DIP-IH-TANT", "REH-TAH-TROO-TIDE").
  - (Nearly every Short. At least 7 wrong numbers reached the screen, e.g. "93" for 493, "FOUR PERCENT" for 20.4% and "FIVE PERCENT" for 58.5%.)
- **Each caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen.**
  - Fully clear the previous card, its tags and any bubbles before the next card appears. (Ghost text in S3 10-26 ×4, S1 10-27, S3 10-27, S1 10-28, L1 10-28 and S1 10-29.)
  - Never split a word ("A SINGLE I" in S2 10-29).
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end a card on A, THE, AN, BE, BEING, CAN, MAY, NOT, OR, WHO, WHOSE, ABOUT, IN, LIKE, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number.
  - Never split "TYPE 2 DIABETES", a trial name or "PHASE 3".
  - Never put an alarming phrase alone on a card ("KIDNEY FAILURE" ×2).
  - (Broken cards in all 42 Shorts.)
- **Shorts: no part of any tag, chip, label or bubble goes below y 1150 on a 1920 frame.**
  - Put name tags above the head, with at most 2 tags on screen at once.
  - Drop any tag that repeats the caption's words, and spell-check every tag.
  - (About 345 overlap findings. They fell to 12 on 10-29, from 40–48 a day on 10-24 to 10-28, so keep doing what 10-29 did.)
- **Long-forms: keep the bottom of every tag, chip and label at y ≤ 1000 on a 1080 frame, with name tags above the head. All text is at least ~40px**, including organ and molecule labels ("Fat", "Amylin", "Gallstones", "Blood sugar", "10 pm" keep rendering at 22–26px).
  - (About 300 off-screen and 220 tiny-text findings in 15 long-forms. The gain in L1 10-28, 1 off-screen finding, didn't hold: L1 10-29 had 19.)
- **Every frame has a headline plus a labelled hero covering at least ~25% of it, from the first frame.**
  - Before render, delete every placeholder: dashed "—" shelves, empty chips, empty speech bubbles, greyed duplicate people and debug labels such as "The skipped number".
  - (Placeholders in about 16 pieces, including L1 10-29 ×3, S2 10-29 and S1 10-29. About 165 near-empty-shot findings in long-forms.)
- **Long-forms: one shot = one scripted beat.** Before render, check every shot's title and chips against its beat, clear the overlays from the previous shot, and confirm the disclaimer card is on screen at its beat. (L1 10-17, 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer. Recap chips leaked into a later shot in L1 10-28.)
- **Mascots must read as whole, friendly characters that fit the message.**
  - People need a neck and shoulders (floating heads in about 9 pieces, latest L1 10-29 ×2).
  - No brown blobs or shapeless rocks.
  - No scared, sweating or crying characters (crying pill in S3 10-29).
  - No smiling mascot next to "heart attack" or "kidney failure".
  - No green check on a warning.

### Scriptwriters
- **Never speak a video title.**
  - Long-forms end with: "There's a video I'd watch next, linked in the description."
  - Shorts end with: "Full breakdown on our channel, link in the description."
  - Never say "on screen".
  - (1 hold: S3 10-26. Spoken titles in about 11 pieces.)
- **Narration is exactly what gets spoken.**
  - Write numbers as words, and keep each decimal in its own short sentence ("A1C fell two point two points."). The voice drops "point" in long sentences.
  - Give new drug names a pronunciation spelling in the narration only, and also write the plain name in the on-screen text field so captions never pick up the spelling.
  - Check for merged words.
  - (About 25 pieces, 3 holds.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line.** (8 went over, the latest S3 10-29 at 171 and S2 10-28 at 176. The worst was S1 10-25 at about 260.)
- **Never say or show "estimand".** Say "counting everyone who started" or "if everyone stayed on treatment" instead, and use the same measure on both sides of any comparison. (3 pieces showed the word. Mixed measures in 5.)
- **Check every count against the source's own unit: cases vs trials vs participants vs reports.**
  - Every spoken number names what it measures and its unit, the drug and exact arm, the comparator, each group's size, and the timeframe and reference point.
  - Put an absolute rate next to any relative figure.
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - Give the common side effects for every drug named.
  - A median is "half of people".
  - (1 hold: S1 10-29 said "5 cases" when the source reports 11 cases in 5 trials. S1 10-24 showed "3 trials" when there were 2. About 55 findings.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to". Keep "may include" and "right away".
  - Label post-hoc and secondary analyses, and call company topline results "not yet peer-reviewed".
  - Write "first" only with its exact scope (L1 10-29's "first head-to-head" ignored an earlier dulaglutide comparison).
  - Never stretch one drug's reason to another drug, and don't use vague credits like "experts think".
  - (About 30 findings, 1 hold.)
- **Muted-viewer test: on-screen text is never stronger or broader than the narration.** Every stat card names the drug and dose, both groups, the population, the measure and the timeframe. Pooled doses say "all doses". (About 40 findings, including S1 and S3 10-29.)

### Carousel Designer
- _None produced since 10-27. Apply this rule if they come back._
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label arms and doses exactly ("1.7 or 2.4 mg").
  - Split any N into its groups, and mark adjusted figures "adjusted".
  - Scope "0 trials" to the review that was counted, and label myths "MYTH".
  - Leave no placeholder cells, and don't call side effects "the most common" unless the source ranks them.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 50 findings in 12 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,400 characters or fewer, counted after assembly.** Line 1 is the empty slot for the publisher's verified link. Never put "follow for more", a placeholder or a guessed URL there. Then, in this order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources.
  4. Real chapters (long-forms only).
  5. Complete hashtags.
  - No internal production notes in any public field.
  - Cut "what you'll learn" and repeated lines first.
  - (Line 1 missed about 11 times. 1 description was cut off mid-word. 6 ran to 1,400–1,500 characters, the latest L1 10-29. The quick answer ran long about 25 times.)
- **Titles, thumbnails, captions and hashtags:**
  - 100 characters or fewer, with at most 1 number and 1 abbreviation.
  - Use the exact product, population and status ("skin-sensation side effect", not "skin side effect").
  - Hashtag only drugs whose data the post's own text reports.
  - No condition tags for populations the trials didn't enrol, no company tags, and no brand tag for a use the trial didn't study.
  - (Scope problems in about 9 pieces.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.**
  - Threads is about 300 characters, safety lines counted. Cut a clause, never a safety line, and keep the full don't-switch/stop line.
  - (Threads ran over in nearly every piece, including S1 and S3 10-29.)
- **Copy facts, qualifiers and attributions word for word from the verified script.**
  - That includes "on average", "maximum tolerated dose", "all doses combined", group sizes, the timeframe, "can include" and the clinician or kidney caveats.
  - Say which number belongs to which group, and name the side effects on every benefit caption.
  - (About 165 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.**
  - Engagement lines ask people to save or share only.
  - No emoji on side-effect, safety, stopping or gray-market posts.
  - (About 27 times, including S2 and S3 10-29.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **SURMOUNT-1 body-scan substudy:** 160 people scanned, 124 on tirzepatide (all doses pooled) versus 36 on placebo, over 72 weeks. Cite the kilogram figures and the ~75% fat / ~25% lean split to Look et al., *Diabetes Obes Metab* 2025.
  - **SURMOUNT-5:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at 1.7 or 2.4 mg.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 versus 335 were randomized at week 36. The +14.0% is regain from week 36 to week 88.
  - **SURPASS-2:** type 2 diabetes, open-label, versus semaglutide 1 mg, the top diabetes dose at the time.
  - **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75, semaglutide 1 mg versus placebo.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Tirzepatide pancreatitis scoping review:** 11 participants with pancreatitis across 5 trials.
  - **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2 and SOLSTICE is Phase 2b.
  - (About 52 findings, 1 hold.)
- **Credit every line to whoever actually said or wrote it, with the day, month and year, and make sure every source tag actually says the line it's attached to.**
  - Only printed words go inside quotes.
  - Name the exact body (PRAC, CHMP).
  - Academic authors are not "the manufacturer's researchers".
  - Our own tips get no tag (S2 10-29 tagged "enjoy a treat without guilt").
  - (1 hold: S2 10-24. About 95 tag findings.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.** Comparison, stopping and safety posts add "don't switch, stop or change your medicines on your own". (About 25 findings.)
- **Keep the source list clean.** Use canonical URLs with no landing pages, redirects or 403s. Cite the primary paper, check the article ID and the journal version you link, and give the online-first and print dates. (About 90 findings.)

_Updated 2026-10-29 from 69 QA records (all GLP-1, 10-16 to 10-29)._

_Updated 2026-10-29 from 69 QA records._
