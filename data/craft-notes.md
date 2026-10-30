_Based on 68 QA records from 2026-10-17 to 2026-10-30: 40 Shorts, 16 long-forms and 12 carousels, all GLP-1. **12 didn't ship:** 11 were held and 1 long-form failed before render. The 10-16 records have aged out of the window._

_**New since the last pass:** 5 records from 10-30._
- _**L1 10-30 (Tirzepatide and Hair Loss) failed before render.** The fact-checker found 2 major source-tag errors: lines about biotin and hair, skin and nail supplements were credited to an FDA troponin page that doesn't say them._
- _**Shorts audio is fixed for now.** All 9 Shorts from 10-28 to 10-30 mixed at 0.015 or lower._
- _**Caption defects are still happening:**_
  - _Pronunciation spellings reached the screen ("DEG-LOO-DEK", "A-ONE-C"), as did a wrong number ("FIVE PERCENT" for 9.5%)._
  - _A code was split ("THYROID OR B" / "12") and "BMI" lost its B ("M I")._
  - _Dashed placeholder shelves and a floating head came back._
- _**A carousel was made again** (C1 10-30) after a 3-day gap._

_Why items didn't ship (10-17 to 10-30):_
- _**7 for music masking the voice:** S2 10-21, S3 10-21, S2 10-22, S1 10-24 and S1 10-25 (0.034–0.039); L1 10-27 (0.024); L1 10-29 (0.023)._
- _**3 for wrong spoken numbers or subtitles:** S3 10-22, L1 10-27 and L1 10-29._
- _**1 for a wrong count:** S1 10-29 said 5 pancreatitis cases; the source reports 11._
- _**2 for crediting a claim to a source that didn't say it:** S2 10-24 (ACOG) and L1 10-30 (FDA troponin page)._
- _**1 for a spoken CTA naming a video nobody could confirm was live:** S3 10-26._

### Motion Designer
- **The final mix must have masking of 0.02 or lower, for long-forms and Shorts alike. Measure it last.**
  - If it's above 0.02, lower the music and measure again.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - Above 0.03 is an automatic drop. Long-forms at 0.023–0.024 are also held.
  - (7 holds. Another 8 Shorts shipped at 0.021–0.034. Since 10-28, all 9 Shorts and the long-forms have mixed at 0–0.015: keep that setting.)
- **After the voice render, compare the speech-to-text transcript with the script for every number phrase, every qualifier ("about", "point") and every drug name.**
  - If anything is missing or garbled, regenerate that scene before mixing.
  - (3 holds. Drug names garbled in 5 long-forms: "rita trutide" and "rheumatoid" for retatrutide, "elicoglyprone" for elecoglipron, "wegovi". "Point" or "about" dropped 4 times. "Thirteen" came out as "one thousand three".)
- **Build captions from the script's on-screen text field, never from the narration or the pronunciation spellings.**
  - Every number, decimal, date, code and abbreviation matches its stat pill exactly and stays whole on one card ("9.5%", "1,879", "A1C", "B12", "BMI", "NK-1", "GLP-1", "Q1 2027", "PAR1229").
  - Before render, search the captions and fix every hit for:
    - number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, GLP-ONE);
    - spaced or missing letters ("F D A", "G F R", "M I");
    - hyphenated pronunciation spellings ("DEG-LOO-DEK", "A-ONE-C", "REH-TAH-TROO-TIDE", "TRA-DIP-IH-TANT").
  - (Nearly every Short. At least 8 wrong numbers reached the screen, latest "FIVE PERCENT" for 9.5% in S1 10-30. Pronunciation spellings caused subtitle-mismatch flags in S3 10-25, S3 10-29 and S2 10-30.)
- **Each caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles before the next one appears. (Ghost text in about 10 pieces.)
  - Never split a word, a code, a trial name, "TYPE 2 DIABETES" or "PHASE 3".
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end a card on A, THE, AN, BE, BEING, CAN, MAY, NOT, OR, WHO, WHOSE, ABOUT, IN, LIKE, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number.
  - Never put an alarming phrase alone on a card.
  - (Broken cards in all 40 Shorts.)
