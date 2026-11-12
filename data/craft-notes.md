_Based on 51 QA records from 2026-10-30 to 2026-11-12: 33 Shorts, 15 long-forms and 3 carousels, all on GLP-1. **6 didn't ship:** 5 were held, and 1 long-form (L1 10-30) failed before render._

_**New since the last pass:** 4 records from 11-12.
- **S2 11-12 was held.** Its last two scenes had no audible narration, so the safety, Exp F and closing lines were missing from the audio. Narration WER was 0.43 and masking 0.697. This is a new kind of hold.
- **L1 11-12 (alcohol) shipped.** It had 21 tiny labels and 15 bottom tags pushed off-screen, and no chapters.
- **S1 and S3 11-12** repeat old problems: broken caption cards, numbers spelled out as words, line 1 of the description filled in, a #HeartRate trend tag, and Threads over the limit._

_**Why items didn't ship:**
- Audio caused 3 holds: L1 11-11 (masking 0.022, "of the day" in the narration, and a cut-off description), S2 11-11 (masking 0.061) and S2 11-12 (no voice in the last 2 scenes).
- Beat drift after render caused 2 holds: L1 11-09 and L1 11-10.
- A source credited with a line it doesn't say caused 1 failure: L1 10-30.
- The L1 10-29 and S1 10-29 holds are now outside the 2-week window._

_**Correction:** the Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09 (including L1 11-02 and L1 11-05) came from a QA bug. Frames were shown out of order, and the published videos were in sync. Those findings aren't counted. Only the automatic beat-sync gate counts. **Out of date:** the Shorts limit is now 160 spoken words. Ignore any finding that says 170 words or 90 s._

