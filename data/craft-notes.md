_Based on 69 QA records from 2026-10-08 to 2026-10-21: 39 Shorts, 17 long-forms and 13 carousels. 45 are GLP-1 (10-13 to 10-21) and 24 are plague (10-08 to 10-12). 11 were held and 2 failed before render (L3 10-10 and L1 10-12)._

_New on 10-21 (5 GLP-1 pieces). **2 of the 3 Shorts were held for audio masking** (S2 and S3, both at 0.034). These are the first holds since 10-16. Every rule below still applies. Problems that came back on 10-21:_
- _**Audio:** 0.034 is the same value that shipped on S1 10-19. The default music level is too loud._
- _**Captions:** every Short spelled out numbers ("OCTOBER EIGHTH", "TWENTY TWENTY-SIX", "TWENTY-FIVE PERCENT", "THIRTY-SIX TOOK PLACEBO") and split them into fragments. One card ended on an open quote mark (S1)._
- _**Long-form L1:** dashed placeholder shelves were left in. The "Sam" name tag was cropped. A "4 groups" headline showed only 3 characters. A speech bubble was nearly invisible. A brown, coiled fiber mascot looked like a poop emoji._
- _**Facts:** a group size was described beyond what the source says, and a single-dose trial was called "top trial dose" (major, S2). "All doses combined" was dropped (S3). Two surgery-cohort caveats were missing (C1). Our own tips were tagged to the joint advisory (L1)._
- _**Packaging:** the CTA linked to the channel home page instead of the video (S3). Sources linked to an FDA index page (S1). A recall Short had no "not personal advice" line (S1). Threads ran over in 3 posts. TikTok opened with hashtags or put the hedge after the results._

_Why items were held (in this window):_
- _**5 for crediting a claim to the wrong body, person, page or date:** S1 10-08, L1 10-09, L1 10-10, L3 10-10 (failed), S3 10-14._
- _**3 for voice masked by music:** S3 10-16, S2 10-21, S3 10-21._
- _**3 for a status that was incomplete or too reassuring:** S1 10-09, L2 10-10, S3 10-12._
- _**2 for scope errors or unsourced claims:** S3 10-08 (wrong vaccine), L1 10-12 (failed)._
- _**Also cited in holds:** a broken YouTube description (L1 10-09) and a misspelling (S3 10-14)._
- _The 90 s hold reason (S1 10-08) is out of date. The limit is now 178 s._

### Motion Designer
- **Audio: the voice always wins. Masking must be 0.02 or lower in the final mix, before render.** Above 0.03 is an automatic drop.
  - Lower the default music bed now. 0.034 keeps coming back, which points to a template level.
  - Duck the music under all narration, and never put a sound effect under a spoken number or drug name.
  - Re-measure after every remix.
  - (3 holds: S3 10-16 at 0.07, S2 and S3 10-21 at 0.034. S1 10-19 shipped at 0.034. S3 10-20 was 0.029, S1 10-18 0.028 and S3 10-12 0.025.)
- **Every caption card ends where a clause or a full noun phrase ends. It fits in 2 lines or fewer, and only one card is on screen at a time.**
  - Never end a card on a comma, dash, colon, open quote mark, article, auxiliary, negation, preposition, conjunction, question word, relative pronoun, possessive, bare number, or bare verb or adjective. Examples: THE, A, BE, DOES, CAN, NOT, WEREN'T, OR, WHO, WHOSE, ABOUT, PLUS, POINT, FDA'S, STICK, ESTIMATED. If a card ends on one of these, merge it with the next card.
  - Never split a fixed phrase or trial name across cards ("NOT CONFIRMED", "OVERWEIGHT PLUS A RELATED CONDITION", "HEAD-TO-HEAD", "ELECTIVE SURGERY", "OBSTRUCTIVE SLEEP APNEA", "REDEFINE 1"). Keep quoted names whole ("MOUNJARO" recall).
  - (Fragments in about 37 of 39 Shorts, every Short from 10-08 to 10-21. A stranded "NOT" or "WEREN'T" flipped the meaning, or risked flipping it, 4 times.)
