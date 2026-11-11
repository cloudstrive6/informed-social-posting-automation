# InforMed performance playbook (updated 2026-11-11, evening read)

## Data status: read first
- **Counters (11-11 18:53 UTC):** 161 of 4,000 watch hours (4.0%), 384 of 1,000 subscribers, 13,482 Shorts views in 90 days, 3,277 long-form views in 28 days. Both are unchanged since the 11:42 read.
  - Watch hours are growing about 8 h a day. A February YPP needs about 35 h a day, so we need roughly 4× today's long-form minutes.
  - Subscribers have been stuck at 384 since about 11-09.
- **FRESHNESS:** every long-form row is the same as in the morning read. That includes traffic minutes (Side Effects 942, Stopping 171), impressions and CTR, and Hair Loss at 11 views. Treat these numbers as frozen, not flat.
  - Only Shorts view counts moved (injection-sites Short: 119 → 129).
  - This feed has no `life_` fields or minutes fields, and `older_youtube_totals` shows 0 views and 0 minutes. That is a reporting gap, not real zeros.
  - The lifetime figures below come from the 11-11 morning read.
- **Gaps:**
  - Nothing is logged for 11-07 or 11-08.
  - 11-09 and 11-10 rows have view counts only.
  - No 11-10 or 11-11 long-form is in the feed: the 11-10 and 11-11 L1s were held, per QA.
  - The day-7 checks for Birth Control and Fatigue can't be done until the long-form rows refresh. Their numbers here are from day 3–4.
- **Proof bar:** proven means n≥8, signal n=4–7, anecdote n≤3. Judge nothing under 7 days old. Don't read impressions or CTR from the last 3 days. TikTok, Facebook and Threads metrics are null.
- **Accuracy and safety lines come before any tactic. The fact-checker always wins.**

## Monetization: what earns watch time
- **EloraTZP (10-01) is our biggest asset (anecdote, n=1, lifetime figures from the morning read).**
  - 4,306 of about 9,560 lifetime long-form minutes (45%) and 11 subscribers.
  - 8.37% CTR on 7,153 impressions, with search-led views ("eloralintide" 59, "eloratzp" 33).
  - The model: a fresh randomized result against tirzepatide, published within days. Evergreen "Did X beat tirzepatide?" videos flopped: CagriSema 104 min, retatrutide 70, SURMOUNT-5 34.
- **Lane A (practical tirzepatide) is the steady engine (proven, n=14).** It has about 38% of lifetime long-form minutes.
  - 28-day minutes, summed from traffic sources: Side Effects 942, What to Eat 785, Strength 587, Bones 241, How Long 230, Food Noise 197, Stopping 171, Protein 160, Thanksgiving 93 (up from 17 at the earlier snapshot), Plateau 87, Constipation 72, Hair 11, Birth Control 1.
- **Suggested videos carry Lane A (proven).** RELATED_VIDEO brings 74–86% of minutes on the big three, at 5–7 min a view.
  - The referrers are mostly large outside channels: "An Ozempic Overdose Hour by Hour" (15 views to Side Effects), "The Tirzepatide Boom Just Hit a Wall" (11), "It's not just your appetite that Ozempic changes" (10 to What to Eat).
  - Package for that audience: tirzepatide plus a felt problem, a plain question, and a state-change thumbnail.
- **Internal suggested links are starting to form (signal).**
  - Side Effects sends viewers to Bones (6) and How Long (2).
  - Strength and Orforglipron each send to How Long (2).
  - These are our only working long → long paths. Strengthen them with end screens.
- **Approved drugs with search demand earn; pipeline explainers don't.**
  - Orforglipron: 262 min, 111 of them from search ("foundayo" 19).
  - Pipeline explainers: petrelintide 218, elecoglipron 102, retatrutide 70.
  - Medicare got 30 min and the pharmacy video 71.
- **Pickup comes around day 5–10. Don't call a Lane A video dead before day 10 (signal, n=4).**
  - Stopping (day 5): 171 min, 8.86% CTR on 237 impressions. Build next to it.
  - Hair Loss (day 7): 94 impressions, 1.06% CTR, 0 RELATED views. This is a packaging and discovery failure. Fix the title, thumbnail and links, not the video.
