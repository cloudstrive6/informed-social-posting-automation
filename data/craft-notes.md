_Based on 70 QA records from 2026-10-13 to 2026-10-26: 42 Shorts, 14 long-forms and 14 carousels, all GLP-1. 10 were held. The 10-12 plague records have aged out, so their two holds no longer count._

_New on 10-26 (5 pieces): **1 held**._
- _**S3 was held for a new reason.** Its last spoken line sent viewers to "What Is Elecoglipron? The New GLP-1 Pill Explained", and nobody could confirm that video was live. Line 1 already used the "follow for more" fallback, so the voice promised a link we couldn't give, and the narration has to be re-recorded. S3 also had ghost text from earlier cards showing through new captions 4 times, and 15 overlap findings._
- _**L1 (elecoglipron):**_
  - _It named another video out loud with no URL on line 1. That is a major finding and the 8th line-1 miss._
  - _It shipped placeholder chapters and a truncated hashtag._
  - _The narrator mispronounced the drug name ("elicoglyprone")._
  - _It mixed up the VISTA (Phase 2) and SOLSTICE (Phase 2b) trials._
  - _Visuals: Marcus was a floating head, the dashed placeholder shelves were back, and there were 30 tiny-text findings, our highest count yet._
- _**S2** shipped at masking 0.025, above the 0.02 target. It had 19 overlap findings and a stale "SIX HUNDRED FORTY-THREE" caption._
- _**S1** shipped at masking 0.017. Its on-screen stats didn't name either group._

_Why items were held (in this window):_
- _**6 for voice masked by music:** S3 10-16, S2 10-21, S3 10-21, S2 10-22, S1 10-24, S1 10-25._
- _**2 for crediting a claim to a source that didn't say it:** S3 10-14 (CNN), S2 10-24 (ACOG)._
- _**2 for wrong subtitle or script text:** S3 10-14, S3 10-22._
- _**1 for a spoken CTA naming a video that couldn't be confirmed live:** S3 10-26 (new)._

### Motion Designer
- **Audio: masking must be 0.02 or lower in the final mix.** Above 0.03 is an automatic drop.
  - All 14 long-forms mixed at 0.003–0.018, so copy the long-form music level and its sparse sound-effect use into the Shorts template.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - Measure masking as the last step before render. If it's above 0.02, lower the music and measure again. Never ship at "just under 0.03".
  - (6 holds, the latest S1 10-25 at 0.037. Shipped above 0.03: 0.05 and 0.034. Shipped at 0.030 once. Shipped above target: 0.029, 0.028, 0.025 three times (most recently S2 10-26), 0.023, 0.021 twice.)
- **Every caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only text on screen. Clear the previous card and its tags completely before the next one appears.**
  - Never end a card on a comma, dash, colon, ellipsis or open quote mark.
  - Never end on an article, auxiliary, negation, preposition, conjunction, question word, possessive, or a bare number, verb or adjective (A, THE, BE, BEING, CAN, MAY, NOT, HASN'T, OR, WHOSE, ABOUT, IN, PLUS, POINT, TYPE, YOUR, FDA'S, CLEAR, EASES). If a card ends on one, merge it with the next card.
  - Never split a trial name or fixed phrase ("TYPE 2 DIABETES", "REDEFINE 1", "PHASE 3", "OBSTRUCTIVE SLEEP APNEA").
  - Never leave an alarming phrase alone on a card ("KIDNEY FAILURE." in S1 10-25).
  - (Fragments in every Short, including all 3 on 10-26. A stranded negation flipped the meaning, or risked flipping it, about 6 times. Ghost text from earlier cards showed through 4 times in S3 10-26, and a stale caption lingered in S2 10-26.)
- **Build captions from the script's on-screen text, never from the spoken transcript.**
  - Every number, decimal, date, year and code must match its stat pill exactly and stay on one card ("493", "31.0%", "1.0%", "2026", "Q1 2027", "PAR1229", "BMI").
  - Every number in a frame must agree with every other number in it ("Topline: 493" sat next to "485" in L1 10-25, and "2 trials" next to "THREE TRIALS" in S1 10-24).
  - Before render, search the captions for number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, QUARTER OF, FIRST–THIRTIETH) and for spaced or hyphenated single letters, and fix every hit.
  - (Found in every Short from 10-13 to 10-26. A wrong or garbled number reached the screen about 16 times, including 493 shown as "93". 1 hold: S3 10-22.)
- **Shorts: tags, labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet or behind the caption pill.**
  - Fade each tag out before the next caption appears. If it can't be cleared in time, cut it.
  - Never show a tag that repeats the caption's own words ("Prescriber", "Stomach", "Tirzepatide").
  - (About 350 overlap findings, 39 of them on 10-26: S2 had 19, S3 15 and S1 5. "Prescriber" sat behind "OR PRESCRIBER ABOUT" in S3 10-21, S3 10-25 and S3 10-26.)
