_Based on 69 QA records from 2026-10-10 to 2026-10-23: 39 Shorts, 17 long-forms and 13 carousels. 55 are GLP-1 (10-13 to 10-23) and 14 are plague (10-10 and 10-12). 9 were held and 2 failed before render (L3 10-10 and L1 10-12). 10-09 has dropped out of the window, and 10-11 has no records._

_New on 10-23 (5 GLP-1 pieces): **nothing was held**, the first clean day since 10-20. Every rule below still applies, because the same mistakes are still reaching the screen:_
- _S3 shipped with masking at exactly 0.030, right on the drop line._
- _All 3 Shorts spelled numbers or codes out in the captions: "ONE THOUSAND ONE" for 1,180, "B-P-C ONE-FIVE-SEVEN", "N-S-W", "TWENTY TWENTY-SIX"._
- _L1 showed dashed placeholder shelves in 3 shots in a row, cropped the "Prescriber" tag at the bottom, and left a placeholder `VIDEO_ID` link in the description and pinned comment._
- _For the 4th time, a spoken CTA named a long-form while description line 1 said "follow for more" (S3)._
- _S3's title said "Zepbound Pen", but only the KwikPen is covered (major packaging finding)._

_Why items were held (in this window):_
- _**4 for voice masked by music:** S3 10-16, S2 10-21, S3 10-21, S2 10-22._
- _**3 for crediting a claim to the wrong body, person, page or date:** L1 10-10, L3 10-10 (failed), S3 10-14._
- _**2 for a status that was incomplete or too reassuring:** L2 10-10, S3 10-12._
- _**2 for wrong subtitle or script text:** S3 10-14 and S3 10-22._
- _**1 for an unsourced claim:** L1 10-12 (failed)._
- _**1 for overstating a test result:** L1 10-10 called presumptive PCR or antigen results "confirmed"._

### Motion Designer
- **Audio: masking must be 0.02 or lower in the final mix.** Above 0.03 is an automatic drop. Lower the template's music bed before the first mix, duck it under all narration, and keep sound effects away from spoken numbers, names and codes. Measure masking as the last step before render; if it's above 0.02, lower the music and measure again. (4 holds. Shipped above 0.03: S2 10-16 at 0.05 and S1 10-19 at 0.034. S3 10-23 shipped at exactly 0.030. Close calls: 0.029, 0.028, 0.025.)
- **Every caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only card on screen.** Never end a card on a comma, dash, colon, ellipsis, open quote mark, article, auxiliary, negation, preposition, conjunction, question word, possessive, bare number, or bare verb or adjective (THE, BE, MAY, NOT, HASN'T, OR, WHOSE, ABOUT, PLUS, POINT, FDA'S, CLEAR). If a card ends on one, merge it with the next card. Never split a trial name or fixed phrase ("REDEFINE 1", "OBSTRUCTIVE SLEEP APNEA"). (Fragments in about 38 of 39 Shorts, including all 3 on 10-23. A stranded negation flipped the meaning, or risked flipping it, about 5 times.)
- **Build captions from the script's on-screen text, never from the spoken transcript.** Every number, date, year and code must match its stat pill and stay on one card: "1,180", "72", "Type 2", "2026", "Q1 2027". Keep codes whole and exactly as printed ("PAR1229", "EXP", "NSW", "BPC-157"). Never break them into spaced letters or write them as words. Before render, search the captions for number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, QUARTER OF, FIRST–THIRTIETH) and for spaced or hyphenated single letters, and fix every hit. (Every Short from 10-18 to 10-23. A garbled number or code reached the screen about 11 times. 1 hold: S3 10-22.)
- **Shorts: tags, labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet.** Fade each tag out before the next caption appears; if it can't be cleared in time, cut it. Repeat offenders: drug-name tags under pills, "FDA", "Stomach", "Heart", "Lean mass", "Body scan", "Type 2 diabetes", "Drug plan". (About 225 overlap findings across 38 of 39 Shorts, including 13 in S3 10-23.)
- **All text at least ~40px on a 1080 frame, and every speech bubble fully opaque, or drop it.** (About 280 tiny-text findings, in every rendered long-form, including 8 in L1 10-23.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920) and off the hero art.** Name tags go above characters. Give each tag its own space, put it on the thing it names, and never crop a head, pill or chip at the edge. Stat titles go on plain sky, a gradient or a solid card. (Bottom-edge tag crops in 7 long-forms: L1 10-14, 10-17, 10-18, 10-20, 10-21, 10-22 and 10-23. The "Zepbound KwikPen" chip went off-screen in S3 10-23. About 250 off-screen findings in total.)
- **From the first frame, every frame has a headline plus a labelled hero covering at least ~25% of it.** Never open on, hold on or end on bare stats, a lone icon, chips only or an empty room. **Before render, delete every empty "–" placeholder chip, dashed shelf and stray template grid.** (Placeholders shipped about 12 times, including 3 shots in L1 10-23 and in S2 10-23. About 165 sparse findings in long-form, 15 of them in L1 10-23.)
- **Mascots must read as friendly, whole and on-message.**
  - Characters need a neck and shoulders: no floating heads.
  - No brown coiled or blob shapes.
  - No scared organs on positive topics, and no grinning mascot next to "heart attack risk".
  - Never put a green check on a warning or counterfeit stat.
  - (Floating heads: S1 10-21, L1 10-22, S2 10-23 twice. Brown blobs: L1 10-21, S2 10-23. Plus about 5 more.)
