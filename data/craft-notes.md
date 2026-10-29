_Based on 70 QA records from 2026-10-16 to 2026-10-29: 42 Shorts, 16 long-forms and 12 carousels, all GLP-1. **12 were held.** No carousels have been made since 10-27._

_**New since the last pass:** 1 record, L2 10-29 (Protein on Tirzepatide). It shipped._
- _Its audio was clean (masking 0.007), so long-forms can mix well below 0.02. The voice still dropped one "about", which the transcript check exists to catch._
- _Old visual defects came back. Dashed "—" placeholder shelves took up about 40% of the frame. Dana was a floating head 2 times. A ghost speech bubble was left behind. There were 15 off-screen labels and 7 near-empty shots. The "Fat" label rendered at 23px._
- _Scope drift from the joint nutrition advisory happened again. Its "avoid fatty or high-fiber foods during the first few days of treatment" became "especially early on". L1 10-21 had stretched the same line to "queasy days". There was also a misquote (not word for word) and a vague credit ("experts don't agree")._

_Why items were held (unchanged):_
- _**8 for music masking the voice:** S3 10-16 (0.07); S2 10-21, S3 10-21, S2 10-22, S1 10-24 and S1 10-25 (0.034–0.039); L1 10-27 (0.024); L1 10-29 (0.023)._
- _**3 for wrong spoken numbers or subtitles:** S3 10-22, L1 10-27 and L1 10-29._
- _**1 for a wrong count:** S1 10-29 said 5 cases; the source reports 11._
- _**1 for crediting a claim to a source that didn't say it:** S2 10-24 (ACOG)._
- _**1 for a spoken CTA naming a video nobody could confirm was live:** S3 10-26._

### Motion Designer
- **The final mix must have masking of 0.02 or lower, for long-forms as well as Shorts. Measure it last.**
  - If it's above 0.02, lower the music and measure again.
  - Duck the music under all narration. Keep sound effects off spoken numbers, names and codes.
  - Above 0.03 is an automatic drop. Editor-in-Chief also holds long-forms at 0.023–0.024.
  - (8 holds. Long-forms that ship clean mix at 0.003–0.018, including L2 10-29 at 0.007. Aim for that.)
- **After the voice render, compare the speech-to-text transcript with the script for every number phrase, every qualifier ("about", "point") and every drug name.**
  - If anything is missing or garbled, regenerate that scene before mixing.
  - (3 holds: L1 10-27, L1 10-29 and S3 10-22. "Point" was dropped 3 times and "about" in L2 10-29. Retatrutide came out as "rita trutide" and "rheumatoid". "Thirteen" came out as "one thousand three".)
- **Build captions from the script's on-screen text, never from the narration or the pronunciation spellings.**
  - Every number, decimal, date, code and abbreviation matches its stat pill exactly and stays on one card ("43.0%", "1,879", "NK-1", "GLP-1", "Q1 2027", "PAR1229", "BMI", "FDA").
  - Before render, search the captions and fix every hit for:
    - number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, GLP-ONE);
    - spaced single letters ("F D A", "G F R", "N K ONE");
    - hyphenated pronunciation spellings ("REH-TAH-TROO-TIDE", "TRA-DIP-IH-TANT").
  - (Nearly every Short. At least 7 wrong numbers reached the screen, e.g. "93" for 493 and "FIVE PERCENT" for 58.5%.)
- **Each caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles before the next one appears. (Ghost text in about 10 pieces, latest L2 10-29.)
  - Never split a word, a trial name, "TYPE 2 DIABETES" or "PHASE 3".
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end a card on A, THE, AN, BE, BEING, CAN, MAY, NOT, OR, WHO, WHOSE, ABOUT, IN, LIKE, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number.
  - Never put an alarming phrase alone on a card.
  - (Broken cards in all 42 Shorts.)
- **Shorts: no part of any tag, chip, label or bubble goes below y 1150 on a 1920 frame.**
  - Put name tags above the head, with at most 2 tags on screen at once.
  - Drop any tag that repeats the caption, and spell-check every tag.
  - (About 345 overlap findings. They fell to 12 on 10-29 from 40–48 a day, so keep doing what 10-29 did.)
- **Long-forms: keep the bottom of every tag, chip and label at y ≤ 1000 on a 1080 frame, with name tags above the head.**
  - All text is at least ~40px, including organ and molecule labels ("Fat", "Amylin", "Gallstones", "10 pm" keep rendering at 22–26px).
  - (About 315 off-screen and 225 tiny-text findings in 16 long-forms. L2 10-29 had 15 off-screen.)
- **Every frame has a headline plus a labelled hero covering at least ~25% of it, from the first frame.**
  - Before render, delete every placeholder: dashed "—" shelves, empty chips and bubbles, greyed duplicate people and debug labels.
  - (Placeholders in about 17 pieces, including both 10-29 long-forms. About 172 near-empty-shot findings in long-forms.)
- **Long-forms: one shot = one scripted beat.**
  - Before render, check each shot's title and chips against its beat and clear the previous shot's overlays.
  - Confirm the disclaimer card is on screen at its beat.
  - (L1 10-17, 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer. Recap chips leaked into a later shot in L1 10-28.)
- **Mascots must read as whole, friendly characters that fit the message.**
  - People need a neck and shoulders. (Floating heads in about 10 pieces, latest L2 10-29 ×2.)
  - No brown blobs or shapeless rocks.
  - No scared, sweating or crying characters.
  - No smiling mascot next to "heart attack" or "kidney failure", and no green check on a warning.

