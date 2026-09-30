# InforMed performance playbook (updated 2026-09-30)

## Data status: still very little data. Treat everything here as a hypothesis.
- **Sample:** 11 pieces. 6 YouTube Shorts (3 about GLP-1), 5 long-form (3 about GLP-1) and 3 carousels (2 about GLP-1). Most were measured about 1–2 days after posting.
- **Metrics we have:** YouTube views and likes, plus Instagram reach and views. **TikTok, Facebook and Threads still return null.** There's no watch time, average view duration or retention for anything. Engagement is almost zero everywhere (1 like in total), so there's no engagement signal.
- **Rule:** don't treat a signal as proven until there are at least 8 GLP-1 posts per format with slots logged correctly. The biggest views so far are about 138, so a single post can move any average.

## YouTube Shorts: the only format with a usable signal (n=6, median 17 views)
- **Results:** smartwatch 138, Mounjaro metabolism 80, CagriSema vs tirzepatide 30, cleaners 4, HRT 3, GLP-1 heart risk 2. Three posts were well above the median and three were close to zero.
- **GLP-1 Shorts (n=3, median 30):** both headline decoders beat the channel median. The benefits-beyond-weight Short got 2.
  - "Does Mounjaro Speed Up Metabolism? The Real Data" got 80 (4.7× median).
  - "Did CagriSema Really Beat Tirzepatide?" got 30 (1.8× median).
  - "GLP-1 vs Older Drug: 18% Lower Heart Attack/Stroke/Death Risk" got 2.
- **Updated title hypothesis (n=6):**
  - What the winners share: they name **a specific thing the viewer already knows or searches for** (a smartwatch, Mounjaro, CagriSema) and **pay it off with a real number or a real answer**.
  - What the losers share: a **vague subject** ("Older Drug", "your 'clean' smell", "the number headlines skip").
  - This replaces the earlier "always put the number in the title" rule. A stated number alone didn't save the GLP-1 heart-risk Short.
- **Title patterns to use more:**
  - A search-style question: "Does [drug people know] [do the thing they've heard]?"
  - A headline decoder: "Did X Really Beat Y?"
  - A flat statement with a number and a concrete subject.
  - In every case the Short must answer the question with the verified number, population and comparator.
- **Drug names in titles:** the recognisable drug name appeared in both GLP-1 winners, while "GLP-1 vs Older Drug" flopped (n=3, weak).
  - Put the recognisable name next to the generic name, for example "Tirzepatide (Mounjaro)".
  - Name the comparator explicitly ("vs sulfonylureas"), never "older drug".
  - QA rules still apply: generic name first where QA requires it, never a brand the study didn't test, and never ad-like wording.
- **Mouse and early-stage topics:** the Mounjaro metabolism Short was about a mouse study, framed honestly ("only in mice"). Decoding a claim people are already searching for works even when the answer is "not proven in humans yet". Keep that honesty.
- **Avoid:** teasing a number without stating it, and vague comparators. Both went 0 for 3.
- **Length:** there's still no signal. Winners ran 64–89s and losers 68–77s. **Still to do:** test 35–50s cuts on 2–3 GLP-1 Shorts.
- **Slot confound:** both Shorts posted around 08:00–09:30 ET got 4 views or fewer (n=2). The 13:00–14:00 ET posts (138 and 30) and the 20:00 ET post (80) did better. The title and the slot are mixed up, so don't treat either as proven.

## Long-form (n=5, median 2 views)
- Views were 0, 1, 2, 3 and 5. That's cold-start noise with no topic or thumbnail signal.
  - Orforglipron and menopause ("reaction" thumbnail) got 5.
  - GLP-1 hair loss ("before-after") got 3.
  - Mammogram ("split-reveal") got 2.
  - BMI and heart risk ("versus") got 1.
  - Workout vs nap ("versus") got 0.
- **Keep:** the GLP-1 question titles people would search for ("Does Menopause Blunt GLP-1 Weight Loss?", "Ozempic & GLP-1 Hair Loss: How Common…"). They match how people search, and they were the top 2 of 5.
- **Before-after thumbnails must never show bodies, weight or shape.** The hair-loss thumbnail was fine. Body before-afters break the brand guardrail.
- Three long-forms went up on 09-28 even though the config says 1 a day. This splits the channel's early reach. Publish 1 a day.

## Instagram and carousels
- Reels from 09-26 got 15–20 views each. **The GLP-1 Reels and carousels from 09-28/29 got 0–4 views and 0 reach**, while the same Shorts got 30–80 views on YouTube.
  - This could be delayed insights, or Meta limiting how far weight-loss and drug content gets recommended.
  - Don't judge the content on this.
  - Keep Instagram captions free of weight-loss hashtags and before/after language. Lead with health or mechanism framing.