- **Shorts: no part of any tag, chip, label or bubble goes below y 1150 on a 1920 frame.**
  - Put name tags above the head, with at most 2 tags on screen at once.
  - Drop any tag that repeats the caption, and spell-check every tag ("Tirzepatic").
  - (About 355 overlap findings in 40 Shorts, still 12–48 a day. The tags that collide most are body-part tags: Stomach, Gut, Heart, Kidney, Hair follicle, Prescriber.)
- **Long-forms: keep the bottom of every tag, chip and label at y ≤ 1000 on a 1080 frame, with name tags above the head.**
  - All text is at least ~40px, including organ and molecule labels ("Fat", "Amylin", "Glucagon", "Gallstones", "10 pm" keep rendering at 22–26px).
  - (About 310 off-screen and 220 tiny-text findings in 15 rendered long-forms. L1 10-28 got off-screen down to 1, so it can be done.)
- **Every frame has a headline plus a labelled hero covering at least ~25% of it, from the first frame.**
  - Don't use the pantry/shelf backdrop unless every cell holds a labelled item.
  - Before render, delete every placeholder: dashed "—" cells, empty chips and bubbles, greyed duplicate people and debug labels ("The skipped number").
  - (Dashed shelves in 13 pieces, latest S2 10-30. About 172 near-empty-shot findings in long-forms.)
- **Long-forms: one shot = one scripted beat.**
  - Before render, check each shot's title and chips against its beat and clear the previous shot's overlays.
  - Confirm the disclaimer card is on screen at its beat.
  - (L1 10-17, 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer. Recap chips leaked into a later shot in L1 10-28.)
- **Mascots must read as whole, friendly characters that fit the message.**
  - People need a neck and shoulders. (Floating heads in about 11 pieces, latest S1 10-30.)
  - No faceless circles, brown blobs, shapeless rocks or disembodied eyes.
  - No scared, sweating or crying characters.
  - No smiling mascot next to "heart attack" or "kidney failure", and no green check on a warning.

### Scriptwriters
- **Never speak a video title.**
  - Long-forms end with: "There's a video I'd watch next, linked in the description."
  - Shorts end with: "Full breakdown on our channel, link in the description."
  - Never say "on screen".
  - (1 hold: S3 10-26. Spoken titles in about 10 pieces.)
