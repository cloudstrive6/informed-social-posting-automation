_Based on 66 QA records from 2026-10-12 to 2026-10-24: 39 Shorts, 14 long-forms and 13 carousels. 60 are GLP-1 (10-13 to 10-24) and 6 are plague (10-12). 9 were held and 1 failed before render (L1 10-12). 10-10 is now outside the window, so the evidence counts below no longer include it._

_New on 10-24 (5 GLP-1 pieces): **2 held**, a step back from the clean day on 10-23:_
- _S1 was dropped for masking at 0.038. S3 shipped at 0.021, still above the 0.02 target._
- _S2 was dropped after the fact-checker returned REVISE. The video credited "not for use during pregnancy" to ACOG, but the source doesn't say that, and it applied a reason that only fits semaglutide to tirzepatide as well._
- _S1 captions said "THREE TRIALS" while the stat card said "2 trials", spelled BMI as "B-M-I" and wrote "TWENTY TWENTY-SIX". S3 cut "31.0%" to "THIRTY-ONE"._
- _S1 had 25 overlap findings and S2 had 20. Most were tags sitting behind the caption pill._
- _L1 showed dashed placeholder shelves again, a floating-head character twice, 35 off-screen findings, and no watch-next URL on description line 1._
- _S3 had a **major** packaging finding: the voice named a long-form, but line 1 said "Follow for more". That is the 5th time._

_Why items were held (in this window):_
- _**5 for voice masked by music:** S3 10-16, S2 10-21, S3 10-21, S2 10-22, S1 10-24._
- _**2 for crediting a claim to a source that didn't say it:** S3 10-14 (CNN's description credited to Lilly), S2 10-24 (ACOG)._
- _**2 for wrong subtitle or script text:** S3 10-14, S3 10-22._
- _**1 for an incomplete status:** S3 10-12._
- _**1 for an unsourced claim:** L1 10-12 (failed)._

### Motion Designer
- **Audio: masking must be 0.02 or lower in the final mix.** Above 0.03 is an automatic drop. Lower the template's music bed before the first mix, duck it under all narration, and keep sound effects away from spoken numbers, names and codes. Measure masking as the last step before render. If it's above 0.02, lower the music and measure again; never ship at "just under 0.03". (5 holds, the latest S1 10-24 at 0.038. Shipped above 0.03: S2 10-16 at 0.05, S1 10-19 at 0.034. Shipped at 0.030: S3 10-23. Shipped above target: 0.029, 0.028, 0.023, 0.021 twice. The 20:00 S3 slot is the most frequent offender.)
- **Every caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only card on screen.** Never end a card on any of these:
  - a comma, dash, colon, ellipsis or open quote mark;
  - an article, auxiliary, negation, preposition, conjunction, question word or possessive;
  - a bare number, verb or adjective (examples: A, THE, BE, BEING, CAN, MAY, NOT, HASN'T, OR, WHOSE, ABOUT, IN, PLUS, POINT, TYPE, FDA'S, CLEAR, EASES).
  - If a card ends on one of these, merge it with the next card. Never split a trial name or fixed phrase ("REDEFINE 1", "TYPE 2 DIABETES", "OBSTRUCTIVE SLEEP APNEA").
  - (Fragments in nearly every Short, including all 3 on 10-24. A stranded negation flipped the meaning, or risked flipping it, about 5 times.)
- **Build captions from the script's on-screen text, never from the spoken transcript.** Every number, decimal, date, year and code must match its stat pill exactly and stay on one card: "31.0%", "1,180", "2 trials", "2026", "Q1 2027". Keep codes whole and exactly as printed ("PAR1229", "BMI", "NSW", "BPC-157"); never break them into spaced letters or write them as words. Before render, check each card's numbers against its pill. Also search the captions for number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, QUARTER OF, FIRST–THIRTIETH) and for spaced or hyphenated single letters, and fix every hit. (In every Short from 10-14 to 10-24. A wrong or garbled number reached the screen about 13 times, including "THREE TRIALS" against "2 trials" in S1 10-24. 1 hold: S3 10-22.)
- **Shorts: tags, labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet or behind the caption pill.** Fade each tag out before the next caption appears; if it can't be cleared in time, cut it. Repeat offenders: drug-name tags under pills, "FDA", "Stomach", "Heart", "Lean mass", "Body scan", "Type 2 diabetes", "Drug plan", "Tirzepatide", "Baby". (About 270 overlap findings, 46 of them on 10-24: S1 had 25 and S2 had 20.)
- **Keep all text at least ~40px on a 1080 frame, with speech bubbles fully opaque, everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920), and nothing on the hero art.**
  - Name tags go above characters, never under their feet. Never crop a head, pill or chip at the edge.
  - Stat titles go on plain sky, a gradient or a solid card.
  - (Bottom-edge tag crops in 8 of the last 9 long-forms, from L1 10-14 to L1 10-24, which had 35 off-screen findings. Tiny text in every long-form. About 300 tiny-text and 280 off-screen findings in total.)