- **Long-form: one shot = one scripted beat.** Before render, compare each shot's title and chips with its scripted beat. If a run of shots shows cards from about 230–300 s later, fix the timing table for the whole run. Confirm the disclaimer card appears at its beat. (L2 10-10, L4 10-10, L1 10-17 and L1 10-20. No offsets 10-21 to 10-23; keep checking.)

### Scriptwriters
- **Narration is exactly what gets spoken, word for word.**
  - Write ordinals and numbers as words ("first", never "1st"), "versus" (not "vs"), decimals as said ("zero point six").
  - Spell codes the way they're said ("P-A-R one-two-two-nine") and put the literal code in on_screen_text.
  - Read every line aloud for merged words or words a listener could mishear ("redefinedfor", "aonec", "onest", "were it" for "worried") and for leftover draft phrases.
  - (About 18 pieces, including L1 and S2 10-23. Holds: S3 10-14 and S3 10-22.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 15 Shorts went over, including S2 10-23 at 183.)
- **Every number says in the narration:**
  - what it measures;
  - the exact arm and comparator ("top trial dose" only when several doses were tested);
  - each group's size;
  - the full timeframe, with the end date spoken (S1 10-23);
  - the estimand;
  - an absolute rate next to any relative figure.
  - Give the common side effects for **each** drug named (S2 10-23). (About 42 findings.)
- **Keep every finding at its source's exact scope and verb.**
  - Observational = "linked to". FDA says "verify". A test the source calls presumptive is not "confirmed".
  - A minimum stays a minimum ("at least 2 days").
  - Keep every qualifier ("noncirrhotic MASH", every eligibility pathway). Never add "severe" or "from any cause".
  - Don't merge deadlines: Dec 7 is Part D enrollment, not a Bridge deadline (S3 10-23).
  - (1 hold plus about 16 findings.)
