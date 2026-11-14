_Based on 51 QA records from 2026-11-01 to 2026-11-14: 33 Shorts, 15 long-forms and 3 carousels, all on GLP-1. **8 were held or failed.**_

_**New since the last pass:** 1 record. **L2 11-14 (Serious Warnings) failed at fact-check and was never rendered.**
- Its "Medication Guide" source URL loaded the full Prescribing Information, which ends at section 17 and contains no Medication Guide text. That left every quoted Medication Guide line unsupported: "stop using it and call your healthcare provider right away", the fluids line and the allergy/emergency lines.
- This is the **7th Medication Guide URL finding** and the **first hold** it caused.
- The same script also changed the fixed "those emergency signs" line, called the removed suicidality warning a "depression warning", and showed only the diabetes-trial pancreatitis pool to a mostly weight-treatment audience._

_**Why items didn't ship:**
- Audio: 4 holds (L1 11-11 at 0.022 plus the misread "of the day"; S2 11-11 at 0.061; S2 11-12 with its last 2 scenes silent; S2 11-13 at 0.047 with stingers on spoken numbers).
- Beat drift after render: 3 holds (L1 11-09, L1 11-10, L1 11-14).
- Sources: 1 hold (L2 11-14, Medication Guide URL was really the PI).
- L1 11-11 also had a description cut off mid-word._

_**Correction (still applies):** the Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09 (including L1 11-02, 11-05 and 11-06) came from a QA bug. The published videos were in sync and the disclaimer was on screen. Only the automatic beat-sync gate counts. **Out of date:** the Shorts limit is 160 spoken words, so ignore any finding that says 170 words or 90 s._

### Motion Designer
- **Measure masking last, on the final file, in every format, and never hand off anything above 0.02.**
  - 10 pieces went over 0.02. 7 were S2 (13:00) Shorts, and 2 were long-forms (L1 11-11 at 0.022, L1 11-14 at 0.026). This caused 4 audio holds.
  - Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line (that sank S2 11-13).
  - Duck the music under all narration and re-measure after any re-render. Take your own reading too: the gate let 0.028 through on S1 11-11.
- **Long-forms: a clean plan proves nothing, so check beat sync on the render.**
  - All 3 beat-drift holds had plans at 96–100% on time but renders at only 83–88%.
  - Re-time every cut from the final word timestamps after the final narration and after any scene is regenerated.
  - Then measure each beat's offset in the rendered file and fix any cut more than 0.5 s off before you submit. (3 holds, latest L1 11-14.)
