_Based on 60 QA records from 2026-11-05 to 2026-11-18: 37 Shorts, 19 long-form videos and 4 carousels, all about GLP-1. **11 were held or failed.** 4 more long-form videos got a packaging REVISE (L2 11-10, L3 11-14, L3 11-16, L1 11-17). The 11-04 records have aged out of the window, so evidence that only came from them has been dropped._

_**New in this pass:** 4 records from 11-18. All 4 shipped._
- _**Mounjaro vs Zepbound (L1 11-18) passed beat sync after re-timing from the final word timestamps.** That makes 2 of 2 re-renders passing this way (Nausea Foods 11-17 was the first). Its description, hashtags and minus-figure fixes are also in, and there were no packaging findings on the description. Masking was exactly 0.02, right at the limit._
- _No 11-18 Short had a subscribe line or a "link in the description" line. Good._
- _Problems that came back on 11-18:_
  - _cabinet strip or ornament circles (L1, S2)_
  - _starfield on body beats (S2, S3)_
  - _floating head and a blob as the hero (S2)_
  - _a night beat drawn in a daytime room (L1)_
  - _the closing safety line split into two cards (S1)_
  - _the headline box covering the character at 0.0 s (S1)_
  - _our own tip tagged to the labels (S1)_
  - _a recap that drops the label's scope (L1)_
  - _a pinned comment without the don't-switch line (L1)_

_**Why items didn't ship:**_
- _Beat drift after render: 5 (L1 11-09, 11-10, 11-14, 11-16; L2 11-16)._
- _Audio or narration: 5 (L1 11-11; S2 11-11, 11-12, 11-13; S1 11-16)._
- _Wrong source: 1 (L2 11-14: the "Medication Guide" URL was really the PI page)._
- _Description cut off: 1 (L1 11-11)._
- _Packaging REVISEs: 4. Three were about the description, and 2 of those were a broken or missing watch-next line._

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
  - Evidence: 5 gate holds, with plans at 96–100% on time but renders at 76–91%. Wrong-scene shots in L1 11-09 and L2 11-16. Both re-renders that were re-timed from the final timestamps passed (Nausea Foods 11-17, Mounjaro vs Zepbound 11-18).
- **Measure masking last, on the final file, and aim well below 0.02. Never hand off anything above it.**
  - Duck the music under all narration.
  - Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line.
  - Re-measure after every re-render.
  - Evidence: 9 pieces over 0.02, part of 4 holds, latest S1 11-16 at 0.031. L1 11-18 sat exactly at 0.02.
- **Check that every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.**
  - Check every "point", number, unit, drug name and key how-to phrase.
  - Regenerate any scene that fails before you mix.
  - Evidence: 4 holds (silent closing scenes in S2 11-12, "the gray plunger is visible" missing in S1 11-16, "of the day" in L1 11-11). "Point" was also dropped in L1 11-13 and S2 11-15.
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers are digits that match the stat pill exactly ("14.8%", "+14%", "25–29%", "8%", "1.2%", "<6%", "72").
  - Before render, search the captions for POINT, PERCENT, HUNDRED, THOUSAND, spelled-out numbers and pronunciation spellings ("NAY-ON", "SULFONYL UREA").
  - Evidence: about 20 Shorts, latest S2 11-17.
- **Each caption card is one whole clause on 2 lines or fewer.**
  - Never split a word, number or phrase across cards ("SIDE / EFFECTS", "MEDICALLY / NECESSARY").
  - Never end a card on a comma, dash, colon, THE, A, ABOUT, HOW, MAY, WON'T, DOESN'T, HAVE, THOSE, TAKE, BEEN, TYPE, UNLESS or "AND IN", or on a bare number.
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is always one card ending in a full stop. Never split it at the comma.
  - The last card is the task's last line as one whole sentence.
  - Evidence: nearly every Short, latest S3 11-18. The safety card was split in S3 11-17 and S1 11-18.
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.**
  - Keep tags above y 1150 and inside both side edges (no negative x).
  - Show at most 2 tags at once, and never put one behind the caption pill.
  - Drop any tag that repeats the caption ("Stomach", "Kidneys", "Fluids", "US label").
  - Never leave an empty or ghosted bubble.
  - Evidence: about 230 overlap findings across 27 Shorts, latest S3 11-18. Left-edge clips in S4 11-16 and S2 11-17.
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least ~40px.**
  - Name, group and dose tags keep clipping past y 1080 ("Diet", "Adults", "Overweight", "Placebo group", "15 mg arm").
  - Labels keep rendering at 22–26px.
  - Evidence: about 220 off-screen and 250 tiny-text findings, latest L1 11-18 with 12 off-screen.
- **Never use these backdrops, and match the backdrop to the beat's mood.**
  - Banned: the rounded teal or green "cabinet strip", the hanging grey or orange ornament circles (on any mood, clinic included), and a starfield on a body beat.
  - Mood matches: night → a dark night room (never the daytime striped room plus a moon icon), brand → teal gradient, clinic → clinic, body → body backdrop.
  - Evidence: cabinet strips in about 20 pieces, latest L1 and S2 11-18. Starfield on body beats in about 16, latest S2 and S3 11-18. A night beat in a day room in 5 (L1 11-05, 11-06, 11-09; S1 11-16; L1 11-18).
