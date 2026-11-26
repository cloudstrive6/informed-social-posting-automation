_Based on 76 QA records from 2026-11-13 to 2026-11-26: 44 Shorts, 28 long videos and 4 carousels, all about GLP-1. One record is new since the last pass: **L4 11-26, "Semaglutide (Ozempic) and Chronic Kidney Disease"**. It is made and was not held. It still has four repeat faults: the emergency card shortens "healthcare provider" to "provider" (s65), the stat cards drop "median" from the 3.4-year follow-up (s2, s43), the Ozempic source dates don't match the documents linked (S2, S6), and the usual visual faults appear (floating heads, cabinet strips and ornaments, 14 near-empty findings)._

- _**Fact-check holds keep rising.** There are 7 source or fact-check holds, 2 of them on 11-26 (L2 and L3). None had a wrong trial number. They came from overstated claims and from dates copied between documents. L4 11-26 shows the same date risk for Ozempic: the printed PI revision date and the SPL effective date are different dates._
- _**Masking came back.** S1 11-26 was held at 0.056 after two clean days. Measure every final file._
- _**Drug-name misreads cause holds:** "tears appetite" in L1 11-25 and L1 11-26, and "moongiaro" in L1 11-26._
- _**Beat sync is fixed on Serious Risks.** L1 11-26 passed the gate after it was re-timed from the render._
- _Floating heads, cabinet strips, starfield or bokeh, and split safety cards appeared in every 11-26 video piece that had visual notes, L4 included._

