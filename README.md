# InforMed Lab — Autonomous Health Content Studio

A team of AI agents that finds health topics **before they peak**, writes evidence-based scripts engineered for retention, fact-checks everything, narrates with a natural voice, renders videos, carousels and thumbnails in the InforMed brand, and publishes on schedule to YouTube, Instagram, TikTok and Facebook. It runs entirely on GitHub Actions: no server, no manual steps.

**Daily output**

| Platform | Format | Per day | Slots (New York time, editable) |
|---|---|---|---|
| YouTube | Long-form (8–12 min) | 3 | 09:00 · 14:00 · 19:00 |
| YouTube | Shorts | 3 | 11:30 · 16:30 · 21:00 |
| Instagram | Reels | 3 | 08:00 · 13:00 · 20:00 |
| Instagram | Carousels | 2 | 10:30 · 17:30 |
| TikTok | Videos | 3 | 09:30 · 15:30 · 21:30 |
| Facebook | Reels | 3 | 08:30 · 13:30 · 19:30 |
| Facebook | Carousel / photo posts | 2 | 11:00 · 18:00 |

The 3 vertical videos are produced once and published natively to Shorts, Reels, TikTok and Facebook Reels, each with its own platform-specific caption. The 2 carousels go to Instagram and Facebook.

## The agent team

Every agent is a Claude agent (Claude Agent SDK, running on your Claude subscription token) with its own playbook in [`agents/`](agents/). All of them share [`agents/_shared.md`](agents/_shared.md) (accuracy and safety rules) and `data/learnings.md` (what our own analytics taught us).

| Agent | Job |
|---|---|
| **Trend Scout** | Scrapes Google Trends, Wikipedia pageview spikes, Reddit, new top-journal studies (PubMed), science/health news, FDA/WHO/NIH releases and fast-rising YouTube videos every 4 h, then verifies with web search. Scores topics by stage (*emerging → rising → peaking*) to catch them before they explode. |
| **Content Strategist** | Turns the radar into the day's slate: mix of early trends, refreshed evergreens and myth-busters; never repeats a topic within 30 days. |
| **Medical Fact-Checker** | Screens topics before production, then verifies every claim, number and source against primary literature with web search. Verdicts: PASS / REVISE / HOLD. |
| **Long-form Scriptwriter** | Hook psychology for the first 5 s and 30 s, open loops, a re-hook every 45–75 s, escalating sections, on-screen visual direction per scene. |
| **Short-form Scriptwriter** | 1–2 s scroll-stopping hooks, fast payoffs, loopable endings. |
| **Narration Director** | Rewrites scripts for the ear (contractions, rhythm, pauses, pacing per scene) so the voice sounds human. |
| **Motion Designer** | Art-directs every shot of the animated flat-vector style (palette, background, characters/cells/organs, motion, camera, transitions, labels), with a new shot every 3–7 s synced to the narration. See [docs/STYLE.md](docs/STYLE.md). |
| **Title Writer** | 10 CTR-scored title candidates (curiosity gap, specificity, stakes), picks the best. |
| **Thumbnail Designer** | Art-directs 3 concepts (split-reveal, big-number, warning, object-hero, versus), picks one; rendered in brand with an AI or stock image. |
| **SEO/AEO Writer** | Descriptions built for YouTube search *and* AI answer engines: quick-answer paragraph, chapters, sources, tags. |
| **Carousel Designer** | Save-worthy 6–9 slide carousels with a scroll-stopping first slide. |
| **Social Copywriter** | Native captions for Shorts, Instagram, TikTok and Facebook. |
| **Visual Critic** | Reviews key frames of every shot (readability, typography, composition, appeal) and sends fixes back to the Motion Designer. |
| **Sound Designer** | Balances music and sound effects around the voice using measured levels, and adds bespoke effects for key moments. |
| **Performance Analyst** | Daily: pulls metrics and rewrites the playbook every other agent follows. |

## How a day flows