- **Build caption text from the script's on-screen numerals, never from the spoken transcript.** Every number, dose, count, year and date must match its stat pill exactly and stay on one card.
  - Write "64 vials", "15 mg", "630", "25%", "36", "Oct 8", "2026", "Q1 2027".
  - Before render, search the captions for number words (ZERO–NINETY, HUNDRED, THOUSAND, POINT, PERCENT, MILLIGRAM, TWENTY TWENTY, FIRST–THIRTIETH) and fix every hit.
  - (About 30 Shorts, including every Short from 10-18 to 10-21. The wrong number reached the screen 7 times.)
- **Shorts: tags, name labels and speech bubbles go only in the top 60% of the frame (y ≤ 1150 on 1920), above the character, never at its feet or under a pill or syringe.** Fade each tag out before the next caption appears; if it can't be cleared in time, cut it.
  - Repeat offenders: drug-name tags under pill faces, and "Stomach", "Heart", "Gut", "Digestive system", "Lean mass", "Body scan", "Fat cell", "HbA1c", "Type 2 diabetes", "Sterile" and "Compounding pharmacy".
  - (About 210 overlap findings across 36 of 39 Shorts.)
- **Make all text at least ~40px on a 1080 frame, and every speech bubble fully opaque, or drop it.** (About 270 tiny-text findings across all 15 rendered long-forms, including 14 in L1 10-21. A near-invisible bubble appeared in L1 10-21.)
- **Keep everything inside the safe frame (y ≤ 994 on 1080, y ≤ 1766 on 1920, with 5% margins) and off the hero art.**
  - Name tags go above characters, never under their feet. Each tag gets its own space so tags never merge ("SemaglutideTirzepatide").
  - Name tags were cropped at the bottom edge in L1 10-14, 10-17, 10-18, 10-20 and 10-21 ("Dana, 47", "Sam").
  - Never crop a head, mascot, icon, pill or syringe at the frame edge.
  - Stat titles and subheads go on plain sky, gradient or a solid card, never on characters, factories or busy art. (On-hero findings in 8 Shorts, most recently S2 10-21.)
  - (About 185 off-screen findings.)
- **From its first frame, every frame needs a headline plus a labelled hero character or scene covering at least ~25% of the frame.**
  - Never open on, hold on or end on bare stat text, a lone icon, chips only, or a room with props but no character.
  - Label every large shape and spell out jargon chips such as "AHI".
  - If the headline gives a count, show that many items ("4 groups" needs 4 characters).
  - **Before render, delete empty "–" placeholder chips, dashed shelves and stray template UI.** (About 9 times, most recently L1 10-19, C1 10-20 and L1 10-21.)
  - (About 140 sparse findings in long-form.)
- **Mascots must read as friendly and whole.**
  - No disembodied heads or eyes, no faces buried in body parts.
  - No brown, coiled or blob shapes for food or fiber (they read as a poop emoji).
  - No scared or sweating organs on positive-framed topics.
  - (L1 10-10, S2 10-13, S2 10-15, S1 10-21, L1 10-21.)
- **Long-form: one shot = one scripted beat. This is still the most damaging visual bug.**
  - Before render, compare each shot's on-screen title and chips with the scripted beat at that timestamp.
  - If a run of shots shows cards from about 230–300 s later, the shot-to-beat timing table is offset: fix the mapping for the whole run, not shot by shot.
  - Clear chips when the beat changes.
  - Confirm the required disclaimer and prescriber card is on screen at its scripted beat.
  - (About 9 long-forms, including L1 10-17 and L1 10-20, where shots 7–16 were offset and the disclaimer card was lost. L1 10-21 left a stale chip on screen.)

### Scriptwriters
- **The narration text must be exactly what is spoken, word for word, written the way it is said.**
  - Write "versus", not "vs". Spell out symbols and units in the narration; the numerals go in on_screen_text.
  - Use no merged or phonetic words ("redefinedfor", "achievthree", "aonec"). Write ordinals and years the way they're spoken ("twentieth" in S2 10-21).
  - No leftover draft phrases: "hunter's appetite" was in the script but the voice said "on tirzepatide" (S3 10-21).
  - Spell drug, company and trial names correctly ("rita trutide" in L1 10-19).
  - (Mismatches in about 12 pieces. Misspelling hold: S3 10-14.)
