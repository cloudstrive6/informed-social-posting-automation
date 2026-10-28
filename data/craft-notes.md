_Based on 70 QA records from 2026-10-15 to 2026-10-28: 42 Shorts, 15 long-forms and 13 carousels, all GLP-1. **10 were held.** S3 10-14 has moved out of the window._

_**New since the last pass:** 4 records from 10-28, all shipped with no holds._
- _All 4 mixed at a masking score of 0.011 or lower._
- _L1 10-28 (Bones and Muscle) had only 1 off-screen label and no dashed placeholder shelves. That's the first long-form in a week without them, so keep doing what it did._
- _The Shorts got worse on tags overlapping captions: 48 overlap findings across the 3 Shorts, the most of any day so far._
- _Captions still spell numbers out. S2 10-28 showed "FIVE PERCENT" for 58.5%, and the voice's pronunciation spelling "TRA-DIP-IH-TANT" appeared in the captions. That shows the captions are still built from the narration, not from the on-screen text._
- _Placeholder shelves shipped again in S3 10-28._

_Why items were held:_
- _**7 involved music masking the voice:** S3 10-16 (0.07), S2 10-21, S3 10-21, S2 10-22, S1 10-24, S1 10-25, and L1 10-27 at 0.024._
- _**2 had wrong subtitles or spoken text:** S3 10-22 (lot number PAR1229 garbled) and L1 10-27 (key numbers missing from the audio)._
- _**1 credited a claim to a source that didn't say it:** S2 10-24 (ACOG)._
- _**1 had a spoken CTA naming a video nobody could confirm was live:** S3 10-26._

### Motion Designer
- **Masking must be 0.02 or lower in the final mix, long-forms included. Measure it last.** If it's above 0.02, lower the music and measure again. Duck the music under all narration, and keep sound effects off spoken numbers, names and codes. Anything above 0.03 is dropped automatically. (7 holds. Shipped above target: 0.034, 0.030, 0.029, 0.028, 0.026, 0.025 ×3, 0.021 ×2. All 4 pieces on 10-28 were at 0.011 or lower, so keep that level.)
- **After the voice render, compare every number phrase in the speech-to-text transcript with the script.** If any dose, count, decimal or code is missing or garbled, regenerate that scene before mixing. (1 hold: L1 10-27 lost "10 or 15 mg", "783" and "41.1%". "Point" was lost in S1 10-22 and S1 10-26. S2 10-27 had a narration error rate of 0.117.)
- **Build captions from the script's on-screen text, never from the spoken transcript or the pronunciation spellings.** Every number, decimal, date, code and abbreviation matches its stat pill exactly and stays on one card ("43.0%", "58.5%", "61/142", "NK-1", "1,879", "Q1 2027", "PAR1229", "GFR", "BMI").
  - Before render, search the captions and fix every hit for: number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY), spaced single letters ("N K ONE", "G F R", "B-M-I") and hyphenated pronunciation spellings ("TRA-DIP-IH-TANT").
  - (This happened in nearly every Short. At least 7 wrong numbers reached the screen: "93" for 493, "THREE TRIALS" when the card said 2, "FOUR PERCENT" for 20.4%, "ONE THOUSAND ONE" for 1,180, and "FIVE PERCENT" for 58.5% in S2 10-28.)
- **Each caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen.**
  - Fully clear the previous card, its tags and any speech bubbles before the next card appears. (Ghost text: S3 10-26 ×4, S1 10-27, S3 10-27, S1 10-28 "Miracle pill", and the faded bubble in L1 10-28.)
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end a card on A, THE, AN, BE, BEING, CAN, MAY, NOT, OR, WHO, WHOSE, ABOUT, IN, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number.
  - Never split "TYPE 2 DIABETES", a trial name ("SURMOUNT" / "ONE" in S3 10-28) or "PHASE 3".
  - Never put an alarming phrase alone on a card ("KIDNEY FAILURE" in S1 10-25 and S1 10-27).
  - (Broken cards in all 42 Shorts.)
- **Shorts: the bottom caption band is for captions only. No part of any tag, chip, label or speech bubble goes below y 1150 on a 1920 frame.**
  - Put name tags above the head, with at most 2 tags on screen at once.
  - Drop any tag that repeats the caption's words.
  - Spell-check every tag ("Tirzepatic" shipped in S2 10-27).
  - (About 340 overlap findings, and the count is rising: 40 on 10-27 and 48 on 10-28.)
