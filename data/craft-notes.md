_Based on 50 QA records from 2026-10-28 to 2026-11-10: 33 Shorts, 14 long-forms and 3 carousels, all GLP-1. **5 didn't ship:** 4 were held, and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 5 records from 11-10 (C1, L1, S1, S2, S3)._
- _**L1 11-10 (burping/heartburn) was held for beat sync.** The plan had all 74 of 74 beats on time, but only 86% of the cuts in the render landed on time, and 6 beats were heard more than 0.5 s from their shot. That makes **2 beat-sync holds in a row (L1 11-09 and L1 11-10)**, and both were 14:00 Lane A slots. In both cases the plan was right and the render drifted._
- _Masking was clean in every 11-10 slot (0.000–0.011), including the 13:00 Short._
- _Still repeating: number words in captions, broken caption cards, tag overlaps (7–19 per Short), starfield backdrops on body beats (2 of the 3 Shorts), floating heads, tiny and clipped long-form tags, source tags on our own tips, Threads over 300 characters, open-question engagement lines, and trend hashtags._
- _New:_
  - _a cabinet strip that looks like the banned pantry backdrop (L1 11-10)_
  - _a tirzepatide-only trial written up as "a GLP-1 medicine" (S2 11-10)_
  - _a title that dropped "possible" (S1 11-10)_

_**Correction applied:** the "offset beat" and "wrong content in this shot" findings in records up to 11-09 were a QA bug (the Visual Critic saw frames out of order). The published videos are in sync and the disclaimer was on screen. Those findings are not used as evidence here; this mainly affects L1 11-02 and L1 11-05. The two beat-sync holds are separate: the automatic gate measured that drift, so it's real._

_Why items didn't ship: 2 for beat drift (L1 11-09, L1 11-10), 1 for audio (L1 10-29: masking 0.023 plus a dropped "point" and "rheumatoid" heard for retatrutide), 1 for a wrong count (S1 10-29: 5 pancreatitis cases instead of 11), and 1 for crediting a claim to a source that doesn't make it (L1 10-30)._

### Motion Designer
- **Long-forms: check beat sync on the render, not just on the plan.** The plan was clean in both holds (69/72 and 74/74 beats on time), and the drift came in at render.
  - Take each cut time from the final narration's word timestamps. Never reuse shot durations from the plan after any re-render or re-voice.
  - After render, measure every cut against its beat's start time. Fix any cut more than 0.5 s off before you submit.
  - Each shot shows only its own beat's on-screen text. L1 11-09 had s23, s51 and s67 showing text from s64, s58 and s57.
  - (2 holds, back to back: L1 11-09 had 83% of cuts on time, L1 11-10 had 86%.)
- **Get every final mix to masking 0.02 or lower. Measure it last, after any re-render, and never pass a mix above 0.02, whatever the slot or deadline.**
  - The 13:00 Shorts drift worst: S2 11-01, 11-02, 11-05 and 11-06 shipped at 0.026–0.037, and S2 11-09 was right at 0.020. S2 11-10 reached 0.000, so the 13:00 slot can be fixed. Reuse that mix.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - (1 hold: L1 10-29. 4 Shorts shipped above 0.02.)
