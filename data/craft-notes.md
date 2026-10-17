_Based on 64 QA records from 2026-10-05 to 2026-10-17: 12 carousels, 36 Shorts and 16 long-form videos. 35 are GLP-1 (10-05, 10-06 and 10-13 to 10-17) and 29 are plague (10-07 to 10-12). 12 were held and 2 failed before render (L3 10-10 and L1 10-12)._

_New on 10-17 (5 GLP-1 pieces): **nothing was held, and audio was clean** (masking ≤0.021). The usual caption problems came back in all 3 Shorts: mid-phrase card endings and spelled-out or split numbers. In S1, "0.9%" showed as "NINE PERCENT", which is a wrong number on screen. S2 had the empty "–" placeholder chips for the 5th time. L1 pulled cards from beats about 250 s later into shots 6–10. S3 put its stat title on the hero art in 4 places. In packaging: head-to-head copy didn't say which number belonged to which drug, quick answers ran long, "72-wk" clipped forms appeared, the boxed warning was widened to "GLP-1s" in general, and two engagement lines weren't save/share._

_Why items were held (in this window, unchanged since 10-16):_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14._
- _**3 for scope errors or unsourced claims:** L1 10-06, S3 10-08 and L1 10-12 (failed)._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**Others:** 2 broken YouTube descriptions (L1 10-07, L1 10-09), 1 misspelling (S3 10-14) and 1 voice masked by music (S3 10-16). The old 90 s holds no longer apply._

### Motion Designer
- **Audio: the voice always wins.** Duck music and sound effects well under the narration. Never place a sound effect under a spoken number or drug name. Check that masking is ≤0.03 before render. (Hold in S3 10-16 at 0.07. S2 10-16 was at 0.05 and S2 10-05 at 0.046. Every piece on 10-17 was ≤0.021, so keep doing what you did there.)
- **Every caption card must end where a clause or a full noun phrase ends, and fit in 2 lines or fewer. Only one card is on screen at a time.**
  - Never end a card on a comma, a dash, an article, an auxiliary, a negation, a preposition, a question word or a bare verb or adjective. Examples: THE, A, AN, BE, CAN, NO, NOT, WEREN'T, WHO, WHAT, ABOUT, PLUS, LOST, SAYS, MAJOR, APPROVED. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase across cards: "NOT CONFIRMED", "OVERWEIGHT PLUS A RELATED CONDITION", "MAJOR MUSCLE GROUPS", "TOO EARLY TO TELL", "FOR A PHASE 1 TRIAL".
  - Chips follow the same rule.
  - (Fragments in about 32 of 36 Shorts, including every Short from 10-14 to 10-17. A stranded "NOT" or "WEREN'T" flipped or risked flipping the meaning 4 times. Overlapping cards merged into gibberish in S3 10-16 and S3 10-05.)
- **Build caption text from the script's on-screen numerals, not from the spoken transcript. Every number and date must match its stat pill exactly and stay on one card.**
  - Write "0.9%", "17.1%", "374", "~1,700" and "Oct 14, 2026", not "NINE PERCENT", "THREE HUNDRED…" or "TWENTY TWENTY-SIX".
  - (About 18 Shorts had spelled-out numbers and 11 had split numbers, including S1 and S2 10-17. The wrong number showed on screen in 4 Shorts, most recently "NINE PERCENT" for 0.9% in S1 10-17.)
