_Based on 73 QA records from 2026-11-13 to 2026-11-26: 44 Shorts, 25 long videos and 4 carousels, all about GLP-1. Four records are new since the last pass, all from 11-26: L1 Serious Risks (held), S1 Hair Shedding (held), S2 Right-Rib Pain (fact-check REVISE) and S3 Loose Stools (ready)._

- _**Masking has come back.** S1 11-26 was held at 0.056 after two clean days (11-24 and 11-25, all at 0.017 or lower). Measure every final file. Don't assume the mix is fine._
- _**Drug-name misreads now cause holds.** "Tears appetite" was in L1 11-25 and again in L1 11-26, and "moongiaro" in L1 11-26. Both were held._
- _**Beat sync is fixed on Serious Risks.** L1 11-26 had no beat-sync block, so re-timing from the render works._
- _Floating heads, starfield or bokeh, and split safety cards appeared again in every 11-26 video piece that had visual notes._

_**18 were held or failed in this window:**_
- _5 for beat drift: L1 11-14, L1 and L2 11-16, L1 11-21, L1 11-23._
- _7 for audio or narration: S2 11-13, S1 11-16, L1 11-22, S3 11-22, L1 11-25, L1 11-26, S1 11-26._
- _5 for sources or fact-check: L2 11-14, C1 11-20, the Foundayo REVISEs on 11-20 and 11-21, and S2 11-26 (a placeholder source date)._
- _1 for packaging: L3 11-25 (thumbnail range)._

_**Ignore:**_
- _any finding that cites a 170-word or 90 s Shorts limit_
- _any finding about the old Exp F cards ("Full breakdown on our channel", the subscribe line) on Shorts with content dates up to 2026-11-16 (S1 and S2 11-14, S3 11-13, S3 11-15)_
- _offset-beat or wrong-beat findings from 11-09 and earlier. They were a QA bug. Only the automatic beat-sync gate counts for timing._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card. This includes re-renders of older scripts. Never add them back. Every Short from 11-17 to 11-26 complied._

### Motion Designer
- **Check beat sync on the long-form render, not on the plan. Check that each shot shows its own scene's text.**
  - Re-time every cut from the final word timestamps, and again after any scene is regenerated.
  - Fix any cut more than 0.5 s off on the rendered file.
  - Compare every stat or headline shot with its own scene ID. The renderer pulls a later scene's text into earlier shots that share a layout.
  - (5 gate holds. Plans were 96–100% on time; renders were 76–93%. Wrong-scene text 3 times: s31←s23 in L2 11-16, s65←s75 in L1 11-21, s18←s60 in L1 11-23. The re-timed Serious Risks render on 11-26 passed.)
- **Before handoff, run speech-to-text on every scene and compare it with the script. Check the drug and brand names first.**
  - The names to check are tirzepatide, semaglutide, orforglipron, Mounjaro, Zepbound and Foundayo.
  - If any of them is misheard, regenerate that scene with a phonetic respelling for the voice engine. Then re-time and re-check the transcript.
  - It is a ship-blocker. Never hand it off with a "quality check" note.
  - Then check every "point", number, unit, acronym and contraction.
  - (Drug names misheard in 3 long videos, 2 of them held: "tears epitide" ×3 and "some agglutide" in L2 11-23; "tears appetite" in L1 11-25 (held); "tears appetite" and "moongiaro" in L1 11-26 (held). Other misreads: "gip", "tenmg", "sub study", "why's" heard as "why is", and a dropped "point".)
- **Every scene must have voice from its first word to its last.** This includes the closing scene and the Short's hook.
  - (3 holds for silent lines: S1 11-16, L1 11-22 and S3 11-22.)
