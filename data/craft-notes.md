_Based on 61 QA records from 2026-10-24 to 2026-11-06: 39 Shorts, 16 long-forms and 6 carousels, all GLP-1. **8 didn't ship:** 7 were held and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 5 records from 11-06 (C1 sick-day carousel, L1 fatigue, S1 Thanksgiving, S2 tirzepatide plus ixekizumab, S3 low blood sugar). All 5 shipped. Three known problems got worse:_
- _**Correction (2026-11-09): the "offset beats" on long-forms (10-20 to 11-06) were a QA bug, not a video defect.** The Visual Critic's snapshot frames were sorted as text, so frames from 4 to 5 min in were shown under labels for 30 to 55 s. The published videos were measured and are in sync, and the disclaimer was on screen. The low visual scores and weak-shot counts on those long-forms are unreliable for the same reason._
- _**A 13:00 Short shipped at masking 0.037.** That's S2 11-06, the 6th 13:00 Short above 0.02. S1 10-25 was held at the same 0.037, so the gate isn't being applied the same way every time._
- _**The L1 11-06 description was an internal change note** with no quick answer, safety lines or sources (major)._
- _New repeat problems: the Exp F subscribe line or the closing line was missing (S2 and S3 11-06). The safety block ended on the wrong line (S3 11-06, S3 10-27). Help lines were UK-only (NHS 111 in L1 11-06)._

_Why items didn't ship in this window:_
- _4 for music masking the voice: S1 10-24 at 0.038, S1 10-25 at 0.037, L1 10-27 at 0.024 and L1 10-29 at 0.023._
- _2 for spoken numbers or drug names lost: L1 10-27 and L1 10-29 ("rheumatoid")._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases where the source says 11._
- _2 for crediting a claim to a source that doesn't say it: S2 10-24 (ACOG) and L1 10-30 (the FDA troponin page)._
- _1 for a spoken call to action naming a video nobody could confirm was live: S3 10-26._

### Motion Designer
- **Long-forms: one shot = one scripted beat.** Beat timing is checked automatically by the beat-sync gate (plan, final audio and render) and real drift blocks the upload; the earlier "offset beat" reports were a QA bug (see the correction above). Keep each shot's headline to its own beat's on-screen text.
- **Match the backdrop and lighting to each beat's mood tag, and keep one look per scene.**
  - "Night" beats get the night room, "brand" beats get the teal gradient, "warm" beats get the warm room.
  - Mismatches: L1 11-05 (warm → night), and L1 11-06 (a night beat on the daytime room, a brand beat on the tan room, plus a black void). S2 11-05 also jumped to a starfield palette. (4 findings.)
- **Get every final mix to masking 0.02 or lower. Measure it last, after any re-render, and never pass a mix above 0.02 downstream.** That applies whatever the slot or deadline: 0.037 was held on 10-25 but shipped on 11-06.
  - The 13:00 Shorts drift worst: S2 10-26, 10-27, 11-01, 11-02, 11-05 and 11-06 shipped at 0.025–0.037.
  - Copy the settings that worked: S2 11-04 at 0.000, and the long-forms at 0.002–0.012.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - (4 holds. 8 Shorts shipped at 0.021–0.037.)
