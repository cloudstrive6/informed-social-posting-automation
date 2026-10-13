_Based on 56 QA records from 2026-09-30 to 2026-10-13: 12 carousels, 30 Shorts and 14 long-form videos. 13 were held and 2 failed before render (L3 10-10 and L1 10-12). 29 records are plague (10-07 to 10-12) and 27 are GLP-1 (09-30 to 10-06, plus 10-13). **The focus is back on GLP-1.** All 5 pieces on 10-13 passed, with visual scores of 6.2–7.4. Their repeat problems: captions that stop mid-phrase or split a number, leftover tags overlapping captions, empty placeholder chips, dropped population qualifiers and Threads posts that run long._

_Why items were held (in this window):_
- _**5 for crediting a claim to the wrong body, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10 and L3 10-10 (failed)._
- _**4 for scope errors or unsourced claims:**_
  - _S2 10-01 said "all" participants had T2D or obesity._
  - _L1 10-06 credited the 200/400 mg result to the 25/75 mg arms._
  - _S3 10-08 credited one vaccine's result to another._
  - _L1 10-12 failed for "weakened on purpose", which MMWR never says._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**Also:** 2 broken YouTube descriptions (L1 10-07, L1 10-09), 1 for phonetic spellings in subtitles (S1 10-01) and 1 for a causal title (S2 09-30, semaglutide "Cuts Asthma Attacks")._
- _S1 10-07 was held under the old 90 s limit and would pass today, so there is no note for it._
- _The plague-only rules are now folded into one bullet under Everyone. Use it only if the owner keeps a plague lane._

### Motion Designer
- **Every caption is a complete phrase of 2 lines or fewer.**
  - Never end a caption on THE, A, BE, NO, NOT, ABOUT, PEOPLE, a comma or a dash.
  - Never break a fixed phrase across screens: "NOT CONFIRMED", "OR LOCAL HEALTH AUTHORITY", "BSL-2", "HAVE A PROTEIN SHAKE".
  - Chips are never fragments either ("Typically" / "or animal").
  - (Found in about 20 Shorts, including every Short on 10-10, 10-12 and 10-13. S2 and S3 10-13 ended captions on "THE", "ABOUT", "PEOPLE" and "THEN,". Dropped or stranded negations contributed to the S1 10-09 hold.)
- **Caption numbers are numerals that match the stat pill exactly, and one number never splits across two caption cards.**
  - Write "33.9%", not "THIRTY-THREE" / "POINT NINE PERCENT".
  - Write "1 in 802", not "ONE IN EIGHT".
  - Write "119 hospitals", not "AND NINETEEN".
  - Write "Oct 10, 2026", not "OCTOBER TENTH".
  - If the caption source spells a number out, convert it before rendering.
  - (Spelled-out numbers in 11 Shorts and split numbers in 5, including S2 and S3 10-13. In S3 10-05 the mistake changed the stat itself.)
- **Shorts: put tags only in the top 60% of the frame (y ≤ 1150 on 1920). Fade each tag out before the next caption appears; if it can't be cleared in time, leave it out.**
  - The GLP-1 repeat offenders are "Stomach", "Stomach lining", "Gut", "Fat cell", "Lean mass", "Muscle", "GLP-1 pen", "SNAC", "Weekly shot", "72 weeks" and drug-name labels (Semaglutide, Tirzepatide, Survodutide).
  - (About 160 overlap findings across 26 Shorts. S1 10-13 had 10 and S2 10-13 had 7.)
