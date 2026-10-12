_Based on 57 QA records from 2026-09-29 to 2026-10-12: 13 carousels, 30 Shorts and 14 long-form videos. 14 were held and 2 failed before render (L3 10-10 and L1 10-12). 29 records are about plague (10-07 to 10-12), and 11 of them were held or failed. 6 of the 9 plague long-forms were held or failed. Only L1 10-08, L4 10-10 and **L2 10-12 (new, passed, visuals 6.7)** went through. L4 10-10 and S3 10-12 scored just 4.7 on visuals._

_Why items were held (in this window):_
- _**5 for crediting a claim to the wrong body or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10 and L3 10-10 (failed)._
- _**5 for scope errors or unsourced claims:** L1 09-29, S2 10-01, L1 10-06 and S3 10-08 moved a finding to the wrong drug, group, dose or vaccine. L1 10-12 failed for "weakened on purpose", which MMWR never says._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12. S3 10-12 left out WHO's Oct 10 report._
- _Also: 2 broken YouTube descriptions (L1 10-07, L1 10-09), 1 for phonetic spellings in subtitles (S1 10-01) and 1 for a causal title (S2 09-30)._
- _S1 10-07 was held under the old 90 s limit and would pass today, so there is no note for it._

### Motion Designer
- **Every caption, chip and label is a complete phrase of 2 lines or fewer. Never end one on NOT, NO, a dangling word (THE, A, BE, OFFICIALLY), a comma or a dash.**
  - Status phrases stay on one screen: "NOT CONFIRMED", "NOT RULED OUT", "NO EVIDENCE PNEUMONIC PLAGUE PLAYED A PART".
  - "CONTACT A DOCTOR OR LOCAL HEALTH AUTHORITY URGENTLY" also stays on one screen. It has been split as "OR LOCAL HEALTH" 4 times, most recently in S2 10-12.
  - Never split a label like "BSL-2". Chips can't be fragments either: L2 10-12 had "Typically" / "or animal".
  - Before rendering, check every caption that contains "confirmed", "ruled out", "evidence", "found" or "no".
  - (Dropped or stranded negations in S1 10-08, S1 and S2 10-09, S1 10-10 and S3 10-12. Trailing commas, dashes or dangling words in every Short on 10-10 and 10-12.)
