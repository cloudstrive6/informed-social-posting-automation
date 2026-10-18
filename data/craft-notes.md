_Based on 69 QA records from 2026-10-05 to 2026-10-18: 13 carousels, 39 Shorts and 17 long-form videos. 40 are GLP-1 (10-05, 10-06 and 10-13 to 10-18) and 29 are plague (10-07 to 10-12). 12 were held and 2 failed before render (L3 10-10 and L1 10-12)._

_New on 10-18 (5 GLP-1 pieces): **nothing was held.** The same problems came back:_
- _**Captions:** all 3 Shorts had mid-phrase card endings and spelled-out or split numbers. S2 showed "FOUR PERCENT" where the figure was 20.4%. That is the **5th wrong number on screen**._
- _**Long-form:** L1 had 23 off-screen findings. Most were name tags under runners' feet, cropped at the bottom edge._
- _**Scripts:** on-screen text in S1, S2 and S3 dropped the population, the measure or the word "alone" that the narration gives. S1 used a combined N._
- _**Audio and transcripts:** S1 masking was 0.028, just under the limit. The L1 narration and the S3 subtitles didn't match the script._
- _**Packaging:** Threads ran over in all 4 short-format pieces. Head-to-head numbers weren't tied to their drug. Hashtags came after the prescriber line again. A comparison post was missing its "don't switch or stop" line._

_Why items were held (unchanged since 10-16):_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14._
- _**3 for scope errors or unsourced claims:** L1 10-06, S3 10-08 and L1 10-12 (failed)._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**Others:** 2 broken YouTube descriptions, 1 misspelling and 1 voice masked by music (S3 10-16). The old 90 s holds no longer apply._

### Motion Designer
- **Audio: the voice always wins.** Duck music and sound effects well under the narration. Never put a sound effect under a spoken number or drug name. Check that masking is ≤0.03 before render. (Hold in S3 10-16 at 0.07. S2 10-16 was at 0.05 and S1 10-18 at 0.028, which is too close to the limit.)
- **Every caption card ends where a clause or a full noun phrase ends. It fits in 2 lines or fewer, and only one card is on screen at a time.**
  - Never end a card on any of these: a comma, a dash or colon, an article, an auxiliary, a negation, a preposition, a question word, or a bare verb or adjective. Examples: THE, A, AN, BE, CAN, NO, NOT, WEREN'T, WHO, WHAT, ABOUT, PLUS, POINT, PAST, COMBINED, EARLY, DESIGNED, SAYS. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase or trial name across cards. Examples: "NOT CONFIRMED", "OVERWEIGHT PLUS A RELATED CONDITION", "OBSTRUCTIVE SLEEP APNEA", "PAST HEART FAILURE", "REDEFINE 1", "TOO EARLY TO TELL".
  - Chips follow the same rule.
  - (Fragments in about 35 of 39 Shorts, including every Short from 10-14 to 10-18. A stranded "NOT" or "WEREN'T" flipped the meaning, or risked flipping it, 4 times.)
- **Build caption text from the script's on-screen numerals, not from the spoken transcript.** Every number and date must match its stat pill exactly and stay on one card.
  - Write "20.4%", "13.5% vs 16.7%", "0.9%", "374" and "Dec 2024".
  - Never write "FOUR PERCENT", "SIXTEEN POINT" or "TWENTY TWENTY-FOUR".
  - Check every caption number against its pill before render.
  - (Spelled-out numbers in about 21 Shorts and split numbers in about 13, including all 3 Shorts on 10-18. The wrong number showed on screen 5 times, most recently "FOUR PERCENT" for 20.4% in S2 10-18.)