- **Shorts: 170 words or fewer, counting the status line and the prescriber line. Cut a beat rather than run long.** (About 14 Shorts went over.)
- **Every number carries all of these in the narration, not only on screen:**
  - what it measures;
  - the arm or dose and the exact comparator. Say "the top trial dose" only if the trial had more than one dose (REDEFINE 1 tested one CagriSema dose); say "all doses combined" for pooled arms (124 versus 36);
  - each group's size, described exactly as the source describes it. Never infer which arms a count covers (major in S2 10-21; 537 in S3 10-20);
  - the timeframe;
  - which estimand it is: "everyone randomized", "while on treatment" or "adjusted";
  - an absolute rate next to any relative figure, labelled "relative";
  - the source's exact figure, correctly rounded.
  - (About 36 findings.)
- **Keep every finding at its source's exact scope and verb.**
  - Matched or observational analyses: "linked to". Guideline habits: "recommended". Label wording: "tolerated". FDA's wording: "verify".
  - Never add scope ("from any cause", "not diabetes", "on queasy days" when the advisory says "the first few days of treatment"). Never narrow it ("gastrointestinal" is not "stomach").
  - Low responders are "smaller", not "slower". Never state our own assumption as fact.
  - (3 holds or fails, plus about 10 more since 10-19.)
- **Muted-viewer test: on-screen text is never stronger, broader or more reassuring than the narration.**
  - Every stat card names the drug and dose, the comparator, the population, the measure, the timeframe and the estimand.
  - Spoken side-effect lines also appear on screen.
  - Not proven is not the same as disproven.
  - (About 20 findings, including 1 hold.)
- **The hook and the title pay off exactly, in the order promised.**
  - Only name a video in the CTA if it is already published, and give its exact title. Otherwise say "follow for more".
  - (Hook mismatches: S1 10-15, S1 10-16, C1 10-18, C1 10-19. CTA problems: S1 10-13, S3 10-15, S2 10-20, S3 10-21.)

### Carousel Designer
- **Every stat or cell says what it counts, for whom, against what and when, and keeps the source's hedge, exact verb and scope.**
  - Split any N into its groups (C1 10-17, C1 10-20).
  - Label adjusted odds ratios "adjusted" (C1 10-21). Give every result its timepoint, and use the same population wording on every slide.
  - Call subgroup comparisons "subgroup averages, not head-to-head".
  - Only the exact printed words go inside quote marks.
  - No placeholder cells. Avoid wording that can be misread.
  - The title and hook promise no more than the slides deliver.
  - The last slide carries the disclaimer and the prescriber line.
  - (About 41 findings.)

### Social Copywriter & packaging
- **YouTube description: plain text. Aim for 1,400 characters or fewer measured after assembly (hard limit 1,500), and end on a complete line.**
  - Strict order:
    1. If a Short's CTA names a long-form, line 1 is **that video's own URL**, never the channel home page (S3 10-21).
    2. A quick answer of **3 lines or fewer** that carries one named common side effect, any dated status and its caveat.
    3. The disclaimer plus the prescriber line.
    4. Up to 4 sources as **clickable canonical URLs**, always present.
    5. Chapters.
  - No hashtags before the disclaimer. If it runs long, cut chapters first, then the last source.
  - (1 hold. Quick answer too long in about 17 pieces. Sources missing in S2 10-13, S1 10-20 and S2 10-20.)
- **Titles, thumbnails and captions: 100 characters or fewer, at most 1 number and 1 abbreviation.**
  - Give the exact population, outcome, arm, comparator and status. Name the drug, not "GLP-1s".
  - In every comparison, put the drug or group name next to each number.
  - No clipped forms ("72-wk", "HF", "GI").
  - A committee recommendation or a filing plan is not "approval". An old approval is not "now" or "new".
  - (About 32 findings.)
