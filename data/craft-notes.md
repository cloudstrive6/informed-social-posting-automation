_Based on 62 QA records from 2026-10-22 to 2026-11-04: 39 Shorts, 16 long-forms and 7 carousels, all GLP-1. **10 didn't ship:** 9 were held and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 4 records from 11-04 (L1 stopping redo, S1 sick days, S2 prediabetes, S3 blood pressure after stopping). All 4 shipped with no holds. Every mix measured 0.02 or lower, the 13:00 drift is fixed (S2 at 0.000), line 1 of each description was left empty, and no pantry backdrop showed for the second release day in a row. Known defects still came back:_
- _**The priority stopping redo shipped with beats from about 4–5 minutes later showing at 32–37 s.** That's the 3rd priority long-form in a row with offset beats (L1 10-27, 11-02, 11-04). Its narration also said "tears of petide" for tirzepatide, and the video still shipped._
- _Hyphen breaks again ("SEVENTY-/SIX"), and "1,032" was split across two cards (S2). The "1,032" stat also sat on the hero art (4 on-hero findings)._
- _In 3 caption fields across S1 and S3, hashtags came after the safety line. A chip from the shot list was missing (Cholesterol, S3), and a debug mark appeared on screen (S3)._
- _Our own caveats were tagged to NHS and WHO again (S1, L1). S2 cited a landing page as a source and said "this week" on an evergreen Short._

_Why items didn't ship in this window:_
- _5 for music masking the voice: S2 10-22, S1 10-24 and S1 10-25 at 0.037–0.039, L1 10-27 at 0.024 and L1 10-29 at 0.023._
- _3 for wrong spoken numbers, drug names or subtitles: S3 10-22, L1 10-27, L1 10-29._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases; the source says 11._
- _2 for crediting a claim to a source that doesn't say it: S2 10-24 (ACOG) and L1 10-30 (FDA troponin page)._
- _1 for a spoken CTA naming a video nobody could confirm was live: S3 10-26._

