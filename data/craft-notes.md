_Based on 51 QA records from 2026-10-28 to 2026-11-10: 33 Shorts, 15 long-forms and 3 carousels, all GLP-1. **5 didn't ship:** 4 were held, and 1 long-form (L1 10-30, hair loss) failed before render._

_**New since the last pass:** 1 record, L2 11-10 (dehydration on sick days). It passed the beat-sync gate and masking (0.006), but packaging came back REVISE:_
- _**Major:** the description never carried "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."_
- _The chapters block shipped placeholder "MM:SS" text._
- _One label source was missing its revision date._
- _Repeats of known visual problems: a starfield on a body beat, a floating blob head, tags clipped at the bottom edge ("Water", "Prescriber"), 20 tiny-text and 15 near-empty-shot findings._

_**Correction applied:** the "offset beat", "wrong content in this shot" and "disclaimer never appears" findings from the Visual Critic in records up to 11-09 were a QA bug (it saw frames out of order). They are not used as evidence here. This mainly affects L1 10-28, L1 11-02, L1 11-05 and the per-shot detail in L1 11-09. The two beat-sync holds (L1 11-09, L1 11-10) stay in, because the automatic gate measured that drift._

_Why items didn't ship: 2 for beat drift (L1 11-09, L1 11-10), 1 for audio (L1 10-29: masking 0.023, a dropped "point", and "rheumatoid" heard for retatrutide), 1 for a wrong count (S1 10-29: 5 pancreatitis cases instead of 11), and 1 for crediting a claim to a source that doesn't make it (L1 10-30)._

### Motion Designer
- **Long-forms: check beat sync on the render, not just on the plan.** In both holds the plan was clean (69/72 and 74/74 beats on time) and the drift came in at render.
  - Take every cut time from the final narration's word timestamps. Never reuse shot durations from the plan after a re-render or re-voice.
  - After render, measure every cut against its beat's start time. Fix any cut more than 0.5 s off before you submit.
  - The 10:00 L2 renders passed the gate on both days (11-09 and 11-10). If the L1 render path differs (settings, a re-voice, reused durations), look there first.
  - (2 holds, back to back, both 14:00 L1: 83% and 86% of cuts on time.)
- **Get every final mix to masking 0.02 or lower. Measure it last, after any re-render, and never pass a mix above 0.02, whatever the slot or deadline.**
  - The 13:00 Shorts were the worst: S2 11-01, 11-02, 11-05 and 11-06 shipped at 0.026–0.037.
  - The last 2 S2 mixes (11-09 at 0.020, 11-10 at 0.000) show the slot can be fixed. Reuse the 11-10 mix.
  - Duck the music under all narration. Keep sound effects off spoken numbers, names and codes.
  - (1 hold: L1 10-29. 4 Shorts shipped above 0.02.)
