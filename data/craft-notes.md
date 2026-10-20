_Based on 69 QA records from 2026-10-07 to 2026-10-20: 39 Shorts, 17 long-forms and 13 carousels. 40 are GLP-1 (10-13 to 10-20) and 29 are plague (10-07 to 10-12). 11 were held and 2 failed before render (L3 10-10 and L1 10-12). Nothing has been held since 10-16, but problems of the kind that caused holds are still shipping every day._

_New on 10-20 (5 GLP-1 pieces). Nothing was held. The same problems came back:_
- _**Long-form beats rendered in the wrong place again, the worst case so far.** L1 shots 7–16 showed cards from about 300 s later. The **required "Not personal advice. Talk to your doctor or prescriber" card never appeared.**_
- _**Numbers spelled out in captions:** "SIXTY-FOUR", "FOURTEEN" (S1), "FIFTEEN MILLIGRAM" and "IN SIX HUNDRED" for 630 (S2). Every caption Short from 10-18 to 10-20 had this problem._
- _**Audio:** S3 masking was 0.029. That is under the limit but over the 0.025 remix line, and it wasn't remixed._
- _**Caption fragments in all 3 Shorts.** Overlaps: S1 6, S2 4, S3 8. A pill title sat on the hero art in S2 (3 findings)._
- _**Narration:** "A1c" was heard as "aonec" (L1)._
- _**Facts:** estimand labels were missing (L1). A group of 537 was given with no group sizes (S3). Our own advice carried a source tag (S1, S2). A company's list was widened to "not diabetes" (S3)._
- _**Packaging:**_
  - _Threads ran over in all 4 posts._
  - _Open engagement questions (S1)._
  - _The hedge came after the first line (S1, S2)._
  - _Brand hashtags appeared on a compounded-recall post._
  - _No sources in the YouTube description (S1), or no working links (S2)._
  - _A CTA named a long-form with no link (S2)._
  - _A placeholder value appeared in a carousel cell (C1)._

_Why items were held:_
- _**6 for crediting a claim to the wrong body, person, page or date:** L1 10-07, S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed) and S3 10-14._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10 and S3 10-12._
- _**2 for scope errors or unsourced claims:** S3 10-08 and L1 10-12 (failed)._
- _**Others:** 2 broken YouTube descriptions (L1 10-07, L1 10-09), 1 misspelling (S3 10-14) and 1 voice masked by music (S3 10-16). The two 90 s holds (S1 10-07, S1 10-08) are out of date._

### Motion Designer
- **Audio: the voice always wins. Masking must be 0.03 or lower before render, with no exceptions.** If it is above 0.025, remix: duck the music and sound effects further. Never put a sound effect under a spoken number or drug name. (Hold: S3 10-16 at 0.07. S2 10-16 was 0.05. S1 10-19 was 0.034 and still shipped. S3 10-20 was 0.029 and S1 10-18 was 0.028, both left unremixed.)
- **Every caption card ends where a clause or a full noun phrase ends. It fits in 2 lines or fewer, and only one card is on screen at a time.**
  - Never end a card on a comma, dash, colon, article, auxiliary, negation, preposition, question word, relative pronoun, possessive, bare number, or bare verb or adjective. Examples: THE, A, BE, CAN, NOT, WEREN'T, WHO, WHOSE, WHAT, ABOUT, PLUS, POINT, FDA'S, STICK, MISS, TOP 12. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase or trial name across cards: "NOT CONFIRMED", "OVERWEIGHT PLUS A RELATED CONDITION", "HEAD-TO-HEAD", "ELECTIVE SURGERY", "OBSTRUCTIVE SLEEP APNEA", "REDEFINE 1". Chips follow the same rule.
  - (Fragments in about 37 of 39 Shorts, including every Short from 10-13 to 10-20. A stranded "NOT" or "WEREN'T" flipped the meaning, or risked flipping it, 4 times.)
- **Build caption text from the script's on-screen numerals, never from the spoken transcript.** Every number, dose, count, year and date must match its stat pill exactly and stay on one card.
  - Write "64 vials", "15 mg", "630", "20.2%", "2016", "Q1 2027".
  - Never write "SIXTY-FOUR", "SEVEN POINT TWO" or "TWENTY TWENTY-SIX".
  - Before render, search the captions for number words (ZERO–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, MILLIGRAM, TWENTY TWENTY) and fix every hit.
  - (About 27 Shorts, including every Short from 10-18 to 10-20 except S3 10-20. The wrong number reached the screen 7 times, and "IN SIX HUNDRED" for 630 in S2 10-20 nearly made it 8.)