- **Muted-viewer test: on-screen text is never stronger, broader or more reassuring than the narration.** Every stat card names the drug and dose, comparator, population, measure and timeframe. Spoken side-effect lines also appear on screen. A shared lot number is not proof a pen is genuine. (About 25 findings, 1 hold.)
- **The hook and title pay off exactly.** The CTA names only an already-published video, by its exact title; otherwise say "follow for more". (CTA problems in 6 Shorts, including S3 10-23.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label every arm exactly (SURMOUNT-5 semaglutide = maximum tolerated 1.7 or 2.4 mg, not "2.4 mg (max)").
  - Name the drug next to "top dose" (C1 10-23).
  - Split any N into its groups, mark adjusted ratios "adjusted", and give every bar its measure.
  - Add a one-line note when a result looks counterintuitive (for example, placebo losing more weight than the comparator, C1 10-23).
  - Credit and date every filing plan.
  - The title promises no more than the slides deliver, and the last slide carries the disclaimer and the prescriber line.
  - (About 47 findings.)

### Social Copywriter & packaging
- **YouTube description, in this order, ≤1,400 characters after assembly:**
  1. If the voice names a video, that video's real URL (never "follow for more", never a placeholder like `VIDEO_ID`).
  2. A quick answer of 3 lines or fewer, with one named side effect and any dated status.
  3. The disclaimer plus the prescriber line.
  4. Up to 4 canonical source URLs.
  5. Chapters named after searched questions (long-forms).
  - (Line-1 link missing 4 times: S2 10-20, S3 10-21, S3 10-22, S3 10-23. Placeholder URL: L1 10-23. Quick answer too long about 20 times. Sources missing 5 times.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 number and 1 abbreviation, and name the exact product, population and status.** "Zepbound KwikPen", not "Zepbound Pen" (major finding, S3 10-23). Say "GLP-1 medicines" when a study covered the class. A filing plan is not approval, and an old approval is not "now". (About 37 findings.)
- **Every field ends on the disclaimer plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it, hashtags included.** Threads bodies are about 300 characters with the safety lines counted; cut a clause, never a safety line. (Threads ran over in every GLP-1 batch from 10-13 to 10-23. Content after the prescriber line in S1 10-23.)
- **Copy facts, qualifiers, measures and attributions word for word from the verified script.** Keep "estimated", "average % of body weight", "all doses combined", "if you qualify", dated statuses with the year and the source's verb ("associated with"). Every comparison or benefit caption names its common side effects, and every field carries the script's safety line. (About 140 findings, in every GLP-1 batch.)
- **The first line carries the hedge, the scope and the population, before the fold.** TikTok never opens with hashtags. Engagement lines and pinned comments ask people to save or share only. Open questions on gray-market posts invite "where to buy" comments (S1 10-20, S1 10-23). No emoji on side-effect, safety or gray-market posts. (About 16 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial.
  - **SURMOUNT-5 arms:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at its maximum tolerated dose of 1.7 or 2.4 mg. The 7.2 mg dose was not tested.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SUMMIT:** HFpEF (EF ≥ 50%) with obesity. **SURMOUNT-OSA:** moderate-to-severe OSA with obesity. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **The 2.03M surgery cohort:** matched groups, "major" heart complications, and it didn't assess continuing versus withholding the medicine before surgery.
  - Only semaglutide and orforglipron are pills.
  - (About 37 findings.)
- **Credit every line to whoever actually said it, with day, month and year.** Name the exact body (PRAC, not "EMA"). A reporter's description is not the company's statement. Never use a month alone. EU steps: "CHMP recommended… Commission decision pending". Every status includes every dated development. (3 attribution holds and 2 status holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. (About 88 findings, including L1 10-21, 10-22 and 10-23.)
- **Every piece shows and says "Not personal advice" plus the prescriber line, safety and recall Shorts included.** Comparison and coverage posts add "don't switch, stop or change your current medicines on your own". Gray-market posts point to a prescriber about approved options or trials. (About 24 findings.)
- **Keep the source list clean.** Use the final canonical URL of the specific record: no index or landing pages, no DOI or other redirects, no 403 or 404 pages. Check that the article ID in the URL really is the paper you cite (wrong Lancet ID in C1 10-23). Use exact titles with online-first and print dates, and list only sources a scene cites. (About 88 findings.)

_Updated 2026-10-23 from 69 QA records (55 GLP-1, 14 plague)._

_Updated 2026-10-23 from 69 QA records._
