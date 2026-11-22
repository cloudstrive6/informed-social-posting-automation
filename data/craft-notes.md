_Based on 73 QA records from 2026-11-09 to 2026-11-22: 44 Shorts, 25 long-form videos and 4 carousels, all about GLP-1. The only new record since the last pass is S4 11-22 (bloating). It shipped, but it repeated three known faults: the safety line split across two cards, banned card endings, and a stat card with no population. The rules below stay the same. Counts are updated, and the duplicate footer is gone._

_**17 were held or failed:**_
- _6 for beat drift (L1 11-09, L1 11-10, L1 11-14, L1 and L2 11-16, L1 11-21). In every one, the plan was 96–100% on time but the render was only 76–91%._
- _7 for audio or narration (L1 11-11, S2 11-11, S2 11-12, S2 11-13, S1 11-16, L1 11-22, S3 11-22). The latest two:_
  - _Foundayo L1 11-22: silent closing scene, masking 0.021._
  - _S3 11-22: spoken hook missing from the script and subtitles, masking 0.068._
- _4 for sources or fact-check: a wrong Medication Guide URL (L2 11-14), two Foundayo REVISEs (11-20 and 11-21), and a staff note left in a source date (C1 11-20)._

_**Ignore:**_
- _The Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09. They came from a QA bug (frames were shown in the wrong order). The published videos were in sync and showed the disclaimer. Only the automatic beat-sync gate counts._
- _Any finding that cites a 170-word or 90 s Shorts limit._
- _Any finding about the old Exp F closing cards on Shorts dated before 11-17._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older Short scripts. Never add them back. Every Short from 11-17 to 11-22 complied._

### Motion Designer
- **Long-form: check beat sync on the render, not the plan.**
  - Re-time every cut from the final word timestamps, and do it again after any scene is regenerated.
  - Measure every beat in the rendered file and fix any cut more than 0.5 s off.
  - Scan every shot for another scene's text (for example a repeated "6.4 vs 3.8").
  - (6 gate holds. Plans were 96–100% on time; renders were 76–91%.)
- **Measure masking last, on the final file. Never hand off anything above 0.02, and aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger or whoosh on a spoken number, drug name or safety line.
  - Re-measure after every re-render. The gate does not always stop a bad mix.
  - (12 pieces over 0.02 and 7 holds, the latest L1 11-22 at 0.021 and S3 11-22 at 0.068. **4 shipped over the limit:** S1 11-11 at 0.028, L1 11-15 at 0.022, S2 11-20 at 0.054 and S1 11-22 at 0.024. S2 11-17 and S4 11-22 sat at 0.019.)
- **Every scene must have voice from its first word to its last, the closing scene included. Then compare a speech-to-text transcript with the script word for word.**
  - Listen to the final scene on its own: the subscribe ask and watch-next line on long-form, the loop line on Shorts.
  - Check every "point", number, unit, drug name, acronym, contraction and how-to phrase.
  - Regenerate any failing scene before you mix.
  - (Silent or missing scenes caused 4 holds: S2 11-12, S1 11-16, L1 11-11 and L1 11-22. Misreads: "point" twice, plus "tenmg", "sub study", "gip" and "why's" heard as "why is" in L2 11-22.)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill exactly.**
  - Before render, search captions and tags for POINT, PERCENT, HUNDRED, THOUSAND, SIXTEEN, "TYPE TWO" or "TWO DIABETES", and pronunciation spellings.
  - Spell-check every card and tag ("Studv 2" in L2 11-20, "WERE WORRIED" in S1 11-22).
  - (About 24 Shorts, the latest S3 11-22.)