- **Keep all text at least ~40px on a 1080 frame, with speech bubbles fully opaque, everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920), and nothing on the hero art.**
  - Name tags go above characters. Never crop a head, pill or chip at the edge.
  - Stat titles go on plain sky, a gradient or a solid card.
  - (Molecule and organ labels such as "Amylin", "Gallstones" and "Glucagon" keep rendering at 22–26px. There were 30 tiny-text findings in L1 10-26, the highest so far. Bottom-edge tag crops ("Dana, 47", "Marcus", "220 lb") appear in nearly every long-form. In total there were about 350 tiny-text findings and 320 off-screen findings.)
- **From the first frame, every frame has a headline plus a labelled hero covering at least ~25% of it.**
  - Never open on, hold on or end on bare stats, a lone icon, chips only or an empty room.
  - **Before render, delete every empty "–" placeholder chip, dashed shelf and stray template grid, in Shorts too.**
  - (Placeholders shipped about 16 times. Dashed shelves: L1 10-19, 10-21, 10-23, 10-24, 10-26 and S2 10-25. Empty chips: S2 10-13, S1 10-16, S2 10-17, S2 10-23. About 140 sparse findings in long-form.)
- **Mascots must read as friendly, whole and on-message.**
  - Human characters (Dana, Jen, Marcus and the people icons) must use a variant with a neck and shoulders. If the asset renders as a head only, replace it or cut it.
  - No brown coiled or blob shapes. No scared or gasping organs and no distress bubbles on positive topics.
  - No grinning mascot next to "heart attack risk". No green check on a warning or counterfeit stat.
  - (Floating heads in 8 pieces, the latest L1 10-26 (Marcus). Brown blobs: L1 10-21, S2 10-23.)
- **Long-form: one shot = one scripted beat.**
  - Before render, compare each shot's title and chips with its scripted beat, and confirm the disclaimer card appears at its beat.
  - (L1 10-17 and L1 10-20 showed cards from about 230–300 s later, and the disclaimer card was missing. None since 10-21; keep checking. L1 10-26 reused an earlier scene as a later beat.)

### Scriptwriters
- **Write a CTA that names a video only when that video's URL has already been confirmed live (oEmbed) at script time, and copy the title exactly from YouTube.**
  - Never use the playbook's example titles or a planned title.
  - If you can't confirm it, the last line is "follow for more". A spoken promise we can't link means the narration has to be re-recorded.
  - (1 hold: S3 10-26. CTA problems in 11 pieces, including L1 10-25 and L1 10-26.)