- **Long-forms: keep the bottom of every tag, chip and label box at y ≤ 1000 on a 1080 frame, with name tags above the head.**
  - Make all text at least ~40px, including organ and molecule labels ("Fat", "Lighter load", "Amylin", "Gallstones", "Blood sugar" and "10 pm" keep rendering at 22–26px).
  - (About 280 off-screen findings and about 225 tiny-text findings in 15 long-forms. L1 10-28 got off-screen findings down to 1 but still had 12 tiny labels.)
- **Every frame has a headline plus a labelled hero covering at least ~25% of it, from the first frame.**
  - Before render, delete every placeholder: dashed "—" shelves, empty chips and debug labels such as "The skipped number".
  - (Placeholders shipped in about 13 pieces: 7 long-forms, 5 Shorts including S3 10-28, and 1 carousel cell. About 165 near-empty-shot findings in long-forms, 10 of them in L1 10-28.)
- **Long-forms: one shot = one scripted beat.** Before render, check every shot's title and chips against its beat, clear the overlays from the previous shot, and confirm the disclaimer card is on screen at its beat. (L1 10-17, 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer card. In L1 10-28, recap chips leaked into a later shot.)
- **Mascots must read as whole, friendly characters that fit the message.**
  - People need a neck and shoulders (floating heads in 8 pieces).
  - No brown blobs or shapeless rocks (L1 10-21, S2 10-23, L1 10-28).
  - No scared or sweating organs.
  - No smiling mascot next to "heart attack" or "kidney failure" (S3 10-23, S1 10-27).
  - No green check on a warning.

### Scriptwriters
- **Never speak a video title.**
  - Long-forms end with: "There's a video I'd watch next, linked in the description."
  - Shorts end with: "Full breakdown on our channel, link in the description."
  - Never say "on screen", because the videos have no end screens.
  - (1 hold: S3 10-26. Spoken titles with no working link in about 11 pieces.)
