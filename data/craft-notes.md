_Based on 71 QA records from 2026-10-12 to 2026-10-25: 42 Shorts, 15 long-forms and 14 carousels. 65 are GLP-1 (10-13 to 10-25) and 6 are plague (10-12). 10 were held and 1 failed before render (L1 10-12)._

_New on 10-25 (5 GLP-1 pieces): **1 held**._
- _S1 was dropped for masking at 0.037. That is the 6th masking hold, and the second day running for the 08:00 S1 slot. Its narration ran to about 260 words. S3 shipped at 0.025, which is above the 0.02 target._
- _S2's captions split "493" into "FOUR HUNDRED" / "NINETY-THREE ADULTS", so the screen showed **93**. They also split "TYPE" / "TWO DIABETES". The frame had a floating head and dashed placeholder shelves._
- _L1: the watch-next link in description line 1 and the pinned comment points to a **video ID that doesn't exist (404)**. That is a major finding. The frame showed "Topline: 493" next to a "485" stat card. There were several floating heads, plus 17 off-screen, 21 tiny-text and 14 sparse findings._
- _S3's line 1 said "Follow for more" while the voice named a long-form. That is a **major** finding, the 7th line-1 miss. S3 also had 17 overlap findings._
- _L1 and S3 compared results across different estimands and arms (petrelintide's efficacy figure against SURMOUNT-1's treatment-regimen figure, and "best dose" covering two arms)._

_Why items were held (in this window):_
- _**6 for voice masked by music:** S3 10-16, S2 10-21, S3 10-21, S2 10-22, S1 10-24, S1 10-25._
- _**2 for crediting a claim to a source that didn't say it:** S3 10-14 (CNN), S2 10-24 (ACOG)._
- _**2 for wrong subtitle or script text:** S3 10-14, S3 10-22._
- _**1 for an incomplete status:** S3 10-12._
- _**1 for an unsourced claim:** L1 10-12 (failed)._

### Motion Designer
- **Audio: masking must be 0.02 or lower in the final mix.** Above 0.03 is an automatic drop.
  - All 15 long-forms mixed at 0.002–0.018, so copy the long-form music level and its sparse sound-effect use into the Shorts template.
  - Duck the music under all narration, and keep sound effects off spoken numbers, names and codes.
  - Measure masking as the last step before render. If it's above 0.02, lower the music and measure again. Never ship at "just under 0.03".
  - Every slot has offended: S1 failed on both 10-24 and 10-25.
  - (6 holds, the latest S1 10-25 at 0.037. Shipped above 0.03: 0.05 and 0.034. Shipped at 0.030 once. Shipped above target: 0.029, 0.028, 0.025 twice, 0.023, 0.021 twice.)
- **Every caption card ends where a clause or a full noun phrase ends, fits in 2 lines or fewer, and is the only card on screen.**
  - Never end a card on a comma, dash, colon, ellipsis or open quote mark.
  - Never end on an article, auxiliary, negation, preposition, conjunction, question word, possessive, or a bare number, verb or adjective (A, THE, BE, BEING, CAN, MAY, NOT, HASN'T, OR, WHOSE, ABOUT, IN, PLUS, POINT, TYPE, FDA'S, CLEAR, EASES). If a card ends on one, merge it with the next card.
  - Never split a trial name or fixed phrase ("TYPE 2 DIABETES", "REDEFINE 1", "PHASE 3", "OBSTRUCTIVE SLEEP APNEA").
  - Never leave an alarming phrase alone on a card: "KIDNEY FAILURE." stood alone in S1 10-25.
  - (Fragments in nearly every Short, including all 3 on 10-25. A stranded negation flipped the meaning, or risked flipping it, about 5 times.)
- **Build captions from the script's on-screen text, never from the spoken transcript.**
  - Every number, decimal, date, year and code must match its stat pill exactly and stay on one card ("493", "31.0%", "49.2%", "2026", "Q1 2027", "PAR1229", "BMI", "NSW").
  - Every number in a frame must agree with every other number in it: "Topline: 493" sat next to "485" in L1 10-25.
  - Before render, search the captions for number words (ONE–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, QUARTER OF, FIRST–THIRTIETH) and for spaced or hyphenated single letters, and fix every hit.
  - (In every Short from 10-14 to 10-25. A wrong or garbled number reached the screen about 15 times, including 493 shown as "93" in S2 10-25. 1 hold: S3 10-22.)
- **Shorts: tags, labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet or behind the caption pill.**
  - Fade each tag out before the next caption appears. If it can't be cleared in time, cut it.
  - Never show a tag that repeats the caption's own words ("Prescriber", "Stomach", "Kidney").
  - (About 310 overlap findings, 39 of them on 10-25: S3 had 17, S2 12 and S1 10.)
