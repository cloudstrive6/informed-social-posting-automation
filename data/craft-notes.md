_Based on 52 QA records from 2026-11-04 to 2026-11-16: 33 Shorts, 16 long-forms and 3 carousels, all on GLP-1. **10 were held or failed.**_

_**New since the last pass (11-16):**
- L1 Mounjaro vs Zepbound was **held for beat drift.** Its plan had 76/76 beats on time, but only 76% were on time in the render.
- S1 Second Click was **held.** One scene lost the spoken words "the gray plunger is visible", and masking was 0.031.
- S2 Burping and S3 Zepbound vs Mounjaro shipped, but with the cabinet-strip backdrop, broken caption cards and tag overlaps.
- Floating heads and starfield-on-body beats showed up again._

_**Why items didn't ship:**
- Beat drift after render: 4 (L1 11-09, 11-10, 11-14, 11-16).
- Audio or narration: 5 (L1 11-11, S2 11-11, S2 11-12, S2 11-13, S1 11-16).
- Sources: 1 (L2 11-14, where the "Medication Guide" URL was really the PI).
- Description: 1 cut off (L1 11-11), plus packaging REVISEs on L2 11-10 and L3 11-14._

_**Ignore these findings:**
- The Visual Critic's "offset beat", "wrong content in this shot" and "disclaimer never appears" findings up to 11-09. They came from a QA bug that showed frames in the wrong order. Only the automatic beat-sync gate counts.
- Any finding that cites a 170-word or 90 s Shorts limit. The limit is 160 spoken words._

_**Shorts closing (owner OK 2026-11-12):** from content date 2026-11-17 there is no Exp F subscribe card and no "link in the description" card in any Short. Never add them back._

### Motion Designer
- **Long-forms: check beat sync on the render, not the plan.** Re-time every cut from the final word timestamps, after the final narration and after any scene is regenerated. Then measure each beat in the rendered file and fix any cut more than 0.5 s off before you submit. Plans were at 96–100% on time; renders were at 76–88%. (4 holds, latest L1 11-16.)
- **Measure masking last, on the final file, and never hand off anything above 0.02.** Duck the music under all narration. Never put a stinger, whoosh or sound effect on a spoken number, drug name or safety line. Re-measure after every re-render, and don't rely on the gate: it let 0.028 and 0.022 through. (12 pieces over, latest S1 11-16 at 0.031. Part of 4 holds.)
- **Check that every scene has voice right to the end, then compare a speech-to-text transcript with the script word for word.** Check every "point", number, unit, drug name and key how-to phrase. Regenerate any scene that fails before you mix. (5 holds. Seen so far: silent closing scenes S2 11-12, "the gray plunger is visible" missing S1 11-16, "point" dropped L1 11-13, "tears of petide" L1 11-04, an extra "the" L1 11-06.)
- **Build captions from the script's on-screen text field, never from the narration.** Numbers are digits that match the stat pill exactly ("14.8%", "+14%", "25–29%", "<6%", "72"). Before render, search the captions for POINT, PERCENT, HUNDRED, THOUSAND, spelled-out numbers and pronunciation spellings ("NAY-ON", "SULFONYL UREA"). (About 20 Shorts. Subtitle checks flagged this 4 times, latest S2 11-15.)
- **Each caption card is one whole clause on 2 lines or fewer.** Never split a word, number or phrase across cards ("SIDE / EFFECTS", "TYPE / TWO DIABETES", "SEVENTY-/TWO"). Never end a card on a comma, dash, colon, THE, A, ABOUT, MAY, WON'T, DOESN'T, BEEN, TYPE, "AND IN" or a bare number. (In nearly every Short, latest all 3 Shorts on 11-16.)
- **Shorts last card, by content date:**
  - From 2026-11-17: the task's last line (a loop back into sentence 1, or "THE FULL VIDEO IS ON OUR CHANNEL." for a spin-off). No Exp F card and no link card.
  - Up to 2026-11-16 only: the Exp F and link cards, each made of whole sentences ending in a full stop. (The Exp F card broke 6 times, latest S2 11-16.)