- **Draw people as whole characters with a neck and shoulders, and lock each named character's skin tone, hair and outfit for the whole video.**
  - Never use a ring, donut or blob as the main character or hero prop.
  - Never perch a mascot on a person, and never merge two people into one body.
  - On risk and caveat lines, use a calm, neutral mascot: no smiles, no green checks, no sweating.
  - Evidence: floating heads in about 16 pieces, latest S2 11-18. Rings and blobs in about 11, latest S2 11-18. Continuity breaks: Dana in L1 11-11, Priya in L1 11-17.
- **Fill every frame with a headline plus a labelled hero covering at least ~25% of it, starting with the opening frame.**
  - At t=0 in a Short, the headline box sits clear of the character's head.
  - Change the shot at least every 2.5 s in a Short's first 10 s.
  - In the first 30 s of a long-form video, the main character fills about a third of the frame height.
  - Keep stat titles off the hero art.
  - Document and doctor beats on a plain gradient are the usual empty ones: put the stat on the document and add a character.
  - Evidence: about 140 near-empty findings in long-form videos, latest L1 11-18. Text on the hero at t=0 in S1 11-16 and S1 11-18. Static opening shots of 2.8–2.9 s in S3 11-11 and S2 11-18.

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words. Count every safety and closing line yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160 (S3 11-18 landed at exactly 160).
  - From content date 2026-11-17, the ending is:
    1. "Not personal advice, so ask your prescriber." This line also goes in the on-screen text field as one entry.
    2. The emergency and don't-stop lines, when the topic needs them.
    3. The task's last line, which loops back into sentence 1.
  - Never write a subscribe line or "link in the description" in a Short.
- **Copy the fixed safety lines exactly, and speak each one and show it on screen.**
  - An emergency line names its trigger and keeps "right away". Follow it with "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise".
  - Any stomach, fullness or eating-less topic names severe stomach pain that won't go away as a "call right away" sign (S1 11-06, S2 11-18).
  - Fluid tips keep "unless you've been told to limit fluids" (L1 11-17, S2 11-17).
  - For chest pain or fainting, the emergency number comes first (S1 11-12, C1 11-17).
  - Unapproved drugs or uses "aren't approved".
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - Give each decimal its own short sentence, with the unit spoken.
  - Say "loss" or "lower" for minus figures (L1 11-16).
  - Never write "now", "this week", "new" or dates in narration, thumbnails or on-screen text (L2 11-11, L3 11-16).
  - Help lines cover all four markets (L1 11-06, S1 11-17).
