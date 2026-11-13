_Based on 50 QA records from 2026-10-31 to 2026-11-13: 33 Shorts, 14 long-forms and 3 carousels, all on GLP-1. **6 were held.** The L1 10-30 failure is now outside the window._

_**New since the last pass:** 5 records from 11-13.
- **S2 11-13 was held.** Masking was 0.047, and the sound pass put stingers right on the spoken "20.9%" and "11.2%". This is the **third S2 hold in a row** (11-11, 11-12, 11-13).
- **L1 11-13 (first month) shipped with 3 major description faults:** it was cut off mid-URL, the closing disclaimer was missing, and the safety block told viewers to stop for emergency signs without the scoped don't-stop line. Its narration also dropped a "point".
- **S1 and S3 11-13** repeat old problems: "SEVEN POINT ONE PERCENT" in the captions, line 1 of the description filled in, an empty ghost bubble, a card ending in an em dash, and "Otherwise," in a safety line.
- **C1 11-13** went out even though carousels are stopped. It had an open-question engagement line and source dates given only as years._

_**Why items didn't ship:**
- Audio caused 4 holds: L1 11-11 (masking 0.022 plus "of the day"), S2 11-11 (0.061), S2 11-12 (last 2 scenes silent) and S2 11-13 (0.047, stingers on numbers).
- Beat drift after render caused 2 holds: L1 11-09 and L1 11-10. There have been none since 11-11.
- L1 11-11 was also cut off mid-word in its description._

_**Correction (still applies):** the Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09 (including L1 11-02 and L1 11-05) came from a QA bug. The published videos were in sync. Those findings aren't counted; only the automatic beat-sync gate counts. **Out of date:** the Shorts limit is 160 spoken words, so ignore any finding that says 170 words or 90 s._

### Motion Designer
- **The S2 (13:00) mix is the #1 cause of holds. Measure masking last, on the final file, and never hand off above 0.02.**
  - Evidence: 9 pieces went over 0.02, and 7 of them were S2 (11-01, 11-02, 11-05, 11-06, 11-11, 11-12, 11-13). 4 audio holds in total.
  - Never put a stinger, whoosh or SFX on a spoken number, percentage, drug name or safety line. That is what sank S2 11-13.
  - Duck music under all narration, re-measure after any re-render, and take your own reading: the gate let 0.028 through on S1 11-11.
- **Make sure every scene has voice right to the end, then compare a speech-to-text transcript with the script, word for word.**
  - Check that each scene's audio exists and runs as long as its narration, especially the last safety and closing scenes (S2 11-12 was held for 2 silent scenes).
  - Then check every "point", number, unit and drug name, and look for extra or missing words.
  - "Point" was dropped in L1 11-02 and L1 11-13. Other errors so far: "tears of petide", "mg" read as "milligrams", an extra "the", "of the day", and extra words in S2 11-13.
  - Regenerate any scene that fails before you mix. (4 holds, 8 pieces.)
- **Long-forms: check beat sync on the render, not the plan.** In both holds the plan was clean (69/72 and 74/74 beats on time), but only 83–86% of cuts landed on time after render. Take every cut time from the final narration's word timestamps, and fix any cut more than 0.5 s off before you submit. (2 holds. None since 11-11, so keep doing this.)
- **Build captions from the script's on-screen text field, never from the narration.**
  - Numbers must match the stat pill exactly: "7.1%", "0.5%", "11.2%", "25–29%", "<6%", "126", "6.4", "1,032", "2026", "15–20 g".
  - Before render, search the captions for:
    - number words: POINT, PERCENT, HUNDRED, THOUSAND, TWENTY TWENTY, spelled-out numbers
    - spaced or hyphenated letters ("M T C", "M-T-C")
    - pronunciation spellings ("NAY-ON", "REH-TAH-TROO-TIDE", "SULFONYL UREA")

  (Spelled-out or split numbers in about 15 Shorts, latest S1 and S2 11-13. Pronunciation spellings caused 4 subtitle flags.)
- **Each caption card is one whole clause, 2 lines or fewer, and the only text on screen.**
  - Clear the previous card, tags and bubbles completely (ghost text in 6 Shorts, latest S3 11-13).
  - Never split a word, number, code or phrase across cards or lines ("SEVENTY-/SIX", "GLP-/1", "TYPE / TWO DIABETES", "SEVEN / IN TEN", "WEIGHT / LOSS").
  - Never end a card on a comma, dash, colon, THE, A, CAN, MAY, WON'T, NOT, DOESN'T, BEEN, ABOUT or another preposition, POINT, TYPE or a bare number.
  - The fixed lines break most often: Exp F ("…QUESTION FROM THE", 3 Shorts) and "FULL BREAKDOWN ON OUR CHANNEL," (3 Shorts, latest S3 11-13). Pre-build these as fixed, whole cards.

  (Broken cards in nearly every Short.)
