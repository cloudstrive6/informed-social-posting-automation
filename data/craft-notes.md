_Based on 75 QA records from 2026-11-15 to 2026-11-28: 45 Shorts, 26 long videos and 4 carousels, all about GLP-1. Four records are new since the last pass, all from 11-28: **L1 Tirzepatide After 6 Months** (the re-render of the 11-25 hold), **S1 Heartburn at Night**, **S2 Backed Up on Foundayo** and **S3 Home Blood Pressure**. None was held, but all four repeat known faults:_
- _Fixed safety cards run through the auto-splitter (S1, S2, S3)._
- _Spelled-out numbers: "TWENTY", "TWENTY-FOUR", "NINE PERCENT", "TWO POINT TWO PERCENT"._
- _Floating heads in L1, S2 and S3; abstract circles drawn instead of the named people in S2 and L1._
- _Wrong-scene art in L1 (shot 13 showed shot 12's content)._
- _A daytime room on a night beat in L1._
- _S2 was handed off at masking 0.026._
- _S3 had "vs" in the narration (heard as "versus") and promised a full video in a Short._
- _S2's word count was logged wrong again._

_**Where things stand on 11-28:** no new holds since 11-26. Every long-video render from 11-24 to 11-28 passed beat sync, and no drug name was misheard on 11-28. The visual and caption faults are unchanged and appear in every video piece._

_**16 held or failed in this window:**_
- _4 for beat drift: L1 and L2 11-16, L1 11-21, L1 11-23._
- _6 for audio or narration: S1 11-16, L1 11-22, S3 11-22, L1 11-25, L1 11-26, S1 11-26._
- _5 for sources or fact-check: C1 11-20, Foundayo 11-20 and 11-21, L2 11-26, L3 11-26. S2 11-26 also got a REVISE._
- _1 for packaging: L3 11-25._

_**Ignore:**_
- _Findings that cite a 170-word or 90 s Shorts limit._
- _Exp F card or link-promise findings on Shorts with content dates up to 2026-11-16 (S3 11-15, S3 11-16)._
- _Offset-beat findings from records up to 2026-11-09 (a QA bug; those videos were in sync). Only the automatic beat-sync gate counts for timing._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, no "link in the description" line or card, and no promise of a full video. This applies to re-renders of older scripts too. Never add any of them back._

### Motion Designer
- **Check beat sync and scene content on the long-form render, not on the plan.**
  - Re-time every cut from the final word timestamps, and again after any scene is regenerated. Fix any cut more than 0.5 s off.
  - Check every shot's text **and art** against its own scene ID. The renderer pulls another scene's content into shots that share a layout.
  - Evidence: 4 gate holds, with plans 99–100% on time and renders 76–93%. Wrong-scene content 4 times: L2 11-16, L1 11-21, L1 11-23 and L1 11-28 (shot 13 showed shot 12's broccoli instead of the Mounjaro/Zepbound packages). Renders from 11-24 to 11-28 passed.
- **Before handoff, run speech-to-text on every scene and compare it with the script.**
  - Check drug names first: tirzepatide, semaglutide, orforglipron, dulaglutide, Mounjaro, Zepbound, Ozempic, Foundayo. Then check every number, unit, "point", acronym, contraction and "vs".
  - If a name is misheard, regenerate that scene with a phonetic respelling, then re-time and re-check it. A misheard name is a ship-blocker and is never handed off with a note.
  - Evidence: "tears epitide" and "some agglutide" (L2 11-23); "tears appetite" (L1 11-25 and L1 11-26, both held); "moongiaro" (L1 11-26); "found ao" (L1 11-27); "tenmg", "gip", "sub study", "why is", and "versus" for "vs" (S3 11-28).
- **Every scene has voice from its first word to its last,** including the closing scene and the Short's hook. (3 holds: S1 11-16, L1 11-22, S3 11-22.)
- **Measure masking last, on the final file of every piece.**
  - Never hand off above 0.02; aim for 0.015 or lower. Re-measure after every re-render.
  - Duck the music under all narration. Put no stinger on a spoken number, drug name or safety line.
  - Evidence: 10 pieces over 0.02, including 4 holds. Several went out marked "ready": L2 11-23 at 0.03, S1 11-23 at 0.025, S2 11-28 at 0.026.
- **Build captions and tags from the script's on-screen text field, never from the narration.**
  - Numbers are digits that match the stat pill.
  - Before render, search for POINT, PERCENT, TWENTY, SEVENTY, SIXTEEN, NINE, "TYPE TWO", "SURMOUNT ONE", the raw word "Label" and any [bracketed] note.
  - Evidence: spelled-out numbers in about 13 Shorts in this window, 3 of them on 11-28; "TYPE TWO" 5 times; raw "Label" 3 times.
- **The closing safety cards are fixed and pre-split. Never run them through the auto-splitter.**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card.
  - The don't-stop line is exactly two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" / "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN." Use "THAT EMERGENCY SIGN" when only one sign is named.
  - The emergency card keeps the guide's full wording: "healthcare provider", "stomach area", "with or without vomiting".
  - In emergency, allergy and gallbladder sign lists, each card is one whole sign ending on a period (S1 11-28 "OR BLACK STOOLS,").
  - Read the last 4 cards of every Short before handoff.
  - Evidence: the advice card split at the comma 12 times, most recently S1 and S2 11-28; the don't-stop line broken about 9 times, most recently S3 11-28.
- **Every other caption card is one whole clause on 2 lines or fewer.**
  - Never end a card on a comma, dash, colon, semicolon, bare number or possessive.
  - Never end a card on THE, A, AS, CAN, LET, ABOUT, HOW, WHEN, HAVE, THOSE, TAKE, TYPE, YOUR, POINT, ISN'T or DOESN'T.
  - Never split a compound across cards ("SIDE / EFFECTS", "BLOOD / PRESSURE" in S3 11-28).
  - Evidence: found in nearly every Short.
- **Tags:**
  - Clear the previous card, tags and bubbles (ghosted ones included) before the next card appears.
  - A tag never repeats the caption word under it.
  - Shorts: tags stay above y 1150, inside both edges, never behind the caption pill, and 2 at most at a time.
  - Long-form: the bottom of every tag, name tags included, stays at y 1000 or less.
  - Labels are about 40px or larger and never truncated. Never render an empty bubble or a dash-placeholder rail.
  - Evidence: about 115 Shorts overlap findings; about 370 long-form off-screen findings (25 in L1 11-28) and 140 tiny-text findings; dash rails 4 times.
- **Backdrops:**
  - No teal or green cabinet strips, no hanging ornament circles, and no starfield or bokeh on any beat.
  - Night beats get a dark night room.
  - Evidence: cabinet strips or ornaments in about 30 pieces, most recently L1 and S1 11-28; starfield in about 28; daytime rooms on night beats 6 times, most recently L1 11-28.
- **Draw people as whole characters with neck and shoulders, standing in front of the counter. Neither the counter, the tile strip nor the frame edge crops them.**
  - Lock each character's skin tone, hair and outfit.
  - No ring, blob, outline-only, avatar-circle or mannequin heroes, and never a mascot on a person's face or head.
  - Draw every person the shot list names. Never swap in an abstract circle (S2 11-28 pharmacist and thinking woman; L1 11-28 woman walking; L2 11-22 couple).
  - Frame 0.0 s shows the main character in full plus the hook's key elements. In long-form, the main character fills about a third of the frame height in the first 30 s.
  - Every shot has a labelled hero covering about 25% or more of the frame.
  - Evidence: floating heads in about 40 pieces, including 3 on 11-28; about 200 near-empty findings; continuity breaks in 8.

### Scriptwriters
- **Shorts length and closing.**
  - The length test ended on 11-26. If the task still sets an arm, follow it. Otherwise write to the topic at 45–70 s, and never go over 160 spoken words.
  - Count every word by hand and log the exact count. It was wrong 4 times: S2 11-23, S2 11-25, S1 11-27, S2 11-28.
  - Scene 1's narration holds the spoken hook (S3 11-22 was held for this).
  - The close runs in this exact order: "Not personal advice, so ask your prescriber.", then the emergency and don't-stop lines when the topic needs them, then the loop line. S2 11-28 had the order wrong.
  - Never promise a "full video" or a link in a Short (S2 11-25 s6, S3 11-28 s8).
- **Copy the fixed safety lines exactly, and speak and show each one in full.**
  - The emergency line keeps "stop… and get medical help right away" and "healthcare provider".
  - Don't-stop line: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Say "that emergency sign" when only one is named.
  - Pancreatitis wording: "with or without vomiting" for tirzepatide, and "with or without nausea or vomiting" for Foundayo. Quote cards keep "(abdomen)".
  - Give the full allergy list. List gallbladder signs in the guide's order: upper stomach pain, fever, yellowing of skin or eyes, clay-colored stools.
  - "Unless you've been told to limit fluids" is our own caveat: it gets no source tag and is never called guide wording.
  - Never pair a safety line with "before your next dose" or other dose-timing wording.
- **Write narration exactly as it will be spoken, and keep it evergreen.**
  - No digits and no abbreviations: write "versus", "milligrams", "type two". Spell out contractions outside the fixed lines (L1 11-28 s62).
  - Every spoken number names its comparator.
  - Never write "now", "new", dates, "is requiring", or "the"/"the only" for something that can change.
- **Keep each finding at its source's exact number, scope, verb and hedge, on every card and in every recap.**
  - SURMOUNT-1's comparator is "placebo plus counseling" on every card, never just "placebo". L1 11-28 shortened it on s11, s12, s26, s29, s36 and s37.
  - Non-inferiority against an active drug is weaker than beating placebo.
  - "Adverse events" and "adverse reactions" are never "side effects". Postmarketing stays "postmarketing". "May be higher" never becomes "is higher". A median stays "median".
  - Never add "most", "mostly", "many", "often", "similar", "even" or "a few days".
  - Never present slower stomach emptying as the cause. Never call one trial "not a fluke", rank doses the trial didn't compare, or call our own arithmetic "the paper's result".
  - A use that isn't approved says so from the first card. Prediabetes alone is not an approved use.
  - Tag a source only for what it actually measured (L1 11-28 s54).
  - Evidence: about 150 findings.
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug and shows sentence 1's answer, hedge included. For a head-to-head it also names the comparator and the outcome.
  - Every stat card names the measure, the drug and dose, both groups, the full population ("adults", "weight-related", and the pooled Study 1 + Study 2 when it applies) and the timeframe.
  - Never write "no diabetes". On-screen text is never narrower or stronger than the narration.
  - Evidence: about 120 findings, in all 4 pieces on 11-28.

### Carousel Designer
- **Make a carousel only when the scheduler asks, and reuse verified Short text only.**
  - Quotes match the source character for character (C1 11-27).
  - Use the label's term "adverse reactions" and keep each trial's full population in the recap.
  - Cite the date printed on the linked document. C1 11-20 was held for a staff note.
  - Evidence: all 4 carousels had findings.

### Social Copywriter & packaging
- **Thumbnail and title numbers show drug and comparator as separate figures. Never merge them into one range.**
  - Write "44–62% VS 10% PLACEBO", not "10%–62%". The merged range caused the L3 11-25 hold.
  - For a use that isn't approved, the subtext says so. Titles name the exact device the video covers.
- **Long-form descriptions are complete viewer copy of 1,250 characters or fewer.**
  - Line 1 stays empty. Then come the safety block, a quick answer naming both groups and the measure ("average"), and 2–3 sources.
  - When you quote the Medication Guide, cite it with its own URL (L1 11-28, L1 11-26).
  - Don't add a second generic disclaimer paragraph.
  - End exactly on "…whether it's right for you." with no markup, brackets or placeholders.
  - Evidence: markup, a placeholder or a missing link 4 times; over length 3 times.
- **Name one watch-next target in the post notes of every long video and Short. The publisher adds the link. Never write a placeholder line.**
  - Follow the playbook's link list. Head-to-heads → Zepbound vs Wegovy. The target matches the piece's drug and population.
  - Never the home page, and never MQqAwUKAKSI.
  - Evidence: missing, wrong or a placeholder in 7 pieces.
- **Every caption field ends exactly on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."**
  - Hashtags and the don't-stop line go before it. Never put a save ask between the emergency line and the don't-stop line (S3 11-28).
  - Copy the emergency line in the script's own words and never turn it into a question.
  - Threads is about 300 characters: cut facts, never safety lines, and never a topic-specific safety line such as "never change BP medicines on your own" (S3 11-28).
  - Evidence: Threads over the limit in about 40 pieces; emergency line paraphrased 7 times.
- **Copy facts, measures, populations, device scope and attributions word for word from the verified script, on every platform and in the pinned comment.**
  - Keep the full trial population on TikTok, Threads and in pinned comments.
  - Never put our own tips under "the label says" or straight after label claims.
  - Never add openers the script doesn't have: questions, validation lines, "actually".
  - Evidence: about 170 findings, in every batch.
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - Make no cause, timeframe or "common" claim the content doesn't make. A meal or holiday is the setting, never the cause.
  - Use one save or share ask that doesn't predict symptoms coming back.
  - Hashtags are only the generic names of drugs whose data the post reports. Never #Foundayo, #GLP1, #weightloss, #obesity, symptom tags or trial tags.
  - Evidence: about 70 pieces.

### Everyone
- **Never re-produce a video that is live or already made. Fix the known faults, then re-render or publish.**
  - **Already live; never make again, and edit only the title, description or pinned comment:** Foundayo What to Expect (ssb7Zcs3KSY), Mounjaro vs Ozempic (SURPASS-2), Months 2–6, Zepbound Vial vs Pen (LH-HTtwKz5I), Semaglutide and Kidney Disease (pC3XshJTcis).
  - **Tirzepatide After 6 Months (L1 11-28, ready):**
    - Every SURMOUNT-1 card says "placebo plus counseling".
    - s2: add "adults".
    - Shot 13: render the Mounjaro and Zepbound packages.
    - s62: spell out the contractions. s54: drop the S4 tag.
    - Give the Medication Guide its own URL in the description.
  - **Backed Up on Foundayo (S2 11-28):**
    - Remix to 0.02 or lower before it ships (it measured 0.026).
    - Rebuild the fixed cards and fix the closing order.
    - Use digits: 24% vs 9%.
    - Log 155 words.
    - Cite the Medication Guide as "Issued: 07/2026".
  - **Home Blood Pressure (S3 11-28):**
    - Write "versus" in the narration.
    - Cut the full-video promise in s8.
    - Use digits on the cards, and keep "BLOOD PRESSURE" on one card.
    - Rebuild the don't-stop cards.
    - The s1 card says "placebo plus counseling" and gives the population.
    - Threads keeps the BP-medicine line.
  - **Heartburn at Night (S1 11-28):**
    - Use the digit 20.
    - Rebuild the safety cards; each sign card ends on a period.
    - S4: "Page last reviewed: 13 November 2026".
    - Source black stools to the NHS rectal bleeding page.
  - **Foundayo and Sleep Apnea (L1 11-27):**
    - Regenerate the "found ao" scene.
    - The s1 card says this is not an approved use. The s2 card gives the full population. The s69 card names the measure, units, drug and timeframe.
    - s62: say "a". s23: drop "shape of tonsils".
    - Description: 1,250 characters or fewer, with "average" there and in the pinned comment.
  - **Queasy the Morning After (S3 11-27):**
    - Rebuild the safety cards. Change "TWENTY-EIGHT" to 28.
    - Redraw the hero with no mascot on her face.
    - Drop "dinner" from the captions.
  - **Serious Risks (L1 11-26, held; until 2026-11-30):**
    - Don't script it again.
    - Regenerate the "tears appetite" and "moongiaro" scenes.
    - Drop "now" in s4, s56 and s61. s25: "postmarketing reports".
    - Description: cite the Medication Guide.
  - **SURPASS-CVOT (L2 11-26) and Oats and Fibre (L3 11-26), REVISE; don't script either again:**
    - L2 s9: say non-inferior against an active drug.
    - L3: use Mounjaro's 27 Aug 2026 date, and say prediabetes alone isn't an approved use.
  - **Fatty Liver / MASH (L3 11-25, held):**
    - Thumbnail "MASH RESOLVED: 44–62% VS 10% PLACEBO" with the subtext "ONE PHASE 2 BIOPSY TRIAL · NOT AN APPROVED USE".
    - Fix the "Tirzepa" tag and drop "often" in s52.
  - **Smaller re-renders:**
    - S1 11-26 Hair Shedding (held): remix to 0.02 or lower and use the two-card don't-stop line.
    - S2 11-26 Right-Rib Pain: "Revised: 11/2026" and the guide's sign order.
    - S4 11-26 Itchy Rash: remove the bracketed note, put each allergy card on a period, and drop "before your next dose".
  - **Backups (Injection Site 11-09, Burping 11-10; until 2026-11-30):** re-time both on the render before they ship.
- **Every source needs its own working URL and the date printed on that exact document, in the document's own words ("Revised" or "Issued").**
  - Never a placeholder, staff note, bare year or another drug's date. A staff note reached a source field again in S1 11-28.
  - Mounjaro and Zepbound have separate labels and dates. The Medication Guide and the IFU each get their own URL.
  - Find the quoted sentence before you cite it. Source titles list only the cited sections, with numbers.
  - No 4xx, newsroom or search pages. If a PDF can't be read, take the date from DailyMed or FDALabel for that set ID.
  - Our own tips and safety lines get no source tag.
  - Known dates:
    - Mounjaro PI and Medication Guide: 27 Aug 2026 (SPL v40).
    - Zepbound: DailyMed 16 Nov 2026; label, Medication Guide and pen PDFs printed "Revised: 11/2026".
    - Ozempic: printed PI "Revised: 5/2026".
    - Foundayo: label rev 7/2026; Medication Guide "Issued: 07/2026".
    - NHS nausea page: 17 Nov 2023.
  - Evidence: about 100 findings.
- **Give every result its exact scope.**
  - **Weight trials and labels:**
    - The obesity trials enrolled adults with obesity, or with overweight plus a weight-related condition.
    - The pooled label data are Study 1 (no type 2 diabetes) and Study 2 (type 2 diabetes only), with patients treated "for up to 72 weeks".
    - Zepbound is also approved for moderate to severe obstructive sleep apnea in adults with obesity. Foundayo is not approved for it.
  - **Outcome trials:**
    - SELECT: preexisting CV disease and a BMI of 27 or more, without diabetes.
    - SURPASS-2: adults with type 2 diabetes on metformin, 40 weeks, each arm vs semaglutide 1 mg.
    - SURPASS-CVOT: 13,299 adults, 12.2% vs 13.1% (HR 0.92), non-inferior, not shown superior (P=0.09), no placebo group.
  - **Other figures:**
    - SURMOUNT-4: +14.0% regain on placebo, still 9.9% below baseline. The 75/25 split comes from the 160-person DXA substudy.
    - Low blood sugar "may be higher" with insulin or a sulfonylurea, and is also reported without type 2 diabetes.
    - Pancreatitis: give 0.23 vs 0.11 only alongside 0.14 vs 0.15.
    - Gallstones 1.1% vs 1%; gallbladder inflammation 0.7% vs 0.2%.
    - Hair loss 5.4% vs 0.9%. Injection-site reactions 6–8% vs about 2%.
  - **Pen:** 21 days in total; press and hold for up to 10 seconds; only *loose* pens are banned from household trash.
  - **Foundayo:** −11.1% in Trial 1; 10.3% vs 2.7% stopped for adverse events at 36 mg.

_Updated 2026-11-28 from 75 QA records (all GLP-1, 11-15 to 11-28)._

_Updated 2026-11-28 from 75 QA records._
