_Based on 71 QA records from 2026-11-12 to 2026-11-25: 44 Shorts, 23 long videos and 4 carousels, all about GLP-1. Four records are new since the last pass (11-25: L1 After 6 Months, S1–S3)._
- _**A misheard drug name now causes a hold on its own.** L1 11-25 (Tirzepatide After 6 Months) passed the fact-check and the packaging check, with masking at 0.005 and a 9.3 min runtime. It was dropped because one scene's voice said "tears appetite" instead of "tirzepatide". This is the third render with this voice fault (L2 11-23, L3 11-21, L1 11-25)._
- _**Every 11-25 piece had floating heads cropped at the counter.** Masking stayed at or under 0.017 on all four, so keep the mixing method._

_**15 were held or failed:**_
- _5 for beat drift: L1 11-14, L1 and L2 11-16, L1 11-21, L1 11-23._
- _6 for audio or narration: S2 11-12, S2 11-13, S1 11-16, L1 11-22, S3 11-22, L1 11-25._
- _4 for sources or fact-check: L2 11-14, C1 11-20, and the Foundayo REVISEs on 11-20 and 11-21._

_**Ignore:**_
- _any finding that cites a 170-word or 90 s Shorts limit_
- _any finding about the old Exp F cards ("Full breakdown on our channel", the subscribe line) on Shorts with content dates up to 2026-11-16_
- _offset-beat findings from 11-09 and earlier, which were a QA bug. Only the automatic beat-sync gate counts for timing._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older scripts. Never add them back. Every Short from 11-17 to 11-25 complied._

### Motion Designer
- **Check beat sync on the long-form render, not the plan. Check that each shot shows its own scene's text.**
  - Re-time every cut from the final word timestamps, and again after any scene is regenerated.
  - Fix any cut more than 0.5 s off on the rendered file.
  - Compare every stat or headline shot with its own scene ID. The renderer pulls a later scene's text into earlier shots that share a layout.
  - (5 gate holds. Plans were 96–100% on time; renders were 76–93%. Wrong-scene text 3 times: s31←s23 in L2 11-16, s65←s75 in L1 11-21, s18←s60 in L1 11-23.)
- **Before handoff, run speech-to-text on every scene and compare it with the script, starting with the drug names.**
  - If tirzepatide, semaglutide or orforglipron is misheard anywhere, regenerate that scene (for example with a phonetic respelling for the voice engine). Never hand it off with a "quality check" note: it is a ship-blocker.
  - Then check every "point", number, unit, acronym and contraction.
  - (Drug names misheard in 3 long videos: "tears epitide" ×3 and "some agglutide" in L2 11-23, "gip" in L3 11-21, and "tears appetite" in L1 11-25, which was held. Other misreads: "tenmg", "sub study", and "why's" heard as "why is".)
- **Every scene must have voice from its first word to its last.** This includes the closing scene and the Short's hook.
  - (4 holds for silent lines: S2 11-12, S1 11-16, L1 11-22, S3 11-22.)
- **Measure masking last, on the final file. Never hand off anything above 0.02; aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger on a spoken number, drug name or safety line.
  - Re-measure after every re-render.
  - (Over 0.02 in 9 pieces, 3 of them holds: S2 11-12, S2 11-13 and S1 11-16. Every piece from 11-24 to 11-25 was at or under 0.017.)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill.**
  - Before render, search for POINT, PERCENT, SEVENTY, SIXTEEN, "TYPE TWO" or "TWO DIABETES", and the raw word "Label".
  - (Spelled-out numbers in about 15 Shorts, most recently "PERCENT" and "SEVENTY-TWO" in S2 11-25. "TYPE TWO" 5 times. A raw "Label" tag in S3 11-20, S2 11-21 and S3 11-24.)