- **Each caption card is one whole clause on 2 lines or fewer, in full-contrast text.**
  - Never split a word, number or phrase across cards.
  - Never end a card on a comma, dash, colon or semicolon, or on a bare number.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, MAY, WON'T, DOESN'T, ISN'T, HAVE, THOSE, TAKE, TYPE, UNLESS or "AND IN".
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is always one card ending in a full stop. It was split or cut at the comma in S3 11-17, S1 11-18, S2 11-19, S2 11-20 and S4 11-22.
  - (Nearly every Short, including all four 11-22 Shorts.)
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.**
  - Keep tags above y 1150 and inside both side edges.
  - Show at most 2 tags at a time, never behind the caption pill, and never a tag that repeats the caption.
  - Never render an empty bubble, ghost text, a blank or dash-placeholder rail, or the raw word "Label".
  - (About 265 overlap findings across 36 Shorts. The latest: ghosting in S1 and S3 11-22, and the "Study 1/Study 2" and "US label" tags in S4 11-22.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least about 40px.**
  - Name, group, study and dose tags keep clipping past y 1080.
  - Labels keep rendering at 22–26px.
  - (About 315 off-screen and 270 tiny-text findings. The latest: 25 off-screen in L2 11-22, including the "Group A/B" and "Trial 2" tags, and 13 in L1 11-22.)
- **Backdrops:**
  - Never use the rounded teal or green "cabinet strip" or the hanging grey or orange ornament circles.
  - Never put a starfield or bokeh behind a body beat.
  - Night beats get a dark night room, never the daytime striped room or a sunny bedroom.
  - (Cabinet strips in about 23 pieces, starfield or bokeh on body beats in about 21. Daytime rooms on night beats in L1 11-09, S1 11-16, L1 11-18 and L2 11-22.)
- **Draw people as whole, filled-in characters with a neck and shoulders, standing in front of the counter or desk. Never let the counter or the frame edge crop them.**
  - Lock each named character's skin tone, hair and outfit for the whole video.
  - No ring, blob or outline-only heroes, no merged people, and no mascot perched on a person.
  - (Floating heads in about 27 pieces. In L1 11-22, every main shot, including t=0, had the woman cropped at the counter. Also S1 and S2 11-22. Continuity breaks in 6 pieces.)
- **Fill every frame with a headline plus a labelled hero covering at least about 25% of it, from the opening frame on.**
  - In a long video's first 30 s, the main character fills about a third of the frame height (too small in L2 11-16, L1 11-21 and L2 11-22).
  - At t=0 in a Short, keep the headline clear of the character's head. In the first 10 s, change the shot at least every 2.5 s.
  - Document, Rx and doctor beats need a character, with the stat shown on the document.
  - (About 215 near-empty findings, the latest 13 in L1 11-22.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160. Never over 160.
  - The spoken hook must be scene 1's narration in the script field (S3 11-22 was held for this).
  - From content date 2026-11-17, end with:
    1. "Not personal advice, so ask your prescriber." Put it in the on-screen text field too, as one entry.
    2. The emergency and don't-stop lines, when the topic needs them.
    3. The task's loop line.
  - Never write a subscribe line or "link in the description" in a Short.
- **Copy the fixed safety lines exactly, and both speak and show each one.**
  - An emergency line names its trigger and keeps "right away". Then add: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." For a single sign, say "that emergency sign". Never write "Otherwise".
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
  - Every spoken number names its comparator, including subgroup splits.
  - Never write "now", "new", dates or "the FDA is requiring". Keep the FDA's "potential".
- **Keep each finding at its source's exact number, unit, scope, verb and hedge, recaps included.**
  - "Adverse events" are never "side effects". A share of people is never an "average".
  - Never add "most", "mostly", "many", "commonly", "similar", "myth", "a few days" or a softer verb. GI effects were "higher during dose escalation and decreased over time".
  - Never present slower stomach emptying as the cause. Right after a symptom stat, add the label's "diminishes over time" sentence (S4 11-22).
  - Never compare separate trials as if they were head-to-head, and never call our own arithmetic "the paper's result".
  - (About 126 findings, the latest L1 and S4 11-22.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and scope, shows sentence 1's answer, and never shows a point before it is spoken (L2 11-22 and S3 11-19 had no answer).
  - Every stat card names the measure, the drug and dose, both groups, the full population and the timeframe (missing in S4 11-22 s02).
  - Never write "no diabetes" for a population, and never drop "weight-related". Low blood sugar cases are "in adults without type 2 diabetes".
  - (About 101 findings.)

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
- **Don't write the watch-next line yourself; the publisher adds it. Name the target in the post notes.**
  - New broad videos → Side Effects
  - Mounjaro vs Zepbound and Foundayo → How It Works
  - First Month → Months 2–6
  - Never the channel home page.
  - (5 pieces.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it. Hashtags came after it 5 times, the latest IG S3 11-22.
  - The don't-stop line follows the named emergency signs, never a bare "emergency sign" (S2 11-22).
  - Copy the emergency line in the script's own words ("If you have severe stomach pain that will not go away…", S4 11-22).
  - Threads stays at about 300 characters: cut facts, never a safety line. (About 39 pieces over.)
- **Copy facts, qualifiers, devices, sources and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep the "US label" attribution and the device scope.
  - The pinned comment keeps each trial's full population (L1 11-15, L2 11-16, L1 11-22).
  - Never add openers the script doesn't have: no validation hooks, no questions and no "actually". (7 times, the latest FB and IG S1 11-22 and IG S4 11-22.)
  - (About 160 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat names its measure. Never make a warning sign sound like the common effect.
  - Name the drug in the thumbnail subtext.
  - One save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports: no #GLP1, #sideeffects, #injectionsite or #PatientSafety.
  - (About 60 pieces.)

### Everyone
- **Fix the queued long videos' known faults before you re-render, and never re-produce a video that is already live.** Check the live list first: Months 2–6 has been live since 11-16, and a duplicate was made on 11-20.
  - **Foundayo (held 11-22; the facts passed):**
    - Regenerate the silent closing scene.
    - Remix to 0.02 or lower, measured on the final file.
    - Redraw the counter-cropped heads.
    - Replace "mostly" with the label's escalation wording (s01, s31, s66–s67).
    - Add headache, fatigue and hair loss to s21.
    - Keep 2.7% placebo, "adverse events", the label's pancreatitis wording and "potential".
  - **Serious Risks (held 11-21):**
    - Re-time it and remove the duplicate "6.4 vs 3.8" at s65.
    - s8: hold the sleep apnea card until s9 says it.
    - s36: say "a sulfonylurea".
    - s44: give the full allergy list, in the description too.
    - s77: say "MTC or MEN 2".
    - s35 and s72: say low blood sugar is also reported in adults without type 2 diabetes.
    - Use the real Medication Guide URL.
  - **S3 11-22:** put the hook into the script and subtitles, remix, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10):** re-time both before they ship.
- **Every source needs its own working URL and a real, live revised date. Never ship a placeholder, a bare year or a staff note.**
  - The Medication Guide and the IFU each get their own URL, never a PI anchor.
  - Open the document and find the quoted sentence before you cite it. If a PDF won't load, paraphrase and cite the PI section with its known date.
  - Known dates: Zepbound PI 28 Aug 2026; Mounjaro PI 27 Aug 2026; Foundayo label rev 7/2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023; NHS nausea page 17 Nov 2023.
  - (2 failures and 4 placeholder dates.)
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
  - **Foundayo:** the label's top dose is 17.2 mg (−11.1%). The trial's 36 mg gave −11.2%, with 10.3% vs 2.7% stopping for adverse events.
- **Tag a line to a source only after you find the sentence that says it.**
  - Our own tips, help lines and safety lines get no tag.
  - Source titles list only the sections actually cited.
  - Reject 4xx, login and DOI redirects, newsroom and search pages. Use PubMed for paywalled journals.
  - (About 77 findings.)

_Updated 2026-11-22 from 73 QA records (all GLP-1, 11-09 to 11-22)._

_Updated 2026-11-22 from 73 QA records._