- **Shorts: put tags only in the top 60% of the frame (y ≤ 1150 on 1920). Fade each tag out before the next caption appears. If a tag can't be cleared in time, leave it out.** The repeat offenders are "Lungs", "Antibiotic(s)", "Pneumonia", "Y. pestis", "Stomach", "iron" and "Culture". A half-hidden "No…" tag (S2 10-12) can read as a dropped negation. (About 145 overlap findings across 23 Shorts.)
- **Put stat titles and source sub-lines above or beside the hero art, never on heads or bodies.** (On-hero findings in S1 and S2 09-29, S3 10-05, S2 and S3 10-06 and S2 10-10.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** This applies to Shorts and long-form. (About 220 tiny-text findings in long-form. L4 10-10 alone had 42. More in L2 10-12, "Body fluids" and "Droplets", and S2 10-12, "Excess iron" at 23px.)
- **Keep everything inside the safe frame: y ≤ 994 on 1080 and y ≤ 1766 on 1920, with 5% margins.**
  - Labels under characters standing on the floor are the main risk. Lift the character or put the label above it. L2 10-12 cropped "Rodent", "Hunter", "Sick animal" and "Lungs" at the bottom edge.
  - Long words like "ROSPOTREBNADZOR" shrink or wrap.
  - Never crop a head, mascot or icon (S3 10-12, S3 10-10, S2 10-09).
  - (About 110 off-screen findings.)
- **Never open on, hold or end on a lone icon or a chips-only frame on a plain gradient.** Every frame needs a headline plus hero art or a scene covering at least ~25% of the frame. Use full scenes for lab, clinic and outro beats, and don't leave a scene empty while waiting for icons to arrive (L2 10-12 at 2.8 s). (About 80 sparse findings in long-form. L1 10-09 alone had 17.)
- **Long-form: every scripted headline, status card and stat card renders in its own shot, and nothing from another shot appears in it.** Compare each shot with its scripted title, starting with the compliance cards: "NOT CONFIRMED / WHO, [date]", the dated update cards and the governor's 5,000-tests card. (L2 10-10 dropped them all and showed a title about 230 s early. L4 10-10 showed cards about 250 s early and never rendered 2 beats. L1 10-10 and L1 10-09 had content leak in from other shots.)

### Scriptwriters
- **Shorts: 170 words or fewer, including the dated status line. Cut a beat rather than run long.** (8 of the last 9 plague Shorts went over. S3 10-12 had about 228 words.)
- **Write normal American spelling, with every stat and date in numerals** ("Oct 10, 2026", "1 in 802", "septicemic"). Never use phonetic respellings. Captions are built from the script, which is how "OCTOBER TENTH" (S3 10-12), "OCTOBER EIGHTH" (S1 10-10) and "ONE IN EIGHT" (S3 10-05) got on screen. (1 hold, plus about 10 findings.)
- **Use the lab-test wording from CDC's 2020 case definition.**
  - PCR, antigen, F1 and rapid tests are "presumptive".
  - "Confirmed" means culture isolation, or a fourfold antibody change in **paired serum**.
  - An "epidemiologic link" covers only CDC's 3 narrow meanings.
  - CDC's "Clinical Testing and Diagnosis" page doesn't cover PCR, antigen tests or culture time.
  - "Treat as soon as suspected" describes what clinicians do. It is never advice to viewers.
  - (2 holds: L1 10-07 and L1 10-10, plus findings in S3 10-12.)
- **Never add a mechanism, motive, intent or analogy the source doesn't state. Keep every claim at its source's exact scope and verb.**
  - MMWR says "attenuated", not "on purpose" (L1 10-12 failed).
  - "Conceivably… might have" never becomes a "Why…" answer (S2 10-12).
  - Keep both halves of a recommendation: "the institution and health-care providers".
  - A finding never moves to another drug, dose, vaccine or group (4 holds).
  - Use the sources' wording:
    - "requires direct and close contact"
    - "can be considered"
    - "handling tissue or body fluids of an infected animal"
    - "can sometimes cough droplets"
    - WHO: bubonic person-to-person spread is "uncommon", not impossible (L2 10-12)
    - CDC: "exposed to fleas", not "rodent fleas"
    - Whenever CDC is credited: "Plague can be cured with antibiotics, but treatment must be given quickly". Otherwise write "especially when started early". (Softened in L3 10-10 and L2 10-12.)
    - WHO's 30–60% is "a case-fatality ratio for the bubonic type".
  - Never widen pneumonic-only facts to all plague.
  - (5 holds or fails.)
- **Every number gets its comparator, timeframe and denominator. On-screen text is never stronger, narrower or more reassuring than the narration.**
  - Not confirmed ≠ ruled out ≠ "myth".
  - Credit "not ruled out" to a body that says it, never to our own voice.
  - Cards keep the source's caveats.
  - (About 75 findings.)

### Carousel Designer
- **Every stat or table cell needs a qualifier saying what it counts. Keep the source's hedge ("Can, with close contact", not "Yes") and its exact verb.** Only printed words go inside quote marks: C1 10-12 quoted CDC with a changed verb. Never present our own label as the agency's ("Early signs" C1 10-10, "in recent decades" C1 10-09). (About 20 findings.)
- **If the title promises a source's list, reproduce the whole list from that one page.** C1 10-10 dropped CDC's "reduce rodent habitat". Helplines show their real hours (C1 10-01).

### Social Copywriter & packaging
- **YouTube description: plain text, 1,500 characters or fewer measured after assembly, with a complete last line.**
  - No JSON, no literal "\n" and no cut-off URL. If it runs long, cut chapters first, then the last source.
  - Order: (1) a quick answer of **3 lines or fewer** with the dated hedge; (2) the disclaimer plus "If you're worried, talk to a health professional."; (3) up to 4 sources; (4) chapters.
  - The quick answer is still too long in S1 and S3 10-12, S1 10-10 and L4 10-10.
  - (2 holds; 6 long-form descriptions cut off or broken.)
- **Titles: 100 characters or fewer, starting with "Plague" or "Pneumonic plague", with at most 1 abbreviation and no causal or "why" claim the content can't back.**
  - Status titles keep "suspected" or "reported" plus "as of [date]".
  - Thumbnails say "NOT CONFIRMED" and "not documented in the US since 1924".
  - (1 hold, S2 09-30. About 40 findings.)
- **Every field ends with the disclaimer plus the exact line "If you're worried, talk to a health professional." Nothing comes after it, not even a save prompt (Facebook, C1 10-12).**
  - Keep Threads bodies to about 350 characters. They ran 410–490 in 5 recent pieces.
  - Every caption keeps "contact a doctor or local health authority urgently" and CDC's 4 pneumonic signs: fever, cough, shortness of breath, chest pain.
  - (About 40 findings.)
- **Copy facts, verbs and attributions word for word from the verified script.**
  - "Not pneumonic" never becomes "more than pneumonic".
  - "Remains unclear" never becomes "never confirmed".
  - "Prescribed" never becomes "given".
  - One kit stays one kit.
  - Never use "always", "at all", "proven", "exposed" or "the moment".
  - Keep "follow label", "played a part in", "Russian authorities", "Reuters reports" and "pneumonia of undetermined etiology".
  - (Contributed to 5 holds; about 95 findings.)
- **Put the hedge and the newest dated status in the first line of every caption, before the fold.** (S1 and S2 10-10; about 15 findings.)
- **Engagement lines ask people to save or share only.** No questions about beliefs, sightings or what people have heard. No emojis on Meta plague captions, no #CDC, #WHO or #outbreak, and no "near you" framing. (S2 10-07, S3 10-09, S1 10-10, S3 10-10.)

### Everyone
- **The status must be complete, current, dated to the day each body spoke, and up front. Re-check every named body at publish time, include every dated development, and never end on the most reassuring line.** Current entries:
  - Oct 6: WHO (Lindmeier), word for word: "No cause of death has been officially confirmed to date and laboratory testing is reportedly underway."
  - Oct 7: Van Kerkhove said WHO doesn't know the cause (published by AP on Oct 8).
  - Oct 8: Tedros asked about "a second employee with pneumonia of undetermined cause". The Kremlin called most reports false. Rospotrebnadzor "rejected reports about a second person falling ill" (AP).
  - Oct 9: governor Kobzev said about 5,000 lab tests found no dangerous pathogens and contact monitoring was completed.
  - Oct 10: WHO reported "the authorities further reported that the fatality was not due to plague infection." Credit this to the Russian authorities via WHO, and keep WHO's "pneumonia of undetermined etiology" and "key uncertainty" framing.

  Never merge two days, and quote each statement at its exact scope. (3 holds, including S3 10-12; date errors were part of 2 more.)
- **Every source tag must actually say the line it's attached to, credited to the body that said it.**
  - Our own lines and analogies get no agency tag (S1 10-12 urgent-contact line; L2 10-12 "remove one element" analogy tagged to WHO).
  - The 5,000-tests line belongs to the governor (CGTN, Kyiv Independent) and keeps AP's caveat that he didn't say whether pneumonic plague was ruled out. Only UNN credits "Rospotrebnadzor specialists".
  - No quote marks around a paraphrase. Keep caveats such as "could not independently verify".
  - (5 holds; about 70 findings.)
- **Keep the source list clean.** Use direct canonical URLs that contain the cited text: no landing, profile, search or AMP pages (BMBL landing page, L1 10-12). List only cited sources, use exact published titles, and give the current "updated" date. "Signs and Symptoms of Plague" was mis-titled in L2 10-10 and L2 10-12. (About 65 findings.)

  | Page (exact title where flagged) | Updated |
  |---|---|
  | CDC Plague Maps and Statistics | Oct 7, 2026 |
  | CDC Clinical Testing and Diagnosis | Oct 7, 2026 |
  | CDC About Plague | Aug 24, 2026 |
  | CDC How Plague Spreads | May 15, 2024 |
  | CDC "Signs and Symptoms of Plague" | re-check |
  | WHO plague fact sheet | Sep 29, 2026 |
  | BMBL | Mar 18, 2026 |
  | CDC COVID symptoms | Mar 10, 2025 |
  | PetMD cats/flea | Apr 8, 2025 |
- **Urgency and safety caveats always go with the advice.**
  - "Contact a doctor or local health authority urgently" is tied to possible exposure.
  - List the warning signs for every form the piece covers: CDC's 4 pneumonic signs in full, plus "a swollen, painful lymph node" whenever bubonic or US cases are discussed. (Only one set was given in S3 10-07 and in the L2 10-12 description.)
  - Flea advice adds "follow the label; some dog flea products (e.g. permethrin) are toxic to cats".
  - (About 27 findings.)
- **Say exactly what was measured and who it was about.**
  - Human cases ≠ animal cases, and a person under observation ≠ a case.
  - For the US count, copy CDC's live verb at publish time. The 10-12 fact-checker quoted the Oct 7 page: "An average of five human plague cases have been reported each year (range: 0–17 cases per year)". The verb was changed in C1 10-12 and the L2 10-12 description.
  - Introduce "a laboratory worker in Irkutsk oblast who died" before any pronoun, and never lead with her name.
  - (About 32 findings.)

_Updated 2026-10-12 from 57 QA records (29 on plague)._

_Updated 2026-10-12 from 57 QA records._
