_Based on 70 QA records from 2026-10-14 to 2026-10-27: 42 Shorts, 14 long-forms and 14 carousels, all GLP-1. **11 were held.** The 10-13 records have aged out._

_New on 10-27 (5 pieces): **1 held**, and it was the first long-form hold in this window._
- _**L1 (What Happens When You Stop Tirzepatide) was held.**_
  - _The voice dropped whole phrases that carried key numbers. "10 or 15 mg" came out as silence, "783 people began" as "the beginning", and "41.1%" as "tier"._
  - _Masking was 0.024, the first long-form above 0.02 (they used to be 0.003–0.018)._
  - _The disclaimer card was missing at its beat, and 5 or more shots showed hunger-hormone scenes from much later in the video._
  - _A placeholder card labelled "The skipped number" shipped._
  - _The description ran past 1,400 characters and was cut off mid-word, so the sources and hashtags were lost._
- _**S2** shipped at masking 0.026, with narration WER 0.117. Its decimals were split across cards ("TWO POINT"), it had a garbled "Tirzepatic Semaglutide" chip, and "ESTIMAND" appeared on screen._
- _**S1** had ghost text 3 times, "HAD KIDNEY FAILURE," alone on a card for the 2nd time, a smiling heart next to it, a spaced "G F R", and about 186 words._
- _**S3** had ghost text, "…ESTIMAND." on screen, and caption cards ending on an ellipsis or a dash._
- _**C1** used out-of-scope hashtags (#Semaglutide, #Exenatide, #Osteoporosis)._

_Why items were held (in this window):_
- _**7 involved music masking the voice:** S3 10-16, S2 10-21, S3 10-21, S2 10-22, S1 10-24, S1 10-25 (all automatic drops), and L1 10-27 (0.024, alongside the dropped numbers)._
- _**3 for wrong subtitle, script or spoken text:** S3 10-14, S3 10-22, L1 10-27._
- _**2 for crediting a claim to a source that didn't say it:** S3 10-14 (CNN), S2 10-24 (ACOG)._
- _**1 for a spoken CTA naming a video that couldn't be confirmed live:** S3 10-26._

### Motion Designer
- **Audio: masking must be 0.02 or lower in the final mix, for long-forms too.**
  - Above 0.03 is an automatic drop, and on 10-27 a long-form at 0.024 helped get L1 held.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - Measure masking as the last step. If it's above 0.02, lower the music and measure again.
  - (7 holds. Shipped above target: 0.05, 0.034, 0.030, 0.029, 0.028, 0.026 (S2 10-27), 0.025 twice, 0.021 twice.)
- **After the voice render, check every number phrase in the ASR transcript against the script.** If any number, dose, count or percentage is missing or garbled, regenerate that scene before mixing.
  - (L1 10-27 was held when "10 or 15 mg", "783" and "41.1%" were lost. Dropped "point" in S1 10-22 and S1 10-26. Narration WER 0.117 in S2 10-27.)
- **Every caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen.**
  - Hard-clear the previous card and all its tags before the next card appears. Ghost text showed through in S3 10-26 (4 times), S1 10-27 and S3 10-27.
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end a card on A, THE, BE, BEING, CAN, MAY, NOT, HASN'T, OR, WHOSE, ABOUT, IN, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number.
  - Never split "TYPE 2 DIABETES", a trial name or "PHASE 3".
  - Never put an alarming phrase alone on a card. "KIDNEY FAILURE" appeared alone in S1 10-25 and S1 10-27.
  - (Fragments in all 42 Shorts.)
- **Build captions from the script's on-screen text, never from the spoken transcript.**
  - Every number, decimal, date, code and abbreviation must match its stat pill exactly and stay on one card ("1,879", "−2.30", "Q1 2027", "PAR1229", "GFR", "BMI").
  - Before render, search the captions for number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY) and for spaced single letters, and fix every hit.
  - (Found in every Short, including all 3 on 10-27. A wrong number reached the screen about 17 times. 1 hold.)
- **Shorts: tags and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character.**
  - Fade each tag out before the next caption appears.
  - Never show a tag that repeats the caption's words ("Prescriber", "Semaglutide").
  - Spell-check every tag. "Tirzepatic" shipped in S2 10-27.
  - (About 390 overlap findings, 40 of them on 10-27.)
- **Keep all text at least ~40px on a 1080 frame, inside the safe frame, and off the hero art.**
  - Name tags go above characters, never at the bottom edge.
  - Organ and molecule labels ("Amylin", "Gallstones", "Blood sugar", "10 pm") keep rendering at 22–26px.
  - (About 370 tiny-text and 350 off-screen findings. L1 10-27 had 18 tiny and 29 off-screen.)
- **From the first frame, every frame has a headline plus a labelled hero covering at least ~25% of it.**
  - Before render, delete every placeholder: empty "–" chips, dashed shelves, and debug labels such as "The skipped number" (L1 10-27).
  - (Placeholders shipped about 17 times. About 155 sparse findings in long-form.)
- **Long-form: one shot = one scripted beat.**
  - Before render, compare every shot's title and chips with its scripted beat, and confirm the disclaimer card is on screen at its beat.
  - (L1 10-17, L1 10-20 and L1 10-27 showed scenes from minutes later and dropped the disclaimer card. L1 10-26 reused an earlier scene.)
- **Mascots must read as whole, friendly and on-message.**
  - Human characters need a neck and shoulders.
  - No brown blobs and no scared organs.
  - No smiling mascot next to "heart attack" or "kidney failure" (S3 10-23, S1 10-27).
  - No green check on a warning.
  - (Floating heads in 8 pieces.)

