_Based on 52 QA records from 2026-11-02 to 2026-11-15: 33 Shorts, 16 long-forms and 3 carousels, all on GLP-1. **8 were held or failed.**_

_**New since the last pass:** 4 records from 11-15 (L1 Keeping Results, S1 Pen Out of the Fridge, S2 EloraTZP, S3 Scale After Stopping). None was held, but they repeat old problems:
- **L1 11-15 shipped with masking at 0.022.** That is the 3rd long-form over 0.02, and the gate let it through.
- L1 11-15 also had the cabinet-strip backdrop, a floating-head lead, a "Placebo group" tag clipped past y 1080, labels at 23–24px, a pinned comment that shortened SURMOUNT-4's population to "adults", and chapters with no entry for the final checklist section.
- S2 11-15 got a subtitle flag for spelling out numbers ("FOURTEEN POINT EIGHT"). S3 11-15 broke the closing card again and split "SIDE / EFFECTS" across cards.
- S1 11-15 was the cleanest Short so far (0 weak shots), but its opening card didn't name the drug.
- No new cut-off descriptions._

_**Why items didn't ship (unchanged):**
- Audio: 4 holds (L1 11-11, S2 11-11, S2 11-12, S2 11-13).
- Beat drift after render: 3 holds (L1 11-09, 11-10, 11-14).
- Sources: 1 fact-check failure (L2 11-14, where the "Medication Guide" URL was really the PI).
- Description: L1 11-11 was cut off, and L2 11-10 and L3 11-14 got packaging REVISEs._

_**Correction (still applies):** ignore the Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09 (L1 11-02, 11-05, 11-06). They came from a QA bug that showed frames in the wrong order. Those videos were in sync and the disclaimer was on screen. Only the automatic beat-sync gate counts. **Out of date:** ignore any finding that cites a 170-word or 90 s Shorts limit. The limit is 160 spoken words._

### Motion Designer
- **Measure masking last, on the final file, in every format, and never hand off anything above 0.02.** 11 pieces went over: 7 S2 (13:00) Shorts and 3 long-forms (L1 11-11 at 0.022, L1 11-14 at 0.026, L1 11-15 at 0.022, which shipped). This caused 4 holds.
  - Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line. That sank S2 11-13.
  - Duck the music under all narration and re-measure after every re-render.
  - Take your own reading and don't rely on the gate. It let through 0.028 (S1 11-11) and 0.022 (L1 11-15).
- **Long-forms: check beat sync on the render, not the plan.** All 3 beat-drift holds had plans at 96–100% on time but renders at only 83–88%.
  - Re-time every cut from the final word timestamps, after the final narration and after any scene is regenerated.
  - Measure each beat's offset in the rendered file and fix any cut more than 0.5 s off before you submit. (3 holds, latest L1 11-14.)
