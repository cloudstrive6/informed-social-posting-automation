# InforMed performance playbook (updated 2026-10-27)

## Data status: read first
- **New today:** monetization_progress, plus per-video retention for most YouTube posts: watch minutes, average view duration (AVD), % viewed and subscribers gained. This is the first time retention can be scored.
- **Sample:** 41 GLP-1 YouTube Shorts, 17 GLP-1 long-forms (petrelintide only 2 days old), 4 plague long-forms, about 33 carousels. TikTok, Facebook and Threads metrics are still null. CTR and traffic sources are still missing.
- **Two counters disagree. Treat both with care:**
  - `shortsViews90 = 0` is clearly broken: our Shorts have thousands of views.
  - `longViews28 = 5,718` is about 5× our logged long-form views, so it is probably counting all views on the channel.
  - The analytics `views` field lags `viewCount`. Use viewCount for reach and the analytics fields for retention.
- **Still not logged:**
  - Elecoglipron long-form (10-26) and all of 10-26.
  - 10-24 S1/S2 and 10-25 S1 (dropped for masking).
  - Lane labels in metadata.
- **Proof bar:** proven = n≥8, signal = n 4–7, anecdote = n≤3. Posts 1–3 days old are early.
- **Accuracy comes before any tactic.** Every piece keeps "talk to your doctor or prescriber about whether it's right for you". No dosing, no switching or stopping advice, no compounded or online sources.

## Monetization reality (the gate is watch hours, not subscribers)
- **Official counters:** 155 of 4,000 watch hours (3.9%) and 373 of 1,000 subscribers (37%). Subscribers are 10× further along than watch hours, so every decision is about long-form watch minutes.
- **Our long-forms average about 4.5 min watched per view (AVD median 265 s, n=16).** That means we need about 51,000 more long-form views.
  - At today's pace (about 5 h a day, much of it from EloraTZP), that takes years.
  - To get there in about 4 months, we need about 10× the views per long video.
- **Logged per-video watch time adds up to only about 43 h.** EloraTZP alone is 1,474 min (about 25 h, 57% of the logged total). The owner should reconcile this with the 155 h counter.
- **Long-forms convert subscribers; Shorts almost never do.**
  - Long-forms: EloraTZP +7, Strength +1, How Long +1.
  - Shorts: 2 subscribers from about 41 Shorts.

## Long-form: what earns watch minutes (n=16 with analytics)
- **Medians:** 24 views (viewCount, n=17) and 45 watch minutes per video.
- **Top watch minutes:** EloraTZP 1,474, Orforglipron 162, Strength Training 129, How Long 122, Survodutide 119.
- **Lane A, practical tirzepatide, holds viewers best (signal, n=4).** It also has the highest watch-minute median outside the EloraTZP outlier.
  - % viewed: How Long 53%, Side Effects 50%, Strength 39%, What to Eat 35%.
  - Watch-minute median about 91 (129, 122, 53 at day 3, 39).
  - AVD of 366–400 s on the best ones.
- **Lane C / next-gen gets the occasional outlier but holds viewers less (signal, n=7).**
  - % viewed: 20–48% (Orforglipron 48% is best).
  - Watch-minute median 51 without EloraTZP.
  - **Petrelintide "What Is…?" had 4 views at day 2 (anecdote).** A new drug name alone doesn't pull. EloraTZP won with a big head-to-head number for a drug people already know.
- **Approved-drug single-trial deep dives (n=3): about 35 min median, 8–29 views.** Cost and pharmacy (n=2): 0–20 min. These stay paused.
- **Implication:** split the long-form slots between Lane A and Lane C evenly. Don't send every day to Lane C because of one outlier.
  - Use Lane C only for real headline numbers or head-to-heads on drugs people search for (retatrutide, CagriSema, orforglipron, tirzepatide combos).
  - Use Lane A on every other day.
- **Retention pattern:**
  - A concrete "you" scenario with an answer in the first 15 s (How Long, Side Effects) beats an opening that is mostly a trial's numbers.
  - The menopause sub-analysis held only 20% and Plague Today only 2%: an open loop that needs too much setup loses people.