- **Shorts tags: clear the previous card, tags and bubbles before the next card appears.** Keep tags above y 1150, show at most 2 at once, and never place one behind the caption pill. Drop any tag that repeats the caption. Render every chip the shot list asks for. (About 350 overlap findings, latest S3 11-16 with 12.)
- **Long-form tags: the bottom of every tag stays at y 1000 or less, and labels are at least ~40px.** Name, group and dose tags keep clipping past y 1080 ("Placebo group", "15 mg", "Eli Lilly"). Labels keep rendering at 22–26px. (About 225 off-screen and 220 tiny-text findings, latest L1 11-16.)
- **Never use the rounded teal or green "cabinet strip" backdrop, the hanging grey or orange ornament circles, or a starfield on a body beat. Match the backdrop to the beat's mood.** Night → night room, brand → teal gradient, clinic → clinic, body → body backdrop. (Cabinet strips in 14 pieces since 11-10, latest L1 and S2 11-16. Starfield on a body beat in 9 pieces, latest S1 11-16. A night beat in a daytime room in S1 11-16.)
- **Draw people as whole characters with a neck and shoulders, and keep each named character looking the same throughout.**
  - No rings, donuts or blobs as the main character, and no shapes or mascots perched on a person.
  - On risk and caveat lines, use a calm, neutral mascot: no smiles, no green checks, no sweating.
  - (Floating heads in about 12 pieces, latest L1 and S1 11-16. Rings in 7.)