### Motion Designer
- **Long-forms: one shot = one scripted beat. After render, check one frame per shot against its beat title, and confirm the roadmap, the section titles and the disclaimer card each appear at their scripted times. If a later scene shows up early, the timing is offset: rebuild it from the beat list and don't ship it.** (Offset beats in L1 10-27, 11-02 and 11-04, all three priority redos. A missing disclaimer card in 10-27 and 11-02. Stale chips in 10-28. A "The skipped number" placeholder in 10-27.)
- **Get every final mix to masking 0.02 or lower, and measure it last. Never pass a mix above 0.02 downstream.** Duck the music under all narration, and keep sound effects off spoken numbers, names and codes. All four mixes on 11-04 came in at 0.000–0.019 and the long-forms at 0.002–0.010, so copy those settings. S1 11-04 at 0.019 had almost no margin. (5 holds. 7 Shorts shipped at 0.021–0.034, with the 13:00 slot drifting worst.)
- **After the voice render, compare the speech-to-text transcript with the script, and regenerate any scene that fails before you mix. A garbled drug name is a fail even if the piece otherwise passes.** Check every number phrase, every "point" and "about", every unit and every drug name. Garbled names so far: "tears of petide" (tirzepatide, L1 11-04), "rheumatoid" (retatrutide), "elicoglyprone", "wegovi" and "or for glip ron". Dropped "point" or "about" has happened 5+ times, plus "one thousand three" for "thirteen" and "mg" for "milligrams". (3 holds.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers, decimals, dates and codes must match the stat pill exactly ("9.5%", "1,032", "15–20 g", "A1C", "B12", "BMI", "MTC", "MEN 2", "NK-1", "GLP-1", "Q1 2027", "PAR1229"). Before render, search the captions and fix every number word (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY), every set of spaced letters ("F D A", "G F R", "M T C") and every phonetic spelling ("REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "A-ONE-C"). (Found in nearly every Short. Wrong numbers reached the screen 9+ times. Phonetic spellings caused 6 subtitle-mismatch flags.)
- **Each caption card is one whole clause or noun phrase, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first.
  - Never split a word, number, code or trial name across cards or lines. That includes hyphen breaks: "SEVENTY-/TWO" (11-01), "SEVENTY-/FOUR" (11-02), "SEVENTY-/SIX" (11-04), "GLP-/1", and "1,032" split across two cards.
  - Never end a card on a comma, dash, colon, ellipsis, an article, an auxiliary verb (CAN, MAY, WON'T, NOT, BEEN), a preposition, POINT, TYPE, YOUR, THEIR, or a bare number.
  - (Broken cards in all 39 Shorts, still in all 3 Shorts on 11-04.)
- **Shorts: keep every tag, chip, label and bubble above y 1150 on a 1920 frame, inside the side edges, with text at least ~40px.**
  - Show at most 2 tags at once, and drop any tag that repeats the caption. Body-part tags ("Kidneys", "Stomach", "Placebo") collide with captions most.
  - Stat numbers sit on plain space, never over people, clouds or windows ("445" on 11-02, "1,032" on 11-04; about 12 on-hero findings).
  - Render every chip the shot list calls for. Chips were missing in S3 10-30, S1 11-01 and S3 11-04.
  - (About 400 overlap findings, still 11–17 per Short on 11-04.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.** Molecule, organ and clock labels ("GLP-1", "GIP", "Fat", "Amylin", "Once", "Temporary") keep rendering at 15–26px. Name and state tags ("Sam, 49", "Dana, 47", "Stopped", "Stayed on") clip at the bottom. (About 290 off-screen and 200 tiny-text findings in 16 long-forms.)
- **Fill every frame and delete every placeholder.** Every frame needs a headline plus a labelled hero covering at least ~25% of the frame, from the first frame. Before render, delete empty dashed chips and shelves, empty or ghost bubbles, greyed duplicate people and debug marks (magenta mark in S3 11-04). The pantry/shelf backdrop stays banned. It has been clean since 11-02, after 16 pieces, so keep swapping it for the room or gradient backdrop at storyboard time. (About 170 near-empty-shot findings in long-forms, still 11 in L1 11-04.)
- **Draw people as whole characters, with a neck and shoulders joining the head to the body on every backdrop. Fit each mascot's mood to the line.** No floating heads, faceless blobs, donut shapes or disembodied eyes. On risk lines, use a calm, neutral mascot: no smiles, green checks or "Phew", and no scared, sweating or crying mascots either. (Floating heads in about 16 pieces, including 2 in L1 11-04. Mood mismatches in 8 pieces.)

### Scriptwriters
- **Never speak a video title, and never say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description." Shorts end with "Full breakdown on our channel, link in the description."
  - Every script says "Not personal advice" plus the prescriber line, and the on-screen field shows them too. In S3 11-04 they were spoken but never shown.
  - Comparison, stopping and safety pieces add "don't switch, stop or change your medicines on your own". Retatrutide pieces add one plain line saying it isn't approved and that online "research" products aren't the trial drug (missing in S1 10-24 and S2 11-02).
  - (1 hold: S3 10-26.)
- **Write the narration exactly as it should be spoken.** Write numbers as words, spell out units, and give each decimal its own short sentence. Pronunciation spellings go in the narration only; the plain name goes in the on-screen field. Never say "this week" or "new" in evergreen pieces. Give the date instead (S3 10-23, S2 11-04). (About 27 pieces, 3 holds.)
- **Keep Shorts to 170 words or fewer, counting the status and prescriber lines.** (7 went over in this window, up to about 260.)
- **Check every count against the source's own unit (cases, participants, trials).**
  - Each number names its measure, the drug and exact arm, the comparator, each group's size and the timeframe. Say "average change in pain score", never a bare "75.8%".
  - Put an absolute rate next to any relative figure. For cross-trial comparisons, say "separate trials, not head-to-head".
  - Never say "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29, which said 5 cases instead of 11. About 55 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo". Keep "may include", "tends to", "that does not go away", "dose increases" and "right away".
  - Don't add proportions ("most people's", "many", "at all"), rankings, or "that's why" links the source doesn't make.
  - A "MYTH" label needs evidence against the claim, not just an absence of studies. Label post-hoc and topline results.
  - (About 45 findings, 1 hold.)
- **Run the muted-viewer test both ways.** On-screen text is never stronger or broader than the narration, and every on-screen item is also spoken. Each caption field and stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 50 findings, including 3 on 11-04.)

### Carousel Designer
- **Carousels are stopped (they reach 0–4 people), and none have been made since 10-30.** If the scheduler asks for one, reuse verified Short text only. Every stat says what it counts, for whom, against what and when. Label myths "MYTH", and end on the disclaimer plus the prescriber line. (About 25 findings in 7 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,250 characters or fewer before the publisher's link, and line 1 left empty for the ▶ Watch next link in long-forms and Shorts.** Then, in order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources.
  4. Real chapters (long-forms only).
  5. Complete hashtags.

  No internal notes or placeholder URLs. All four line-1 slots were correct on 11-04, so keep it that way. (Line 1 was filled in 9 earlier pieces, 5 descriptions ran past 1,350 characters, and the quick answer ran long about 20 times.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", copied character for character with apostrophes. Hashtags go before that line, never after it.**
  - Side-effect, stopping and comparison posts keep the don't-stop line word for word. Write "medicines", not "meds", and keep urgency words.
  - Keep Threads to about 300 characters, safety lines counted. Cut a clause, never a safety line.
  - (Hashtags or other text came after the safety line in 6 pieces, 2 of them on 11-04. Threads ran over in nearly every piece, again in S1 and S2 11-04.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.** That covers "on average", "all doses combined", "small trial", "not yet peer-reviewed", "observational", "reports of", the full trial population ("obesity, or overweight plus a weight-related condition, without diabetes") and the fluid, kidney and clinician caveats. Our own caveats go in their own sentence, never after a source tag. (About 160 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.** The thumbnail never reuses title words ("What Helps", "grow back") and never has blank subtext. Don't call data "new" if it's more than about 3 months old. (About 14 pieces, 1 major: "Zepbound Pen".)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only. No emoji on side-effect, safety or stopping posts, and no weight-centred wording. (About 22 first lines without the hedge, including FB 11-04. 6 open questions.)
- **Hashtag only drugs whose own data the post reports, generically.** No brand tags for uses the brand isn't approved for (#Zepbound on prediabetes, #Mounjaro on SURMOUNT-1), and no company, out-of-population, trend or awareness tags (#guthealth, haul tags). (About 14 pieces, latest S2 11-04.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **Class studies:** say "GLP-1 medicines" and never attach one drug's name.
  - **No diabetes:** SURMOUNT-1, SURMOUNT-4, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and the TRIUMPH obesity trials. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher (243 and 448 people). ATTAIN-J included about 25% with type 2 diabetes.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) vs 36 on placebo, over 72 weeks. The ~75%/25% split is from Look et al. 2025.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 vs 335 were randomized. The +14.0% is regain from week 36 to week 88. Placebo still ended 9.9% below its starting weight on average.
  - **SURMOUNT-5:** semaglutide at 1.7 or 2.4 mg, each person's maximum tolerated dose.
  - **Semaglutide doses:** name the dose compared (Wegovy 7.2 mg was approved in March 2026; SURPASS-2 used 1 mg).
  - **SURPASS-2:** type 2 diabetes, open-label. **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75. **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **Pancreatitis review:** 11 participants across 5 trials. **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2; SOLSTICE is Phase 2b.
  - **Hair loss:** 5.4% (119/2,183) vs 0.9% (22/2,221) (Gupta 2026). The label reports 7.1% of women vs 0.5% of men, and 1.3% vs 0% on placebo. Say "particularly associated with", never "most often".
  - (About 55 findings, 1 hold.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips and safety lines get no tag: infection signs, "limit fluids", protein and follow-up habits, "smaller, blander bites".
  - The joint GLP-1 nutrition advisory says strength-train 3+ times a week ("2 days" is WHO's figure), and to avoid fatty or high-fibre foods "during the first few days of treatment". WHO covers strength training only.
  - Only exact printed words go in quotes. Name the exact body (the EMA's PRAC, July 2023), and say who acted (the FDA *asked the makers*).
  - (2 holds. About 95 findings, including S1 and L1 on 11-04.)
- **Keep the source list clean.** Fetch every URL before submitting: no 403s, 404s, landing or newsroom pages, search pages or DOI redirects. Use the PubMed record for paywalled journals. Give each page's current revised date: the Zepbound label is 28 Aug 2026, the Mounjaro label is a 2026 revision, and the NHS tiredness pages are 2023. (About 90 findings, latest the AHA newsroom page on 11-04.)

_Updated 2026-11-04 from 62 QA records (all GLP-1, 10-22 to 11-04)._

_Updated 2026-11-04 from 62 QA records._