- **Every field ends with the disclaimer plus the full line "talk to your doctor or prescriber about whether it's right for you". Nothing comes after it, hashtags included.**
  - Draft Threads bodies to about 300 characters and count after the safety lines are in. Cut a clause, never a safety line.
  - (Threads ran over in about 31 pieces, every GLP-1 batch since 10-13.)
- **Copy facts, qualifiers, dates and attributions word for word from the verified script, and add nothing that isn't in it.**
  - Keep "estimated", "self-reported", "numerically", "average", "all doses combined", "subgroup", "mostly mild to moderate", the hospital-stay criteria, the full population, dated statuses with the year, and who said it.
  - Never add stronger or causal words, market claims, or "save this" promises the post doesn't deliver (S1 10-21).
  - (About 130 findings, in every GLP-1 batch.)
- **The first line of every caption carries the hedge, the scope and the population, before the fold. TikTok never opens with hashtags.** (About 11 times since 10-16, including C1 and S2 10-21.)
  - Engagement lines and pinned comments ask people to save or share only. No open questions.
  - No emoji in posts about side effects, safety or gray-market products.
  - No #WeightLoss. No #Mounjaro or #Zepbound on posts about compounded products.

### Everyone
- **State the trial population and the exact drug everywhere.**
  - **SURMOUNT-1, SURMOUNT-5, STEP 1, ATTAIN-1, REDEFINE 1 and the retatrutide Phase 2 and TRIUMPH trials:** obesity, or overweight with a weight-related condition, without diabetes. TRIUMPH-2 is the type 2 diabetes trial.
  - **SELECT:** heart disease plus overweight/obesity, without diabetes.
  - **SUMMIT:** HFpEF (EF ≥ 50%) with obesity.
  - **SURMOUNT-OSA:** moderate-to-severe OSA in adults with obesity.
  - **SURPASS-CVOT:** type 2 diabetes with heart or blood-vessel disease. Its subgroup is "self-reported past heart failure".
  - **The 2.03M surgery cohort:** matched groups, surgery over 1 hour, at least 24 h in hospital, "major" heart complications. Always add that it didn't assess continuing versus withholding the medicine before surgery (S2 10-19, C1 10-21).
  - A boxed warning belongs to its own drug. Only semaglutide and orforglipron are pills.
  - (About 33 findings.)
- **Credit every line to whoever actually said it, and date it with day, month and year.**
  - A reporter's description is not the company's statement.
  - Every status names the regulator and the date and is cited to a source dated at or near that date.
  - EU steps: "CHMP recommended… Commission decision pending".
  - (5 holds plus 3 status holds. Plague, if a slot returns: results are "presumptive", and include every dated development.)
- **Every source tag must actually say the line it's attached to.** Our own tips, safety advice, analogies and conclusions get no tag.
  - The joint GLP-1 advisory does not say "protein at each meal", "eat slowly" or "sip fluids through the day". Those are our tips, so leave them untagged.
  - (About 82 findings, including L1 10-16, S1 10-16 and L1 10-21.)
- **Every piece shows and says "Not personal advice", plus the prescriber line, recall and safety Shorts included.** (S1 10-21, and the disclaimer card lost in L1 10-20.)
  - Every benefit comes with its common side effects, and every tip keeps its safety caveat (fluids, kidney disease for protein, start exercise gently).
  - Comparison, supplement and coverage posts say "don't switch, stop or change your current medicines on your own".
  - Gray-market posts point to a prescriber about approved options or trials.
  - (About 22 findings.)
- **Keep the source list clean.**
  - Use the final canonical URL of the specific record (for example the openFDA recall record), never an index, search or landing page (S1 10-20, S1 10-21).
  - No DOI or linkinghub redirects, no node, AMP, 403 or 404 pages.
  - Use the exact published title. Label online-first and print dates, and give the last-reviewed date on living pages.
  - List only sources a scene cites.
  - (About 85 findings.)

_Updated 2026-10-21 from 69 QA records (45 GLP-1, 24 plague)._

_Updated 2026-10-21 from 69 QA records._