- **After the voice render, compare the speech-to-text transcript with the script. Regenerate any scene that fails before you mix.** A garbled drug name is a fail even if the piece otherwise passes.
  - Check every number phrase, every "point" and "about", every unit and every drug name.
  - Garbled so far: "tears of petide", "rheumatoid", "elicoglyprone", "or for glip ron", "deg loo dek".
  - Dropped "point" or "about" has happened 5+ times. Also seen: "one thousand three" for "thirteen", "mg" for "milligrams", and an inserted "the" (L1 11-06).
  - (2 holds.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly: "575", "1,329", "2026", "9.5%", "15–20 g", "A1C", "B12", "MTC", "MEN 2", "NK-1", "GLP-1", "BMI".
  - Before render, search the captions and fix every number word (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY).
  - Fix every set of spaced letters ("F D A", "G F R", "M T C", "B-M-I") and every phonetic spelling ("REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "TRA-DIP-IH-TANT").
  - (Found in nearly every Short. Wrong numbers reached the screen 9+ times. Phonetic spellings caused 6 subtitle-mismatch flags.)
- **Each caption card is one whole clause or noun phrase, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first. Ghost text was seen in 8+ Shorts.
  - Never split a word, number, code or trial name across cards or lines: "SEVENTY-/SIX", "GLP-/1", "B/12", "SURMOUNT / ONE", "1,032".
  - Never end a card on any of these:
    - punctuation: a comma, dash, colon or ellipsis
    - an article (THE, A)
    - an auxiliary verb: CAN, MAY, WON'T, NOT, ISN'T, BEEN, BEING
    - a preposition, SINCE, POINT, TYPE, YOUR or THEIR
    - a bare number
  - Write-ups with long lists tend to end on a comma, so give each list item its own card.
  - (Broken cards in nearly all 39 Shorts, still in all 3 Shorts on 11-06.)
- **Shorts: keep every tag, chip, label and bubble above y 1150 on a 1920 frame and inside the side edges, with text at least ~40px.**
  - Show at most 2 tags at once, and drop any tag that repeats the caption.
  - Body-part and source tags collide with captions most: "Stomach", "Kidneys", "Blood sugar", "Placebo", "Company report", "Prescriber".
  - Stat numbers sit on plain space, never over people, clouds or windows (about 14 on-hero findings, including "445", "1,032" and "15–20 g").
  - Render every chip the shot list calls for. Chips were missing in S3 10-30, S1 11-01, S3 11-04, S3 11-04 BP and S3 11-06.
  - (About 390 overlap findings. Still 4–5 per Short on 11-06.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.**
  - Molecule, organ and clock labels keep rendering at 15–26px: "GLP-1", "GIP", "Fat", "Amylin", "Once", "Temporary".
  - Name and state tags clip at the bottom: "Sam, 49", "Dana, 47", "Stopped", "Stayed on".
  - (About 200 off-screen and 200 tiny-text findings in 15 rendered long-forms.)
- **Fill every frame and delete every placeholder.**
  - Every frame needs a headline plus a labelled hero covering at least ~25% of the frame, from the first frame.
  - Before render, delete empty dashed chips and shelves, empty or ghost bubbles, greyed duplicate people and debug marks.
  - The pantry/shelf backdrop stays banned. It has been clean since 11-02.
  - (About 180 near-empty-shot findings in long-forms, 12 in L1 11-06.)
- **Draw people as whole characters, with a neck and shoulders joining the head to the body. Fit each mascot's mood and icon to the line.**
  - No floating heads, faceless blobs, donut shapes, or disembodied eyes or bones. Priya and the woman in L1 11-06 were floating heads again.
  - On risk, uncertainty and "not approved" lines, use a calm, neutral mascot: no smiles, green checks, check-shields or "Phew/Ahh, much better", and no sweating, scared or crying faces either.
  - (Floating heads in about 17 pieces. Mood or icon mismatches in 12, including L1 11-06 and S2 11-06.)

### Scriptwriters
- **Write the ending lines exactly, and never speak a video title or say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - Every Short ends with "Full breakdown on our channel, link in the description."
  - 08:00 and 13:00 Shorts put the Exp F line just before that ending: "We answer one tirzepatide question from the research every day. Subscribe if that helps." Count it in the 170 words. It was missing in S3 11-06. S2 11-06 had it but lost the closing line.
  - (1 hold: S3 10-26.)
- **Every safety line is spoken AND written in the on-screen field, in this order:** the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - In S3 11-04 and S3 11-05 these were spoken but never shown.
  - On-screen versions keep "stomach" and "right away" (S1 11-06).
  - Retatrutide pieces add one plain line saying it isn't approved and that online "research" products aren't the trial drug.
  - (About 8 findings.)
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence.
  - Pronunciation spellings go in the narration only; the plain name goes in the on-screen field.
  - Never say "this week", "new" or "this flu season" in evergreen pieces. Give the date, checked against the source.
  - Name the subject rather than "it" after a list.
  - Help lines must cover all four markets, or say "your local urgent care or emergency number". NHS 111 alone is UK-only (L1 11-06), and S1 11-01 skipped Australia's Lifeline.
  - (About 32 pieces, 2 holds.)
- **Keep Shorts to 170 words or fewer, counting the status, safety, Exp F and closing lines.** (8 went over in this window, up to about 260, most recently S3 11-06.)
- **Check every count against the source's own unit (cases, participants, trials).**
  - Each number names its measure, the drug and exact arm, the comparator, each group's size and the timeframe. Say "average change in pain score", never a bare "75.8%".
  - Put an absolute rate next to any relative figure. For cross-trial comparisons, say "separate trials, not head-to-head".
  - Never say "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29 said 5 cases instead of 11. About 55 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo".
  - Keep "may", "may include", "tends to", "that does not go away", "dose increases", "right away" and "severe or won't go away" (don't upgrade that one to "right away").
  - Don't add proportions ("most people's", "many", "at all"), rankings, "similar" for unmatched groups, or "that's why" links the source doesn't make.
  - Keep specific terms specific: "overactive thyroid", not "thyroid problems".
  - A hook must not promise a topic the piece doesn't cover: C1 11-06 promised flu advice but gave stomach-bug advice.
  - A "MYTH" label needs evidence against the claim, not just an absence of studies.
  - (About 55 findings, 1 hold.)
- **Run the muted-viewer test both ways.** On-screen text is never stronger, broader or scarier than the narration, and every on-screen item is also spoken. Each caption field and stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 60 findings, including S1, S2 and S3 on 11-06.)

### Carousel Designer
- **Carousels are stopped (they reach 0–4 people), but one was made on 11-06.** If the scheduler asks for one:
  - Reuse verified Short text only.
  - Every stat says what it counts, for whom, against what and when.
  - Don't date the hook ("this flu season") or promise more than the slides cover.
  - Label myths "MYTH", and end on the disclaimer plus the prescriber line.
  - (About 29 findings in 6 carousels.)

### Social Copywriter & packaging
- **YouTube description: viewer copy only, 1,250 characters or fewer before the publisher's link, and line 1 left empty for the ▶ Watch next link on every long-form and Short.**
  - L1 11-06 shipped an internal change note as the whole description (major). L1 10-28 had a publisher note inside it. Before you hand off, check the field starts with the empty line 1 and then the quick answer.
  - Line 1 was filled in L1 11-02, S1 11-02, S1 11-05 and S2 11-06, after 11 earlier misses.
  - Then, in order:
    1. A quick answer of 3 lines or fewer that names one specific side effect.
    2. The safety block, ending on the disclaimer plus the prescriber line.
    3. Up to 4 sources. Never zero: S2 11-01 and S2 11-05 listed none.
    4. Real chapters on long-forms. If the timestamps aren't ready yet, leave a clear slot for the publisher, never fake timestamps.
    5. Complete hashtags.
- **Every caption field ends on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you.", copied character for character with full stops and apostrophes.**
  - Hashtags and the don't-stop line go before it, never after it. Seen in 7+ pieces, latest S3 11-06. C1 11-06 used a comma in place of the full stop.
  - Side-effect, stopping and comparison posts keep the don't-switch/stop/change line word for word, including on Threads (missing in S2 11-06). Write "medicines", not "meds", and keep urgency words.
  - Keep Threads to about 300 characters, safety lines counted. Cut a clause, never a safety line. (Threads ran over in nearly every piece.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - That covers "on average", "all doses combined", "small trial", "open-label, company-funded", "not yet peer-reviewed", "observational", "post-marketing", "reports of", the insulin/sulfonylurea low-blood-sugar caveat and "add a barrier method" (not "or condoms").
  - It also covers the full trial population and the fluid, kidney and clinician caveats.
  - Our own caveats go in their own sentence, never after a source tag.
  - Never put the label's name on a paraphrase it doesn't use: the label says "may reduce the efficacy", not "absorbed".
  - (About 170 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - The thumbnail never reuses title words and never has blank subtext.
  - Don't call data "new" if it's more than about 3 months old.
  - Don't use "Approved yet?" or "Approved Anywhere?" titles. For retatrutide, use the "what's confirmed?" angle instead.
  - (About 15 pieces.)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only, and never promise content the post doesn't include. No emoji on side-effect, safety or stopping posts, and no weight-centred wording or tags. (About 24 first lines without the hedge. 6 open questions.)
- **Hashtag only drugs whose own data the post reports, generically.** No brand tags for uses the brand isn't approved for (#Zepbound on prediabetes, #Mounjaro on SURMOUNT-1). No company, out-of-population, trend, seasonal or awareness tags (#guthealth, #ColdAndFluSeason, haul tags). (About 18 pieces, latest C1 11-06.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **Class studies:** say "GLP-1 medicines" and never attach one drug's name.
  - **No diabetes:** SURMOUNT-1, SURMOUNT-4, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and the TRIUMPH obesity trials. TRIUMPH-2 is the type 2 diabetes trial. The TRIUMPH sleep apnea trials enrolled BMI 27 or higher (243 and 448 people). ATTAIN-J included about 25% with type 2 diabetes.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) vs 36 on placebo, over 72 weeks. The ~75%/25% split is from Look et al. 2025.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 vs 335 were randomized. The +14.0% is regain from week 36 to week 88. Placebo still ended 9.9% below its starting weight on average.
  - **SURMOUNT-5:** semaglutide at 1.7 or 2.4 mg, each person's maximum tolerated dose.
  - **Semaglutide doses:** name the dose compared. Wegovy 7.2 mg was approved in March 2026; SURPASS-2 used 1 mg.
  - **SURPASS-2:** type 2 diabetes, open-label. **FLOW:** type 2 diabetes with chronic kidney disease, eGFR 25–75. **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **Pancreatitis review:** 11 participants across 5 trials. **ZUPREME-1:** 485 randomized. **Elecoglipron:** VISTA is Phase 2; SOLSTICE is Phase 2b.
  - **Hair loss:** 5.4% (119/2,183) vs 0.9% (22/2,221) (Gupta 2026). The label reports 7.1% of women vs 0.5% of men on tirzepatide, and 1.3% vs 0% on placebo. Say "particularly associated with", never "most often".
  - **Oral contraceptives (tirzepatide label):** "may reduce the efficacy" because of delayed gastric emptying. The label's timeframe is 4 weeks after starting and 4 weeks after each dose increase. The vomiting and diarrhoea pill rules come from the NHS sickness subpage.
  - (About 55 findings, 1 hold.)
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips and safety lines get no tag: infection signs, "limit fluids", protein and follow-up habits, "smaller, blander bites", "diluted".
  - Credit the body that actually says it. The NHS tiredness page credits gradual cutting back to The Sleep Charity. The low-blood-sugar figure is in the Zepbound label, not the NEJM abstract. The joint GLP-1 advisory says strength-train 3+ times a week ("2 days" is WHO's figure). Name the EMA's PRAC (July 2023), say the FDA *asked the makers*, and say the Malaysian Health Minister spoke to Parliament.
  - Only exact printed words go in quotes.
  - (2 holds. About 105 findings, including L1, S3 and C1 on 11-06.)
- **Keep the source list clean.**
  - Fetch every URL before submitting: no 402s, 403s or 404s, no landing or newsroom pages, no search pages and no DOI redirects. Link the exact subpage that carries the claim.
  - Use the PubMed record for paywalled journals.
  - Give each page's current revised date: the Zepbound label is 28 Aug 2026, the Mounjaro label is a 2026 revision, and the NHS tiredness pages are 2023.
  - (About 95 findings.)

_Updated 2026-11-06 from 61 QA records (all GLP-1, 10-24 to 11-06)._

_Updated 2026-11-06 from 61 QA records._
