_Based on 60 QA records from 2026-11-04 to 2026-11-17: 37 Shorts, 19 long-form videos and 4 carousels, all about GLP-1. **11 were held or failed.** 4 more long-form videos got a packaging REVISE (L2 11-10, L3 11-14, L3 11-16, L1 11-17)._

_**New in this pass:** 5 records from 11-17, the first content date under the new Shorts closing._
- _None of the 11-17 Shorts had a subscribe line or a "link in the description" line. Good._
- _S3 11-17 left the new "Not personal advice, so ask your prescriber." line out of the on-screen text field, and its caption card ended on a comma._
- _The Nausea Foods re-render (L1 11-17) passed beat sync and masking (0.012). It still got a packaging REVISE for two reasons:_
  - _leftover markup ("</description></invoke>") after the disclaimer_
  - _a "Watch next" line that ended on a colon with no URL_
- _Problems that came back on 11-17:_
  - _cabinet strip or ornament circles in L1, S2 and S3_
  - _starfield on body beats in L1 and S2_
  - _PERCENT spelled out in captions (S2)_
  - _Priya's skin and hair changed between shots (L1)_
  - _an empty speech bubble (S1)_
  - _a tag clipped off the left edge (S2)_
  - _our own tip tagged to the label (S2)_
  - _a placeholder in a source's date field (S2)_
  - _the #dizziness hashtag (C1)_

_**Why items didn't ship:**_
- _Beat drift after render: 5 (L1 11-09, 11-10, 11-14, 11-16; L2 11-16)._
- _Audio or narration: 5 (L1 11-11; S2 11-11, 11-12, 11-13; S1 11-16)._
- _Wrong source: 1 (L2 11-14: the "Medication Guide" URL was really the PI page)._
- _Description cut off: 1 (L1 11-11)._
- _Packaging REVISEs (L2 11-10, L3 11-14, L3 11-16, L1 11-17): 3 were the description, 2 of them a broken or missing watch-next line._

_**Ignore:**_
- _The Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09. They came from a QA bug, and the published videos were in sync. For beat timing, only the automatic beat-sync gate counts._
- _Any finding that cites a 170-word or 90 s Shorts limit. The limit is 160 spoken words._
- _Any finding about the old Exp F closing cards ("…QUESTION FROM THE", "FULL BREAKDOWN ON OUR CHANNEL,")._

_**Shorts closing (owner OK 2026-11-12, in force for content dates from 2026-11-17):** no Exp F subscribe line or card, and no "link in the description" line or card. This includes re-renders of older Short scripts. Never add them back._

### Motion Designer
- **Long-form videos: check beat sync on the render, not the plan.**
  - Re-time every cut from the final word timestamps after the final narration, and again after any scene is regenerated.
  - Measure every beat in the rendered file and fix any cut more than 0.5 s off.
  - Check that no shot shows another scene's text.
  - Plans were 96–100% on time; renders were 76–91%. Nausea Foods passed on 11-17 after re-timing from the final timestamps.
  - Evidence: 5 gate holds; wrong-scene shots in L1 11-09 and L2 11-16.
