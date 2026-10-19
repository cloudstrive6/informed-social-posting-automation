_Based on 69 QA records from 2026-10-06 to 2026-10-19: 13 carousels, 39 Shorts and 17 long-form videos. 40 are GLP-1 (10-06 and 10-13 to 10-19) and 29 are plague (10-07 to 10-12). 12 were held and 2 failed before render (L3 10-10 and L1 10-12)._

_New on 10-19 (5 GLP-1 pieces). **Nothing was held**, but the same problems came back and two got worse:_
- _**Wrong numbers on screen: 2 more Shorts.** S1 captions showed "ZERO PERCENT ON PLACEBO" for 4.0% and "EIGHTEEN / ONE PERCENT" for 18.8% / 5.1%. S3 showed "TWO PERCENT OF THEIR" for 20.2%. That makes **7 wrong on-screen numbers so far**. All 3 Shorts also spelled out years ("TWENTY TWENTY-SIX", "TWENTY SIXTEEN")._
- _**Audio:** S1 masking was **0.034, over the 0.03 limit**, and it still shipped._
- _**Overlaps:** S3 had **28**, mostly drug-name tags under the syringes, sitting behind the caption bar._
- _**Narration and subtitles:** the script wrote "vs" but the voice said "versus" (S3). L1 had "rita trutide" for retatrutide._
- _**Long-form:** L1 had 20 tiny-text and 18 sparse findings. Name tags merged into "SemaglutideTirzepatide", and placeholder "–" shelves showed up again._
- _**Packaging:** Threads ran over again. Head-to-head rates weren't tied to their group. Emoji appeared on side-effect posts. "A plan to file isn't approval" was dropped from 2 fields._

_Why items were held (no new holds since 10-16):_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14._
- _**3 for scope errors or unsourced claims:** L1 10-06 (a dose-arm result applied to the wrong arms), S3 10-08 and L1 10-12 (failed)._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**Others:** 2 broken YouTube descriptions, 1 misspelling and 1 voice masked by music (S3 10-16). The old 90 s holds (S1 10-07, S1 10-08) no longer apply._

### Motion Designer
- **Audio: the voice always wins. Masking must be ≤0.03 before render, with no exceptions.** Duck music and sound effects well under the narration. Never put a sound effect under a spoken number or drug name. If masking is above 0.025, remix before render. (Hold in S3 10-16 at 0.07. S2 10-16 was at 0.05 and S1 10-19 at 0.034, which is over the limit and shipped anyway. S1 10-18 was at 0.028.)
- **Every caption card ends where a clause or a full noun phrase ends. It fits in 2 lines or fewer, and only one card is on screen at a time.**
  - Never end a card on any of these: a comma, a dash or colon, an article, an auxiliary, a negation, a preposition, a question word, a possessive, a bare number, or a bare verb or adjective. Examples: THE, A, AN, BE, CAN, NO, NOT, WEREN'T, WHO, WHAT, ABOUT, PLUS, POINT, PAST, ELECTIVE, LANCET'S, TOP 12, SAYS. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase or trial name across cards. Examples: "NOT CONFIRMED", "OVERWEIGHT PLUS A RELATED CONDITION", "HEAD-TO-HEAD", "ELECTIVE SURGERY", "OBSTRUCTIVE SLEEP APNEA", "REDEFINE 1".
  - Chips follow the same rule.
  - (Fragments in about 37 of 39 Shorts, including every Short from 10-13 to 10-19. A stranded "NOT" or "WEREN'T" flipped the meaning, or risked flipping it, 4 times.)
- **Build caption text from the script's on-screen numerals, never from the spoken transcript.** Every number, dose, year and date must match its stat pill exactly and stay on one card.
  - Write "20.2%", "4.0%", "7.2 mg", "2016", "Q1 2027" and "Dec 2024".
  - Never write "ZERO PERCENT", "SEVEN POINT TWO" or "TWENTY TWENTY-SIX".
  - Before render, search the captions for number words (ZERO–TWENTY, POINT, PERCENT, HUNDRED, THOUSAND, TWENTY TWENTY) and fix every hit.
  - (Spelled-out or split numbers in about 25 Shorts, including all 6 Shorts on 10-18 and 10-19. The wrong number showed on screen 7 times, most recently in S1 and S3 10-19.)
