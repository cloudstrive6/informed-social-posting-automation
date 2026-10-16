_Based on 59 QA records from 2026-10-05 to 2026-10-16: 11 carousels, 33 Shorts and 15 long-form videos. 30 are GLP-1 (10-05, 10-06, 10-13 to 10-16) and 29 are plague (10-07 to 10-12). 12 were held and 2 failed before render (L3 10-10 and L1 10-12)._

_New on 10-16 (5 GLP-1 pieces): we had **our first audio hold**. S3 was dropped automatically because music and sound effects masked the voice (+0.07 WER), and its subtitles also failed on a merged script word ("achievthree"). The usual visual problems all came back. Every Short had caption cards that stop mid-phrase. S2 and S3 had spelled-out or split numbers, and in S3 two caption cards overlapped and merged into gibberish ("TWVERSUSNT"). S1 still had the empty "–" placeholder chips. L1 had stitched set-ups in 3 shots. All 3 Shorts had Threads bodies over 350 characters, and 3 sources were redirect or 403 URLs._

_Why items were held (in this window):_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14._
- _**3 for scope errors or unsourced claims:** L1 10-06, S3 10-08 and L1 10-12 (failed)._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**Others:** 2 broken YouTube descriptions (L1 10-07, L1 10-09), 1 misspelling (S3 10-14) and **1 voice masked by music (S3 10-16, new)**. The old 90 s holds no longer apply._

### Motion Designer
- **Audio: the voice always wins.** Duck music and sound effects well under the narration. Never place a sound effect under a spoken number or drug name. Check that masking is ≤0.03 before render. (Hold in S3 10-16 at 0.07. S2 10-16 was at 0.05 and S2 10-05 at 0.046.)
- **Every caption card must end where a clause or a full noun phrase ends, and fit in 2 lines or fewer. Only one card is on screen at a time.**
  - Never end a card on a comma, a dash, an article, an auxiliary, a negation, a question word or a bare verb or adjective. Examples: THE, A, BE, NO, NOT, WHO, WHAT, WERE, SAYS, VERIFY, MAJOR, APPROVED. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase across cards: "NOT CONFIRMED", "MAJOR MUSCLE GROUPS", "TOO EARLY TO TELL", "FOR A PHASE 1 TRIAL".
  - Chips follow the same rule.
  - (Fragments in about 29 of 33 Shorts, including every Short on 10-12 and 10-14 to 10-16. A stranded "NOT" flipped the meaning 3 times. Overlapping cards merged into gibberish in S3 10-16 and S3 10-05.)
- **Build caption text from the script's on-screen numerals, not from the spoken transcript. Every number and date must match its stat pill exactly and stay on one card.**
  - Write "17.1%", "~1,700", "49,000" and "Oct 14, 2026", not "SEVENTEEN POINT", "SEVENTEEN HUNDRED" or "TWENTY TWENTY-SIX".
  - (About 15 Shorts had spelled-out numbers and 9 had split numbers, including S2 and S3 10-16. The wrong number showed on screen in 3 Shorts.)