- **Don't make more:** plateau or general protein and diet long-forms.
  - Protein: 197 of its 218 views came from subscribers, and those views earned 104 min, about 0.5 min each.
- **Output is now the bottleneck.** Long-form days were lost on 11-03, 11-07, 11-08, 11-10 and 11-11 (holds or gaps). Each clean Lane A video is worth about 3–15 watch hours in its first month. A lost day costs more than any tweak to packaging.

## Long-form retention (d7 curves, n=14, compared within long-form only)
- **The median hold at 30 s is about 77%.**
- **The biggest drop comes at 12–35 s (2–4% into the video) in 11 of 14 curves (proven).** That's where the open loop or roadmap starts:
  - Strength: −36 points at 21 s
  - Elecoglipron: −30 at 16 s
  - Protein: −17 at 12 s
  - What to Eat: −16 at 23 s
  - Petrelintide: −16 at 24 s
  - Retatrutide: −15 at 35 s
  - Side Effects: −13 at 16 s
  - EloraTZP: −12.5 at 25 s
  - **Fix to test:** at 15–30 s, give a second concrete payoff (one number or the first practical step), keep the open loop to one sentence, and never use a roadmap or channel intro there.
- **The other 3 curves drop late, at 73–85%:** How Long at 85%, Plateau at 84%, Bones at 73%. That's where the recap, checklist and when-to-call block begins.
  - **Fix:** land the last promised payoff before that block, keep the safety block tight and complete, and start the end-screen ask at about 85%.
- **"You" scenario openings hold best (signal, n=7):** s30 of 77–90% in 6 of 7 (Petrelintide 89.5, Plateau 83.3, Bones 82.8, What to Eat 81.4, How Long 79.5, Side Effects 76.7).
  - Protein (51.8) is the exception; its audience was almost all subscribers.
  - Direct question with the answer first: retatrutide 78, EloraTZP 77.
  - News or "stakes" openers: 63–72.
  - A counterintuitive claim that doesn't match the title: Strength 41. Deliver the title's literal promise within 15–20 s.
- **The midpoint is weak (proven).** `relative_pct_mid` has a median of about 38 and is below 50 on 10 of 14 videos (lowest: EloraTZP 18.6, retatrutide 20.3, Bones 21.3).
  - The exceptions are Strength 84, Plateau 80 and Protein 70.
  - Re-hook every 45–75 s, with a payoff before each chapter change.
- **Length (signal, n=6):** cuts of about 10 min give the best AVD. Aim for 9–11 min.

## Packaging
- **Titles (signal):** use "Tirzepatide (Mounjaro) …". "mounjaro" is the top Lane A search term (Side Effects 10, What to Eat 7, How Long 4), and "zepbound" brought 8 to Strength. Generic name first; the brand is for recognition only.
- **Thumbnails (signal, only videos with ≥300 impressions):**
  - before-after / state change: Side Effects 4.18%, How Long 4.66%, Protein 3.63%
  - big number: What to Eat 2.81%, Orforglipron 4.09%, Plateau 3.15%
  - reaction: Strength 2.13%, Bones 2.93%, Thanksgiving 2.99%, Petrelintide 4.8%
  - Default to a state change with 4 words or fewer. Search-led videos get higher CTR whatever the layout.
- **Exp E** (What to Eat and Strength swaps): read it on 11-24 and change nothing before then.

## Shorts → long funnel
- **Still zero (proven, 23 long-forms).** SHORTS and END_SCREEN traffic is 0, and PLAYLIST has about 10 views in total.
  - Links in Shorts descriptions aren't clickable. The only working levers are the Studio related-video link, end screens, line-1 ▶ Watch next links in long-form descriptions, and playlists.
  - EloraTZP is our highest-traffic page and points nowhere. Fix that first.

## YouTube Shorts (channel median about 63 views)
- **Calm body-worry Shorts with tirzepatide in the title are the best format (proven, n≈22).**
  - Hair grow-back 1,025, bones 244, injection site 242, nausea 180, BP 138, breakfast 131, injection sites #2 129 (day 1–2), hair common 113.
  - Injection site is a proven repeat theme.
