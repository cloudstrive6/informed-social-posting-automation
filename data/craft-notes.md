_Based on 51 QA records from 2026-10-29 to 2026-11-11: 33 Shorts, 15 long-forms and 3 carousels, all on GLP-1. **7 didn't ship:** 6 were held, and 1 long-form (L1 10-30) failed before render._

_**New since the last pass:** 4 records from 11-11. 2 were held: L1 (orforglipron) and S2 (orforglipron and sleep apnea). S1 shipped at masking 0.028. Problems that repeated: a mix over 0.02, a transcript mismatch, a broken description, the starfield on a body beat, floating heads and cabinet strips._

_**Why items didn't ship:**_
- _**Audio, 3 holds:** L1 10-29 at 0.023, with a dropped "point" and "rheumatoid" heard for retatrutide. L1 11-11 at 0.022, with "of the day" spoken in place of a script line and a description cut off mid-word. S2 11-11 at 0.061._
- _**Beat drift on render, 2 holds:** L1 11-09 and L1 11-10._
- _**Wrong count, 1 hold:** S1 10-29._
- _**Credit to a source that doesn't say it, 1 failure:** L1 10-30._

_**Correction applied:** the Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09 were a QA bug. The frames were out of order, and the published videos were in sync. Those findings are not used as evidence here. Beat timing is now checked by the automatic beat-sync gate, and only the 2 gate holds count._

_**Out of date:** the Shorts limit is now **160 spoken words**. Ignore any older note or hold reason that says 170 words or 90 s._

### Motion Designer
- **Measure masking last, on the final file, and never hand off a mix above 0.02 in any slot.** This is now the #1 hold cause.
  - 3 holds: L1 10-29 at 0.023, L1 11-11 at 0.022, S2 11-11 at 0.061. 5 more shipped above 0.02: S2 on 11-01, 11-02, 11-05 and 11-06 (0.026–0.037), and S1 11-11 (0.028).
  - The gate let 0.028 through on 11-11, so take your own reading.
  - Duck the music under all narration. Keep sound effects off spoken numbers, names and codes. If you re-render, re-measure.
- **After the voice render, run the speech-to-text transcript against the script and regenerate any scene that fails before you mix.**
  - Check every number phrase, "point", "about", unit and drug name. Also look for words the script doesn't have.
  - Errors seen so far: "of the day" in place of a tip line (L1 11-11), "tears of petide", "rheumatoid", "or for glip ron", "one thousand three" for "thirteen", "mg" for "milligrams", a dropped "point" or "about", and an extra "the".
  - (2 holds. 9 pieces.)
