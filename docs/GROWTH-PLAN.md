# InforMed growth plan: Partner Program first, then $1,000/day

_Written 2026-10-20 from our own data (`data/learnings.md`, `data/analytics/`). The Growth Strategist agent reviews
progress against this plan every week and keeps the live playbook in `data/growth-playbook.md`._

## 1. The goal in numbers

| Milestone | What it takes | Where we are (2026-10-20) |
|---|---|---|
| **YouTube Partner Program** | 1,000 subscribers **and** 4,000 public long-form watch hours in 365 days (or 10M Shorts views in 90 days) | ~3,200 YouTube views in 3.5 weeks, ~670 of them long-form; subscribers and watch hours unmeasured until the YouTube Analytics API is enabled |
| **$1,000/day AdSense** | Roughly **70,000–125,000 long-form views a day** at a US-heavy health RPM of ~$8–15 per 1,000 views (estimate; Shorts pay a small fraction of that) | Long-form median: **11 views** per video |

**4,000 watch hours ≈ 60,000 long-form views** at ~4 minutes watched per view. At one long video a day, that's ~170
views per video for a year, or ~650 per video to get there in 3 months. Today's median is 11. **Long-form is the
bottleneck; everything below is ordered by how much it moves long-form watch time.**

## 2. What our data already says
- **Long-form works only as the first clear explainer of something new and named** (EloraTZP: 416 views; approved-drug
  long-forms: median 6). A Short's hit topic does not carry to long-form on its own.
- **Shorts that win name the drug** (tirzepatide titles: median 83 vs 31), **compare two named drugs**, or take a calm
  **"what's confirmed?"** look at gray-market drugs (retatrutide, counterfeit/compounded: median ~104).
- **Rising topics beat emerging ones** (83 vs 39). **13:00 ET is the best Shorts slot**, 20:00 the weakest.
- **Carousels reach almost no one** (0–3 reach on all 23). They cost a production slot and Claude usage every day.
- **We can't see retention, click-through rate, traffic sources, subscribers or watch hours** yet (YouTube Analytics API
  is disabled in the Google Cloud project). Until it's on, we steer by views only.

## 3. The plan

### A. Make long-form win (the lever that pays)
1. **"First explainer" long-forms.** When the radar finds a newly reported named drug, trial or result in the GLP-1 space,
   make the long video about it within 24–48 h, with the new name first in the title. Trial-result deep dives are "about
   the news", so the no-breaking-news rule doesn't block them; status updates on developing stories still go to Shorts.
2. **Search-demand evergreen long-forms** on the questions people type every day: "tirzepatide vs semaglutide",
   "Mounjaro side effects", "what to eat on Ozempic", "how long does it take to work", "stopping GLP-1: what happens".
   These keep earning views for months. Aim for 1 in 3 long-forms to be search evergreens.
3. **Test the gray-market lane as long-form** ("retatrutide: what's actually confirmed"): our strongest Short lane has
   never been tried long.
4. **Packaging**: title = the searched term + the twist, generic name first; thumbnail adds the emotion, never repeats the
   title. Once retention/CTR data exists, retitle long videos with low CTR after 48 h (API) and use YouTube Studio's
   Test & Compare for thumbnails on the best topics (Studio-only).
5. **Retention**: hook that answers "why should I stay" in 15 s, re-hooks every 45–75 s, relatable thread (already in the
   scriptwriter rules), payoff at the end, "watch this next" to a related long video.

### B. Turn Shorts into a long-form funnel
1. Every Short is a **spin-off of a long video** where possible, and says so ("full breakdown on the channel").
2. Shorts descriptions and pinned comments **link the related long video**. (YouTube's "related video" button on Shorts is
   Studio-only: the owner can add it for the best Shorts.)
3. Lead Short at **13:00 ET** in a proven lane; move the weakest topic type to 20:00 or drop it.

### C. Build the subscriber engine
- Channel trailer + Start Here playlist (done). Topic playlists that chain videos (pillar playlists exist; add series
  playlists for recurring formats such as "New GLP-1 drugs explained" and "Head-to-head").
- One subscribe ask per video, tied to a benefit, after the value is delivered.
- Regular formats viewers come back for: **"New drug decoded"**, **"Head-to-head"**, **"What's actually confirmed?"**.

### D. Stop spending on what doesn't work (needs the owner's OK: cadence is a standing rule)
- **Carousels**: reach is 0–3. Proposal: cut to 3 a week (or stop) and spend the freed production slot and Claude usage
  on a **second long video on high-signal days** or an extra Short in a proven lane.
- **20:00 ET Short**: weakest slot five reviews running; use it for a test lane or the funnel Short.

### E. Measure what matters
- **Owner: enable the YouTube Analytics API** (Google Cloud → APIs & Services → YouTube Analytics API → Enable). Unlocks
  watch hours, retention, CTR, traffic sources and subscribers per video, and the daily Partner Program report.
- Weekly Growth Strategist review (below) judges every change by long-form watch hours and subscribers gained.

### F. Stay monetizable (non-negotiable)
YouTube rejects or demonetizes channels for "inauthentic"/mass-produced content, misleading metadata, medical
misinformation and fake engagement. So: every video teaches something new, formats vary, the fact-check gate stays, no
bought views, sub-for-sub, engagement bait or misleading thumbnails. Disclose synthetic content if Studio asks.

## 4. Targets (reviewed weekly)

| By | Long-form median views | Subscribers | Watch hours (365 d) |
|---|---|---|---|
| End of Oct 2026 | 30+ | measured | measured |
| End of Nov 2026 | 100+ | 300+ | 800+ |
| End of Dec 2026 | 250+ | 1,000 | 2,500+ |
| Feb 2027 | — | 1,000+ | **4,000 → apply for YPP** |

After YPP, the target becomes RPM × long-form views: grow daily long-form views toward 70k–125k, mostly through search
evergreens, a back catalogue that keeps earning, and series that keep viewers watching.

## 5. How the plan runs itself
- **Growth Strategist agent** (`agents/growth-strategist.md`, `growth.yml`, weekly + on demand): compares results with
  the targets, decides which levers to pull next, runs experiments (one variable at a time, with a success metric), and
  rewrites `data/growth-playbook.md`, which every agent reads. Changes that need the owner (cadence, budget, Studio-only
  steps) go to Telegram as clear decisions.
- **Performance analyst** (daily) keeps `data/learnings.md` up to date with what performed.