- **Underperformers (proven):**
  - niche, survey or add-on trial angles: nails 13, PsA 33, birth control 37, prediabetes 44
  - seasonal angles posted too early: Thanksgiving 21
  - news-only items: orforglipron BP 23, NAION label 34, lifting RCT 13 (all early reads)
- **Retatrutide:** new Phase 3 data or a "what's confirmed?" angle gets 82–280. Approval-status titles get about 56.
- **Head-to-heads:** tirzepatide-first ones in an obesity population get 109–177. Diabetes-only ones get 33–63.
- **Spikes come from the feed, not retention.**
- **Banned:** observational, survey or grocery angles, surgery, cost and Medicare, "3 Ways" lists, semaglutide-only titles, drug names nobody searches for.

## Subscribers
- **Long-form converts about 5–7× better than Shorts:** EloraTZP gave about 6 per 1,000 views, Lane A about 2.6, Shorts about 0.4. More long-forms is the subscriber lever.
- **Exp F** (subscribe line on 08:00 and 13:00 Shorts): about 380 views across 10 Shorts since 11-04, with no measurable effect. Those slots also drew weaker, newsier topics, so the test is confounded. End it on 11-17 as inconclusive.

## Instagram Reels (proven, n≈45)
- **Reach is all or nothing:** about 100–193, or 0–14.
- Calm body and life-on-drug topics win.
- Don't use IG to pick YouTube topics.

## Slots and production
- **The slot effect is negligible (proven).** Keep Shorts at 08:00, 13:00 and 20:00 ET, and the long-form at 14:00 ET.
- **Carousels reach 0–4 (proven, n≈58).** Remove the 17:30 slot.

## Priority actions
1. **Never skip a long-form day.** Keep a QA-passed backup Lane A render ready. If L1 fails beat sync or masking, ship the backup.
2. **When a named drug gets a fresh randomized result against tirzepatide:** ship "Did X beat tirzepatide?" within 48 h as an extra L2.
3. **End screens and line-1 ▶ Watch next links:**
   - EloraTZP → Side Effects / Stopping
   - Side Effects → Bones / Injection Site
   - What to Eat → Thanksgiving
   - Strength → Bones
4. **Hair Loss:** state-change thumbnail, a "(Mounjaro)" title, and the Studio related-video link from the 1,025-view hair Short.
5. **Next Lane A topics:**
   - injection site reactions
   - keeping results after stopping
   - alcohol (label-based, no "safe amount", with the low-blood-sugar caveat for insulin or sulfonylureas)
   - burping and heartburn
   - dehydration
   - plus a Foundayo (orforglipron) what-to-expect video, label only
6. **Check-ins, once the long-form rows refresh:**
   - Birth Control and Fatigue at day 7+
   - the 11-09 diarrhea long-form at day 7 (11-16)
   - Exp F ends 11-17
   - Exp E on 11-24

_Updated 2026-11-11 from ~440 posts and 46 older YouTube videos. Long-form rows are frozen since the morning read._

## Topics to double down on
- Fast-turn 'Did X beat tirzepatide?' long videos within 48 h of a fresh randomized head-to-head with real search demand (EloraTZP: 4,306 lifetime minutes, 45% of all long-form minutes, 11 subscribers, 8.4% CTR on 7,153 impressions)
- Never losing a long-form day: a QA-passed backup Lane A video ready to ship (5 of the last 9 long-form days were lost)
- End screens and Watch next links from EloraTZP to Side Effects and Stopping, and from Side Effects to Bones and Injection Site (Side Effects already sends suggested viewers to Bones and How Long)
- Practical tirzepatide (Lane A) long videos titled 'Tirzepatide (Mounjaro) …' with a felt-problem question (big three: 942, 785 and 587 minutes in 28 days, 74–86% from suggested videos)
- Stopping tirzepatide and keeping results afterwards (Stopping: 171 min and 8.9% CTR by day 5)
- Tirzepatide injection site reactions as a long video (Shorts: 242 views, and 129 by day 1–2)
- Tirzepatide and alcohol, based on the label: no 'safe amount', with the low-blood-sugar caveat for people on insulin or sulfonylureas
- Tirzepatide burping and heartburn, and tirzepatide dehydration: what helps and when to call
- Approved-drug search long: Foundayo (orforglipron), what to expect, label only ('foundayo' is our top non-EloraTZP search term; the orforglipron long has 262 min, 111 of them from search)
- Calm 'Is this normal?' and 'Will it…?' tirzepatide body-worry Shorts: hair, injection site, nausea, bones, breakfast
- Script fix at 15–30 s in long videos: a second concrete payoff and no roadmap (biggest drop at 12–35 s in 11 of 14 curves)
- Repackaging and linking the Hair Loss long video (1.06% CTR on 94 impressions; the hair Short has 1,025 views)