- **Narration is exactly what gets spoken.**
  - Write numbers as words, and give each decimal its own short sentence.
  - Put pronunciation spellings in the narration only, and the plain name (degludec, A1C, retatrutide) in the on-screen text field.
  - Check for merged words ("redefinedfor", "aonec").
  - (About 25 pieces, 3 holds.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line.** (8 went over, by up to 260 words in S1 10-25. Long Shorts also got the densest mixes.)
- **Never say or show "estimand".** Say "counting everyone who started" or "if everyone stayed on treatment" instead, and use the same measure on both sides of any comparison. (3 pieces showed the word. Mixed measures in 5.)
- **Check every count against the source's own unit: cases, trials, participants or reports.**
  - Every spoken number names its measure and unit, the drug and exact arm, the comparator, each group's size, and the timeframe and reference point.
  - Put an absolute rate next to any relative figure.
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - A median is "half of people".
  - (1 hold: S1 10-29. About 55 findings, including S1 10-30, which left out the measure and the 793 vs 1,586 split.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo".
  - Keep "may include", "tends to" and "right away".
  - Don't add proportions the source doesn't give ("most people's", "most often").
  - Label post-hoc and secondary analyses, and call company topline results and conference data "not yet peer-reviewed".
  - Use "first" only with its exact scope.
  - No vague credits ("experts think", "experts don't agree"). Say what the source says, e.g. "it's unclear".
  - (About 35 findings, 1 hold.)
- **Muted-viewer test: on-screen text is never stronger or broader than the narration.**
  - Every stat card names the drug and dose, both groups, the population, the measure and the timeframe.
  - Pooled doses say "all doses".
  - (About 40 findings.)

### Carousel Designer
- _One was made again on 10-30, although the playbook says to stop. If carousels are made, use verified Short text only._
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label arms and doses exactly, split any N into its groups, and mark adjusted figures "adjusted". Randomized results say "compared with placebo", not "linked to".
  - Label myths "MYTH". Leave no placeholder cells.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 50 findings in 12 carousels, including C1 10-30.)

### Social Copywriter & packaging
- **YouTube description: 1,400 characters or fewer, counted after assembly.** Line 1 is the empty slot for the publisher's verified link. Never put "follow for more", a placeholder or a guessed URL there. Then, in this order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources, including the source of every number quoted.
  4. Real chapters (long-forms only).
  5. Complete hashtags.
  - No internal production notes in any public field. (L1 10-28 had one.)
  - (Line 1 missed about 9 times, 5 of them rated major. L1 10-27 was cut off mid-word. 4 ran to about 1,400–1,500 characters. The quick answer ran long about 20 times.)
- **Titles, thumbnails, captions and hashtags:**
  - 100 characters or fewer, with at most 1 number and 1 abbreviation.
  - Use the exact product, population and status. (A major finding: "Zepbound Pen" when only the KwikPen was covered.)
  - The thumbnail must not suggest a single fix the video qualifies.
  - Hashtag only drugs whose data the post reports. No company tags, and no condition or brand tags outside the trial's population.
  - (About 10 pieces.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.**
  - Use the exact phrase "Not personal advice".
  - Side-effect, stopping and comparison posts keep "don't stop or change your medicines on your own" in every field, Threads included.
  - Threads is about 300 characters, safety lines counted. Cut a clause, never a safety line.
  - (Threads ran over in nearly every piece. The don't-stop line was dropped from Threads 4 times, latest S3 10-30.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script, pinned comments included.**
  - That includes "on average", "all doses combined", "or overweight plus a weight-related condition", group sizes, the timeframe, "not yet peer-reviewed" and the clinician or kidney caveats.
  - (About 160 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.**
  - Engagement lines ask people to save or share only. Never ask open questions.
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
  - **Tirzepatide hair loss** (for the L1 10-30 redo): 5.4% (119/2,183) versus 0.9% (22/2,221) (Gupta 2026). The label reports it more often in women (7.1%) than in men (0.5%). Say "linked to rapid weight loss" and "no human studies show a direct effect on follicles", never "it isn't the drug".
  - (About 52 findings, 1 hold.)
- **Joint GLP-1 nutrition advisory: quote only what it says.**
  - It says to get enough protein and to do strength training at least 3 times a week. "2 days" is WHO's figure, so credit it to WHO.
  - It says "avoiding fatty or high fiber foods during the first few days of treatment" can ease nausea. Don't stretch that to "queasy days" or "early on".
  - It does not say "protein at each meal", "eat slowly" or "stop when full". Those are our own tips and carry no tag.
  - (5 findings: L1 10-21 ×2, S3 10-28, L2 10-29 ×2.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag or the line.**
  - Our own tips and safety lines get no tag. Don't tag them to the label.
  - Only the exact printed words go inside quotes.
  - Name the exact body (PRAC, CHMP, the regulator behind a status) and give the day, month and year.
  - (2 holds: S2 10-24 ACOG and L1 10-30 FDA troponin page. About 95 tag findings, latest S3 10-30.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.** Comparison, stopping and safety posts add "don't switch, stop or change your medicines on your own". (About 25 findings.)
- **Keep the source list clean.** Use canonical URLs with no landing pages, DOI redirects or 403s (for paywalled journals, use the PubMed record). Cite the primary paper, check the article ID and the journal version, and give the online-first and print dates. (About 90 findings.)

_Updated 2026-10-30 from 68 QA records (all GLP-1, 10-17 to 10-30)._

_Updated 2026-10-30 from 70 QA records._
