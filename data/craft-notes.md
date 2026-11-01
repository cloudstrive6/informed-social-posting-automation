_Based on 69 QA records from 2026-10-19 to 2026-11-01: 42 Shorts, 17 long-forms and 10 carousels, all GLP-1. **12 didn't ship:** 11 were held and 1 long-form (L1 10-30) failed before render._

_**New since the last pass:** 4 records from 11-01 (L1 constipation, S1 suicidal thoughts, S2 orforglipron ATTAIN-J, S3 constipation). All 4 shipped. The same defects came back:_
- _The pantry backdrop with dashed cells and floating heads in L1, even though the backdrop is banned._
- _A smiling brain with a green check and "Phew, good to know" next to "increased risk of suicidal thoughts" in S1._
- _Numbers and codes broken across lines ("SEVENTY-/TWO", "GLP-/1") in S3, and a corrupted "P ONE TRIALS" card in S1._
- _S2 mixed at 0.026, the first Short above 0.02 since 10-28._
- _Trend hashtags (#guthealth, an awareness tag) in S1 and S3._

_Why items didn't ship:_
- _7 for music masking the voice:_
  - _5 Shorts at 0.034–0.039: S2 and S3 10-21, S2 10-22, S1 10-24, S1 10-25._
  - _2 long-forms: L1 10-27 (0.024) and L1 10-29 (0.023)._
- _3 for wrong spoken numbers or subtitles: S3 10-22, L1 10-27, L1 10-29._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases; the source says 11._
- _2 for crediting a claim to a source that doesn't say it: S2 10-24 (ACOG) and L1 10-30 (FDA troponin page)._
- _1 for a spoken CTA naming a video nobody could confirm was live: S3 10-26._

### Motion Designer
- **Get the final mix to masking 0.02 or lower, and measure it last, for Shorts and long-forms alike.** Duck the music under all narration, and keep sound effects off spoken numbers, names and codes. If it's above 0.02, lower the music and measure again.
  - Shorts: 14 of the 15 since 10-28 measured 0.015 or lower, but S2 11-01 drifted to 0.026. Measure every Short; don't assume the preset holds.
  - Long-forms: the 4 since L1 10-29 measured 0.002–0.010. Copy that level.
  - (7 holds; 9 more Shorts shipped above 0.02.)
- **After the voice render, compare the speech-to-text transcript with the script.** Check every number phrase, every "point" and "about", every unit and every drug name. Regenerate any scene where something is missing or garbled before you mix.
  - Garbled drug names: "rita trutide" and "rheumatoid" for retatrutide, "elicoglyprone", "wegovi", "or for glip ron".
  - "Point" or "about" was dropped 4+ times. "Thirteen" came out as "one thousand three", and "milligrams" as "mg" (S2 11-01).
  - (3 holds.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers, decimals, dates and codes must match the stat pill exactly ("9.5%", "1,879", "91", "A1C", "B12", "BMI", "MTC", "MEN 2", "NK-1", "GLP-1", "Q1 2027", "PAR1229"). Before render, search the captions and fix every hit for:
  - number words (ONE–NINETY, HUNDRED, POINT, PERCENT, TWENTY TWENTY, GLP-ONE);
  - spaced, dropped or stray letters ("F D A", "G F R", "M T C", "E N TWO", "M I", "P ONE");
  - hyphenated or phonetic pronunciations ("M-T-C", "DEG-LOO-DEK", "A-ONE-C", "REH-TAH-TROO-TIDE", "OR FOR GLIP RON").
  - (Nearly every Short. At least 9 wrong numbers reached the screen, latest "P ONE TRIALS" for 91 trials in S1 11-01. Spaced or phonetic letters in 7+ Shorts caused 4 subtitle-mismatch flags.)
- **Each caption card is one whole clause or noun phrase, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first.
  - Never split a word, number, code or trial name, either across cards or across the 2 lines of one card. No hyphen line-breaks ("SEVENTY-/TWO", "GLP-/1" in S3 11-01). Keep "TYPE 2 DIABETES" and "PHASE 3" whole.
  - Never end a card on a comma, dash, colon or ellipsis.
  - Never end on A, THE, AN, BE, BEING, CAN, MAY, NOT, OR, WHO, WHOSE, ABOUT, IN, LIKE, PLUS, POINT, TYPE, YOUR, THEIR, FDA'S, MID or a bare number.
  - Never put an alarming phrase ("KIDNEY FAILURE.") alone on a card.
  - (Broken cards in all 42 Shorts, still in all 3 on 11-01. Ghost text in about 12 pieces.)
- **Shorts: no part of any tag, chip, label or bubble goes below y 1150 on a 1920 frame, or past the left or right edge.** Put name tags above the head, with at most 2 tags on screen at once. Drop any tag that repeats the caption, and spell-check every tag ("Tirzepatic"). Render every chip the shot list calls for: S1 11-01 and S3 10-30 each dropped one. (About 367 overlap findings in 42 Shorts, still 2–21 a Short. Body-part tags collide most: Stomach, Gut, Heart, Kidney, Hair follicle, Protein, Fluids, Tirzepatide/Placebo, Prescriber.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame and inside the side edges, and make all text at least ~40px.** That includes molecule, organ and clock labels: "GLP-1", "GIP", "Fat", "Amylin", "Glucagon", "Appetite", "Once" and "Fork down" keep rendering at 15–26px. Name tags like "Sam, 49" and "Dana, 47" still clip at the bottom. (About 327 off-screen and 239 tiny-text findings in 16 rendered long-forms. L1 11-01 got tiny text down to 2 and L1 10-28 got off-screen down to 1, so it can be done.)
- **The pantry/shelf backdrop is banned, so swap it out at storyboard time. It has still shipped in 17 pieces, latest L1 11-01.** If a scene template includes shelves, replace it with the room or plain-gradient backdrop before you build the shot. Every frame needs a headline plus a labelled hero covering at least ~25% of it, from the first frame. Never open a beat on chips alone. Before render, delete every placeholder: empty chips, empty or text-less speech bubbles, greyed duplicate people, debug labels ("The skipped number"). (About 201 near-empty-shot findings in long-forms, 8 in L1 11-01. Empty bubbles in S1 10-29 and S3 10-31.)
- **Long-forms: one shot = one scripted beat.** Before render, check each shot's title and chips against its beat, clear the previous shot's overlays, and confirm the disclaimer card shows at its beat. (L1 10-20 and 10-27 showed scenes from minutes later and dropped the disclaimer. Stale chips leaked into later shots in L1 10-21 and 10-28.)
- **Draw people and mascots as whole characters whose mood fits the line.**
  - People need a neck and shoulders, on every backdrop including the room. Floating heads appear in about 14 pieces, latest L1 11-01 ×2 and L1 10-31.
  - No faceless circles, brown blobs or disembodied eyes.
  - On risk lines, use a calm, neutral mascot. No smiles, no green checks and no relieved bubbles ("Phew") next to a risk (S1 11-01 suicidal thoughts, S3 10-23 heart attack, S1 10-27 kidney failure). No scared, sweating or crying mascots either (S2 11-01 ×2, S3 10-29, S1 10-24).

### Scriptwriters
- **Never speak a video title, and never say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - Shorts end with "Full breakdown on our channel, link in the description."
  - Every script says "Not personal advice" plus the prescriber line.
  - Comparison, stopping and safety pieces add "don't switch, stop or change your medicines on your own".
  - (1 hold: S3 10-26. Spoken titles in about 8 pieces; none since the new ending on 10-27.)
- **Write the narration exactly as it should be spoken.** Write numbers as words and spell out units ("milligrams", not "mg"). Give each decimal its own short sentence. Pronunciation spellings go in the narration only; the plain name goes in the on-screen field. Check for merged words ("redefinedfor", "aonec"). (About 26 pieces, 3 holds.)
- **Keep Shorts to 170 words or fewer, counting the status and prescriber lines.** (8 went over, up to 260 words in S1 10-25.)
- **Check every count against the source's own unit (cases, participants, trials).**
  - Each number names its measure, the drug and exact arm, the comparator, each group's size and the timeframe or reference point.
  - Put an absolute rate next to any relative figure.
  - For cross-trial comparisons, say "separate trials, not head-to-head" and use the same measure on both sides.
  - Never say or show "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - A median is "half of people".
  - (1 hold: S1 10-29, which said 5 cases instead of 11. About 57 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo".
  - Keep "may include", "tends to", "consistent with" and "right away". Don't turn "consistent with" into "drives" (S1 11-01).
  - Don't add proportions the source doesn't give ("most people's", "most often").
  - Label post-hoc analyses, and call topline and conference results "not yet peer-reviewed".
  - No vague credits ("experts think", "experts don't agree").
  - (About 40 findings, 1 hold.)
- **Run the muted-viewer test both ways: on-screen text is never stronger or broader than the narration, and every on-screen item is also spoken.** Every stat card names the drug and dose, both groups, the population, the measure and the timeframe. Pooled doses say "all doses". Speak every helpline and emergency line that's on screen (Australia's Lifeline was skipped in S1 11-01, and 000 in S1 10-23). (About 46 findings.)

### Carousel Designer
- **Carousels are stopped (they reach 0–4 people), and none have been made since 10-30.** If one is made, reuse verified Short text only.
  - Every stat says what it counts, for whom, against what and when.
  - Randomized results say "compared with placebo".
  - Label myths "MYTH".
  - Leave no placeholder cells.
  - End on the disclaimer plus the prescriber line.
  - (About 40 findings in 10 carousels.)

### Social Copywriter & packaging
- **YouTube description: 1,300 characters or fewer before the publisher adds the ▶ Watch next link, so it stays under 1,400 after.** Line 1 is the empty slot for that link: never "follow for more", a placeholder or a guessed URL. Then, in order:
  1. A quick answer of 3 lines or fewer that names one specific side effect.
  2. The disclaimer plus the prescriber line.
  3. Up to 4 sources, in Shorts too.
  4. Real chapters, one for every section including the final checklist (long-forms only).
  5. Complete hashtags.

  No internal or publisher notes in any public field. (L1 11-01 came to about 1,380 before the link. 4 ran past 1,400, and L1 10-27 was cut off mid-word. Short descriptions had no sources in S1 10-20 and S2 11-01. Missing or placeholder chapters in L1 10-26 and L2 10-30. A publisher note was left in L1 10-28. The quick answer ran long about 20 times.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.** Use "can" or "why it can…" when the video gives a leading explanation, not a certainty. Use at most 1 number and 1 abbreviation. The thumbnail mustn't suggest a single fix the video qualifies. (About 14 pieces, 1 major: "Zepbound Pen" when only the KwikPen was covered. Latest: the L1 10-31 food-noise title.)
- **Hashtag only drugs whose own data the post reports.** A GLP-1 class study gets no semaglutide or tirzepatide tag. No company tags, no condition tags outside the trial's population, and no trend or awareness tags (#guthealth, haul tags, awareness-campaign tags). (About 11 pieces, latest S1 and S3 11-01 and S3 10-31.)
- **Every caption field ends on "Not personal advice" plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it, hashtags included.**
  - Side-effect, stopping and comparison posts keep the don't-stop line word for word in every field. Write "medicines", not "meds".
  - Keep Threads to about 300 characters, safety lines counted. Cut a clause, never a safety line.
  - (Threads ran over in nearly every piece, latest S2 and S3 11-01. The don't-stop line was dropped or shortened in Threads 7 times. Text after the prescriber line 4 times.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script, pinned comments included.** That covers "on average", "all doses combined", "small trial, doses not compared directly", "or overweight plus a weight-related condition", group sizes, the timeframe, "not yet peer-reviewed", "observational", "reassuring, not guaranteed", and the kidney or clinician caveats. Put our own caveats in their own sentence, never inside or after a source tag like "(NHS advice)". (About 170 findings, in every batch.)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only, never an open question. No emoji on side-effect, safety, stopping or gray-market posts. (Open questions about 7 times, latest S3 11-01; emoji about 6; hedge missing from line 1 about 18 times.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **Class studies:** if a study covers GLP-1 medicines as a class, say "GLP-1 medicines" and don't attach one drug's name to its participants. (4 findings, latest S3 10-31 ×2.)
  - **No diabetes:** SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher, with 243 and 448 people.
  - **ATTAIN-J (Japan)** included people with type 2 diabetes (about 25%), so don't contrast it with ATTAIN-1 as a "without diabetes" trial.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses pooled) versus 36 on placebo, over 72 weeks. The ~75% fat / ~25% lean split comes from Look et al., *Diabetes Obes Metab* 2025.
  - **SURMOUNT-5:** tirzepatide 10 or 15 mg versus semaglutide 1.7 or 2.4 mg, each at its maximum tolerated dose.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 versus 335 were randomized. The +14.0% is regain from week 36 to week 88.
  - **SURPASS-2:** type 2 diabetes, open-label, versus semaglutide 1 mg.
  - **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Tirzepatide pancreatitis review:** 11 participants across 5 trials.
  - **ZUPREME-1:** 485 randomized.
  - **Elecoglipron:** VISTA is Phase 2; SOLSTICE is Phase 2b.
  - **Hair loss** (for the L1 10-30 redo, still pending):
    - 5.4% (119/2,183) versus 0.9% (22/2,221) (Gupta 2026).
    - The label reports it in 7.1% of women versus 0.5% of men.
    - Say "particularly associated with", "linked to rapid weight loss" and "no human studies show a direct effect on follicles". Never say "most often" or "it isn't the drug".
  - (About 57 findings, 1 hold.)
- **Quote the joint GLP-1 nutrition advisory only for what it says.**
  - It says to get enough protein and to do strength training at least 3 times a week. The "2 days" figure is WHO's.
  - It says to avoid fatty or high-fibre foods "during the first few days of treatment" to ease nausea.
  - "Protein at each meal", "eat slowly" and "stop when full" are our own tips and carry no tag.
  - (6 findings.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag or the line.** Our own tips and safety lines get no tag, and never the label's. Only exact printed words go in quotes. Name the exact body and the full date: the July 2023 GLP-1 suicidality review was the EMA's PRAC, not the FDA (S1 11-01, and PRAC in S1 10-22). Say who acted: the FDA *asked the makers* to remove a warning. (2 holds: S2 10-24 ACOG and L1 10-30 FDA troponin page. About 100 findings.)
- **Keep the source list clean.**
  - Use canonical URLs: no landing pages, search pages, DOI redirects or 403s. For paywalled journals, use the PubMed record.
  - Cite the primary paper, and give online-first and print dates.
  - Give each page's current "last revised/reviewed" date, not a guessed year. The Zepbound label was revised 28 Aug 2026, the Mounjaro label has a 2026 revision, and the NHS tiredness pages are dated 2023.
  - (About 94 findings, latest L1 11-01 and S1 10-31.)

_Updated 2026-11-01 from 69 QA records (all GLP-1, 10-19 to 11-01)._

_Updated 2026-11-01 from 69 QA records._