- **Shorts: put tags, name labels and speech bubbles only in the top 60% of the frame (y ≤ 1150 on 1920). Fade each one out before the next caption appears. If a tag can't be cleared in time, cut it.**
  - Repeat offenders: "Stomach" (in every batch), drug-name tags under pill or syringe faces, "Gut", "Fat cell", "Lean mass", "Blood sugar", "FDA", "Compounded", "12 months" and "72 weeks".
  - (About 165 overlap findings across 31 Shorts. S3 10-17 had 8.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** (About 230 tiny-text findings across all 14 rendered long-forms. L1 10-17 had 13.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Put name tags above characters, never under feet or at the bottom edge.
  - Never crop a head, mascot, icon, pill or syringe at the frame edge.
  - Stat titles go on plain sky or gradient, never on faces, factories or busy art. (On-hero findings in S3 10-05, S2 and S3 10-06, S1 10-16 and 4 times in S3 10-17.)
  - (About 120 off-screen findings.)
- **Every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame, from the first frame of the shot.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or a room with props but no character.
  - Every large shape needs a label.
  - **Delete empty placeholder chips (a bare "–") and leftover template UI before render.** (Seen 5 times: S1 10-06, S2 and S3 10-13, S1 10-16 and S2 10-17.)
  - (About 105 sparse findings in long-form.)
- **Long-form: one shot = one scripted beat.** Never stitch two set-ups under one shot label, and never pull in a card or scene from another beat. Before render, check every shot's on-screen title against the scripted beat at that timestamp. (Seen in 7 long-forms: L1 10-09, L2 and L4 10-10, L1 10-13, L1 10-15, L1 10-16, and L1 10-17, where shots 6–10 showed results cards from about 250 s later.)

### Scriptwriters
- **The narration text must be exactly what is spoken.** Every spoken line, including the hook, goes into the narration field. Use no merged or phonetic words, and spell every drug, company and trial name correctly: semaglutide, tirzepatide, retatrutide, survodutide, orforglipron, Lilly. (Mismatches in L1, S2 and S3 10-05, L1 10-08 and S3 10-16 ("achievthree"). Misspelling hold in S3 10-14.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 12 Shorts went over, most recently S3 10-16.)
- **Every number carries all of the following, in the narration and not only on screen:**
  - what it measures ("% of body weight");
  - the arm or dose, and the exact comparator product (Rybelsus 14 mg is not "the semaglutide pill");
  - group sizes for each group, never a combined N (SURMOUNT-1 body-scan substudy = 124 on tirzepatide vs 36 on placebo);
  - the timeframe;
  - an absolute rate next to any relative figure;
  - the source's exact figure, rounded correctly (28.5% is "about 29%", not 28%).
  - (About 22 findings, including C1, S2 and L1 10-17.)
- **Keep every finding at its source's exact scope and verb.**
  - Observational or label language stays "linked to" / "has been associated with".
  - Guideline habits are "recommended".
  - Never state our own assumption as fact.
  - Never add a mechanism or "why" the source doesn't give.
  - (3 holds or fails.)
- **On-screen text is never stronger, broader or more reassuring than the narration, and it keeps the population, comparator, trial name and hedge.**
  - If the narration gives two estimands, the screen shows the count-everyone (treatment-policy) figure too, not only the on-treatment one (S1 10-17).
  - Not proven ≠ disproven. "Not yet peer-reviewed" ≠ "not peer-reviewed".
  - (9 findings, including 1 hold.)
- **The hook pays off exactly, in the order promised** (S1 10-15, S1 10-16). Only point to a video in the CTA if it's already published; otherwise say "follow for more" (S1 10-13, S3 10-15).

### Carousel Designer
- **Every stat or cell says what it counts, for whom and against what, and keeps the source's hedge, exact verb and scope.**
  - Split any N into its groups ("10 adults: X on prebiotic, Y on placebo", C1 10-17).
  - Date any data year.
  - Don't let a definition promise more than the source says (C1 10-16).
  - Only exact printed words go inside quote marks.
  - The last slide carries the disclaimer as well as the prescriber line.
  - (About 28 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - No JSON and no literal "\n".
  - Strict order: a quick answer of 3 lines or fewer that carries one common side effect and any dated status, then the disclaimer plus the prescriber line, then up to 4 sources, then chapters. Nothing else goes before the disclaimer.
  - If it runs long, cut chapters first, then the last source.
  - (2 holds. The quick answer ran long in about 10 pieces, including L1, S1 and S3 10-17.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 abbreviation, and the exact population, outcome, arm, comparator and status.**
  - Name the drug, not "GLP-1s".
  - In every head-to-head, put the drug name next to each number ("tirzepatide 20.2% vs semaglutide 13.7%"). (L1 10-15, S2 10-17 ×2.)
  - Write "weeks" in full in every field. No clipped forms like "WT", "72WK", "72-wk" or "72 wks" (L1 10-15, S1 10-17).
  - A committee recommendation is not "approval" (S1 10-17). A self-reported symptom is "most-reported" (S2 10-16).
  - (About 22 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, including hashtags.**
  - Draft Threads bodies to about 320 characters. Cut a clause, never a safety line.
  - (Threads were over 350 characters in about 18 pieces, most recently S3 10-17 at ~420. Hashtags came after the line in S1 10-15 and S2 10-16.)
- **Copy facts, qualifiers and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "increased appetite", "compounded", "numerically", "reported to the FDA" and the full population.
  - Never add stronger or causal words ("new", "stronger", "causes", "never") or outside market or news claims.
  - (About 100 findings, in every GLP-1 batch.)
- **Put the hedge and the population in the first line of every caption, before the fold.** (About 15 findings.)
- **Engagement lines and pinned comments ask people to save or share only.** No open questions, and nothing like "weighing their options" (L1 and S2 10-17). No emoji on safety, side-effect, warning or gray-market posts (C1 and S1 10-14, S2 10-16, S2 10-17). No hashtags implying an unproven use or a benefit without its population. No #WeightLoss.

### Everyone
- **State the trial population and the exact drug everywhere.**
  - SURMOUNT-1, SURMOUNT-5, ATTAIN-1 and retatrutide Phase 2 = obesity, or overweight with a weight-related condition, without diabetes.
  - SELECT = heart disease plus overweight/obesity, without diabetes.
  - SUMMIT = HFpEF (EF ≥ 50%) with obesity.
  - Tirzepatide for sleep apnea = moderate-to-severe OSA in adults with obesity.
  - A label line or boxed warning belongs to its own drug, never to "GLP-1s" in general (L1 10-17). Only semaglutide and orforglipron are pills; tirzepatide is injection only.
  - (About 20 findings.)
- **Credit every line to whoever actually said it, and date it.**
  - A reporter's description is not the company's statement. Write "Lilly reported" and name the doses.
  - Date every status, including FDA import alerts (S3 10-17) and EU steps: "CHMP recommended… Commission decision pending".
  - The Wegovy pill was approved Dec 22, 2025. Retatrutide is investigational as of Oct 2026.
  - (6 holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips, analogies and conclusions get no tag. (About 67 findings.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in every field, including descriptions, pinned comments and TikTok.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently.
  - Add "don't stop or change your current medicines on your own" on supplement, comparison and coverage posts.
  - (About 14 findings, including C1 and L1 10-17.)
- **Keep the source list clean.**
  - Use the final, canonical primary URL: no redirect, node, search, AMP, 403 or 404 pages, and no secondary reposts. A paywalled canonical page is acceptable only if another listed source confirms it.
  - Use the exact published title with its date (label online-first vs print dates), and give the last-reviewed date on living pages.
  - List only sources a scene actually cites.
  - (About 70 findings, including L1 and S3 10-17.)
- **Plague (only if an evergreen slot returns):** PCR and antigen results are "presumptive". Use CDC's exact cure line. Keep "contact a doctor or local health authority urgently". Status lines include every dated development (3 status holds).

_Updated 2026-10-17 from 64 QA records (35 GLP-1, 29 plague)._

_Updated 2026-10-17 from 64 QA records._