- **Keep every tag inside the frame, off the caption, and at least ~40px.**
  - Shorts: keep tags, chips and bubbles above y 1150, show at most 2 at once, and drop any tag that repeats the caption. Body-part tags (Stomach, Kidneys, Blood sugar, Pancreas) collide most. Never put stat numbers over heads.
  - Long-forms: keep the bottom of every tag at y 1000 or less. Name tags and chips at the bottom ("Priya", "Sam, 47", "Study 1", "15 mg") keep clipping past y 1080, and labels keep rendering at 22–26px.
  - Render every chip the shot list asks for (missing in 5 pieces).

  (About 300 overlap findings in Shorts. In long-forms, about 200 tiny-text and 180 off-screen findings.)
- **The rounded teal or green "cabinet strip" backdrop and the hanging grey or orange ornament circles are banned in every format.** Use the matching mood backdrop instead: night → night room, brand → teal gradient, clinic → clinic, body → body (never the starfield). (Cabinet strips in 8 pieces since 11-10, latest L1 and S2 11-13. Starfield on a body beat in 6 pieces.)
- **Fill every frame and delete every placeholder.** Each frame needs a headline plus a labelled hero covering at least ~25% of it. Document, label and doctor beats on a plain gradient are the usual empty ones: put the stat or the quote on the document and add a character. Delete empty speech bubbles, cropped decorative shapes and debug marks. (About 150 near-empty findings in long-forms. Empty document beats in L1, S1 and S3 11-12/11-13. Ghost bubbles in 3 Shorts.)
- **Draw people as whole characters with a neck and shoulders, and keep each named character the same throughout.** No floating heads, blobs, donut or ring mascots, or mascots perched on a person. Make the mascot and its bubble agree with the line: on risk, "not approved" and caveat lines, use a calm, neutral mascot with no smiles, green checks, "Phew", sweating or crying. (About 18 character pieces, latest S3 11-13. About 8 mood mismatches.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words.**
  - Tight is 90–120 words and standard is 135–160, counting the safety, Exp F and closing lines. Count them yourself.
  - The closing order is fixed: the safety lines (don't switch/stop/change → "Not personal advice" → prescriber line), then, on 08:00 and 13:00 Shorts until Exp F closes on 11-17, the Exp F line, then "Full breakdown on our channel, link in the description."
  - Long-forms end with "There's a video I'd watch next, linked in the description."

  (3 Shorts over the word limit. Closing lines missing or out of order in 4, latest S2 11-13.)
- **Speak every safety line and also write it in full in the on-screen field.**
  - An emergency card names its trigger and keeps "right away" (for example, possible pancreatitis → stop and call your healthcare provider right away).
  - Then scope the don't-stop line: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise".
  - Use the full prescriber line. For unapproved drugs or uses, write "isn't approved" with no "yet".

  (About 9 pieces.)
- **Write narration exactly as it should be spoken, and don't date evergreen pieces.**
  - Write numbers and units as words, and put each decimal in its own short sentence with the unit spoken ("Seven point one percent."). "Point" was dropped twice.
  - Never use "now", "this week", "new" or holiday dates (6 pieces).
  - Help lines cover all four markets, or say "your local urgent care or emergency number". For chest pain or fainting, the emergency number comes first.
- **Check every count against the source's own unit, and keep each finding at its source's exact scope, verb and urgency, including in recaps.**
  - Each number names its measure, drug and arm, comparator, group sizes and timeframe. Give dose ranges as ranges across doses, and round conservatively.
  - Observational results are "linked to". Keep "may", "potential", "rare", "post-marketing" and "won't settle". Never add "most", "many", "that's why" or "similar".
  - A single trial's finding (for example "mostly mild to moderate" from SURMOUNT-1) is never "the trials".

  (About 80 findings.)
- **Run the muted-viewer test both ways, starting with the opening card.** The opening card names the drug and who the result applies to. Every stat card names the drug and dose, both groups, the population and the timeframe. On-screen text is never stronger than the narration, and every reason the narration gives also appears on screen. (About 55 findings, latest S3 and L1 11-13.)

### Carousel Designer
- **Carousels stay stopped, but the scheduler still sends them (C1 11-13).** If asked, reuse verified Short text only, and include each trial's exact population plus a stat card that names the drug, both groups and the measure. Use generic drug hashtags only. Give sources their full revised date. Use one save ask, never an open question, and end on the exact disclaimer plus prescriber line. (All 3 carousels had findings.)

### Social Copywriter & packaging
- **A long-form description must never ship cut off, without its ending, or with an unscoped safety block. This caused a hold, and L1 11-13 shipped with all three faults.**
  - Re-read the whole field to its last character. It must end with the exact disclaimer line.
  - If the safety block says "stop" for emergency signs, the scoped don't-stop line must follow it.
  - Chapters: one per script section, starting at 00:00, with real timestamps. If the timings aren't final, leave the chapter block out and say so in the post notes. Never use "MM:SS".

  (Cut off: L1 11-11 (held) and L1 11-13. No disclaimer: L2 11-10 and L1 11-13. Missing or placeholder chapters: 4.)
- **YouTube descriptions are viewer copy only, and 1,250 characters or fewer before the link. Line 1 stays empty on Shorts and long-forms alike.** Then: a quick answer of 3 lines or fewer, the safety block, 1–4 sources (including the Medication Guide when it's used), chapters, hashtags. Never put an internal note in the field. Trim "What you'll learn" and the source labels first. (Line 1 filled in 7 pieces, latest S1 11-13. 6 long-forms over the length limit.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you." Nothing comes after it.** Hashtags and the don't-stop line go before it. Copy safety and pinned-comment lines word for word from the script, with the emergency scoping, "right away", "healthcare provider" and "with or without vomiting". Write "medicines", never "meds", and never "Otherwise…" or "won't let up". (Hashtags after the disclaimer in 6 pieces. Paraphrased safety lines in 8, latest S3 11-13.)
- **Threads stays at about 300 characters, counting the safety lines.** Write it last, and cut a clause, never a safety line. If the safety lines alone come to about 300 or more, keep them and cut the post down to one short fact. (Over in about 30 pieces, in every batch.)
- **Copy facts, qualifiers and populations word for word from the verified script, on every platform.** That includes "top dose", "on average", "all doses combined", "small trial", "not yet peer-reviewed", "post-marketing", "the label says", the insulin/sulfonylurea caveat and the full trial population. Our own caveats get their own sentence, never after a source tag. TikTok has room for the population, the emergency line and the caveats, so keep them. (About 120 findings, in every batch.)
- **Titles, thumbnails, first lines and engagement lines keep the hedge, scope and population.**
  - Keep "possible", "may" and "linked to".
  - Don't promise a timeframe or effect the video doesn't give ("First Weeks", "one glass").
  - Don't call data older than ~3 months "new", and never use "Approved yet?" or "Approved Anywhere?".
  - Use one save or share ask, never an open question (6 pieces, latest C1 11-13).
  - Hashtag only generic names of drugs whose own data the post reports. No brand or trend tags (#Zepbound, #guthealth, #MetabolicHealth, #HeartRate).

  (About 40 pieces.)

### Everyone
- **Give every result the exact drug scope and trial population it came from.**
  - Class studies say "GLP-1 medicines", and tirzepatide trials stay "tirzepatide".
  - The obesity trials (SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1) enrolled adults with obesity, or with overweight plus at least one weight-related condition, without diabetes. Never shorten this to "adults without diabetes" (4 pieces).
  - Type 2 diabetes trials: SURPASS and the Mounjaro label trials. About 25% of ATTAIN-J had type 2 diabetes.
  - Zepbound pooled data: Study 1 excluded type 2 diabetes, and Study 2 enrolled only people with it.

  Key numbers:
  - SURMOUNT-4: 335 vs 335, +14.0% regain, and placebo still ended 9.9% below starting weight.
  - Hair loss: 5.4% vs 0.9% (women 7.1% vs men 0.5%; on placebo 1.3% vs 0%).
  - Injection-site reactions: 6–8% by dose vs about 2% on placebo.
  - Foundayo: the label's top dose is 17.2 mg, and its Trial 1 table reports −11.1%. If you quote the 36 mg trial dose or −11.2%, say it's the trial dose.
- **Gastrointestinal side-effect timing: the label says they happened mostly during dose escalation and decreased over time.** Don't narrow that to "first weeks" or "early in treatment". (2 pieces: S1 11-04 and S3 11-13.)
- **Before you tag a line to a source, find the sentence in that source that says it. If you can't, remove the tag.**
  - Our own tips, help lines and safety lines get no tag (for example, the label says nothing about "willpower", L1 11-13). Only exact printed words go in quotes; if the IFU or Medication Guide text won't load, paraphrase without quotes.
  - Known facts: the July 2023 review was EMA PRAC's; name both NANOS and the AAO; the NHS's "more at risk" isn't "more likely".

  (About 60 findings. This caused the 10-30 failure.)
- **Keep the source list clean.** Fetch every URL first. Reject 402, 403 and 404 responses, login redirects, newsroom pages, search-query pages and DOI redirects, and use the PubMed record for paywalled journals. The Medication Guide and the IFU each get their own working URL, not a PI anchor (9 pieces, latest S3 11-13). Every entry carries its live revised or reviewed date, never just a year (latest L1, S3 and C1 11-13). Known dates: Zepbound PI 28 Aug 2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023.

_Updated 2026-11-13 from 50 QA records (all GLP-1, 10-31 to 11-13)._

_Updated 2026-11-13 from 50 QA records._