- **Measure masking last, on the final file, and never hand off anything above 0.02.** Duck the music under all narration. Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line. Re-measure after every re-render. (10 pieces over 0.02, latest S1 11-16 at 0.031; part of 4 holds. S2 11-17 was at 0.019.)
- **Check that every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.** Check every "point", number, unit, drug name and key how-to phrase, and regenerate any scene that fails before you mix. (4 holds: silent closing scenes in S2 11-12, "the gray plunger is visible" missing in S1 11-16, "of the day" in L1 11-11. Also "point" dropped in L1 11-13 and S2 11-15.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers are digits that match the stat pill exactly ("14.8%", "+14%", "25–29%", "8%", "1.2%", "<6%", "72"). Before render, search the captions for POINT, PERCENT, HUNDRED, THOUSAND, spelled-out numbers and pronunciation spellings ("NAY-ON", "SULFONYL UREA"). (About 22 Shorts, latest S2 11-17.)
- **Each caption card is one whole clause on 2 lines or fewer.**
  - Never split a word, number or phrase across cards ("SIDE / EFFECTS", "MEDICALLY / NECESSARY").
  - Never end a card on a comma, dash, colon, THE, A, ABOUT, HOW, MAY, WON'T, DOESN'T, BEEN, TYPE, UNLESS, "AND IN" or a bare number ("NO WARMER THAN 86").
  - The closing safety card "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card ending in a full stop. The last card is the task's last line as one whole sentence.
  - Evidence: nearly every Short, latest S3 11-17 with 7 bad endings.
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.**
  - Keep tags above y 1150 and inside both side edges (no negative x).
  - Show at most 2 tags at once, and never put one behind the caption pill.
  - Drop any tag that repeats the caption ("Low BP", "Slowly", "US label").
  - Render every chip the shot list asks for, and never leave an empty or ghosted bubble.
  - Evidence: about 230 overlap findings across 26 Shorts, latest S4 11-16 and S1 11-17. Left-edge clips in S4 11-16 and S2 11-17.
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least ~40px.** Name, group and dose tags keep clipping past y 1080 ("Stomach", "Placebo group", "15 mg arm", "Nausea"), and labels keep rendering at 22–26px. (About 230 off-screen and 265 tiny-text findings, latest L1 11-17 with 15 off-screen.)
- **Never use these backdrops:** the rounded teal or green "cabinet strip", the hanging grey or orange ornament circles (on any mood, clinic included), or a starfield on a body beat. Match the backdrop to the beat's mood: night → night room, brand → teal gradient, clinic → clinic, body → body backdrop. (Cabinet strips in 18 pieces since 11-10, latest L1, S2 and S3 11-17. Starfield on body beats in about 14 pieces, latest L1 and S2 11-17.)
- **Draw people as whole characters with a neck and shoulders, and lock each named character's skin tone, hair and outfit for the whole video.**
  - Never use a ring, donut or blob as the main character or hero prop.
  - Never perch a mascot on a person.
  - On risk and caveat lines, use a calm, neutral mascot: no smiles, no green checks, no sweating.
  - Evidence: floating heads in about 15 pieces. Rings and blobs in about 10, latest L1, S2 and S3 11-17. Continuity breaks: Dana in L1 11-11, Priya in L1 11-17.
- **Fill every frame with a headline plus a labelled hero covering at least ~25% of it, starting with the opening frame.**
  - In the first 30 s of a long-form video, the main character fills about a third of the frame height.
  - Keep stat titles off the hero art.
  - Document and doctor beats on a plain gradient are the usual empty ones: put the stat on the document and add a character.
  - No blank frames, cropped shapes or stray debug icons.
  - Evidence: about 150 near-empty findings in long-form videos, latest L1 11-17. Tiny opening character in L2 and L3 11-16.

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words. Count every safety and closing line yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160.
  - From content date 2026-11-17, the ending is:
    1. "Not personal advice, so ask your prescriber." This line also goes in the on-screen text field, so it gets a caption card (missing in S3 11-17).
    2. The emergency and don't-stop lines, when the topic needs them.
    3. The task's last line, which loops back into sentence 1.
  - Never write a subscribe line or "link in the description" in a Short.
- **Copy the fixed safety lines exactly, and speak each one and show it on screen.**
  - An emergency line names its trigger and keeps "right away". Follow it with "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own."
  - Never write "Otherwise".
  - Fluid tips keep "unless you've been told to limit fluids" (L1 11-17, S2 11-17, S1 11-04).
  - For chest pain or fainting, the emergency number comes first (S1 11-12, C1 11-17).
  - Unapproved drugs or uses "aren't approved".
  - Evidence: about 15 pieces.
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - Give each decimal its own short sentence, with the unit spoken.
  - Say "loss" or "lower" for minus figures (L1 11-16).
  - Never write "now", "this week", "new" or dates in narration, thumbnails or on-screen text (S2 11-04, L2 11-11, L3 11-16).
  - Help lines cover all four markets.
- **Keep each finding at its source's exact unit, scope, verb and hedge, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe in the same sentence.
  - A share of people is never an "average".
  - Never present slower stomach emptying as the cause of an effect: no "so", no "that's why" (6 pieces).
  - Don't compare two different trials as if they were head-to-head.
  - Never add "most", "many", "commonly", "similar", "purely", "myth" or a timeframe the source doesn't give.
  - Never write "the paper says" unless you've read the sentence in it.
  - Evidence: about 105 findings. Recaps lost scope in L3 11-14, L2 11-16 and C1 11-17.
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and the scope from sentence 1.
  - Every stat card names the drug, the dose (or "by dose"), both groups (say "placebo" for the zero), the population and the timeframe.
  - On-screen text is never stronger or narrower than the narration.
  - Evidence: about 75 findings, latest S2 11-17 and L1 11-17.

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.** Keep each trial's exact population in the recap slide too. Use a stat card that names the drug, both groups and the measure, and generic drug hashtags only. Give every source its full revised date, use one save ask, and end on the exact disclaimer plus the prescriber line. (All 4 carousels had findings, latest C1 11-17.)

### Social Copywriter & packaging
- **Long-form descriptions must be complete, viewer copy only, and 1,250 characters or fewer.**
  - Build the safety block first, with the scoped don't-stop line and the closing disclaimer. Then add a quick answer, then 2–3 sources.
  - Check that the field's last characters are "…whether it's right for you." with no markup or tool text after it ("</description></invoke>", L1 11-17).
  - Never type a placeholder ("MM:SS", "▶ Watch next" with or without a colon).
  - Add chapters only with real timestamps starting at 00:00, one per section including the final checklist. Otherwise leave them out and say so in the post notes.
  - Evidence: 6 cut off, leaked or missing the ending (1 hold, 3 REVISEs). Over the limit in 3, latest L1 11-16.
- **Line 1 stays empty on every YouTube description, Shorts included, and the field never holds an internal note.** (Line 1 filled in about 8 pieces, latest S2 11-15. Internal note in L1 11-06.)
- **Don't write the watch-next line yourself; the publisher adds it.** Name the target video in the post notes, from the playbook's linking list:
  - new broad videos (Months 2–6 included) → Side Effects
  - Mounjaro vs Zepbound and Foundayo → How It Works
  - First Month → Months 2–6 once it's live

  Never use the channel home page. (5 pieces: placeholder in L1 11-14 and L1 11-17, missing in L1 and L3 11-16, channel home page in L2 11-16.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Put the hashtags and the don't-stop line before it.
  - Copy safety lines word for word: keep "right away", "healthcare provider", "with or without vomiting" and "unless you've been told to limit fluids".
  - Write "medicines", never "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line. If the safety lines alone run past 300, ship the safety lines plus one short fact.
  - Evidence: Threads over the limit in about 38 pieces, latest S2 11-17 at about 420. Hashtags after the disclaimer, latest S3 11-17.
- **Copy facts, qualifiers, arms and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep "top dose", "all doses combined", "Phase 2b", "tirzepatide vs placebo", "US Zepbound label" and the full trial population.
  - The pinned comment never cuts the population to "adults" (L1 11-04, L1 11-15, L2 11-16).
  - Never credit our own tips to a study.
  - Never add hooks or promises the script doesn't support ("You're not imagining it", "Exactly", "Can't-shake-it", "yet").
  - Evidence: about 145 findings, in every batch, latest S1, S2 and S3 11-17.
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat in a title names its measure.
  - Don't promise a timeframe the video doesn't give.
  - Use one save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose own data the post reports. Banned examples: #Zepbound, #GLP1 on a single-drug post, #PatientSafety, #Type2Diabetes, #WeightManagement, #sideeffects, #dizziness, #pentips, #HeartRate, #MetabolicHealth.
  - Evidence: about 55 pieces, latest L1 11-16 and C1 11-17.

### Everyone
- **Fix the queued long-form videos' known faults before you re-render or resubmit them.** Nausea Foods shipped clean on sync and masking after re-timing from the final word timestamps; do the same for these.
  - **Mounjaro vs Zepbound (11-16):**
    - beat drift (76% on time)
    - description about 1,340 characters
    - #Type2Diabetes and #WeightManagement hashtags
    - minus figures spoken without "loss"
  - **Weight Loss in the Trials (11-16):**
    - beat drift plus a wrong-scene shot
    - pinned comment cut to "adults"
    - recap drops the 75/25 DXA scope
    - "the paper says" line not verified
    - watch-next pointed at the channel home page
  - **Foundayo (11-11):**
    - masking 0.022
    - description cut off
    - Dana's skin and hair change between shots
  - **Serious Risks (11-14):** needs a real Medication Guide URL.
  - **Backups, Injection Site (11-09) and Burping (11-10):** beat drift.
- **The Medication Guide and the IFU each need their own working URL, never the PI page or a PI anchor.**
  - Open the URL and find the quoted sentence before you cite it. If it won't load, paraphrase without quotes and tag the PI section instead.
  - If the keyword or title names Mounjaro, also cite Mounjaro's own label or IFU.
  - Evidence: caused the L2 11-14 failure; 11 pieces, latest S1 11-16 and S1 11-17.
- **Give every result its exact drug scope and trial population.**
  - **Obesity trials:** SURMOUNT-1, -4 and -5, STEP 1 and ATTAIN-1 enrolled adults with obesity, or overweight plus a weight-related condition, without diabetes. Never shorten this to "no diabetes" or "adults".
  - **Zepbound pooled data:** Study 1 excluded type 2 diabetes; Study 2 enrolled only people with it.
  - **Low blood sugar:** the higher risk applies only to people with diabetes taking insulin or a sulfonylurea. Say so in the spoken line too (S4 11-16, S3 11-11, S1 11-06).
  - **Pancreatitis:** show 0.23 vs 0.11 per 100 years (diabetes pool) only alongside the weight-trial figure, 0.14 vs 0.15.
  - **GI effects:** they came "mostly during dose escalation and decreased over time".
  - **75/25 fat-to-lean split:** this is from SURMOUNT-1's 160-person DXA substudy, not the whole trial.
  - **SURMOUNT-4:** 335 vs 335; +14.0% average regain on placebo, and placebo still ended 9.9% below baseline.
  - **Hair loss:** 5.4% vs 0.9% (women 7.1%, men 0.5%).
  - **Injection-site reactions:** 6–8% by dose vs about 2% on placebo.
  - **Pen storage:** the single-dose pen and the vial can be kept unrefrigerated (up to 86°F) for 21 days in total. KwikPens have different limits, so name the device (S1 11-15, S3 11-17).
  - **Foundayo:** the label's top dose is 17.2 mg, with −11.1% in Trial 1. The 36 mg dose and −11.2% are from the trial.
- **Tag a line to a source only after you find the sentence that says it.**
  - Our own tips, help lines and safety lines get no tag (fizzy-drink tip tagged to the label in S2 11-17).
  - A source title lists only the sections it is actually cited for.
  - Known facts:
    - The July 2023 review was EMA PRAC's.
    - Name both NANOS and the AAO.
    - NHS "more at risk" is not the same as "more likely".
    - The removed label warning was "Suicidal Behavior and Ideation".
  - Evidence: about 70 findings.
- **Keep the source list clean: fetch every URL first.**
  - Reject 402, 403 and 404 responses, login and DOI redirects, newsroom pages and search-query pages.
  - Use the PubMed record for paywalled journals.
  - Every entry carries its live revised or reviewed date, never just a year and never placeholder text (S2 11-17).
  - Known dates:
    - Zepbound PI: 28 Aug 2026
    - Mounjaro PI: 27 Aug 2026
    - NHS diarrhoea pages: 01 May 2026 and 21 Dec 2023
    - NHS nausea page: 17 Nov 2023

_Updated 2026-11-17 from 60 QA records (all GLP-1, 11-04 to 11-17)._

_Updated 2026-11-17 from 60 QA records._