- **Long-forms: check beat sync on the render, not just on the plan.** In both holds the plan was clean (69/72 and 74/74 beats on time) and the drift came in at render.
  - Take every cut time from the final narration's word timestamps. Never reuse shot durations from the plan after a re-render or re-voice.
  - After render, fix any cut more than 0.5 s off its beat before you submit.
  - (2 holds, L1 11-09 and 11-10, with 83% and 86% of cuts on time. L1 11-11 passed.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers, years and codes must match the stat pill exactly ("126", "6.4", "1,032", "575", "2026", "9.5%", "15–20 g", "GLP-1", "MEN 2", "NAION").
  - Before render, search the captions for these and fix every one:
    - number words: HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY
    - spaced or hyphenated letter groups: "F D A", "M-T-C"
    - phonetic spellings: "REH-TAH-TROO-TIDE", "DEG-LOO-DEK", "NAY-ON"
  - (Wrong or split numbers on screen in about 12 Shorts, latest S1 11-10. Phonetic spellings caused 4 subtitle-mismatch flags.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, its tags and its bubbles first. Ghost text was left in S2 11-09, S3 11-10 and S3 11-11.
  - Never split a word, number, code or trial name across cards or lines ("SEVENTY-/SIX", "GLP-/1", "B/12", "TYPE / TWO DIABETES").
  - Never end a card on:
    - a comma, dash, colon or ellipsis
    - THE, A, CAN, MAY, WON'T, NOT, DOESN'T or BEEN
    - a preposition, POINT, TYPE, YOUR or THEIR
    - a bare number
  - Keep a stat sentence on one card. Give each list item its own card.
  - (Broken cards in nearly every Short, including S1 11-11: "DIARRHEA:", "DOSES —", "DIZZY,".)
- **Keep every tag inside the frame, off the caption and at least ~40px.**
  - **Shorts (1920 frame):** keep every tag, chip and bubble above y 1150. Show at most 2 tags at once, and drop any tag that repeats the caption. Body-part and source tags collide most ("Stomach", "Kidneys", "Blood sugar", "Pancreas", "Placebo"). Put stat numbers on plain space, never over heads. Render every chip the shot list calls for (missing in 6 Shorts).
  - **Long-forms (1080 frame):** keep the bottom of every tag at y 1000 or less. Labels keep rendering at 22–26px ("Tell prescriber", "Tirzepatide", "9 p.m.", "Heartburn"). Bottom tags keep clipping ("Orforglipron", "Any time (Lilly)", "Water", "Prescriber", "15 mg").
  - (About 300 overlap findings in Shorts. About 180 tiny-text and 170 off-screen findings in long-forms. L1 11-11 had 12 tiny and 7 off-screen.)
- **Fill every frame and delete every placeholder.**
  - Every frame needs a headline plus a labelled hero covering at least ~25% of it. Document and label beats on a plain gradient are the usual empty ones (about 165 near-empty findings in long-forms, 10 in L1 11-11).
  - The pantry/shelf backdrop stays banned, and that includes the rounded cabinet strips and the dashed boxes along the top and bottom (L1 11-10, L1 11-11, S1 11-11).
  - **Never use the starfield on a body beat** (6 pieces, latest S3 11-11).
  - Match each backdrop to its beat's mood: night → night room, brand → teal gradient, clinic → clinic.
  - Delete ghost bubbles, cropped decorative shapes and debug marks.
- **Draw people as whole characters with a neck and shoulders, and keep each named character the same all the way through.**
  - No floating heads, blobs or donuts (about 14 pieces, latest L1 11-11 and S3 11-11).
  - In L1 11-11, Dana's skin and hair changed between shots.
- **Make the mascot and its bubble agree with the line.**
  - On risk, "not approved" and caveat lines, use a calm, neutral mascot: no smiles, green checks, "Phew", sweating or crying.
  - Never show a bubble that contradicts the caption. S2 11-11 showed "Not for sleep apnea yet" next to "APPROVED FOR SLEEP APNEA".
  - (About 7 pieces, latest S1 11-11.)

### Scriptwriters
- **Shorts: stay inside the task's length arm, and never go over 160 spoken words.**
  - The arms are tight (90–120 words) and standard (135–160). Count the safety, Exp F and closing lines.
  - Count the words yourself. Never copy the count from the post note (S3 11-10 said 170 and was really 172).
  - 4 Shorts went over even the old 170 limit.
  - End with "Full breakdown on our channel, link in the description." Until Exp F ends on 11-17, 08:00 and 13:00 Shorts put "We answer one tirzepatide question from the research every day. Subscribe if that helps." just before it.
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - (Ending lines were missing in S2 11-06 and S3 11-06.)
- **Speak every safety line AND write it in full in the on-screen field, character for character.**
  - Order: the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - When the label says to stop and get help, the emergency card names its trigger and keeps "right away". Example: possible pancreatitis → stop and call your healthcare provider right away. "Right away" was dropped in S1 11-11, and the trigger wasn't named in S3 11-11. Then scope the don't-stop line: "For anything that isn't one of those emergency signs…".
  - Unapproved drugs and uses: say it "isn't approved" with no "yet", because filing isn't approval (S2 11-11). Retatrutide pieces add that online "research" products aren't the trial drug.
  - (Safety lines were missing on screen or shortened in 5 pieces.)
- **Write the narration exactly as it should be spoken.**
  - Write numbers as words, spell out units, and give each decimal its own short sentence.
  - Pronunciation spellings go in the narration only.
  - Never use "this week", "new", "this flu season" or holiday dates in evergreen pieces.
  - Help lines cover all four markets, or say "your local urgent care or emergency number".
- **Check every count against the source's own unit: cases, participants or trials.**
  - Each number names its measure, drug and arm, comparator, group sizes and timeframe.
  - Give dose ranges as ranges across doses, not as one result ("18–21" in S2 11-11).
  - (1 hold: S1 10-29. About 38 findings.)
- **Keep each finding at its source's exact scope, verb and urgency, and that includes recaps.**
  - Observational studies are "linked to". Randomized results are "compared with placebo".
  - Keep the source's own words: "may", "potential", "rare", "post-marketing", "won't settle", "blurred or missing portions of vision".
  - Don't add "most", "many", "that's why" or "similar".
  - A recap must not drop a qualifier from the line it sums up.
  - (1 failure: L1 10-30. About 50 findings, latest L1 11-11 s59, where "potential" and "rare" were dropped.)
- **Run the muted-viewer test both ways, starting with the opening card.**
  - On-screen text is never stronger or scarier than the narration, and every reason given in the narration also appears on screen.
  - Every stat card names the drug and dose, both groups, the population and the timeframe.
  - (About 48 findings, including all 3 shipped 11-11 Shorts.)

### Carousel Designer
- **Carousels stay stopped. If the scheduler asks for one:**
  - Reuse verified Short text only.
  - Generic drug hashtags only: no #Zepbound, #PenDay, #GLP1Journey or #ColdAndFluSeason.
  - Don't date the hook. End on the exact disclaimer plus prescriber line.
  - (All 3 carousels had findings.)

### Social Copywriter & packaging
- **YouTube descriptions are viewer copy only, 1,250 characters or fewer before the link, and finished.**
  - Line 1 stays empty for the ▶ Watch next link. Then, in this order: a quick answer of 3 lines or fewer, the safety block, 1–4 sources, chapters, hashtags.
  - Never put an internal note in the field (L1 11-06 was major).
  - Trim the "What you'll learn" block and the source labels first. 5 long-forms were over the limit.
- **Never hand off a broken or partial description. This contributed to a hold.**
  - Before you submit, re-read the whole field to its last character.
  - Chapters: one per script section, starting at 00:00, with real timestamps from the final narration, including the checklist and when-to-get-help sections. No "MM:SS". If the timings aren't final, leave the chapter block out and flag it in the post notes.
  - (L1 11-11 was cut off mid-word with chapters stopping at section 3 of 9, and was held. L2 11-10 had placeholder chapters.)
- **Every caption field and description ends on the exact "Not personal advice. Talk to your doctor or prescriber about whether it's right for you." Nothing comes after it.**
  - Hashtags and the don't-stop line go before it.
  - Copy the safety lines and pinned-comment lines from the script word for word, with the emergency scoping and "right away".
  - Write "medicines", never "meds". Never paraphrase the don't-stop line as "Otherwise, …".
  - (L2 11-10 left the disclaimer out entirely, major. Pinned-comment or scoping findings in 4 long-forms. S1 11-11 Threads paraphrased the don't-stop line.)
- **Threads stays at about 300 characters, safety lines counted.** Write it last, and cut a clause, never a safety line. (About 28 over.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.**
  - This includes "on average", "all doses combined", "small trial", "not yet peer-reviewed", "post-marketing", "with or without vomiting", "the label says", the insulin/sulfonylurea caveat and the full trial population.
  - Our own caveats get their own sentence, never after a source tag.
  - (About 115 findings, in every batch.)
- **Titles, thumbnails and first lines keep the hedge, scope and population.**
  - Keep "possible", "may" and "linked to".
  - The thumbnail never reuses the title's words.
  - Don't call data older than ~3 months "new". No "Approved yet?" or "Approved Anywhere?" titles.
  - Engagement lines ask people to save or share only, never an open question. No emoji on side-effect posts.
  - (About 25 pieces.)
- **Hashtag only the drugs whose own data the post reports, with generic names.** No brand tags, and no trend tags (#guthealth, #MetabolicHealth, #WeightManagement, #GLP1Journey). (About 10 pieces.)

### Everyone
- **Give every result the exact drug scope and trial population it came from.**
  - Class studies say "GLP-1 medicines". Tirzepatide-only trials stay "tirzepatide".
  - **Populations:**
    - No diabetes: SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1 and the retatrutide obesity trials.
    - About 25% of ATTAIN-J had type 2 diabetes.
    - SURPASS-2: type 2 diabetes, open-label, against semaglutide 1 mg.
    - FLOW: type 2 diabetes with chronic kidney disease, eGFR 25–75.
    - SELECT: heart disease plus overweight or obesity, without diabetes.
    - Zepbound pooled data: Study 1 excluded type 2 diabetes, and Study 2 enrolled only people with it.
    - Resistance-training RCT: men and postmenopausal women aged 50–70, with overweight or obesity and no type 2 diabetes, against usual activity. Results are averages.
  - **Key numbers:**
    - SURMOUNT-4: 335 vs 335 randomized. +14.0% regain from week 36 to 88, and placebo still ended 9.9% below starting weight on average.
    - Pancreatitis review: 11 participants across 5 trials.
    - Hair loss: 5.4% vs 0.9%. By sex, 7.1% of women vs 0.5% of men on tirzepatide, and 1.3% vs 0% on placebo.
    - Injection-site reactions: 6% at 5 mg and 8% at 10 and 15 mg, vs about 2% on placebo. Serious allergic reactions are post-marketing reports.
    - Oral contraceptives: the label says "may reduce the efficacy" for 4 weeks after starting and after each dose increase.
    - Semaglutide: name the dose being compared. Wegovy 7.2 mg was approved in March 2026.
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag.
  - Only exact printed words go in quotes.
  - Credit the body that actually says it:
    - The low-blood-sugar figure is in the Zepbound label.
    - The July 2023 review was EMA PRAC's.
    - Name both NANOS and the AAO.
    - The NHS's "more at risk" isn't "more likely".
  - (1 failure: L1 10-30. About 65 findings.)
- **Keep the source list clean.**
  - Fetch every URL first. No 402, 403, 404 or login redirects, and no newsroom, search-query or DOI-redirect pages. Use the PubMed record for paywalled journals.
  - The Medication Guide and the IFU each get their own URL, separate from the PI (C1 11-10, S1 11-11, S3 11-11).
  - Every entry carries its live revised or reviewed date, never just a year (L2 11-10, L1 11-11). Known dates:
    - Zepbound PI: 28 Aug 2026
    - NHS diarrhoea pages: 01 May 2026 and 21 Dec 2023
  - (About 25 findings.)

_Updated 2026-11-11 from 51 QA records (all GLP-1, 10-29 to 11-11)._

_Updated 2026-11-11 from 51 QA records._
