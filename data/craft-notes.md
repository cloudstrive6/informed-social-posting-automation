_Based on 50 QA records from 2026-10-27 to 2026-11-09: 33 Shorts, 14 long-forms and 3 carousels, all GLP-1. **5 didn't ship:** 4 were held and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 4 records from 11-09 (L1 injection site reactions, S1 eyes/NAION, S2 orforglipron and blood pressure, S3 injection site). 3 shipped. L1 was held by the automatic beat-sync gate._
- _**Correction applied (2026-11-09): the old "offset beat" and "wrong content in this shot" findings were a QA bug.** On long-forms from 10-27 to 11-06, the Visual Critic was shown frames in the wrong order. Those claims are removed, and their visual scores and weak-shot counts aren't used as evidence here. The **11-09 hold is different.** It came from the automatic beat-sync gate, which measured 3 shots showing another beat's text. That is real drift._
- _**13:00 masking improved a little:** S2 11-09 came in at exactly 0.020, after five 13:00 Shorts shipped above 0.02. The problem isn't solved yet._
- _Still happening on 11-09: captions built from narration numbers, a phonetic spelling on screen ("NAY-ON"), a stat sitting on faces, 35 tiny-text findings in one long-form, open-question engagement lines, and quotes that aren't verbatim._

_Why items didn't ship in this window:_
- _2 for audio: masking plus lost spoken numbers or drug names (L1 10-27 at 0.024 with silent numbers; L1 10-29 at 0.023 with "rheumatoid")._
- _1 for a wrong count: S1 10-29 said 5 pancreatitis cases where the source says 11._
- _1 for crediting a claim to a source that doesn't say it: L1 10-30 (FDA troponin page)._
- _1 for beat drift caught by the gate: L1 11-09._

### Motion Designer
- **Long-forms: each shot shows only its own beat's on-screen text, cut at that beat's start time from the final narration.** Before render, diff the shot → beat → text list against the script. L1 11-09 was held because s23, s51 and s67 showed text from s64, s58 and s57, and only 83% of cuts landed on time. The beat-sync gate blocks this, so catch it before render. (1 hold.)
- **Get every final mix to masking 0.02 or lower. Measure it last, after any re-render, and never pass a mix above 0.02, whatever the slot or deadline.**
  - The 13:00 Shorts drift worst: S2 10-27, 11-01, 11-02, 11-05 and 11-06 shipped at 0.026–0.037. S2 11-09 was right at 0.020.
  - Copy the settings that worked: the S3 Shorts at 0.000 and the long-forms at 0.002–0.012. Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - (2 holds. 5 Shorts shipped above 0.02.)