- **Put stat titles and source sub-lines above or beside the hero art, never on faces, heads or bodies.** (On-hero findings in S3 10-05, S2 and S3 10-06, S2 10-10 and S3 10-13.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** This applies to Shorts and long-form, including pill tags like "80 weeks", "Placebo: 2 in…" and "GLP-1". (About 220 tiny-text findings across all 12 long-forms. L4 10-10 alone had 42.)
- **Keep everything inside the safe frame: y ≤ 994 on 1080 and y ≤ 1766 on 1920, with 5% margins.**
  - Labels under characters standing on the floor are the main risk. Lift the character or put the label above it.
  - Never crop a head, mascot, pill or icon at the frame edge (S3 10-13, S1 10-13, S3 10-12, S3 10-10).
  - (About 110 off-screen findings.)
- **Every frame needs a headline plus hero art or a scene covering at least ~25% of the frame.**
  - Never open on, hold or end on a lone icon or a chips-only frame on a plain gradient.
  - Never render empty placeholder chips, cells or seat-backs (a bare "–"). If there's no content, delete the element.
  - (About 80 sparse findings in long-form. Placeholders in S1 10-06, L1 10-13, S2 10-13 and S3 10-13.)
- **Long-form: every scripted headline, stat card and status card renders in its own shot, and nothing from another shot appears in it.**
  - Never stitch two unrelated beats into one shot, as L1 10-13 did when it jump-cut to a park "Not head-to-head" card.
  - Compare each shot with its scripted title before render.
  - (L2 10-10 and L4 10-10 showed cards about 230–250 s early. L1 10-09, L1 10-10 and L1 10-13 had leaks or mismatches.)

### Scriptwriters
- **Shorts: 170 words or fewer, including the status line and the prescriber line. Cut a beat rather than run long.** (7 plague Shorts went over: S2 10-10 had ~235 words and S3 10-12 ~228.)
- **Spell drug, company and trial names normally: Lilly, amylin, survodutide, Phase 2b, septicemic. Never use phonetic respellings, because captions are built from the script.** (1 hold, S1 10-01, for "amilin" and "Lily's Allura TZP". Mispronunciations were caught in L1 10-01 and L1 10-05.)
- **Every number carries all of the following:**
  - what it measures ("% of body weight", not just "13.6%");
  - which arm or dose ("top dose, 12 mg");
  - the comparator ("vs 2.4% on placebo"), including placebo dropout rates;
  - the timeframe ("72 weeks");
  - the estimand ("if everyone stayed on treatment" vs everyone randomized);
  - an absolute rate next to any relative figure ("HR 0.43 = 1.4% vs 3.2%").
  - Never put two units side by side unexplained: S3 10-13 had "two-thirds of lost weight" next to "10.75% of body weight".
  - Label group averages and substudy size ("160-person body-scan substudy").
  - (About 15 GLP-1 findings, including a major in S3 10-01.)
- **Keep every finding at its source's exact scope and verb. It never moves to another drug, dose, arm, group or vaccine.**
  - Controls' conditions aren't the users' conditions (S2 10-01).
  - Interim 200/400 mg results aren't the 25/75 mg arms (L1 10-06).
  - Observational data is "linked to", never "cuts" or "causes".
  - Never add a mechanism, motive or "why" the source doesn't state ("on purpose", L1 10-12).
  - Habits from guidelines are "recommended", not "shown to protect muscle on tirzepatide" (S2 10-13).
  - (4 holds or fails.)
- **Not proven ≠ disproven ≠ "myth". On-screen text is never stronger, narrower or more reassuring than the narration, and keeps the population and the hedge.** (S2 10-01 "myth", S2 10-06 "not proven", S3 10-06 headline missing T2D, S1 10-05 missing "overweight or obesity", plus plague cards.)

### Carousel Designer
- **Every stat or table cell says what it counts, for whom, and against what. Keep the source's hedge and exact verb.**
  - Give the placebo figure (C1 09-30).
  - Give the CI or CrI with the model estimate (C2 09-30, C1 10-05).
  - Write "several of 17 clocks", not "the clocks" (C1 10-13).
  - Write "no significant difference vs placebo", not "no drop" (C1 10-01 major).
  - Only printed words go inside quote marks (C1 10-12).
  - Never present our own label as the source's.
  - If the title promises a source's list, reproduce the whole list. Helplines show their real hours (C1 10-01, Drinkline).
  - (About 25 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text, 1,500 characters or fewer measured after assembly, with a complete last line.**
  - No JSON, no literal "\n" and no cut-off URL. If it runs long, cut chapters first, then the last source.
  - Order:
    1. a quick answer of **3 lines or fewer**, with the hedge;
    2. the disclaimer plus the prescriber line;
    3. up to 4 sources (Shorts too: S1 10-10 and S2 10-13 had none);
    4. chapters.
  - (2 holds. Cut-off descriptions in L1 09-30, L1 10-01, L1 10-05, L1 10-07 and L1 10-09. The quick answer ran too long in 5 pieces.)
- **Titles: 100 characters or fewer, with at most 1 abbreviation. Name the outcome, the arm and the comparator, e.g. "20.8% weight loss on top dose vs 4% placebo". Observational results say "linked to", and a "why" title needs a source that explains why.** Lead with the generic name and put the brand in brackets. (1 hold, S2 09-30. About 15 GLP-1 title findings: L1 09-30, S1 10-01, L1 10-05, S1 10-05, L1 10-06, S1 10-06, S3 10-05, S3 10-06 and S2 10-12.)
- **Every field, including the pinned comment, ends with the disclaimer plus "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, not even a save prompt. Keep Threads bodies to about 350 characters; cut a clause rather than the prescriber line.** (Threads ran 370–490 characters in 11 pieces, including C1, S1 and S2 10-13. The prescriber line was missing or inexact in L1 09-30, S1 10-05 and Threads posts.)
- **Copy facts, qualifiers and attributions word for word from the verified script into every caption.**
  - Keep the full population ("overweight plus a related condition", "no diabetes", "commercially insured US adults").
  - Keep "estimated", "medically tailored meals", "not only muscle", "Novo Nordisk-funded" and "Lilly reported".
  - Report negative results too (C1 10-01).
  - "Regained" never becomes "led to". One kit stays one kit.
  - Never add "never", "always", "at all", "proven", "the moment" or "expert".
  - (About 100 findings. Population or qualifiers were dropped in C1, S2 and S3 10-13.)
- **Put the hedge in the first line of every caption, before the fold. No unhedged absolutes there**, e.g. "They've never been tested" (C2 09-30). (C2 09-30, S3 10-06, C1 10-08, S1 and S2 10-10; about 15 findings.)
- **Engagement lines ask people to save or share only.**
  - No open questions about dosing habits, beliefs or experiences (C2 10-01, S2 10-13, plus 4 plague pieces).
  - No emoji teasers on safety results.
  - No hashtags that imply an unproven use (#antiaging, C1 10-13) and no #WeightLoss (S1 10-05).
  - No brand-name, agency or #outbreak hashtags.

### Everyone
- **State the trial population exactly, everywhere:**
  - SURMOUNT-1 = obesity, or overweight (BMI 27+) with a weight-related condition, without diabetes.
  - SELECT = adults with heart disease and overweight/obesity, without diabetes.
  - The STEP 1 extension was a subset of adults without diabetes.
  - Name T2D trials as such.
  - (About 10 findings: C2 09-30, S1 10-05, S2 10-05, L1 10-05, S2 10-13, C1 10-13 and S3 10-13.)
- **Credit company-reported and top-line numbers to the company, in its own words**: "Lilly reported", "Regeneron's release", Lilly's word "counterfeit".
  - Say when a figure comes from a press release and not a paper.
  - Carry the funder into every caption.
  - Date every regulatory status to the current month: "investigational as of Oct 2026". The Wegovy pill was approved Dec 22, 2025. CagriSema has been filed, with a decision expected Q4 2026.
  - (About 8 findings: S1 09-30, L1 09-30, S1 10-01, S1 10-05, C1 10-05, S1 10-06, L1 10-05 and S2 10-01's out-of-date "as of September".)
- **Every source tag must actually say the line it's attached to.**
  - Our own advice, analogies and figures get no source tag. Never invent a figure (S3 09-30's time estimate).
  - Advice must match the tagged guideline: S2 10-06 "eat slowly" wasn't in Wharton 2022.
  - No quote marks around a paraphrase. Keep caveats such as "could not independently verify".
  - (5 holds; about 70 findings.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in the script and in every caption.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently and check in if you're new to it.
  - Red flags keep their urgency.
  - Decision-style long-forms note that these medicines aren't right for everyone (label contraindications).
  - (Major in S1 10-06 TikTok. Also C1 09-30, C1 10-01, S3 10-01, S2 10-05, L1 10-06, C1 10-06, S2 10-13 and L1 10-13.)
- **Keep the source list clean.**
  - Use direct canonical URLs that contain the cited text: no search, landing, profile or AMP pages (S3 10-05 PubMed search, L1 10-12 BMBL landing).
  - List only sources a scene actually cites.
  - Use exact published titles (L1 10-01, S3 10-01, L1 10-10, L2 10-12).
  - Give the "last reviewed" date on living pages (L1 09-30, L1 10-05, C1 10-06 NHS 15 May 2026).
  - (About 65 findings.)
- **Plague pieces only, if the owner keeps that lane.**
  - Re-check every named body at publish time. Include every dated development, never merge two days, and never end on the most reassuring line. The newest entry (Oct 10) is WHO: "the authorities further reported that the fatality was not due to plague infection". Credit it to Russian authorities via WHO, and keep "pneumonia of undetermined etiology" (3 holds).
  - Under CDC's 2020 case definition, PCR, antigen and F1 results are "presumptive". "Confirmed" means culture or a fourfold change in paired serum.
  - Whenever CDC is credited, use: "Plague can be cured with antibiotics, but treatment must be given quickly".
  - Keep "contact a doctor or local health authority urgently", tied to possible exposure, plus CDC's 4 pneumonic signs.
  - The 5,000-tests line belongs to governor Kobzev.
  - For US case counts, copy CDC's live verb.

_Updated 2026-10-13 from 56 QA records (27 GLP-1, 29 plague)._

_Updated 2026-10-13 from 56 QA records._
