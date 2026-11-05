_Based on 61 QA records from 2026-10-23 to 2026-11-05: 39 Shorts, 16 long-forms and 6 carousels, all GLP-1. **8 didn't ship:** 7 were held and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 4 records from 11-05 (L1 birth control, S1 nail changes, S2 retatrutide "what's confirmed", S3 birth control and a slower stomach). All 4 shipped with no holds, and speech-to-text was clean on every one (0–0.024). S3 had the cleanest visuals in the window (1 weak shot, 2 overlaps). Several known defects came back:_
- _**The birth-control long-form shipped with offset beats for the 4th priority long-form in a row** (10-27, 11-02, 11-04, 11-05). Beats scripted for about 290–315 s showed up at 30–65 s. The roadmap and the disclaimer headline never appeared. Visual score 4.2, with 71 weak shots, the worst in the window._
- _**The 13:00 masking drift is back.** S2 shipped at 0.030, which makes 5 13:00 Shorts shipped above 0.02 in this window._
- _S1 filled line 1 of its description again. S3 spoke the safety lines but didn't show them, for the 2nd day running. S2's description listed no sources._

_Why items didn't ship in this window:_
- _4 for music masking the voice: S1 10-24 at 0.038, S1 10-25 at 0.037, L1 10-27 at 0.024, L1 10-29 at 0.023._
- _2 for spoken numbers or drug names lost: L1 10-27 and L1 10-29 ("rheumatoid")._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases; the source says 11._
- _2 for crediting a claim to a source that doesn't say it: S2 10-24 (ACOG) and L1 10-30 (FDA troponin page)._
- _1 for a spoken CTA naming a video nobody could confirm was live: S3 10-26._

### Motion Designer
- **Long-forms: one shot = one scripted beat. Offset timing is now our worst repeat defect, so treat it as a ship-blocker.** (4 priority long-forms in a row: 10-27, 11-02, 11-04, 11-05.)
  - Before render, export a shot → beat → start-time list and check it against the script's beat list.
  - After render, check one frame per beat for the first 2 minutes. Every time so far, the offset showed up 25–65 s in, with content from 4–5 minutes later.
  - Confirm the roadmap card, the section titles and the "Not personal advice" disclaimer headline each appear at their scripted times. The disclaimer was missing in 10-27, 11-02 and 11-05.
  - If any frame's headline belongs to a beat more than 30 s away, rebuild from the beat list. Don't ship it.
  - Keep one backdrop and lighting per scene: 11-05 jumped from a warm room to a night room on beats tagged "warm".
- **Get every final mix to masking 0.02 or lower, and measure it last, after any re-render. Never pass a mix above 0.02 downstream.**
  - The 13:00 Shorts drift worst: S2 10-26, 10-27, 11-01, 11-02 and 11-05 all shipped at 0.025–0.034.
  - Copy the settings that worked: S2 11-04 at 0.000, and the long-forms at 0.002–0.012.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - (4 holds. 8 Shorts shipped at 0.021–0.034.)