- **Shorts: put tags, name labels and speech bubbles only in the top 60% of the frame (y ≤ 1150 on 1920).** Never put a drug-name tag under a pill or syringe. Fade each tag out before the next caption appears; if it can't be cleared in time, cut it.
  - Repeat offenders: drug-name tags under pill or syringe faces (S3 10-19 had 28 overlaps), "Stomach", "Heart", "Gut", "Lean mass", "Fat cell", "Blood sugar", "Regulators", "FDA" and "Application".
  - (About 195 overlap findings across 33 of 39 Shorts.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** (About 245 tiny-text findings across all 15 rendered long-forms. L1 10-19 had 20.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Name tags go above characters, never under their feet or at the bottom edge. Give each tag its own space so two tags never touch ("SemaglutideTirzepatide" in L1 10-19; runner tags cropped in L1 10-14, 10-17 and 10-18).
  - Never crop a head, mascot, icon, pill or syringe at the frame edge.
  - Stat titles go on plain sky, gradient or a solid card, never on faces, factories, shelves or busy art. (On-hero findings in 5 Shorts; stat on a busy shelf in L1 10-19.)
  - (About 140 off-screen findings.)
- **From its first frame, every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or a room with props but no character.
  - Label every large shape or icon, and spell out jargon chips such as "AHI".
  - **Before render, delete empty "–" placeholder chips, dashed placeholder shelves and stray template UI.** (Seen 7 times, most recently S3 10-18 and L1 10-19.)
  - (About 126 sparse findings in long-form. L1 10-19 had 18.)
- **Long-form: one shot = one scripted beat.** Never stitch two set-ups under one shot label, and never pull in a card from another beat. Before render, check every shot's on-screen title against the scripted beat at that timestamp. (Seen in 7 long-forms, most recently L1 10-17, where shots 6–10 showed cards from about 250 s later.)

### Scriptwriters
- **The narration text must be exactly what is spoken, word for word, written the way it is said.**
  - Write "versus", not "vs", and spell out symbols and units in the narration. The on-screen numerals live in on_screen_text.
  - Use no merged or phonetic words ("redefinedfor", "achievthree").
  - Spell drug, company and trial names correctly, and check that the voice actually says them. Retatrutide came out as "rita trutide" in L1 10-19.
  - Don't let the voice paraphrase ("has been" → "is" in S3 10-18).
  - (Mismatches in 9 pieces, including S3 and L1 10-19. Misspelling hold in S3 10-14.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 13 Shorts went over. S1 10-19 sat at exactly 170.)
- **Every number carries all of the following in the narration, not only on screen:**
  - what it measures;
  - the arm or dose (for example "top tolerated dose") and the exact comparator;
  - the size of each group, never a combined N;
  - the timeframe;
  - an absolute rate next to any relative figure, labelled "relative" (L1 10-19's −82.4%);
  - the source's exact figure, correctly rounded.
  - (About 27 findings.)
- **Keep every finding at its source's exact scope and verb.**
  - Matched or observational analyses: "linked to", never "had". Habits from guidelines: "recommended".
  - Use the label's own words: "tolerated", not "doing well".
  - Never add scope the source doesn't give, such as "from any cause" (S2 10-19) or "real-world", and never narrow it ("gastrointestinal" is not "stomach").
  - Never state our own assumption as fact.
  - (3 holds or fails, plus S2 and S3 10-19.)
- **Muted-viewer test: on-screen text is never stronger, broader or more reassuring than the narration.**
  - Every stat card names the drug and dose, the comparator, the population, the measure and the timeframe, and keeps qualifiers like "alone" and "relative".
  - If there are two estimands, show the treatment-policy figure too. Not proven ≠ disproven.
  - (About 15 findings, including 1 hold. On 10-19: S1 s4 and s5, and L1 s50.)
- **The hook and the title pay off exactly, in the order promised** (S1 10-15, S1 10-16, C1 10-18, C1 10-19). Only point to a video in the CTA if it's already published; otherwise say "follow for more".

### Carousel Designer
- **Every stat or cell says what it counts, for whom, against what and when, and keeps the source's hedge, exact verb and scope.**
  - Split any N into its groups.
  - Use the same population wording on every slide.
  - Give the timepoint for every result (C1 10-19: week 88).
  - Call subgroup comparisons "subgroup averages, not head-to-head".
  - Only the exact printed words go inside quote marks.
  - The title and hook can't promise more than the slides deliver: if only staying on treatment is proven, don't promise "proven helpers".
  - The last slide carries the disclaimer as well as the prescriber line.
  - (About 35 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - No JSON and no literal "\n".
  - Strict order:
    1. A quick answer of **3 lines or fewer** that carries one common side effect, any dated status and the script's status caveat ("a plan to file isn't approval").
    2. The disclaimer plus the prescriber line.
    3. Up to 4 sources.
    4. Chapters.
  - If it runs long, cut chapters first, then the last source.
  - (2 holds. The quick answer ran long in about 13 pieces, including S3 10-19.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 number and 1 abbreviation.** Give the exact population, outcome, arm, comparator and status.
  - Name the drug, not "GLP-1s".
  - Tie every number to its arm, for example "top dose 24.2%" (L1 10-19).
  - In every head-to-head or group comparison, put the drug or group name next to each number, side-effect rates included (S2 10-17, S2 and L1 10-18, S2 10-19).
  - No clipped forms ("72-wk", "HF").
  - A committee recommendation or a filing plan is not "approval". Don't call an old approval "now" or "new".
  - (About 30 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you".**
  - Nothing comes after that line, hashtags included. Hashtags never push the hedge out of the first line.
  - Draft Threads bodies to about 320 characters and count before handing off. Cut a clause, never a safety line.
  - (Threads ran over 350 characters in about 24 pieces, in every batch since 10-13.)
- **Copy facts, qualifiers and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "self-reported", "numerically", "averages, not predictions", "subgroup", the hospital-stay criteria, the full population, and who said it.
  - Never add stronger or causal words, or market or news claims that aren't in the script.
  - (About 115 findings, in every GLP-1 batch.)
- **Put the hedge and the population in the first line of every caption, before the fold.**
  - Engagement lines and pinned comments ask people to save or share only. No open questions.
  - **No emoji anywhere in a post that mentions side effects, safety or gray-market products** (C1 and S3 10-19, S2 10-17, C1 and S1 10-14).
  - No hashtags that imply an unproven use. No #WeightLoss.
  - (About 22 findings.)

### Everyone
- **State the trial population and the exact drug everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1 and retatrutide trials (Phase 2, TRIUMPH):** obesity, or overweight with a weight-related condition, without diabetes (TRIUMPH-2 is the diabetes trial).
  - **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **SUMMIT:** HFpEF (EF ≥ 50%) with obesity.
  - **SURMOUNT-OSA:** moderate-to-severe OSA in adults with obesity.
  - **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease. A subgroup is "people with self-reported past heart failure".
  - Surgery cohorts keep their entry criteria (elective surgery, ≥24 h in hospital).
  - A boxed warning belongs to its own drug. Only semaglutide and orforglipron are pills.
  - (About 26 findings.)
- **Credit every line to whoever actually said it, and date it.**
  - A reporter's description is not the company's statement.
  - Every status names the regulator and the date ("not FDA-approved as of Oct 2026") and is cited to a source dated at or near that date, never to a 2025 trial paper (S3 10-19).
  - EU steps: "CHMP recommended… Commission decision pending".
  - (6 holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. Caveats go to the one outlet that printed them. (About 72 findings, including C1, S2 and S3 10-19.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in every field.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently.
  - Comparison, supplement and coverage posts carry "don't switch, stop or change your current medicines on your own".
  - Gray-market and unapproved-drug posts point to a prescriber about *approved options or trials*, so the prescriber line can't be heard as being about the unapproved drug (S1 10-19).
  - (About 19 findings.)
- **Keep the source list clean.**
  - Use the final, canonical primary URL: no DOI or linkinghub redirect, no node, AMP, 403 or 404 pages, and no reposts. A paywalled page is OK only if another listed source confirms it.
  - Use the exact published title. Label online-first vs print dates, and give the last-reviewed date on living pages.
  - (About 76 findings.)
- **Plague (only if a slot returns):** results are "presumptive". Use CDC's exact cure line, keep "contact a doctor or local health authority urgently", and include every dated development (3 status holds).

_Updated 2026-10-19 from 69 QA records (40 GLP-1, 29 plague)._

_Updated 2026-10-19 from 69 QA records._
