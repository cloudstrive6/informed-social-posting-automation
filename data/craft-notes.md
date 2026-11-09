_Based on 51 QA records from 2026-10-27 to 2026-11-09: 33 Shorts, 15 long-forms and 3 carousels, all GLP-1. **5 didn't ship:** 4 were held, and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 1 record, L2 11-09 (tirzepatide diarrhea, long-form). It shipped. Its masking was 0.015, and it had no beat-sync blocker. It repeated six known problems:_
- _floating-head characters_
- _32 off-screen tags, including a clipped "15 mg"_
- _a shortened prescriber line on screen_
- _source tags on our own tips_
- _out-of-date "last reviewed" dates_
- _a description of about 1,400 characters_

_It also gave a **second case of an unscoped don't-stop line in packaging**. The description and pinned comment put "don't stop" right after the label's "stop and get help" instruction, with no scope, as L1 11-09 also did. That's now a packaging rule._

_**Correction still applies:** the "offset beat" and "wrong content in this shot" findings on long-forms up to 11-06 were a QA bug. The frames were shown out of order. The published videos are in sync, and the disclaimer was on screen. Those findings, and the visual scores and weak-shot counts that came with them, aren't used as evidence here. The **L1 11-09 hold is a separate case.** The automatic beat-sync gate measured that drift, so it's real._

_Why items didn't ship:_
- _2 for audio: masking over 0.02, plus spoken numbers or drug names lost (L1 10-27, L1 10-29)._
- _1 for a wrong count: 5 pancreatitis cases instead of 11 (S1 10-29)._
- _1 for crediting a claim to a source that doesn't make it (L1 10-30)._
- _1 for beat drift caught by the gate (L1 11-09)._

### Motion Designer
- **Long-forms: each shot shows only its own beat's on-screen text, cut at that beat's start time from the final narration.** Before render, diff the shot → beat → text list against the script. L1 11-09 was held because s23, s51 and s67 showed text from s64, s58 and s57, and only 83% of cuts landed on time. (1 hold.)
- **Get every final mix to masking 0.02 or lower. Measure it last, after any re-render, and never pass a mix above 0.02, whatever the slot or deadline.**
  - The 13:00 Shorts drift worst: S2 10-27, 11-01, 11-02, 11-05 and 11-06 shipped at 0.026–0.037. S2 11-09 was right at 0.020.
  - Copy the settings that worked: the S3 Shorts at 0.000 and the long-forms at 0.002–0.015.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - (2 holds. 5 Shorts shipped above 0.02.)
