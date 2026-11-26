_Based on 69 QA records from 2026-11-13 to 2026-11-25: 41 Shorts, 24 long videos and 4 carousels, all about GLP-1. The 11-12 records are now outside the window. One record is new since the last pass: L4 11-25, Zepbound Single-Dose Vial vs Pen. Its status is ready, with masking at 0.008 and no blocking findings. It repeats known visual faults (starfield, empty dash tag rails, cabinet strip with ornaments, a floating head) and has a bracketed watch-next placeholder in its description._

- _Masking stayed at or under 0.017 on every piece from 11-24 to 11-25, so keep the current mixing method._
- _Floating heads cropped at the counter appeared in 5 of the 6 pieces from 11-25. Starfield or bokeh appeared in 4 of them. These are now the most persistent visual faults._

_**15 were held or failed in this window:**_
- _5 for beat drift: L1 11-14, L1 and L2 11-16, L1 11-21, L1 11-23._
- _5 for audio or narration: S2 11-13, S1 11-16, L1 11-22, S3 11-22, L1 11-25._
- _4 for sources or fact-check: L2 11-14, C1 11-20, and the Foundayo REVISEs on 11-20 and 11-21._
- _1 for packaging: L3 11-25 (thumbnail range)._

_**Ignore:**_
- _any finding that cites a 170-word or 90 s Shorts limit_
- _any finding about the old Exp F cards ("Full breakdown on our channel", the subscribe line) on Shorts with content dates up to 2026-11-16 (S1 and S2 11-14, S3 11-13, S3 11-15)_
- _offset-beat or wrong-beat findings from 11-09 and earlier. They were a QA bug. Only the automatic beat-sync gate counts for timing._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older scripts. Never add them back. Every Short from 11-17 to 11-25 complied._

### Motion Designer
- **Check beat sync on the long-form render, not on the plan. Check that each shot shows its own scene's text.**
  - Re-time every cut from the final word timestamps, and again after any scene is regenerated.
  - Fix any cut more than 0.5 s off on the rendered file.
  - Compare every stat or headline shot with its own scene ID. The renderer pulls a later scene's text into earlier shots that share a layout.
  - (5 gate holds. Plans were 96–100% on time; renders were 76–93%. Wrong-scene text 3 times: s31←s23 in L2 11-16, s65←s75 in L1 11-21, s18←s60 in L1 11-23.)
- **Before handoff, run speech-to-text on every scene and compare it with the script, starting with the drug names.**
  - If tirzepatide, semaglutide or orforglipron is misheard anywhere, regenerate that scene (for example with a phonetic respelling for the voice engine). It is a ship-blocker. Never hand it off with a "quality check" note.
  - Then check every "point", number, unit, acronym and contraction.
  - (Drug names misheard: "tears epitide" ×3 and "some agglutide" in L2 11-23, and "tears appetite" in L1 11-25, which was held. Other misreads: "gip", "tenmg", "sub study", "why's" heard as "why is", and a dropped "point" in L1 11-13.)
- **Every scene must have voice from its first word to its last.** This includes the closing scene and the Short's hook.
  - (3 holds for silent lines: S1 11-16, L1 11-22 and S3 11-22.)
- **Measure masking last, on the final file. Never hand off anything above 0.02; aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger on a spoken number, drug name or safety line.
  - Re-measure after every re-render.
  - (Over 0.02 in 10 pieces. It was part of the hold in S2 11-13, S1 11-16, L1 11-22 and S3 11-22. Every piece from 11-24 to 11-25 was at or under 0.017.)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill.**
  - Before render, search for POINT, PERCENT, SEVENTY, SIXTEEN, "TYPE TWO" or "TWO DIABETES", and the raw word "Label".
  - (Spelled-out numbers in about 14 Shorts, most recently "PERCENT" and "SEVENTY-TWO" in S2 11-25. "TYPE TWO" 5 times. A raw "Label" tag 3 times: S3 11-20, S2 11-21 and S3 11-24.)
