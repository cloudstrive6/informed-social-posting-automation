_Based on 55 QA records from 2026-10-01 to 2026-10-14: 11 carousels, 30 Shorts and 14 long-form videos. 13 were held and 2 failed before render (L3 10-10 and L1 10-12). 26 records are GLP-1 (10-01, 10-05, 10-06, 10-13, 10-14) and 29 are plague (10-07 to 10-12). The 09-30 records have left the window, so notes that only 09-30 supported are gone (for example the causal-title hold)._

_10-14 was all GLP-1: 5 pieces, 1 held (S3). Visual scores fell to 5.3–5.7 on the three Shorts (L1 scored 7.2). The same problems came back: every Short had captions that stop mid-phrase or split a spelled-out number, leftover tags covered captions, and there was 👀 emoji bait on safety topics. There was also a second hold for a misspelled drug name in the script._

_Why items were held (in this window):_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14. S3 10-14 credited CNN's own "no placebo group" description to Lilly._
- _**4 for scope errors or unsourced claims:** S2 10-01 ("all" participants), L1 10-06 (200/400 mg result credited to the 25/75 mg arms), S3 10-08 (one vaccine's result credited to another) and L1 10-12 (failed, "on purpose")._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**4 others:** 2 broken YouTube descriptions (L1 10-07, L1 10-09) and 2 for misspellings in script or subtitles (S1 10-01 "amilin", S3 10-14 "c meglutide")._
- _S1 10-07 was held under the old 90 s limit. It would pass today, so there is no note for it._

### Motion Designer
- **Every caption card ends where a clause or full noun phrase ends, in 2 lines or fewer. If a card's last word is a function word, an auxiliary, a title, a comma or a dash, merge it with the next card.**
  - Banned last words include THE, A, BE, NO, NOT, ABOUT, PEOPLE, STILL, PROVE, DOESN'T, WOULDN'T, YOU'VE, TOO, DR. and THEN,.
  - Never split a fixed phrase across cards: "NOT CONFIRMED", "OR LOCAL HEALTH AUTHORITY", "BSL-2", "HAVE A PROTEIN SHAKE", "TOO EARLY TO TELL".
  - Chips are never fragments either ("Typically" / "or animal").
  - (Found in about 23 Shorts, including every Short on 10-10, 10-12, 10-13 and 10-14. Stranded negations contributed to the S1 10-09 hold.)
- **Caption numbers are numerals that match the stat pill exactly, and a number never splits across two caption cards.**
  - Write "15.3%", not "FIFTEEN POINT" / "THREE PERCENT".
  - Write "~2–3 yrs", not "AROUND 2".
  - Write "1 in 802", not "ONE IN EIGHT".
  - Write "Oct 10, 2026", not "OCTOBER TENTH".
  - Convert spelled-out numbers before rendering.
  - (About 13 Shorts had spelled-out numbers and 7 had split numbers, including S2 and S3 10-14. In S3 10-05 and S2 10-14 ("POINT SIX TWO") the garbling changed the stat itself.)
- **Shorts: tags and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920). Fade each one out before the next caption appears; if it can't be cleared in time, leave it out.**
  - Repeat offenders: "Stomach", "Stomach lining", "Gut", "Fat cell", "Lean mass", "Muscle", "Lungs", "Antibiotic", "FDA", "Blood sugar", "Weight loss", "SNAC", "Weekly shot", "72 weeks" and drug-name labels.
  - (About 175 overlap findings across 29 Shorts. S1 10-13 had 10, and S1 and S3 10-14 had 6 each.)
