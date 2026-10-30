_Based on 71 QA records from 2026-10-17 to 2026-10-30: 42 Shorts, 17 long-forms and 12 carousels, all GLP-1. **12 didn't ship:** 11 were held and 1 long-form (L1 10-30) failed before render._

_**New since the last pass:** 1 record, L2 10-30 (Thanksgiving). Its audio was clean (masking 0.002) and only 4 elements went off-screen. But dashed placeholder shelves, floating heads and 23px tags showed up again, and the final checklist section had no chapter._

_**Correction:** the earlier note said all long-forms since 10-28 mixed at 0.015 or lower. That was wrong. L1 10-29 was held at 0.023._

_Why items didn't ship:_
- _7 for music masking the voice:_
  - _5 Shorts at 0.034–0.039: S2 and S3 10-21, S2 10-22, S1 10-24, S1 10-25._
  - _2 long-forms: L1 10-27 (0.024) and L1 10-29 (0.023)._
- _3 for wrong spoken numbers or subtitles: S3 10-22, L1 10-27, L1 10-29._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases; the source says 11._
- _2 for crediting a claim to a source that doesn't say it: S2 10-24 (ACOG) and L1 10-30 (FDA troponin page)._
- _1 for a spoken CTA naming a video nobody could confirm was live: S3 10-26._