- **The closing safety cards are fixed and pre-split. Never run them through the auto-splitter.**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card.
  - The don't-stop line is two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" and "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN."
  - Read the last 4 cards of every Short before handoff.
  - (The safety line was split at the comma 9 times and the don't-stop line was broken 5 times, most recently S1 and S2 11-24.)
- **Every other caption card is one whole clause on 2 lines or fewer.**
  - Never end a card on a comma, dash, colon, semicolon, bare number or possessive.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, HAVE, THOSE, TAKE, TYPE, ISN'T or DOESN'T.
  - (Found in nearly every Short. On 11-25: "OR PRESCRIBER —", "STOMACH AREA —", and "WITH OR WITHOUT VOMITING," among others.)
- **Shorts tags:**
  - Clear the previous card, tags and bubbles before the next card appears.
  - Keep tags above y 1150, inside both side edges, and never behind the caption pill.
  - Show at most 2 tags at a time.
  - Never render an empty or ghosted bubble or a dash-placeholder rail.
  - (About 300 overlap findings, including S2 and S3 11-25.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and every label is at least about 40px.**
  - (About 360 off-screen and 290 tiny-text findings, in every long video. L1 11-25 had 21 off-screen.)
- **Backdrops:**
  - No teal or green cabinet strips and no hanging ornament circles.
  - No starfield or bokeh on any beat. It kept appearing on body beats and was then used on a non-body beat in L1 11-25.
  - Night beats get a dark night room.
  - (Cabinet strips or ornaments in about 29 pieces. Starfield or bokeh in about 27, most recently L1 and S3 11-25.)
- **Draw people as whole characters with a neck and shoulders, standing in front of the counter, never cropped by the counter or the frame edge.**
  - Lock each character's skin tone, hair and outfit.
  - No ring, blob or outline-only heroes, and no mascot on a person.
  - (Floating heads in about 35 pieces, including all 4 from 11-25 and every Foundayo render. Continuity breaks in 8.)
- **The first frame shows the main character in full. Every shot has a labelled hero covering at least about 25% of the frame. A headline never sits on the hero.**
  - Long-form: the main character fills about a third of the frame height in the first 30 s.
  - Document, Rx and doctor beats need a character.
  - (About 240 near-empty findings. No full character at t=0 in S1 11-23, S1 11-24, S1 11-25 and L1 11-25.)

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
  - The don't-stop line: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Say "that emergency sign" when there is only one.
  - Pancreatitis: tirzepatide "with or without vomiting"; Foundayo "with or without nausea or vomiting".
  - The on-screen emergency card keeps "stomach area" and "with or without vomiting" (dropped in L1 11-25 s26 and S3 11-25 s6).
  - Give the full allergy list.
  - Fluid tips keep "unless you've been told to limit fluids".
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits. Spell out contractions outside the fixed lines (S1 11-24, S1 11-25).
  - Every spoken number names its comparator.
  - Never write "now", "new", dates or "is requiring".
- **Keep each finding at its source's exact number, scope, verb and hedge, recaps included.**
  - "Adverse events" and "adverse reactions" are never "side effects".
  - "May be higher" never becomes "is higher".
  - Never add "most", "mostly", "many", "similar", "even" or "a few days".
  - Never present slower stomach emptying as the cause.
  - The SURMOUNT-1 comparator is "placebo plus counseling", not "counseling alone" (L1 11-25).
  - Never call a single trial "not a fluke", and never call our own arithmetic "the paper's result".
  - (About 145 findings.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and shows all of sentence 1's answer, hedge included.
  - Every stat card names the measure, the drug and dose, both groups, the full population and the timeframe.
  - Never write "no diabetes" or drop "weight-related".
  - (About 115 findings; S2 11-25 failed it on 3 cards.)

### Carousel Designer
- **Make a carousel only when the scheduler asks, and reuse verified Short text only.**
  - Use the label's term "adverse reactions".
  - Keep each trial's full population in the recap.
  - Every source has a real revised date (C1 11-20 was held for a staff note).
  - (All 4 carousels had findings.)

### Social Copywriter & packaging
- **Long-form descriptions are complete viewer copy of 1,250 characters or fewer.**
  - Line 1 stays empty.
  - Then the safety block, the quick answer and 2–3 sources.
  - End exactly on "…whether it's right for you." with no markup or placeholders after it.
  - (Cut off, leaked or missing the ending 6 times: 1 hold and 3 REVISEs.)
- **Name one watch-next target in the post notes and let the publisher add the link.**
  - Follow the playbook's link list.
  - The target must match the Short's drug and population (S2 11-25 pointed SURMOUNT-1 data at a Mounjaro video).
  - Never the home page, and never MQqAwUKAKSI.
  - (Missing or wrong in 6 pieces.)
- **Every caption field ends exactly on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it.
  - Copy the emergency line in the script's own words.
  - Write "that emergency sign" when one sign is named.
  - Threads is about 300 characters: cut facts, never safety lines.
  - (Threads over the limit about 48 times, including S3 11-25 at about 480. Emergency line paraphrased 6 times.)
- **Copy facts, measures, populations and attributions word for word from the verified script, on every platform and in the pinned comment.**
  - Keep the trial population on TikTok too (S2 and S3 11-25).
  - Keep drug names outside quoted label text.
  - Never list our own tips under "the label says".
  - Never add openers the script doesn't have: questions, validation lines or "actually" (9 since 11-18, including IG S2 11-25).
  - (About 175 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - No cause, timeframe or "common" claim the content doesn't make.
  - One save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports: no #Foundayo, #GLP1, #weightloss, #obesity, #sideeffects or trial tags.
  - (About 70 pieces.)

### Everyone
- **Never re-produce a video that is live or already made. Fix the known faults, then re-render or publish.**
  - **Tirzepatide After 6 Months (L1 11-25, held):** don't script it again. Before it publishes:
    - regenerate the "tears appetite" scene and re-check the transcript
    - s13: say "placebo plus counseling"
    - s26: show the full emergency wording on the card
    - s3: add the sleep apnea approval
  - **Foundayo What to Expect (made 11-24, ready):** don't script it again. Before it publishes:
    - copy the Medication Guide's emergency wording into the description and pinned comment
    - restore "permanently stopped treatment because of adverse reactions"
    - move the drug name outside the quoted label text
  - **Mounjaro vs Ozempic (SURPASS-2) has been live since 11-23, and Months 2–6 since 11-16.** Never make either again.
  - **Serious Risks (held 11-21; until 2026-11-30):**
    - re-time it and remove the duplicate "6.4 vs 3.8" at s65
    - s8: hold the sleep apnea card until s9 says it
    - s36: say "a sulfonylurea"
    - s44: give the full allergy list, in the description too
    - s77: say "MTC or MEN 2"
    - s35 and s72: low blood sugar is also reported without type 2 diabetes
    - use the real Medication Guide URL
  - **S3 11-22 (holiday slot, until 2026-11-27):** restore the hook, remix to 0.02 or lower, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10):** re-time both on the render before they ship.
- **Every source needs its own working URL and a real revised date. Never use a placeholder, a bare year or a staff note.**
  - The Medication Guide and the IFU each get their own URL.
  - Find the quoted sentence before you cite it.
  - Source titles list only the sections cited, with numbers (hypoglycemia 5.7, rotation 2.4).
  - No 4xx errors, newsroom pages or search pages.
  - Read the live revised date. Known dates: Mounjaro PI 27 Aug 2026; Foundayo label rev 7/2026; NHS nausea page 17 Nov 2023. Zepbound was recorded as 28 Aug 2026, but the 11-25 check cited a 16 Nov 2026 label, so confirm it on DailyMed.
  - Our own tips and safety lines get no tag.
  - (About 95 findings.)
- **Give every result its exact scope.**
  - Obesity trials: adults with obesity, or overweight plus a weight-related condition, without diabetes.
  - Zepbound's uses include moderate to severe obstructive sleep apnea in adults with obesity (left out in L2 11-20 and L1 11-25).
  - SELECT: preexisting CV disease and a BMI of 27 or more, without diabetes.
  - SURPASS-2: adults with type 2 diabetes on metformin, 40 weeks, each arm vs semaglutide 1 mg.
  - Low blood sugar: "may be higher" with insulin or a sulfonylurea, and also reported without type 2 diabetes.
  - Pancreatitis: 0.23 vs 0.11 only alongside 0.14 vs 0.15.
  - 75/25: from the 160-person DXA substudy.
  - SURMOUNT-4: +14.0% regain on placebo, still 9.9% below baseline.
  - Hair loss: 5.4% vs 0.9%.
  - Injection-site reactions: 6–8% vs about 2%.
  - Pen: 21 days in total; the guide bans *loose* pens in household trash.
  - Foundayo: top label dose 17.2 mg, −11.1% in Trial 1; 10.3% vs 2.7% stopped for adverse events at 36 mg.

_Updated 2026-11-25 from 71 QA records (all GLP-1, 11-12 to 11-25)._

_Updated 2026-11-25 from 71 QA records._