- **Narration is exactly what gets spoken.**
  - Write numbers as words and "versus" in full.
  - Give new drug names a pronunciation spelling in the narration only, never in the on-screen text (the voice mangled elecoglipron, retatrutide and Wegovy).
  - Check for merged words ("zupremeone", "aonec").
  - Keep sentences with numbers short so the voice doesn't swallow them.
  - (About 22 pieces, 2 holds.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line.** (7 went over, the latest S2 10-28 at about 176 and S1 10-27 at about 186. The worst was S1 10-25 at about 260.)
- **Never say or show "estimand".** Say "counting everyone who started" or "if everyone stayed on treatment" instead, and use the same measure on both sides of any comparison. (On screen in L1 10-17, S2 10-27 and S3 10-27. Mixed measures in 5 pieces.)
- **Every spoken number names:**
  - what it measures and its unit;
  - the drug and the exact arm;
  - the comparator;
  - each group's size;
  - the timeframe and the reference point.
  - Put an absolute rate next to any relative figure.
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - Give the common side effects for every drug named.
  - A median is "half of people", not "most".
  - (About 55 findings, including S2 10-28 and L2 10-27.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to". Keep "may include" and "right away".
  - Label post-hoc and secondary analyses, and call company topline results "not yet peer-reviewed".
  - Clinician guidance stays clinician guidance. Never stretch one drug's reason to another drug.
  - Say what a trial didn't measure. Don't use vague credits like "experts think".
  - (About 28 findings and 1 hold. On 10-28: S1, S2 and L1.)
- **Muted-viewer test: on-screen text is never stronger or broader than the narration.** Every stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 38 findings, including S1 and S3 10-28 and all 3 Shorts on 10-27.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label arms and doses exactly ("1.7 or 2.4 mg", not "2.4 mg (max)").
  - Split any N into its groups, and mark adjusted figures "adjusted".
  - Scope "0 trials" to the review that was counted, and name the comparator on myth slides. Label myths "MYTH".
  - Leave no placeholder cells.
  - Never call side effects "the most common" unless the source ranks them.
  - Headlines promise only what the slide delivers.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 50 findings in 13 carousels.)

### Social Copywriter & packaging
- **YouTube description, at 1,400 characters or fewer counted after assembly.** Leave line 1 as the empty slot for the publisher's verified watch-next link. Never write "follow for more", a placeholder or a guessed URL there (VIDEO_ID shipped in L1 10-23, and L1 10-25 used an ID that returned 404). Then, in this order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources.
  4. Real chapters (long-forms only, never placeholders).
  5. Complete hashtags, last.
  - No internal production notes in any public field (one sat in L1 10-28's description).
  - Cut "what you'll learn" and repeated paragraphs first, never the sources or hashtags.
  - (Line 1 missed about 11 times. L1 10-27 was cut off mid-word. 5 descriptions ran to 1,450–1,500 characters. The quick answer ran long about 25 times.)
- **Titles, thumbnails, captions and hashtags:**
  - 100 characters or fewer, with at most 1 number and 1 abbreviation.
  - Use the exact product, population and status.
  - Hashtag only drugs whose data the post's own text reports.
  - No condition tags for populations the trials didn't enrol (#Osteoporosis), no company tags (#Zealand), and no brand tag for a use the trial didn't study (#Mounjaro on SURMOUNT-1).
  - (Hashtag scope problems in 8 pieces.)
- **Every caption field ends on "Not personal advice" (exact words) plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it, hashtags included.**
  - Threads bodies are about 300 characters, safety lines counted. Cut a clause, never a safety line, and keep the full don't-switch/stop line.
  - (Threads ran over in nearly every piece, including all 4 on 10-28. Fields that didn't end on the safety lines: S1 10-28, S1 10-23, S3 10-18.)
- **Copy facts, qualifiers and attributions word for word from the verified script.** That includes:
  - "on average", "maximum tolerated dose" and "all doses combined";
  - group sizes and the timeframe;
  - "can include", and the clinician or kidney caveats.
  - Say which number belongs to which group, and name the side effects on every benefit caption, TikTok included.
  - (About 160 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.**
  - Engagement lines ask people to save or share only. No open questions, especially on pregnancy, gray-market or investigational-drug posts.
  - No emoji on side-effect, safety, stopping or gray-market posts.
  - (About 25 times, the latest S3 10-28.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH (obesity, or overweight with a weight-related condition). TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **SURMOUNT-1 body-scan substudy:** 160 people scanned, 124 on tirzepatide (all doses pooled) versus 36 on placebo, over 72 weeks. Cite the kilogram figures and the ~75% fat / ~25% lean split to Look et al., *Diabetes Obes Metab* 2025, not the NEJM paper. (The group split was dropped or the figures miscited in 6 pieces, the latest L1 10-28.)
  - **SURMOUNT-5:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at 1.7 or 2.4 mg.
  - **SURMOUNT-4:** 783 people began the lead-in, then 335 versus 335 were randomized at week 36. The +14.0% is regain from week 36 to week 88, not from the start.
  - **SURPASS-2:** type 2 diabetes, open-label, versus semaglutide 1 mg, which was the top diabetes dose at the time.
  - **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75, semaglutide 1 mg versus placebo.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2 and SOLSTICE is Phase 2b; it is investigational.
  - (About 50 findings.)
- **Credit every line to whoever actually said or wrote it, with the day, month and year, and make sure every source tag actually says the line it's attached to.**
  - Only printed words go inside quote marks.
  - Name the exact body (PRAC, CHMP).
  - Don't call academic authors "the manufacturer's researchers".
  - Our own tips and inferences get no tag. (S3 10-28 tagged the GLP-1 advisory to WHO's 2-day figure. L1 10-28 tagged a guideline to our own starter moves.)
  - (1 hold: S2 10-24. About 90 tag findings.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.** Comparison, stopping and safety posts add "don't switch, stop or change your medicines on your own". (About 25 findings.)
- **Keep the source list clean.** Use canonical URLs with no landing pages, redirects or 403s. Cite the primary paper, check the article ID and which journal's version you link, and give both the online-first and print dates. (About 90 findings.)

_Updated 2026-10-28 from 70 QA records (all GLP-1, 10-15 to 10-28)._

_Updated 2026-10-28 from 70 QA records._
