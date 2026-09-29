# InforMed performance playbook (updated 2026-09-29)

## Data status: still too little to draw conclusions
- **Sample:** 5 pieces, all published 26–28 Sept, **none about GLP-1**: 3 Shorts (S1 smartwatch calories, S2 HRT pill vs patch, S3 scented cleaners), 1 carousel (C2 stroke before 50) and 1 long-form (L2 workout vs nap).
- **Metrics we have:** YouTube views and likes, plus Instagram reach and views. **TikTok, Facebook and Threads still return null.** There's no watch time, average view duration or retention for anything.
- **Everything below is a hypothesis (n≤3 per format), not a rule.** Don't carry topic lessons from these pre-GLP-1 posts over to GLP-1 content. Carry over only the title and hook mechanics.

## Early signals (weak)
- **YouTube Shorts (n=3, median 4 views):** S1 got 136 views (about 34× the median). S3 got 4 and S2 got 2. One post accounts for almost all of the views.
- **The title with a number is still the only one that got views.**
  - S1: "Smartwatch Calories Were Off by 15–25% in a Lab Test". It has a numeral range, a study setting and a flat statement.
  - S3 ("might be polluting your air") and S2 ("the blood clot number headlines skip") both teased a number or effect without stating it. Both went nowhere.
  - **Working hypothesis (n=3):** put the actual number in the title, not a tease about it. For GLP-1, that means a title like "Semaglutide users lost ~15% on average over 68 weeks in STEP-1", with the population and timeframe the fact-checker requires. Avoid "the number nobody tells you" titles.
- **Confound:** S1 also went out at a different time (14:02 ET, versus 09:32 and 23:14 ET for the others). We can't separate the title effect from the slot yet.
- **Instagram Reels (n=3):** 15–20 views each and zero engagement. That's baseline account reach and doesn't tell us anything about the content.
- **Instagram carousel (n=1):** reach 2. Too early and too small to judge.
- **Long-form (n=1):** L2 had 0 views about a day after publishing. A new channel and a single data point, so no conclusion. Don't drop numeric titles because of this.
- **Length:** all 3 Shorts ran 64–69s, so there's no variation to learn from. **Test 35–50s cuts** on GLP-1 Shorts so there's something to compare.

## Principles to carry forward (not yet proven by our data)
- Lead with a direct "you" stake plus one concrete, sourced number, both in the first spoken line and in the title.
- Myth-busts should target a number or belief the viewer already holds. S1 challenged a number people check on their own wrist.
- Use loop endings that lead back into the first line. All the Shorts did this, so there's no comparison yet.
- Accuracy, the full population and comparator, and the exact prescriber line always come before any hook tactic.

## Logging needed for the next update
- Log the actual publish time. S2 went out at 23:14 ET and C2 at 02:04 ET, and neither is a scheduled slot.
- Log the title formula (stated number / teased number / question / how-to), the hook type, the thumbnail or cover layout and the duration for every post.
- Collect at least 8–10 GLP-1 posts per format before calling pillar, hook or slot winners.

_Updated 2026-09-29 from 17 platform posts (5 content pieces)._

## Topics to double down on
- GLP-1 myth-busts with the actual trial number in the title (STEP/SURMOUNT average weight loss, with population and timeframe)
- Muscle vs fat share of weight lost in GLP-1 trials, and protein and strength training to protect muscle
- How GLP-1 affects appetite and 'food noise' (worded as appetite as measured)
- Benefits beyond weight with exact populations: SELECT heart outcomes, FLOW kidneys
- Making common side effects easier (nausea, constipation) with evidence-based habits
- New GLP-1 pills and next-gen drugs (orforglipron, retatrutide) with date-hedged status

## Schedule suggestions (for the owner — edit config/channel.json to apply)
There still isn't enough data to change the schedule. We have 5 pieces, none about GLP-1, and TikTok, Facebook and Threads returned no metrics. Posts also often went out off-slot: S2 at 23:14 ET, C2 at 02:04 ET, and S1 at 14:02 ET the day after its planned slot. So timing can't be judged yet.

1. Fix the publisher first. Posts need to go out on the configured slots, or we can never compare them. Shorts are set for 08:00, 13:00 and 20:00 ET, long-form for 14:00 ET, and carousels for 14:00 and 17:30 ET. Check why items are going out in the middle of the night; it could be a queue backlog or a timezone conversion bug.
2. Keep the current slots as they are. The move of long-form to 14:00 ET is sensible. The only Short that got views (S1) went out around 14:00 ET, but that's n=1 and mixed up with its stronger title.
3. Fix analytics collection:
   - TikTok, Facebook and Threads return null.
   - YouTube needs the Analytics API (not just the Data API) so we get watch time, average view duration and retention.
   - Instagram should also pull plays and average watch time.
4. Try 2–3 Shorts at 35–50s alongside the usual 60s+ ones, so we can compare lengths.
5. Review again after about 2 weeks of GLP-1 posting, once there are at least 8 posts per format with correct slot logging.

_Updated 2026-09-29 from 17 posts._
