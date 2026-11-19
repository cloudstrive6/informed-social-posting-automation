_Based on 60 QA records from 2026-11-06 to 2026-11-19: 37 Shorts, 19 long-form videos and 4 carousels, all about GLP-1. **11 were held or failed:** 5 for beat drift, 5 for audio or narration, and 1 for a wrong source. 4 long-form videos also got a packaging REVISE. The 11-05 records have aged out of the window, so evidence that came only from them has been dropped. The notes are now flattened to 25 rules._

_**New in this pass:** 4 records from 11-19, and all 4 shipped._
- _**Weight Loss in the Trials (L1 11-19) passed beat sync after it was re-timed from the final word timestamps.** All 3 re-timed renders have now passed (11-17, 11-18 and 11-19). Its masking was 0.007. Its pinned comment, recap scope and watch-next faults from 11-16 are fixed, so it has come off the queue list._
- _Problems that came back on 11-19:_
  - _near-empty long-form frames (7 sparse)_
  - _the safety card split in two (S2)_
  - _floating heads, blob heroes, ornament circles and starfield (S2, S3)_
  - _a character's hair changing between shots (S2)_
  - _placeholder source dates (S1)_
  - _a validation hook in a caption (S1)_
  - _the trial population cut to "no diabetes" (S2)_
  - _TTS misreads ("tenmg", "sub study") (L1)_

_**Ignore:**_
- _The Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09. They came from a QA bug; only the automatic beat-sync gate counts._
- _Any finding that cites a 170-word or 90 s Shorts limit._
- _Any finding about the old Exp F closing cards._