- **After the voice render, compare the speech-to-text transcript with the script. Regenerate any scene that fails before you mix.** Check every number phrase, "point", "about", unit and drug name.
  - Seen so far: "tears of petide", "rheumatoid", "or for glip ron", silence in place of "10 or 15 mg", "one thousand three" for "thirteen", "mg" for "milligrams", and dropped "point" or "about" (L1 11-02, L2 10-29).
  - (2 holds. About 9 pieces.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly ("1,879", "575", "2026", "9.5%", "15–20 g", "GLP-1", "MEN 2", "NK-1", "NAION", "BMI").
  - Before render, search for number words (HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY), spaced or hyphenated letters ("F D A", "G F R", "M-T-C") and phonetic spellings ("REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "NAY-ON"), and fix every one.
  - (Wrong or dropped numbers on screen in about 10 Shorts, still in S2 11-09: "HUNDRED TWENTY-SEVEN", "ONE THOUSAND SIX". Phonetic spellings caused 4 subtitle-mismatch flags and appeared on screen 3 more times.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first.
  - Never split a word, number, code or trial name ("SEVENTY-/SIX", "GLP-/1", "B/12", "SURMOUNT / ONE").
  - Never end a card on a comma, dash, colon or ellipsis; on THE or A; on CAN, MAY, WON'T, NOT, DOESN'T or BEEN; on a preposition, POINT, TYPE, YOUR or THEIR; or on a bare number. Give each list item its own card.
  - (Broken cards in nearly all 33 Shorts, including all 3 on 11-09.)
- **Shorts: keep every tag, chip and bubble above y 1150 on a 1920 frame and inside the side edges, with text at least ~40px.**
  - Show at most 2 tags at once, and drop any tag that repeats the caption. Body-part, arm and source tags collide most: "Stomach", "Kidneys", "Blood sugar", "Placebo", "Tirzepatide", "Retina", "Company report".
  - Stat numbers sit on plain space, never over heads, clouds or windows ("445", "1,032", "15–20 g", "6–8 in 100").
  - Render every chip the shot list calls for. Chips were missing in S3 10-30, S1 11-01, S3 11-04 and S3 11-06.
  - (About 300 overlap findings, about 12 on-hero. Still 12–16 per Short on 11-09.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.**
  - Small labels keep rendering at 15–26px: "GLP-1", "GIP", "Fat", "Once", "Temporary", "Belly/Thigh/Upper arm", "72 weeks", "Injection spot".
  - Name and state tags clip at the bottom: "Sam, 49", "Stopped", "Stayed on", "Prescriber".
  - (About 165 tiny-text and 160 off-screen findings in 13 rendered long-forms. L1 11-09 had 35 tiny-text findings.)
- **Fill every frame and delete every placeholder.**
  - Every frame needs a headline plus a labelled hero covering at least ~25% of the frame, from the first frame.
  - Delete empty or ghost bubbles, ghosted figures, cropped decorative shapes and debug marks (S3 11-04, S3 11-06, S2 11-09).
  - The pantry/shelf backdrop stays banned. It has been clean since 11-02.
  - Match each beat's mood backdrop: night → night room, brand → teal gradient, body → not the starfield (L1 11-09, S2 11-05).
  - (About 155 near-empty-shot findings in long-forms, 17 in L1 11-09.)
- **Draw people as whole characters, with a neck and shoulders. Fit each mascot's mood and icon to the line.**
  - No floating heads, faceless blobs, donuts or disembodied eyes or bones. Floating heads appeared in 9 pieces, most recently L1 11-04 and L1 11-06.
  - On risk, "not approved" and uncertainty lines, use a calm, neutral mascot: no smiles, green checks or check-shields, no "Phew"/"Ahh, much better", and no sweating or crying faces.
  - (About 7 mismatches, including S1 11-01, S1 11-05 and S2 11-06.)

### Scriptwriters
- **Write the ending lines exactly, and never speak a video title or say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - Every Short ends with "Full breakdown on our channel, link in the description."
  - 08:00 and 13:00 Shorts put the Exp F line just before that ending: "We answer one tirzepatide question from the research every day. Subscribe if that helps."
  - It was missing in S3 11-06, and S2 11-06 lost the closing line. (2 pieces.)
- **Every safety line is spoken AND written in the on-screen field, in this order:** the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - Spoken but never shown in S3 11-04 and S3 11-05. S1 11-06 dropped "stomach" and "right away" on screen.
  - Where the label says to *stop* and get help (a serious allergic reaction, pancreatitis), scope the don't-stop line: "For anything that isn't one of those emergency signs…" (L1 11-09, S3 11-01).
  - Retatrutide pieces add one plain line saying it isn't approved and that online "research" products aren't the trial drug.
- **Keep Shorts to 170 words or fewer, counting the status, safety, Exp F and closing lines.** (6 went over, up to 186. Latest: S3 11-06 and S1 11-09.)
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence.
  - Pronunciation spellings go in the narration only.
  - Never use "this week", "new", "this flu season" or a holiday date in evergreen pieces (S2 11-04, C1 11-06, L2 10-29).
  - Help lines cover all four markets, or say "your local urgent care or emergency number". NHS 111 alone (L1 11-06) and a skipped Lifeline (S1 11-01) both fail this.
- **Check every count against the source's own unit (cases, participants, trials).**
  - Each number names its measure, drug and arm, comparator, group sizes and timeframe. Say "average change in pain score", never a bare "75.8%".
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - Never say "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29 said 5 cases instead of 11. About 40 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo". Keep "may", "tends to", "dose increases", "that does not go away", "post-marketing" and "severe or won't go away".
  - Don't add "most", "many", "that's why", "similar" or rankings, and keep "overactive thyroid" specific.
  - A hook must not promise what the piece doesn't cover. A "MYTH" label needs evidence against the claim, not just an absence of studies.
  - (1 hold: L1 10-30. About 45 findings.)
- **Run the muted-viewer test both ways.** On-screen text is never stronger, broader or scarier than the narration, and every on-screen item is also spoken. Each caption field and stat card names the drug and dose, both groups, the population, the measure and the timeframe. (About 45 findings, including S2 and S3 on 11-09.)

### Carousel Designer
- **Carousels stay stopped (they reach 0–4 people). If the scheduler asks for one:**
  - Reuse verified Short text only.
  - Every stat says what it counts, for whom, against what and when.
  - Hashtag only the drugs whose own data the post reports. No #Osteoporosis or #ColdAndFluSeason.
  - Don't date the hook, end on the exact disclaimer plus prescriber line, and keep the don't-stop line on Threads.
  - (All 3 carousels in this window had findings.)

### Social Copywriter & packaging
- **YouTube description: viewer copy only, and line 1 left empty for the ▶ Watch next link on every long-form and Short.**
  - The field must never hold an internal note: L1 11-06 shipped a change note (major), and L1 10-28 had a publisher note inside.
  - Line 1 was filled in L1 10-28, L1 11-02, S1 11-02, S1 11-05 and S2 11-06.
  - Then, in order:
    1. A quick answer of 3 lines or fewer that names one specific side effect. It ran over in 5 pieces.
    2. The safety block.
    3. 1–4 sources, never zero (S2 11-01 and S2 11-05 had none).
    4. Real chapters on long-forms, or a clear slot for the publisher.
    5. Hashtags.
  - Stay at **1,250 characters or fewer before the link**. Long-forms keep running over, and L1 10-27 got cut off mid-word, losing its sources and hashtags. Trim the "What you'll learn" block and the source labels first. (5 long-forms over.)
- **Every caption field ends on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you.", copied character for character.**
  - Hashtags and the don't-stop line go before it (7+ pieces, latest S1 11-09). Use a full stop, not a comma or em dash (C1 11-06, S3 11-06).
  - Side-effect, stopping and comparison posts keep the don't-switch/stop/change line word for word, including on Threads. It was missing in C1 10-27, S3 10-30 and S2 11-06. Write "medicines", never "meds" (3 pieces).
  - Threads stays at about 300 characters, safety lines counted. Cut a clause, never a safety line. (It ran over in nearly every piece.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - That covers "on average", "all doses combined", "small trial", "open-label, company-funded", "not yet peer-reviewed", "post-marketing", "reports of", the insulin/sulfonylurea low-blood-sugar caveat, "add a barrier method", the full trial population and the clinician/kidney caveats.
  - Our own caveats go in their own sentence, never after a source tag, and never credit a label with a paraphrase it doesn't use.
  - (About 120 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - The thumbnail never reuses title words and never has blank subtext (L1 11-02).
  - Don't call data more than about 3 months old "new" (S2 11-02).
  - No "Approved yet?" or "Approved Anywhere?" (S2 11-05). Use "what's confirmed?" instead.
  - (About 8 pieces.)
- **The first line carries the hedge, the scope and the population.** Engagement lines ask people to save or share only. No open questions (S3 11-01, and S1 11-09 on both Instagram and Facebook), and never promise content the post doesn't include (S3 11-06, S3 11-09). No emoji on side-effect, safety or stopping posts. (About 15 first lines without the hedge.)
- **Hashtag only drugs whose own data the post reports, generically.**
  - No brand tag for an unapproved use (#Zepbound on prediabetes).
  - No class-study semaglutide tags.
  - No trend, seasonal, haul or awareness tags: #guthealth, #ColdAndFluSeason, #MetabolicHealth.
  - (About 10 pieces, latest S3 11-09.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **Class studies:** say "GLP-1 medicines" and never attach one drug's name. The grocery-cart study gives no drug names.
  - **No diabetes:** SURMOUNT-1, SURMOUNT-4, SURMOUNT-5, STEP 1, ATTAIN-1 and the retatrutide obesity trials. TRIUMPH-2 is the type 2 diabetes trial. ATTAIN-J included about 25% with type 2 diabetes. SURPASS-2 is type 2 diabetes, open-label, against semaglutide 1 mg. FLOW is type 2 diabetes with CKD, eGFR 25–75. SELECT is heart disease plus overweight/obesity, without diabetes.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) vs 36 on placebo. The ~75%/25% split is from Look et al. 2025.
  - **SURMOUNT-4:** 783 began the lead-in, then 335 vs 335 were randomized. The +14.0% is regain from week 36 to week 88. Placebo still ended 9.9% below its starting weight on average.
  - **Pancreatitis review:** 11 participants across 5 trials.
  - **Hair loss:** 5.4% (119/2,183) vs 0.9% (22/2,221). The label gives 7.1% of women vs 0.5% of men, and 1.3% vs 0% on placebo. Say "particularly associated with".
  - **Injection-site reactions (label):** give them per dose, 6% (5 mg) and 8% (10 and 15 mg), vs about 2% on placebo, never as one pooled figure. Serious allergic reactions are post-marketing reports (S3 11-09, L1 11-09).
  - **Oral contraceptives:** "may reduce the efficacy", for 4 weeks after starting and after each dose increase.
  - **Semaglutide:** name the dose compared. Wegovy 7.2 mg was approved in March 2026.
- **Before tagging a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips and safety lines get no tag (infection signs, "limit fluids", "smaller, blander bites").
  - Credit the body that actually says it. The low-blood-sugar figure is in the Zepbound label, not NEJM. "3+ times a week" strength training comes from the joint advisory; "2 days" is WHO's figure. Name NANOS *and* the AAO, and say EMA PRAC (July 2023).
  - Only exact printed words go in quotes (S3 11-09, L2 10-29).
  - (1 hold: L1 10-30. About 60 findings.)
- **Keep the source list clean.**
  - Fetch every URL first: no 402s, 403s or 404s, and no newsroom, media-site, landing or DOI-redirect pages. Use the PubMed record for paywalled journals.
  - Give each page's current revised date: the Zepbound label is 28 Aug 2026, the Mounjaro label is a 2026 revision, and the NHS tiredness pages are 2023.
  - (About 20 findings.)

_Updated 2026-11-09 from 50 QA records (all GLP-1, 10-27 to 11-09)._

_Updated 2026-11-09 from 50 QA records._
