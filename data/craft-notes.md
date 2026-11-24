_Based on 72 QA records from 2026-11-11 to 2026-11-24: 44 Shorts, 24 long videos and 4 carousels, all about GLP-1. Five records are new since the last pass (11-24: L1 Foundayo, S1–S3 and C1)._
- _**The fresh Foundayo script passed.** L1 11-24 is ready, with masking at 0.006, beat sync passed and only minor fact-check notes. It still had floating heads cropped at the counter for the third render in a row, starfield behind body beats and 11 near-empty shots._
- _**All four 11-24 videos stayed at or under 0.02 masking.** Caption-card faults, cabinet strips, starfields and a raw "Label" tag came back._

_**16 were held or failed:**_
- _5 for beat drift: L1 11-14, L1 and L2 11-16, L1 11-21, L1 11-23._
- _7 for audio or narration: L1 11-11, S2 11-11, S2 11-12, S2 11-13, S1 11-16, L1 11-22, S3 11-22._
- _4 for sources or fact-check: L2 11-14, the Foundayo REVISEs on 11-20 and 11-21, and C1 11-20._

_**Ignore:**_
- _any finding that cites a 170-word or 90 s Shorts limit_
- _any finding about the old Exp F cards ("Full breakdown on our channel", the subscribe line) on Shorts with content dates up to 2026-11-16_
- _the offset-beat findings from 11-09 and earlier, which were a QA bug. Only the automatic beat-sync gate counts for timing._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older scripts. Never add them back. Every Short from 11-17 to 11-24 complied._

### Motion Designer
- **Long-form: check beat sync on the render, not the plan, and check that each shot shows its own scene's text.**
  - Re-time every cut from the final word timestamps, and again after any scene is regenerated.
  - Fix any cut more than 0.5 s off on the rendered file.
  - Compare every stat or headline shot with its own scene ID. The renderer pulls a later scene's text into earlier shots that share a layout.
  - (5 gate holds. Plans were 96–100% on time; renders were 76–93%. Wrong-scene text 3 times: s31←s23 in L2 11-16, s65←s75 in L1 11-21, s18←s60 in L1 11-23.)
- **Measure masking last, on the final file. Never hand off anything above 0.02; aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger or whoosh on a spoken number, drug name or safety line.
  - Re-measure after every re-render.
  - (14 pieces over 0.02 and 6 holds. 6 shipped over the limit: S1 11-11, L1 11-15, S2 11-20, S1 11-22, S1 11-23 and L2 11-23. All of 11-24 was at or under 0.017, so keep doing what worked.)
- **Every scene must have voice from its first word to its last, the closing scene and the Short's hook included. Then compare a speech-to-text transcript with the script word for word, checking drug names first.**
  - Regenerate any scene where tirzepatide, semaglutide or orforglipron is misheard. Never ship it with a "quality check" note.
  - Then check every "point", number, unit, acronym and contraction.
  - (4 holds for silent lines: S2 11-12, S1 11-16, L1 11-22 and S3 11-22. Misreads: "tears epitide" ×3 and "some agglutide" in L2 11-23, "tenmg", "sub study", "gip", and "why's" heard as "why is".)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill.**
  - Before render, search for POINT, PERCENT, SIXTEEN, "TYPE TWO" or "TWO DIABETES", and the raw word "Label".
  - Spell-check every card.
  - ("TYPE TWO" in S3 11-21, S1 11-22, S3 11-22, S3 11-23 and S3 11-24. A raw "Label" tag in S3 11-20, S2 11-21 and S3 11-24.)
- **The closing safety cards are fixed and pre-split. Never run them through the auto-splitter:**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card.
  - The don't-stop line is two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" and "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN."
  - Read the last 4 cards of every Short before handoff.
  - (The safety line was split at the comma 9 times, most recently S1, S2 and S3 11-23 and S2 11-24. The don't-stop line broke on ISN'T or THOSE 5 times, most recently S2 and S1 11-24.)
- **Every other caption card is one whole clause on 2 lines or fewer.**
  - Never end a card on a comma, dash, colon, semicolon, bare number or possessive.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, HAVE, THOSE, TAKE, TYPE, ISN'T, DOESN'T or "AND IN".
  - (Banned endings in nearly every Short, all 3 Shorts on 11-24 included.)
