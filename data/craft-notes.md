_Based on 72 QA records from 2026-11-10 to 2026-11-23: 44 Shorts, 24 long-form videos and 4 carousels, all about GLP-1. Four records are new since the last pass (all 11-23):_
- _**L1 Foundayo** was held for beat drift. The render was 93% on time, and the s18 shot showed s60's "11.1%". This is its 5th failure, so it is now parked (see Everyone)._
- _**All three 11-23 Shorts** split "NOT PERSONAL ADVICE," onto its own card. That's 8 times now._
- _**S1 11-23** shipped with masking at 0.025._

_The 11-09 records have dropped out of the two-week window, so the old offset-beat QA-bug notes are gone. Only the automatic beat-sync gate counts for timing._

_**17 were held or failed:**_
- _6 for beat drift (L1 11-10, L1 11-14, L1 and L2 11-16, L1 11-21, L1 11-23)._
- _7 for audio or narration (L1 11-11, S2 11-11, S2 11-12, S2 11-13, S1 11-16, L1 11-22, S3 11-22)._
- _4 for sources or fact-check (L2 11-14 Medication Guide URL, Foundayo REVISEs 11-20 and 11-21, C1 11-20 staff note in a source date)._

_**Ignore:** any finding that cites a 170-word or 90 s Shorts limit, and any finding about the old Exp F closing cards ("Full breakdown on our channel") on Shorts dated before 11-17._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older Short scripts. Never add them back. Every Short from 11-17 to 11-23 complied._

