_Based on 68 QA records from 2026-10-20 to 2026-11-02: 42 Shorts, 17 long-forms and 9 carousels, all GLP-1. **12 didn't ship:** 11 were held and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 4 records from 11-02 (L1 hair-loss redo, S1 injection site, S2 retatrutide knee OA, S3 breakfast). All 4 shipped, but known defects came back:_
- _**The priority hair-loss long-form shipped with scenes in the wrong places.** Beats from about 4 minutes later showed early, the roadmap beat and the "How common is it?" title were missing, and the disclaimer card never appeared. A dropped "point" was also flagged in the narration._
- _**S2 mixed at 0.034, the same level that got 5 Shorts held, and it still shipped.** It's the second 13:00 Short in a row above 0.02 (S2 11-01 was 0.026)._
- _Hyphen line breaks again ("SEVENTY-/FOUR"), and "REH TAH TROO TIDE" showed in the S2 captions._
- _Two description fields didn't leave line 1 empty for the Watch next link (L1 and S1). The L1 description ran to about 1,350 characters before the link. The L1 thumbnail repeated the title's "grow back"._
- _Our own safety line was tagged to the label again (S1), a trend hashtag came back (S3), and 2 source URLs returned 404 (S3)._
- _No pantry backdrop on 11-02, the first clean day._

_Why items didn't ship (no new holds this pass):_
- _7 for music masking the voice: 5 Shorts at 0.034–0.039, plus L1 10-27 at 0.024 and L1 10-29 at 0.023._
- _3 for wrong spoken numbers or subtitles: S3 10-22, L1 10-27, L1 10-29._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases; the source says 11._
- _2 for crediting a claim to a source that doesn't say it: S2 10-24 (ACOG) and L1 10-30 (FDA troponin page)._
- _1 for a spoken CTA naming a video nobody could confirm was live: S3 10-26._

### Motion Designer
- **Get every final mix to masking 0.02 or lower, and measure it last. Never pass a mix above 0.02 downstream.** Duck the music under all narration, and keep sound effects off spoken numbers, names and codes. If a mix is over 0.02, lower the music and measure again.
  - The 13:00 lead Short has drifted twice in a row (S2 11-01 at 0.026, S2 11-02 at 0.034). The other 16 Shorts since 10-28 measured 0.015 or lower.
  - Long-forms since 10-29 measured 0.002–0.010. Copy that level.
  - (7 holds. 8 Shorts shipped above 0.02, including one at 0.034.)
