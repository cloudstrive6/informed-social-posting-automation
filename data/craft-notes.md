_Based on 67 QA records from 2026-11-09 to 2026-11-21: 40 Shorts, 23 long-form videos and 4 carousels, all about GLP-1._

_**15 were held or failed:**_
- _6 for beat drift. The latest is Serious Risks, L1 11-21: the render had 91% of cuts on time, and the s65 shot showed s75's text._
- _5 for audio or narration._
- _4 for sources or fact-check: a wrong Medication Guide URL (L2 11-14), two fact-check REVISEs on Foundayo (L1 11-20, then L2 11-21 for a wrong placebo figure) and a staff note left in a source date (C1 11-20)._

_4 long-form videos also got a packaging REVISE._

_**New in this pass:** L3 11-21 (Zepbound vs Wegovy) shipped. It repeats known faults: a TTS miss ("g i p" was read as "gip"), floating heads in the hero frame, 30 off-screen tags and 15 near-empty frames. It also had several script slips: "side effects" used for "adverse events", our own subtraction presented as "the paper's main result", the obesity half of the population missing from the s04 card, and a generic name set against a brand name on the opening card._

_**Ignore:**_
- _The Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09. They came from a QA bug (frames were shown in the wrong order). The published videos were in sync and showed the disclaimer. Only the automatic beat-sync gate counts._
- _Any finding that cites a 170-word or 90 s Shorts limit._
- _Any finding about the old Exp F closing cards ("FULL BREAKDOWN ON OUR CHANNEL,", "TIRZEPATIDE QUESTION FROM THE") on Shorts dated before 11-17._

