_Based on 71 QA records from 2026-10-14 to 2026-10-27 (42 Shorts, 15 long-forms, 14 carousels, all GLP-1). **11 were held**, the same as the last pass. The only new record is L2 10-27 (Tirzepatide Weight Loss Plateau). It shipped at masking 0.003, but it repeated the long-form layout faults: 31 off-screen labels, dashed placeholder shelves in about 6 shots, and a clipped "Prescriber" tag._

_Why items were held:_
- _**7 involved music masking the voice:** S3 10-16, S2 10-21, S3 10-21, S2 10-22, S1 10-24, S1 10-25, and L1 10-27 at 0.024._
- _**3 had wrong subtitle, script or spoken text:** S3 10-14, S3 10-22, L1 10-27 (key numbers dropped from the audio)._
- _**2 credited a claim to a source that didn't say it:** S3 10-14 (CNN), S2 10-24 (ACOG)._
- _**1 had a spoken CTA naming a video nobody could confirm was live:** S3 10-26._

### Motion Designer
- **Masking must be 0.02 or lower in the final mix, long-forms included. Measure it last.** If it's above 0.02, lower the music and measure again. Duck the music under all narration, and keep sound effects off spoken numbers, names and codes. Anything above 0.03 is dropped automatically. (7 holds. Shipped above target: 0.05, 0.034, 0.030, 0.029, 0.028, 0.026, 0.025 ×2, 0.024, 0.021 ×2.)
- **After the voice render, compare every number phrase in the speech-to-text transcript with the script.** If any dose, count or percentage is missing or garbled, regenerate that scene before mixing. (L1 10-27 was held after "10 or 15 mg", "783" and "41.1%" were lost. "Point" was dropped in S1 10-22 and S1 10-26. S2 10-27 had a narration error rate of 0.117.)
- **Each caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen.**
  - Fully clear the previous card and its tags before the next card appears. (Ghost text: S3 10-26 ×4, S1 10-27, S3 10-27.)
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end a card on A, THE, BE, BEING, CAN, MAY, NOT, OR, WHOSE, ABOUT, IN, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number.
  - Never split "TYPE 2 DIABETES", a trial name or "PHASE 3".
  - Never put an alarming phrase alone on a card. ("KIDNEY FAILURE" appeared alone in S1 10-25 and S1 10-27.)
  - (Broken cards in all 42 Shorts.)
- **Build captions from the script's on-screen text, never from the spoken transcript.** Every number, decimal, date, code and abbreviation matches its stat pill exactly and stays on one card ("1,879", "−2.30", "Q1 2027", "PAR1229", "GFR", "BMI"). Before render, search the captions for number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY) and for spaced single letters, and fix every hit. (Found in every Short. A wrong number reached the screen about 17 times, including "93" for 493 and "THREE TRIALS" when the card said 2. 1 hold.)
- **Shorts: put tags and speech bubbles only in the top 60% of the frame (y ≤ 1150 on a 1920 frame), above the character.** Fade each tag out before the next caption appears. Never show a tag that repeats the caption's words, and spell-check every tag ("Tirzepatic" shipped in S2 10-27). (About 390 overlap findings.)
- **Long-forms: keep the bottom of every tag, chip and label box at y ≤ 1000 on a 1080 frame, with name tags above the head.** Make all text at least ~40px, including organ and molecule labels ("Amylin", "Gallstones", "Blood sugar", "10 pm" keep rendering at 22–26px). (About 290 off-screen findings and about 230 tiny-text findings in 15 long-forms. Bottom-edge tags such as Dana, Sam, Marcus, "Prescriber" and "Your weight" were clipped in 10 of them, the latest L2 10-27.)
- **Every frame has a headline plus a labelled hero covering at least ~25% of it, from the first frame.** Before render, delete every placeholder: dashed "—" shelves, empty chips and debug labels such as "The skipped number". (Placeholders shipped about 18 times, in 6 long-forms in a row from L1 10-21 to L2 10-27. About 160 near-empty-shot findings in long-forms.)
- **Long-forms: one shot = one scripted beat.** Before render, check every shot's title and chips against its beat, and confirm the disclaimer card is on screen at its beat. (L1 10-17, 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer card.)
- **Mascots read as whole, friendly and on-message.** People need a neck and shoulders. No brown blobs, no scared organs, no smiling mascot next to "heart attack" or "kidney failure", and no green check on a warning. (Floating heads in 8 pieces. Smiling mascot next to serious outcomes in S3 10-23 and S1 10-27.)