- **Put stat titles and source sub-lines above or beside the hero art, never on faces, heads or bodies.** (On-hero findings in S3 10-05, S2 and S3 10-06, S2 10-10 and S3 10-13.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** This includes pill and name tags like "SUMMIT", "Placebo: 2 in…" and "GLP-1". (About 235 tiny-text findings across all 12 rendered long-forms. L4 10-10 had 42 and L1 10-14 had 14.)
- **Keep everything inside the safe frame: y ≤ 994 on 1080 and y ≤ 1766 on 1920, with 5% margins.**
  - Labels under characters standing on the floor are the main risk. Lift the character or put the label above it (L1 10-14 "SUMMIT"/"STEP-HFpEF", L2 10-12 "Rodent"/"Hunter").
  - Never crop a head, person icon, mascot or pill at the frame edge (S1 and S3 10-14, S1 and S3 10-13, S3 10-12).
  - (About 120 off-screen findings.)
- **Every frame needs a headline plus a hero character or scene covering at least ~25% of the frame.**
  - Never open on, hold or end on a lone icon, a lone chip or a chips-only frame on a gradient.
  - An empty room set with props but no character doesn't count as a scene (L1 10-14).
  - Never render empty placeholder chips, cells or seat-backs (a bare "–"). If there's no content, delete the element.
  - (About 90 sparse findings in long-form. Placeholders in L1, S2 and S3 10-13.)
- **Long-form: every scripted headline, stat card and status card renders in its own shot, with nothing from another shot in it.** Compare each shot with its scripted title before render. (L2 and L4 10-10 showed cards about 230–250 s early. L1 10-09, L1 10-10 and L1 10-13 had leaks or stitched beats.)

### Scriptwriters
- **Spell every drug, company and trial name correctly, with no phonetic respellings, because subtitles and captions are built from the script.** Before handoff, check names against this list: semaglutide, tirzepatide, retatrutide, survodutide, amylin, Lilly, Phase 2b. (2 holds: S1 10-01 "amilin" and S3 10-14 "c meglutide". Also the "RETRATRUDE" caption in S1 10-14, plus narration mismatches in L1 10-01 and L1 10-05.)
- **Shorts: 170 words or fewer, including the status line and the prescriber line. Cut a beat rather than run long.** (7 plague Shorts went over: S2 10-10 had ~235 words and S3 10-12 ~228.)
- **Every number carries all of the following:**
  - what it measures ("% of body weight");
  - the arm or dose;
  - the comparator ("vs 2.4% on placebo"), including dropout and discontinuation rates (S2 10-14: 6.3% vs 1.4%);
  - the timeframe;
  - the estimand;
  - an absolute rate next to any relative figure ("HR 0.43 = 1.4% vs 3.2%"; L1 10-14 s46 had none).
  - Never put two units side by side unexplained (S3 10-13). Label group averages and substudy size.
  - (About 15 GLP-1 findings, including a major in S3 10-01.)
- **Keep every finding at its source's exact scope and verb. It never moves to another drug, dose, arm, group or vaccine.**
  - Interim 200/400 mg results aren't the 25/75 mg arms.
  - Observational data is "linked to".
  - Never add a mechanism, motive or "why" the source doesn't state.
  - Guideline habits are "recommended", not "shown to protect muscle on tirzepatide" (S2 10-13).
  - (4 holds or fails.)
- **Not proven ≠ disproven ≠ "myth". "Not yet peer-reviewed" ≠ "not peer-reviewed". On-screen text is never stronger, narrower or more reassuring than the narration, and keeps the population and the hedge.** (S2 10-01, S1 10-05, S2 and S3 10-06, S3 10-14, plus plague cards.)

### Carousel Designer
- **Every stat or cell says what it counts, for whom and against what, and keeps the source's hedge, exact verb and every qualifier.**
  - Give the placebo figure and the CI with the model estimate (C1 10-05).
  - Write "several of 17 clocks" (C1 10-13).
  - Write "no significant difference vs placebo", not "no drop" (C1 10-01 major).
  - Write "despite reported fasting", not "despite fasting", and never add a timeframe the guidance doesn't state (C1 10-14).
  - Only printed words go inside quote marks (C1 10-12).
  - If the title promises a source's list, reproduce all of it. Helplines show their real hours (C1 10-01).
  - (About 25 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text, 1,500 characters or fewer measured after assembly, with a complete last line.**
  - No JSON, no literal "\n" and no cut-off URL. If it runs long, cut chapters first, then the last source.
  - Strict order:
    1. a quick answer of **3 lines or fewer**;
    2. the disclaimer plus the prescriber line;
    3. up to 4 sources (Shorts too);
    4. chapters.
  - No extra paragraph goes before the disclaimer (L1 10-14).
  - (2 holds. Cut-offs in L1 10-01, L1 10-05, L1 10-07 and L1 10-09. L1 and S2 10-14 sat at the limit. The quick answer ran long in about 6 pieces, and Shorts had no sources in S1 10-10 and S2 10-13.)
- **Titles: 100 characters or fewer, at most 1 abbreviation, and the exact population, outcome, arm and comparator.** Write "in HFpEF", not "heart failure" (L1 10-14). Write it out, not "HFpEF, HF or CV" (S2 10-14). Lead with the generic name and put the brand in brackets. A "why" title needs a source that explains why (S2 10-12). (About 15 findings.)
- **Every field, including the pinned comment and the description, ends with the disclaimer plus "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it.** Keep Threads bodies to about 350 characters, and cut a clause rather than a safety line. (Threads ran 370–490 characters in about 12 pieces, including S2 10-14. Content came after the disclaimer in C1 10-12 and L1 10-14.)
- **Copy facts, qualifiers and attributions word for word from the verified script.**
  - Keep the full population, "estimated", "medically tailored meals", "not only muscle", the funder, "Lilly reported" and "reported to the FDA" (not "flagged").
  - Report negative results too.
  - "Regained" never becomes "led to". "Better" never becomes "safer".
  - Never add "never", "always", "at all", "proven" or "the moment".
  - (About 100 findings. Dropped in C1, S2 and S3 10-13 and in S1 10-14.)
- **Put the hedge in the first line of every caption, before the fold, with no unhedged absolutes there.** (S3 10-06, C1 10-08, S1 and S2 10-10, S3 10-06; about 15 findings.)
- **Engagement lines ask people to save or share only.**
  - No open questions about dosing, beliefs or experiences (C2 10-01, S2 10-13, plus 4 plague pieces).
  - **No emoji in the hook of any safety, side-effect or death-report post** (👀 in S3 10-01, C1 10-14 and S1 10-14).
  - No hashtags that imply an unproven use or a population-free benefit (#antiaging C1 10-13, S3 10-14), no #WeightLoss and no brand-name, agency or #outbreak hashtags.

### Everyone
- **State the trial population and the exact drug everywhere, including titles, pinned comments and Threads.**
  - SURMOUNT-1 = obesity, or overweight (BMI 27+) with a weight-related condition, without diabetes.
  - SELECT = adults with heart disease and overweight/obesity, without diabetes.
  - SUMMIT = HFpEF (EF ≥ 50%) with obesity.
  - The tirzepatide sleep apnea approval = moderate-to-severe OSA in adults with obesity.
  - A semaglutide result is never "GLP-1s" in general. Tirzepatide is injection only; only semaglutide has tablets.
  - (About 10 findings: S1, S2 and L1 10-05; S2, C1 and S3 10-13; L1, S2, S3 and C1 10-14.)
- **Credit every line to whoever actually said it, in their own words.**
  - A reporter's description is not the company's statement (S3 10-14 hold).
  - Write "Lilly reported" for top-line numbers, and say when a figure comes from a press release.
  - Carry the funder into every caption.
  - Date every regulatory status ("investigational as of Oct 2026"). The Wegovy pill was approved Dec 22, 2025. CagriSema has been filed, with a decision expected Q4 2026.
  - (6 holds in this window for the wrong body, person or date.)
- **Every source tag must actually say the line it's attached to.**
  - Our own advice, analogies and figures get no tag.
  - Trial-data cards cite the trial paper, not the news story (S1 10-14).
  - Advice matches the tagged guideline (S2 10-06).
  - No quote marks around a paraphrase. Keep caveats such as "could not independently verify".
  - (About 70 findings.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in the script and every caption.**
  - Fluids: "unless you've been told to limit fluids".
  - Protein: check first if you have kidney disease.
  - Exercise: start gently.
  - When the audience already has a condition (heart failure, T2D, upcoming surgery), add "don't stop or change your current medicines on your own" (S2 10-14, C1 10-14 Threads).
  - Decision-style long-forms note that these medicines aren't right for everyone (L1 10-13).
  - (Major in S1 10-06 TikTok, plus about 10 more.)
- **Keep the source list clean.**
  - Use direct, working, canonical primary URLs: no search, landing, AMP, 404 or 403 pages and no secondary blogs (S3 10-05, L1 10-12, L1 and S2 10-14).
  - List only sources a scene actually cites.
  - Use exact published titles.
  - Give the "last reviewed" or current revision date on living pages and labels (C1 10-06, C1 10-14).
  - (About 65 findings.)
- **Plague pieces only, if the owner keeps that lane.**
  - Include every dated development, up to WHO Oct 10: "the authorities further reported that the fatality was not due to plague infection". Credit it to Russian authorities via WHO, keep "pneumonia of undetermined etiology", and never end on the most reassuring line (3 holds).
  - PCR, antigen and F1 results are "presumptive".
  - Use CDC's exact line: "Plague can be cured with antibiotics, but treatment must be given quickly".
  - Keep "contact a doctor or local health authority urgently" plus CDC's 4 pneumonic signs.
  - The 5,000-tests line belongs to governor Kobzev.

_Updated 2026-10-14 from 55 QA records (26 GLP-1, 29 plague)._

_Updated 2026-10-14 from 55 QA records._