- **After the voice render, compare the speech-to-text transcript with the script, and regenerate any scene that fails before you mix.** A garbled drug name is a fail even if the piece otherwise passes.
  - Check every number phrase, every "point" and "about", every unit and every drug name.
  - Garbled names so far: "tears of petide", "rheumatoid", "elicoglyprone", "wegovi", "or for glip ron".
  - Dropped "point" or "about" has happened 5+ times. Also seen: "one thousand three" for "thirteen", and "mg" for "milligrams".
  - All four 11-05 pieces passed this check, so keep doing it.
  - (2 holds.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly: "575", "1,329", "2026", "9.5%", "15–20 g", "A1C", "B12", "MTC", "MEN 2", "NK-1", "GLP-1".
  - Before render, search the captions and fix every number word (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY), every set of spaced letters ("F D A", "G F R", "M T C") and every phonetic spelling ("REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "B-P-C").
  - (Found in nearly every Short, still in S1 11-05. Wrong numbers reached the screen 9+ times. Phonetic spellings caused 6 subtitle-mismatch flags.)
- **Each caption card is one whole clause or noun phrase, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first.
  - Never split a word, number, code or trial name across cards or lines. That includes "SEVENTY-/SIX", "GLP-/1", "THYROID OR B/12", and "1,032" or "575" spread across two cards.
  - Never end a card on a comma, dash, colon, ellipsis, an article, an auxiliary verb (CAN, MAY, WON'T, NOT, BEEN), a preposition, SINCE, POINT, TYPE, YOUR, THEIR, or a bare number.
  - (Broken cards in nearly all 39 Shorts, including S1 11-05.)
- **Shorts: keep every tag, chip, label and bubble above y 1150 on a 1920 frame, inside the side edges, with text at least ~40px.**
  - Show at most 2 tags at once, and drop any tag that repeats the caption.
  - Body-part and source tags collide with captions most: "Kidneys", "Stomach", "Placebo", "Company report", "Parliament".
  - Stat numbers sit on plain space, never over people, clouds or windows ("445", "1,032", "15–20 g"; about 12 on-hero findings).
  - Render every chip the shot list calls for. Chips were missing in S3 10-30, S1 11-01 and S3 11-04.
  - (About 390 overlap findings, still 11 per Short in S1 and S2 on 11-05.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.**
  - Molecule, organ and clock labels keep rendering at 15–26px: "GLP-1", "GIP", "Fat", "Amylin", "Once", "Temporary".
  - Name and state tags clip at the bottom: "Sam, 49", "Dana, 47", "Stopped", "Stayed on".
  - (About 215 off-screen and 190 tiny-text findings in 15 rendered long-forms.)
- **Fill every frame and delete every placeholder.**
  - Every frame needs a headline plus a labelled hero covering at least ~25% of the frame, from the first frame.
  - Before render, delete empty dashed chips and shelves, empty or ghost bubbles, greyed duplicate people and debug marks.
  - The pantry/shelf backdrop stays banned. It has been clean since 11-02, so keep using the room or gradient backdrop.
  - (About 185 near-empty-shot findings in long-forms, still 12 in L1 11-05.)
- **Draw people as whole characters, with a neck and shoulders joining the head to the body. Fit each mascot's mood to the line.**
  - No floating heads, faceless blobs, donut shapes or disembodied eyes or bones.
  - On risk and uncertainty lines, use a calm, neutral mascot: no smiles, green checks or "Phew", and no sweating, scared or crying mascots either.
  - (Floating heads in about 16 pieces. Mood mismatches in 9, including S1 11-05.)

### Scriptwriters
- **Never speak a video title, and never say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description." Shorts end with "Full breakdown on our channel, link in the description."
  - "Not personal advice", the prescriber line and (where needed) "don't switch, stop or change your medicines on your own" must be spoken AND written into the on-screen field. In S3 11-04 and S3 11-05 they were spoken but never shown.
  - Retatrutide pieces add one plain line saying it isn't approved and that online "research" products aren't the trial drug (missing in S1 10-24 and S2 11-02).
  - (1 hold: S3 10-26.)
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence.
  - Pronunciation spellings go in the narration only; the plain name goes in the on-screen field.
  - Never say "this week" or "new" in evergreen pieces. Give the date instead, and check it against the source (S1 11-05 said "October" for a 30 September talk).
  - Name the subject rather than "it" after a list (S3 11-05, S2 11-04).
  - (About 30 pieces, 2 holds.)
- **Keep Shorts to 170 words or fewer, counting the status and prescriber lines.** (7 went over in this window, up to about 260.)
- **Check every count against the source's own unit (cases, participants, trials).**
  - Each number names its measure, the drug and exact arm, the comparator, each group's size and the timeframe. Say "average change in pain score", never a bare "75.8%".
  - Put an absolute rate next to any relative figure. For cross-trial comparisons, say "separate trials, not head-to-head".
  - Never say "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29, which said 5 cases instead of 11. About 55 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo". Keep "may", "may include", "tends to", "that does not go away", "dose increases" and "right away".
  - Don't add proportions ("most people's", "many", "at all"), rankings, "similar" for unmatched groups, or "that's why" links the source doesn't make.
  - A "MYTH" label needs evidence against the claim, not just an absence of studies.
  - (About 50 findings, 1 hold.)
- **Run the muted-viewer test both ways.** On-screen text is never stronger or broader than the narration, and every on-screen item is also spoken. Each caption field and stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 55 findings, including 3 on 11-05.)

### Carousel Designer
- **Carousels are stopped (they reach 0–4 people), and none have been made since 10-30.** If the scheduler asks for one, reuse verified Short text only. Every stat says what it counts, for whom, against what and when. Label myths "MYTH", and end on the disclaimer plus the prescriber line. (About 25 findings in 6 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,250 characters or fewer before the publisher's link, and line 1 left empty for the ▶ Watch next link on every long-form and Short.**
  - Line 1 was filled again in S1 11-02 and S1 11-05, after 11 earlier misses.
  - Then, in order:
    1. A quick answer of 3 lines or fewer that names one specific side effect.
    2. The disclaimer plus the prescriber line.
    3. Up to 4 sources. Never zero: S2 11-01 and S2 11-05 listed none.
    4. Real chapters on long-forms only. They were missing or placeholders in 10-26, 10-30 and 11-05. If the timestamps aren't ready yet, leave a clear slot for the publisher, never fake timestamps.
    5. Complete hashtags.
  - No internal notes or placeholder URLs.
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", copied character for character with apostrophes. Hashtags go before that line, never after it.**
  - Side-effect, stopping and comparison posts keep the don't-stop line word for word. Write "medicines", not "meds" (TikTok 11-05), and keep urgency words.
  - Keep Threads to about 300 characters, safety lines counted. Cut a clause, never a safety line.
  - (Hashtags came after the safety line in 6 pieces. Threads ran over in nearly every piece, up to about 400 characters in S2 11-05.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - That covers "on average", "all doses combined", "small trial", "not yet peer-reviewed", "observational", "reports of" and "add a barrier method" (not "or condoms").
  - It also covers the full trial population and the fluid, kidney and clinician caveats.
  - Our own caveats go in their own sentence, never after a source tag.
  - Never put the label's name on a paraphrase it doesn't use: the label says "may reduce the efficacy", not "absorbed".
  - (About 165 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - The thumbnail never reuses title words and never has blank subtext.
  - Don't call data "new" if it's more than about 3 months old.
  - Don't use "Approved yet?" or "Approved Anywhere?" titles. For retatrutide, use the "what's confirmed?" angle instead.
  - (About 15 pieces, 1 major: "Zepbound Pen".)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only. No emoji on side-effect, safety or stopping posts, and no weight-centred wording or tags. (About 22 first lines without the hedge. 6 open questions.)
- **Hashtag only drugs whose own data the post reports, generically.** No brand tags for uses the brand isn't approved for (#Zepbound on prediabetes, #Mounjaro on SURMOUNT-1), and no company, out-of-population, trend or awareness tags (#guthealth, haul tags). (About 16 pieces, latest S3 11-05.)

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
  - **Oral contraceptives (tirzepatide label):** "may reduce the efficacy" because of delayed gastric emptying. The label gives the timeframe as 4 weeks after starting and 4 weeks after each dose increase. Vomiting and diarrhoea pill rules come from the NHS sickness subpage.
  - (About 55 findings, 1 hold.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips and safety lines get no tag: infection signs, "limit fluids", protein and follow-up habits, "smaller, blander bites".
  - The joint GLP-1 nutrition advisory says strength-train 3+ times a week ("2 days" is WHO's figure), and to avoid fatty or high-fibre foods "during the first few days of treatment". WHO covers strength training only.
  - Only exact printed words go in quotes.
  - Name the exact body and who acted: the EMA's PRAC (July 2023); the FDA *asked the makers*; the Malaysian Health Minister, not the Ministry, spoke to Parliament.
  - (2 holds. About 100 findings, including L1 11-04, S1 11-04 and S3 11-05.)
- **Keep the source list clean.**
  - Fetch every URL before submitting: no 402s, 403s or 404s, no landing or newsroom pages, no search pages and no DOI redirects. Link the exact subpage that carries the claim.
  - Use the PubMed record for paywalled journals.
  - Give each page's current revised date: the Zepbound label is 28 Aug 2026, the Mounjaro label is a 2026 revision, and the NHS tiredness pages are 2023.
  - (About 95 findings, 2 more on 11-05.)

_Updated 2026-11-05 from 61 QA records (all GLP-1, 10-23 to 11-05)._

_Updated 2026-11-05 from 61 QA records._