```
every 4h  Trend radar ─────────────► data/radar/latest.json
02:00     Daily production
            plan ── Strategist → Fact-checker topic screen
            ├─ long ×3  (parallel) script ⇄ fact-check → narration → motion design → animated render + SFX + score → title → thumbnail → SEO
            ├─ short ×3 (parallel) script ⇄ fact-check → narration → motion design → animated render + captions
            └─ carousel ×2         slides ⇄ fact-check → render → captions
          finalize: media → GitHub Release · YouTube uploaded with native publishAt · held items → GitHub Issue
every 15m Publisher: posts whatever's slot has arrived (Instagram, TikTok, Facebook)
daily     Analytics → Performance Analyst → data/learnings.md (fed back into every agent)
```

**Quality gates (every video):**
- **Whisper narration check:** transcribes every narrated scene and compares it word by word with the script (numbers and acronyms normalized). Scenes that came out wrong are re-voiced automatically (ElevenLabs re-voices just those scenes).
- **Visual QA before rendering:** an automated layout audit measures every piece of text at key moments (off-screen, overlapping, too small, covering the artwork). Then the **Visual Critic** agent looks at key frames of every shot, scores appeal and readability, and sends weak shots back to the Motion Designer to fix.
- **Every-frame check after rendering:** ffmpeg scans all frames for black frames, frozen animation and photosensitive flashing. Glitches trigger a re-render in safe capture mode.
- **Sound design and mix check:** the **Sound Designer** agent sets the music level, rebalances or drops effects using measured levels relative to the voice, and adds custom ElevenLabs effects for key moments. Whisper then listens to the final mix; if the voice is less intelligible than the clean narration, music and SFX are lowered and remixed.
- Anything still failing (flashing, black frames, masked voice, narration that doesn't match the script) is **held** for your review, just like a fact-check failure.

**Safety gate:** content only publishes if the Fact-Checker returns PASS (after up to 2 revision rounds) and the packaging check confirms the title, thumbnail and captions don't overclaim. Anything else is **held** and a GitHub Issue is opened. Add the label `approved` to publish it or `rejected` to drop it, from the GitHub mobile app if you like.

## Tech

| Piece | Tool |
|---|---|
| Orchestration and cron | GitHub Actions (public repo, so free minutes) |
| Agents | Claude Agent SDK with `CLAUDE_CODE_OAUTH_TOKEN` |
| Video style | Animated flat-vector motion graphics (own component library + GSAP), 1080p **60 fps** |
| Video rendering | [HyperFrames](https://hyperframes.heygen.com) (HTML → MP4) + ffmpeg |
| Narration | [Chatterbox](https://github.com/resemble-ai/chatterbox) (expressive open-source TTS, optional voice matching) + Whisper word timing; Kokoro as fallback |
| Sound | Synthesized SFX on every animation event + generated ambient synth score (or your own tracks) |
| Photos (carousels/thumbnails) | Pexels / Pixabay APIs (free) |
| Thumbnail images | Pollinations (free AI images), stock-photo fallback |
| Stills | Playwright (HTML → PNG/JPEG) |
| Storage | GitHub Releases (videos), `media` branch (public carousel image URLs for Instagram) |
| State | JSON in `data/`, committed by the bot |

## Repo map

```
agents/            system prompts: the agents' playbooks
config/channel.json  brand, audience, cadence, schedule, voice, safety, models
brand/             logos (from InforMed Logo Files)
src/trends/        signal scrapers + radar
src/plan/          daily planning + topic screening
src/produce/       long / short / carousel pipelines
src/media/         TTS, animated cartoon compositions (vector/ + cartoon faces, bubbles, backdrops), comic carousels, thumbnails, render/mix
src/publish/       YouTube, Meta (IG+FB), TikTok, storage, publisher
src/review/        GitHub-Issue human review
src/analytics/     metrics + learnings loop
scripts/           one-time auth helpers
.github/workflows/ radar, daily, publish, review, analytics
data/              pipeline state (radar, queue, published log, learnings)
```

Setup: see **[docs/SETUP.md](docs/SETUP.md)**.
