_Based on 60 QA records from 2026-11-09 to 2026-11-20: 37 Shorts, 19 long-form videos and 4 carousels, all about GLP-1._

_**13 were held or failed:**_
- _5 for beat drift_
- _5 for audio or narration_
- _3 for sources or fact-check: a wrong Medication Guide URL (L2 11-14), a fact-check REVISE (Foundayo L1 11-20) and a staff note left in a source date (C1 11-20)_

_4 long-form videos also got a packaging REVISE. The 11-06 to 11-08 records have aged out, so evidence that came only from them has been dropped._

_**New in this pass:** 5 records from 11-20._
- _**S2 11-20 (Foundayo pill) shipped with masking 0.054, more than twice the limit.** The gate didn't catch it. The Motion Designer must never hand off anything over 0.02._
- _**C1 11-20 was held** because a staff note ("HOLD FOR HUMAN, DO NOT PUBLISH") sat in the source date field. Its "loose pens" wording was also wrong._
- _**Foundayo (L1 11-20) failed the fact-check.** The on-screen card said "9 in 10 kept going" when the source only says about 9 in 10 didn't stop because of adverse events. The population also lost "weight-related"._
- _Problems that came back:_
  - _the safety card split in two (S2)_
  - _blob heroes (S2, S3)_
  - _a mascot perched on a person (S3)_
  - _hair changing between shots (S2)_
  - _a raw "Label" placeholder tag and empty tag rails (S3, S2)_
  - _caption cards ending on a comma, dash, THE, THOSE, CAN or a bare number (all 3 Shorts)_
  - _a topic hashtag (#injectionsite) and an opener the script doesn't have (S1)_

_**Ignore:**_
- _The Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09. They came from a QA bug (frames were shown in the wrong order). Only the automatic beat-sync gate counts._
- _Any finding that cites a 170-word or 90 s Shorts limit._
- _Any finding about the old Exp F closing cards ("FULL BREAKDOWN ON OUR CHANNEL,", "TIRZEPATIDE QUESTION FROM THE") on Shorts dated before 11-17._

_**Shorts closing (owner OK 2026-11-12, for content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older Short scripts. Never add them back. Every Short from 11-17 to 11-20 complied._

### Motion Designer
- **Measure masking last, on the final file, and never hand off anything above 0.02. Aim for 0.015 or lower.**
  - Duck the music under all narration.
  - Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line.
  - Re-measure after every re-render. If a Short is over 0.02, remix it; don't count on the gate to stop it.
  - (9 pieces over 0.02 and 4 holds: S2 11-11 0.061, S2 11-13 0.047 with stingers on the numbers, S1 11-16 0.031, L1 11-11 0.022. **S2 11-20 shipped at 0.054.** L2 11-16 and L1 11-18 sat at exactly 0.02.)
- **Long-form: check beat sync on the render, not the plan.**
  - Re-time every cut from the final word timestamps after the final narration, and again after any scene is regenerated.
  - Then measure every beat in the rendered file and fix any cut more than 0.5 s off.
  - Make sure no shot shows another scene's text.
  - (5 gate holds: 11-09, 11-10, 11-14, and L1 and L2 11-16. Plans were 96–100% on time but renders only 76–91%. A wrong-scene shot in L2 11-16. All 3 re-timed renders passed: 11-17, 11-18, 11-19.)
- **Check that every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.** Check every "point", number, unit, drug name and how-to phrase. Regenerate any failing scene before you mix. (3 holds: silent closing scenes in S2 11-12, "the gray plunger is visible" missing in S1 11-16, "of the day" in L1 11-11. Also "point" dropped in L1 11-13 and S2 11-15, and "tenmg" and "sub study" in L1 11-19.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers are digits that match the stat pill exactly ("14.8%", "25–29%", "1.2%", "<6%").
  - Before render, search the captions for POINT, PERCENT, HUNDRED, THOUSAND, spelled-out numbers and pronunciation spellings ("NAY-ON", "SULFONYL UREA").
  - (About 20 Shorts, latest S2 11-17.)
- **Each caption card is one whole clause on 2 lines or fewer.**
  - Never split a word, number or phrase across cards (not "IN 6 TO 8").
  - Never end a card on a comma, dash, colon, THE, A, AS, CAN, ABOUT, HOW, MAY, WON'T, DOESN'T, HAVE, THOSE, TAKE, TYPE, UNLESS or "AND IN", or on a bare number.
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is always one card ending in a full stop.
  - (Nearly every Short, all 3 on 11-20. The safety card was split 4 times: S3 11-17, S1 11-18, S2 11-19, S2 11-20.)
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.**
  - Keep tags above y 1150 and inside both side edges.
  - Show at most 2 tags at a time, never put one behind the caption pill, and drop any tag that repeats the caption.
  - Never render an empty bubble, ghost text, a blank tag rail, dash placeholders or a raw template word such as "Label".
  - (About 240 overlap findings across 30 Shorts. Ghost text in S1 11-19. "Label" placeholder in S3 11-20, empty rails in S2 11-20, empty bubbles in S1 11-13 and S1 11-17.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least ~40px.** Name, group and dose tags ("Diet", "Adults", "Placebo group", "15 mg arm") keep clipping past y 1080, and labels keep rendering at 22–26px. (About 220 off-screen and 250 tiny-text findings, latest L1 11-19 with 10 off-screen.)
- **Never use these backdrops, and match the backdrop to the beat's mood.**
  - Banned: the rounded teal or green "cabinet strip", the hanging grey or orange ornament circles (on any mood), and a starfield on a body beat.
  - A night beat gets a dark night room, never the daytime striped room plus a moon icon.
  - (Cabinet strips in about 20 pieces, latest L1 and S2 11-18. Ornament circles latest S3 11-19. Starfield on body beats in about 17, latest S3 11-19. Night beats in a day room 4 times, latest L1 11-18.)
- **Draw people as whole, filled-in characters with a neck and shoulders, and lock each named character's skin tone, hair and outfit for the whole video.**
  - Never use a ring, donut, blob or outline-only figure as the hero.
  - Never merge two people, and never perch a mascot on a person.
  - Don't bring in a new look-alike character mid-Short.
  - Risk lines get a calm, neutral mascot.
  - (Floating heads in about 19 pieces. Blob heroes in about 15, latest S2 and S3 11-20. Continuity breaks in L1 11-11, L1 11-17, S2 11-19, S1 11-20 and S2 11-20. Merged people or perched mascots in S3 11-13, S1 11-18, S2 11-19 and S3 11-20.)
- **Fill every frame with a headline plus a labelled hero covering at least ~25% of it, starting with the opening frame.**
  - At t=0 in a Short, the headline sits clear of the character's head.
  - Change the shot at least every 2.5 s in a Short's first 10 s.
  - In a long video's first 30 s, the main character fills about a third of the frame height.
  - Document, package, Rx and doctor beats on a plain gradient need a character, with the stat on the document.
  - Never repeat the same lone prop in consecutive shots.
  - (About 155 near-empty findings, latest L1 11-19 with 7 sparse frames, including the same lone package 3 shots in a row, and S3 11-20 with a lone Rx icon. Text on the hero at t=0 in S1 11-16 and S1 11-18.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.** Tight arm: 90–120 words. Standard arm: 135–160. Never go over 160 (S3 11-18 landed at exactly 160). From content date 2026-11-17, end with:
  1. "Not personal advice, so ask your prescriber." This also goes in the on-screen text field as one entry.
  2. The emergency and don't-stop lines, when the topic needs them.
  3. The task's last line, which loops back to sentence 1.

  Never write a subscribe line or "link in the description" in a Short.
- **Copy the fixed safety lines exactly, and speak each one and show it on screen.**
  - An emergency line names its trigger and keeps "right away", then: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise".
  - Any stomach, fullness or eating-less topic names severe stomach pain that won't go away as a "call right away" sign, on screen too (S2 11-18, S3 11-20).
  - Fluid tips keep "unless you've been told to limit fluids" (L1 11-17, S2 11-17).
  - For chest pain or fainting, the emergency number comes first (S1 11-12, C1 11-17).
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits in narration (S2 11-20). Give each decimal its own short sentence, with the unit spoken.
  - Say "loss" or "lower" for minus figures (L2 11-16).
  - Write units out in full ("ten milligrams"), and avoid compound words the voice may split (L1 11-19).
  - Every spoken number names its comparator ("versus about 2 in 100 on placebo"; S4 11-16, S1 11-20).
  - Never write "now", "this week", "new" or dates (L2 11-11, L3 11-16).
  - Help lines cover all four markets (S1 11-17, S1 11-19).
- **Keep each finding at its source's exact unit, scope, verb and hedge, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe.
  - A share of people is never an "average". "Adverse events" are never "side effects", and "didn't stop because of adverse events" is never "kept going" (Foundayo failed on this, L1 11-20).
  - Never present slower stomach emptying as the cause of an effect (no "so", no "that's why").
  - Don't compare different trials as if they were head-to-head.
  - Never add "most", "many", "commonly", "similar", "myth", "a few days" or a softer verb ("fades" for "diminishes").
  - Never write "the paper says" until you've found the sentence.
  - (About 105 findings. Recaps lost scope in L3 11-14, L2 11-16, C1 11-17 and L1 11-18.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug, the scope and the answer from sentence 1, and says nothing the narration doesn't (S3 11-19, S2 and S3 11-20).
  - Every stat card names the drug, the dose (or "by dose"), both groups (say "placebo" for the zero), the full population and the timeframe.
  - Never shorten the population to "no diabetes" or drop "weight-related" (S2 11-14, S2 11-19, L1 11-20).
  - On-screen text is never stronger or narrower than the narration.
  - (About 85 findings, latest L1, S2 and S3 11-20.)

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.**
  - Keep each trial's full population in the recap slide.
  - Use a stat card that names the drug, both groups and the measure.
  - Use generic drug hashtags only, placed before the disclaimer.
  - Give every source its real revised date, never a placeholder or a staff note.
  - Use one save ask, and end on the exact disclaimer plus the prescriber line.
  - (All 4 carousels had findings. C1 11-20 was held for a staff note in a source date and for dropping "loose" from the pen line.)

### Social Copywriter & packaging
- **Long-form descriptions must be complete, viewer copy only, and 1,250 characters or fewer.**
  - Line 1 stays empty on every YouTube description, Shorts included.
  - Order: safety block (scoped don't-stop line plus disclaimer), then a quick answer, then 2–3 sources.
  - The field's last characters are "…whether it's right for you.", with no markup or tool text after it.
  - Never type a placeholder ("MM:SS", a bare "▶ Watch next:").
  - Add chapters only with real timestamps from 00:00. Otherwise leave them out and say so in the post notes.
  - (Cut off, leaked or missing the ending 6 times, causing 1 hold and 3 REVISEs, latest L1 11-17. Over the limit in 3. Line 1 filled in about 5 Shorts.)
- **Don't write the watch-next line yourself; the publisher adds it. Name the target in the post notes.**
  - New broad videos → Side Effects
  - Mounjaro vs Zepbound and Foundayo → How It Works
  - First Month → Months 2–6

  Never use the channel home page. (5 pieces, latest L1 11-17. L1 11-19 got it right.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Put hashtags and the don't-stop line before it (hashtags came after it in S1 11-09, S3 11-17 and C1 11-20).
  - Copy safety lines word for word: keep "right away", "healthcare provider", "with or without vomiting" and "unless you've been told to limit fluids". Never write "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line. If the safety lines alone run past 300, ship them plus one short fact.
  - (Threads over the limit in about 35 pieces, latest S3 11-19.)
- **Copy facts, qualifiers, arms and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep "top dose", "all doses combined", "Phase 2b", "for best quality", "tight-fitting, puncture-resistant", "loose" and the full trial population.
  - The pinned comment never cuts the population to "adults", and on side-effect and comparison posts it carries the scoped don't-stop or don't-switch line (L1 11-15, L2 11-16, L1 11-18).
  - Never credit our tips to a study.
  - Never add openers the script doesn't have: no validation hooks ("You're not imagining it", "You're not wrong to notice", "Exactly") and no rhetorical questions. Don't add "yet" either.
  - (About 150 findings, in every batch, latest S1 and S3 11-20.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat in a title names its measure.
  - The thumbnail headline must make sense on its own (no bare "IT", L1 11-19).
  - Don't promise a timeframe the video doesn't give.
  - Use one save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports. Never use brand, class, topic or trend tags: no #Zepbound, #GLP1 on a single-drug post, #sideeffects, #injectionsite, #dizziness, #PatientSafety, #WeightManagement or #Type2Diabetes.
  - (About 58 pieces, latest S1 11-20.)

### Everyone
- **Fix the queued long videos' known faults before you re-render or resubmit, and re-time from the final word timestamps.**
  - **Foundayo:** the 11-20 script failed the fact-check. Apply its fixes:
    - s18: say "about 9 in 10 on the top trial dose didn't stop because of adverse events", never "kept going".
    - Say "adverse events", not "side effects".
    - Keep "weight-related" in the population.
    - Name the drug, timeframe and measure on the s31 and s32 cards.
    - Say "the label's Trial 1, in adults without diabetes".
    - Add your own history of MTC and MEN 2.
  - **Foundayo, render faults from 11-11:** masking 0.022, description cut off, Dana's skin and hair change between shots.
  - **Serious Risks (11-14):** needs a real Medication Guide URL, name the warning "Suicidal Behavior and Ideation", and show the weight-trial pancreatitis figure.
  - **Pen disposal carousel (11-20):** needs the IFU's real revised date and the "loose pens" wording.
  - **Backups, Injection Site (11-09) and Burping (11-10):** beat drift.
- **Every source needs its own working URL and a real, live revised date. Never ship a placeholder, a bare year or a note to staff in any field.**
  - The Medication Guide and the IFU each need their own URL, never the PI page or a PI anchor.
  - Open the document and find the quoted sentence before you cite it.
  - If the document won't load, or its date can't be read (the pen IFU PDFs keep failing), paraphrase without quotes and cite the PI section with its known date instead.
  - If the keyword or the scope covers Mounjaro, also cite Mounjaro's own label or IFU.
  - (2 failures: L2 11-14 for a wrong URL, C1 11-20 for a staff note in the date field. Placeholder dates also in S2 11-17 and S1 11-19. Undated IFUs in S1 11-14 and S1 11-16.)
  - Known dates: Zepbound PI 28 Aug 2026, Mounjaro PI 27 Aug 2026, Foundayo label rev 7/2026, NHS diarrhoea pages 01 May 2026 and 21 Dec 2023, NHS nausea page 17 Nov 2023.
- **Give every result its exact scope.**
  - **Obesity trials** (SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1): adults with obesity, or overweight plus a weight-related condition, without diabetes.
  - **Zepbound Study 1 vs Study 2:** Study 1 excluded type 2 diabetes; Study 2 enrolled only people with it.
  - **Low blood sugar:** higher risk only with diabetes plus insulin or a sulfonylurea. Say so in the spoken line too.
  - **Pancreatitis:** 0.23 vs 0.11 per 100 years only alongside the weight-trial 0.14 vs 0.15.
  - **GI effects:** "mostly during dose escalation and decreased over time".
  - **75/25:** from the 160-person DXA substudy, not the whole trial.
  - **SURMOUNT-4:** 335 vs 335, +14.0% average regain on placebo, still 9.9% below baseline.
  - **Hair loss:** 5.4% vs 0.9% (women 7.1%, men 0.5%).
  - **Injection-site reactions:** 6–8% by dose vs about 2% on placebo.
  - **Pen storage:** single-dose pen and vial unrefrigerated (up to 86°F) for 21 days in total. Name the device, since KwikPens differ.
  - **Pen disposal:** the guide bans *loose* pens in household trash. "Do not recycle" refers to the sharps container (S1 11-19, C1 11-20).
  - **Foundayo:** the label's top dose is 17.2 mg, with −11.1%. The 36 mg dose and −11.2% are from the trial. 10.3% stopped for adverse events, and overall dropout was higher.
- **Tag a line to a source only after you find the sentence that says it, and keep the source list clean.**
  - Our own tips, help lines and safety lines get no tag (S2 11-17, S1 11-18).
  - Source titles list only the sections actually cited (L3 11-14, S1 11-18, L1 11-19, L1 11-20).
  - Fetch every URL. Reject 4xx responses, login and DOI redirects, newsroom pages and search pages. Use PubMed for paywalled journals.
  - Known facts: the July 2023 review was EMA PRAC's; name both NANOS and the AAO; NHS "more at risk" is not the same as "more likely".
  - (About 75 findings.)

_Updated 2026-11-20 from 60 QA records (all GLP-1, 11-09 to 11-20)._

_Updated 2026-11-20 from 60 QA records._
