_Based on 54 QA records from 2026-10-05 to 2026-10-15: 10 carousels, 30 Shorts and 14 long-form videos. 25 are GLP-1 (10-05, 10-06, 10-13, 10-14, 10-15) and 29 are plague (10-07 to 10-12). 11 were held and 2 failed before render (L3 10-10 and L1 10-12). The 10-01 records have left the window. Their examples are gone, and evidence counts are re-based on this window._

_10-15 was all GLP-1: 5 pieces, none held. The same visual problems came back. Every Short had caption cards that stop mid-phrase, S1 had spelled-out and split numbers ("POINT TWO PERCENT") and 9 tag overlaps, and S1 scored only 5.3. In packaging, all 4 videos had Threads bodies over 350 characters, and side-effect lines were missing from L1's description and pinned comment._

_Why items were held (in this window):_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14._
- _**3 for scope errors or unsourced claims:** L1 10-06 (200/400 mg result credited to the 25/75 mg arms), S3 10-08 (one vaccine's result credited to another) and L1 10-12 (failed, "on purpose")._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**Others:** 2 broken YouTube descriptions (L1 10-07, L1 10-09) and 1 misspelling ("c meglutide", S3 10-14). S1 10-07 and S1 10-08 also went over the old 90 s limit. That limit is out of date, so there is no note for it._

### Motion Designer
- **Every caption card must end where a clause or a full noun phrase ends, and fit in 2 lines or fewer.**
  - Never end a card on a comma, a dash, an article, an auxiliary, a negation or a question word. Examples: THE, A, BE, NO, NOT, WHO, WHAT, STILL, PROVE, DOESN'T, YOU'VE, TOO, DR., THEN, or an adjective like APPROVED. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase across cards: "NOT CONFIRMED", "OR LOCAL HEALTH AUTHORITY", "BSL-2", "HAVE A PROTEIN SHAKE", "TOO EARLY TO TELL", "FOR A PHASE 1 TRIAL".
  - Chips follow the same rule. A chip like "Typically" or "or animal" on its own is a fragment.
  - (Fragments in about 26 of 30 Shorts, including every Short on 10-12, 10-14 and 10-15. A stranded "NOT" flipped the meaning in S1 10-08, S1 10-09 and S2 10-09.)
- **Build caption text from the script's on-screen numerals, not from the spoken transcript. Every number must match its stat pill exactly and stay on one card.**
  - Write "15.3%" and "20.2%", not "FIFTEEN POINT" / "POINT TWO PERCENT".
  - Write "~2–3 yrs", "1 in 802", "119" and "Oct 10, 2026", not "AROUND 2", "ONE IN EIGHT", "NINETEEN" or "OCTOBER 2025".
  - (About 12 Shorts had spelled-out numbers and 7 had split numbers, including S1 and S3 10-15. In S3 10-05, S2 10-14 and S3 10-13 the garbled caption showed the wrong number.)
- **Shorts: put tags, name labels and speech bubbles only in the top 60% of the frame (y ≤ 1150 on 1920). Fade each one out before the next caption appears. If a tag can't be cleared in time, cut it.**
  - Repeat offenders: drug-name tags ("Tirzepatide"/"Semaglutide"), "Stomach", "Gut", "Fat cell", "Lean mass", "Muscle", "Lungs", "Antibiotic", "FDA", "Blood sugar", "SNAC", "Weekly shot", "12 months" and "72 weeks".
  - (About 143 overlap findings across 26 Shorts. S2 10-06 had 12, S1 10-13 had 10 and S1 10-15 had 9.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** This includes pill, arm and trial-name tags like "SUMMIT", "Placebo: 2 in…", "GLP-1", "−1 in 6" and "Fat". (About 210 tiny-text findings across all 12 rendered long-forms. L4 10-10 had 42.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Labels under characters standing on the floor are the main risk. Put those labels above the character instead (L1 10-14 "SUMMIT", L2 10-12 "Hunter").
  - Never crop a head, mascot, eye, pill or syringe at the frame edge (S2 10-15, L1 10-15, S1 and S3 10-13, S1 and S3 10-14).
  - Stat titles and source sub-lines sit above or beside faces and bodies, never on them (S3 10-05, S2 and S3 10-06, S2 10-10, S3 10-13).
  - (About 105 off-screen findings.)
- **Every frame needs a headline plus a hero character or scene covering at least ~25% of the frame, from the first frame of the shot.**
  - Never open on, hold on or end on bare stat text, a lone icon, a lone chip or a chips-only frame on a gradient. Don't let the art arrive seconds after the text (L1 10-15).
  - A room set with props but no character doesn't count as a scene (L1 10-14, L1 10-15).
  - Never render empty placeholder chips, cells or seat-backs (a bare "–") or leftover template UI. If an element has no content, delete it (L1, S2 and S3 10-13; S1 10-06).
  - (About 90 sparse findings in long-form.)
- **Long-form: one shot = one scripted beat.** Every headline, stat card and status card renders in its own shot. Never stitch two set-ups into one shot or pull in a card from another beat. Compare each shot with its scripted title before render. (Cards showed about 230–250 s early in L2 and L4 10-10. Leaks or stitched set-ups in L1 10-09, L1 10-10, L1 10-13 and L1 10-15.)

### Scriptwriters
- **Spell every drug, company and trial name correctly, with no phonetic respellings. Subtitles and captions are built from the script.** Check names against this list: semaglutide, tirzepatide, retatrutide, survodutide, amylin, Lilly, Phase 2b. (Hold in S3 10-14 for "c meglutide". Also "RETRATRUDE" in the S1 10-14 caption, and "survodutide" heard as "cervagitide" in L1 10-05.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (8 plague Shorts went over, from S1 10-08 at ~200 words to S2 10-10 at ~235.)
- **Every number carries all of the following:**
  - what it measures ("% of body weight");
  - the arm or dose;
  - the comparator and group sizes, which are labelled per group and never a combined N shown as one group (S2 10-05 had 124 vs 36; S2 10-15 had 173,846 = both groups);
  - the timeframe and the estimand;
  - an absolute rate next to any relative figure (L1 10-14 s46);
  - numbers instead of "many more" (L1 10-06).
  - Never put two units side by side without explaining them (S3 10-13). (About 12 GLP-1 findings.)
- **Keep every finding at its source's exact scope and verb. It never moves to another drug, dose, arm, group or vaccine.**
  - Observational or label language stays "linked to" / "has been associated with", not "can worsen" (S2 10-15).
  - Never add a mechanism, motive or "why" that the source doesn't state.
  - Guideline habits are "recommended", not "shown to protect muscle on tirzepatide" (S2 10-13).
  - (3 holds or fails: L1 10-06, S3 10-08, L1 10-12.)
- **Not proven ≠ disproven ≠ "myth". "Not yet peer-reviewed" ≠ "not peer-reviewed". On-screen text is never stronger, broader or more reassuring than the narration, and it keeps the population and the hedge.** (S1 10-05, S2 and S3 10-06, S1 10-08, S1 10-09 hold, S3 10-09, S3 10-14.)
- **Only point to a video in the CTA if it is already published. Otherwise say "follow for more".** (S1 10-13 and S3 10-15 promised a video that may not exist.)

### Carousel Designer
- **Every stat or cell says what it counts, for whom and against what, and keeps the source's hedge, exact verb and scope.**
  - Give the placebo figure and the CI with the model estimate (C1 10-05).
  - Write "several of 17 clocks" (C1 10-13) and "despite reported fasting" (C1 10-14).
  - Never add a timeframe the source doesn't give.
  - Keep a label line's scope. Wegovy's 2-month window applies to weight or CV use only (C1 10-15).
  - Only exact printed words go inside quote marks (C1 10-12, C1 10-15).
  - If the title promises a source's list, reproduce all of it (C1 10-10).
  - The last slide carries the disclaimer as well as the prescriber line (C1 10-15).
  - (About 20 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - No JSON, no literal "\n" and no cut-off URL. If it runs long, cut chapters first, then the last source.
  - Strict order:
    1. a quick answer of **3 lines or fewer**;
    2. the disclaimer plus the prescriber line;
    3. up to 4 sources (Shorts too);
    4. chapters.
  - Nothing else goes before the disclaimer: no extra paragraph and no hashtag line (L1 10-14, S1 10-15).
  - (2 holds: L1 10-07, L1 10-09. Cut off in L1 10-05. At the limit in L1 and S2 10-14 and L1 10-15. The quick answer ran long in about 6 pieces. No sources in S1 10-10 and S2 10-13.)
- **Titles and thumbnails: 100 characters or fewer, at most 1 abbreviation, and the exact population, outcome, arm and comparator.**
  - Write "in adults with obesity, without diabetes", not just "No Diabetes" (L1 10-15).
  - Write "in HFpEF", not "heart failure" (L1 10-14).
  - Don't use clipped forms like "WT" or "72WK" (L1 10-15 thumbnail).
  - Name the outcome of any number (S1 10-05). Lead with the generic name and put the brand in brackets.
  - A "why" title needs a source that explains why.
  - (About 15 findings.)
- **Every field ends with the disclaimer plus the full, exact line "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, including hashtags and save prompts.**
  - Draft Threads bodies to about 320 characters. Cut a clause, never a safety line.
  - (Threads ran 370–490 characters in about 14 pieces, including S1, S2 and S3 10-15. The prescriber line was cut short in S3 10-15 TikTok. Content came after the line in C1 10-12, L1 10-14 and S1 10-15.)
- **Copy facts, qualifiers and attributions word for word from the verified script.**
  - Keep the full population, "estimated", "medically tailored meals", "not only muscle", the funder, "Lilly reported" and "reported to the FDA".
  - Never swap in stronger words: "regained" never becomes "led to", "better" never becomes "safer", and don't use "stronger" or "new" for a 9-month-old study.
  - Never add "never", "always", "at all", "proven" or "the moment".
  - (About 90 findings, in every GLP-1 batch.)
- **Put the hedge in the first line of every caption, before the fold, with no unhedged absolutes there.** (S3 10-06, C1 10-08, S2 10-09, S1 and S2 10-10; about 12 findings.)
- **Engagement lines ask people to save or share only.**
  - No open questions about dosing, pregnancy, beliefs or experiences (C1 10-15, S2 10-13, plus 4 plague pieces).
  - No emoji in the hook of any safety, side-effect or death-report post (👀 in C1 10-14 and S1 10-14).
  - No hashtags that imply an unproven use or a benefit without its population (#antiaging in C1 10-13; heart/kidney tags in S3 10-14). No #WeightLoss, and no brand-name, agency or #outbreak hashtags.

### Everyone
- **State the trial population and the exact drug everywhere, including titles, pinned comments and Threads.**
  - SURMOUNT-1 and SURMOUNT-5 = obesity, or overweight (BMI 27+) with a weight-related condition, without diabetes.
  - SELECT = adults with heart disease and overweight/obesity, without diabetes.
  - SUMMIT = HFpEF (EF ≥ 50%) with obesity.
  - Tirzepatide for sleep apnea = moderate-to-severe OSA in adults with obesity.
  - A semaglutide or tirzepatide label line is never "GLP-1s" or "GLP-1 medicine" in general (C1 10-15, S3 10-14).
  - Only semaglutide has tablets; tirzepatide is injection only.
  - (About 14 findings, including 4 on 10-15.)
- **Credit every line to whoever actually said it, in their own words, and date it.**
  - A reporter's description is not the company's statement.
  - Credit company figures as "Lilly reported" / "press-release analysis" and name the doses compared (L1 10-15).
  - Carry the funder into every caption.
  - Date every regulatory status ("investigational as of Oct 2026"). The Wegovy pill was approved Dec 22, 2025. CagriSema has been filed, with a decision expected Q4 2026.
  - (6 holds in this window.)
- **Every source tag must actually say the line it's attached to.**
  - Our own advice, analogies and conclusions get no tag. An FDA page that never mentions patches can't back a patch line (S3 10-15).
  - Trial-data cards cite the trial paper, not the news story (S1 10-14).
  - No quote marks around a paraphrase.
  - (About 60 findings.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in the script, the description, the pinned comment and every caption.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently.
  - When the audience already has a condition, add "don't stop or change your current medicines on your own".
  - Decision-style long-forms say these medicines aren't right for everyone.
  - (Major in S1 10-06. Also L1 10-06, S2 10-05, S2 10-14, C1 10-14, and L1 and S2 10-15.)
- **Keep the source list clean.**
  - Use direct, working, canonical primary URLs: no search, landing, AMP, 404 or 403 pages and no secondary blogs.
  - List only sources a scene actually cites.
  - Use the exact published title.
  - Give the "last reviewed" or revision date on living pages and labels.
  - (About 60 findings, including S1 and S3 10-15.)
- **Plague (only if the owner keeps an evergreen slot):**
  - PCR, antigen and F1 results are "presumptive" per CDC's case definition.
  - Use CDC's exact line: "Plague can be cured with antibiotics, but treatment must be given quickly".
  - Keep "contact a doctor or local health authority urgently" plus CDC's 4 pneumonic signs.
  - Any mention of the Irkutsk case includes every dated development up to WHO Oct 10, and never ends on the most reassuring line (3 status holds).

_Updated 2026-10-15 from 54 QA records (25 GLP-1, 29 plague)._

_Updated 2026-10-15 from 54 QA records._