### Scriptwriters
- **Name a video in the CTA only if its URL is oEmbed-confirmed live at script time, with the title copied exactly from YouTube.** Otherwise the last line is "follow for more". (1 hold: S3 10-26. CTA problems in 11 pieces.)
- **Narration is exactly what gets spoken.**
  - Write numbers as words and "versus" in full.
  - Give new drug names a phonetic respelling. The voice mangled elecoglipron, retatrutide and Wegovy.
  - Read every line aloud for merged words ("zupremeone", "aonec").
  - Keep number-heavy sentences short so the voice doesn't swallow them (L1 10-27).
  - (About 24 pieces, 3 holds.)
- **Never say or show the word "estimand".** Say "counting everyone who started" or "if everyone stayed on treatment" instead. Still use the same measure on both sides of any comparison. (On screen in S2 and S3 10-27. Mixed measures in L1 10-20, L1 10-25, S3 10-25 and L1 10-26.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line.** Long Shorts get the densest mixes. (About 18 went over, the latest S1 10-27 at about 186 words.)
- **Every spoken number names:**
  - what it measures and its unit;
  - the drug and the exact arm, as the source names it;
  - the comparator and each group's size;
  - the timeframe;
  - an absolute rate next to any relative figure.
  - Say "separate trials, not head-to-head" for cross-trial comparisons, and give the common side effects for each drug named.
  - (About 58 findings, including S2 10-27, where numbers were spoken with no arm.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational = "linked to". Keep "may include" and "right away".
  - Clinician guidance stays clinician guidance.
  - Never stretch one drug's reason to another drug.
  - Say what a trial did not measure ("SURMOUNT-4 didn't measure appetite").
  - (About 26 findings, 1 hold.)
- **Muted-viewer test: on-screen text is never stronger or broader than the narration.**
  - Every stat card names the drug and dose, both groups, the population, the measure and the timeframe.
  - (About 38 findings, including all 3 Shorts on 10-27.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label arms exactly, split any N into its groups, and mark adjusted figures "adjusted".
  - Scope "0 trials" to the review that was counted, and name the comparator on myth slides.
  - No placeholder cells, and label myths "MYTH".
  - Never call side effects "the most common" unless the source ranks them.
  - Headlines promise only what the slide delivers.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 56 findings.)

### Social Copywriter & packaging
- **YouTube description, in this order. Count the characters after assembly and stay at 1,400 or fewer. Cut "what you'll learn" and repeat paragraphs first, never the sources or hashtags.**
  1. If the voice names a video, that video's oEmbed-verified URL, and the same in the pinned comment. If it can't be verified, send the piece back to the Scriptwriter.
  2. A quick answer of 3 lines or fewer, naming one side effect.
  3. The disclaimer plus the prescriber line.
  4. Up to 4 sources.
  5. Real chapters (long-forms only).
  6. Complete hashtags, last.
  - (Line 1 missed 9 times, none on 10-27. L1 10-27 was cut off mid-word, and 4 descriptions ran to 1,450–1,500 characters. The quick answer ran too long about 26 times.)
- **Titles, thumbnails, captions and hashtags: 100 characters or fewer, at most 1 number and 1 abbreviation, and the exact product, population and status.**
  - **Hashtag only drugs whose data the post's own text reports.** No condition hashtags for populations the trials didn't enrol (#Osteoporosis) and no company tags.
  - (Hashtag scope problems in 8 pieces, the latest C1 10-26 and C1 10-27.)
- **Every caption field ends on the disclaimer plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.**
  - Threads bodies are about 300 characters, safety lines counted. Cut a clause, never a safety line. The full don't-switch/stop line stays.
  - (Threads ran over in every batch. "Switch" only and "meds" in S2 10-27.)
- **Copy facts, qualifiers and attributions word for word from the verified script.**
  - That includes "on average", "maximum tolerated dose", "all doses combined", group sizes, the timeframe and "can include".
  - Name which number belongs to which group, and name the side effects on every benefit caption, TikTok included.
  - (About 170 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.**
  - Engagement lines ask people to save or share only.
  - No emoji on side-effect, safety, stopping or gray-market posts.
  - (About 24 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH (obesity, or overweight with a weight-related condition). TRIUMPH-2 is the type 2 diabetes trial.
  - **TRIUMPH OSA trials:** BMI 27 or higher, 243 and 448 people.
  - **SURMOUNT-5:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at 1.7 or 2.4 mg.
  - **SURMOUNT-4:** 783 people began the lead-in, then 335 versus 335 were randomized at week 36 on their maximum tolerated dose of 10 or 15 mg.
  - **SURPASS-2:** type 2 diabetes, open-label, tirzepatide versus semaglutide 1 mg, which was the top diabetes dose at the time.
  - **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75, semaglutide 1 mg versus placebo.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2 and SOLSTICE is Phase 2b; it is investigational.
  - (About 45 findings.)
- **Credit every line to whoever actually said it, with the day, month and year.** Only printed words go inside quote marks. Name the exact body (PRAC, CHMP). (2 holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips and inferences get no tag. (About 88 findings.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.** Comparison and stopping posts add "don't switch, stop or change your medicines on your own". (About 25 findings.)
- **Keep the source list clean.** Use canonical URLs with no landing pages or 403s, cite the primary paper, check the article ID, and give both the online-first and print dates. (About 92 findings.)

_Updated 2026-10-27 from 70 QA records (all GLP-1, 10-14 to 10-27)._

_Updated 2026-10-27 from 70 QA records._