_**Shorts closing (owner OK 2026-11-12, for content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older Short scripts. Never add them back. Every Short from 11-17 to 11-21 complied._

### Motion Designer
- **Long-form: check beat sync on the render, not the plan. Re-time after every narration or scene change.**
  - Re-time every cut from the final word timestamps after the final narration, and again after any scene is regenerated.
  - The plan itself must be 100% on time. 11-21 went in at 82 of 83.
  - Then measure every beat in the rendered file and fix any cut more than 0.5 s off.
  - Scan every shot for another scene's text, especially repeated stat cards such as "6.4 vs 3.8".
  - (6 gate holds: 11-09, 11-10, 11-14, L1 and L2 11-16, L1 11-21. Plans were 96–100% on time, but renders were only 76–91%.)
- **Measure masking last, on the final file, and never hand off anything above 0.02. Aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger or whoosh on a spoken number, drug name or safety line.
  - Re-measure after every re-render. The gate won't always stop a bad mix.
  - (9 pieces over 0.02 and 4 holds: S2 11-11 0.061, S2 11-13 0.047, S1 11-16 0.031, L1 11-11 0.022. **S2 11-20 shipped at 0.054.** Every render on 11-21 was at 0.016 or lower.)
- **Check that every scene has voice right to the end. Then compare a speech-to-text transcript with the script word for word.**
  - Check every "point", number, unit, drug name, acronym and how-to phrase.
  - Regenerate any failing scene before you mix.
  - (3 holds: S2 11-12, S1 11-16, L1 11-11. Also "point" dropped in L1 11-13 and S2 11-15, "tenmg" and "sub study" in L1 11-19, and "g i p" read as "gip" in L3 11-21.)
- **Build captions and tags from the script's on-screen text field, never from the narration.**
  - Numbers are digits that match the stat pill exactly ("14.8%", "25–29%", "<6%", "16", "type 2").
  - Before render, search captions and tags for POINT, PERCENT, HUNDRED, THOUSAND, SIXTEEN, "TWO DIABETES", any other spelled-out number and pronunciation spellings ("NAY-ON", "SULFONYL UREA").
  - (About 22 Shorts, latest S3 11-21.)
- **Each caption card is one whole clause on 2 lines or fewer.**
  - Never split a word, number or phrase across cards (not "IN 6 TO 8").
  - Never end a card on a comma, dash or colon, on a bare number, or on THE, A, AS, CAN, ABOUT, HOW, MAY, WON'T, DOESN'T, HAVE, THOSE, TAKE, TYPE, UNLESS or "AND IN".
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is always one card ending in a full stop.
  - (Nearly every Short, including S2 and S3 11-21. The safety card was split 4 times, latest S2 11-20.)
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.**
  - Keep tags above y 1150 and inside both side edges.
  - Show at most 2 tags at a time. Never put one behind the caption pill, and drop any tag that repeats the caption.
  - Never render an empty bubble, ghost text, a blank or dash-placeholder tag rail, or a raw template word such as "Label".
  - (About 250 overlap findings across 32 Shorts. "Label" placeholder in S3 11-20 and S2 11-21. Blank dash rails in S2 11-20 and S1 11-21.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least ~40px.**
  - Name, group, study and dose tags ("Diet", "Adults", "Placebo group", "Study 1", "Women", "15 mg arm", "Semaglutide", "Tirzepatide") keep clipping past y 1080.
  - Labels keep rendering at 22–26px.
  - Spell-check tag text ("Studv 2" in L2 11-20).
  - (About 280 off-screen and 265 tiny-text findings, latest L3 11-21 with 30 off-screen.)
- **Never use these backdrops, and match the backdrop to the beat's mood.**
  - Banned: the rounded teal or green "cabinet strip", the hanging grey or orange ornament circles (on any mood), and a starfield or bokeh on a body beat.
  - A night beat gets a dark night room, never the daytime striped room plus a moon icon.
  - (Cabinet strips in about 21 pieces, latest L1 11-21. Ornament circles in many pieces, latest S1 and S2 11-21. Starfield on body beats in about 19 pieces, latest S1 11-21.)
- **Draw people as whole, filled-in characters with a neck and shoulders, never cropped at the frame edge or a counter. Lock each named character's skin tone, hair and outfit for the whole video.**
  - Never use a ring, donut, blob or outline-only figure as the hero.
  - Never merge or overlap two people, and never perch a mascot on a person.
  - Don't bring in a new look-alike character mid-Short.
  - (Floating heads in about 24 pieces, latest L1, S1, S3 and L3 11-21, including L3's hero frame. Blob heroes in about 15. Continuity breaks in 6, latest S1 11-21. Merged people or perched mascots in 5, latest S1 11-21.)
- **Fill every frame with a headline plus a labelled hero covering at least ~25% of it, starting with the opening frame.**
  - At t=0 in a Short, the headline sits clear of the character's head.
  - In a Short's first 10 s, change the shot at least every 2.5 s.
  - In a long video's first 30 s, the main character fills about a third of the frame height. It was too small in L2 11-16 and L1 11-21.
  - Document, package, Rx and doctor beats on a plain gradient need a character, with the stat on the document.
  - Never repeat the same lone prop in consecutive shots.
  - (About 190 near-empty findings, latest L1 11-21 with 12 and L3 11-21 with 15.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160. Never go over 160.
  - From content date 2026-11-17, end with:
    1. "Not personal advice, so ask your prescriber." This also goes in the on-screen text field as one entry.
    2. The emergency and don't-stop lines, when the topic needs them.
    3. The task's last line, which loops back to sentence 1.
  - Never write a subscribe line or "link in the description" in a Short.
- **Copy the fixed safety lines exactly, and speak each one and show it on screen. Never add or drop a symptom.**
  - An emergency line names its trigger and keeps "right away". Then add: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise". The on-screen card keeps that scope too (S2 11-21). Change only the opener so it fits the scene. If the scene names a single sign, say "that emergency sign" (L3 11-21).
  - Pancreatitis: severe pain in your stomach area that won't go away, "with or without vomiting". Never add "nausea" (L2 11-21).
  - Serious allergic reaction signs follow the Medication Guide in full: swelling of the face, lips, tongue or throat; trouble breathing or swallowing; severe rash or itching; fainting or feeling dizzy; very rapid heartbeat (S1 11-20, L1 11-21).
  - The gallbladder line is "Tell your healthcare provider right away" (S2 11-21).
  - Any stomach, fullness or eating-less topic names severe stomach pain that won't go away as a "call right away" sign, on screen too.
  - Fluid tips keep "unless you've been told to limit fluids".
  - For chest pain or fainting, the emergency number comes first.
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits in narration. Give each decimal its own short sentence, with the unit spoken.
  - Say "loss" or "lower" for minus figures.
  - Write units out in full ("ten milligrams"). Avoid compound words the voice may split, and avoid acronyms spelled letter by letter ("g i p"). Use the full name or a form the voice reads reliably, then check it on the transcript.
  - Every spoken number names its comparator, subgroup splits included: "versus about 2 in 100 on placebo"; for hair by sex, women 7.1% vs 1.3% and men 0.5% vs 0% on placebo. (S1 11-20, L2 11-20.)
  - Never write "now", "this week", "new", dates or present-tense regulatory moves like "the FDA is requiring". Keep the FDA's "potential" (L2 11-21).
  - Help lines cover all four markets.
- **Keep each finding at its source's exact number, unit, scope, verb and hedge, including in recaps.**
  - Re-read every figure against the abstract or label table before you hand off. L2 11-21 failed for writing 2.6% instead of 2.7%.
  - Each number names its measure, drug and arm, comparator, population and timeframe.
  - A share of people is never an "average".
  - "Adverse events" are never "side effects" (L1 11-20, L3 11-21), and "didn't stop because of adverse events" is never "kept going".
  - Never present slower stomach emptying as the cause of an effect.
  - Don't compare different trials as if they were head-to-head.
  - Never add "most", "many", "commonly", "similar", "myth", "a few days" or a softer verb.
  - Recaps keep the label's exact terms: "MTC or MEN 2", not "thyroid cancer" (L1 11-21).
  - Never write "the paper says" or "the paper's main result" until you've found the sentence. A difference you worked out yourself is presented as our own arithmetic, never as the paper's (L2 11-16, L3 11-21).
  - (About 120 findings. Recaps lost scope in 5 pieces, latest L1 11-21.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug, the scope and the answer from sentence 1. It says nothing the narration doesn't, and it never shows a point before it is spoken (L1 11-21 showed the sleep apnea use early).
  - Head-to-head cards compare like with like: generic against generic, or brand against brand (L3 11-21).
  - Every stat card names the measure, the drug, the dose (or "by dose"), both groups, the full population and the timeframe.
  - Never shorten the population to "no diabetes" or "adults without diabetes", and never drop "weight-related" (L3 11-21).
  - On-screen text is never stronger or narrower than the narration.
  - (About 95 findings, latest L1 and L3 11-21.)

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.**
  - Keep each trial's full population in the recap slide.
  - Use a stat card that names the drug, both groups and the measure.
  - Use generic drug hashtags only, placed before the disclaimer.
  - Give every source its real revised date, never a placeholder or a staff note.
  - (All 4 carousels had findings. C1 11-20 was held for a staff note in a source date and for dropping "loose" from the pen line.)

### Social Copywriter & packaging
- **Long-form descriptions must be complete, viewer copy only, and 1,250 characters or fewer.**
  - Line 1 stays empty on every YouTube description, Shorts included.
  - Order: safety block (scoped don't-stop line plus disclaimer), then a quick answer that names the drug and arm, then 2–3 sources.
  - The field's last characters are "…whether it's right for you.", with no markup or tool text after it.
  - Never type a placeholder ("MM:SS", a bare "▶ Watch next:").
  - Add chapters only with real timestamps from 00:00. Otherwise leave them out and say so in the post notes.
  - (Cut off, leaked or missing the ending 6 times, causing 1 hold and 3 REVISEs. Over the limit in 3.)
- **Don't write the watch-next line yourself; the publisher adds it. Name the target in the post notes.**
  - New broad videos → Side Effects
  - Mounjaro vs Zepbound and Foundayo → How It Works
  - First Month → Months 2–6
  - Never use the channel home page.
  - (5 pieces. L1 11-19 got it right.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Put hashtags and the don't-stop line before it (hashtags came after it in 4 pieces, latest C1 11-20).
  - Copy safety lines word for word: keep "right away", "healthcare provider", "with or without vomiting" and "unless you've been told to limit fluids". Never write "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters. Cut facts, never a safety line. If the safety lines alone run past 300, ship them plus one short fact.
  - (Threads over the limit in about 37 pieces, latest S3 11-21.)
- **Copy facts, qualifiers, arms, devices and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep "top dose", "all doses combined", "Phase 2b", "for best quality", "tight-fitting, puncture-resistant", "loose", the device scope ("US single-dose pen", "KwikPens and vials have their own leaflets") and the full trial population.
  - The pinned comment never cuts the population to "adults". On side-effect and comparison posts it carries the scoped don't-stop or don't-switch line.
  - Never credit our tips to a study.
  - Never add openers the script doesn't have: no validation hooks and no questions (FB S2 11-21, TikTok S3 11-21). Don't add "yet" either.
  - (About 155 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat in a title names its measure.
  - Never make a warning sign sound like the common effect. S2 11-21 framed stomach pain as common; only nausea, vomiting and diarrhea are.
  - The thumbnail headline must make sense on its own. Name the drug in the thumbnail subtext.
  - Don't promise a timeframe the video doesn't give.
  - Use one save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports. No brand, class, topic or trend tags (#Zepbound, #GLP1 on a single-drug post, #sideeffects, #injectionsite, #dizziness, #PatientSafety, #WeightManagement, #Type2Diabetes).
  - (About 60 pieces, latest S2 11-21.)

### Everyone
- **Fix the queued long videos' known faults before you re-render or resubmit, and never re-produce a video that is already live.**
  - **Months 2–6 has been live since 11-16.** A second version was produced on 11-20 (L2). Check the live list before you start a long video, and flag any duplicate to the owner.
  - **Serious Risks (held 11-21 for beat drift):**
    - Re-time it from the final word timestamps, and remove the duplicate "6.4 vs 3.8" card at s65.
    - s8: hold the sleep apnea card until s9 says it.
    - s36: say "a sulfonylurea" (the label doesn't name glipizide or glimepiride).
    - s44: give the full allergy-sign list, in the description's safety block too.
    - s77: say "MTC or MEN 2".
    - s35 and s72: add that the label reports low blood sugar in adults without type 2 diabetes.
    - Use the real Medication Guide URL, and keep the weight-trial pancreatitis figure.
  - **Foundayo (fact-check REVISE on 11-20 and again on 11-21):**
    - s28: the placebo figure for stopping because of adverse events is 2.7%, not 2.6%. 10.3% on 36 mg is correct.
    - s42: use the Medication Guide's pancreatitis wording exactly, with no added "nausea".
    - s54: drop "is requiring"; keep the FDA's "potential" increased risk.
    - Keep the 11-20 fixes: "didn't stop because of adverse events" (never "kept going"), "adverse events", "weight-related", the drug, timeframe and measure on the s31 and s32 cards, "the label's Trial 1, in adults without diabetes", and your own history of MTC and MEN 2.
    - On render, fix the 11-11 faults: masking 0.022, the cut-off description, and Dana's skin and hair changing between shots.
  - **Backups, Injection Site (11-09) and Burping (11-10):** both were held for beat drift. Re-time them before they ship.
- **Every source needs its own working URL and a real, live revised date. Never ship a placeholder, a bare year or a note to staff in any field.**
  - The Medication Guide and the IFU each need their own URL, never the PI page or a PI anchor.
  - Open the document and find the quoted sentence before you cite it.
  - If a document won't load or its date can't be read (the pen IFU PDFs keep failing), paraphrase without quotes and cite the PI section with its known date instead.
  - If the keyword or the scope covers Mounjaro, also cite Mounjaro's own label or IFU.
  - Known dates:
    - Zepbound PI 28 Aug 2026
    - Mounjaro PI 27 Aug 2026
    - Foundayo label rev 7/2026
    - NHS diarrhoea pages 01 May 2026 and 21 Dec 2023
    - NHS nausea page 17 Nov 2023
  - (2 failures: L2 11-14 and C1 11-20. Placeholder or missing dates in 4 more.)
- **Give every result its exact scope.**
  - **Obesity trials** (SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1): adults with obesity, or overweight plus a weight-related condition, without diabetes. SURMOUNT-5 excluded diabetes of any type, not just type 2.
  - **SELECT:** adults with preexisting cardiovascular disease (heart disease, stroke or peripheral artery disease) and a BMI of 27 or more, without diabetes. The endpoint is cardiovascular death, nonfatal heart attack or nonfatal stroke (L3 11-21).
  - **Zepbound Study 1 vs Study 2:** Study 1 excluded type 2 diabetes; Study 2 enrolled only people with it.
  - **Zepbound's approved uses:** weight reduction and long-term maintenance, plus moderate-to-severe obstructive sleep apnea in adults with obesity. Never drop the sleep apnea use.
  - **Low blood sugar:** higher risk with diabetes plus insulin or a sulfonylurea. Say that in the spoken line too. Never imply the risk is zero without diabetes (the label reports cases).
  - **Pancreatitis:** give 0.23 vs 0.11 per 100 years only alongside the weight-trial 0.14 vs 0.15.
  - **GI effects:** "mostly during dose escalation and decreased over time".
  - **75/25:** from the 160-person DXA substudy, not the whole trial.
  - **SURMOUNT-4:** 335 vs 335, +14.0% average regain on placebo, still 9.9% below baseline.
  - **Hair loss:** 5.4% vs 0.9% on placebo; women 7.1% vs 1.3%, men 0.5% vs 0%.
  - **Injection-site reactions:** 6–8% by dose vs about 2% on placebo.
  - **Pen storage:** the single-dose pen and vial can be unrefrigerated (up to 86°F) for 21 days in total. Name the device, since KwikPens differ.
  - **Pen checks:** the label's inspection step is a general check before every use, not drop advice (S1 11-21).
  - **Pen disposal:** the guide bans *loose* pens in household trash. "Do not recycle" refers to the sharps container.
  - **Foundayo:** the label's top dose is 17.2 mg, with −11.1%. The 36 mg dose and −11.2% come from the trial. 10.3% stopped for adverse events vs 2.7% on placebo, and overall dropout was higher.
- **Tag a line to a source only after you find the sentence that says it, and keep the source list clean.**
  - Our own tips, help lines and safety lines get no tag.
  - Source titles list only the sections actually cited.
  - Fetch every URL. Reject 4xx responses, login and DOI redirects, newsroom pages and search pages. Use PubMed for paywalled journals.
  - Known facts:
    - The July 2023 review was EMA PRAC's.
    - Name both NANOS and the AAO.
    - NHS "more at risk" is not the same as "more likely".
  - (About 77 findings, latest L1 11-21.)

_Updated 2026-11-21 from 67 QA records (all GLP-1, 11-09 to 11-21)._

_Updated 2026-11-21 from 67 QA records._