- **Narration is exactly what gets spoken, word for word.**
  - Write numbers and ordinals as words and "versus" in full.
  - Spell codes and trial names the way they're said ("ZUPREME one"), and put the literal code in on_screen_text.
  - **For any new drug name, give the voice a phonetic respelling** and check it in the narration WER. The voice has mangled "elicoglyprone" (L1 10-26), "rita trutide" (L1 10-19) and "wegovi" (L1 10-23).
  - Read every line aloud for merged words and leftover draft phrases ("zupremeone", "redefinedfor", "aonec", "onest", "were it").
  - (About 22 pieces. Holds: S3 10-14 and S3 10-22.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** Long Shorts also get the densest mixes. (About 17 Shorts went over, including S1 10-25 at about 260 words, which was held for masking.)
- **Every number says, in the narration:**
  - what it measures, with its unit and drug;
  - the exact arm, named the way the source names it ("75 mg with weekly titration"), and the comparator. Never use one "best dose" label for numbers from different arms;
  - each group's size, placebo included;
  - the full timeframe;
  - the estimand;
  - an absolute rate next to any relative figure.
  - **When you compare trials, use the same estimand on both sides** and say "separate trials, not head-to-head". Never mix up two trials of the same drug (VISTA vs SOLSTICE in L1 10-26).
  - Give the common side effects for **each** drug named.
  - (About 55 findings. Estimand, arm or trial mixing: L1 10-20, L1 10-25, S3 10-25, L1 10-26.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational = "linked to". FDA says "verify". A minimum stays a minimum, and "may include" stays incomplete.
  - Keep every qualifier. Never add "severe" or "from any cause".
  - Guidance written for clinicians stays clinician guidance: "ACOG says clinicians should consider…".
  - A reason the source gives for one drug is never stretched to another.
  - Keep the label's urgency word for word: "stop using it and call your provider right away".
  - Use a source's placebo-adjusted figure as "versus placebo", never as "rose on the drug".
  - (About 24 findings, 1 hold.)
- **Muted-viewer test: on-screen text is never stronger, broader, more absolute or more reassuring than the narration.**
  - Every stat card names the drug and dose, both groups, population, measure and timeframe.
  - Spoken side-effect lines also appear on screen.
  - (About 32 findings, including 3 in S1 10-26.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label every arm exactly, and name the drug next to "top dose".
  - Split any N into its groups (124/36), and mark adjusted ratios "adjusted".
  - Never leave a placeholder cell.
  - Label myth slides "MYTH" so the myth never reads as our claim.
  - Add a note when a result looks counterintuitive, and credit and date every filing plan.
  - Never call side effects "the most common" unless the source ranks them.
  - Every headline promises no more than its slide delivers: "what to do" needs actual tips (C1 10-19, C1 10-25).
  - The last slide carries the disclaimer and the prescriber line.
  - (About 52 findings.)

### Social Copywriter & packaging
- **YouTube description, in this order, ≤1,400 characters after assembly:**
  1. If the voice names a video, that video's real URL. Check the last spoken line first. **Confirm the URL resolves to that exact live video** (open it, or check oEmbed). Never use "follow for more", a placeholder like `VIDEO_ID`, or a guessed ID. If the video can't be confirmed, send the piece back to the Scriptwriter; don't ship it. The same goes for the pinned comment.
  2. A quick answer of 3 lines or fewer, with one named side effect and any dated status.
  3. The disclaimer plus the prescriber line.
  4. Up to 4 canonical source URLs.
  5. Real chapters with timestamps (long-forms). Never placeholders.
  6. Hashtags, last and complete.
  - (Line 1 was missing 9 times, most recently S3 10-25, L1 10-26 and S3 10-26, all major. The 20:00 funnel Short has missed it 6 days running. There was a placeholder in L1 10-23, a 404 ID in L1 10-25, and placeholder chapters plus a cut-off hashtag in L1 10-26. The quick answer ran too long about 24 times.)
- **Titles, thumbnails, captions and hashtags: 100 characters or fewer, at most 1 number and 1 abbreviation, and name the exact product, population and status.**
  - Write "Zepbound KwikPen" and "BMI 27 or higher", and say "GLP-1 medicines" when the study covered the class.
  - A filing plan is not approval, and an old approval is not "now". The thumbnail never repeats the title's words, and it names the drug and arm next to any number.
  - **Hashtag only drugs and brands that the post's own text reports tested data for.** No #Tirzepatide on a petrelintide post or on a semaglutide-only caption, no #Mounjaro on a no-diabetes trial or a compounded recall, and no company hashtags.
  - (About 42 findings. Hashtag scope problems in 6 pieces, the latest C1 10-26.)
- **Every caption field ends on the disclaimer plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.** That includes hashtags and extra safety lines; put those before it.
  - Threads bodies are about 300 characters with the safety lines counted. Cut a clause, never a safety line.
  - (Threads ran over in every batch from 10-13 to 10-26.)
- **Copy facts, qualifiers, measures and attributions word for word from the verified script.**
  - Keep "estimated", "average % of body weight", "all doses combined", "if you qualify", "can include", the timeframe, group sizes, dated statuses, "significantly", and any less reassuring result the script gives.
  - Caption numbers match their stat pill ("1.0%", not "1%").
  - Never write a bare "stop".
  - Every comparison or benefit caption names its common side effects (TikTok included).
  - (About 160 findings, in every batch.)
- **The first line carries the hedge, the scope and the population, before the fold.**
  - TikTok never opens with hashtags.
  - Engagement lines and pinned comments ask people to save or share only. Open questions keep appearing on investigational and gray-market posts.
  - No emoji on side-effect, safety or gray-market posts.
  - (About 22 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial.
  - **The TRIUMPH OSA trials:** BMI 27 or higher, with 243 people in TRIUMPH-1-OSA (no diabetes) and 448 in TRIUMPH-2-OSA (type 2 diabetes).
  - **SURMOUNT-5 arms:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at its maximum tolerated dose of 1.7 or 2.4 mg. The 7.2 mg dose was not tested.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SUMMIT:** HFpEF (EF ≥ 50%) with obesity. **SURMOUNT-OSA:** moderate-to-severe OSA with obesity. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Petrelintide ZUPREME-1:** 485 randomized adults. Never show the 493 topline count next to it.
  - **Elecoglipron:** VISTA is Phase 2; SOLSTICE is the separate Phase 2b. The food study was a single 50 mg dose in 14 volunteers.
  - Only semaglutide and orforglipron are approved pills. Elecoglipron is investigational.
  - (About 42 findings.)
- **Credit every line to whoever actually said it, with day, month and year.**
  - Put inside quote marks or "X says" only words the source actually printed. A reporter's description is not the company's statement.
  - Credit a single company's release to that company, not to its partner too.
  - Name the exact body (PRAC, not "EMA"). EU steps: "CHMP recommended… Commission decision pending".
  - (2 attribution holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. (About 85 findings, in nearly every long-form.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.**
  - Comparison posts add "don't switch, stop or change your current medicines on your own".
  - Gray-market and investigational posts point to a prescriber about approved options or trials.
  - (About 24 findings.)
- **Keep the source list clean.**
  - Use the final canonical URL of the specific record: no landing pages, redirects, 403 or 404 pages.
  - Cite the primary paper when it exists, not only news coverage.
  - Check that the article ID in the URL really is the paper you cite.
  - Use exact titles with both the online-first and print dates.
  - (About 90 findings.)

_Updated 2026-10-26 from 70 QA records (all GLP-1, 10-13 to 10-26)._

_Updated 2026-10-26 from 70 QA records._