- **Keep each finding at its source's exact unit, scope, verb and hedge, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe in the same sentence.
  - A share of people is never an "average".
  - Never present slower stomach emptying as the cause of an effect: no "so", no "that's why" (about 6 pieces).
  - Don't compare two different trials as if they were head-to-head.
  - Never add "most", "many", "commonly", "similar", "purely", "myth" or a timeframe the source doesn't give.
  - Never write "the paper says" unless you've read the sentence in it.
  - Recaps repeat the full scope. Evidence: about 100 findings. Recaps lost scope in L3 11-14, L2 11-16, C1 11-17 and L1 11-18 ("death from heart disease" dropped).
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and the scope from sentence 1.
  - Every stat card names the drug, the dose (or "by dose"), both groups (say "placebo" for the zero), the population and the timeframe.
  - On-screen text is never stronger or narrower than the narration.
  - Evidence: about 75 findings, latest S1 and S3 11-18.

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.**
  - Keep each trial's exact population in the recap slide too.
  - Use a stat card that names the drug, both groups and the measure.
  - Use generic drug hashtags only (#dizziness in C1 11-17).
  - Give every source its full revised date.
  - Use one save ask, and end on the exact disclaimer plus the prescriber line.
  - Evidence: all 4 carousels had findings, latest C1 11-17.

### Social Copywriter & packaging
- **Long-form descriptions must be complete, viewer copy only, and 1,250 characters or fewer.**
  - Line 1 stays empty on every YouTube description, Shorts included.
  - Build the safety block first, with the scoped don't-stop line and the closing disclaimer. Then add a quick answer, then 2–3 sources.
  - Check that the field's last characters are "…whether it's right for you." with no markup or tool text after it ("</description></invoke>", L1 11-17).
  - Never type a placeholder ("MM:SS", "▶ Watch next" with or without a colon) or an internal note.
  - Add chapters only with real timestamps starting at 00:00, one per section including the final checklist. Otherwise leave them out and say so in the post notes.
  - Evidence: 6 cut off, leaked or missing the ending (1 hold, 3 REVISEs). Over the limit in 3. Line 1 filled in about 7 Shorts, latest S2 11-15.
- **Don't write the watch-next line yourself; the publisher adds it.** Name the target video in the post notes, from the playbook's linking list:
  - new broad videos → Side Effects
  - Mounjaro vs Zepbound and Foundayo → How It Works
  - First Month → Months 2–6 (now live)

  Never use the channel home page. Evidence: 5 pieces (a placeholder in L1 11-14 and L1 11-17, missing in L1 and L3 11-16, the channel home page in L2 11-16).
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Put the hashtags and the don't-stop line before it (hashtags after the disclaimer in S1 11-09 and S3 11-17).
  - Copy safety lines word for word: keep "right away", "healthcare provider", "with or without vomiting" and "unless you've been told to limit fluids". Write "medicines", never "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line. If the safety lines alone run past 300, ship the safety lines plus one short fact.
  - Evidence: Threads over the limit in about 35 pieces, latest S1 11-18.
- **Copy facts, qualifiers, arms and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep "top dose", "all doses combined", "Phase 2b", "tirzepatide vs placebo", "US Zepbound label" and the full trial population.
  - The pinned comment never cuts the population to "adults" (L1 11-15, L2 11-16).
  - On side-effect and comparison posts, the pinned comment also carries the scoped don't-stop or don't-switch line (L1 11-09, L2 11-09, L1 11-18).
  - Never credit our own tips to a study.
  - Never add validation hooks or promises the script doesn't make ("You're not imagining it", "You're not wrong to notice", "Exactly", "Can't-shake-it", "yet").
  - Evidence: about 140 findings, in every batch, latest S1 11-18.
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat in a title names its measure.
  - Don't promise a timeframe the video doesn't give.
  - Use one save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose own data the post reports. Banned examples: #Zepbound, #GLP1 on a single-drug post, #PatientSafety, #Type2Diabetes, #WeightManagement, #sideeffects, #dizziness, #pentips, #HeartRate, #MetabolicHealth.
  - Evidence: about 55 pieces, latest C1 11-17.

### Everyone
- **Fix the queued long-form videos' known faults before you re-render or resubmit them.** Re-time from the final word timestamps; that is what got Nausea Foods and Mounjaro vs Zepbound through.
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
  - **Serious Risks (11-14):**
    - needs a real Medication Guide URL
    - name the warning "Suicidal Behavior and Ideation"
    - show the weight-trial pancreatitis figure
  - **Backups, Injection Site (11-09) and Burping (11-10):** beat drift.
- **The Medication Guide and the IFU each need their own working URL, never the PI page or a PI anchor.**
  - Open the URL and find the quoted sentence before you cite it. If it won't load, paraphrase without quotes and tag the PI section instead.
  - If the keyword or title names Mounjaro, also cite Mounjaro's own label or IFU.
  - Evidence: caused the L2 11-14 failure; about 10 pieces, latest S1 11-16 and S1 11-17.
- **Give every result its exact drug scope and trial population.**
  - **Obesity trials:** SURMOUNT-1, -4 and -5, STEP 1 and ATTAIN-1 enrolled adults with obesity, or overweight plus a weight-related condition, without diabetes. Never shorten this to "no diabetes" or "adults".
  - **Zepbound pooled data:** Study 1 excluded type 2 diabetes; Study 2 enrolled only people with it (S3 11-18).
  - **Low blood sugar:** the higher risk applies only to people with diabetes taking insulin or a sulfonylurea. Say so in the spoken line too.
  - **Pancreatitis:** show 0.23 vs 0.11 per 100 years (diabetes pool) only alongside the weight-trial figure, 0.14 vs 0.15.
  - **GI effects:** they came "mostly during dose escalation and decreased over time".
  - **75/25 fat-to-lean split:** this is from SURMOUNT-1's 160-person DXA substudy, not the whole trial.
  - **SURMOUNT-4:** 335 vs 335; +14.0% average regain on placebo, and placebo still ended 9.9% below baseline.
  - **Hair loss:** 5.4% vs 0.9% (women 7.1%, men 0.5%).
  - **Injection-site reactions:** 6–8% by dose vs about 2% on placebo.
  - **Pen storage:** the single-dose pen and the vial can be kept unrefrigerated (up to 86°F) for 21 days in total. KwikPens have different limits, so name the device (S1 11-15, S3 11-17).
  - **Foundayo:** the label's top dose is 17.2 mg, with −11.1% in Trial 1. The 36 mg dose and −11.2% are from the trial.
- **Tag a line to a source only after you find the sentence that says it.**
  - Our own tips, help lines and safety lines get no tag. Evidence: L2 11-09, L1 11-10, S2 11-17 and S1 11-18.
  - A source title lists only the sections it is actually cited for (L3 11-14, S2 11-16, S1 11-18).
  - Known facts:
    - The July 2023 review was EMA PRAC's.
    - Name both NANOS and the AAO.
    - NHS "more at risk" is not the same as "more likely".
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

_Updated 2026-11-18 from 60 QA records (all GLP-1, 11-05 to 11-18)._

_Updated 2026-11-18 from 60 QA records._