- **Measure masking last, on the final file of every piece. Never hand off anything above 0.02; aim for 0.015 or lower.**
  - Duck the music under all narration.
  - No stinger on a spoken number, drug name or safety line.
  - Re-measure after every re-render.
  - (Over 0.02 in 11 pieces. It was part of 5 holds: S2 11-13, S1 11-16, L1 11-22, S3 11-22 and S1 11-26 at 0.056, which came after two clean days.)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill.**
  - Before render, search for POINT, PERCENT, SEVENTY, SIXTEEN, "TYPE TWO" or "TWO DIABETES", and the raw word "Label".
  - (Spelled-out numbers in about 15 Shorts, most recently "ONE POINT ONE", "WAS POINT" and "PERCENT" in S2 11-26. "TYPE TWO" 5 times. A raw "Label" tag 3 times.)
- **The closing safety cards are fixed and pre-split. Never run them through the auto-splitter.**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card.
  - The don't-stop line is exactly two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" and "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN." Use "THAT EMERGENCY SIGN" when only one sign is named.
  - Read the last 4 cards of every Short before handoff.
  - (The safety line was split at the comma about 9 times and the don't-stop line was broken about 7 times, most recently in S1 11-26 (three cards) and S3 11-26 (split, and "REMEMBER:").)
- **Every other caption card is one whole clause on 2 lines or fewer.**
  - Never end a card on a comma, dash, colon, semicolon, bare number or possessive.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, HAVE, THOSE, TAKE, TYPE, YOUR, POINT, ISN'T or DOESN'T.
  - Never split a compound across cards ("SIDE / EFFECTS", "WEIGHT / LOSS").
  - (Found in nearly every Short. On 11-26: "EXTRA STRANDS CAN", "TIRZEPATIDE —", "SEVERE PAIN IN YOUR", among others.)
- **Tags, Shorts and long-form:**
  - Clear the previous card, tags and bubbles before the next card appears. That includes ghosted speech bubbles (S3 11-26).
  - Shorts: keep tags above y 1150, inside both side edges, and never behind the caption pill. Show at most 2 at a time.
  - Long-form: the bottom of every tag, name tags included, stays at y 1000 or less ("Dana, 52" was clipped in L1 11-26). Every label is at least about 40px, and no label is ever truncated.
  - Never render an empty or ghosted bubble, or an empty dash-placeholder tag rail.
  - (About 300 Shorts overlap findings. About 380 long-form off-screen findings and 300 tiny-text findings. Dash rails appeared 4 times.)
- **Backdrops:**
  - No teal or green cabinet strips and no hanging ornament circles.
  - No starfield or bokeh on any beat.
  - Night beats get a dark night room, never a bright daytime room.
  - (Cabinet strips or ornaments in about 31 pieces. Starfield or bokeh in about 30, including L1 11-26. Daytime rooms on night beats 5 times, most recently L1 11-26.)
- **Draw people as whole characters with a neck and shoulders, standing in front of the counter, never cropped by the counter or the frame edge. Draw every element the shot list names.**
  - Lock each character's skin tone, hair and outfit.
  - No ring, blob, outline-only or mannequin heroes, and no mascot on a person.
  - The first frame shows the main character in full. In long-form, the main character fills about a third of the frame height in the first 30 s.
  - Every shot has a labelled hero covering at least about 25% of the frame, and the art matches its beat.
  - If the shot list names a mascot, show the mascot. It was missing in L3 11-25, L1 11-25, L1 11-26 and S3 11-26.
  - (Floating heads in about 38 pieces, including L1, S2 and S3 11-26. About 245 near-empty findings. Continuity breaks in 8.)

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
  - Pancreatitis: tirzepatide "with or without vomiting"; Foundayo "with or without nausea or vomiting". The on-screen card keeps "stomach area" and that phrase.
  - Give the full allergy list.
  - List the gallbladder signs in the guide's order: upper stomach pain, fever, yellowing of skin or eyes, clay-colored stools (S2 11-26).
  - Fluid tips keep "unless you've been told to limit fluids". That caveat is our own, so it gets no source tag (L1 11-26 s26).
- **Write narration exactly as it should be spoken, and keep it evergreen.**
  - No digits.
  - Spell out contractions outside the fixed lines.
  - Every spoken number names its comparator.
  - Never write "now", "new", dates or "is requiring". "Now" appeared in L1 11-26 s4, s56 and s61.
- **Keep each finding at its source's exact number, scope, verb and hedge, recaps included.**
  - "Adverse events" and "adverse reactions" are never "side effects".
  - Postmarketing reports stay labelled "postmarketing" (L1 11-26 s25).
  - "May be higher" never becomes "is higher".
  - Never add "most", "mostly", "many", "often", "similar", "even" or "a few days".
  - Never present slower stomach emptying as the cause.
  - The SURMOUNT-1 comparator is "placebo plus counseling".
  - Never rank doses the trial didn't compare, never call a single trial "not a fluke", and never call our own arithmetic "the paper's result".
  - (About 145 findings.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and shows all of sentence 1's answer, hedge included.
  - Every stat card names the measure, the drug and dose, both groups, the full population and the timeframe.
  - Never write "no diabetes" or drop "weight-related".
  - On-screen text is never narrower or stronger than the narration ("likely explanation" became a diagnosis on the S1 11-26 card).
  - (About 115 findings; S3 11-26 s2 showed a number with no measure.)

### Carousel Designer
- **Make a carousel only when the scheduler asks, and reuse verified Short text only.**
  - Use the label's term "adverse reactions".
  - Keep each trial's full population in the recap.
  - Every source has a real revised date (C1 11-20 was held for a staff note).
  - (All 4 carousels had findings.)

### Social Copywriter & packaging
- **Thumbnail and title numbers always show drug vs comparator as separate figures. Never merge placebo and drug into one range.**
  - Write "44–62% VS 10% PLACEBO", not "10%–62%".
  - For a use that isn't approved, the subtext says it.
  - Titles name the exact device the video covers.
  - (A merged range caused the L3 11-25 hold.)
- **Long-form descriptions are complete viewer copy of 1,250 characters or fewer.**
  - Line 1 stays empty.
  - Then the safety block, the quick answer (naming both groups) and 2–3 sources, including the Medication Guide when you quote its emergency wording (L1 11-26).
  - End exactly on "…whether it's right for you." with no markup, brackets or placeholders anywhere.
  - (Cut off, leaked markup, a placeholder or a missing ending 7 times.)
- **Name one watch-next target in the post notes and let the publisher add the link. Never write a placeholder line.**
  - Follow the playbook's link list.
  - The target must match the Short's drug and population.
  - Never the home page, and never MQqAwUKAKSI.
  - (Missing, wrong or a placeholder in 7 pieces.)
- **Every caption field ends exactly on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it.
  - Copy the emergency line in the script's own words.
  - Write "that emergency sign" when one sign is named.
  - Threads is about 300 characters: cut facts, never safety lines.
  - (Threads over the limit about 46 times, including S2 11-26. Emergency line paraphrased 6 times.)
- **Copy facts, measures, populations, device scope and attributions word for word from the verified script, on every platform and in the pinned comment.**
  - Keep the trial population on TikTok and Threads too.
  - Keep the "US single-dose pen" scope and the KwikPen/vial line on pen posts.
  - Keep drug names outside quoted label text.
  - Never list our own tips under "the label says".
  - Never add openers the script doesn't have: questions, validation lines or "actually".
  - (About 175 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - No cause, timeframe or "common" claim the content doesn't make.
  - Holiday Shorts: the holiday is the setting, never the cause. Avoid titles like "Diarrhea After Thanksgiving" or "Threw Up After the Big Dinner" (S3 11-23, S3 11-26).
  - One save or share ask, never an open question.
  - Hashtags are only the generic names of drugs whose data the post reports: no #Foundayo, #GLP1, #weightloss, #obesity, #sideeffects, symptom tags or trial tags.
  - (About 75 pieces.)

### Everyone
- **Never re-produce a video that is live or already made. Fix the known faults, then re-render or publish.**
  - **Serious Risks (L1 11-26, held; until 2026-11-30):** don't script it again. It is re-timed.
    - regenerate the "tears appetite" and "moongiaro" scenes, then re-check the transcript
    - drop "now" in s4, s56 and s61
    - s25: say "postmarketing reports"
    - s26 and s29: remove the source tag from our own caveat and our own tip
    - S2: confirm the Medication Guide's real revised date
    - description: cite the Medication Guide for the emergency wording
  - **Fatty Liver / MASH (L3 11-25, held):** don't script it again. Before it publishes:
    - thumbnail: "MASH RESOLVED: 44–62% VS 10% PLACEBO", with subtext "ONE PHASE 2 BIOPSY TRIAL · NOT AN APPROVED USE"
    - description: label the 30% as placebo and give the full population
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
  - **S1 11-26 Hair Shedding (held):** remix to 0.02 or lower and rebuild the don't-stop line as two cards. Don't rewrite the script.
  - **S2 11-26 Right-Rib Pain (REVISE):** put in the Medication Guide's real "Revised: 11/2026" date and reorder the gallbladder signs.
  - **Foundayo What to Expect (made 11-24, ssb7Zcs3KSY):** never script it again. Confirm that the description and pinned comment have:
    - the Medication Guide's emergency wording
    - "permanently stopped treatment because of adverse reactions"
    - the drug name outside the quoted label text
  - **Already live, never make again:** Mounjaro vs Ozempic (SURPASS-2) since 11-23, and Months 2–6 since 11-16.
  - **S3 11-22 (holiday slot, until 2026-11-27):** restore the hook, remix to 0.02 or lower, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10; until 2026-11-30):** re-time both on the render before they ship.
- **Every source needs its own working URL and a real revised date. Never use a placeholder, a bare year or a staff note.**
  - The Medication Guide and the IFU each get their own URL.
  - Find the quoted sentence before you cite it.
  - Source titles list only the sections cited, with numbers (hypoglycemia 5.7, rotation 2.4).
  - No 4xx errors, newsroom pages or search pages.
  - If a PDF's date can't be read, take it from DailyMed. Never leave a placeholder (S2 11-26 was REVISEd for this; C1 11-20 was held).
  - Known dates:
    - Mounjaro PI: 27 Aug 2026
    - Foundayo label: rev 7/2026
    - NHS nausea page: 17 Nov 2023
    - Zepbound: the DailyMed label was updated 16 Nov 2026 and the Medication Guide reads "Revised: 11/2026". Use these, not the older 8/2026.
  - Our own tips and safety lines get no tag.
  - (About 105 findings.)
- **Give every result its exact scope.**
  - Obesity trials: adults with obesity, or overweight plus a weight-related condition, without diabetes. Pooled label data cover Study 1 (no type 2 diabetes) and Study 2 (type 2 diabetes only), treated for up to 72 weeks.
  - Zepbound's uses include moderate to severe obstructive sleep apnea in adults with obesity.
  - SELECT: preexisting CV disease and a BMI of 27 or more, without diabetes.
  - SURPASS-2: adults with type 2 diabetes on metformin, 40 weeks, each arm vs semaglutide 1 mg.
  - MASH: one phase 2 biopsy trial; not an approved use.
  - Low blood sugar: "may be higher" with insulin or a sulfonylurea, and also reported in adults without type 2 diabetes.
  - Pancreatitis: 0.23 vs 0.11 only alongside 0.14 vs 0.15.
  - Gallbladder: gallstones 1.1% vs 1%; inflammation 0.7% vs 0.2%.
  - 75/25: from the 160-person DXA substudy.
  - SURMOUNT-4: +14.0% regain on placebo, still 9.9% below baseline.
  - Hair loss: 5.4% vs 0.9%.
  - Injection-site reactions: 6–8% vs about 2%.
  - Pen: 21 days in total; press and hold for up to 10 seconds; the guide bans *loose* pens in household trash.
  - Foundayo: top label dose 17.2 mg, −11.1% in Trial 1; 10.3% vs 2.7% stopped for adverse events at 36 mg.

_Updated 2026-11-26 from 73 QA records (all GLP-1, 11-13 to 11-26)._

_Updated 2026-11-26 from 73 QA records._