- **Check that every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.**
  - Check every "point", number, unit and drug name, and look for extra or missing words.
  - Seen so far: "point" dropped (L1 11-02, L1 11-13), "tears of petide", "mg" spoken for "milligrams", an extra "the", "of the day", and 2 silent closing scenes.
  - Regenerate any scene that fails before you mix. (4 holds, 9 pieces.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers must match the stat pill exactly ("7.1%", "14.8%", "+14%", "25–29%", "<6%", "72", "1,032", "15–20 g").
  - Before render, search the captions for number words: POINT, PERCENT, HUNDRED, THOUSAND, TWENTY TWENTY, FOURTEEN, SEVENTY-…
  - Also search for spaced-out letters ("M T C") and pronunciation spellings ("NAY-ON", "SULFONYL UREA", "OR FOR GLIP RON", "REH TAH TROO TIDE").
  - (Spelled-out numbers in about 19 Shorts, latest S2 and S3 11-15. Subtitle checks flagged these 4 times, latest S2 11-15.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, tags and bubbles before the next one appears. Tags still show through the caption pill (S2 11-15).
  - Never split a word, number or phrase across cards ("SEVENTY-/TWO", "GLP-/1", "TYPE / TWO DIABETES", "WEIGHT / LOSS", "SIDE / EFFECTS").
  - Never end a card on a comma, dash, colon, THE, A, ABOUT, MAY, WON'T, DOESN'T, BEEN, POINT, TYPE or a bare number.
  - Use these fixed cards word for word:
    - Content dates up to 2026-11-16 only: Exp F line "WE ANSWER ONE TIRZEPATIDE QUESTION" / "FROM THE RESEARCH EVERY DAY." / "SUBSCRIBE IF THAT HELPS." and closing line "FULL BREAKDOWN ON OUR CHANNEL." / "LINK IN THE DESCRIPTION."
    - From content date 2026-11-17: no Exp F card and no link card in Shorts (links in Shorts descriptions cannot be clicked). The last card is the task's last line: a loop back into sentence 1, or "THE FULL VIDEO IS ON OUR CHANNEL." for a spin-off.
  - (The Exp F card broke in 5 Shorts and the closing card in 6, latest S3 11-15. Broken cards show up in nearly every Short.)
- **Keep every tag inside the frame, off the caption, and at least ~40px.**
  - Shorts: keep tags above y 1150, show at most 2 at once, and drop any tag that repeats the caption.
  - Long-forms: the bottom of every tag stays at y 1000 or less. Name, group and dose tags keep clipping past y 1080: "Sam, 47", "Study 1", "Gut", "15 mg", "Placebo group" (L1 11-15). Labels keep rendering at 22–26px.
  - Render every chip the shot list asks for.
  - (About 325 overlap findings in Shorts. In long-forms, about 230 tiny-text and 215 off-screen findings.)
- **Never use the rounded teal or green "cabinet strip" backdrop, the hanging grey or orange ornament circles, or a starfield on a body beat.**
  - Match the backdrop to the mood: night → night room, brand → teal gradient, clinic → clinic, body → body backdrop.
  - (Cabinet strips in 12 pieces since 11-10, latest L1 11-15. Starfield on body beats in 8 pieces.)
- **Draw people as whole characters with a neck and shoulders, and keep each named character looking the same throughout. Fill every frame.**
  - No floating heads, rings, donuts or blobs as the main character, and no shapes or mascots perched on a person. Ring shapes appeared in 7 pieces, latest L1 and S3 11-15.
  - On risk, "aren't approved" and caveat lines, use a calm, neutral mascot: no smiles, no green checks, no sweating or crying.
  - Each frame needs a headline plus a labelled hero covering at least ~25% of it. Document and doctor beats on a plain gradient are the usual empty ones: put the stat on the document and add a character.
  - No blank frames, empty speech bubbles, cropped shapes or debug marks.
  - (About 170 near-empty findings in long-forms. About 25 character findings.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words. Count every safety and closing line yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160 words.
  - Closing order up to content date 2026-11-16: the don't-switch/stop/change line → "Not personal advice" → the prescriber line → the Exp F line (08:00 and 13:00 only) → "Full breakdown on our channel, link in the description."
  - From content date 2026-11-17 (owner OK 2026-11-12): one short safety line ("Not personal advice, so ask your prescriber."), plus the emergency and don't-stop lines when the topic needs them, then the task's last line (a loop into sentence 1, or "The full video is on our channel." for a spin-off). Never "link in the description" in a Short.
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - (Closing lines missing or out of order in 4 Shorts.)
- **Speak every safety line and also write it in full in the on-screen field. Copy these fixed lines exactly.**
  - An emergency line names its trigger and keeps "right away".
  - Follow it with: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise", and never reword it.
  - Use the full prescriber line. Unapproved drugs or uses "aren't approved", never "not approved yet".
  - (About 11 pieces.)
- **Write narration exactly as it should be spoken, and don't date evergreen pieces.**
  - Give each decimal its own short sentence, with the unit spoken ("Seven point one percent.").
  - Never use "now", "this week", "new" or holiday dates.
  - Help lines cover all four markets. For chest pain or fainting, the emergency number comes first.
- **Keep each finding at its source's exact unit, scope, verb and urgency, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe in the same sentence. A share of people is never an "average".
  - Never present the label's slower stomach emptying as the cause of an effect: no "so" and no "that's why" (4 pieces).
  - Don't compare two different trials as if they were head-to-head.
  - Keep "may", "rare", "post-marketing" and "won't settle". Never add "most", "many", "commonly", "similar" or "purely". One trial's finding is never "the trials".
  - Recaps keep the scope and hedge set earlier in the script (L3 11-14, L1 11-15).
  - (About 92 findings.)
- **Run the muted-viewer test both ways, starting with the opening card.**
  - The opening card names the drug from sentence 1 (S1 11-15, S3 11-13).
  - Every stat card names the drug, dose, both groups, population and timeframe.
  - On-screen text keeps the narration's scope (for example "US label, single-dose pen") and is never stronger than the narration.
  - (About 65 findings, latest S1 11-15.)

### Carousel Designer
- **Carousels are stopped, but the scheduler still sends them (C1 11-13).**
  - If you're asked for one, reuse verified Short text only, with each trial's exact population and a stat card that names the drug, both groups and the measure.
  - Use generic drug hashtags only, give every source its full revised date, and use one save ask, never an open question.
  - End on the exact disclaimer plus the prescriber line.
  - (All 3 carousels had findings.)

### Social Copywriter & packaging
- **A long-form description must never ship cut off, without its ending, or with a placeholder.** This caused a hold. Cut-offs happened 4 times (L1 11-11 (held), L1 11-13, L1 11-14, L3 11-14), 3 of them in the last source URL.
  - Build it in this order: the safety block and the closing disclaimer first, then the quick answer, then 2–3 sources, without extra anchors. Stay at 1,250 characters or fewer.
  - Paste the closing disclaimer as the very last line. Before you hand off, check that the field ends "…whether it's right for you."
  - Never type "▶ Watch next", "MM:SS" or any other placeholder.
  - The safety block keeps the scoped don't-stop line.
  - Chapters: only with real timestamps starting at 00:00, one per script section, including the final checklist (L1 11-11, L1 11-15). Otherwise leave them out and say so in the post notes.
- **YouTube descriptions are viewer copy only, and line 1 stays empty on every description, Shorts included.**
  - After line 1: a quick answer of 3 lines or fewer, the safety block, 1–4 sources (including the Medication Guide when it's used), chapters and hashtags.
  - Never put an internal note in the field.
  - (Line 1 filled in 8 pieces, latest S2 11-15.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you." with nothing after it.**
  - Hashtags and the don't-stop line go before it.
  - Copy safety and pinned-comment lines word for word, keeping "right away", "healthcare provider" and "with or without vomiting".
  - Write "medicines". Never write "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line. (Over the limit in about 32 pieces.)
- **Copy facts, qualifiers and populations word for word from the verified script, on every platform and in the pinned comment.**
  - That includes "top dose", "on average", "all doses combined", "Phase 2b", "not yet peer-reviewed", "post-marketing", "the label says", the insulin/sulfonylurea caveat and the full trial population. Never shorten the population to "adults" (pinned comments on L1 11-04 and L1 11-15).
  - Our own tips are never credited to a study.
  - Don't add hooks or hints the script doesn't support: "You're not imagining it", "Not what it looks like", and "yet" used as if more news is coming (FB on S1 11-13 and S1 11-15).
  - (About 130 findings, in every batch.)
- **Titles, thumbnails, first lines, engagement lines and hashtags keep the video's hedge and scope.**
  - Keep "possible", "may" and "linked to". A stat in a title names its measure ("23.3% weight loss").
  - Don't promise a timeframe or effect the video doesn't deliver ("First Weeks", "one glass"). Never call data older than about 3 months "new".
  - Use one save or share ask, never an open question.
  - Hashtags: only the generic names of drugs whose own data the post reports. Banned examples: #Zepbound, #GLP1 on a single-drug post, #guthealth, #MetabolicHealth, #HeartRate, #pentips, #sideeffects.
  - (About 47 pieces.)

### Everyone
- **The Medication Guide and the IFU each need their own working URL, never the PI page or a PI anchor. Open the URL and find the quoted sentence in it before you cite it.**
  - If you can't load the real Medication Guide or IFU, paraphrase without quotes and tag the PI section that says it.
  - This caused the L2 11-14 fact-check failure. 7 pieces in total.
- **Give every result the exact drug scope and trial population it came from.**
  - Class studies say "GLP-1 medicines"; tirzepatide trials stay "tirzepatide".
  - Obesity trials (SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1) enrolled adults with obesity, or overweight plus at least one weight-related condition, without diabetes. Never shorten this to "no diabetes" or "adults".
  - Diabetes trials: SURPASS and the Mounjaro label trials. In the Zepbound pooled data, Study 1 excluded type 2 diabetes and Study 2 enrolled only people with it.
  - When you show a diabetes-pool rate (pancreatitis 0.23 vs 0.11 per 100 years), also show the weight-trial figure (0.14 vs 0.15).
  - GI side effects happened "mostly during dose escalation and decreased over time", never "in the first weeks".
  - Key numbers:
    - SURMOUNT-4: 335 vs 335, +14.0% average regain on placebo, and placebo still ended 9.9% below baseline.
    - Hair loss: 5.4% vs 0.9% (women 7.1%, men 0.5%).
    - Injection-site reactions: 6–8% by dose vs about 2% on placebo.
    - Foundayo: the label's top dose is 17.2 mg, with −11.1% in Trial 1. If you quote 36 mg or −11.2%, call it the trial dose.
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag. Only exact printed words go in quotes.
  - A source title lists the label sections it is actually cited for.
  - Known facts: the July 2023 review was EMA PRAC's; name both NANOS and the AAO; NHS "more at risk" is not the same as "more likely"; the removed label warning was "Suicidal Behavior and Ideation".
  - (About 62 findings.)
- **Keep the source list clean.**
  - Fetch every URL first. Reject 402, 403 and 404 responses, login and DOI redirects, newsroom pages and search-query pages. Use the PubMed record for paywalled journals.
  - Every entry carries its live revised or reviewed date, never just a year.
  - Known dates: Zepbound PI 28 Aug 2026; Mounjaro PI 27 Aug 2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023.

_Updated 2026-11-15 from 52 QA records (all GLP-1, 11-02 to 11-15)._

_Updated 2026-11-15 from 52 QA records._