- **From the first frame, every frame has a headline plus a labelled hero covering at least ~25% of it.** Never open on, hold on or end on bare stats, a lone icon, chips only or an empty room. **Before render, delete every empty "–" placeholder chip, dashed shelf and stray template grid.** (Placeholders shipped about 14 times. Dashed shelves appeared in L1 10-19, 10-21, 10-23 and 10-24, and empty chips in S2 10-13, S1 10-16, S2 10-17 and S2 10-23. About 110 sparse findings in long-form, 14 of them in L1 10-24.)
- **Mascots must read as friendly, whole and on-message.**
  - Every character needs a neck and shoulders: no floating heads.
  - No brown coiled or blob shapes.
  - No scared or gasping organs and no distress bubbles on positive topics: "where's my next breath?" in S1 10-24, sweating lungs in S3 10-18.
  - No grinning mascot next to "heart attack risk".
  - No green check on a warning or counterfeit stat.
  - (Floating heads: S1 10-21, L1 10-22, S2 10-23 twice, L1 10-24 twice. Brown blobs: L1 10-21, S2 10-23.)
- **Long-form: one shot = one scripted beat.** Before render, compare each shot's title and chips with its scripted beat. If a run of shots shows cards from about 230–300 s later, fix the timing table for the whole run. Confirm the disclaimer card appears at its beat. (L1 10-17 and L1 10-20, where the disclaimer card was missing. None from 10-21 to 10-24; keep checking.)

### Scriptwriters
- **Narration is exactly what gets spoken, word for word.**
  - Write ordinals and numbers as words ("first", never "1st"), "versus" (not "vs"), decimals as said ("thirty-one point zero").
  - Spell codes the way they're said and put the literal code in on_screen_text.
  - Read every line aloud for merged words, words a listener could mishear, and leftover draft phrases: "redefinedfor", "aonec", "onest", "were it" for "worried", "worries real on".
  - (About 19 pieces. Holds: S3 10-14 and S3 10-22.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 16 Shorts went over, including S2 10-23 at 183 and S2 10-24.)