- There are no usable carousel metrics for any of the 3 carousels.

## Principles to carry forward (not proven by our data yet)
- The first spoken line and the title share one concrete hook: a named subject plus a "you" stake. The answer comes within the first 10s.
- Decode a claim people are already searching for or seeing in headlines. Myth-busts target a belief or number the viewer already holds.
- Use loop endings that lead back into the first line. Every Short does this, so there's no comparison yet.
- Accuracy, the full population and comparator, "mice vs humans", and the exact prescriber line always come before any hook tactic.

## Logging needed for the next update
- Log the actual publish time for every platform. Long-forms were scheduled at 17:00 ET and 01:00 ET, not 14:00 ET.
- Log the title formula for every post: search-style question / headline decoder / stated number / teased number / how-to. Also log the hook type, the thumbnail layout and the duration.
- Pull retention and average view duration (YouTube Analytics API), plus TikTok and Facebook metrics. Without them we can't learn anything about hooks.

_Updated 2026-09-30 from 43 platform posts (11 content pieces; 6 of them about GLP-1)._

## Topics to double down on
- Headline decoders on trending GLP-1 claims ('Did X really beat Y?', 'Does tirzepatide (Mounjaro) really…?'), naming the drug and answering with the verified number, population and comparator
- Search-style mechanism questions: does GLP-1 speed up metabolism, burn fat, change appetite (worded as appetite as measured)? Answer honestly, including 'only in mice so far'
- GLP-1 myth-busts built around a number or belief viewers already hold (STEP/SURMOUNT average weight loss with population and timeframe)
- Muscle vs fat share of weight lost on GLP-1s, plus protein and strength training to protect muscle
- Common side effects people search for (hair loss, nausea, constipation): how common they are and evidence-based habits that help
- New GLP-1 pills and next-gen drugs (orforglipron, retatrutide, CagriSema) with date-hedged status
- Benefits beyond weight with exact populations and named comparators (SELECT heart outcomes, FLOW kidneys); avoid vague 'older drug' framing

## Schedule suggestions (for the owner — edit config/channel.json to apply)
There still isn't enough data to change the schedule for real. We have 11 pieces, only 6 about GLP-1, most measured 1–2 days after posting. TikTok, Facebook and Threads still return no metrics, and there's no retention data. A few things should be fixed first, and there's one optional test.

1. Fix the long-form scheduling bug. The config says 14:00 ET, but L1 and L2 were scheduled for 17:00 ET (21:00 UTC). That's exactly 14:00 Pacific time, so the long-form scheduler is probably using the wrong timezone. L3 was scheduled for 01:00 ET and actually went out at 02:57 ET. Three long-forms also went out in one day even though the config says 1 a day. Please cap it at 1 a day at 14:00 ET.

2. The Shorts publisher now mostly hits its slots. The 09-28 and 09-29 Shorts went out at 13:00, 20:00 and 08:09 ET. Please check that Instagram, TikTok and Facebook post within about 15 minutes of YouTube. On 09-28 they were about 1 hour 15 minutes late.

3. Carousels: C2 on 09-28 was scheduled for 17:30 ET but went out on Instagram at 19:18 ET. Threads for C1 posted about 5 hours after the other platforms.

4. Optional test, low confidence (n=2): both Shorts posted around 08:00–09:30 ET got 4 views or fewer. Shorts at 13:00–14:00 ET got 138 and 30 views, and the 20:00 ET Short got 80. You could move the 08:00 ET Short to 11:00 ET for one week and compare. This is confounded with title quality, so keep 13:00 and 20:00 as they are.

5. Instagram: the GLP-1 Reels and carousels show 0 reach, while the same Shorts got 30–80 views on YouTube. Please check Instagram Account Status (whether posts can be recommended to non-followers). Also check whether insights are only arriving after 48 hours. Meta can limit how far weight-loss and drug content is recommended.

6. Analytics:
   - Enable the YouTube Analytics API for watch time, average view duration and retention.
   - Fix the null metrics for TikTok, Facebook and Threads.
   - Add Instagram plays and average watch time.

7. Test length: make 2–3 GLP-1 Shorts at 35–50s next week. Every Short so far has run 64–89s.

8. Next review: around 12–14 Oct, once there are at least 8 GLP-1 posts per format with correctly logged slots.

_Updated 2026-09-30 from 42 posts._