- **After the voice render, compare the speech-to-text transcript with the script, and regenerate any failing scene before you mix.**
  - Check every number phrase, "point", "about", unit and drug name.
  - Errors seen so far: "tears of petide", "rheumatoid", "or for glip ron", "one thousand three" for "thirteen", "mg" for "milligrams", a dropped "point" or "about", and an extra "the".
  - (1 hold. 8 pieces.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly ("126", "6.4", "1,032", "575", "2026", "9.5%", "15–20 g", "GLP-1", "MEN 2", "NK-1", "NAION").
  - Before render, search the captions for these and fix every one:
    - number words: HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY
    - spaced or hyphenated letter groups: "F D A", "M-T-C", "N K ONE"
    - phonetic spellings: "REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "NAY-ON"
  - (Wrong or split numbers on screen in about 11 Shorts, latest S1 11-10. Phonetic spellings caused 4 subtitle-mismatch flags.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first. Ghost text was left in S2 11-09 and S3 11-10.
  - Never split a word, number, code or trial name across cards or lines ("SEVENTY-/SIX", "GLP-/1", "B/12", "TYPE / TWO DIABETES").
  - Never end a card on:
    - a comma, dash, colon or ellipsis
    - THE or A
    - CAN, MAY, WON'T, NOT, DOESN'T or BEEN
    - a preposition, POINT, TYPE, YOUR or THEIR
    - a bare number
  - Keep a stat sentence on one card ("4 in 100 to 5 in 100 vs 2 in 100"). Give each list item its own card.
  - (Broken cards in nearly all 33 Shorts, including all 3 on 11-10.)
- **Shorts: keep every tag, chip and bubble above y 1150 on a 1920 frame and inside the side edges. Make all text at least ~40px.**
  - Show at most 2 tags at once. Drop any tag that repeats the caption or a chip.
  - The tags that collide most are body-part, arm and source tags ("Stomach", "Kidneys", "Blood sugar", "Placebo", "Tirzepatide", "Optic nerve", "Company report").
  - Put stat numbers on plain space, never over heads, clouds or windows ("445", "1,032", "15–20 g", "6–8 in 100").
  - Render every chip the shot list calls for. Chips were missing in 5 Shorts (S3 10-30, S1 11-01, S3 11-04, S3 11-06 and others).
  - (About 300 overlap findings, still 7–19 per Short on 11-10, plus 11 on-hero findings.)
- **Long-forms: keep the bottom of every tag at y 1000 or less on a 1080 frame, and make all text at least ~40px.**
  - Small labels keep rendering at 15–26px: "GLP-1", "Fat", "Once", "Temporary", "Belly/Thigh/Upper arm", "72 weeks", "3 days in", "Heartburn", "9 p.m.", "Tirzepatide".
  - Tags at the bottom of the frame keep clipping: "Sam, 49", "Stopped", "15 mg", "Stomach", "Water", "Prescriber".
  - (About 170 tiny-text and 160 off-screen findings in 14 rendered long-forms. L2 11-10 had 20 tiny and 8 off-screen.)
- **Fill every frame and delete every placeholder.**
  - From the first frame, every frame needs a headline plus a labelled hero covering at least ~25% of it. Document and label beats on a plain gradient are the usual empty ones (L2 11-10 shots 7, 13 and 14).
  - Delete empty or ghost bubbles, ghosted figures, cropped decorative shapes and debug marks (6 Shorts, latest S3 11-10).
  - The pantry/shelf backdrop stays banned, and that includes cabinet strips along the top and bottom (L1 11-10).
  - Match each backdrop to its beat's mood: night → night room, brand → teal gradient, clinic → clinic.
  - **Never use the starfield on a body beat** (5 pieces: S2 11-05, L1 11-09, S1 11-10, S2 11-10, L2 11-10).
  - (About 155 near-empty-shot findings in long-forms.)
- **Draw people as whole characters with a neck and shoulders, crowds included, and fit each mascot's mood to the line.**
  - No floating heads, faceless blobs, donuts, or disembodied eyes or bones (12 pieces, 9 of them long-forms; latest L2 11-09, L1 11-10, L2 11-10).
  - On risk, "not approved" and uncertainty lines, use a calm, neutral mascot:
    - no smiles, green checks or check-shields
    - no "Phew" or "Ahh, much better"
    - no sweating or crying faces
  - (About 6 mood mismatches.)

### Scriptwriters
- **Keep Shorts to 170 words or fewer, counting the status, safety, Exp F and closing lines.** Count them yourself; don't copy the count from the post note. (6 went over, up to 176. S3 11-10 was at 172 while its post note said 170.)
- **Write the ending lines exactly, and never speak a video title or say "on screen".**
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - Shorts end with "Full breakdown on our channel, link in the description."
  - On 08:00 and 13:00 Shorts, put the Exp F line just before it: "We answer one tirzepatide question from the research every day. Subscribe if that helps."
  - (S2 11-06 lost its closing line, and S3 11-06 had no Exp F line.)
- **Speak every safety line AND write it in full in the on-screen field, character for character.**
  - Order: the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - So far these lines were missing on screen in S3 11-04 and S3 11-05, had words dropped in S1 11-06, and were shortened in L2 11-09.
  - Where the label says *stop* and get help (a serious allergic reaction, pancreatitis), scope the don't-stop line: "For anything that isn't one of those emergency signs…". The emergency card names its trigger.
  - Retatrutide pieces add one plain line: it isn't approved, and online "research" products aren't the trial drug.
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence.
  - Pronunciation spellings go in the narration only.
  - Never use "this week", "new", "this flu season" or a holiday date in evergreen pieces (3 pieces).
  - Help lines cover all four markets, or say "your local urgent care or emergency number". NHS 111 alone (L1 11-06) and a skipped Lifeline (S1 11-01) both fail.
- **Check every count against the source's own unit (cases, participants or trials).**
  - Each number names its measure, drug and arm, comparator, group sizes and timeframe.
  - Say "average change in pain score", "separate trials, not head-to-head", and "counting everyone who started" or "if everyone stayed on treatment".
  - (1 hold: S1 10-29. About 35 findings.)
- **Keep each finding at its source's exact scope, verb and urgency, and that includes recaps.**
  - Observational studies are "linked to". Randomized results are "compared with placebo".
  - Keep the source's own words: "may" (never "can"), "tends to", "dose increases", "post-marketing", "severe or won't go away", "won't settle", "blurred or missing portions of vision".
  - Don't add "most", "many", "that's why", "similar" or rankings.
  - A recap or checklist must not drop a qualifier from the line it sums up (L2 11-10 s75 dropped "won't settle").
  - A hook must not promise anything the piece doesn't cover. A "MYTH" label needs evidence against the claim.
  - (1 hold: L1 10-30. About 48 findings.)
- **Run the muted-viewer test both ways, starting with the opening stat card.**
  - On-screen text is never stronger, broader or scarier than the narration, and everything on screen is also spoken.
  - Every stat card names the drug and dose, both groups, the population, the measure and the timeframe.
  - (About 45 findings, latest L1 11-10 s15 and S3 11-10 s3.)

### Carousel Designer
- **Carousels stay stopped (they reach 0–4 people). If the scheduler asks for one:**
  - Reuse verified Short text only.
  - Every stat says what it counts, for whom, against what and when.
  - Generic drug hashtags only: no #Zepbound, #PenDay, #GLP1Journey or #ColdAndFluSeason.
  - List the exact document each slide quotes. The Medication Guide and the IFU each get their own URL, separate from the PI.
  - Don't date the hook. End on the exact disclaimer plus prescriber line.
  - (All 3 carousels had findings.)

### Social Copywriter & packaging
- **YouTube descriptions: viewer copy only, with line 1 left empty for the ▶ Watch next link.** Then, in this order:
  1. A quick answer of 3 lines or fewer.
  2. The safety block, **ending on the exact "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."** (L2 11-10 left it out entirely; major.)
  3. 1–4 sources, never zero.
  4. Chapters.
  5. Hashtags.
  - Never put an internal note in the field (L1 11-06 was major, and L1 10-28 had one too). Line 1 was filled in 4 pieces.
  - (Description-order findings in about 12 pieces.)
- **Never ship placeholder chapters.**
  - No "MM:SS" or blank timestamps (L2 11-10).
  - Write real timestamps from the final narration timings: start at 00:00, give at least 3, and include the checklist and when-to-get-help sections (the checklist was missing in L2 10-30).
  - If the timings aren't final, leave the chapter block out and flag it in the post notes.
- **Stay at 1,250 characters or fewer before the link.** Trim the "What you'll learn" block and the source labels first. (5 long-forms over, latest L1 and L2 11-09.)
- **Scope the safety lines in descriptions and pinned comments as the script does.**
  - When the label says "stop and get help", give each emergency its own instruction:
    - pancreatitis → stop and call your healthcare provider
    - serious allergic reaction → stop and get medical help right away
  - Then write "For anything that isn't one of those emergency signs…" before the don't-stop line.
  - Pinned comments on side-effect posts carry the don't-stop line word for word.
  - (2 long-forms.)
- **Every caption field ends on the exact disclaimer plus prescriber line, with a full stop and nothing after it.**
  - Hashtags and the don't-stop line go before it (7 pieces, including the L2 11-10 description).
  - Side-effect, stopping and comparison posts keep the don't-switch/stop/change line word for word, Threads included. Write "medicines", never "meds".
  - Threads stays at about 300 characters, safety lines counted. Write it last and cut a clause, never a safety line. (About 25 pieces over.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - That includes "on average", "all doses combined", "small trial", "open-label, company-funded", "not yet peer-reviewed", "post-marketing", "reports of", "the label says", the insulin/sulfonylurea caveat, "add a barrier method", the full trial population, and the clinician/kidney caveats.
  - Our own caveats get their own sentence, never after a source tag.
  - (About 110 findings, in every batch.)
- **Titles and thumbnails keep the video's hedge and its exact product, population and status.**
  - Keep "possible", "may" and "linked to" (S1 11-10 dropped "possible").
  - The thumbnail never reuses the title's words and never has blank subtext.
  - Don't call data older than about 3 months "new". No "Approved yet?" or "Approved Anywhere?" titles.
  - (About 8 pieces.)
- **The first line carries the hedge, the scope and the population. Engagement lines ask people to save or share only.**
  - No open questions (4 pieces, latest S3 11-10).
  - Never promise content the post doesn't include.
  - No emoji on side-effect, safety or stopping posts.
  - (About 15 first lines without the hedge.)
- **Hashtag only the drugs whose own data the post reports, and use generic names.**
  - No brand tags (#Zepbound) and no semaglutide tags on class studies.
  - No trend or community tags (#guthealth, #MetabolicHealth, #WeightManagement, #GLP1Journey).
  - (About 10 pieces.)

### Everyone
- **Give every result the exact drug scope and trial population it came from.**
  - Class studies say "GLP-1 medicines". A tirzepatide-only trial stays "tirzepatide" (S2 11-10).
  - **Populations:**
    - No diabetes: SURMOUNT-1, SURMOUNT-4, SURMOUNT-5, STEP 1, ATTAIN-1 and the retatrutide obesity trials.
    - About 25% of ATTAIN-J had type 2 diabetes.
    - SURPASS-2: type 2 diabetes, open-label, against semaglutide 1 mg.
    - FLOW: type 2 diabetes with chronic kidney disease, eGFR 25–75.
    - SELECT: heart disease plus overweight or obesity, without diabetes.
    - Zepbound label pooled data: Study 1 excluded type 2 diabetes, and Study 2 enrolled only people with it.
    - Resistance-training RCT: men and postmenopausal women aged 50–70 with overweight or obesity and no type 2 diabetes, compared with usual activity. Results are averages.
  - **SURMOUNT-1 body scan:** 124 on tirzepatide (all doses) vs 36 on placebo. The ~75%/25% split comes from Look et al. 2025.
  - **SURMOUNT-4:** 783 started the lead-in, then 335 vs 335 were randomized. The +14.0% is regain from week 36 to week 88. Placebo still ended 9.9% below starting weight on average.
  - **Pancreatitis review:** 11 participants across 5 trials.
  - **Hair loss:** 5.4% (119/2,183) vs 0.9% (22/2,221). The label gives 7.1% of women vs 0.5% of men on tirzepatide, and 1.3% vs 0% on placebo.
  - **Injection-site reactions:** give them per dose: 6% at 5 mg and 8% at 10 and 15 mg, vs about 2% on placebo. Serious allergic reactions are post-marketing reports.
  - **Oral contraceptives:** the label says "may reduce the efficacy", for 4 weeks after starting and 4 weeks after each dose increase.
  - **Semaglutide:** name the dose being compared. Wegovy 7.2 mg was approved in March 2026.
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag ("smaller portions", "limit fluids", infection signs, pharmacist tips, "your local urgent care or emergency number").
  - Credit the body that actually says it:
    - The low-blood-sugar figure is in the Zepbound label.
    - "3+ times a week" strength training comes from the joint advisory; "2 days" is WHO's figure.
    - Name both NANOS and the AAO.
    - The July 2023 review was EMA PRAC's.
    - Keep the NHS's own grouping: "more at risk" isn't "more likely" (L2 11-10).
  - Only exact printed words go in quotation marks.
  - (1 hold: L1 10-30. About 62 findings.)
- **Keep the source list clean.**
  - Fetch every URL first. No 402, 403, 404 or login redirects, and no newsroom, media-site, landing or DOI-redirect pages. Use the PubMed record for paywalled journals.
  - Every entry carries its live "last revised" or "last reviewed" date, labels included (one was missing in L2 11-10). Known current dates:
    - Zepbound label: 28 Aug 2026
    - Mounjaro label: a 2026 revision
    - NHS tiredness pages: 2023
    - NHS diarrhoea pages: 01 May 2026 and 21 Dec 2023
  - (About 21 findings.)

_Updated 2026-11-10 from 51 QA records (all GLP-1, 10-28 to 11-10)._

_Updated 2026-11-10 from 51 QA records._