- **Fill every frame with a headline plus a labelled hero covering at least ~25% of it, and keep stat titles off the hero art.**
  - Document and doctor beats on a plain gradient are the usual empty ones: put the stat on the document and add a character.
  - No blank frames, empty bubbles, cropped shapes or stray debug icons.
  - (About 170 near-empty findings in long-forms. Blank frame S1 11-14, stray icon L1 11-16.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and never go over 160 spoken words. Count every safety and closing line yourself.** Tight arm: 90–120 words. Standard arm: 135–160 words.
  - From content date 2026-11-17: "Not personal advice, so ask your prescriber.", plus the emergency and don't-stop lines when the topic needs them, then the task's last line. Never use the subscribe line or "link in the description" in a Short.
  - Long-forms end with "There's a video I'd watch next, linked in the description."
- **Copy the fixed safety lines exactly, and speak each one and show it on screen.** An emergency line names its trigger and keeps "right away". Follow it with "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Never write "Otherwise". Unapproved drugs or uses "aren't approved". (About 12 pieces.)
- **Write narration exactly as it should be spoken.**
  - Give each decimal its own short sentence, with the unit spoken.
  - Say "loss" or "lower" for minus figures, because a bare "15 to 21 percent" sounds like a gain (L1 11-16).
  - Never write "now", "this week", "new" or dates in evergreen pieces.
  - Help lines cover all four markets. For chest pain or fainting, the emergency number comes first.
- **Keep each finding at its source's exact unit, scope, verb and hedge, including in recaps.**
  - Each number names its measure, drug and arm, comparator, population and timeframe in the same sentence. A share of people is never an "average" (S2 11-14, S3 11-15).
  - Never present slower stomach emptying as the cause of an effect: no "so" and no "that's why" (5 pieces).
  - Don't compare two different trials as if they were head-to-head.
  - Never add "most", "many", "commonly", "similar" or "purely".
  - (About 95 findings.)
- **Run the muted-viewer test, starting with the opening card.** The opening card names the drug and the scope from sentence 1 (S1 11-12, S3 11-13, S1 11-15, S1 11-16). Every stat card names the drug, dose, both groups, population and timeframe. On-screen text is never stronger or narrower than the narration. (About 70 findings.)

### Carousel Designer
- **Carousels are stopped. If the scheduler still asks for one, reuse verified Short text only.** Use each trial's exact population and a stat card that names the drug, both groups and the measure. Use generic drug hashtags only, give every source its full revised date, and use one save ask, never an open question. End on the exact disclaimer plus the prescriber line. (All 3 carousels had findings.)

### Social Copywriter & packaging
- **Long-form descriptions must be complete and 1,250 characters or fewer.**
  - Build the safety block, with the scoped don't-stop line, and the closing disclaimer first, then a quick answer, then 2–3 sources.
  - Check that the field ends "…whether it's right for you."
  - Never type a placeholder ("▶ Watch next", "MM:SS").
  - Chapters only with real timestamps starting at 00:00, one per section, including the final checklist. Otherwise leave them out and say so in the post notes.
  - (4 cut-offs, 1 of them a hold. Over the length limit in 3: L1 11-09, L2 11-09, L1 11-16. Chapters missing the checklist in 2.)
- **Line 1 stays empty on every YouTube description, Shorts included, and the field holds viewer copy only, never an internal note.** (Line 1 filled in 8 pieces, latest S2 11-15. An internal note in the description of L1 11-06.)
- **Every caption field ends on exactly "Not personal advice. Talk to your doctor or prescriber about whether it's right for you." with hashtags and the don't-stop line before it.**
  - Copy safety lines word for word: keep "right away", "healthcare provider" and "with or without vomiting", and write "medicines", never "meds", "Otherwise" or "won't let up".
  - Threads stays at about 300 characters: cut facts, never a safety line. If the safety lines alone run past 300, ship the safety lines plus one fact.
  - (Threads over the limit in about 35 pieces, latest all 3 Shorts on 11-16.)
- **Copy facts, qualifiers and populations word for word from the verified script, on every platform and in the pinned comment.**
  - Keep "top dose", "all doses combined", "Phase 2b" and the full trial population, never just "adults" (pinned comments on L1 11-04 and 11-15).
  - Never credit our own tips to a study (S3 11-05, S3 11-15).
  - Never add hooks the script doesn't support: "You're not imagining it", "Not what it looks like", or "yet" as if more news is coming.
  - (About 135 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.**
  - A stat in a title names its measure. Don't promise a timeframe the video doesn't give.
  - Use one save or share ask, never an open question.
  - Hashtags: only the generic names of drugs whose own data the post reports. Banned examples: #Zepbound, #GLP1 on a single-drug post, #PatientSafety, #Type2Diabetes, #WeightManagement, #sideeffects, #pentips, #HeartRate, #MetabolicHealth.
  - (About 50 pieces, latest L1 and S1 11-16.)

### Everyone
- **The Medication Guide and the IFU each need their own working URL, never the PI page or a PI anchor.** Open the URL and find the quoted sentence before you cite it. If it won't load, paraphrase without quotes and tag the PI section instead. If the keyword names Mounjaro, cite Mounjaro's own IFU. (Caused the L2 11-14 failure. 8 pieces.)
- **Give every result its exact drug scope and trial population.**
  - Obesity trials (SURMOUNT-1, -4 and -5, STEP 1, ATTAIN-1) enrolled adults with obesity, or overweight plus a weight-related condition, without diabetes. Never shorten this to "no diabetes" or "adults".
  - In the Zepbound pooled data, Study 1 excluded type 2 diabetes and Study 2 enrolled only people with it.
  - Show pancreatitis 0.23 vs 0.11 per 100 years (diabetes pool) only alongside the weight-trial figure, 0.14 vs 0.15.
  - GI effects came "mostly during dose escalation and decreased over time".
  - Key numbers: SURMOUNT-4 335 vs 335, +14.0% average regain on placebo, and placebo still ended 9.9% below baseline. Hair loss 5.4% vs 0.9% (women 7.1%, men 0.5%). Injection-site reactions 6–8% by dose vs about 2% on placebo. Foundayo's label top dose is 17.2 mg, with −11.1% in Trial 1; 36 mg and −11.2% are the trial dose.
- **Tag a line to a source only after you find the sentence that says it.**
  - Our own tips, help lines and safety lines get no tag.
  - A source title lists only the sections it is actually cited for.
  - Known facts: the July 2023 review was EMA PRAC's; name both NANOS and the AAO; NHS "more at risk" is not the same as "more likely"; the removed label warning was "Suicidal Behavior and Ideation".
  - (About 65 findings.)
- **Keep the source list clean: fetch every URL first.**
  - Reject 402, 403 and 404 responses, login and DOI redirects, newsroom pages and search-query pages. Use the PubMed record for paywalled journals.
  - Every entry carries its live revised or reviewed date, never just a year.
  - Known dates: Zepbound PI 28 Aug 2026; Mounjaro PI 27 Aug 2026; NHS diarrhoea pages 01 May 2026 and 21 Dec 2023.

_Updated 2026-11-16 from 52 QA records (all GLP-1, 11-04 to 11-16)._

_Updated 2026-11-16 from 52 QA records._