## Schedule suggestions (for the owner — edit config/channel.json to apply)
This is the evening update for 11-11. Two things matter most: the long-video data hasn't refreshed since this morning, and long videos that never ship are now costing more watch time than anything else.

Where we are: 161 of 4,000 watch hours and 384 of 1,000 subscribers. Neither moved between this morning's read and this evening's.
- At about 8 watch hours a day, the Partner Program is more than a year away. To reach it by February we need about 35 hours a day, roughly 4 times our current long-video watch time.
- Subscribers have stayed at 384 since about 11-09.

1. Data check (please fix the pull)
- Every long-video number is the same as this morning: views, minutes, impressions and click-through. Only Shorts view counts moved.
- This pull has no lifetime fields, and the older-video totals show 0 views and 0 minutes.
- Nothing is logged for 11-07 or 11-08. The 11-09 and 11-10 posts have view counts only.
- Until this is fixed I can't do the day-7 checks on the Birth Control and Fatigue videos.

2. Long videos that don't ship are the biggest loss
- The 11-10 and 11-11 long videos were held at QA. Together with 11-03, 11-07 and 11-08, that's 5 lost long-video days in 9.
- One clean practical tirzepatide video earns about 3 to 15 watch hours in its first month.
- Suggestion: always keep one already-checked backup long video ready to publish when the main one fails a quality gate.

3. Quick wins in YouTube Studio
- EloraTZP (our biggest video, 45% of all long-video watch time ever):
  - Add an end screen pointing to "Tirzepatide (Mounjaro) Side Effects and What Helps" and "Tirzepatide: What Happens When You Stop?".
  - Put a ▶ Watch next link on line 1 of its description.
  - Add it to the "Life on Tirzepatide" playlist.
- Side Effects already sends viewers to our Bones and How Long videos through suggestions. Add end screens to Side Effects (→ Bones and the next injection-site video), What to Eat (→ Thanksgiving) and Strength (→ Bones) to build on that.
- Hair Loss long video (1.1% click-through on 94 impressions):
  - Swap in a "worried → answered" thumbnail.
  - Retitle it "Tirzepatide (Mounjaro) Hair Loss: Will It Grow Back?".
  - In Studio, set the related-video link on the 1,025-view hair Short to point at it.

4. What the retention curves say (14 long videos)
- In 11 of 14, the biggest drop comes 12 to 35 seconds in, right after the first answer. Writers will add a second concrete payoff there and drop roadmaps.
- Videos that open with a "you" moment keep about 80% of viewers at 30 seconds. News-style openings keep 63 to 72%.
- Three videos lose people at 73 to 85% of the way through, where the recap or checklist starts. We'll move the last payoff earlier.

Publishing times (config/channel.json):
- Keep Shorts at 08:00, 13:00 and 20:00 ET, and the long video at 14:00 ET. Time-slot differences are negligible.
- On 2 to 3 days a week, add a second practical or search long video at 10:00 ET, plus a fast head-to-head video whenever a real result against tirzepatide breaks.
- Please remove the 17:30 carousel slot. About 58 carousels have reached 0 to 4 people each.

Keep avoiding:
- Medicare, cost and pharmacy videos
- explainers for unapproved pipeline drugs with no fresh news
- more plateau or general protein videos
- survey or add-on-trial Shorts (nails 13 views, psoriatic arthritis 33)

Hold Thanksgiving Shorts until Nov 18 or later. The one on Nov 6 got 21 views.

Next reviews:
- After the long-video data refreshes: Birth Control and Fatigue
- 11-16: Diarrhea at day 7
- 11-17: end the subscribe-line test on Shorts as inconclusive
- 11-24: the thumbnail test on Strength and What to Eat

_Updated 2026-11-11 from 375 posts._