### Motion Designer
- **Long-form: check beat sync on the render, not the plan. Also check that every shot shows its own scene's text.**
  - Re-time every cut from the final word timestamps, and do it again after any scene is regenerated.
  - Measure every beat in the rendered file and fix any cut more than 0.5 s off.
  - When two scenes share a stat or layout, the renderer has pulled the later scene's text into the earlier shot. Compare each stat or headline shot on the render against its own scene ID before handoff.
  - (6 gate holds. Plans were 96–100% on time; renders were 76–93%. 3 of the 6 showed another scene's text: s31←s23 in L2 11-16, s65←s75 in L1 11-21, s18←s60 in L1 11-23.)
- **Measure masking last, on the final file. Never hand off anything above 0.02, and aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger or whoosh on a spoken number, drug name or safety line.
  - Re-measure after every re-render. The gate does not stop every bad mix.
  - (13 pieces over 0.02 and 7 holds. **5 shipped over the limit:** S1 11-11 at 0.028, L1 11-15 at 0.022, S2 11-20 at 0.054, S1 11-22 at 0.024 and S1 11-23 at 0.025. The 08:00 Short shipped over the limit 3 times. 4 more sat at 0.019–0.020.)
- **Every scene must have voice from its first word to its last, the closing scene included. Then compare a speech-to-text transcript with the script word for word.**
  - Listen to the final scene on its own, and to the opening hook on Shorts.
  - Check every "point", number, unit, drug name, acronym, contraction and how-to phrase.
  - Regenerate any failing scene before you mix.
  - (Silent or missing lines caused 4 holds: S2 11-12, S1 11-16, L1 11-22 and S3 11-22's hook. Misreads include "point" twice, "tenmg", "sub study", "gip" and "why's" heard as "why is".)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill exactly.**
  - Before render, search captions and tags for POINT, PERCENT, HUNDRED, THOUSAND, SIXTEEN, "TYPE TWO" or "TWO DIABETES", and pronunciation spellings.
  - Spell-check every card and tag ("Studv 2", "WERE WORRIED").
  - (About 25 Shorts, the latest S3 11-23 "TYPE TWO DIABETES".)
- **Each caption card is one whole clause on 2 lines or fewer, in full-contrast text. Build the closing safety cards as fixed, pre-split cards and never run them through the auto-splitter:**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is always one card.
  - The don't-stop line is always two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" and "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN."
  - Before handoff, read the last 4 cards of every Short.
  - Never end a card on a comma, dash, colon or semicolon, or on a bare number.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, MAY, WON'T, DOESN'T, ISN'T, HAVE, THOSE, TAKE, TYPE, UNLESS or "AND IN".
  - (The safety line was split at the comma 8 times: S3 11-17, S1 11-18, S2 11-19, S2 11-20, S4 11-22, and S1, S2 and S3 11-23. The don't-stop line broke on "ISN'T" or "ARE DOING," in S4 11-22, S2 11-23 and S3 11-23. Banned card endings appeared in nearly every Short.)
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.**
  - Keep tags above y 1150 and inside both side edges.
  - Show at most 2 tags at a time, never behind the caption pill, and never a tag that repeats the caption.
  - Never render an empty bubble, ghost text, a blank or dash-placeholder rail, or the raw word "Label".
  - (About 270 overlap findings across 38 Shorts. Dash rails appeared in S2 11-20, S1 11-21 and S2 11-23; a raw "Label" in S3 11-20 and S2 11-21.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least about 40px.**
  - (About 325 off-screen and 275 tiny-text findings. The latest: L1 11-23's "Dana" and "Pharmacist" tags reached y 1135–1182, and L2 11-22 had 25 off-screen.)
- **Backdrops:**
  - Never use the rounded teal or green "cabinet strip" or the hanging grey or orange ornament circles.
  - Never put a starfield or bokeh behind a body beat or the opening frame.
  - Night beats get a dark night room, never the daytime striped room or a sunny bedroom.
  - (Cabinet strips in about 24 pieces, the latest L1 11-23. Starfield or bokeh in about 22, the latest S1 11-23 at t=0. Daytime rooms on night beats in 4 pieces.)
- **Draw people as whole, filled-in characters with a neck and shoulders, standing in front of the counter. Never let the counter, a document circle or the frame edge crop them.**
  - Lock each named character's skin tone, hair and outfit for the whole video, the opening frame included.
  - No ring, blob or outline-only heroes, no merged people, and no mascot perched on a person.
  - (Floating heads in about 29 pieces. Both Foundayo renders, L1 11-22 and L1 11-23, had the woman cropped at the counter from t=0. Continuity breaks in 7 pieces, the latest S1 11-23, whose opening hero had the wrong skin tone and hair.)
- **Fill every frame with a headline plus a labelled hero covering at least about 25% of it. Never put a stat title or headline over the hero.**
  - In a long video's first 30 s, the main character fills about a third of the frame height (too small in L2 11-16, L1 11-21, L2 11-22 and L1 11-23).
  - In the first 10 s of a Short, change the shot at least every 2.5 s.
  - Document, Rx and doctor beats need a character, with the stat shown on the document.
  - (About 220 near-empty findings. Title on the hero in 4 Shorts: S2 11-11, S1 11-16, S1 11-18 and S1 11-23.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160. Never over 160. Put the true count in the post notes (S2 11-23's stated count was wrong).
  - The spoken hook must be scene 1's narration in the script field (S3 11-22 was held for this).
  - From content date 2026-11-17, end with:
    1. "Not personal advice, so ask your prescriber." Put it in the on-screen text field too, as one entry.
    2. The emergency and don't-stop lines, when the topic needs them.
    3. The task's loop line.
  - Never write a subscribe line or "link in the description" in a Short.
- **Copy the fixed safety lines exactly, and both speak and show each one in full.**
  - An emergency line names its trigger, keeps the guide's action ("stop… and get medical help right away") and keeps "right away" (L1 11-23 s53 dropped the "stop").
  - Then add: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." For a single sign, say "that emergency sign". Never drop "or change your medicine" (S1 11-23), and never write "Otherwise".
  - Pancreatitis wording follows each drug's own Medication Guide:
    - tirzepatide: "with or without vomiting"
    - Foundayo/orforglipron: "with or without nausea or vomiting"
  - Allergy signs in full: swelling of the face, lips, tongue or throat; trouble breathing or swallowing; severe rash or itching; fainting or feeling dizzy; very rapid heartbeat.
  - Gallbladder: "Tell your healthcare provider right away".
  - Topics about the stomach, fullness or eating less name severe stomach pain that won't go away as a call-right-away sign.
  - Fluid tips keep "unless you've been told to limit fluids".
  - For chest pain or fainting, the emergency number comes first.
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits. Give each decimal its own short sentence with the unit spoken, and say "loss" or "lower" for minus figures.
  - Write units in full. No letter-by-letter acronyms, and spell out the contractions the voice expands.
  - Every spoken number names its comparator in the same or the next sentence (S2 11-23 s02).
  - Never write "now", "new", dates or "the FDA is requiring". Keep the FDA's "potential".
- **Keep each finding at its source's exact number, unit, scope, verb and hedge, recaps included.**
  - "Adverse events" are never "side effects". A share of people is never an "average".
  - Never add "most", "mostly", "many", "commonly", "similar", "myth", "a few days" or a softer verb. GI effects were "higher during dose escalation and decreased over time".
  - Never present slower stomach emptying as the cause. Right after a symptom stat, add the label's "diminishes over time" sentence.
  - A single trial is never "not a fluke" or confirmed (S2 11-23).
  - Never compare separate trials as if they were head-to-head, and never call our own arithmetic "the paper's result".
  - (About 130 findings, the latest L1, S1 and S2 11-23.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and scope, shows the whole of sentence 1's answer including its hedge, and never shows a point before it is spoken (L1 11-23, L2 11-22).
  - Every stat card names the measure, the drug and dose, both groups, the full population and the timeframe (missing in L1 11-23 s18 and s60, S2 11-23 s02 and S4 11-22 s02).
  - Never put an unverified detail on a card, for example "capsule".
  - Never write "no diabetes" for a population, and never drop "weight-related" (S3 and L1 11-23). Low blood sugar cases are "in adults without type 2 diabetes".
  - (About 106 findings.)

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.**
  - Keep each trial's full population in the recap.
  - Stat cards name the drug, both groups and the measure.
  - Generic drug hashtags only, placed before the disclaimer.
  - Every source gets its real revised date, never a staff note.
  - (All 4 carousels had findings. C1 11-20 was held.)

### Social Copywriter & packaging
- **Long-form descriptions are complete viewer copy, 1,250 characters or fewer.**
  - Line 1 stays empty on every YouTube description, Shorts included.
  - Order: the safety block (scoped don't-stop line plus disclaimer), then a quick answer naming the drug and arm, then 2–3 sources.
  - The field ends exactly on "…whether it's right for you." with no markup after it.
  - No placeholders ("MM:SS", a bare "▶ Watch next:"). Add chapters only with real timestamps starting at 00:00.
  - (Cut off, leaked or missing the ending 6 times: 1 hold and 3 REVISEs. L2 11-22 was at the limit.)
- **Don't write the watch-next line yourself; the publisher adds it. Name the target in the post notes, following the playbook's current linking list:**
  - New broad videos and Sleep Apnea → Side Effects
  - First Month → Months 2–6 (Aqv2dOU-SmM only); Months 2–6 → How Long
  - Mounjaro vs Ozempic → Zepbound vs Wegovy; old Foundayo → new Foundayo once it's live
  - Every Short logs one target long video (Exp G, until 2026-12-14).
  - Never the channel home page, and never the duplicate MQqAwUKAKSI.
  - (Missing or wrong targets in 5 pieces.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it. Hashtags came after it 5 times.
  - The don't-stop line follows the named emergency signs, never a bare "emergency sign".
  - Copy the emergency line in the script's own words, keeping "with or without vomiting", "Stop tirzepatide" and who to call. It was paraphrased in TikTok S3 11-23, S4 11-22 and S1 11-11.
  - Threads stays at about 300 characters: cut facts, never a safety line. (About 42 pieces over, including S2 and S3 11-23.)
- **Copy facts, qualifiers, devices, sources and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep the "US label" attribution and the device scope.
  - The pinned comment names the trial ("the label's Trial 1", never "the same trial") with its full population (L1 11-15, L2 11-16, L1 11-22, L1 11-23).
  - Never put our own tips under "the label says" or "studies show" (IG S3 11-23, IG S3 11-15).
  - Never add openers the script doesn't have: no validation hooks, no questions and no "actually". (8 times since 11-18.)
  - (About 165 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope, and promise only what the content covers.**
  - No cause, timeframe or "common" claim the Short doesn't deliver: "after the big dinner" in S3 11-23, "First Weeks" in S3 11-13, stomach pain as common in S2 11-21.
  - A stat names its measure. Name the drug in the thumbnail subtext.
  - One save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports. No brand tags (#Foundayo in S1 11-23, #Zepbound), and no topic or trial tags (#GLP1, #sideeffects, #injectionsite, #PatientSafety, #STEP9, #KneeOsteoarthritis).
  - (About 65 pieces.)

### Everyone
- **Fix the queued long videos' known faults before you re-render, and never re-produce a video that is already live.** Check the live list first: Months 2–6 has been live since 11-16, and a duplicate was made on 11-20.
  - **Foundayo What to Expect is parked (5 failures: 11-11, 11-20, 11-21, 11-22, 11-23).** Per the playbook, don't re-render it. Write a fresh 9-minute script from the label (until 2026-11-30), and carry over every verified fix:
    - 2.7% placebo and "adverse events"
    - the label's escalation wording instead of "mostly"
    - headache, fatigue and hair loss in the common list
    - "with or without nausea or vomiting", and "potential"
    - "Stop taking FOUNDAYO and get medical help right away"
    - no "capsule"
    - the full Trial 1 population on every stat card
    - a unique stat per scene, so 11.1% doesn't repeat
  - **Serious Risks (held 11-21; until 2026-11-30):**
    - Re-time it and remove the duplicate "6.4 vs 3.8" at s65.
    - s8: hold the sleep apnea card until s9 says it.
    - s36: say "a sulfonylurea".
    - s44: give the full allergy list, in the description too.
    - s77: say "MTC or MEN 2".
    - s35 and s72: say low blood sugar is also reported in adults without type 2 diabetes.
    - Use the real Medication Guide URL.
  - **S3 11-22 (holiday slot, until 2026-11-27):** put the hook into the script and subtitles, remix to 0.02 or lower, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10, which was held for beat drift):** re-time both on the render before they ship.
- **Every source needs its own working URL and a real, live revised date. Never ship a placeholder, a bare year or a staff note.**
  - The Medication Guide and the IFU each get their own URL, never a PI anchor.
  - Open the document and find the quoted sentence before you cite it. If a PDF won't load, paraphrase and cite the PI section with its known date.
  - Known dates: Zepbound PI 28 Aug 2026; Mounjaro PI 27 Aug 2026; Foundayo label rev 7/2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023; NHS nausea page 17 Nov 2023.
  - (2 failures and 6 placeholder or bare-year dates, the latest S1 and S2 11-23.)
- **Give every result its exact scope.**
  - **Obesity trials:** adults with obesity, or overweight plus a weight-related condition, without diabetes. SURMOUNT-5 excluded any type of diabetes.
  - **SELECT:** preexisting cardiovascular disease (heart disease, stroke or PAD) and a BMI of 27 or more, without diabetes. Endpoint: CV death, nonfatal heart attack or nonfatal stroke.
  - **Zepbound Study 1 vs Study 2:** Study 1 excluded type 2 diabetes; Study 2 was type 2 diabetes only. Never drop the sleep apnea use.
  - **Low blood sugar:** higher with insulin or a sulfonylurea, and also reported in adults without type 2 diabetes.
  - **Pancreatitis:** give 0.23 vs 0.11 per 100 years only alongside the weight-trial 0.14 vs 0.15.
  - **75/25:** from the 160-person DXA substudy.
  - **SURMOUNT-4:** 335 vs 335, +14.0% regain on placebo, still 9.9% below baseline.
  - **Hair loss:** 5.4% vs 0.9%; women 7.1% vs 1.3%, men 0.5% vs 0%.
  - **Injection-site reactions:** 6–8% by dose vs about 2%.
  - **Pen:** 21 days unrefrigerated in total (single-dose pen and vial; KwikPens differ). The inspection step is a general check before each use. The guide bans *loose* pens in household trash.
  - **Foundayo:** the label's top dose is 17.2 mg (−11.1%, Trial 1). The trial's 36 mg gave −11.2%, with 10.3% vs 2.7% stopping for adverse events.
- **Tag a line to a source only after you find the sentence that says it.**
  - Our own tips, help lines and safety lines get no tag.
  - Source titles list only the sections actually cited, with section numbers (S3 11-23 hypoglycemia).
  - Reject 4xx, login and DOI redirects, newsroom and search pages. Use PubMed for paywalled journals.
  - (About 80 findings.)

_Updated 2026-11-23 from 72 QA records (all GLP-1, 11-10 to 11-23)._

_Updated 2026-11-23 from 72 QA records._
