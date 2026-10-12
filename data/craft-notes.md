_Based on 56 QA records from 2026-09-29 to 2026-10-12: 13 carousels, 30 Shorts and 13 long-form videos. 14 were held and 2 failed before render (L3 10-10 and L1 10-12). 28 records are about plague (10-07 to 10-12), and 11 of them were held or failed. 6 of the 8 plague long-forms were held or failed. Only L1 10-08 and L4 10-10 passed, and L4 scored just 4.7 on visuals. S3 10-12 also scored 4.7._

_Why items were held (in this window):_
- _**5 for crediting a claim to the wrong body or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10 and L3 10-10 (failed)._
- _**5 for scope errors or unsourced claims:** L1 09-29, S2 10-01, L1 10-06 and S3 10-08 moved findings to the wrong drug, group, dose or vaccine. **New: L1 10-12 failed** because it said the lab strain was weakened "on purpose", which the source (MMWR) never says._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and **S3 10-12 (new)**. S3 left out WHO's Oct 10 report that the authorities said the death was not due to plague._
- _2 for broken YouTube descriptions (L1 10-07 JSON, L1 10-09 cut off), 1 for phonetic spellings in subtitles (S1 10-01) and 1 for a causal title (S2 09-30)._
- _S1 10-07 was held under the old 90 s limit and would pass today, so there is no note for it. The "dropped expert limitation" note was removed because its only case (L1 09-27) is outside this window._