- **Test (hypothesis):** a body-worry long-form, "Tirzepatide and Your Bones, Muscle and Hair: What the Evidence Says". Its Short twins reached 231 (bones) and 134 (nausea). Score it at day 7 on watch minutes, not views.
- **Title rules are still unvalidated (no CTR data).** Keep them for clarity: about 60 characters or fewer, drug name first, at most 1 number.

## YouTube Shorts (median 58 views, n=41)
- **Retention predicts reach (proven).**
  - Shorts held at ≥70% average view: median about 103 views (n=8: 262, 199, 133, 117, 94, 68, 58, 36).
  - Shorts below 30%: mostly 5–65 views. Exceptions are macular 104 and 7.2 mg 103.
  - Loopable endings went past 100% (retatrutide T2D 108%, heart failure 188%).
  - Answer in the first 5 s, keep it to one idea, and loop the last line.
- **Generic "tirzepatide" in the title (proven): median about 102 (n=15).** Brand-first titles (Mounjaro, Medicare Wegovy/Zepbound) get 33–37.
- **Body-worry "honest uncertainty" Shorts (signal, n=5):** bones 231, nausea 134, macular 105, grip 8. Calm question, honest answer from a new review, then what you can do.
- **Retatrutide gets the highest peaks (n=7):** 262, 199, 120, 71, 40, 25, 25. New Phase 3 data and "what's confirmed?" angles win. Status titles don't.
- **Two-drug head-to-heads with tirzepatide named first (signal): median about 104 (n=5).** Use a different trial each time.
- **Gray-market "what's confirmed?" (signal): median 105 (n=7).** Shorts only, at most 1 a week.
- **Muscle works as an outcome question (133, 102), not as a how-to list ("3 Ways", 32).**
- **Semaglutide-only titles underperform (median about 33, n=6).** Exception: body-worry topics where the evidence is semaglutide (macular 105).
- **Banned:**
  - "Is X approved yet?" titles.
  - Observational surgery angles (5).
  - Cost or coverage Shorts.
  - Status Shorts on orforglipron or trevogrumab.
  - Scare framing.

## Instagram Reels
- **Instagram doesn't track YouTube (proven).**
  - Calm body-worry and side-effect Reels win: macular 160, grip 139, nausea 113, GI 103, heart failure 99.
  - Petrelintide reached 101 on Instagram but only 12 on YouTube (anecdote).
  - Gray-market, recall, cost and status Reels reach 0–29.

## Funnel (still untested; biggest lever after topic)
- **No Short has ever carried a working link to a live long-form.** The publisher has written the verified line-1 link automatically since 10-27, so Exp D starts now.
- **For each 20:00 funnel Short, log the target long-form's views for the 3 days before and after it.**
- **Targets in order:** that day's live Lane C long-form, then Strength Training (68), EloraTZP (575), Side Effects (23).
- **Every long-form names one verified live long-form at the end** and goes into a playlist ("New GLP-1 Drug Decoded" or "Life on GLP-1").

## Slots and length
- **Slot effect is small; topic decides.**
  - Shorts: 08:00 ET median about 58, 13:00 ET about 66, 20:00 ET about 81 (n≈10–12 each).
  - Long-form at 14:00 ET.
- **Shorts length (57–111 s) doesn't predict views.** Aim for 60–85 s and 170 words or fewer.
- **Long-form at 11–14 min gets 4–7 min watched.** Don't pad to make it longer. Cut setup so the % viewed rises.

## Production
- **Music masking has cost at least 6 Shorts.** Mix at 0.02 or lower the first time.
- **Carousels reach 0–3 (proven, n≈33).** Reuse verified text only, or drop them.

_Updated 2026-10-27._