- **The closing safety cards are fixed and pre-split. Never run them through the auto-splitter.**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card.
  - The don't-stop line is two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" and "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN."
  - Read the last 4 cards of every Short before handoff.
  - (The safety line was split at the comma about 8 times and the don't-stop line was broken 5 times, most recently S1, S2 and S3 11-23 and S1 and S2 11-24.)
- **Every other caption card is one whole clause on 2 lines or fewer.**
  - Never end a card on a comma, dash, colon, semicolon, bare number or possessive.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, HAVE, THOSE, TAKE, TYPE, ISN'T or DOESN'T.
  - Never split a compound across cards ("SIDE / EFFECTS", "WEIGHT / LOSS").
  - (Found in nearly every Short. On 11-25: "OR PRESCRIBER —", "STOMACH AREA —" and "WITH OR WITHOUT VOMITING,", among others.)
- **Tags, Shorts and long-form:**
  - Clear the previous card, tags and bubbles before the next card appears.
  - Shorts: keep tags above y 1150, inside both side edges, and never behind the caption pill. Show at most 2 at a time.
  - Long-form: the bottom of every tag stays at y 1000 or less, every label is at least about 40px, and no label is ever truncated ("Tirzepa" in L3 11-25).
  - Never render an empty or ghosted bubble, or an empty dash-placeholder tag rail.
  - (About 290 Shorts overlap findings. About 370 long-form off-screen findings and 300 tiny-text findings. Dash rails appeared 4 times: S2 11-20, S1 11-21, S2 11-23 and L4 11-25.)
- **Backdrops:**
  - No teal or green cabinet strips and no hanging ornament circles.
  - No starfield or bokeh on any beat.
  - Night beats get a dark night room, never a bright daytime room.
  - (Cabinet strips or ornaments in about 30 pieces, including L4 11-25. Starfield or bokeh in about 28, including 4 of the 6 pieces from 11-25. Daytime rooms on night beats in L1 11-13, S1 11-16, L1 11-18 and L2 11-22.)
- **Draw people as whole characters with a neck and shoulders, standing in front of the counter, never cropped by the counter or the frame edge.**
  - Lock each character's skin tone, hair and outfit.
  - No ring, blob or outline-only heroes, and no mascot on a person.
  - (Floating heads in about 35 pieces, including 5 of the 6 from 11-25 and every Foundayo render. Continuity breaks in 8.)
- **The first frame shows the main character in full. Every shot has a labelled hero covering at least about 25% of the frame. The art matches its beat, and a headline never sits on the hero.**
  - Long-form: the main character fills about a third of the frame height in the first 30 s.
  - Document, Rx and doctor beats need a character.
  - Every element the shot list names must be in frame. L3 11-25 was missing its mascot and arrow. The "Wash hands" beat in L4 11-25 showed a cell icon instead.
  - (About 230 near-empty findings. No full character at t=0 in S1 11-23, S1 11-24, S1 11-25 and L1 11-25.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160. Never over 160.
  - Log the exact count in the post notes (wrong in S2 11-23; unclear in S2 11-25).
  - Scene 1's narration holds the spoken hook (S3 11-22 was held for this).
  - End with:
    1. "Not personal advice, so ask your prescriber."
    2. the emergency and don't-stop lines, when the topic needs them
    3. the loop line
- **Copy the fixed safety lines exactly. Speak and show each one in full.**
  - The emergency line keeps the guide's "stop… and get medical help right away".
  - The don't-stop line: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Say "that emergency sign" when only one is named.
  - Pancreatitis: tirzepatide "with or without vomiting"; Foundayo "with or without nausea or vomiting".
  - The on-screen emergency card keeps "stomach area" and "with or without vomiting" (dropped in L1 11-25 s26 and S3 11-25 s6).
  - Give the full allergy list (L1 11-21 s44 and S1 11-20 left signs out).
  - Fluid tips keep "unless you've been told to limit fluids".
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits.
  - Spell out contractions outside the fixed lines (S1 11-24, S1 11-25, L3 11-25 s1/s3/s80).
  - Every spoken number names its comparator.
  - Never write "now", "new", dates or "is requiring".
- **Keep each finding at its source's exact number, scope, verb and hedge, recaps included.**
  - "Adverse events" and "adverse reactions" are never "side effects".
  - "May be higher" never becomes "is higher".
  - Never add "most", "mostly", "many", "often", "similar", "even" or "a few days".
  - Never present slower stomach emptying as the cause (4 times, most recently S3 11-24).
  - The SURMOUNT-1 comparator is "placebo plus counseling", not "counseling alone".
  - Never rank doses the trial didn't compare (L3 11-25 s50).
  - Never call a single trial "not a fluke", and never call our own arithmetic "the paper's result".
  - (About 140 findings.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and shows all of sentence 1's answer, hedge included.
  - Every stat card names the measure, the drug and dose, both groups, the full population and the timeframe.
  - Never write "no diabetes" or drop "weight-related".
  - On-screen text is never narrower or stronger than the narration.
  - (About 110 findings; S2 11-25 failed it on 3 cards.)

### Carousel Designer
- **Make a carousel only when the scheduler asks, and reuse verified Short text only.**
  - Use the label's term "adverse reactions".
  - Keep each trial's full population in the recap.
  - Every source has a real revised date (C1 11-20 was held for a staff note).
  - (All 4 carousels had findings.)

### Social Copywriter & packaging
- **Thumbnail and title numbers always show drug vs comparator as separate figures. Never merge placebo and drug into one range.**
  - Write "44–62% VS 10% PLACEBO", not "10%–62%".
  - For a use that isn't approved, the subtext says it: for example "ONE PHASE 2 BIOPSY TRIAL · NOT AN APPROVED USE".
  - Titles name the exact device the video covers ("Single-Dose Pen", not "Pen"; L4 11-25).
  - (A merged range caused the L3 11-25 hold.)
- **Long-form descriptions are complete viewer copy of 1,250 characters or fewer.**
  - Line 1 stays empty.
  - Then the safety block, the quick answer (naming both groups, e.g. "30% on placebo") and 2–3 sources.
  - End exactly on "…whether it's right for you." with no markup, brackets or placeholders anywhere.
  - (Cut off, leaked markup, a placeholder or a missing ending 7 times, most recently the bracketed watch-next line in L4 11-25.)
- **Name one watch-next target in the post notes and let the publisher add the link. Never write a placeholder line.**
  - Follow the playbook's link list.
  - The target must match the Short's drug and population (S2 11-25 pointed SURMOUNT-1 data at a Mounjaro video).
  - Never the home page, and never MQqAwUKAKSI.
  - (Missing, wrong or a placeholder in 7 pieces.)
- **Every caption field ends exactly on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it (hashtags came after it 4 times).
  - Copy the emergency line in the script's own words.
  - Write "that emergency sign" when one sign is named.
  - Threads is about 300 characters: cut facts, never safety lines.
  - (Threads over the limit about 45 times, including S3 11-25 at about 480. Emergency line paraphrased 6 times.)
- **Copy facts, measures, populations, device scope and attributions word for word from the verified script, on every platform and in the pinned comment.**
  - Keep the trial population on TikTok too (S2 and S3 11-25).
  - Keep the "US single-dose pen" scope and the KwikPen/vial line on pen posts (dropped in S1 11-14, S1 11-19 and S1 11-21).
  - Keep drug names outside quoted label text.
  - Never list our own tips under "the label says".
  - Never add openers the script doesn't have: questions, validation lines or "actually" (9 since 11-18, including IG S2 11-25).
  - (About 170 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - No cause, timeframe or "common" claim the content doesn't make.
  - One save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports: no #Foundayo, #GLP1, #weightloss, #obesity, #sideeffects, symptom tags or trial tags.
  - (About 70 pieces.)

### Everyone
- **Never re-produce a video that is live or already made. Fix the known faults, then re-render or publish.**
  - **Fatty Liver / MASH (L3 11-25, held):** don't script it again. Before it publishes:
    - thumbnail: "MASH RESOLVED: 44–62% VS 10% PLACEBO", with subtext "ONE PHASE 2 BIOPSY TRIAL · NOT AN APPROVED USE"
    - description: label the 30% as placebo and give the full population (type 2 diabetes on metformin, with or without an SGLT2 inhibitor)
    - fix the truncated "Tirzepa" tag
    - spell out the contractions in s1, s3 and s80
    - s52: drop "often"
    - add S12's real revised date
  - **Tirzepatide After 6 Months (L1 11-25, held):** don't script it again. Before it publishes:
    - regenerate the "tears appetite" scene and re-check the transcript
    - s13: say "placebo plus counseling"
    - s26: show the full emergency wording on the card
    - s3: add the sleep apnea approval
  - **Zepbound Single-Dose Vial vs Pen (L4 11-25, made; until 2026-11-30):** don't script it again. Before it publishes:
    - replace the bracketed watch-next line with the post-note target
    - title: say "Single-Dose Pen"
    - s19: keep "press and hold for up to 10 seconds"
    - S2: use the separate Medication Guide URL (pi.lilly.com/us/zepbound-us-mg.pdf)
    - S3 and S4: give each leaflet its own revised date
    - s6: credit the FDA sharps guidance as well
  - **Foundayo What to Expect (made 11-24; the playbook lists it as ssb7Zcs3KSY):** never script it again. Confirm that the description and pinned comment have:
    - the Medication Guide's emergency wording
    - "permanently stopped treatment because of adverse reactions"
    - the drug name outside the quoted label text
  - **Already live, never make again:** Mounjaro vs Ozempic (SURPASS-2) since 11-23, and Months 2–6 since 11-16.
  - **Serious Risks (held 11-21; until 2026-11-30):**
    - re-time it and remove the duplicate "6.4 vs 3.8" at s65
    - s8: hold the sleep apnea card until s9 says it
    - s36: say "a sulfonylurea"
    - s44: give the full allergy list, in the description too
    - s77: say "MTC or MEN 2"
    - s35 and s72: low blood sugar is also reported without type 2 diabetes
    - use the real Medication Guide URL
  - **S3 11-22 (holiday slot, until 2026-11-27):** restore the hook, remix to 0.02 or lower, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10; until 2026-11-30):** re-time both on the render before they ship.
- **Every source needs its own working URL and a real revised date. Never use a placeholder, a bare year or a staff note.**
  - The Medication Guide and the IFU each get their own URL (a PI URL used for the Medication Guide caused the L2 11-14 REVISE).
  - Find the quoted sentence before you cite it.
  - Source titles list only the sections cited, with numbers (hypoglycemia 5.7, rotation 2.4).
  - No 4xx errors, newsroom pages or search pages.
  - If a PDF's date can't be read, find it on DailyMed or the label page. Never leave it blank (L3 11-25 S12).
  - Known dates: Mounjaro PI 27 Aug 2026; Foundayo label rev 7/2026; NHS nausea page 17 Nov 2023. For Zepbound, confirm on DailyMed: 28 Aug 2026 was recorded, but 11-25 cited a 16 Nov 2026 label.
  - Our own tips and safety lines get no tag.
  - (About 100 findings.)
- **Give every result its exact scope.**
  - Obesity trials: adults with obesity, or overweight plus a weight-related condition, without diabetes.
  - Zepbound's uses include moderate to severe obstructive sleep apnea in adults with obesity (left out in L2 11-20 and L1 11-25).
  - SELECT: preexisting CV disease and a BMI of 27 or more, without diabetes.
  - SURPASS-2: adults with type 2 diabetes on metformin, 40 weeks, each arm vs semaglutide 1 mg.
  - MASH: one phase 2 biopsy trial; not an approved use.
  - Low blood sugar: "may be higher" with insulin or a sulfonylurea, and also reported in adults without type 2 diabetes.
  - Pancreatitis: 0.23 vs 0.11 only alongside 0.14 vs 0.15.
  - 75/25: from the 160-person DXA substudy.
  - SURMOUNT-4: +14.0% regain on placebo, still 9.9% below baseline.
  - Hair loss: 5.4% vs 0.9%.
  - Injection-site reactions: 6–8% vs about 2%.
  - Pen: 21 days in total; press and hold for up to 10 seconds; the guide bans *loose* pens in household trash.
  - Foundayo: top label dose 17.2 mg, −11.1% in Trial 1; 10.3% vs 2.7% stopped for adverse events at 36 mg.

_Updated 2026-11-26 from 69 QA records (all GLP-1, 11-13 to 11-25)._

_Updated 2026-11-26 from 69 QA records._