- **Keep all text at least ~40px on a 1080 frame, with speech bubbles fully opaque, everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920), and nothing on the hero art.**
  - Name tags go above characters. Never crop a head, pill or chip at the edge.
  - Stat titles go on plain sky, a gradient or a solid card.
  - (Bottom-edge tag crops, often "Dana, 47", in 9 of the last 10 long-forms. Tiny text in every long-form: 21 findings in L1 10-25. About 320 tiny-text and 300 off-screen findings in total.)
- **From the first frame, every frame has a headline plus a labelled hero covering at least ~25% of it.**
  - Never open on, hold on or end on bare stats, a lone icon, chips only or an empty room.
  - **Before render, delete every empty "–" placeholder chip, dashed shelf and stray template grid, in Shorts too.**
  - (Placeholders shipped about 15 times. Dashed shelves: L1 10-19, 10-21, 10-23, 10-24 and S2 10-25. Empty chips: S2 10-13, S1 10-16, S2 10-17, S2 10-23. About 125 sparse findings in long-form.)
- **Mascots must read as friendly, whole and on-message.**
  - Human characters (Dana, Jen and the people icons) must use a variant with a neck and shoulders. If the asset renders as a head only, replace it or cut it.
  - No brown coiled or blob shapes. No scared or gasping organs and no distress bubbles on positive topics.
  - No grinning mascot next to "heart attack risk". No green check on a warning or counterfeit stat.
  - (Floating heads in 7 pieces: S1 10-21, L1 10-22, S2 10-23, L1 10-24, L1 10-25 several times, S2 10-25. Brown blobs: L1 10-21, S2 10-23.)
- **Long-form: one shot = one scripted beat.**
  - Before render, compare each shot's title and chips with its scripted beat, and confirm the disclaimer card appears at its beat.
  - (L1 10-17 and L1 10-20 showed cards from about 230–300 s later, and the disclaimer card was missing. None from 10-21 to 10-25; keep checking.)