### Scriptwriters
- **Never speak a video title.**
  - Long-forms end with: "There's a video I'd watch next, linked in the description."
  - Shorts end with: "Full breakdown on our channel, link in the description."
  - Never say "on screen".
  - (1 hold: S3 10-26. Spoken titles in about 11 pieces.)
- **Narration is exactly what gets spoken.**
  - Write numbers as words, and give each decimal its own short sentence.
  - Use pronunciation spellings in the narration only; put the plain name in the on-screen text field.
  - Check for merged words.
  - (About 26 pieces, 3 holds.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line.** (8 went over, the latest S3 10-29 at 171.)
- **Never say or show "estimand".** Say "counting everyone who started" or "if everyone stayed on treatment" instead, and use the same measure on both sides of any comparison. (3 pieces showed the word. Mixed measures in 5.)
- **Check every count against the source's own unit: cases, trials, participants or reports.**
  - Every spoken number names its measure and unit, the drug and exact arm, the comparator, each group's size, and the timeframe and reference point.
  - Put an absolute rate next to any relative figure.
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - A median is "half of people".
  - (1 hold: S1 10-29. About 55 findings.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to". Keep "may include" and "right away".
  - Label post-hoc and secondary analyses, and call company topline results "not yet peer-reviewed".
  - Use "first" only with its exact scope.
  - No vague credits ("experts think" in S1 10-28, "experts don't agree" in L2 10-29). Say what the source says, e.g. "it's unclear".
  - (About 33 findings, 1 hold.)
- **Muted-viewer test: on-screen text is never stronger or broader than the narration.**
  - Every stat card names the drug and dose, both groups, the population, the measure and the timeframe.
  - Pooled doses say "all doses".
  - (About 40 findings.)

### Carousel Designer
- _None produced since 10-27. Apply this if they come back, using verified Short text only._
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label arms and doses exactly, split any N into its groups, and mark adjusted figures "adjusted".
  - Label myths "MYTH". Leave no placeholder cells.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 50 findings in 12 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,400 characters or fewer, counted after assembly.** Line 1 is the empty slot for the publisher's verified link. Never put "follow for more", a placeholder or a guessed URL there. Then, in this order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources, including the source of every number quoted.
  4. Real chapters (long-forms only).
  5. Complete hashtags.
  - No internal production notes in any public field.
  - (Line 1 missed about 11 times. 1 description was cut off mid-word. 6 ran to 1,400–1,500 characters. The quick answer ran long about 25 times.)
- **Titles, thumbnails, captions and hashtags:**
  - 100 characters or fewer, with at most 1 number and 1 abbreviation.
  - Use the exact product, population and status.
  - The thumbnail must not suggest a single fix the video qualifies (e.g. protein without strength training).
  - Hashtag only drugs whose data the post reports. No company tags, and no condition or brand tags outside the trial's population.
  - (About 10 pieces.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.**
  - Threads is about 300 characters, safety lines counted. Cut a clause, never a safety line.
  - (Threads ran over in nearly every piece.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script, pinned comments included.**
  - That includes "on average", "all doses combined", "or overweight plus a weight-related condition", group sizes, the timeframe and the clinician or kidney caveats.
  - (About 168 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.**
  - Engagement lines ask people to save or share only.
  - No emoji on side-effect, safety, stopping or gray-market posts.
  - (About 27 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **SURMOUNT-1 body-scan substudy:** 124 on tirzepatide (all doses pooled) versus 36 on placebo, over 72 weeks. Cite the kilogram figures and the ~75% fat / ~25% lean split to Look et al., *Diabetes Obes Metab* 2025.
  - **SURMOUNT-5:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at 1.7 or 2.4 mg.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 versus 335 were randomized at week 36. The +14.0% is regain from week 36 to week 88.
  - **SURPASS-2:** type 2 diabetes, open-label, versus semaglutide 1 mg. **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75, semaglutide 1 mg.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Tirzepatide pancreatitis review:** 11 participants across 5 trials. **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2 and SOLSTICE is Phase 2b.
  - (About 52 findings, 1 hold.)
- **Joint GLP-1 nutrition advisory: quote only what it says.**
  - It says to get enough protein and do strength training.
  - It says "avoiding fatty or high fiber foods during the first few days of treatment" can ease nausea. Don't stretch that to "queasy days" or "early on".
  - It does not say "protein at each meal", "eat slowly" or "stop when full". Those are our own tips and carry no tag.
  - (4 findings: L1 10-16, S1 10-16, L1 10-21 ×2, L2 10-29.)
- **Credit every line to whoever actually said or wrote it, with the day, month and year.**
  - Every source tag must actually say the line it's attached to.
  - Only the exact printed words go inside quotes. (L2 10-29 dropped a word from a quote.)
  - Name the exact body (PRAC, CHMP). Our own tips get no tag.
  - (1 hold: S2 10-24. About 97 tag findings.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.** Comparison, stopping and safety posts add "don't switch, stop or change your medicines on your own". (About 25 findings.)
- **Keep the source list clean.** Use canonical URLs with no landing pages, DOI redirects or 403s. Cite the primary paper, check the article ID and the journal version, and give the online-first and print dates. (About 92 findings.)

_Updated 2026-10-29 from 70 QA records (all GLP-1, 10-16 to 10-29)._

_Updated 2026-10-29 from 70 QA records._