- **After the voice render, compare the speech-to-text transcript with the script. Regenerate any scene that fails before you mix.** Check every number phrase, "point", "about", unit and drug name.
  - Seen so far: "tears of petide", "rheumatoid", "or for glip ron", "one thousand three" for "thirteen", "mg" for "milligrams", a dropped "point" or "about", and an extra "the".
  - (1 hold. 8 pieces.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly ("126", "6.4", "1,032", "575", "2026", "9.5%", "15–20 g", "GLP-1", "MEN 2", "NK-1", "NAION").
  - Before render, search the captions and fix every:
    - number word: HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY
    - spaced or hyphenated letter group: "F D A", "M-T-C", "N K ONE"
    - phonetic spelling: "REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "NAY-ON"
  - (Wrong or split numbers on screen in about 11 Shorts, latest S1 11-10 with "ONE HUNDRED / SIX POINT FOUR". Phonetic spellings caused 4 subtitle-mismatch flags.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first. Ghost text was left behind in S3 11-10 and S2 11-09.
  - Never split a word, number, code or trial name across cards or lines ("SEVENTY-/SIX", "GLP-/1", "B/12", "TYPE / TWO DIABETES").
  - Never end a card on:
    - a comma, dash, colon or ellipsis
    - THE or A
    - CAN, MAY, WON'T, NOT, DOESN'T or BEEN
    - a preposition, POINT, TYPE, YOUR or THEIR
    - a bare number
  - Keep a stat sentence on one card: "4 in 100 to 5 in 100 vs 2 in 100", not "IN FOUR IN A".
  - Give each list item its own card.
  - (Broken cards in nearly all 33 Shorts, including all 3 on 11-10.)
- **Shorts: keep every tag, chip and bubble above y 1150 on a 1920 frame and inside the side edges. Make all text at least ~40px.**
  - Show at most 2 tags at once, and drop any tag that repeats the caption or a chip.
  - Body-part, arm and source tags collide most: "Stomach", "Kidneys", "Blood sugar", "Placebo", "Tirzepatide", "Optic nerve", "Company report".
  - Put stat numbers on plain space, never over heads, clouds or windows ("445", "1,032", "15–20 g", "6–8 in 100").
  - Render every chip the shot list calls for. Chips were missing in S3 10-30, S1 11-01, S3 11-04 and S3 11-06.
  - (About 300 overlap findings, still 7–19 per Short on 11-10, and 11 on-hero findings.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.**
  - Small labels keep rendering at 15–26px: "GLP-1", "Fat", "Once", "Temporary", "Belly/Thigh/Upper arm", "72 weeks", "3 days in", "Heartburn", "9 p.m.", "Chest burn".
  - Name, state and dose tags clip at the bottom of the frame: "Sam, 49", "Stopped", "Stayed on", "15 mg", "Stomach".
  - (About 150 tiny-text and 150 off-screen findings in 13 rendered long-forms. L1 11-10 had 17 tiny and 12 off-screen.)
- **Fill every frame and delete every placeholder.**
  - From the first frame, every frame needs a headline plus a labelled hero covering at least ~25% of it.
  - Delete empty or ghost bubbles, ghosted figures, cropped decorative shapes and debug marks (S1 10-29, S3 10-31, S3 11-04, S3 11-06, S2 11-09, S3 11-10).
  - The pantry/shelf backdrop stays banned, and that includes cabinet or shelf strips along the top and bottom (L1 11-10).
  - Match each beat's mood to its backdrop: night → night room, brand → teal gradient, clinic → clinic. Never use the starfield on a body beat (S2 11-05, L1 11-09, S1 11-10, S2 11-10).
  - (About 140 near-empty-shot findings in long-forms, including 19 in L1 11-10.)
- **Draw people as whole characters, with a neck and shoulders, crowds included. Fit each mascot's mood and icon to the line.**
  - No floating or hanging heads, faceless blobs, donuts, or disembodied eyes or bones.
  - Floating heads appeared in 11 pieces, 8 of them long-forms. The latest are L2 11-09 (Jo and the "1 in 5" crowd) and L1 11-10.
  - On risk, "not approved" and uncertainty lines, use a calm, neutral mascot:
    - no smiles, green checks or check-shields
    - no "Phew" or "Ahh, much better"
    - no sweating or crying faces
  - (About 6 mood mismatches, including S1 11-01, S1 11-05, S2 11-06 and L1 11-06.)

### Scriptwriters
- **Keep Shorts to 170 words or fewer, counting the status, safety, Exp F and closing lines. Count them yourself; don't copy the count from the post note.** (6 went over, up to 176. Latest: S1 11-09 at 171 and S3 11-10 at 172, whose post note wrongly said 170.)
- **Write the ending lines exactly, and never speak a video title or say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - Every Short ends with "Full breakdown on our channel, link in the description."
  - 08:00 and 13:00 Shorts put the Exp F line just before it: "We answer one tirzepatide question from the research every day. Subscribe if that helps."
  - (S2 11-06 lost its closing line.)
- **Speak every safety line AND write it in full in the on-screen field.**
  - Order: the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - Write the on-screen versions character for character, never shortened. Lines were missing on screen in S3 11-04 and S3 11-05, words were dropped in S1 11-06, and the prescriber line was shortened in L2 11-09.
  - Where the label says to *stop* and get help (a serious allergic reaction, pancreatitis), scope the don't-stop line: "For anything that isn't one of those emergency signs…". The emergency card must name its trigger too; L1 11-09's s51 read as a general "stop" instruction.
  - Retatrutide pieces add one plain line: it isn't approved, and online "research" products aren't the trial drug.
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence (S2 11-09 hid a decimal inside a run-on sentence).
  - Put pronunciation spellings in the narration only.
  - Never use "this week", "new", "this flu season" or a holiday date in evergreen pieces (L2 10-29, S2 11-04, C1 11-06).
  - Help lines cover all four markets, or say "your local urgent care or emergency number". NHS 111 alone (L1 11-06) and a skipped Lifeline (S1 11-01) both fail.
- **Check every count against the source's own unit (cases, participants or trials).**
  - Each number names its measure, drug and arm, comparator, group sizes and timeframe.
  - Say "average change in pain score", never a bare "75.8%".
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - Say "counting everyone who started" or "if everyone stayed on treatment", never "estimand".
  - (1 hold: S1 10-29 said 5 cases instead of 11. About 35 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo".
  - Keep the source's own words: "may" (never "can"), "tends to", "dose increases", "post-marketing", "severe or won't go away", "particularly associated with", "blurred or missing portions of vision".
  - Don't add "most", "many", "that's why", "similar", "one of the most useful" or rankings. Keep "overactive thyroid" specific.
  - A hook must not promise anything the piece doesn't cover. A "MYTH" label needs evidence against the claim, not just an absence of studies.
  - (1 hold: L1 10-30. About 45 findings.)
- **Run the muted-viewer test both ways, and start with the opening stat card.**
  - On-screen text is never stronger, broader or scarier than the narration, and everything on screen is also spoken.
  - Every caption field and stat card names the drug and dose, both groups, the population, the measure and the timeframe.
  - (About 45 findings, including L2 11-09 s4, L1 11-09 s01, L1 11-10 s15 and S3 11-10 s3.)

### Carousel Designer
- **Carousels stay stopped (they reach 0–4 people). If the scheduler asks for one:**
  - Reuse verified Short text only.
  - Every stat says what it counts, for whom, against what and when.
  - Use generic drug hashtags only: no #Zepbound, #PenDay, #GLP1Journey or #ColdAndFluSeason.
  - List the exact document each slide quotes. The Medication Guide and the IFU each get their own URL, separate from the PI.
  - Don't date the hook. End on the exact disclaimer plus prescriber line, and keep the don't-stop line on Threads.
  - (All 3 carousels had findings, latest C1 11-10.)

### Social Copywriter & packaging
- **YouTube descriptions: viewer copy only, and line 1 left empty for the ▶ Watch next link, on every long-form and Short.**
  - Never put an internal note in the field. L1 11-06 shipped a change note (major), and L1 10-28 had a publisher note inside.
  - Line 1 was filled in L1 11-02, S1 11-02, S1 11-05 and S2 11-06.
  - After line 1, in this order:
    1. A quick answer of 3 lines or fewer (ran over in 4 pieces).
    2. The safety block.
    3. 1–4 sources, never zero (S2 11-01 and S2 11-05 had none).
    4. Real chapters on long-forms, including the checklist section, or a clear slot for the publisher.
    5. Hashtags.
  - Stay at **1,250 characters or fewer before the link**. Trim the "What you'll learn" block and the source labels first. (5 long-forms over: L1 10-29, L1 11-01, L1 11-02, L1 11-09, L2 11-09.)
- **Scope the safety lines in descriptions and pinned comments as the script does.**
  - When the label says "stop and get help", keep "stop using tirzepatide" and give each emergency its own instruction:
    - pancreatitis → stop and call your healthcare provider
    - serious allergic reaction → stop and get medical help right away
  - Then add "For anything that isn't one of those emergency signs…" before the don't-stop line.
  - Pinned comments on side-effect posts also carry the don't-stop line word for word.
  - (2 long-forms: L1 and L2 11-09.)
- **Every caption field ends on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you.", copied character for character.**
  - Hashtags and the don't-stop line go before it (6 pieces, latest S1 11-09). Use a full stop, never a comma or em dash.
  - Side-effect, stopping and comparison posts keep the don't-switch/stop/change line word for word, including on Threads. Write "medicines", never "meds".
  - Threads stays at about 300 characters, safety lines counted. Write it last, from the shortest verified claim, and cut a clause, never a safety line. (Over in about 25 pieces, including all 4 on 11-10.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - That covers "on average", "all doses combined", "small trial", "open-label, company-funded", "not yet peer-reviewed", "post-marketing", "reports of", "the label says", the insulin/sulfonylurea low-blood-sugar caveat, "add a barrier method", the full trial population, and the clinician/kidney caveats.
  - Our own caveats go in their own sentence, never after a source tag. Never credit a label with a paraphrase it doesn't use.
  - (About 110 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - Keep "possible", "may" and "linked to" in the title (S1 11-10 dropped "possible").
  - The thumbnail never reuses the title's words and never has blank subtext.
  - Don't call data more than about 3 months old "new". No "Approved yet?" or "Approved Anywhere?"; use "what's confirmed?" instead.
  - (About 8 pieces.)
- **The first line carries the hedge, the scope and the population. Engagement lines ask people to save or share only.**
  - No open questions (S3 11-01, S1 11-09, S3 11-10).
  - Never promise content the post doesn't include (S3 11-06, S3 11-09).
  - No emoji on side-effect, safety or stopping posts.
  - (About 15 first lines without the hedge.)
- **Hashtag only the drugs whose own data the post reports, and use generic names.**
  - No brand tags such as #Zepbound, especially on an unapproved use.
  - No semaglutide tags on class studies.
  - No trend, seasonal, haul or community tags such as #guthealth, #MetabolicHealth, #WeightManagement or #GLP1Journey.
  - (About 10 pieces, latest S3 11-09 and C1 11-10.)

### Everyone
- **Give every result the exact drug scope and trial population it came from, everywhere.**
  - Class studies say "GLP-1 medicines" and never attach one drug's name (the grocery-cart study names no drugs).
  - A tirzepatide-only trial stays "tirzepatide", never "a GLP-1 medicine" (S2 11-10).
  - **Trial populations:**
    - No diabetes: SURMOUNT-1, SURMOUNT-4, SURMOUNT-5, STEP 1, ATTAIN-1 and the retatrutide obesity trials.
    - About 25% of ATTAIN-J had type 2 diabetes.
    - SURPASS-2: type 2 diabetes, open-label, against semaglutide 1 mg.
    - FLOW: type 2 diabetes with chronic kidney disease, eGFR 25–75.
    - SELECT: heart disease plus overweight or obesity, without diabetes.
    - Resistance-training RCT (S2 11-10): men and postmenopausal women aged 50–70 with overweight or obesity and no type 2 diabetes, compared with usual activity. Strength results are averages.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) vs 36 on placebo. The ~75%/25% split comes from Look et al. 2025.
  - **SURMOUNT-4:** 783 started the lead-in, then 335 vs 335 were randomized. The +14.0% is regain from week 36 to week 88. Placebo still ended 9.9% below starting weight on average.
  - **Pancreatitis review:** 11 participants across 5 trials.
  - **Hair loss:** 5.4% (119/2,183) vs 0.9% (22/2,221). The label gives 7.1% of women vs 0.5% of men on tirzepatide, and 1.3% vs 0% on placebo.
  - **Injection-site reactions (label):** give them per dose: 6% at 5 mg and 8% at 10 and 15 mg, vs about 2% on placebo. Never use one pooled figure (S3 11-09). Serious allergic reactions are post-marketing reports.
  - **Oral contraceptives:** the label says "may reduce the efficacy", for 4 weeks after starting and 4 weeks after each dose increase.
  - **Semaglutide:** name the dose being compared. Wegovy 7.2 mg was approved in March 2026.
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag: "smaller portions", "limit fluids", infection signs, pharmacist tips, "your local urgent care or emergency number".
  - Credit the body that actually says it:
    - The low-blood-sugar figure is in the Zepbound label, not NEJM.
    - "3+ times a week" strength training comes from the joint advisory; "2 days" is WHO's figure.
    - Name both NANOS *and* the AAO.
    - The July 2023 review was EMA PRAC's.
  - Only exact printed words go in quotation marks. Confirm IFU wording before you quote it ("can inject" vs "may inject").
  - (1 hold: L1 10-30. About 60 findings, latest L1 11-10 s44 and S1 11-10 s7.)
- **Keep the source list clean.**
  - Fetch every URL first. No 402, 403, 404 or login redirects (the Nature 303), and no newsroom, media-site, landing or DOI-redirect pages. Use the PubMed record for paywalled journals.
  - Copy each page's live "last revised" or "last reviewed" date. Known current dates:
    - Zepbound label: 28 Aug 2026
    - Mounjaro label: a 2026 revision
    - NHS tiredness pages: 2023
    - NHS diarrhoea pages: one page 01 May 2026, the other 21 Dec 2023
  - (About 20 findings, latest S2 11-10.)

_Updated 2026-11-10 from 50 QA records (all GLP-1, 10-28 to 11-10)._

_Updated 2026-11-10 from 50 QA records._