### Scriptwriters
- **Name a video in the CTA only if its URL is oEmbed-confirmed live at script time, with the title copied exactly from YouTube.** Otherwise use the playbook line: "Full breakdown on our channel, link in the description." Never speak a title. (1 hold: S3 10-26. CTA problems in 11 pieces.)
- **Narration is exactly what gets spoken.** Write numbers as words and "versus" in full. Give new drug names a phonetic respelling (the voice mangled elecoglipron, retatrutide and Wegovy). Check for merged words ("zupremeone", "aonec"). Keep number-heavy sentences short so the voice doesn't swallow them. (About 24 pieces, 3 holds.)
- **Never say or show "estimand".** Say "counting everyone who started" or "if everyone stayed on treatment" instead, and use the same measure on both sides of any comparison. (On screen in S2 and S3 10-27. Mixed measures in 5 pieces.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line.** (About 18 went over, the latest S1 10-27 at about 186 words and S1 10-25 at about 260.)
- **Every spoken number names what it measures, its unit, the drug and the exact arm, the comparator, each group's size, the timeframe and the reference point.** Put an absolute rate next to any relative figure. Say "separate trials, not head-to-head" for cross-trial comparisons, and give the common side effects for each drug named. A median is "half of people", not "most". (About 60 findings, including S2 10-27 and L2 10-27.)
- **Keep every finding at its source's exact scope, verb and urgency.** Observational studies are "linked to". Keep "may include" and "right away". Clinician guidance stays clinician guidance. Never stretch one drug's reason to another drug. Say what a trial didn't measure. (About 26 findings, 1 hold.)
- **Muted-viewer test: on-screen text is never stronger or broader than the narration.** Every stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 38 findings, including all 3 Shorts on 10-27.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.** Label arms exactly, split any N into its groups, and mark adjusted figures "adjusted". Scope "0 trials" to the review that was counted, and name the comparator on myth slides. Label myths "MYTH" and leave no placeholder cells. Never call side effects "the most common" unless the source ranks them. Headlines promise only what the slide delivers. The last slide carries the disclaimer and the prescriber line. (About 56 findings.)

### Social Copywriter & packaging
- **YouTube description, in this order, at 1,400 characters or fewer counted after assembly.** Cut "what you'll learn" and repeated paragraphs first, never the sources or hashtags.
  1. The verified watch-next link (the publisher's), if the voice points to one.
  2. A quick answer of 3 lines or fewer that names one side effect.
  3. The disclaimer plus the prescriber line.
  4. Up to 4 sources.
  5. Real chapters (long-forms only, never placeholders).
  6. Complete hashtags, last.
  - (Line 1 missed 9 times. L1 10-27 was cut off mid-word. 4 descriptions ran to 1,450–1,500 characters. The quick answer ran long about 26 times.)
- **Titles, thumbnails, captions and hashtags: 100 characters or fewer, at most 1 number and 1 abbreviation, and the exact product, population and status.** Hashtag only drugs whose data the post's own text reports. No condition tags for populations the trials didn't enrol (#Osteoporosis) and no company tags. (Hashtag scope problems in 8 pieces, the latest C1 10-26 and C1 10-27.)
- **Every caption field ends on the disclaimer plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.** Threads bodies are about 300 characters, safety lines counted. Cut a clause, never a safety line, and keep the full don't-switch/stop line. (Threads ran over in nearly every piece.)
- **Copy facts, qualifiers and attributions word for word from the verified script.** That includes "on average", "maximum tolerated dose", "all doses combined", group sizes, the timeframe and "can include". Say which number belongs to which group, and name the side effects on every benefit caption, TikTok included. (About 170 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only. No emoji on side-effect, safety, stopping or gray-market posts. (About 24 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH (obesity, or overweight with a weight-related condition). TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **SURMOUNT-5:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at 1.7 or 2.4 mg.
  - **SURMOUNT-4:** 783 people began the lead-in, then 335 versus 335 were randomized at week 36. The +14.0% is regain from week 36 to week 88, not from the start.
  - **SURPASS-2:** type 2 diabetes, open-label, versus semaglutide 1 mg, which was the top diabetes dose at the time.
  - **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75, semaglutide 1 mg versus placebo.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2 and SOLSTICE is Phase 2b; it is investigational.
  - (About 47 findings.)
- **Credit every line to whoever actually said or wrote it, with the day, month and year.** Only printed words go inside quote marks. Name the exact body (PRAC, CHMP). Don't call academic authors "the manufacturer's researchers". (2 holds, plus L2 10-27.)
- **Every source tag must actually say the line it's attached to.** Our own tips and inferences get no tag. (About 90 findings.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.** Comparison and stopping posts add "don't switch, stop or change your medicines on your own". (About 25 findings.)
- **Keep the source list clean.** Use canonical URLs with no landing pages, redirects or 403s. Cite the primary paper, check the article ID, and give both the online-first and print dates. (About 92 findings.)

_Updated 2026-10-27 from 71 QA records (all GLP-1, 10-14 to 10-27)._

_Updated 2026-10-27 from 71 QA records._