- **Shorts: tags, name labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet or under a pill or syringe.** Fade each tag out before the next caption appears; if it can't be cleared in time, cut it.
  - Repeat offenders: drug-name tags under pill or syringe faces (S3 10-19 had 28 overlaps), "Stomach", "Heart", "Gut", "Lean mass", "Fat cell", "Blood sugar", "HbA1c", "Type 2 diabetes", "Sterile" and "Compounding pharmacy".
  - (About 200 overlap findings across 34 of 39 Shorts. All 3 Shorts on 10-20 had them.)
- **Make all text at least ~40px on a 1080 frame, or drop the label.** (About 255 tiny-text findings across all 15 rendered long-forms. L1 10-19 had 20 and L1 10-20 had 12.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Name tags go above characters. Each tag gets its own space so tags never touch or merge ("SemaglutideTirzepatide" in L1 10-19). Name tags were cropped at the bottom edge in L1 10-14, 10-17, 10-18 and 10-20 ("Dana, 47").
  - Never crop a head, mascot, icon, pill or syringe at the frame edge.
  - Stat titles and pills go on plain sky, gradient or a solid card, never on faces, characters, factories, shelves or busy art. (On-hero findings in 6 Shorts, most recently S2 10-20.)
  - (About 160 off-screen findings. L1 10-20 had 20.)
- **From its first frame, every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or a room with props but no character. Label every large shape and spell out jargon chips such as "AHI".
  - **Before render, delete empty "–" placeholder chips, dashed shelves and stray template UI.** (8 times, most recently L1 10-19 and C1 10-20.)
  - (About 135 sparse findings in long-form.)
- **Long-form: one shot = one scripted beat. This is now the most damaging visual bug.**
  - Before render, compare each shot's on-screen title with the scripted beat at that timestamp. If a run of shots shows cards from about 250–300 s later, the shot-to-beat timing table is offset: fix the mapping for the whole run, not shot by shot.
  - Confirm the required disclaimer and prescriber card is on screen at its scripted beat.
  - (8 long-forms, including L1 10-17, where shots 6–10 showed later cards, and L1 10-20, where shots 7–16 did and the disclaimer card was lost.)

### Scriptwriters
- **The narration text must be exactly what is spoken, word for word, written the way it is said.**
  - Write "versus", not "vs". Spell out symbols and units in the narration; the numerals go in on_screen_text.
  - Use no merged or phonetic words ("redefinedfor", "achievthree", "aonec"). Say letter abbreviations in full words where you can ("A1C, your 3-month blood sugar average") and keep them to one per scene.
  - Spell drug, company and trial names correctly, and check that the voice says them ("rita trutide" in L1 10-19). Don't let the voice paraphrase.
  - (Mismatches in 10 pieces, most recently L1 10-20. Misspelling hold: S3 10-14.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 13 Shorts went over.)
- **Every number carries all of these in the narration, not only on screen:**
  - what it measures;
  - the arm or dose ("the top trial dose") and the exact comparator;
  - the size of each group, never a combined N (537 in S3 10-20);
  - the timeframe;
  - which estimand it is ("everyone randomized" or "while on treatment"; L1 10-20 s29 and s53);
  - an absolute rate next to any relative figure, labelled "relative";
  - the source's exact figure, correctly rounded.
  - (About 32 findings.)
- **Keep every finding at its source's exact scope and verb.**
  - Matched or observational analyses: "linked to". Habits from guidelines: "recommended". Label wording: "tolerated".
  - Never add scope the source doesn't give ("from any cause", "not diabetes" when Lilly only left it off its list in S3 10-20). Never narrow it ("gastrointestinal" is not "stomach").
  - Low responders are "smaller", not "slower". Never state our own assumption as fact.
  - (3 holds or fails, plus about 6 more since 10-19.)
- **Muted-viewer test: on-screen text is never stronger, broader or more reassuring than the narration.**
  - Every stat card names the drug and dose (flag "top dose"), the comparator, the population, the measure, the timeframe and the estimand. Keep qualifiers like "alone" and "relative".
  - Not proven is not the same as disproven.
  - (About 18 findings, including 1 hold. Most recently S2 10-20 s5.)
- **The hook and the title pay off exactly, in the order promised.** (S1 10-15, S1 10-16, C1 10-18, C1 10-19.)
  - Only name a video in the CTA if it is already published, and give its exact title. Otherwise say "follow for more". (S1 10-13, S3 10-15, S2 10-20.)

### Carousel Designer
- **Every stat or cell says what it counts, for whom, against what and when, and keeps the source's hedge, exact verb and scope.**
  - Split any N into its groups (C1 10-17; 173,846 in C1 10-20).
  - Give every result its timepoint, and use the same population wording on every slide.
  - Call subgroup comparisons "subgroup averages, not head-to-head".
  - Only the exact printed words go inside quote marks.
  - No empty or placeholder cell values (C1 10-20). Avoid wording that can be misread ("fast blood sugar drops" can sound like hypoglycemia).
  - The title and hook promise no more than the slides deliver.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 38 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - No JSON and no literal "\n".
  - Strict order:
    1. If a Short's CTA names a long-form, line 1 is that long-form's link.
    2. A quick answer of **3 lines or fewer** that carries one named common side effect, any dated status and its caveat ("a plan to file isn't approval").
    3. The disclaimer plus the prescriber line.
    4. Up to 4 sources as **clickable canonical URLs**, always present.
    5. Chapters.
  - No hashtag line between the quick answer and the disclaimer.
  - If it runs long, cut chapters first, then the last source.
  - (2 holds. Quick answer too long in about 15 pieces. Sources missing in S2 10-13, S1 10-20 and S2 10-20.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 number and 1 abbreviation.**
  - Give the exact population, outcome, arm, comparator and status. Name the drug, not "GLP-1s".
  - In every comparison, put the drug or group name next to each number, side-effect rates included. Tie top-dose figures to "top dose". (About 8 pieces.)
  - No clipped forms ("72-wk", "HF", "GI").
  - A committee recommendation or a filing plan is not "approval". An old approval is not "now" or "new".
  - (About 32 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, hashtags included.**
  - Draft Threads bodies to about 300 characters and count after the safety lines are in. Cut a clause, never a safety line.
  - (Threads ran over in about 28 pieces, every batch since 10-13, and all 4 on 10-20.)
- **Copy facts, qualifiers and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "self-reported", "numerically", "average", "averages, not predictions", "subgroup", "mostly mild to moderate", the hospital-stay criteria, the full population, dated statuses with the year, and who said it.
  - Never add stronger or causal words, or market or news claims. Never put our own conclusion right after a line credited to a source.
  - (About 125 findings, in every GLP-1 batch.)
- **Put the hedge, the scope and the population in the first line of every caption, before the fold.** (About 8 times since 10-16, including S1 and S2 10-20.)
  - Engagement lines and pinned comments ask people to save or share only. No open questions. (About 9, including Instagram and Facebook in S1 10-20.)
  - **No emoji anywhere in a post that mentions side effects, safety or gray-market products.** (6 pieces since 10-14.)
  - No hashtags that imply an unproven use or the wrong product: no #WeightLoss, and no #Mounjaro or #Zepbound on posts about compounded products or recalls (S1 10-20).

### Everyone
- **State the trial population and the exact drug everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1 and the retatrutide Phase 2 and TRIUMPH trials:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **SUMMIT:** HFpEF (EF ≥ 50%) with obesity.
  - **SURMOUNT-OSA:** moderate-to-severe OSA in adults with obesity.
  - **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease. Its subgroup is "self-reported past heart failure".
  - Surgery cohorts keep their entry criteria.
  - A boxed warning belongs to its own drug. Only semaglutide and orforglipron are pills.
  - (About 30 findings.)
- **Credit every line to whoever actually said it, and date it with day, month and year.**
  - A reporter's description is not the company's statement.
  - Every status names the regulator and the date ("not FDA-approved as of Oct 2026") and is cited to a source dated at or near that date, never to an old trial paper.
  - EU steps: "CHMP recommended… Commission decision pending".
  - (6 holds plus 3 status holds. Plague, if a slot returns: results are "presumptive", use CDC's exact cure line and include every dated development.)
- **Every source tag must actually say the line it's attached to.** Our own tips, safety advice, analogies and conclusions get no tag. (About 78 findings, including S1, S2 and C1 10-20.)
- **Every benefit comes with its common side effects, and every tip keeps its safety caveat, in every field.**
  - Fluids: "unless you've been told to limit fluids". Protein: check first if you have kidney disease. Exercise: start gently.
  - Comparison, supplement and coverage posts carry "don't switch, stop or change your current medicines on your own".
  - Gray-market and unapproved-drug posts point to a prescriber about *approved options or trials*.
  - (About 20 findings.)
- **Keep the source list clean.**
  - Use the final canonical primary URL: no DOI or linkinghub redirect, no search or landing pages, no node, AMP, 403 or 404 pages, no reposts. A paywalled page is OK only if another listed source confirms it.
  - Use the exact published title. Label online-first and print dates, and give the last-reviewed date on living pages.
  - List only sources a scene actually cites.
  - (About 82 findings.)

_Updated 2026-10-20 from 69 QA records (40 GLP-1, 29 plague)._

_Updated 2026-10-20 from 69 QA records._