- **Shorts: put tags, name labels and speech bubbles only in the top 60% of the frame (y ≤ 1150 on 1920).**
  - Fade each one out before the next caption appears. If a tag can't be cleared in time, cut it.
  - Repeat offenders: "Stomach" (in every batch), drug-name tags under pill or syringe faces, "Application", "Gut", "Fat cell", "Lean mass", "Blood sugar", "FDA" and "Compounded".
  - (About 178 overlap findings across 33 Shorts. S2 10-18 had 8.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** (About 247 tiny-text findings across all 15 rendered long-forms. L1 10-18 had 17.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Name tags go above characters, never under their feet or at the bottom edge. Runner, hunter and drug tags keep getting cropped (L2 10-12, L1 10-14, L1 10-17, and L1 10-18 with 23 off-screen findings).
  - Never crop a head, mascot, icon, pill or syringe at the frame edge.
  - Stat titles go on plain sky or gradient, never on faces, factories or busy art. (On-hero findings in 6 Shorts, including S3 10-17 ×4 and S1 10-18 ×3.)
  - (About 143 off-screen findings.)
- **From its first frame, every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or a room with props but no character.
  - Every large shape or icon needs a label. Spell out jargon chips such as "AHI" (seen with the unlabelled "7" icon in S2 10-18 and "AHI" in S3 10-18).
  - **Before render, delete empty "–" placeholder chips and leftover template UI**, such as stray pause icons. (Seen 6 times, most recently S2 10-17 and S3 10-18.)
  - (About 114 sparse findings in long-form.)
- **Long-form: one shot = one scripted beat.** Never stitch two set-ups under one shot label, and never pull in a card from another beat. Before render, check every shot's on-screen title against the scripted beat at that timestamp. (Seen in 7 long-forms, most recently L1 10-17, where shots 6–10 showed cards from about 250 s later.)

### Scriptwriters
- **The narration text must be exactly what is spoken, word for word.**
  - Use no merged or phonetic words ("redefinedfor" in L1 10-18, "achievthree" in S3 10-16).
  - Don't let the voice paraphrase: S3 10-18 had "has been" in the script but "is" in the voice.
  - Spell drug, company and trial names correctly.
  - (Mismatches in 8 pieces. Misspelling hold in S3 10-14.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 13 Shorts went over, most recently S2 10-18 at 171.)
- **Every number carries all of the following in the narration, not only on screen:**
  - what it measures;
  - the arm or dose (for example "top tolerated dose") and the exact comparator;
  - the size of each group, never a combined N (SURPASS-CVOT subgroup: 1,310 on tirzepatide vs 1,368 on dulaglutide);
  - the timeframe;
  - an absolute rate next to any relative figure;
  - the source's exact figure, correctly rounded.
  - (About 25 findings, including S1 and S3 10-18.)
- **Keep every finding at its source's exact scope and verb.**
  - Observational or label findings: "linked to".
  - Habits from guidelines: "recommended".
  - Never state our own assumption as fact or add a mechanism the source doesn't give.
  - Don't narrow or widen a measure: "gastrointestinal" is not "stomach", and trial data aren't "real-world" (L1 10-18).
  - (3 holds or fails.)
- **Muted-viewer test: on-screen text is never stronger, broader or more reassuring than the narration.**
  - It keeps the population, the measure, the timeframe, the comparator, qualifiers like "alone", and the hedge.
  - If there are two estimands, show the treatment-policy figure too.
  - Not proven ≠ disproven.
  - (12 findings, including 1 hold. On 10-18: S1 s3, S2 s4 and S3 s2.)
- **The hook pays off exactly, in the order promised** (S1 10-15, S1 10-16, C1 10-18). Only point to a video in the CTA if it's already published; otherwise say "follow for more".

### Carousel Designer
- **Every stat or cell says what it counts, for whom and against what, and keeps the source's hedge, exact verb and scope.**
  - Split any N into its groups.
  - Use the same population wording on every slide (C1 10-18: slide 5 dropped the "with a weight-related condition" that slide 3 had).
  - Date any data year.
  - Only the exact printed words go inside quote marks. "FDA has warned companies" is not a warning to the public.
  - The hook can't promise more than the slides deliver.
  - The last slide carries the disclaimer as well as the prescriber line.
  - (About 31 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - No JSON and no literal "\n".
  - Strict order:
    1. A quick answer of **3 lines or fewer** that carries one common side effect and any dated status.
    2. The disclaimer plus the prescriber line.
    3. Up to 4 sources.
    4. Chapters.
  - If it runs long, cut chapters first, then the last source.
  - (2 holds. The quick answer ran long in about 12 pieces, including S1 and S2 10-18.)
- **Titles, thumbnails and captions: 100 characters or fewer and at most 1 abbreviation.** Give the exact population, outcome, arm, comparator and status.
  - Name the drug, not "GLP-1s".
  - In every head-to-head, put the drug name and its dose next to each number ("tirzepatide 20.2% vs semaglutide 13.7%"). This includes side-effect rates. (L1 10-15, S2 10-17 ×2, S2 and L1 10-18.)
  - No clipped forms: write "weeks", not "72-wk", and "heart failure", not "HF".
  - A committee recommendation is not "approval". Don't call an old approval "now" or "new" (S3 10-18).
  - (About 26 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you".**
  - Nothing comes after that line, hashtags included. Hashtags never push the hedge out of the first line.
  - Draft Threads bodies to about 320 characters. Cut a clause, never a safety line.
  - (Threads ran over 350 characters in about 22 pieces, including every piece on 10-18 except L1. Hashtags came last in S1 10-15, S2 10-16 and S3 10-18.)
- **Copy facts, qualifiers and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "self-reported", "increased appetite", "numerically" and "reported to the FDA", the full population, and who said it ("Novo Nordisk expects…").
  - Never add stronger or causal words, or market or news claims that aren't in the script.
  - (About 110 findings, in every GLP-1 batch.)
- **Put the hedge and the population in the first line of every caption, before the fold.** (About 17 findings, including S1 10-18.)
- **Engagement lines and pinned comments ask people to save or share only.**
  - No open questions.
  - No emoji on safety, side-effect or gray-market posts.
  - No hashtags that imply an unproven use. No #WeightLoss.

### Everyone
- **State the trial population and the exact drug everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1 and retatrutide Phase 2:** obesity, or overweight with a weight-related condition, without diabetes.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **SUMMIT:** HFpEF (EF ≥ 50%) with obesity.
  - **SURMOUNT-OSA:** moderate-to-severe OSA in adults with obesity.
  - **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease, not just "heart disease". A subgroup is "people with self-reported past heart failure", not "in heart failure".
  - A boxed warning belongs to its own drug, never to "GLP-1s" in general.
  - Only semaglutide and orforglipron are pills.
  - (About 24 findings.)
- **Credit every line to whoever actually said it, and date it.**
  - A reporter's description is not the company's statement.
  - Every status names the regulator and the date: "not FDA-approved as of Oct 2026" (S2 10-18). Our audience is also in the UK, Canada and Australia.
  - EU steps: "CHMP recommended… Commission decision pending".
  - (6 holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. (About 69 findings, including S1 10-18, where Healio didn't print the figures it was tagged to.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in every field.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently.
  - Comparison, supplement and coverage posts carry "don't switch, stop or change your current medicines on your own".
  - Gray-market posts always point to a prescriber.
  - (About 18 findings, including S2 10-17, and C1 and S1 10-18.)
- **Keep the source list clean.**
  - Use the final, canonical primary URL: no redirect, node, AMP, 403 or 404 pages, and no reposts. A paywalled page is OK only if another listed source confirms it.
  - Use the exact published title. Label online-first vs print dates (S1 10-17, L1 10-18), and give the last-reviewed date on living pages.
  - (About 73 findings.)
- **Plague (only if a slot returns):** results are "presumptive". Use CDC's exact cure line, keep "contact a doctor or local health authority urgently", and include every dated development (3 status holds).

_Updated 2026-10-18 from 69 QA records (40 GLP-1, 29 plague)._

_Updated 2026-10-18 from 69 QA records._