### Motion Designer
- **Measure masking last, on the final file, and never hand off a mix above 0.02.** Audio is still the #1 cause of holds: 3 holds plus 5 that shipped above 0.02 (0.026–0.037). 6 of those 8 were the 13:00 S2 slot, so check S2 twice. The gate let 0.028 through on S1 11-11, so take your own reading. Duck music under all narration, keep sound effects off spoken numbers and names, and re-measure after any re-render.
- **Make sure every scene has voice right to the end, then compare a speech-to-text transcript with the script.** Check that each scene's audio exists and runs as long as its narration, especially the last safety and closing scenes. S2 11-12 was held because its last 2 scenes were silent. Then compare every number, "point", "about", unit and drug name, and look for extra words. Errors so far: "of the day", "tears of petide", "mg" read as "milligrams", a dropped "point", an extra "the". Regenerate any scene that fails before you mix. (2 holds, 6 pieces.)
- **Long-forms: check beat sync on the render, not the plan.** In both holds the plan was clean (69/72 and 74/74 beats on time), but only 83–86% of cuts landed on time after render. Take every cut time from the final narration's word timestamps, never reuse shot lengths from the plan, and fix any cut more than 0.5 s off before you submit. (2 holds.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers, years and codes must match the stat pill exactly ("126", "6.4", "1,032", "575", "2026", "15–20 g", "25–29%", "8%", "<6%", "GLP-1", "MEN 2", "NAION", "B12"). Before render, search the captions for:
  - number words: HUNDRED, THOUSAND, POINT, PERCENT, TWENTY TWENTY, spelled-out numbers
  - spaced or hyphenated letters ("F D A", "M-T-C")
  - pronunciation spellings ("DEG-LOO-DEK", "REH-TAH-TROO-TIDE", "NAY-ON", "SULFONYL UREA")

  (Wrong or split numbers in about 13 Shorts, latest S3 11-12. Pronunciation spellings caused 5 subtitle-mismatch flags, latest S2 11-12.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Clear the previous card, tags and bubbles completely (ghost text in 4 Shorts).
  - Never split a word, number, code or trial name across cards or lines ("SEVENTY-/SIX", "GLP-/1", "TYPE / TWO DIABETES", "SEVEN / IN TEN").
  - Never end a card on a comma, dash, colon, THE, A, CAN, MAY, WON'T, NOT, DOESN'T, BEEN, a preposition, POINT, TYPE or a bare number.
  - Keep each stat sentence on one card, and give each list item its own card. The Exp F line ("…QUESTION FROM THE") and the prescriber line break most often.

  (Broken cards in nearly every Short. S1 11-12 had a 3-line card.)
- **Keep every tag inside the frame, off the caption, and at least ~40px.**
  - Shorts: keep tags, chips and bubbles above y 1150, show at most 2 at once, and drop any tag that repeats the caption. Body-part tags (Stomach, Kidneys, Blood sugar, Pancreas) collide most. Never put stat numbers over heads.
  - Long-forms: keep the bottom of every tag at y 1000 or less. Name tags, chips and labels at the bottom keep clipping past y 1080 ("Priya", "Sam, 47", "Study 1", "Vomiting", "15 mg"). Labels and checklist items keep rendering at 22–26px.
  - Render every chip the shot list asks for (missing in 7 pieces).

  (About 300 overlap findings in Shorts. In long-forms, about 220 tiny-text and 190 off-screen findings, with 21 and 15 in L1 11-12.)
- **Fill every frame and delete every placeholder.** Each frame needs a headline plus a labelled hero covering at least ~25% of it. Document, label and doctor beats on a plain gradient are usually the empty ones (about 170 near-empty findings in long-forms, and document beats in S1 and S2 11-12). The pantry/shelf backdrop, the rounded cabinet strips and the dashed boxes are banned in Shorts too (5 pieces since 11-10, latest S2 11-12). Never put the starfield on a body beat (6 pieces). Match the backdrop to the mood: night → night room, brand → teal gradient, clinic → clinic. Delete ghost bubbles, hanging ornament circles, cropped decorative shapes and debug marks.
- **Draw people as whole characters with a neck and shoulders, and keep each named character the same throughout.** No floating heads, blobs or donut and ring mascots (about 15 pieces, latest S2 and S3 11-12). Dana's skin and hair changed between shots in L1 11-11.
- **Make the mascot and its bubble agree with the line.** On risk, "not approved" and caveat lines, use a calm, neutral mascot: no smiles, green checks, "Phew", sweating or crying. Never show a bubble that contradicts the caption (S2 11-11 showed "Not for sleep apnea yet" next to "APPROVED FOR SLEEP APNEA"). (About 8 pieces.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words.** Tight is 90–120 words, standard is 135–160, counting the safety, Exp F and closing lines. Count the words yourself, because post notes have been wrong (one said 170 when the script had 172). End with "Full breakdown on our channel, link in the description." Until 11-17, 08:00 and 13:00 Shorts put the Exp F subscribe line just before it. Long-forms end with "There's a video I'd watch next, linked in the description." (3 Shorts over 170 words, 2 missing their ending lines.)
- **Speak every safety line and also write it in full in the on-screen field.**
  - Order: the don't-switch/stop/change line, then "Not personal advice", then the prescriber line last.
  - An emergency card names its trigger and keeps "right away" (for example, possible pancreatitis → stop and call your healthcare provider right away). Then scope the don't-stop line: "For anything that isn't one of those emergency signs…".
  - For unapproved drugs or uses, write "isn't approved" with no "yet".

  (About 7 pieces.)
- **Write narration exactly as it should be spoken, and don't date evergreen pieces.**
  - Write numbers and units as words, and give each decimal its own short sentence.
  - Pronunciation spellings go in the narration only, and only when the voice gets the word wrong.
  - Never use "now", "this week", "new", "this flu season" or holiday dates (5 pieces).
  - Help lines cover all four markets, or say "your local urgent care or emergency number". For chest pain or fainting, the emergency number comes first.
- **Check every count against the source's own unit (cases, participants or trials).** Each number names its measure, drug and arm, comparator, group sizes and timeframe. Give dose ranges as ranges across doses, and round conservatively ("seven in ten", not "three in four", when the doses differ). (About 35 findings.)
- **Keep each finding at its source's exact scope, verb and urgency, including in recaps.** Observational results are "linked to". Randomized results are "compared with placebo". Keep "may", "potential", "rare", "post-marketing" and "won't settle". Never add "most", "many", "that's why" or "similar". (1 failure: L1 10-30. About 50 findings.)
- **Run the muted-viewer test both ways, starting with the opening card.** On-screen text is never stronger or scarier than the narration, and every reason the narration gives also appears on screen. Every stat card names the drug and dose, both groups, the population and the timeframe. The opening card names who the result applies to. (About 50 findings, including all three 11-12 Shorts.)

### Carousel Designer
- **Carousels stay stopped.** If the scheduler asks for one, reuse verified Short text only, use generic drug hashtags (no #Zepbound, #PenDay, #GLP1Journey or #ColdAndFluSeason), don't date the hook, and end on the exact disclaimer plus prescriber line. (All 3 carousels had findings.)

### Social Copywriter & packaging
- **YouTube descriptions are viewer copy only, finished, and 1,250 characters or fewer before the link.** Line 1 stays empty for the ▶ Watch next link on Shorts and long-forms alike. Then: a quick answer of 3 lines or fewer, the safety block, 1–4 sources, chapters, hashtags. Never put an internal note in the field (L1 11-06 was major). Trim "What you'll learn" and the source labels first. (5 long-forms over the limit. Line 1 filled in 6 pieces, latest S1 and S3 11-12. Shorts with no sources: 2.)
- **Never hand off a broken or partial description (this contributed to a hold).** Re-read the whole field to its last character. Chapters: one per script section, starting at 00:00, with real timestamps that include the checklist and when-to-get-help sections. If the timings aren't final, leave the chapter block out and say so in the post notes. Never use "MM:SS". (L1 11-11 was cut off mid-word and held. L2 11-10 had placeholder chapters. L1 11-05 and L1 11-12 had no chapters and no note.)
- **Every caption field and description ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you." Nothing comes after it.** Hashtags and the don't-stop line go before it. Copy safety and pinned-comment lines word for word from the script, with the emergency scoping, "right away" and "with or without vomiting". Write "medicines", never "meds", and never paraphrase as "Otherwise, …". (L2 11-10 had no disclaimer, major. 5 had hashtags or the don't-stop line after the disclaimer. Pinned-comment findings in 4 long-forms.)
- **Threads stays at about 300 characters, counting the safety lines.** Write it last, and cut a clause, never a safety line. If the safety lines alone come to about 300 or more, keep them and cut the post down to one short fact. (Over in about 30 pieces, in every batch.)
- **Copy facts, qualifiers, populations and attributions word for word from the verified script.** That includes "on average", "all doses combined", "small trial", "not yet peer-reviewed", "post-marketing", "the label says", the insulin/sulfonylurea caveat and the full trial population. Our own caveats get their own sentence, never after a source tag. TikTok has room for the emergency line and the caveats, so keep them. (About 115 findings, in every batch.)
- **Titles, thumbnails and first lines keep the hedge, scope and population, and engagement stays safe.**
  - Keep "possible", "may" and "linked to".
  - The thumbnail never reuses the title's words, and the video must pay off what the thumbnail promises.
  - Don't call data older than ~3 months "new", and never use "Approved yet?" or "Approved Anywhere?".
  - Engagement lines ask people to save or share only, once, never with an open question (4 pieces).
  - Hashtag only generic names of drugs whose own data the post reports. No brand tags and no trend tags (#guthealth, #MetabolicHealth, #WeightManagement, #HeartRate).

  (About 35 pieces.)

### Everyone
- **Give every result the exact drug scope and trial population it came from.**
  - Class studies say "GLP-1 medicines", and tirzepatide trials stay "tirzepatide".
  - No diabetes: SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1 and the retatrutide obesity trials.
  - Type 2 diabetes: SURPASS and the Mounjaro label trials (including the GI-side-effect and weight analysis). SURPASS-2 is also open-label, against semaglutide 1 mg.
  - About 25% of ATTAIN-J had type 2 diabetes.
  - Zepbound pooled data: Study 1 excluded type 2 diabetes, and Study 2 enrolled only people with it.
  - The resistance-training RCT enrolled men and postmenopausal women aged 50–70 without diabetes, compared with usual activity, and its results are averages.

  Key numbers:
  - SURMOUNT-4 randomized 335 vs 335, with +14.0% regain, and placebo still ended 9.9% below starting weight.
  - Hair loss: 5.4% vs 0.9% (women 7.1% vs men 0.5%; on placebo 1.3% vs 0%).
  - Injection-site reactions: 6–8% by dose vs about 2% on placebo. Serious allergic reactions are post-marketing reports.
  - Oral contraceptives: the label says "may reduce the efficacy" for 4 weeks after starting and after each dose increase.
  - For semaglutide, name the dose (Wegovy 7.2 mg was approved in March 2026).
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag, and only exact printed words go in quotes. If the IFU or Medication Guide text won't load, paraphrase without quotes.
  - The low-blood-sugar figure is in the Zepbound label.
  - The July 2023 review was EMA PRAC's.
  - Name both NANOS and the AAO.
  - The NHS's "more at risk" isn't "more likely".

  (1 failure: L1 10-30. About 65 findings.)
- **Keep the source list clean.** Fetch every URL first. Reject 402, 403 and 404 responses, login redirects, newsroom pages, search-query pages and DOI redirects. Use the PubMed record for paywalled journals. The Medication Guide and the IFU each get their own working URL, not a PI anchor (6 pieces). Every entry carries its live revised or reviewed date, never just a year. Known dates: Zepbound PI 28 Aug 2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023. (About 27 findings.)

_Updated 2026-11-12 from 51 QA records (all GLP-1, 10-30 to 11-12)._

_Updated 2026-11-12 from 51 QA records._