### Motion Designer
- **Get the final mix to masking 0.02 or lower, and measure it last, for Shorts and long-forms alike.** Duck the music under all narration, and keep sound effects off spoken numbers, names and codes. If it's above 0.02, lower the music and measure again. Shorts are fixed: all 9 since 10-28 measured 0.015 or lower, so keep that setting. Long-forms aren't fixed yet: L1 10-29 was held at 0.023, while L2 10-29 (0.007) and L2 10-30 (0.002) show the long-form level to copy. (7 holds; another 8 Shorts shipped at 0.021–0.034.)
- **After the voice render, compare the speech-to-text transcript with the script.** Check every number phrase, every "point" and "about", and every drug name. Regenerate any scene where something is missing or garbled before you mix. (3 holds. Drug names garbled in 5 long-forms: "rita trutide" and "rheumatoid" for retatrutide, "elicoglyprone", "wegovi". "Point" or "about" dropped 4+ times. "Thirteen" came out as "one thousand three".)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers, decimals, dates and codes must match the stat pill exactly and stay whole on one card ("9.5%", "1,879", "A1C", "B12", "BMI", "NK-1", "GLP-1", "Q1 2027", "PAR1229"). Before render, search the captions for number words (ONE–NINETY, HUNDRED, POINT, PERCENT, TWENTY TWENTY, GLP-ONE), spaced or dropped letters ("F D A", "G F R", "M I") and hyphenated pronunciations ("DEG-LOO-DEK", "A-ONE-C", "REH-TAH-TROO-TIDE"), and fix every hit. (Nearly every Short. At least 8 wrong numbers reached the screen, latest "FIVE PERCENT" for 9.5% in S1 10-30. Pronunciation spellings caused 3 subtitle-mismatch flags: S3 10-25, S3 10-29, S2 10-30.)
- **Each caption card is one whole clause or noun phrase, 2 lines or fewer, and the only text on screen.** Fully clear the previous card, its tags and its bubbles first. Never split a word, a code, a trial name, "TYPE 2 DIABETES" or "PHASE 3". Never end a card on a comma, dash, colon or ellipsis. Never end on A, THE, AN, BE, BEING, CAN, MAY, NOT, OR, WHO, WHOSE, ABOUT, IN, LIKE, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S or a bare number. Never put an alarming phrase ("KIDNEY FAILURE.") alone on a card. (Broken cards in all 42 Shorts. Ghost text in about 12 pieces.)
- **Shorts: no part of any tag, chip, label or bubble goes below y 1150 on a 1920 frame.** Put name tags above the head, with at most 2 tags on screen at once. Drop any tag that repeats the caption, and spell-check every tag ("Tirzepatic"). (About 365 overlap findings in 42 Shorts, still 6–21 a day. Body-part tags collide most: Stomach, Gut, Heart, Kidney, Hair follicle, Protein, Prescriber.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.** That includes organ and molecule labels ("Fat", "Amylin", "Glucagon", "Gallstones", "Fork down" keep rendering at 22–26px). (About 315 off-screen and 225 tiny-text findings in 16 rendered long-forms. L1 10-28 got off-screen down to 1 and L2 10-30 to 4, so it can be done.)
- **Retire the pantry/shelf backdrop until it ships with every cell filled.** Every frame needs a headline plus a labelled hero covering at least ~25% of it, from the first frame. Before render, delete all placeholders: dashed "—" cells, empty chips and bubbles, greyed duplicate people, debug labels ("The skipped number"). (Dashed shelves in about 15 pieces, including both L2s and S2 10-30 after the rule was already in these notes. About 180 near-empty-shot findings in long-forms.)
- **Long-forms: one shot = one scripted beat.** Before render, check each shot's title and chips against its beat, clear the previous shot's overlays, and confirm the disclaimer card shows at its beat. (L1 10-17, 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer. Recap chips leaked into a later shot in L1 10-28.)
- **Draw people and mascots as whole, friendly characters that fit the message.** People need a neck and shoulders. No faceless circles, brown blobs or disembodied eyes. No scared, sweating or crying characters. No smiling mascot next to "heart attack" or "kidney failure", and no green check on a warning. (Floating heads in about 12 pieces, latest S1 10-30 and L2 10-30.)

### Scriptwriters
- **Never speak a video title, and never say "on screen".** Long-forms end with "There's a video I'd watch next, linked in the description." Shorts end with "Full breakdown on our channel, link in the description." Every script says "Not personal advice" plus the prescriber line. Comparison, stopping and safety pieces add "don't switch, stop or change your medicines on your own". (1 hold: S3 10-26. Spoken titles in about 10 pieces; none since the new ending on 10-27.)
- **Write the narration exactly as it should be spoken.** Write numbers as words, and give each decimal its own short sentence. Pronunciation spellings go in the narration only; the plain name goes in the on-screen field. Check for merged words ("redefinedfor", "aonec"). (About 25 pieces, 3 holds.)
- **Keep Shorts to 170 words or fewer, counting the status and prescriber lines.** (8 went over, up to 260 words in S1 10-25.)
- **Check every count against the source's own unit (cases, participants, trials).** Each number names its measure, the drug and exact arm, the comparator, each group's size and the timeframe or reference point. Put an absolute rate next to any relative figure. Say "separate trials, not head-to-head" for cross-trial comparisons, and use the same measure on both sides. Never say or show "estimand"; say "counting everyone who started" or "if everyone stayed on treatment". A median is "half of people". (1 hold: S1 10-29, which said 5 cases instead of 11. About 55 findings, plus 3 that showed "estimand".)
- **Keep each finding at its source's exact scope, verb and urgency.** Observational studies are "linked to"; randomized results are "compared with placebo". Keep "may include", "tends to" and "right away". Don't add proportions the source doesn't give ("most people's", "most often"). Label post-hoc analyses, and call topline and conference results "not yet peer-reviewed". No vague credits ("experts think", "experts don't agree"). (About 38 findings, 1 hold.)
- **Run the muted-viewer test: on-screen text is never stronger or broader than the narration.** Every stat card names the drug and dose, both groups, the population, the measure and the timeframe. Pooled doses say "all doses". (About 42 findings.)

### Carousel Designer
- **Carousels were stopped, but C1 10-30 was made anyway.** If one is made, reuse verified Short text only. Every stat says what it counts, for whom, against what and when. Randomized results say "compared with placebo". Label myths "MYTH", leave no placeholder cells, and end on the disclaimer plus the prescriber line. (About 50 findings in 12 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,400 characters or fewer, counted after assembly.** Line 1 is the empty slot for the publisher's verified link: never "follow for more", a placeholder or a guessed URL. Then, in order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources.
  4. Real chapters, one for every section including the final checklist (long-forms only).
  5. Complete hashtags.
  
  No internal notes in any public field. (Line 1 missed about 10 times, 5 rated major. L1 10-27 was cut off mid-word. 4 ran past 1,400 characters. Placeholder chapters in L1 10-26; a missing final chapter in L2 10-30. The quick answer ran long about 20 times.)
- **Titles, thumbnails and hashtags: exact product, population and status.** At most 1 number and 1 abbreviation. The thumbnail mustn't suggest a single fix the video qualifies. Hashtag only drugs whose data the post reports, with no company tags and no condition tags outside the trial's population. (About 12 pieces, 1 major: "Zepbound Pen" when only the KwikPen was covered.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.** Side-effect, stopping and comparison posts keep the don't-stop line in every field. Keep Threads to about 300 characters, safety lines counted, by cutting a clause, never a safety line. (Threads ran over in nearly every piece. The don't-stop line was dropped or shortened in Threads 5 times, latest S3 10-30.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script, pinned comments included.** That covers "on average", "all doses combined", "or overweight plus a weight-related condition", group sizes, the timeframe, "not yet peer-reviewed" and the kidney or clinician caveats. (About 160 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only, never an open question. No emoji on side-effect, safety, stopping or gray-market posts. (Open questions about 6 times; emoji about 6; hedge missing from line 1 about 15.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses pooled) versus 36 on placebo, over 72 weeks. The ~75% fat / ~25% lean split comes from Look et al., *Diabetes Obes Metab* 2025.
  - **SURMOUNT-5:** tirzepatide 10 or 15 mg versus semaglutide 1.7 or 2.4 mg, each at its maximum tolerated dose.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 versus 335 were randomized. The +14.0% is regain from week 36 to week 88.
  - **SURPASS-2:** type 2 diabetes, open-label, versus semaglutide 1 mg. **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75. **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Tirzepatide pancreatitis review:** 11 participants across 5 trials. **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2; SOLSTICE is Phase 2b.
  - **Hair loss** (for the L1 10-30 redo): 5.4% (119/2,183) versus 0.9% (22/2,221) (Gupta 2026). The label reports it in 7.1% of women versus 0.5% of men. Say "particularly associated with", "linked to rapid weight loss" and "no human studies show a direct effect on follicles". Never say "most often" or "it isn't the drug".
  - (About 55 findings, 1 hold.)
- **Quote the joint GLP-1 nutrition advisory only for what it says.** It says to get enough protein and to do strength training at least 3 times a week; the "2 days" figure is WHO's. It says to avoid fatty or high-fibre foods "during the first few days of treatment" to ease nausea. "Protein at each meal", "eat slowly" and "stop when full" are our own tips and carry no tag. (6 findings, latest L2 10-29 ×2.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag or the line.** Our own tips and safety lines get no tag, and never the label's. Only exact printed words go in quotes. Name the exact body (PRAC, CHMP) and give the full date. (2 holds: S2 10-24 ACOG and L1 10-30 FDA troponin page. About 95 findings, latest S3 10-30.)
- **Keep the source list clean.** Use canonical URLs: no landing pages, DOI redirects or 403s; for paywalled journals, use the PubMed record. Cite the primary paper, and give online-first and print dates. (About 92 findings, including C1 10-30 and S2 10-30.)

_Updated 2026-10-30 from 71 QA records (all GLP-1, 10-17 to 10-30)._

_Updated 2026-10-30 from 71 QA records._