### Motion Designer
- **Every caption is a complete phrase of 2 lines or fewer. Never end one on NOT, NO, a dangling word (THE, A, BE, OFFICIALLY), a comma or a dash.** Status phrases stay on one screen ("NOT CONFIRMED", "NOT RULED OUT", "NO EVIDENCE PNEUMONIC PLAGUE PLAYED A PART"). So does "CONTACT A DOCTOR OR LOCAL HEALTH AUTHORITY URGENTLY", which was split as "OR LOCAL HEALTH" for the 4th time in S2 10-12. Never split a label like "BSL-2". Before rendering, check every caption that contains "confirmed", "ruled out", "evidence", "found" or "no". (A dropped or stranded negation happened in S1 10-08, S1 and S2 10-09, S1 10-10 and S3 10-12 ("PATIENT WITH NO"). Trailing commas, dashes or dangling words appeared in every Short on 10-10 and 10-12.)
- **Shorts: put tags only in the top 60% of the frame (y ≤ 1150 on 1920), and fade each one out before the next caption appears. If a tag can't be cleared in time, leave it out.** The repeat offenders are "Lungs", "Antibiotic(s)", "Pneumonia", "Y. pestis", "Stomach", "iron" and "Culture". A half-hidden "No…" tag under a caption (S2 10-12) can read as a dropped negation. (About 145 overlap findings across 23 Shorts, including 9 across the three 10-12 Shorts.)
- **Put stat titles and source sub-lines above or beside the hero art, never on heads or bodies.** (On-hero findings in S1 and S2 09-29, S3 10-05, S2 and S3 10-06 and S2 10-10.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** This applies to Shorts and long-form. (About 215 tiny-text findings in long-form. L4 10-10 alone had 42, and "Excess iron" in S2 10-12 was 23px.)
- **Keep everything inside the safe frame.** The bottom edge stays at y ≤ 994 on 1080 and y ≤ 1766 on 1920, with 5% margins at the sides and top. Long words like "ROSPOTREBNADZOR" must shrink or wrap to fit their pill. Never crop a head, mascot or icon at the edge (S3 10-12 cropped 2 icons; S3 10-10 and S2 10-09 cropped heads). (About 100 off-screen findings.)
- **Never open on, hold or end on a lone icon or a chips-only frame on a plain gradient.** Every frame needs a headline plus hero art or a scene covering at least ~25% of the frame. Use full scenes for lab, clinic and outro beats. (About 75 sparse audit findings in long-form; L1 10-09 alone had 17. There were also sparse frames in S2 and S3 10-12.)
- **Long-form: every scripted headline, status card and stat card renders in its own shot, and nothing from another shot appears in it.** Before rendering, compare each shot with its scripted title, and check compliance cards first ("NOT CONFIRMED / WHO, [date]", dated update cards, the governor's 5,000-tests card). Previous failures:
  - L2 10-10 dropped all of these cards and showed "Who Passes It On" about 230 s early.
  - L4 10-10 showed cards about 250 s early and never rendered 2 beats.
  - L1 10-10 put a clinic inside the Madagascar shot.
  - L1 10-09 put "The risk is the air" in the wrong shot.

### Scriptwriters
- **Shorts: 170 words or fewer, including the dated status line. Cut a beat rather than run long.** (8 of the last 9 plague Shorts went over: S1 and S2 10-09, all 3 on 10-10 and all 3 on 10-12. S3 10-12 had about 228 words.)
- **Write normal American spelling, with every stat and date in numerals** ("Oct 10, 2026", "1 in 802", "septicemic", "recognized"). Never use phonetic respellings. Captions are built from the script, which is how "OCTOBER TENTH" (S3 10-12), "OCTOBER EIGHTH" (S1 10-10) and "ONE IN EIGHT" for 1 in 802 (S3 10-05) got on screen. (1 hold, plus about 10 caption findings.)
- **Use the lab-test wording from CDC's 2020 case definition.**
  - PCR, antigen, F1 and rapid tests are "presumptive".
  - "Confirmed" means Y. pestis isolated in culture, or a fourfold change in antibodies in **paired serum** (not "later in the illness").
  - An "epidemiologic link" has CDC's 3 narrow meanings. It is not "a known case or exposure" (S3 10-12).
  - CDC's "Clinical Testing and Diagnosis" page does not cover PCR, antigen tests or culture time.
  - Clinician guidance ("treat as soon as plague is suspected") is framed as what doctors do, never as advice to viewers.
  - (2 holds: L1 10-07 and L1 10-10.)
- **Never add a mechanism, motive or intent the source doesn't state, and keep every claim at its source's exact scope and verb.**
  - MMWR says the KIM D27 strain was "attenuated", not weakened "on purpose" (L1 10-12 failed).
  - "Conceivably… might have" can't become a "Why…" answer (S2 10-12).
  - Keep both halves of a recommendation: "report to the institution and health-care providers" (L1 10-12).
  - A finding about one drug, dose arm, vaccine or group never moves to another (4 holds).
  - Use the sources' wording:
    - "requires direct and close contact"
    - "can be considered"
    - "handling tissue or body fluids of an infected animal" (not "without gloves")
    - CDC's "can sometimes cough droplets"
    - "Plague can be cured with antibiotics, but treatment must be given quickly" whenever CDC is credited; otherwise "especially when started early", never "if early"
    - WHO's 30–60% is "a case-fatality ratio for the bubonic type"
  - Never widen pneumonic-only facts to all plague.
  - (5 holds or fails.)
- **Every number gets its comparator, timeframe and denominator. On-screen text is never stronger, narrower or more reassuring than the narration.** Not confirmed ≠ ruled out ≠ "myth". Credit "not ruled out" to a body that says it, never to our own voice. On-screen cards keep the source's caveats, and counts match the narration. (About 75 findings.)

### Carousel Designer
- **Every stat or table cell needs a qualifier saying what it counts.** It keeps the source's hedge ("Can, with close contact", not "Yes") and its exact verb. Only words the source printed go inside quote marks: C1 10-12 quoted CDC with a changed verb. Never present our label as the agency's ("Early signs" C1 10-10, "in recent decades" C1 10-09). (About 20 findings.)
- **If the title promises a source's list, reproduce the whole list from that one page.** C1 10-10 dropped CDC's "reduce rodent habitat" and swapped in an item from another page. Helplines show their real hours (C1 10-01).

### Social Copywriter & packaging
- **YouTube description: plain text, 1,500 characters or fewer measured after assembly, with a complete last line.** No JSON, no literal "\n" and no cut-off URL. If it runs long, cut chapters first, then the last source. The order is:
  1. A quick answer of **3 lines or fewer** with the dated hedge.
  2. The disclaimer plus "If you're worried, talk to a health professional."
  3. Up to 4 sources.
  4. Chapters.

  The quick answer is still too long in S1 and S3 10-12, S1 10-10 and L4 10-10. (2 holds; 6 long-form descriptions were cut off or broken.)
- **Titles: 100 characters or fewer, starting with "Plague" or "Pneumonic plague", with at most one abbreviation and no causal or "why" claim the content can't back.** Status titles keep "suspected" or "reported" plus "as of [date]". Thumbnails say "NOT CONFIRMED" (not "UNCONFIRMED") and "not documented in the US since 1924" (not "last"). (1 hold, S2 09-30 "Cuts". About 40 findings.)
- **Every field ends with the disclaimer plus the exact line "If you're worried, talk to a health professional." Nothing comes after it, not even a save prompt (Facebook, C1 10-12).** Keep Threads bodies to about 350 characters. Threads ran 410–490 in S1, S2 and C1 10-12 and 430–470 in C1 and S3 10-10, and it drops the exact line most often. Every caption keeps "contact a doctor or local health authority urgently" and CDC's 4 pneumonic signs: fever, cough, shortness of breath, chest pain. (About 40 findings.)
- **Copy facts, verbs and attributions word for word from the verified script, without softening or hardening them.**
  - "Not pneumonic" never becomes "more than pneumonic".
  - "Remains unclear" never becomes "never confirmed".
  - "Prescribed" never becomes "given" (S2 10-12).
  - One kit stays one kit (S2 10-10).
  - Never "always", "at all", "proven", "exposed" (for "possible exposure") or "the moment".
  - Keep "follow label", "played a part in", "Russian authorities", "Reuters reports" and "pneumonia of undetermined etiology".
  - (Script errors carried into captions have contributed to 5 holds; about 95 findings.)
- **Put the hedge and the newest dated status in the first line of every caption, before the fold.** S1 and S2 10-10 had the hedge only in paragraph 4 or not at all, and S2 10-10 left out the newest update. (About 15 findings.)
- **Engagement lines ask people to save or share only.** Never ask about beliefs, sightings or what people have heard. No emojis on Meta plague captions, no #CDC, #WHO or #outbreak, and no "near you" or "any wild rodents" framing. (Open-ended prompts in S2 10-07, S3 10-09, S1 10-10 and S3 10-10.)

### Everyone
- **The status must be complete and current, dated to the day each body spoke, and up front. Re-check every named body at publish time, include every dated development (even unresolved ones), and never end on the most reassuring line.** Current entries:
  - Oct 6: WHO (Lindmeier), word for word: "No cause of death has been officially confirmed to date and laboratory testing is reportedly underway."
  - Oct 7: Van Kerkhove said WHO doesn't know the cause. AP published this on Oct 8.
  - Oct 8: Tedros asked about "a second employee with pneumonia of undetermined cause". The Kremlin called most reports false. Rospotrebnadzor "rejected reports about a second person falling ill" (AP).
  - Oct 9: governor Kobzev said about 5,000 lab tests found no dangerous pathogens and contact monitoring was completed.
  - **Oct 10 (new):** WHO reported that "the authorities further reported that the fatality was not due to plague infection." Credit this to the Russian authorities via WHO, and keep WHO's "pneumonia of undetermined etiology" and "key uncertainty" framing. Leaving this out held S3 10-12.

  Never merge two days. Quote each statement at its exact scope ("no evidence pneumonic plague played a part" ≠ "no evidence of plague"). (3 holds; date errors were part of 2 more.)
- **Every source tag must actually say the line it's attached to, credited to the body that said it.** Our own lines, such as "contact a doctor or local health authority urgently", get no agency tag (S1 10-12). The 5,000-tests line belongs to the governor (CGTN, Kyiv Independent) and keeps AP's caveat that he didn't say whether pneumonic plague was ruled out. Only UNN credits "Rospotrebnadzor specialists". Never put quote marks around a paraphrase. Keep a source's own caveats ("could not independently verify"). (5 holds; about 70 findings.)
- **Keep the source list clean.** Use direct URLs on the canonical domain that contain the cited text. No landing, profile, search or AMP pages: BMBL's landing page lacks the agent summary (L1 10-12). List only sources a scene cites, use exact published titles, and give each page its current "updated" date:

  | Page | Updated |
  |---|---|
  | CDC Plague Maps and Statistics | Oct 7, 2026 |
  | CDC Clinical Testing and Diagnosis | Oct 7, 2026 |
  | CDC About Plague | Aug 24, 2026 |
  | CDC How Plague Spreads | May 15, 2024 |
  | WHO plague fact sheet | Sep 29, 2026 |
  | BMBL | Mar 18, 2026 |
  | CDC COVID symptoms | Mar 10, 2025 |
  | PetMD cats/flea | Apr 8, 2025 |

  (About 60 findings.)
- **Urgency and safety caveats always go with the advice.** "Contact a doctor or local health authority urgently" is tied to possible exposure, and CDC's 4 pneumonic signs are listed in full. Flea advice always adds "follow the label; some dog flea products (e.g. permethrin) are toxic to cats" (S3 10-07, C1 10-10). (About 25 findings.)
- **Say exactly what was measured and who it was about.** Human cases ≠ animal cases, and a person under observation ≠ a case. For the US count, copy CDC's live wording at publish time. On Oct 7, 2026 it read: "An average of five human plague cases have been reported each year (range: 0–17 cases per year)" (C1 10-12 changed the verb). Introduce "a laboratory worker in Irkutsk oblast who died" before any pronoun (S2 10-10, L1 10-07), and never lead with her name. (About 30 findings.)

_Updated 2026-10-12 from 56 QA records (28 on plague)._

_Updated 2026-10-12 from 56 QA records._