- **After the voice render, compare the speech-to-text transcript with the script, and regenerate any scene that fails before you mix.** Check every number phrase, every "point" and "about", every unit and every drug name.
  - Garbled drug names so far: "rheumatoid" and "rita trutide" for retatrutide, "elicoglyprone", "wegovi", "or for glip ron".
  - "Point" or "about" has been dropped 5+ times, latest L1 11-02. "Thirteen" came out as "one thousand three", and "milligrams" as "mg".
  - (3 holds.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers, decimals, dates and codes must match the stat pill exactly ("9.5%", "1,879", "15–20 g", "A1C", "B12", "BMI", "MTC", "MEN 2", "NK-1", "GLP-1", "Q1 2027", "PAR1229"). Before render, search the captions and fix every hit for:
  - number words (ONE–NINETY, HUNDRED, POINT, PERCENT, TWENTY TWENTY, GLP-ONE);
  - spaced or stray letters ("F D A", "G F R", "M T C", "E N TWO", "P ONE");
  - phonetic spellings ("REH-TAH-TROO-TIDE" in S3 10-29 and S2 11-02, "DEG-LOO-DEK", "A-ONE-C", "OR FOR GLIP RON").
  - (Nearly every Short, including 2 of the 3 on 11-02. Wrong numbers reached the screen 9+ times. Phonetic or spaced spellings caused 6 subtitle-mismatch flags.)
- **Each caption card is one whole clause or noun phrase, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first.
  - Never split a word, number, code or trial name, either across cards or across lines. That includes hyphen breaks: "SEVENTY-/TWO" and "GLP-/1" (11-01), "SEVENTY-/FOUR" (11-02).
  - Never end a card on a comma, dash, colon, ellipsis, an article, an auxiliary verb (CAN, MAY, WON'T, NOT), a preposition, POINT, TYPE, YOUR, THEIR, or a bare number.
  - Never put an alarming phrase alone on a card.
  - (Broken cards in all 42 Shorts, still in all 3 on 11-02.)
- **Shorts: keep every tag, chip, label and bubble above y 1150 on a 1920 frame and inside the side edges, with text at least ~40px.**
  - Show at most 2 tags at once, with name tags above the head. Drop any tag that repeats the caption.
  - Never put an icon, person or window over a stat number. Stat pills sit on plain space (the "445" behind heads and the cloud over "15–20 g" on 11-02; about 8 on-hero findings).
  - Render every chip the shot list calls for.
  - (About 370 overlap findings, still 9–11 a Short on 11-02. Body-part tags collide most.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.** Molecule, organ and clock labels ("GLP-1", "GIP", "Fat", "Amylin", "Once", "Fork down", "Temporary") keep rendering at 15–26px, and name tags ("Sam, 49", "Dana, 47") clip at the bottom. (About 330 off-screen and 250 tiny-text findings. L1 11-02 had 15 tiny-text findings.)
- **Long-forms: one shot = one scripted beat. After render, check one frame per shot against its beat title, and confirm the disclaimer card shows at its scripted time.** If later scenes show up early, the shot-to-beat timing is offset: rebuild it from the beat list, don't ship it.
  - Scenes from minutes later showed early, and the disclaimer card was missing, in L1 10-20, L1 10-27 and L1 11-02 (the hair-loss priority video).
  - Stale chips leaked into later shots in L1 10-21 and 10-28.
- **The pantry/shelf backdrop is banned.** Swap it for the room or plain-gradient backdrop at storyboard time.
  - Every frame needs a headline plus a labelled hero covering at least ~25% of the frame, from the first frame.
  - Delete every placeholder before render: empty chips, empty or faded bubbles, greyed duplicate people, debug labels.
  - (The pantry backdrop shipped in 16 pieces up to 11-01, with none on 11-02. About 200 near-empty-shot findings in long-forms.)
- **Draw people and mascots as whole characters whose mood fits the line.**
  - People need a neck and shoulders connecting the head to the body, on every backdrop (about 15 pieces, latest S1 11-02 and L1 11-01).
  - No faceless circles, blobs or disembodied eyes.
  - On risk lines, use a calm, neutral mascot: no smiles, green checks or "Phew" (S1 11-01, S3 10-23, S1 10-27). No scared, sweating or crying mascots either (S2 11-01 ×2, S3 10-29, S1 10-24).

### Scriptwriters
- **Never speak a video title, and never say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description." Shorts end with "Full breakdown on our channel, link in the description."
  - Every script says "Not personal advice" plus the prescriber line.
  - Comparison, stopping and safety pieces add "don't switch, stop or change your medicines on your own".
  - Retatrutide pieces add one plain line saying it isn't approved and that online "research" products aren't the trial drug (missing in S1 10-24 and S2 11-02).
  - (1 hold: S3 10-26. No spoken titles since 10-27.)
- **Write the narration exactly as it should be spoken.** Write numbers as words, spell out units, and give each decimal its own short sentence. Pronunciation spellings go in the narration only; the plain name goes in the on-screen field. (About 27 pieces, 3 holds.)
- **Keep Shorts to 170 words or fewer, counting the status and prescriber lines.** (8 went over.)
- **Check every count against the source's own unit (cases, participants, trials).**
  - Each number names its measure, the drug and exact arm, the comparator, each group's size and the timeframe.
  - Say "average change in pain score", never a bare "75.8%" that reads as "% of people" (S2 11-02).
  - Put an absolute rate next to any relative figure.
  - For cross-trial comparisons, say "separate trials, not head-to-head".
  - Never say "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29, which said 5 cases instead of 11. About 60 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo". Keep "may include", "tends to", "consistent with" and "right away".
  - Don't add proportions ("most people's") or rankings ("one of the most useful").
  - Don't add "that's why" links the source doesn't make (the AAD figure in L1 10-30 and L1 11-02).
  - A "MYTH" label needs evidence against the claim, not just an absence of studies.
  - Label post-hoc and topline results.
  - (About 45 findings, 1 hold.)
- **Run the muted-viewer test both ways.** On-screen text is never stronger or broader than the narration, and every on-screen item is also spoken, including helplines. Each stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 48 findings.)

### Carousel Designer
- **Carousels are stopped (they reach 0–4 people), and none have been made since 10-30.** If the scheduler asks for one, reuse verified Short text only. Every stat says what it counts, for whom, against what and when. Label myths "MYTH", leave no placeholder cells, and end on the disclaimer plus the prescriber line. (About 35 findings in 9 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,250 characters or fewer before the publisher's link, and line 1 left empty for the ▶ Watch next link in long-forms and Shorts alike.** Don't put the quick answer or "follow for more" in line 1. Then, in order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources (Shorts too).
  4. Real chapters for every section (long-forms only).
  5. Complete hashtags.

  No internal notes. (Line 1 filled in L1 and S1 11-02 and 5 earlier pieces. Descriptions ran to about 1,350–1,380 in L1 11-01 and 11-02, and 4 went past 1,400. The quick answer ran long about 22 times.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - The thumbnail never reuses title words (L1 10-24 "What Helps", L1 11-02 "grow back"). Leave no blank subtext.
  - Use "can" when the video gives a leading explanation.
  - Don't call data "new" if it's more than about 3 months old (S2 11-02 called Dec 2025 data new). Every status carries day, month and year.
  - (About 16 pieces, 1 major: "Zepbound Pen".)
- **Hashtag only drugs whose own data the post reports.** No company, out-of-population condition, trend or awareness tags. (About 12 pieces, latest S3 11-02, S1/S3 11-01.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", copied character for character with apostrophes, and nothing after it.**
  - Side-effect, stopping and comparison posts keep the don't-stop line word for word in every field. Write "medicines", not "meds".
  - Keep urgency words ("right away", "get emergency help right away"), as S1 11-02 didn't.
  - Keep Threads to about 300 characters, safety lines counted. Cut a clause, never a safety line.
  - (Threads ran over in nearly every piece, up to 400 in S1 11-02. The don't-stop line was dropped or shortened 7 times.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.** That covers "on average", "all doses combined", "small trial", "not yet peer-reviewed" (not "not peer-reviewed"), "observational" and the kidney or clinician caveats. Our own caveats go in their own sentence, never after a source tag. (About 175 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only. No emoji on side-effect, safety, stopping or gray-market posts, and no weight-centred wording. (About 20 first lines without the hedge; 7 open questions.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **Class studies:** say "GLP-1 medicines". Never attach one drug's name to class participants.
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **ATTAIN-J** included about 25% with type 2 diabetes.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) versus 36 on placebo, over 72 weeks. The ~75%/25% split is from Look et al. 2025.
  - **SURMOUNT-5:** tirzepatide 10/15 mg versus semaglutide 1.7/2.4 mg, each at its maximum tolerated dose.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 versus 335 were randomized. The +14.0% is regain from week 36 to week 88.
  - **Semaglutide doses:** name the dose compared. Wegovy 7.2 mg was approved in March 2026, and SURPASS-2 used 1 mg, before the 2 mg diabetes dose (L1 11-02, S2 10-27).
  - **SURPASS-2:** type 2 diabetes, open-label. **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75. **SELECT:** heart disease plus overweight/obesity, without diabetes. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Tirzepatide pancreatitis review:** 11 participants across 5 trials. **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2; SOLSTICE is Phase 2b.
  - **Hair loss:**
    - 5.4% (119/2,183) versus 0.9% (22/2,221) (Gupta 2026).
    - The label reports it in 7.1% of women versus 0.5% of men, and 1.3% versus 0% on placebo.
    - Say "particularly associated with" and "no human studies show a direct effect on follicles". Never say "most often".
  - (About 60 findings, 1 hold.)
- **Quote the joint GLP-1 nutrition advisory only for what it says.**
  - It says to get enough protein and to strength-train at least 3 times a week. "2 days" is WHO's figure.
  - It says to avoid fatty or high-fibre foods "during the first few days of treatment".
  - "Protein at each meal", "eat slowly", "smaller, blander bites" and "stop when full" are our own tips and carry no tag.
  - (7 findings.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag.** Our own tips and safety lines get no tag, never the label's (latest S1 11-02 infection signs and S3 10-30). Only exact printed words go in quotes. Name the exact body: the July 2023 review was the EMA's PRAC. Say who acted: the FDA *asked the makers*. (2 holds. About 100 findings.)
- **Keep the source list clean.**
  - Fetch every URL before submitting: no 403s, 404s, landing pages, search pages or DOI redirects. Use the PubMed record for paywalled journals (404s in S3 11-02; 403s in C1 and S2 10-30).
  - Give each page's current revised date: the Zepbound label is 28 Aug 2026, the Mounjaro label is a 2026 revision, the NHS tiredness pages are 2023.
  - (About 97 findings.)

_Updated 2026-11-02 from 68 QA records (all GLP-1, 10-20 to 11-02)._

_Updated 2026-11-02 from 68 QA records._