### Scriptwriters
- **Narration is exactly what gets spoken, word for word.**
  - Write numbers and ordinals as words and "versus" in full.
  - Spell codes and trial names the way they're said ("ZUPREME one"), and put the literal code in on_screen_text.
  - Read every line aloud for merged words and leftover draft phrases: "zupremeone", "redefinedfor", "aonec", "onest", "were it".
  - (About 20 pieces. Holds: S3 10-14 and S3 10-22.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** Long Shorts also get the densest mixes. (About 17 Shorts went over, including S1 10-25 at about 260 words, which was held for masking.)
- **Every number says, in the narration:**
  - what it measures, with its unit and drug;
  - the exact arm and comparator. Say "top trial dose" only when several doses were tested, and never use one "best dose" label for numbers that came from different arms;
  - each group's size, placebo included;
  - the full timeframe;
  - the estimand;
  - an absolute rate next to any relative figure.
  - **When you compare trials, use the same estimand on both sides** (treatment-regimen with treatment-regimen) and say "separate trials, not head-to-head".
  - Give the common side effects for **each** drug named.
  - (About 50 findings. Estimand or arm mixing: L1 10-20, L1 10-25, S3 10-25.)
- **Keep every finding at its source's exact scope, verb and urgency.**
  - Observational = "linked to". FDA says "verify". A minimum stays a minimum.
  - Keep every qualifier. Never add "severe" or "from any cause".
  - Guidance written for clinicians stays clinician guidance: "ACOG says clinicians should consider…".
  - A reason the source gives for one drug is never stretched to another.
  - Keep the label's urgency word for word: "stop using it and call your provider right away".
  - Use a source's placebo-adjusted figure as "versus placebo", never as "rose on the drug".
  - (About 22 findings.)
- **Muted-viewer test: on-screen text is never stronger, broader, more absolute or more reassuring than the narration.**
  - Every stat card names the drug and dose, comparator, population, measure and timeframe.
  - Spoken side-effect lines also appear on screen.
  - (About 29 findings, 1 hold.)
- **The hook and title pay off exactly.** The CTA names only an already-published video, by its exact live title copied from YouTube, not from the playbook's example titles; otherwise say "follow for more". (CTA problems in 9 pieces, including S3 10-24 and L1 10-25.)

### Carousel Designer
- **Every stat, bar or cell says what it counts, for whom, against what and when.**
  - Label every arm exactly, and name the drug next to "top dose".
  - Split any N into its groups, and mark adjusted ratios "adjusted".
  - Never leave a placeholder cell.
  - Label myth slides "MYTH" so the myth never reads as our claim (C1 10-25).
  - Add a note when a result looks counterintuitive, and credit and date every filing plan.
  - Every headline promises no more than its slide delivers: "what to do" needs actual tips (C1 10-19, C1 10-25).
  - The last slide carries the disclaimer and the prescriber line.
  - (About 48 findings.)

### Social Copywriter & packaging
- **YouTube description, in this order, ≤1,400 characters after assembly:**
  1. If the voice names a video, that video's real URL. Check the last spoken line first. **Confirm the URL resolves to that exact live video** (open it, or check oEmbed) before shipping. Never use "follow for more", a placeholder like `VIDEO_ID`, or a guessed ID. The same goes for the pinned comment.
  2. A quick answer of 3 lines or fewer, with one named side effect and any dated status.
  3. The disclaimer plus the prescriber line.
  4. Up to 4 canonical source URLs.
  5. Chapters (long-forms).
  6. Hashtags, last.
  - (Line 1 missing 7 times: S2 10-20, S3 10-21, S3 10-22, S3 10-23, S3 10-24, L1 10-24, S3 10-25. The last two S3 misses were major. A placeholder in L1 10-23 and a 404 ID in L1 10-25 (major). The 20:00 funnel Short has missed it 5 days running. Quick answer too long about 22 times. L1 10-25 ran to 1,450 characters.)
- **Titles, thumbnails, captions and hashtags: 100 characters or fewer, at most 1 number and 1 abbreviation, and name the exact product, population and status.**
  - Write "Zepbound KwikPen" and "BMI 27 or higher", and say "GLP-1 medicines" when the study covered the class.
  - A filing plan is not approval, and an old approval is not "now". The thumbnail never repeats the title's words.
  - **Hashtag only drugs and brands that were actually tested in that population.** No #Tirzepatide on a petrelintide post, no #Mounjaro on a no-diabetes trial or a compounded recall, and no company hashtags.
  - (About 40 findings. Hashtag scope problems: C1 10-13, S1 10-20, S2 10-23, C1 10-25, S3 10-25.)
- **Every caption field ends on the disclaimer plus "talk to your doctor or prescriber about whether it's right for you", with nothing after it.** Threads bodies are about 300 characters with the safety lines counted. Cut a clause, never a safety line. (Threads ran over in every GLP-1 batch from 10-13 to 10-25.)
- **Copy facts, qualifiers, measures and attributions word for word from the verified script.**
  - Keep "estimated", "average % of body weight", "all doses combined", "if you qualify", the timeframe, group sizes, dated statuses, "significantly", and any less reassuring result the script gives (S2 10-25: lower spine density).
  - Never write a bare "stop".
  - Every comparison or benefit caption names its common side effects.
  - (About 150 findings, in every GLP-1 batch.)
- **The first line carries the hedge, the scope and the population, before the fold.**
  - TikTok never opens with hashtags.
  - Engagement lines and pinned comments ask people to save or share only. Open questions keep appearing on investigational and gray-market posts (S3 10-25 twice, S1 10-23, S1 10-20).
  - No emoji on side-effect, safety or gray-market posts.
  - (About 20 times.)

### Everyone
- **State the trial population and the exact drug and arm everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1, retatrutide Phase 2 and TRIUMPH:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial.
  - **The TRIUMPH OSA trials:** BMI 27 or higher, with 243 people in TRIUMPH-1-OSA (no diabetes) and 448 in TRIUMPH-2-OSA (type 2 diabetes).
  - **SURMOUNT-5 arms:** tirzepatide at its maximum tolerated dose of 10 or 15 mg versus semaglutide at its maximum tolerated dose of 1.7 or 2.4 mg. The 7.2 mg dose was not tested.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes. **SUMMIT:** HFpEF (EF ≥ 50%) with obesity. **SURMOUNT-OSA:** moderate-to-severe OSA with obesity. **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease.
  - **Petrelintide ZUPREME-1:** 485 randomized adults. Never show the 493 topline count next to it.
  - Only semaglutide and orforglipron are pills.
  - (About 40 findings.)
- **Credit every line to whoever actually said it, with day, month and year.**
  - Put inside quote marks or "X says" only words the source actually printed. A reporter's description is not the company's statement.
  - Credit a single company's release to that company, not to its partner too (L1 10-25).
  - Name the exact body (PRAC, not "EMA"). EU steps: "CHMP recommended… Commission decision pending".
  - (2 attribution holds and 1 status hold.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. (About 85 findings, in nearly every long-form.)
- **Every piece shows and says "Not personal advice" plus the prescriber line.**
  - Comparison posts add "don't switch, stop or change your current medicines on your own".
  - Gray-market and investigational posts point to a prescriber about approved options or trials.
  - (About 24 findings.)
- **Keep the source list clean.**
  - Use the final canonical URL of the specific record: no landing pages, redirects, 403 or 404 pages.
  - Check that the article ID in the URL really is the paper you cite.
  - Use exact titles with both the online-first and print dates.
  - (About 88 findings.)

_Updated 2026-10-25 from 71 QA records (65 GLP-1, 6 plague)._

_Updated 2026-10-25 from 71 QA records._
