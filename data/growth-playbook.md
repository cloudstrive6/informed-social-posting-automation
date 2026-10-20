# Growth playbook (Growth Strategist, 2026-10-20)

_Verdict: off track. Bottleneck: Long-form views, and with them watch hours. We have about 684 lifetime long-form views, roughly 45 hours at an estimated 4 minutes per view, against the 4,000 hours we need. The current pace is about 27 long-form views a day; Feb 2027 needs about 460 a day. The GLP-1 long-form median is 11 (n=12) and the last 7 have a median of 8, so it's getting worse.

What drives it:
1. **Topic choice.** Approved-drug single-trial deep dives get a median of 6 (n=6). We compete with large, established channels there, and the topic usually repeats the same day's Short (SURMOUNT-5: 157 as a Short, 6 as a long-form).
2. **Titles nobody searches for.** Examples: "Retatrutide (T2D+Obesity): Lilly's 20.8% Weight Loss vs 4% at Wk 80" and "Survodutide… 9.8% vs 3.9% at 76wk (High Dose)". They pack in several numbers and abbreviations and don't start with any phrase people type.
3. **No funnel.** Shorts reach about 165 YouTube views a day at about 55 each, but no Short, pinned comment or related-video link sends anyone to a long video.
4. **Repeating failed formats.** On 10-19 we shipped "Retatrutide approved yet?" even though status titles got 14 and 18 views. The "Did Retatrutide Beat Tirzepatide?" long-form uses the "Did X beat Y?" frame that got 4 views for CagriSema, and there is no head-to-head trial behind it.

Process: production is reliable. GLP-1 holds since 10-13 are 2 of about 35 pieces. 10-11 was a missed day and 10-19 is unlogged. Quality-check failures are still shipping: masking of 0.034 went out on 10-19, and 7 wrong numbers have appeared on screen so far. On a medical channel that is a credibility and policy risk.

Carousels use one production slot a day for 0–3 reach (n=23, proven).

We can't see subscribers, watch hours, retention, CTR or traffic sources: partner_progress is null because the YouTube Analytics API isn't enabled._

# InforMed growth playbook: week of 2026-10-20

**Goal this week:** lift the long-form median from 11 to 30+ by 10-31. Long-form watch time is the only thing that gets us into YPP. Shorts exist to win subscribers and send viewers to long videos.

## Long-form (1 a day): every one belongs to one test lane
Plan the week like this:
- **3× Lane A, search question (Exp A).** Start the title with the exact phrase people type. Examples:
  - "Tirzepatide (Mounjaro) Side Effects: Which Are Common and What Helps"
  - "How Long Does Tirzepatide Take to Work? Week by Week in the Trials"
  - "What Happens When You Stop Semaglutide or Tirzepatide?"
  - "Ozempic vs Wegovy vs Mounjaro vs Zepbound: What's the Difference?"
  - "What to Eat on Tirzepatide: Protein, Fibre and Easier Meals"
- **2× Lane B, gray-market "what's confirmed" (Exp B).** Examples:
  - "Retatrutide Online: What the FDA and Lilly Have Confirmed (Oct 2026)"
  - "Counterfeit Semaglutide and Tirzepatide Pens: What the FDA Says to Check"
  - Credit every line to the FDA, MHRA or the manufacturer, with a date. Never name a seller or explain how to buy. Point viewers to a prescriber about approved options or trials.
- **Up to 2× Lane C, first explainer (Exp C).** Only for a named drug, trial or result first reported within the last 48 h. Put the new name first in the title.
  - If there's no fresh news, make another Lane A.
- **Banned:**
  - Long-forms that repeat a topic we covered as a Short in the last 14 days.
  - Deep dives on a single old trial of an approved drug.
  - "Did X beat Y?" unless a randomized head-to-head trial exists. If the comparison is indirect, the title says "indirect".
  - Standalone "Is X approved yet?".
- **Log the lane** (A/B/C) in each long-form's metadata so the analyst can score it.

## Long-form packaging (title writer, thumbnail designer)
- **Title:**
  - 60 characters or fewer, starting with the searched phrase. Generic name first, brand in brackets.
  - At most 1 number. No abbreviations (T2D, wk, HF, CV, OSA).
  - It must be fully paid off in the video.
- **Thumbnail:**
  - 4 words or fewer, never a repeat of the title.
  - One labelled character or drug object, plus one honest emotion (curious, relieved, surprised).
  - No body shaming, no fear faces on approved-drug safety topics.
- **Description:** line 1 repeats the searched phrase as a plain sentence, then follow the existing order rules.

## Long-form retention (scriptwriters)
- **0–15 s:** say exactly what the viewer will know by the end, and give the first concrete answer.
- **Re-hooks:** add one every 45–75 s ("the part most people miss is next…").
- **Chapters:** named after the questions people search for.
- **Subscribe ask:** one, after the main payoff, tied to the series ("we decode every new GLP-1 result").
- **Ending:** name one specific, already-published long-form to watch next in the same lane, then the end screen.
- **Series names**, to be said aloud and used in playlists: "What's Actually Confirmed?", "Head-to-Head", "New GLP-1 Drug Decoded", "Life on GLP-1".

## Shorts (3 a day)
- **13:00, lead Short:** a gray-market "what's confirmed?" Short (median 103.5, n=4), or a two-drug body-effect head-to-head with both drugs named (median 74.5, n=4; also the only format that works on Instagram).
- **08:00:** a tirzepatide muscle outcome question ("how much is muscle?") or a second head-to-head.
- **20:00, funnel Short:** a spin-off of a long-form that is already live. Use a single-drug body-effect question, and run it the day after its long-form.
- **Every Short with a related live long-form:**
  - The last spoken line is "Full breakdown: [exact long-form title], on our channel."
  - The pinned comment and the first description line carry its link.
  - Only name videos that are already published; otherwise say "follow for more".
- **Banned in Shorts:**
  - "Is X approved yet?" titles (14 and 18 views). Put the dated status inside a named comparison instead.
  - How-to or list titles ("3 Ways…": 27).
  - Unnamed comparators.
  - Scare framing of approved drugs.
  - Titles that name no drug.
- **Variety guard** (YouTube's inauthentic-content policy):
  - Use any one trial (e.g. SURMOUNT-5) in at most 1 Short a week.
  - Never post two same-template titles back to back.
  - Every piece must add a fact we haven't published before.

## Quality gates (non-negotiable; protect monetization)
- **Masking:** any Short or long-form with masking above 0.03 does not ship. Remix it or drop it.
- **On-screen numbers:** search the captions for number words before render. Every number on screen must match the script's numerals exactly.
- **Required lines:** every piece keeps "talk to your doctor or prescriber about whether it's right for you". No dosing, no switching or stopping advice, no compounded or online sources.

## Carousels (until the owner decides)
- Spend the least possible effort on them: reuse the verified text from a published Short. No new research for carousels.

## Experiments running (apply exactly)
- **Exp A (search-question long-forms):** 3 this week, labelled lane A.
- **Exp B (gray-market long-forms):** 2 this week, labelled lane B.
- **Exp C (first explainer within 48 h):** only when news qualifies, labelled lane C.
- **Hold constant across all three:** slot 14:00 ET, 8–12 min, the same retention rules.