- **Shorts: put tags, name labels and speech bubbles only in the top 60% of the frame (y ≤ 1150 on 1920). Fade each one out before the next caption appears. If a tag can't be cleared in time, cut it.**
  - Repeat offenders: drug-name tags under pill or syringe faces, "Stomach", "Gut", "Fat cell", "Lean mass", "Blood sugar", "FDA", "12 months" and "72 weeks".
  - (About 155 overlap findings across 28 Shorts. S3 10-16 had 7 and S1 10-16 had 5.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** (About 215 tiny-text findings across all 13 rendered long-forms.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Put labels above characters standing on the floor, not under them.
  - Never crop a head, mascot, icon, pill or syringe at the frame edge. This happened in about 10 pieces, including S2 and S3 10-16.
  - Stat titles never sit on faces or busy art (S1 10-16 put its fat-cell headline on the art).
  - (About 110 off-screen findings.)
- **Every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame, from the first frame of the shot.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or a room with props but no character.
  - Every large shape needs a label (L1 10-16 had an unlabelled red cell).
  - **Delete empty placeholder chips (a bare "–") and leftover template UI.** (Seen 4 times: S1 10-06, S2 and S3 10-13, S1 10-16.)
  - (About 95 sparse findings in long-form.)
- **Long-form: one shot = one scripted beat.** Never stitch two set-ups or scenes under one shot label, and never pull in a card from another beat. Compare each shot with its scripted title before render. (Seen in 6 long-forms: L1 10-09, L2 and L4 10-10, L1 10-13, L1 10-15, and 3 shots in L1 10-16.)

### Scriptwriters
- **The narration text must be exactly what is spoken.** Every spoken line, including the hook, goes into the narration field. Use no merged or phonetic words, and spell every drug, company and trial name correctly: semaglutide, tirzepatide, retatrutide, survodutide, orforglipron, Lilly. (Subtitle and narration mismatches in L1, S2 and S3 10-05, L1 10-08 and S3 10-16 ("achievthree"). Misspelling hold in S3 10-14.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 12 Shorts went over, most recently S3 10-16 at ~178 words.)
- **Every number carries all of the following, in the narration and not only on screen:**
  - what it measures ("% of body weight");
  - the arm or dose, and the exact comparator product (Rybelsus 14 mg is not "the semaglutide pill" or Wegovy);
  - group sizes for each group, never a combined N (SURMOUNT-1 body-scan substudy = 124 on tirzepatide vs 36 on placebo);
  - the timeframe;
  - an absolute rate next to any relative figure.
  - (About 18 findings. Group sizes were missing again in L1 and S1 10-16.)
- **Keep every finding at its source's exact scope and verb.**
  - Observational or label language stays "linked to" / "has been associated with".
  - Guideline habits are "recommended".
  - Never state our own assumption as fact ("most people reach for cardio", L1 10-16).
  - Never add a mechanism or "why" the source doesn't give.
  - (3 holds or fails.)
- **On-screen text is never stronger, broader or more reassuring than the narration, and it keeps the population and the hedge.** Not proven ≠ disproven. "Not yet peer-reviewed" ≠ "not peer-reviewed". (7 findings, including 1 hold.)
- **The hook pays off exactly.** If the title promises "3 ways to strength", all 3 beats deliver it, in the order promised (S1 10-16, S1 10-15). Only point to a video in the CTA if it's already published; otherwise say "follow for more" (S1 10-13, S3 10-15).

### Carousel Designer
- **Every stat or cell says what it counts, for whom and against what, and keeps the source's hedge, exact verb and scope.**
  - Date any data year ("2025 KFF data, largest plan").
  - Don't let a definition promise more than the source says: preauthorization ≠ guaranteed coverage (C1 10-16).
  - Keep each label line's scope and every approved use.
  - Only exact printed words go inside quote marks.
  - The last slide carries the disclaimer as well as the prescriber line.
  - (About 26 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - No JSON and no literal "\n". Strict order: a quick answer of 3 lines or fewer, then the disclaimer plus the prescriber line, then up to 4 sources, then chapters. Nothing else goes before the disclaimer.
  - If it runs long, cut chapters first, then the last source.
  - (2 holds. 5 pieces were at the limit, including S3 10-16 at ~1,450. The quick answer ran long in about 7 pieces.)
- **Titles and thumbnails: 100 characters or fewer, at most 1 abbreviation, and the exact population, outcome, arm and comparator.**
  - No clipped forms like "WT" or "72WK".
  - A self-reported symptom is "most-reported", not the product's "top symptom" (S2 10-16).
  - (About 17 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, including hashtags.**
  - Draft Threads bodies to about 320 characters. Cut a clause, never a safety line.
  - (Threads were over 350 characters in about 17 pieces, including all 3 Shorts on 10-16. Hashtags came after the line in S1 10-15 and S2 10-16.)
- **Copy facts, qualifiers and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "increased appetite", "compounded", "reported to the FDA" and the full population.
  - Never add stronger words ("new", "stronger", "never") or outside news claims (Walmart in C1 10-16).
  - (About 95 findings, in every GLP-1 batch.)
- **Put the hedge and the population in the first line of every caption, before the fold.** (About 14 findings, including S1 10-16.)
- **Engagement lines ask people to save or share only.** No emoji on safety, warning or gray-market posts (👀 in C1 and S1 10-14; 💉 in S2 10-16). No hashtags implying an unproven use or a benefit without its population. No #WeightLoss.

### Everyone
- **State the trial population and the exact drug everywhere.**
  - SURMOUNT-1, SURMOUNT-5 and retatrutide Phase 2 = obesity, or overweight with a weight-related condition, without diabetes.
  - SELECT = heart disease plus overweight/obesity, without diabetes.
  - SUMMIT = HFpEF (EF ≥ 50%) with obesity.
  - Tirzepatide for sleep apnea = moderate-to-severe OSA in adults with obesity.
  - A semaglutide or tirzepatide label line is never "GLP-1s" in general. Only semaglutide has tablets.
  - (About 17 findings.)
- **Credit every line to whoever actually said it, and date it.** A reporter's description is not the company's statement. Write "Lilly reported" and name the doses. Date every status: the Wegovy pill was approved Dec 22, 2025; retatrutide is investigational as of Oct 2026; give Medicare coverage as of its date. (6 holds.)
- **Every source tag must actually say the line it's attached to.** Our own tips ("protein at each meal"), analogies and conclusions get no tag. (About 65 findings, including L1 and S1 10-16.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in every field.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently.
  - Add "don't stop or change your current medicines on your own" when relevant.
  - (About 10 findings.)
- **Keep the source list clean.** Use the final, canonical primary URL: no redirect (301/302), node, search, AMP, 403 or 404 pages, and no secondary reposts. Use the exact published title with its date, and give the last-reviewed date on living pages. List only sources a scene actually cites. (About 65 findings, including 3 on 10-16.)
- **Plague (only if an evergreen slot returns):** PCR and antigen results are "presumptive". Use CDC's exact cure line. Keep "contact a doctor or local health authority urgently". Status lines include every dated development (3 status holds).

_Updated 2026-10-16 from 59 QA records (30 GLP-1, 29 plague)._

_Updated 2026-10-16 from 59 QA records._
