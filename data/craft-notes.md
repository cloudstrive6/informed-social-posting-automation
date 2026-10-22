_Based on 69 QA records from 2026-10-09 to 2026-10-22: 39 Shorts, 17 long-forms and 13 carousels. 50 are GLP-1 (10-13 to 10-22) and 19 are plague (10-09 to 10-12). 11 were held and 2 failed before render (L3 10-10 and L1 10-12). 10-08 has dropped out of the window and 10-11 has no records._

_New on 10-22 (5 GLP-1 pieces). **2 of the 3 Shorts were held again** (2 on 10-21 as well). Every rule below still applies. What happened on 10-22:_
- _**Audio:** S2 was held at a masking score of 0.039, the 4th masking hold and the 3rd in two days. The music bed is still too loud by default._
- _**Subtitles (new hold type):** S3 was held because the subtitle text said "pin" and "pins" instead of "pen", "fiveth" instead of "fifth", wrote the lot number PAR1229 out as words, and broke "PAR" and "EXP" into single letters. In a Short about spotting fake pens, a wrong lot number is a safety error._
- _**Captions:** all 3 Shorts spelled numbers out ("ONE POINT NINE FOUR", "JUNE TWENTY TWENTY-FIVE", "QUARTER OF TWENTY TWENTY-SEVEN") and ended cards on banned words (colon, dash, HASN'T, comma)._
- _**Long-form L1:** 58 off-screen findings, the highest so far. The "Counterfeit pen", "Licensed pharmacist", "Pharmacist" and "Prescriber" tags were cropped at the bottom. "Jen" was drawn as a bare floating head, and her name tag ended up on a vial icon. The video opened on an empty room._
- _**Facts and packaging:** "severe" was added to a MedlinePlus warning sign. A conclusion was credited to "EMA" when it came from PRAC. A status gave only the month ("in July"). The carousel labelled the SURMOUNT-5 semaglutide arm "2.4 mg (max)". For the 3rd time, a spoken CTA named a long-form but description line 1 didn't link to that video (it said "follow for more" instead). A counterfeit-warning stat used a green checkmark._

_Why items were held (in this window):_
- _**4 for voice masked by music:** S3 10-16, S2 10-21, S3 10-21, S2 10-22._
- _**4 for crediting a claim to the wrong body, person, page or date:** L1 10-09, L1 10-10, L3 10-10 (failed), S3 10-14._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10, S3 10-12._
- _**2 for wrong subtitle or script text:** S3 10-22 (pen, lot code) and S3 10-14 (misspelled drug name)._
- _**1 for an unsourced claim:** L1 10-12 (failed; it said the strain was weakened "on purpose")._
- _**Also cited:** a description that was cut off (L1 10-09)._

### Motion Designer
- **Audio: the voice always wins. Masking must be 0.02 or lower in the final mix.** Above 0.03 is an automatic drop.
  - The template's default music bed is too loud. Lower it before the first mix, duck the music under all narration, and keep sound effects away from spoken numbers, drug names and codes.
  - Measure masking as the last step before render. If it's above 0.02, pull the music down and measure again.
  - (4 holds: S3 10-16 at 0.07, S2 and S3 10-21 at 0.034, S2 10-22 at 0.039. Two shipped above 0.03: S2 10-16 at 0.05 and S1 10-19 at 0.034. Close calls: 0.029, 0.028 and 0.025.)
- **Every caption card ends where a clause or a full noun phrase ends. It fits in 2 lines or fewer, and only one card is on screen at a time.**
  - Never end a card on a comma, dash, colon, ellipsis, open quote mark, article, auxiliary, negation, preposition, conjunction, question word, relative pronoun, possessive, bare number, or bare verb or adjective. Examples: THE, A, BE, DOES, CAN, NOT, HASN'T, WEREN'T, OR, WHO, WHOSE, ABOUT, PLUS, POINT, FDA'S, STICK, PROTECT. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase, trial name or quoted name across cards ("NOT CONFIRMED", "OVERWEIGHT PLUS A RELATED CONDITION", "HEAD-TO-HEAD", "OBSTRUCTIVE SLEEP APNEA", "REDEFINE 1", "MOUNJARO" recall).
  - (Fragments in about 38 of 39 Shorts, including every Short through 10-22. A stranded "NOT", "HASN'T" or "WEREN'T" flipped the meaning, or risked flipping it, about 5 times.)
- **Build caption text from the script's on-screen text and numerals, never from the spoken transcript or a phonetic spelling.** Every number, dose, date, year and code must match its stat pill exactly and stay on one card.
  - Write "64 vials", "15 mg", "1.94", "25%", "Oct 8", "June 2025", "2026", "Q1 2027".
  - Keep lot numbers and codes whole, exactly as printed ("PAR1229", "EXP"). Never break them into single letters or write them as words.
  - Copy device and drug words from the script ("pen", not "pin").
  - Before render, search the captions for number words (ZERO–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, MILLIGRAM, TWENTY TWENTY, QUARTER OF, FIRST–THIRTIETH) and for letters separated by spaces, and fix every hit.
  - (About 32 Shorts, including every Short from 10-18 to 10-22. A wrong or garbled number or code reached the screen about 9 times. 1 hold: S3 10-22.)
- **Shorts: tags, name labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet or under a pill or syringe.** Fade each tag out before the next caption appears; if it can't be cleared in time, cut it.
  - Repeat offenders: drug-name tags under pill faces, "FDA", "Stomach", "Heart", "Gut", "Digestive system", "Lean mass", "Body scan", "Fat cell", "Health records", "Type 2 diabetes" and "Compounding pharmacy".
  - (About 210 overlap findings across 37 of 39 Shorts.)
- **Make all text at least ~40px on a 1080 frame, and every speech bubble fully opaque, or drop it.** (About 270 tiny-text findings across every rendered long-form, including 15 in L1 10-22.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - **Name tags go above characters, never under their feet.** Bottom-edge crops have now happened in 6 long-forms: L1 10-14, 10-17, 10-18, 10-20, 10-21 and 10-22 ("Dana, 47", "Sam", "Prescriber", "Licensed pharmacist").
  - Give each tag its own space so tags never merge ("SemaglutideTirzepatide").
  - Each tag goes on the thing it names (in L1 10-22 the "Jen" tag sat on a vial).
  - Never crop a head, mascot, pill or syringe at the frame edge.
  - Stat titles and subheads go on plain sky, gradient or a solid card, never on characters or busy art (8 Shorts).
  - (About 240 off-screen findings, 58 of them in L1 10-22.)
- **From its first frame, every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or an empty room.
  - Label every large shape. If the headline gives a count, show that many items.
  - **Before render, delete empty "–" placeholder chips, dashed shelves and stray template UI** (about 9 times).
  - (About 150 sparse findings in long-form, including the empty-room opener in L1 10-22.)
- **Mascots and icons must read as friendly, whole and on-message.**
  - No floating heads or disembodied eyes: characters need a neck and shoulders. No brown, coiled blobs for food or fiber. No scared organs on positive topics.
  - Never put a green check or "all clear" icon on a warning or counterfeit stat.
  - (L1 10-10, S2 10-13, S2 10-15, S1 10-21, L1 10-21, L1 10-22, S3 10-22.)
- **Long-form: one shot = one scripted beat.**
  - Before render, compare each shot's title and chips with the scripted beat at that timestamp.
  - If a run of shots shows cards from about 230–300 s later, the shot-to-beat timing table is offset: fix the mapping for the whole run.
  - Clear chips when the beat changes, and confirm the disclaimer and prescriber card appears at its beat.
  - (About 9 long-forms, including L1 10-17 and L1 10-20. No offset on 10-21 or 10-22, but keep checking.)

### Scriptwriters
- **The narration must be exactly what is spoken, word for word, with no phonetic respellings.**
  - Write "versus", not "vs". Write decimals the way they should be said ("zero point six", "one point nine four"). Write ordinals and years as spoken.
  - Spell codes the way they should be said (for example "P-A-R one-two-two-nine") and put the literal code ("PAR1229") in on_screen_text.
  - Use no merged or misspelled words ("redefinedfor", "aonec", "rita trutide", "pin" for "pen") and no leftover draft phrases ("hunter's appetite").
  - (About 15 pieces. Holds: S3 10-14 and S3 10-22.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 14 Shorts went over.)
- **Every number carries all of these in the narration, not only on screen:**
  - what it measures;
  - the exact arm and the comparator ("maximum tolerated dose", "all doses combined" for pooled arms, "top trial dose" only when the trial tested more than one dose);
  - each group's size, described exactly as the source describes it;
  - the timeframe;
  - the estimand;
  - an absolute rate next to any relative figure;
  - the source's figure, correctly rounded.
  - (About 38 findings.)
- **Keep every finding at its source's exact scope and verb.**
  - Observational results are "linked to". Guideline habits are "recommended". FDA says "verify".
  - Never add scope ("from any cause", "severe" on a MedlinePlus warning sign in L1 10-22, "on queasy days"). Never narrow it ("gastrointestinal" is not "stomach").
  - Low responders are "smaller", not "slower". Never state our own assumption as fact.
  - (3 holds or fails, plus about 12 more findings.)
- **Muted-viewer test: on-screen text and icons are never stronger, broader or more reassuring than the narration.**
  - Every stat card names the drug and dose, the comparator, the population, the measure, the timeframe and the estimand.
  - Spoken side-effect lines also appear on screen.
  - A shared lot number is not proof a pen is genuine (S3 10-22). Not proven is not the same as disproven.
  - (About 22 findings, including 1 hold.)
- **The hook and the title pay off exactly, in the order promised.**
  - Only name a video in the CTA if it is already published, and give its exact title. Otherwise say "follow for more".
  - (CTA problems in S1 10-13, S3 10-15, S2 10-20, S3 10-21 and S3 10-22. Hook mismatches in 4 pieces.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when, and keeps the source's hedge, exact verb and scope.**
  - Label each arm exactly: in SURMOUNT-5 the semaglutide group took its maximum tolerated dose of 1.7 or 2.4 mg, not "2.4 mg (max)" (C1 10-22).
  - Split any N into its groups (C1 10-17, C1 10-20). Label adjusted odds ratios "adjusted", and give every bar its measure (for example "average % of body weight").
  - Call subgroup comparisons "subgroup averages, not head-to-head".
  - No placeholder cells. Only the exact printed words go inside quote marks.
  - The title promises no more than the slides deliver. The last slide carries the disclaimer and the prescriber line.
  - (About 44 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - Strict order:
    1. If the spoken CTA names a long-form, line 1 is **that video's own URL**. Never use the channel home page, and never write "follow for more" when the voice names a video.
    2. A quick answer of **3 lines or fewer** with one named common side effect and any dated status.
    3. The disclaimer plus the prescriber line.
    4. Up to 4 sources as clickable canonical URLs.
    5. Chapters (long-forms: named after the questions people search for; L1 10-22 had none).
  - (1 hold. Line-1 CTA link missing 3 times: S2 10-20, S3 10-21, S3 10-22. Quick answer too long in about 18 pieces. Sources missing in 4 pieces.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 number and 1 abbreviation.**
  - Give the exact population, arm, comparator and status.
  - Name the drug, and say "GLP-1 medicines" when a study looked at the whole class (S1 10-22).
  - Put the drug name next to each number. No clipped forms ("72-wk", "HF", "GI").
  - A recommendation or filing plan is not "approval". An old approval is not "now".
  - (About 34 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, hashtags included.**
  - Draft Threads bodies to about 300 characters, counted after the safety lines are in. Cut a clause, never a safety line.
  - (Threads ran over in about 33 pieces, every GLP-1 batch since 10-13.)
- **Copy facts, qualifiers, dates and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "self-reported", "average", "all doses combined", "subgroup", "mostly mild to moderate", the full population, and dated statuses with the year.
  - Every comparison or benefit caption names its common side effects (C1 10-22).
  - No causal words and no "save this" promises the post doesn't deliver.
  - (About 135 findings, in every GLP-1 batch.)
- **The first line of every caption carries the hedge, the scope and the population, before the fold. TikTok never opens with hashtags.** (About 13 times since 10-16, including C1 10-22.)
  - Engagement lines and pinned comments ask people to save or share only.
  - No emoji on side-effect, safety or gray-market posts. No #WeightLoss. No #Mounjaro or #Zepbound on posts about compounded products.

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1 and the retatrutide Phase 2 and TRIUMPH trials:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial.
  - **SURMOUNT-5 arms:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at its maximum tolerated dose of 1.7 or 2.4 mg. The 7.2 mg semaglutide dose was not tested in this trial.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SUMMIT:** HFpEF (EF ≥ 50%) with obesity. **SURMOUNT-OSA:** moderate-to-severe OSA in adults with obesity. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **The 2.03M surgery cohort:** matched groups, surgery over 1 hour, at least 24 h in hospital, "major" heart complications. Always say it didn't assess continuing versus withholding the medicine before surgery.
  - A boxed warning belongs to its own drug. Only semaglutide and orforglipron are pills.
  - (About 35 findings.)
- **Credit every line to whoever actually said it, and date it with day, month and year.**
  - Name the exact body (EMA's safety committee PRAC, not "EMA"). A reporter's description is not the company's statement.
  - Never use a month alone ("in July", "In August").
  - EU steps: "CHMP recommended… Commission decision pending".
  - (4 holds plus 3 status holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips, safety advice, analogies and conclusions get no tag. The joint GLP-1 advisory does not say "protein at each meal", "eat slowly" or "sip fluids through the day". (About 84 findings, including L1 10-21 and L1 10-22.)
- **Every piece shows and says "Not personal advice", plus the prescriber line, recall and safety Shorts included.**
  - Every benefit comes with its common side effects, and every tip keeps its safety caveat.
  - Comparison and coverage posts say "don't switch, stop or change your current medicines on your own".
  - Gray-market posts point to a prescriber about approved options or trials.
  - (About 22 findings.)
- **Keep the source list clean.**
  - Use the final canonical URL of the specific record (for example the openFDA recall record), never an index, search or landing page.
  - No DOI, linkinghub or 302 redirects, and no AMP, 403 or 404 pages.
  - Use the exact published title, label online-first and print dates, and give the last-reviewed date on living pages.
  - List only sources a scene cites.
  - (About 85 findings.)

_Updated 2026-10-22 from 69 QA records (50 GLP-1, 19 plague)._

_Updated 2026-10-22 from 69 QA records._