- **Make sure every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.**
  - Check every "point", number, unit and drug name, plus any extra or missing words.
  - Seen so far: "point" dropped twice, "tears of petide", "mg" for "milligrams", an extra "the", "of the day", and 2 silent closing scenes.
  - Regenerate any failing scene before you mix. (4 holds, 9 pieces.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers must match the stat pill exactly ("7.1%", "25–29%", "<6%", "72", "1,032", "15–20 g").
  - Before render, search the captions for number words (POINT, PERCENT, HUNDRED, THOUSAND, TWENTY TWENTY, SEVENTY-…).
  - Also search for spaced-out letters ("M T C") and pronunciation spellings ("NAY-ON", "SULFONYL UREA", "OR FOR GLIP RON", "REH TAH TROO TIDE").
  - (Spelled-out numbers in about 17 Shorts, latest S2 and S3 11-14. Pronunciation spellings failed the subtitle check on 3 Shorts.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Fully clear the previous card, tags and bubbles before the next one appears.
  - Never split a word, number or phrase across cards ("SEVENTY-/TWO", "GLP-/1", "TYPE / TWO DIABETES", "WEIGHT / LOSS").
  - Never end a card on a comma, dash, colon, THE, A, ABOUT, MAY, WON'T, DOESN'T, BEEN, POINT, TYPE or a bare number.
  - Use these fixed cards word for word:
    - Exp F line (until 11-17): "WE ANSWER ONE TIRZEPATIDE QUESTION" / "FROM THE RESEARCH EVERY DAY." / "SUBSCRIBE IF THAT HELPS."
    - Closing line: "FULL BREAKDOWN ON OUR CHANNEL." / "LINK IN THE DESCRIPTION."
  - (The Exp F card broke in 5 Shorts and the closing card in 5, latest S1 and S2 11-14. Broken cards appear in nearly every Short.)
- **Keep every tag inside the frame, off the caption, and at least ~40px.**
  - Shorts: keep tags above y 1150, show at most 2 at once, and drop any tag that repeats the caption. Body-part tags collide most.
  - Long-forms: keep the bottom of every tag at y 1000 or less. Bottom name and dose tags ("Sam, 47", "Study 1", "Stomach", "Tirzepatide") keep clipping past y 1080, and labels keep rendering at 22–26px.
  - Render every chip the shot list asks for.
  - (About 310 overlap findings in Shorts. In long-forms, about 200 tiny-text and 190 off-screen findings.)
- **Never use the rounded teal or green "cabinet strip" backdrop, the hanging grey or orange ornament circles, or a starfield on a body beat.**
  - Match the backdrop to the mood: night → night room, brand → teal gradient, clinic → clinic, body → body backdrop.
  - (Cabinet strips in 10 pieces since 11-10, latest L1 and S3 11-14. Starfield on body beats in 8 pieces, latest S2 and S3 11-14.)
- **Fill every frame and delete every placeholder.**
  - Each frame needs a headline plus a labelled hero covering at least ~25% of it.
  - Document, label and doctor beats on a plain gradient are the usual empty ones: put the stat or quote on the document and add a character.
  - No blank frames (S1 11-14 at 39.7 s), empty speech bubbles, cropped shapes or debug marks.
  - (About 160 near-empty findings in long-forms. Empty document beats in 6 pieces, latest S1 11-14.)
- **Draw people as whole characters with a neck and shoulders, and keep each named character looking the same throughout.**
  - No floating heads, rings, donuts or blobs as the main character, and no mascots perched on a person. Ring or donut shapes appeared in 5 pieces; a ring opened S2 11-14.
  - On risk, "aren't approved" and caveat lines, use a calm, neutral mascot: no smiles, green checks, "Phew", sweating or crying.
  - (About 20 character findings and about 8 mood mismatches.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words. Count every safety and closing line yourself.**
  - Tight arm: 90–120 words. Standard arm: 135–160 words.
  - Closing order: the don't-switch/stop/change line → "Not personal advice" → the prescriber line → the Exp F line (08:00 and 13:00 only, until Exp F closes on 11-17; after that, follow the task) → "Full breakdown on our channel, link in the description."
  - Long-forms end with "There's a video I'd watch next, linked in the description."
  - (Closing lines missing or out of order in 4 Shorts.)
- **Speak every safety line and also write it in full in the on-screen field. These lines are fixed: copy them exactly.**
  - An emergency line names its trigger and keeps "right away".
  - Follow it with: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise", and don't reword "those emergency signs" (L2 11-14).
  - Use the full prescriber line. Unapproved drugs or uses "aren't approved", never "not approved yet".
  - (About 11 pieces.)
- **Write narration exactly as it should be spoken, and don't date evergreen pieces.**
  - Put each decimal in its own short sentence with the unit spoken ("Seven point one percent.").
  - Never use "now", "this week", "new" or holiday dates.
  - Help lines cover all four markets. For chest pain or fainting, the emergency number comes first.
- **Keep each finding at its source's exact unit, scope, verb and urgency, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe. A share of people is never an "average".
  - Never present the label's slower stomach emptying as the cause of an effect: no "so" or "that's why" (4 pieces, latest L1 and S3 11-14).
  - Don't compare two different trials as if they were head-to-head.
  - Keep "may", "rare", "post-marketing" and "won't settle". Never add "most", "many", "commonly" or "similar". One trial's finding is never "the trials".
  - (About 85 findings.)
- **Run the muted-viewer test both ways, starting with the opening card.**
  - The opening card and every stat card name the drug, dose, both groups, population and timeframe.
  - A spoken stat also names its population.
  - On-screen text is never stronger than the narration, and every reason the narration gives appears on screen.
  - (About 60 findings, latest S1 and S3 11-14.)

### Carousel Designer
- **Carousels are stopped, but the scheduler still sends them (C1 11-13).**
  - If asked, reuse verified Short text only, with each trial's exact population and a stat card naming the drug, both groups and the measure.
  - Use generic drug hashtags only, give every source its full revised date, and use one save ask, never an open question.
  - End on the exact disclaimer plus prescriber line.
  - (All 3 carousels had findings.)

### Social Copywriter & packaging
- **A long-form description must never ship cut off, without its ending, with an unscoped safety block or with a placeholder.** This caused a hold, and the cut-off has happened 3 times.
  - Write the safety block and the closing disclaimer first, then fit the quick answer and sources into the 1,250 characters that remain.
  - Re-read the field to its last character.
  - Leave line 1 empty for the publisher. Never type "▶ Watch next" or any other placeholder (L1 11-14).
  - Use chapters only with real timestamps starting at 00:00. Otherwise leave them out and say so in the post notes.
  - (Cut off: L1 11-11 (held), L1 11-13, L1 11-14. No disclaimer: 3 pieces. Over the length limit: 7 long-forms.)
- **YouTube descriptions are viewer copy only, and line 1 stays empty on Shorts too.**
  - After line 1: a quick answer of 3 lines or fewer, the safety block, 1–4 sources (including the Medication Guide when it's used), chapters and hashtags.
  - Never put an internal note in the field.
  - (Line 1 filled in 7 pieces, latest S1 11-13.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you." with nothing after it.**
  - Hashtags and the don't-stop line go before it.
  - Copy safety and pinned-comment lines word for word, keeping "right away", "healthcare provider" and "with or without vomiting".
  - Write "medicines". Never write "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line.
  - (Paraphrased safety lines in 9 pieces. Threads over the limit in about 30.)
- **Copy facts, qualifiers and populations word for word from the verified script, on every platform.**
  - That includes "top dose", "on average", "all doses combined", "small trial", "not yet peer-reviewed", "post-marketing", "the label says", the insulin/sulfonylurea caveat and the full trial population.
  - Our own caveats get their own sentence, never one placed after a source tag.
  - Don't add hooks the script doesn't support, such as "You're not imagining it" or "Not what it looks like".
  - TikTok has room for the population and the emergency line, so keep them.
  - (About 125 findings, in every batch.)
- **Titles, thumbnails, first lines, engagement lines and hashtags keep the video's hedge and scope.**
  - Keep "possible", "may" and "linked to".
  - Don't promise a timeframe or effect the video doesn't deliver ("First Weeks", "one glass").
  - Never call data older than about 3 months "new". Never use "Approved yet?" or "Approved Anywhere?".
  - Use one save or share ask, never an open question.
  - Hashtags: only the generic names of drugs whose own data the post reports. Banned examples: #Zepbound, #guthealth, #MetabolicHealth, #HeartRate, #pentips, #sideeffects.
  - (About 45 pieces.)

### Everyone
- **The Medication Guide and the IFU each need their own working URL, never the PI page or a PI anchor. Open the URL and find the quoted sentence in it before you cite it.**
  - If you can't load the real Medication Guide or IFU, paraphrase without quotes and tag the PI section that says it.
  - This caused the L2 11-14 fact-check failure. 7 pieces in total, latest L1 and L2 11-14.
- **Give every result the exact drug scope and trial population it came from.**
  - Class studies say "GLP-1 medicines"; tirzepatide trials stay "tirzepatide".
  - Obesity trials (SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1) enrolled adults with obesity, or overweight plus at least one weight-related condition, without diabetes. Never shorten this to "adults without diabetes".
  - Diabetes trials: SURPASS and the Mounjaro label trials. About 25% of ATTAIN-J had type 2 diabetes. In the Zepbound pooled data, Study 1 excluded type 2 diabetes and Study 2 enrolled only people with it.
  - When you show a diabetes-pool rate (for example pancreatitis 0.23 vs 0.11 per 100 years), also show the weight-trial figure (0.14 vs 0.15).
  - GI side effects happened "mostly during dose escalation and decreased over time" (never "first weeks").
  - Key numbers:
    - SURMOUNT-4: 335 vs 335, +14.0% regain, and placebo still ended 9.9% below baseline.
    - Hair loss: 5.4% vs 0.9% (women 7.1%, men 0.5%).
    - Injection-site reactions: 6–8% by dose vs about 2% on placebo.
    - Foundayo: the label's top dose is 17.2 mg, with −11.1% in Trial 1. If you quote 36 mg or −11.2%, call it the trial dose.
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag.
  - Only exact printed words go in quotes.
  - Known facts:
    - The July 2023 review was EMA PRAC's.
    - Name both NANOS and the AAO.
    - NHS "more at risk" is not the same as "more likely".
    - The removed label warning was "Suicidal Behavior and Ideation", not a depression warning.
  - (About 60 findings.)
- **Keep the source list clean.**
  - Fetch every URL first. Reject 402, 403 and 404 responses, login and DOI redirects, newsroom pages and search-query pages. Use the PubMed record for paywalled journals.
  - Every entry carries its live revised or reviewed date, never just a year (latest S1 11-14).
  - Known dates: Zepbound PI 28 Aug 2026; Mounjaro PI 27 Aug 2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023.

_Updated 2026-11-14 from 51 QA records (all GLP-1, 11-01 to 11-14)._

_Updated 2026-11-14 from 51 QA records._