- **Shorts tags:**
  - Clear the previous card, tags and bubbles before the next card appears.
  - Keep tags above y 1150, inside both side edges, and never behind the caption pill.
  - Show at most 2 tags at a time.
  - Never render an empty or ghosted bubble or a dash-placeholder rail.
  - (About 290 overlap findings across 40 Shorts. Dash rails in S2 11-20, S1 11-21 and S2 11-23. Ghosted bubbles in S1 11-17 and S2 11-24.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least about 40px.**
  - (About 340 off-screen and 285 tiny-text findings, in every long video. L1 11-24 had 8 off-screen.)
- **Backdrops:**
  - No rounded teal or green cabinet strips and no hanging ornament circles.
  - No starfield or bokeh behind a body beat or the opening frame.
  - Night beats get a dark night room.
  - (Cabinet strips in about 27 pieces, most recently S1 and S2 11-24. Starfield or bokeh in about 25, most recently L1, S2 and S3 11-24. Daytime rooms on night beats in 4.)
- **Draw people as whole characters with a neck and shoulders, standing in front of the counter. Never let the counter, a document circle or the frame edge crop them.**
  - Lock each character's skin tone, hair and outfit, the opening frame included.
  - No ring, blob or outline-only heroes, and no mascot on a person.
  - (Floating heads in about 31 pieces. All 3 Foundayo renders, L1 11-22, 11-23 and 11-24, cropped the woman at the counter from t=0. Continuity breaks in 8.)
- **The first frame shows the main character in full, never only an icon, ring or peeking head. Every shot has a labelled hero covering at least about 25% of the frame. A headline never sits on the hero.**
  - Long-form: the main character fills about a third of the frame height in the first 30 s.
  - Document, Rx and doctor beats need a character.
  - (About 235 near-empty findings, 11 of them in L1 11-24. No character at t=0 in S2 11-14, S1 11-23 and S1 11-24. Title on the hero in S1 11-16, S1 11-18, S1 11-23 and S3 11-24.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160. Never over 160.
  - Put the true count in the post notes (S2 11-23's count was wrong).
  - Scene 1's narration field holds the spoken hook. S3 11-22 was held for this.
  - From content date 2026-11-17, end with:
    1. "Not personal advice, so ask your prescriber." (also one on-screen entry)
    2. the emergency and don't-stop lines, when the topic needs them
    3. the task's loop line
- **Copy the fixed safety lines exactly, and speak and show each one in full.**
  - An emergency line names its trigger and keeps the guide's "stop… and get medical help right away" (L1 11-23 dropped the "stop").
  - Then: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Say "that emergency sign" for a single sign. Never drop "or change your medicine", and never write "Otherwise".
  - Pancreatitis: tirzepatide "with or without vomiting"; Foundayo "with or without nausea or vomiting".
  - Give the full allergy list.
  - Gallbladder: "Tell your healthcare provider right away".
  - Fluid tips keep "unless you've been told to limit fluids".
  - Chest pain or fainting: the emergency number comes first.
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits, units in full, no letter-by-letter acronyms, and contractions spelled out (S1 11-24).
  - Every spoken number names its comparator in the same or the next sentence.
  - Never write "now", "new", dates or "is requiring".
- **Keep each finding at its source's exact number, scope, verb and hedge, recaps included.**
  - "Adverse events" and "adverse reactions" are never "side effects" (C1 11-24, L3 11-21).
  - "May be higher" never becomes "is higher" (S3 11-24).
  - Never add "most", "mostly", "many", "similar" or "a few days".
  - Never present slower stomach emptying as the cause. Follow a symptom stat with the label's "diminishes over time" (S3 11-24, S3 11-23, S4 11-22).
  - A single trial is never "not a fluke". Never present separate trials as head-to-head, and never call our own arithmetic "the paper's result".
  - (About 140 findings.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and shows all of sentence 1's answer, hedge included (S2 11-24, L1 11-23).
  - Every stat card names the measure, the drug and dose, both groups, the full population and the timeframe (S2 and S3 11-24, S2 11-23, L1 11-23).
  - Never write "no diabetes" or drop "weight-related".
  - No unverified details such as "capsule".
  - (About 110 findings.)

### Carousel Designer
- **Make a carousel only when the scheduler asks, and reuse verified Short text only.**
  - Use the label's term "adverse reactions" in headlines (C1 11-24).
  - Keep each trial's full population in the recap.
  - Stat cards name the drug, both groups and the measure.
  - Every source has a real revised date (C1 11-20 was held for a staff note).
  - (All 4 carousels had findings.)

### Social Copywriter & packaging
- **Long-form descriptions are complete viewer copy of 1,250 characters or fewer.**
  - Leave line 1 empty on every YouTube description.
  - Then the safety block, then the quick answer, then 2–3 sources.
  - End exactly on "…whether it's right for you." with no markup or placeholders after it.
  - (Cut off, leaked or missing the ending 6 times: 1 hold and 3 REVISEs.)
- **Name the watch-next target in the post notes and let the publisher add the link.**
  - New broad videos and Sleep Apnea → Side Effects.
  - First Month → Months 2–6 (Aqv2dOU-SmM only); Months 2–6 → How Long.
  - Mounjaro vs Ozempic → Zepbound vs Wegovy; old Foundayo → new Foundayo once it's live.
  - Every Short logs one target (Exp G, until 2026-12-14).
  - Never the home page, and never MQqAwUKAKSI.
  - (Missing or wrong in 5 pieces.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it.
  - Copy the emergency line in the script's own words, e.g. "severe pain in your stomach area (abdomen) that will not go away".
  - With one named sign, write "that emergency sign".
  - Threads is about 300 characters: cut facts, never safety lines.
  - (Emergency line paraphrased or shortened in L1 11-24's description and pinned comment, S3 11-23, S4 11-22 and S1 11-11. "Those signs" with one sign in C1 11-24 and L2 11-23. Threads over the limit about 45 times, including S3 and C1 11-24.)
- **Copy facts, measures, populations and attributions word for word from the verified script, on every platform and in the pinned comment.**
  - The pinned comment names the trial and its full population.
  - Keep exact measures ("permanently stopped treatment because of adverse reactions", L1 11-24).
  - Keep drug names outside quoted label text.
  - Never list our own tips under "the label says" (IG S3 11-24, S3 11-23 and S3 11-15).
  - Never add openers the script doesn't have: questions, validation lines or "actually" (8 since 11-18).
  - (About 170 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - Make no cause, timeframe or "common" claim the content doesn't make ("after the big dinner" in S3 11-23, stomach pain as common in S2 11-21).
  - One save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports: no #Foundayo, #Zepbound, #GLP1, #sideeffects or trial tags.
  - (About 65 pieces.)

### Everyone
- **Never re-produce a video that is live or already made. Fix the known faults before a re-render or publish.**
  - **Foundayo (orforglipron) the once-daily GLP-1 was made fresh on 11-24 and is ready.** Don't script it again. Before it publishes:
    - copy the Medication Guide's emergency wording into the description and pinned comment
    - restore "permanently stopped treatment because of adverse reactions"
    - move the drug name outside the quoted label text
  - **Mounjaro vs Ozempic (SURPASS-2) was made on 11-23.** Before it publishes:
    - regenerate the 4 scenes with misheard drug names
    - remix to 0.02 or lower
    - replace the newsroom source at s25 with the SURPASS-2 abstract
  - **Serious Risks (held 11-21, until 2026-11-30):**
    - re-time it and remove the duplicate "6.4 vs 3.8" at s65
    - s8: hold the sleep apnea card until s9 says it
    - s36: say "a sulfonylurea"
    - s44: give the full allergy list, in the description too
    - s77: say "MTC or MEN 2"
    - s35 and s72: low blood sugar is also reported without type 2 diabetes
    - use the real Medication Guide URL
  - **S3 11-22 (holiday slot, until 2026-11-27):** put the hook into the script and subtitles, remix to 0.02 or lower, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10):** re-time both on the render before they ship.
  - Months 2–6 has been live since 11-16. Never make it again.
- **Every source needs its own working URL and a real revised date. Never a placeholder, a bare year or a staff note.**
  - The Medication Guide and the IFU each get their own URL.
  - Find the quoted sentence before you cite it.
  - Source titles list only the sections cited, with numbers (hypoglycemia 5.7, rotation 2.4 in the 8/2026 PIs; S1 11-24, S3 and L2 11-23).
  - No 4xx errors, newsroom pages or search pages.
  - Known dates: Zepbound PI 28 Aug 2026; Mounjaro PI 27 Aug 2026; Foundayo label rev 7/2026; NHS nausea page 17 Nov 2023.
  - Our own tips and safety lines get no tag (L1 11-24 s35).
  - (About 90 findings.)
- **Give every result its exact scope.**
  - Obesity trials: adults with obesity, or overweight plus a weight-related condition, without diabetes.
  - SELECT: preexisting CV disease and a BMI of 27 or more, without diabetes.
  - SURPASS-2: adults with type 2 diabetes on metformin, 40 weeks, each tirzepatide arm vs semaglutide 1 mg, in randomized people who got at least 1 dose.
  - Low blood sugar: "may be higher" with insulin or a sulfonylurea, and also reported in adults without type 2 diabetes.
  - Pancreatitis: 0.23 vs 0.11 only alongside 0.14 vs 0.15.
  - 75/25: from the 160-person DXA substudy.
  - SURMOUNT-4: +14.0% regain on placebo, still 9.9% below baseline.
  - Hair loss: 5.4% vs 0.9%.
  - Injection-site reactions: 6–8% vs about 2%.
  - Pen: 21 days in total; the guide bans *loose* pens in household trash.
  - Foundayo: top label dose 17.2 mg, −11.1% in Trial 1; 10.3% vs 2.7% stopped for adverse events at 36 mg.

_Updated 2026-11-24 from 72 QA records (all GLP-1, 11-11 to 11-24)._

_Updated 2026-11-24 from 72 QA records._