- **After the voice render, compare the speech-to-text transcript with the script. Regenerate any scene that fails before you mix.** Check every number phrase, "point", "about", unit and drug name.
  - Seen so far: "tears of petide", "rheumatoid", "or for glip ron", silence in place of "10 or 15 mg", "one thousand three" for "thirteen", "mg" for "milligrams", and a dropped "point" or "about".
  - (2 holds. About 9 pieces.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly ("1,879", "575", "2026", "9.5%", "15–20 g", "GLP-1", "MEN 2", "NK-1", "NAION", "BMI").
  - Before render, search the captions and fix every:
    - number word: HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY
    - spaced or hyphenated letter group: "F D A", "G F R", "M-T-C"
    - phonetic spelling: "REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "NAY-ON"
  - (Wrong or dropped numbers on screen in about 10 Shorts, latest S2 11-09 with "HUNDRED TWENTY-SEVEN" and "ONE THOUSAND SIX". Phonetic spellings caused 4 subtitle-mismatch flags and appeared on screen 3 more times.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles before the next card appears.
  - Never split a word, number, code or trial name across cards or lines ("SEVENTY-/SIX", "GLP-/1", "B/12", "SURMOUNT / ONE").
  - Never end a card on:
    - a comma, dash, colon or ellipsis
    - THE or A
    - CAN, MAY, WON'T, NOT, DOESN'T or BEEN
    - a preposition, POINT, TYPE, YOUR or THEIR
    - a bare number
  - Give each list item its own card.
  - (Broken cards in nearly all 33 Shorts, including all 3 on 11-09.)
- **Shorts: keep every tag, chip and bubble above y 1150 on a 1920 frame and inside the side edges. Make all text at least ~40px.**
  - Show at most 2 tags at once, and drop any tag that repeats the caption.
  - Body-part, arm and source tags collide most: "Stomach", "Kidneys", "Blood sugar", "Placebo", "Tirzepatide", "Retina", "Company report".
  - Put stat numbers on plain space, never over heads, clouds or windows ("445", "1,032", "15–20 g", "6–8 in 100").
  - Render every chip the shot list calls for. Chips were missing in S3 10-30, S1 11-01, S3 11-04 and S3 11-06.
  - (About 300 overlap findings and about 12 on-hero findings. Still 12–16 per Short on 11-09.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.**
  - Small labels keep rendering at 15–26px: "GLP-1", "GIP", "Fat", "Once", "Temporary", "Belly/Thigh/Upper arm", "72 weeks", "Injection spot", "3 days in", "Food".
  - Name, state and dose tags clip at the bottom of the frame: "Sam, 49", "Stopped", "Stayed on", "Prescriber", "15 mg".
  - (About 175 tiny-text and 190 off-screen findings in 14 rendered long-forms. On 11-09, L1 had 35 tiny-text findings and L2 had 32 off-screen findings.)
- **Fill every frame and delete every placeholder.**
  - From the first frame, every frame needs a headline plus a labelled hero covering at least ~25% of it.
  - Delete empty or ghost bubbles, ghosted figures, cropped decorative shapes and debug marks (S3 11-04, S3 11-06, S2 11-09).
  - The pantry/shelf backdrop stays banned. It has been clean since 11-02.
  - Match each beat's mood backdrop: night → night room, brand → teal gradient, body → not the starfield (L1 11-09, S2 11-05).
  - (About 165 near-empty-shot findings in long-forms, including 17 in L1 11-09 and 9 in L2 11-09.)
- **Draw people as whole characters, with a neck and shoulders, crowds included. Fit each mascot's mood and icon to the line.**
  - No floating or hanging heads, faceless blobs, donuts, or disembodied eyes or bones.
  - Floating heads appeared in 10 pieces, most recently L2 11-09: Jo and the "1 in 5" crowd.
  - On risk, "not approved" and uncertainty lines, use a calm, neutral mascot:
    - no smiles, green checks or check-shields
    - no "Phew" or "Ahh, much better"
    - no sweating or crying faces
  - (About 7 mood mismatches, including S1 11-01, S1 11-05 and S2 11-06.)

### Scriptwriters
- **Write the ending lines exactly, and never speak a video title or say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - Every Short ends with "Full breakdown on our channel, link in the description."
  - 08:00 and 13:00 Shorts put the Exp F line just before that: "We answer one tirzepatide question from the research every day. Subscribe if that helps."
  - (2 pieces: S3 11-06 was missing the Exp F line, and S2 11-06 lost its closing line.)
- **Speak every safety line AND write it in full in the on-screen field.**
  - Order: the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - Write the on-screen versions character for character, never shortened (L2 11-09 shortened the prescriber line).
  - The lines were spoken but never shown in S3 11-04 and S3 11-05. S1 11-06 dropped "stomach" and "right away" on screen.
  - Where the label says to *stop* and get help (a serious allergic reaction, pancreatitis), scope the don't-stop line: "For anything that isn't one of those emergency signs…"
  - Retatrutide pieces add one plain line: it isn't approved, and online "research" products aren't the trial drug.
- **Keep Shorts to 170 words or fewer, counting the status, safety, Exp F and closing lines.** (6 went over, up to 186. Latest: S3 11-06 and S1 11-09.)
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence.
  - Put pronunciation spellings in the narration only.
  - Never use "this week", "new", "this flu season" or a holiday date in evergreen pieces (S2 11-04, C1 11-06, L2 10-29).
  - Help lines cover all four markets, or say "your local urgent care or emergency number". NHS 111 alone (L1 11-06) and a skipped Lifeline (S1 11-01) both fail.
- **Check every count against the source's own unit (cases, participants or trials).**
  - Each number names its measure, drug and arm, comparator, group sizes and timeframe.
  - Say "average change in pain score", never a bare "75.8%".
  - Say "separate trials, not head-to-head" for cross-trial comparisons.
  - Never say "estimand". Say "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29 said 5 cases instead of 11. About 40 findings.)
- **Keep each finding at its source's exact scope, verb and urgency.**
  - Observational studies are "linked to"; randomized results are "compared with placebo".
  - Keep the source's own words: "may" (never "can"), "tends to", "dose increases", "that does not go away", "post-marketing", "severe or won't go away".
  - Don't add "most", "many", "that's why", "similar" or rankings. Keep "overactive thyroid" specific.
  - A hook must not promise anything the piece doesn't cover.
  - A "MYTH" label needs evidence against the claim, not just an absence of studies.
  - (1 hold: L1 10-30. About 45 findings.)
- **Run the muted-viewer test both ways.**
  - On-screen text is never stronger, broader or scarier than the narration, and everything on screen is also spoken.
  - Every caption field and stat card names the drug and dose, both groups, the population, the measure and the timeframe, including the opening stat card.
  - (About 47 findings, including 3 on 11-09.)

### Carousel Designer
- **Carousels stay stopped (they reach 0–4 people). If the scheduler asks for one:**
  - Reuse verified Short text only.
  - Every stat says what it counts, for whom, against what and when.
  - Hashtag only the drugs whose own data the post reports. No #Osteoporosis or #ColdAndFluSeason.
  - Don't date the hook. End on the exact disclaimer plus prescriber line, and keep the don't-stop line on Threads.
  - (All 3 carousels in this window had findings.)

### Social Copywriter & packaging
- **YouTube descriptions: viewer copy only, and line 1 left empty for the ▶ Watch next link, on every long-form and Short.**
  - Never put an internal note in the field. L1 11-06 shipped a change note (major), and L1 10-28 had a publisher note inside.
  - Line 1 was filled in L1 10-28, L1 11-02, S1 11-02, S1 11-05 and S2 11-06.
  - After line 1, in this order:
    1. A quick answer of 3 lines or fewer that names one specific side effect. It ran over in 5 pieces.
    2. The safety block.
    3. 1–4 sources, never zero. S2 11-01 and S2 11-05 had none.
    4. Real chapters on long-forms, or a clear slot for the publisher.
    5. Hashtags.
  - Stay at **1,250 characters or fewer before the link**. L1 10-27 got cut off mid-word and lost its sources and hashtags. Trim the "What you'll learn" block and the source labels first. (6 long-forms over, latest L1 and L2 11-09.)
- **Scope the safety lines in descriptions and pinned comments as the script does.**
  - When the label says "stop and get help", keep "stop using tirzepatide" and give each emergency its own instruction:
    - pancreatitis → stop and call your healthcare provider
    - serious allergic reaction → stop and get medical help right away
  - Then add "For anything that isn't one of those emergency signs…" before the don't-stop line.
  - Pinned comments on side-effect posts also carry the don't-stop line word for word.
  - (2 long-forms: L1 and L2 11-09.)
- **Every caption field ends on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you.", copied character for character.**
  - Put hashtags and the don't-stop line before it (7+ pieces, latest S1 11-09). Use a full stop, never a comma or em dash.
  - Side-effect, stopping and comparison posts keep the don't-switch/stop/change line word for word, including on Threads (missing in 3 pieces). Write "medicines", never "meds" (3 pieces).
  - Threads stays at about 300 characters, safety lines counted. Cut a clause, never a safety line. (It ran over in nearly every piece.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - That covers:
    - "on average", "all doses combined", "small trial"
    - "open-label, company-funded", "not yet peer-reviewed", "post-marketing", "reports of"
    - the insulin/sulfonylurea low-blood-sugar caveat and "add a barrier method"
    - the full trial population and the clinician/kidney caveats
  - Our own caveats go in their own sentence, never after a source tag.
  - Never credit a label with a paraphrase it doesn't use.
  - (About 125 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - The thumbnail never reuses the title's words and never has blank subtext.
  - Don't call data more than about 3 months old "new".
  - No "Approved yet?" or "Approved Anywhere?". Use "what's confirmed?" instead.
  - (About 8 pieces.)
- **The first line carries the hedge, the scope and the population.**
  - Engagement lines ask people to save or share only. No open questions (S3 11-01, S1 11-09).
  - Never promise content the post doesn't include (S3 11-06, S3 11-09).
  - No emoji on side-effect, safety or stopping posts.
  - (About 15 first lines without the hedge.)
- **Hashtag only the drugs whose own data the post reports, and use generic names.**
  - No brand tag for an unapproved use, such as #Zepbound on prediabetes.
  - No semaglutide tags on class studies.
  - No trend, seasonal, haul or awareness tags such as #guthealth, #ColdAndFluSeason or #MetabolicHealth.
  - (About 10 pieces, latest S3 11-09.)

### Everyone
- **State the trial population and the exact arm everywhere.**
  - **Class studies:** say "GLP-1 medicines" and never attach one drug's name. The grocery-cart study names no drugs.
  - **Trial populations:**
    - No diabetes: SURMOUNT-1, SURMOUNT-4, SURMOUNT-5, STEP 1, ATTAIN-1 and the retatrutide obesity trials.
    - TRIUMPH-2 is the type 2 diabetes trial. About 25% of ATTAIN-J had type 2 diabetes.
    - SURPASS-2: type 2 diabetes, open-label, against semaglutide 1 mg.
    - FLOW: type 2 diabetes with chronic kidney disease, eGFR 25–75.
    - SELECT: heart disease plus overweight or obesity, without diabetes.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) vs 36 on placebo. The ~75%/25% split comes from Look et al. 2025.
  - **SURMOUNT-4:** 783 started the lead-in, then 335 vs 335 were randomized. The +14.0% is regain from week 36 to week 88. Placebo still ended 9.9% below starting weight on average.
  - **Pancreatitis review:** 11 participants across 5 trials.
  - **Hair loss:** 5.4% (119/2,183) vs 0.9% (22/2,221). The label gives 7.1% of women vs 0.5% of men on tirzepatide, and 1.3% vs 0% on placebo. Say "particularly associated with".
  - **Injection-site reactions (label):** give them per dose: 6% at 5 mg and 8% at 10 and 15 mg, vs about 2% on placebo. Never use one pooled figure. Serious allergic reactions are post-marketing reports.
  - **Oral contraceptives:** the label says "may reduce the efficacy", for 4 weeks after starting and 4 weeks after each dose increase.
  - **Semaglutide:** name the dose being compared. Wegovy 7.2 mg was approved in March 2026.
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips and safety lines get no tag ("smaller portions", "limit fluids", infection signs, "can't keep fluids down" unless the NHS is credited).
  - Credit the body that actually says it:
    - The low-blood-sugar figure is in the Zepbound label, not NEJM.
    - "3+ times a week" strength training comes from the joint advisory; "2 days" is WHO's figure.
    - Name both NANOS *and* the AAO.
    - The July 2023 review was EMA PRAC's.
  - Only exact printed words go in quotation marks.
  - (1 hold: L1 10-30. About 62 findings, latest L2 11-09.)
- **Keep the source list clean.**
  - Fetch every URL first. No 402s, 403s or 404s, and no newsroom, media-site, landing or DOI-redirect pages. Use the PubMed record for paywalled journals.
  - Copy each page's live "last revised" or "last reviewed" date. Known current dates:
    - Zepbound label: 28 Aug 2026
    - Mounjaro label: a 2026 revision
    - NHS tiredness pages: 2023
    - NHS diarrhoea pages (L2 11-09): one page 01 May 2026, the other 21 Dec 2023
  - (About 22 findings.)

_Updated 2026-11-09 from 51 QA records (all GLP-1, 10-27 to 11-09)._

_Updated 2026-11-09 from 51 QA records._