_**Shorts closing (owner OK 2026-11-12, for content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older Short scripts. Never add them back. All 11-17 to 11-19 Shorts complied._

### Motion Designer
- **Long-form: check beat sync on the render, not the plan.** Re-time every cut from the final word timestamps after the final narration, and again after any scene is regenerated. Then measure every beat in the rendered file, fix any cut more than 0.5 s off, and make sure no shot shows another scene's text. (5 gate holds, with plans at 96–100% on time but renders at 76–91%. Wrong-scene shots in L1 11-09 and L2 11-16. All 3 re-timed renders passed: 11-17, 11-18, 11-19.)
- **Measure masking last, on the final file, and aim well below 0.02. Never hand off anything above it.** Duck the music under all narration. Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line. Re-measure after every re-render. (9 pieces over 0.02 and 4 holds: S2 11-11 0.061, S2 11-13 0.047 with stingers on the numbers, S1 11-16 0.031, L1 11-11 0.022. L1 11-18 sat at exactly 0.02.)
- **Check that every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.** Check every "point", number, unit, drug name and how-to phrase. Regenerate any failing scene before you mix. (4 holds: silent closing scenes in S2 11-12, "the gray plunger is visible" missing in S1 11-16, "of the day" in L1 11-11. Also "point" dropped in L1 11-13 and S2 11-15, and "tenmg" and "sub study" in L1 11-19.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers are digits that match the stat pill exactly ("14.8%", "25–29%", "1.2%", "<6%"). Before render, search the captions for POINT, PERCENT, HUNDRED, THOUSAND, spelled-out numbers and pronunciation spellings ("NAY-ON", "SULFONYL UREA"). (About 20 Shorts, latest S2 11-17.)
- **Each caption card is one whole clause on 2 lines or fewer.**
  - Never split a word, number or phrase across cards.
  - Never end a card on a comma, dash, colon, THE, A, ABOUT, HOW, MAY, WON'T, DOESN'T, HAVE, THOSE, TAKE, TYPE, UNLESS or "AND IN", or on a bare number.
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is always one card ending in a full stop.
  - (Nearly every Short, latest S2 11-19 ending on a dash. The safety card was split 3 times: S3 11-17, S1 11-18, S2 11-19.)
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.** Keep tags above y 1150 and inside both side edges. Show at most 2 at a time, never put one behind the caption pill, and drop any tag that repeats the caption. Never leave an empty or ghosted bubble or ghost text. (About 230 overlap findings across 27 Shorts, latest ghost text in S1 11-19. Left-edge clips in S4 11-16 and S2 11-17.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least ~40px.** Name, group and dose tags ("Diet", "Adults", "Placebo group", "15 mg arm") keep clipping past y 1080, and labels keep rendering at 22–26px. (About 220 off-screen and 250 tiny-text findings, latest L1 11-19 with 10 off-screen.)
- **Never use these backdrops, and match the backdrop to the beat's mood.** Banned: the rounded teal or green "cabinet strip", the hanging grey or orange ornament circles (on any mood), and a starfield on a body beat. A night beat gets a dark night room, never the daytime striped room plus a moon icon. (Cabinet strips in about 20 pieces, latest L1 and S2 11-18. Ornament circles latest S3 11-19. Starfield on body beats in about 17, latest S3 11-19. Night beats in a day room 4 times, latest L1 11-18.)
- **Draw people as whole characters with a neck and shoulders, and lock each named character's skin tone, hair and outfit for the whole video.**
  - Never use a ring, donut or blob as the hero.
  - Never merge two people or perch a mascot on a person.
  - Risk lines get a calm, neutral mascot.
  - (Floating heads in about 19 pieces, latest S2 and S3 11-19. Blob heroes in about 13, latest S3 11-19. Continuity breaks in L1 11-11, L1 11-17 and S2 11-19. Merged people in S1 11-18 and S2 11-19.)
- **Fill every frame with a headline plus a labelled hero covering at least ~25% of it, starting with the opening frame.**
  - At t=0 in a Short, the headline sits clear of the character's head.
  - Change the shot at least every 2.5 s in a Short's first 10 s.
  - In a long video's first 30 s, the main character fills about a third of the frame height.
  - Document, package and doctor beats on a plain gradient need a character, with the stat on the document. Never repeat the same lone prop in consecutive shots.
  - (About 150 near-empty findings, latest L1 11-19 with 7 sparse frames, including the same lone package 3 shots in a row. Text on the hero at t=0 in S1 11-16 and S1 11-18. Static openings in S3 11-11 and S2 11-18.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.** Tight arm: 90–120 words. Standard arm: 135–160. Never go over 160 (S3 11-18 landed at exactly 160). From content date 2026-11-17, end with:
  1. "Not personal advice, so ask your prescriber." This also goes in the on-screen text field as one entry.
  2. The emergency and don't-stop lines, when the topic needs them.
  3. The task's last line, which loops back to sentence 1.

  Never write a subscribe line or "link in the description".
- **Copy the fixed safety lines exactly, and speak each one and show it on screen.**
  - An emergency line names its trigger and keeps "right away", then: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise".
  - Any stomach, fullness or eating-less topic names severe stomach pain that won't go away as a "call right away" sign (S1 11-06, S2 11-18).
  - Fluid tips keep "unless you've been told to limit fluids" (L1 11-17, S2 11-17).
  - For chest pain or fainting, the emergency number comes first (S1 11-12, C1 11-17).
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - Give each decimal its own short sentence, with the unit spoken.
  - Say "loss" or "lower" for minus figures (L1 11-16).
  - Write units out in full ("ten milligrams"), and avoid compound words the voice may split (L1 11-19).
  - Never write "now", "this week", "new" or dates (L2 11-11, L3 11-16).
  - Help lines cover all four markets (L1 11-06, S1 11-17).
- **Keep each finding at its source's exact unit, scope, verb and hedge, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe.
  - A share of people is never an "average".
  - Never present slower stomach emptying as the cause of an effect (no "so", no "that's why").
  - Don't compare different trials as if they were head-to-head.
  - Never add "most", "many", "commonly", "similar", "myth", "a few days" or a softer verb ("fades" for "diminishes", S3 11-19).
  - Never write "the paper says" until you've found the sentence (L2 11-16, L1 11-19).
  - (About 100 findings. Recaps lost scope in L3 11-14, L2 11-16, C1 11-17 and L1 11-18.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug, the scope and the answer from sentence 1 (S3 11-19).
  - Every stat card names the drug, the dose (or "by dose"), both groups (say "placebo" for the zero), the full population and the timeframe.
  - Never shorten the population to "no diabetes" (S2 11-19).
  - On-screen text is never stronger or narrower than the narration.
  - (About 80 findings, latest S2 and S3 11-19.)

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.**
  - Keep each trial's full population in the recap slide.
  - Use a stat card that names the drug, both groups and the measure.
  - Use generic drug hashtags only.
  - Give every source its full revised date.
  - Use one save ask, and end on the exact disclaimer plus the prescriber line.
  - (All 4 carousels had findings, latest C1 11-17.)

### Social Copywriter & packaging
- **Long-form descriptions must be complete, viewer copy only, and 1,250 characters or fewer.**
  - Line 1 stays empty on every YouTube description, Shorts included.
  - Order: safety block (scoped don't-stop line plus disclaimer), then a quick answer, then 2–3 sources.
  - The field's last characters are "…whether it's right for you.", with no markup or tool text after it.
  - Never type a placeholder ("MM:SS", a bare "▶ Watch next:").
  - Add chapters only with real timestamps from 00:00. Otherwise leave them out and say so in the post notes.
  - (6 cut off, leaked or missing the ending: 1 hold and 3 REVISEs, latest L1 11-17. Over the limit in 3. Line 1 filled in about 6 Shorts.)
- **Don't write the watch-next line yourself; the publisher adds it. Name the target in the post notes.**
  - New broad videos → Side Effects
  - Mounjaro vs Zepbound and Foundayo → How It Works
  - First Month → Months 2–6

  Never use the channel home page. (5 pieces, latest L1 11-17. L1 11-19 got it right.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Put hashtags and the don't-stop line before it.
  - Copy safety lines word for word: keep "right away", "healthcare provider", "with or without vomiting" and "unless you've been told to limit fluids". Never write "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line. If the safety lines alone run past 300, ship them plus one short fact.
  - (Threads over the limit in about 35 pieces, latest S3 11-19.)
- **Copy facts, qualifiers, arms and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep "top dose", "all doses combined", "Phase 2b", "tight-fitting, puncture-resistant" and the full trial population.
  - The pinned comment never cuts the population to "adults", and on side-effect and comparison posts it carries the scoped don't-stop or don't-switch line (L1 11-15, L2 11-16, L1 11-18).
  - Never credit our tips to a study.
  - Never add validation hooks or openers the script doesn't have ("You're not imagining it", "You're not wrong to notice", "Exactly", "yet").
  - (About 145 findings, in every batch, latest S1 11-19.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat in a title names its measure.
  - The thumbnail headline must make sense on its own (no bare "IT", L1 11-19).
  - Don't promise a timeframe the video doesn't give.
  - Use one save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports. No #Zepbound, #GLP1 on a single-drug post, #sideeffects, #dizziness, #PatientSafety, #WeightManagement or #Type2Diabetes.
  - (About 55 pieces.)

### Everyone
- **Fix the queued long videos' known faults before you re-render or resubmit, and re-time from the final word timestamps.**
  - **Foundayo (11-11):** masking 0.022, description cut off, Dana's skin and hair change between shots.
  - **Serious Risks (11-14):** needs a real Medication Guide URL, name the warning "Suicidal Behavior and Ideation", and show the weight-trial pancreatitis figure.
  - **Backups, Injection Site (11-09) and Burping (11-10):** beat drift.
- **The Medication Guide and the IFU each need their own working URL, never the PI page or a PI anchor.** Open it and find the quoted sentence before you cite it. If it won't load, paraphrase without quotes and tag the PI section. If the keyword or the scope covers Mounjaro, also cite Mounjaro's own label or IFU. (This caused the L2 11-14 failure. About 11 pieces, latest S1 11-19.)
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
  - **Foundayo:** label top dose 17.2 mg with −11.1%. The 36 mg dose and −11.2% are from the trial.
- **Tag a line to a source only after you find the sentence that says it, and keep the source list clean.**
  - Our own tips, help lines and safety lines get no tag (latest S1 11-18).
  - Source titles list only the sections actually cited (L3 11-14, S2 11-16, S1 11-18, L1 11-19).
  - Fetch every URL. Reject 4xx responses, login and DOI redirects, newsroom pages and search pages. Use PubMed for paywalled journals.
  - Every entry carries its live revised date, never a year or placeholder (S2 11-17, S1 11-19). Known dates: Zepbound PI 28 Aug 2026, Mounjaro PI 27 Aug 2026, NHS diarrhoea pages 01 May 2026 and 21 Dec 2023, NHS nausea page 17 Nov 2023.
  - Known facts: the July 2023 review was EMA PRAC's; name both NANOS and the AAO; NHS "more at risk" is not the same as "more likely".
  - (About 75 findings.)

_Updated 2026-11-19 from 60 QA records (all GLP-1, 11-06 to 11-19)._

_Updated 2026-11-19 from 60 QA records._