## Topics to double down on
- Lane A practical tirzepatide long-forms with a 'you' scenario and an answer within 15 s, which hold viewers best (How Long 53% viewed, Side Effects 50%, Strength 39%): 'Protein on Tirzepatide: How Much and Why', 'What Happens When You Stop Tirzepatide?', 'Tirzepatide and Hair Loss: How Common and What Helps'
- Test long-form: 'Tirzepatide and Your Bones, Muscle and Hair: What the Evidence Says' (honest uncertainty; its Short twins reached 231 for bones and 134 for nausea), scored on watch minutes at day 7
- Lane C long-forms only for real headline numbers or head-to-heads on drugs people search for (retatrutide, CagriSema, orforglipron, tirzepatide combinations), modelled on EloraTZP (575 views, 1,474 watch minutes, 7 subscribers). Avoid bare 'What Is [obscure drug]?' (petrelintide 4 views at day 2)
- Calm 'honest uncertainty' body-worry Shorts from a new review or trial (bones, nausea, gallbladder, pancreas, hair), with tirzepatide in the title where the evidence covers it. These win on YouTube and Instagram
- Retatrutide-named Shorts on new Phase 3 data or 'what's confirmed?' facts with a loopable ending (262 and 199 views, 87–108% viewed)
- Two-drug head-to-head Shorts with tirzepatide named first and a different trial each time (median about 104, n=5)
- Tirzepatide muscle outcome questions ('How much of the weight lost is muscle?'; 133, 102), never how-to lists
- Verified-link 20:00 funnel Shorts pointing to Strength Training on Tirzepatide, EloraTZP and Tirzepatide Side Effects (Exp D now live)

## Schedule suggestions (for the owner — edit config/channel.json to apply)
Status as of 2026-10-27

**The short version**
For the first time we have the official counters: 373 subscribers (37% of the 1,000 needed) and 155 watch hours (3.9% of the 4,000 needed). Subscribers aren't the problem. Watch hours are.

A long video gets about 4.5 minutes watched per view. That means we need roughly 51,000 more long-video views. Today we get about 25–60 per video, plus the occasional EloraTZP (575 views, 25 hours by itself).

**What the new retention data shows**
- Practical tirzepatide long videos keep viewers watching longest:
  - How Long: 53% watched.
  - Side Effects: 50%, or about 6.5 minutes per view.
  - Strength Training: 39%.
- Outside EloraTZP, these practical videos earn as many watch minutes as new-drug news videos, or more.
- The petrelintide explainer has only 4 views after 2 days. A new drug name alone doesn't bring viewers.
- Shorts that people watch to the end (70% or more) get about twice the views of Shorts they swipe away from. Retention in Shorts matters more than the topic label.
- Almost all new subscribers come from long videos. EloraTZP brought in 7. Shorts brought in 2 in total.

**Publish slots (no change)**
- Shorts at 08:00, 13:00 and 20:00 ET. The medians are about 58, 66 and 81 views, a small difference.
- Long video at 14:00 ET.
- Alternate the long video's topic:
  - Big new-drug news on names people know (retatrutide, CagriSema, orforglipron, tirzepatide combinations), when there's a real headline number.
  - Otherwise, practical tirzepatide topics: protein, stopping, hair, and a bones/muscle/hair evidence video this week.
- Keep cost, Medicare and pharmacy topics paused for long videos.
- 17:30 carousel: I still recommend stopping it. Reach has been 0–3 across about 33 posts.

**Fixes, in priority order**
1. **Fix two broken counters.** "Shorts views (90 days)" shows 0. "Long views (28 days)" shows 5,718, about 5× what our videos add up to, so it is probably counting every view on the channel. Also, the 155 watch hours don't match the roughly 43 hours our logged videos add up to. Please check this in YouTube Studio. Also add click-through rate and traffic sources.
2. **Funnel links.** They start working automatically from today. Leave this experiment running for 7 days without changes so we can measure whether Shorts send viewers to the long videos.
3. **Log the missing posts.** The elecoglipron long video (10-26) and the rest of 10-26 are still missing. Tag every long video A, C or P.
4. **Lower the Shorts music level in the template** to stop masking drops.
5. **Build the playlists** "New GLP-1 Drug Decoded" and "Life on GLP-1", and add every long video to one of them.
6. **Next review around 10-29:** petrelintide and elecoglipron at days 3–4, Side Effects at day 5, and the first funnel-link results.

_Updated 2026-10-27 from 334 posts._