- **Every number says, in the narration:**
  - what it measures, with its unit and drug ("15 mg tirzepatide: 31.0% had nausea");
  - the exact arm and comparator ("top trial dose" only when several doses were tested);
  - each group's size;
  - the full timeframe, with the end date spoken;
  - the estimand;
  - an absolute rate next to any relative figure.
  - Give the common side effects for **each** drug named.
  - (About 45 findings, including S1 and S3 10-24.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational = "linked to". FDA says "verify". A presumptive test is not "confirmed". A minimum stays a minimum.
  - Keep every qualifier ("noncirrhotic MASH", every eligibility pathway). Never add "severe" or "from any cause", and don't merge deadlines.
  - Guidance written for clinicians stays clinician guidance: say "ACOG says clinicians should consider stopping…", never a bare "stop 1–2 months before" (S2 10-12, S2 10-13, S2 10-24).
  - A reason the source gives for one drug is never stretched to another (S2 10-24).
  - Keep the label's urgency word for word: "stop using it and call your provider right away", never "stop your dose" and never without "right away" (S3 and L1 10-24).
  - (About 20 findings.)
- **Muted-viewer test: on-screen text is never stronger, broader, more absolute or more reassuring than the narration.**
  - Every stat card names the drug and dose, comparator, population, measure and timeframe.
  - Spoken side-effect lines also appear on screen.
  - A shared lot number is not proof a pen is genuine.
  - (About 27 findings, 1 hold.)
- **The hook and title pay off exactly.** The CTA names only an already-published video, by its exact live title; otherwise say "follow for more". (CTA problems in 7 Shorts, including S3 10-23 and S3 10-24.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label every arm exactly: SURMOUNT-5 semaglutide is the maximum tolerated 1.7 or 2.4 mg, not "2.4 mg (max)".
  - Name the drug next to "top dose".
  - Split any N into its groups, mark adjusted ratios "adjusted", and give every bar its measure.
  - Never leave a placeholder cell (C1 10-20).
  - Add a one-line note when a result looks counterintuitive.
  - Credit and date every filing plan.
  - The title promises no more than the slides deliver, and the last slide carries the disclaimer and the prescriber line.
  - (About 45 findings.)

### Social Copywriter & packaging
- **YouTube description, in this order, ≤1,400 characters after assembly:**
  1. If the voice names a video (a Short's CTA or a long-form's watch-next), that video's real URL. Never "follow for more" and never a placeholder like `VIDEO_ID`. Check the last spoken line before writing line 1.
  2. A quick answer of 3 lines or fewer, with one named side effect and any dated status.
  3. The disclaimer plus the prescriber line.
  4. Up to 4 canonical source URLs.
  5. Chapters named after searched questions (long-forms).
  6. Hashtags, if any, go last. Never put them between the quick answer and the disclaimer.
  - (Line-1 link missing 6 times: S2 10-20, S3 10-21, S3 10-22, S3 10-23, S3 10-24 (major) and L1 10-24. The 20:00 funnel Short missed it 4 days running. Placeholder URL in L1 10-23. Quick answer too long about 20 times. Hashtags out of order 3 times.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 number and 1 abbreviation, and name the exact product, population and status.**
  - Write "Zepbound KwikPen", not "Zepbound Pen" (major, S3 10-23).
  - Write "BMI 27 or higher", not "overweight" (S1 10-24).
  - Say "GLP-1 medicines" when a study covered the class.
  - A filing plan is not approval, and an old approval is not "now".
  - The thumbnail never repeats the title's words.
  - (About 38 findings.)
- **Every caption field ends on the disclaimer plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it, hashtags included.** Threads bodies are about 300 characters with the safety lines counted; cut a clause, never a safety line. (Threads ran over in every GLP-1 batch from 10-13 to 10-24.)
- **Copy facts, qualifiers, measures and attributions word for word from the verified script.**
  - Keep "estimated", "average % of body weight", "all doses combined", "if you qualify", the timeframe and group sizes, and dated statuses with the year and the source's verb.
  - Every comparison or benefit caption names its common side effects.
  - Never write a bare "stop": keep "clinicians should consider…" and "otherwise, don't stop or change your medicines on your own" (S2 and S3 10-24).
  - (About 145 findings, in every GLP-1 batch.)
- **The first line carries the hedge, the scope and the population, before the fold.**
  - TikTok never opens with hashtags.
  - Engagement lines and pinned comments ask people to save or share only. Open questions on gray-market posts invite "where to buy" comments.
  - No emoji on side-effect, safety or gray-market posts.
  - (About 16 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial. **The TRIUMPH OSA trials:** BMI 27 or higher, with 243 people in TRIUMPH-1-OSA (no diabetes) and 448 in TRIUMPH-2-OSA (type 2 diabetes).
  - **SURMOUNT-5 arms:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at its maximum tolerated dose of 1.7 or 2.4 mg. The 7.2 mg dose was not tested.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SUMMIT:** HFpEF (EF ≥ 50%) with obesity. **SURMOUNT-OSA:** moderate-to-severe OSA with obesity. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **The 2.03M surgery cohort:** matched groups, "major" heart complications, and it didn't assess continuing versus withholding the medicine before surgery.
  - Only semaglutide and orforglipron are pills.
  - (About 38 findings.)
- **Credit every line to whoever actually said it, with day, month and year.**
  - Put inside quote marks or "X says" only words the source actually printed (S2 10-24: ACOG never said "not for use during pregnancy").
  - A reporter's description is not the company's statement (S3 10-14).
  - Name the exact body (PRAC, not "EMA"), and never use a month alone.
  - EU steps: "CHMP recommended… Commission decision pending".
  - Every status includes every dated development.
  - (2 attribution holds and 1 status hold.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. (About 85 findings, in nearly every long-form.)
- **Every piece shows and says "Not personal advice" plus the prescriber line, safety and recall Shorts included.**
  - Comparison and coverage posts add "don't switch, stop or change your current medicines on your own".
  - Gray-market posts point to a prescriber about approved options or trials.
  - (About 24 findings.)
- **Keep the source list clean.**
  - Use the final canonical URL of the specific record: no index or landing pages, no DOI or other redirects, no 403 or 404 pages.
  - Check that the article ID in the URL really is the paper you cite (wrong Lancet ID in C1 10-23).
  - Use exact titles with both the online-first and print dates, and list only sources a scene cites.
  - (About 85 findings.)

_Updated 2026-10-24 from 66 QA records (60 GLP-1, 6 plague)._

_Updated 2026-10-24 from 66 QA records._