_**20 were held or failed in this window (no change):**_
- _5 for beat drift: L1 11-14, L1 and L2 11-16, L1 11-21, L1 11-23._
- _7 for audio or narration: S2 11-13, S1 11-16, L1 11-22, S3 11-22, L1 11-25, L1 11-26, S1 11-26._
- _7 for sources or fact-check: L2 11-14, C1 11-20, the Foundayo REVISEs on 11-20 and 11-21, S2 11-26 (placeholder date), L2 11-26 (claim strength), L3 11-26 (another drug's dates, prediabetes scope)._
- _1 for packaging: L3 11-25 (thumbnail range)._

_**Ignore:**_
- _any finding that cites a 170-word or 90 s Shorts limit_
- _findings about the old Exp F cards ("Full breakdown on our channel", the subscribe line) on Shorts with content dates up to 2026-11-16 (S1 and S2 11-14, S3 11-13, S3 11-15)_
- _offset-beat or wrong-beat findings from 11-09 and earlier. They were a QA bug. Only the automatic beat-sync gate counts for timing._

_**Shorts closing (owner OK 2026-11-12, content dates from 2026-11-17):** no subscribe line or card, and no "link in the description" line or card, re-renders of older scripts included. Never add them back. Every Short from 11-17 to 11-26 complied._

### Motion Designer
- **Check beat sync on the long-form render, not on the plan, and check that each shot shows its own scene's text.**
  - Re-time every cut from the final word timestamps, and again after any scene is regenerated. Fix any cut more than 0.5 s off on the rendered file.
  - Compare every stat or headline shot with its own scene ID. The renderer pulls a later scene's text into earlier shots that share a layout.
  - (5 gate holds. Plans were 96–100% on time; renders were 76–93%. Wrong-scene text 3 times: s31←s23 in L2 11-16, s65←s75 in L1 11-21, s18←s60 in L1 11-23. The re-timed Serious Risks render on 11-26 passed.)
- **Before handoff, run speech-to-text on every scene and compare it with the script. Check drug and brand names first:** tirzepatide, semaglutide, orforglipron, dulaglutide, Mounjaro, Zepbound, Ozempic and Foundayo.
  - If a name is misheard, regenerate that scene with a phonetic respelling, then re-time and re-check the transcript. It is a ship-blocker. Never hand it off with a "quality check" note.
  - Then check every "point", number, unit, acronym and contraction.
  - (Drug names misheard in 3 long videos, 2 of them held: "tears epitide" and "some agglutide" in L2 11-23; "tears appetite" in L1 11-25 (held); "tears appetite" and "moongiaro" in L1 11-26 (held). Other misreads: "gip", "tenmg", "sub study", "why is" for "why's", and a dropped "point".)
- **Every scene has voice from its first word to its last,** the closing scene and the Short's hook included. (3 holds for silent lines: S1 11-16, L1 11-22, S3 11-22.)
- **Measure masking last, on the final file of every piece. Never hand off anything above 0.02; aim for 0.015 or lower.** Duck the music under all narration, put no stinger on a spoken number, drug name or safety line, and re-measure after every re-render. (Over 0.02 in 11 pieces and part of 5 holds, most recently S1 11-26 at 0.056 after two clean days.)
- **Build captions and tags from the script's on-screen text field, never from the narration. Numbers are digits that match the stat pill.** Before render, search for POINT, PERCENT, SEVENTY, SIXTEEN, "TYPE TWO", "TWO DIABETES" and the raw word "Label". (Spelled-out numbers in about 15 Shorts, most recently "ONE POINT ONE", "WAS POINT" and "PERCENT" in S2 11-26. "TYPE TWO" 5 times. A raw "Label" tag 3 times.)
- **The closing safety cards are fixed and pre-split. Never run them through the auto-splitter.**
  - "NOT PERSONAL ADVICE, SO ASK YOUR PRESCRIBER." is one card.
  - The don't-stop line is exactly two cards: "FOR ANYTHING THAT ISN'T ONE OF THOSE EMERGENCY SIGNS" / "DON'T STOP OR CHANGE YOUR MEDICINE ON YOUR OWN." Use "THAT EMERGENCY SIGN" when only one sign is named.
  - The emergency card keeps the guide's full wording, including "healthcare provider", "stomach area" and "with or without vomiting" (cut short in L4 11-26 s65, L1 11-25 s26 and S3 11-25).
  - Read the last 4 cards of every Short before handoff.
  - (The safety line was split at the comma about 9 times, and the don't-stop line broken about 7 times, most recently S1 and S3 11-26.)
- **Every other caption card is one whole clause on 2 lines or fewer.** Never end a card on a comma, dash, colon, semicolon, bare number or possessive, or on THE, A, AS, CAN, LET, ABOUT, HOW, HAVE, THOSE, TAKE, TYPE, YOUR, POINT, ISN'T or DOESN'T. Never split a compound across cards ("SIDE / EFFECTS"). (Found in nearly every Short; on 11-26: "EXTRA STRANDS CAN", "TIRZEPATIDE —", "SEVERE PAIN IN YOUR".)
- **Tags:**
  - Clear the previous card, tags and bubbles, ghosted speech bubbles included, before the next card appears.
  - Shorts: keep tags above y 1150, inside both side edges, never behind the caption pill, and show at most 2 at a time.
  - Long-form: the bottom of every tag, name tags included, stays at y 1000 or less.
  - Every label is at least about 40px and never truncated. Never render an empty bubble or an empty dash-placeholder tag rail.
  - (About 300 Shorts overlap findings; about 385 long-form off-screen and 305 tiny-text findings; dash rails 4 times.)
- **Backdrops:** no teal or green cabinet strips, no hanging ornament circles, and no starfield or bokeh on any beat. Night beats get a dark night room. (Cabinet strips or ornaments in about 32 pieces, including L4 11-26. Starfield or bokeh in about 30. Daytime rooms on night beats 5 times, most recently L1 11-26.)
- **Draw people as whole characters with a neck and shoulders, standing in front of the counter. The counter or the frame edge never crops them.**
  - Lock each character's skin tone, hair and outfit.
  - No ring, blob, outline-only or mannequin heroes, and no mascot on a person.
  - The first frame shows the main character in full. In long-form, the main character fills about a third of the frame height in the first 30 s.
  - Every shot has a labelled hero covering at least about 25% of the frame and draws every element the shot list names, mascots included. Mascots were missing in L3 11-25, L1 11-25, L1 11-26 and S3 11-26, and a calendar in L4 11-26.
  - (Floating heads in about 39 pieces, including L4 11-26. About 260 near-empty findings. Continuity breaks in 8.)

### Scriptwriters
- **Shorts: stay inside the task's length arm and count every word yourself.** Tight arm: 90–120. Standard arm: 135–160. Never over 160. Log the exact count in the post notes (wrong in S2 11-23, unclear in S2 11-25). Scene 1's narration holds the spoken hook (S3 11-22 was held for this). End with "Not personal advice, so ask your prescriber.", then the emergency and don't-stop lines when the topic needs them, then the loop line.
- **Copy the fixed safety lines exactly, and speak and show each one in full.**
  - The emergency line keeps the guide's "stop… and get medical help right away" and "healthcare provider".
  - Don't-stop line: "For anything that isn't one of those emergency signs, don't stop or change your medicine on your own." Say "that emergency sign" when only one is named.
  - Pancreatitis: "with or without vomiting" for tirzepatide, "with or without nausea or vomiting" for Foundayo.
  - Give the full allergy list. List the gallbladder signs in the guide's order: upper stomach pain, fever, yellowing of skin or eyes, clay-colored stools (S2 11-26).
  - Fluid tips keep "unless you've been told to limit fluids". That caveat is our own, so it gets no source tag.
- **Write narration exactly as it should be spoken, and keep it evergreen.** No digits. Spell out contractions outside the fixed lines. Every spoken number names its comparator. Never write "now", "new", dates or "is requiring" ("now" in L1 11-26 s4, s56, s61).
- **Keep each finding at its source's exact number, scope, verb and hedge, recaps included.**
  - Non-inferiority against an active drug is weaker than beating placebo. Never call it a "tougher test". "Did not prove superior" stays exactly that (L2 11-26 was REVISEd for this).
  - "Adverse events" and "adverse reactions" are never "side effects". Postmarketing reports stay labelled "postmarketing". "May be higher" never becomes "is higher". A median stays "median" on every card (L4 11-26 s2, s43).
  - Never add "most", "mostly", "many", "often", "similar", "even" or "a few days". Never present slower stomach emptying as the cause. The SURMOUNT-1 comparator is "placebo plus counseling".
  - Never rank doses the trial didn't compare, never call a single trial "not a fluke", and never call our own arithmetic "the paper's result".
  - Natural-GLP-1 and lifestyle videos never suggest that a risk factor alone qualifies someone for the medicine. Prediabetes alone is not an approved use (L3 11-26 s10, s52).
  - (About 150 findings.)
- **Run the muted-viewer test, starting with the opening card.**
  - The opening card names the drug, and for a head-to-head also the comparator and the outcome. It shows all of sentence 1's answer, hedge included.
  - Every stat card names the measure (mean or median), the drug and dose, both groups, the full population and the timeframe. Never write "no diabetes" and never drop "weight-related".
  - On-screen text is never narrower or stronger than the narration.
  - (About 118 findings, most recently L2 11-26, S1 11-26 and L4 11-26.)

### Carousel Designer
- **Make a carousel only when the scheduler asks, and reuse verified Short text only.** Use the label's term "adverse reactions", keep each trial's full population in the recap, and give every source a real revised date (C1 11-20 was held for a staff note). (All 4 carousels had findings.)

### Social Copywriter & packaging
- **Thumbnail and title numbers show drug and comparator as separate figures. Never merge placebo and drug into one range.** Write "44–62% VS 10% PLACEBO", not "10%–62%". For a use that isn't approved, the subtext says so. Titles name the exact device the video covers. (A merged range caused the L3 11-25 hold.)
- **Long-form descriptions are complete viewer copy of 1,250 characters or fewer.** Line 1 stays empty. Then come the safety block, the quick answer naming both groups, and 2–3 sources, including the Medication Guide whenever you quote its emergency wording. End exactly on "…whether it's right for you." with no markup, brackets or placeholders. (Cut off, leaked markup, a placeholder or a missing ending 7 times.)
- **Name one watch-next target in the post notes of every long video and Short, and let the publisher add the link. Never write a placeholder line.** Follow the playbook's link list. Head-to-heads (vs Ozempic or vs dulaglutide) → Zepbound vs Wegovy. The target matches the piece's drug and population. Never the home page, and never MQqAwUKAKSI. (Missing, wrong or a placeholder in 8 pieces, most recently L2 11-26.)
- **Every caption field ends exactly on "Not personal advice. Talk to your doctor or prescriber about whether it's right for you."** Hashtags and the don't-stop line go before it. Copy the emergency line in the script's own words, and write "that emergency sign" when only one is named. Threads is about 300 characters: cut facts, never safety lines. (Threads over the limit about 46 times. Emergency line paraphrased 6 times.)
- **Copy facts, measures, populations, device scope and attributions word for word from the verified script, on every platform and in the pinned comment.** Keep the trial population on TikTok and Threads. Keep the "US single-dose pen" scope and the KwikPen/vial line on pen posts. Keep drug names outside quoted label text. Never list our own tips under "the label says". Never add openers the script doesn't have (questions, validation lines, "actually"). (About 175 findings, in every batch.)
- **Titles, thumbnails, first lines and hashtags keep the video's hedge and scope.** Make no cause, timeframe or "common" claim the content doesn't make. In holiday Shorts the holiday is the setting, never the cause ("Diarrhea After Thanksgiving" in S3 11-26 and "Threw Up After the Big Dinner" in S3 11-23 both broke this). Use one save or share ask, never an open question. Hashtags are only the generic names of drugs whose data the post reports. Never #Foundayo, #GLP1, #weightloss, #obesity, #sideeffects, symptom tags or trial tags. (About 75 pieces.)

### Everyone
- **Never re-produce a video that is live or already made. Fix the known faults, then re-render or publish.**
  - **Serious Risks (L1 11-26, held; until 2026-11-30):** don't script it again; it is re-timed. Regenerate the "tears appetite" and "moongiaro" scenes and re-check the transcript. Drop "now" in s4, s56 and s61. s25: say "postmarketing reports". s26 and s29: remove the source tags from our own caveat and our own tip. S2: confirm the Medication Guide's real revised date. Description: cite the Medication Guide for the emergency wording.
  - **Mounjaro vs Dulaglutide (SURPASS-CVOT, L2 11-26, REVISE):** don't script it again. Before render: s9 describes non-inferiority against an active drug, not a "tougher test". The s1 card names dulaglutide and the outcome (heart attack, stroke or cardiovascular death). s23: remove the source tag. Post notes: name the watch-next target.
  - **Nature's Ozempic: Oats and Fibre (L3 11-26, REVISE):** don't script it again. Before render: S3, S10 and the stat labels in s4 and s46 use Mounjaro's date (27 Aug 2026), not Zepbound's. s10 and s52: weight-management use needs obesity, or overweight plus a weight-related condition, and prediabetes alone isn't an approved use. s31: "adults with type 2 diabetes on metformin".
  - **Semaglutide (Ozempic) and Kidney Disease (L4 11-26, made):** don't script it again. Before it publishes: the s65 card says "healthcare provider" in full; the s2 and s43 cards say "median" 3.4 years; S2 and S6 carry the date printed on each linked document (DailyMed PI "Revised: 5/2026"; if the Medication Guide shows no date of its own, take it from DailyMed for that set ID).
  - **Fatty Liver / MASH (L3 11-25, held):** don't script it again. Before it publishes: thumbnail "MASH RESOLVED: 44–62% VS 10% PLACEBO" with the subtext "ONE PHASE 2 BIOPSY TRIAL · NOT AN APPROVED USE". Description: label the 30% as placebo and give the full population. Fix the truncated "Tirzepa" tag. Spell out the contractions in s1, s3 and s80. s52: drop "often". Add S12's real revised date.
  - **Tirzepatide After 6 Months (L1 11-25, held):** don't script it again. Regenerate the "tears appetite" scene and re-check the transcript. s13: "placebo plus counseling". s26: full emergency wording on the card. s3: add the sleep apnea approval.
  - **Zepbound Single-Dose Vial vs Pen (L4 11-25, made; until 2026-11-30):** don't script it again. Replace the bracketed watch-next line with the post-note target. Title: "Single-Dose Pen". s19: "press and hold for up to 10 seconds". S2: use the separate Medication Guide URL (pi.lilly.com/us/zepbound-us-mg.pdf). S3 and S4: give each leaflet its own revised date. s6: credit the FDA sharps guidance too.
  - **S1 11-26 Hair Shedding (held):** remix to 0.02 or lower and rebuild the don't-stop line as two cards. Don't rewrite the script.
  - **S2 11-26 Right-Rib Pain (REVISE):** add the Medication Guide's real "Revised: 11/2026" date and reorder the gallbladder signs.
  - **Foundayo What to Expect (made 11-24, ssb7Zcs3KSY):** never script it again. Confirm the description and pinned comment carry the Medication Guide's emergency wording and "permanently stopped treatment because of adverse reactions", with the drug name outside the quoted label text.
  - **Already live, never make again:** Mounjaro vs Ozempic (SURPASS-2) since 11-23, and Months 2–6 since 11-16.
  - **S3 11-22 (holiday slot, until 2026-11-27):** restore the hook, remix to 0.02 or lower, and recount to 160 words or fewer.
  - **Backups (Injection Site 11-09, Burping 11-10; until 2026-11-30):** re-time both on the render before they ship.
- **Every source needs its own working URL and a real revised date that belongs to that exact document. Never a placeholder, a bare year, a staff note or another drug's date.**
  - Mounjaro and Zepbound share a molecule but have separate labels and dates. Never copy one onto the other (L3 11-26 was REVISEd for this).
  - A label's printed "Revised" date and its SPL or FDALabel effective date can differ. Cite the date for the document you link, and say which one it is (L4 11-26).
  - The Medication Guide and the IFU each get their own URL. Find the quoted sentence before you cite it. Source titles list only the sections cited, with numbers.
  - No 4xx errors, newsroom pages or search pages. If a PDF's date can't be read, take it from DailyMed or FDALabel for that set ID (S2 11-26 was REVISEd for a placeholder; C1 11-20 was held for a staff note).
  - Known dates:
    - Mounjaro PI and Medication Guide: 27 Aug 2026 (SPL version 40)
    - Zepbound (only): DailyMed label updated 16 Nov 2026; Medication Guide "Revised: 11/2026"
    - Ozempic: printed PI "Revised: 5/2026"; FDALabel effective 1 Jun 2026 (version 20)
    - Foundayo label: rev 7/2026
    - NHS nausea page: 17 Nov 2023
  - Our own tips and safety lines get no source tag (L1, L2 11-26).
  - (About 110 findings.)
- **Give every result its exact scope.**
  - Obesity trials: adults with obesity, or overweight plus a weight-related condition, without diabetes. Prediabetes alone is not an approved use.
  - Pooled label data: Study 1 (no type 2 diabetes) and Study 2 (type 2 diabetes only), treated for up to 72 weeks.
  - Zepbound's uses include moderate to severe obstructive sleep apnea in adults with obesity.
  - SELECT: preexisting CV disease and a BMI of 27 or more, without diabetes.
  - SURPASS-2: adults with type 2 diabetes on metformin, 40 weeks, each arm vs semaglutide 1 mg.
  - SURPASS-CVOT: 13,299 adults, tirzepatide vs dulaglutide, 12.2% vs 13.1% (HR 0.92). Non-inferior; not shown superior (P=0.09); no placebo group.
  - MASH: one phase 2 biopsy trial; not an approved use.
  - SURMOUNT-4: +14.0% regain on placebo, still 9.9% below baseline.
  - 75/25: from the 160-person DXA substudy.
  - Low blood sugar: "may be higher" with insulin or a sulfonylurea, and also reported in adults without type 2 diabetes.
  - Pancreatitis: give 0.23 vs 0.11 only alongside 0.14 vs 0.15.
  - Gallbladder: gallstones 1.1% vs 1%; inflammation 0.7% vs 0.2%.
  - Hair loss: 5.4% vs 0.9%.
  - Injection-site reactions: 6–8% vs about 2%.
  - Pen: 21 days in total; press and hold for up to 10 seconds. The guide bans *loose* pens in household trash.
  - Foundayo: top label dose 17.2 mg, −11.1% in Trial 1; 10.3% vs 2.7% stopped for adverse events at 36 mg.

_Updated 2026-11-26 from 76 QA records (all GLP-1, 11-13 to 11-26)._

_Updated 2026-11-26 from 76 QA records._
