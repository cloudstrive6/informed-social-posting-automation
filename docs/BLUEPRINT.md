# Blueprint: fully automated faceless social channel

How the InforMed system is built, published and operated, written so it can be recreated for another niche.
(Code: this repo. Setup details: [SETUP.md](SETUP.md). Visual style: [STYLE.md](STYLE.md).)

---

## 1. Architecture at a glance

- **Runtime:** GitHub Actions only (public repo = free minutes). No server. State lives in `data/` and is committed back by the bot.
- **Brains:** Claude agents through the **Claude Agent SDK**, authenticated with one `CLAUDE_CODE_OAUTH_TOKEN` (`claude setup-token`, valid 1 year). Every agent has a prompt in `agents/*.md`; every answer is forced into a JSON schema (`src/lib/schemas.ts`).
- **Config:** everything channel-specific is in `config/channel.json`: brand, audience, **niche** (brief, pillars, guardrails, radar sources), cadence, **schedule**, platforms, voice, video, music, QA thresholds, safety, review mode, models.
- **Cadence (per day):** 3 long videos (8–15 min), 3 Shorts (< 90 s), 2 carousels.

### Workflows (`.github/workflows/`)
| Workflow | When | Does |
|---|---|---|
| `radar.yml` Trend radar | every 4 h | Collects signals (PubMed, Google News queries, Google Trends, Wikipedia spikes, Reddit, YouTube) → Trend Scout agent ranks rising topics → `data/radar/latest.json` |
| `daily.yml` Daily production | 02:00 New York | Plan the slate → produce long/short/carousel in parallel jobs (long: after Shorts, 2 at a time) → **finalize**: upload media, archive to B2, Editor-in-Chief on held items, pre-schedule YouTube, Telegram summary. Inputs: `test_run`, `only` |
| `publish.yml` Publisher | every 15 min | Posts every ready item whose slot arrived. Input `item` (+`platforms`) = post one item right now |
| `analytics.yml` | daily | Renews the Threads token; pulls metrics → Performance Analyst rewrites `data/learnings.md` |
| `telegram.yml` | every 5 min (listens ~4.5 min) | Telegram button presses (veto / approve) and `/pending` |
| `notify-failures.yml` | on any workflow failure | Telegram alert with the run link |
| `review.yml` | issue labelled | Legacy human-review path (`approved` / `rejected` labels) |
| `audio-assets.yml` | manual | Generates the SFX kit / music library once |

---

## 2. The agent team (`agents/*.md`)
| Agent | Model | Job |
|---|---|---|
| Trend Scout | Opus | Ranks radar signals into early/rising topics |
| Content Strategist | Opus | Daily slate: ids, topics, angles, keywords; rotates niche pillars |
| Fact-Checker | Opus + web | Screens topics; checks scripts/slides against real sources (PASS / REVISE / HOLD); packaging check |
| Scriptwriter (long / short) | Opus | Hook-driven scripts (long 1,400–2,000 words, auto expand/trim; short 110–150 words) |
| Narration Director | Opus | Rewrites for the ear, respells hard words, pacing |
| Motion Designer | Opus (Shorts) / Sonnet (long) | Plans every animated shot (characters, faces, speech bubbles, backdrops, camera) |
| Visual Critic | Sonnet (vision) | Scores contact sheets of key frames; sends fixes back |
| Sound Designer | Sonnet | Music gain + SFX levels from measured loudness |
| Title Writer | Opus | 5+ CTR title candidates |
| Thumbnail Designer | Opus | 3 psychology-driven cartoon thumbnail concepts |
| Thumbnail Judge | Sonnet (vision) | Picks the likeliest click at phone size |
| SEO Writer | Sonnet | Description (AEO), chapters, tags, pinned comment |
| Carousel Designer | Opus | 6–9 slide comic infographic carousels |
| Social Copywriter | Sonnet | Captions: YouTube Shorts, Instagram, TikTok, Facebook, Threads (no hashtags) |
| Packaging Editor | Sonnet | Applies packaging-check fixes to long-video title/thumbnail/description |
| Editor-in-Chief | Opus | Final publish/drop call on anything held (fully automated mode) |
| Quality Coach | Opus | Turns recurring QA findings into `data/craft-notes.md` (every agent reads it) |
| Performance Analyst | Opus | Turns metrics into `data/learnings.md` (every agent reads it) |

Shared context every agent sees: `agents/_shared.md` + brand/audience/niche/guardrails from config + `learnings.md` + `craft-notes.md`.

---

## 3. Production pipeline (per piece)

1. **Plan** (`src/plan/planDay.ts`): radar → strategist → fact-checker screens topics.
2. **Script ⇄ fact-check loop** (`src/produce/common.ts writeWithFactCheck`): up to 2 revision rounds; minor fixes auto-applied.
3. **Narration**: ElevenLabs (Shorts) or Chatterbox (long) → Whisper checks every scene; retakes on mismatch.
4. **Visuals**: Motion Designer shot plan → HyperFrames composition → layout audit + near-empty-shot check + Visual Critic → revise → render 1080p **60 fps**.
5. **Frame checks** (ffmpeg): black frames, freezes, photosensitive flashing.
6. **Audio**: music (normalized, ducked under voice) + SFX kit + custom SFX → Sound Designer → mix to −15 LUFS → Whisper masking check.
7. **Packaging**: titles → thumbnails (3 rendered, judge picks) → SEO / captions → **packaging check loop** (checker ⇄ editor).
8. **Finalize**: GitHub Release per day (videos), `media` branch (public image URLs), **B2 archive**, Editor-in-Chief on held items, YouTube pre-scheduling, quality log.
9. **Publish** at the slot; posting report to Telegram.

---

## 4. Toolset
| Area | Tool | Cost |
|---|---|---|
| Agents | Claude Agent SDK + Claude subscription OAuth token | subscription |
| Animation | Own engine (`src/media/animated.ts`, `vector/`): flat-vector SVG components, cartoon faces + blinking + talking mouths, speech bubbles, illustrated backdrops, doodle theme; **GSAP** animation; **HyperFrames 0.8.77** renders HTML → MP4 | free |
| Illustrations | Microsoft **Fluent Emoji (Flat)** + **Healthicons** (MIT, via Iconify packages) | free |
| Voice | **ElevenLabs** TTS with timestamps (Shorts); **Chatterbox** Turbo (long, open source); **Kokoro** fallback | ElevenLabs Starter |
| Music | **Eleven Music** library: 1 × 3-min track per mood in `assets/music/` (~905 credits/min — generate once, reuse) | one-time credits |
| SFX | ElevenLabs sound-effect kit (30 reusable, `assets/sfx/`) + a few custom per video | small |
| Speech QA / captions | **faster-whisper** word timing; our normalizer (numbers, acronyms, UK/US spelling, years) | free |
| Media processing | **ffmpeg** (mix, loudness, encode, frame checks), **Playwright/Chromium** (snapshots, carousels, thumbnails) | free |
| Carousels | Own comic-infographic renderer (`src/media/comic.ts`), 1080×1350 JPEG, auto-fit + overlap detection | free |
| Thumbnails | Own cartoon engine (`src/media/thumbCartoon.ts`) + judge (`thumbPick.ts`) | free |
| Fonts | Montserrat, Fredoka, Bangers (OFL) | free |
| Storage | GitHub Releases + `media` branch (working), **Backblaze B2** bucket (permanent archive + small secrets state) | B2 pennies |
| Notifications | **Telegram** bot (FYI, veto, failures, daily summary) | free |

---

## 5. How each piece is published
Every piece posts **at the same moment on all platforms of its kind** (`config.schedule`: `short`, `long`, `carousel`; `"HH:MM+1"` = next day).

| Content | Platform | How | Code |
|---|---|---|---|
| Long video | **YouTube** | Our own Google Cloud OAuth app → YouTube Data API v3 resumable upload, uploaded at finalize as private with `publishAt` (goes public at the slot), custom thumbnail via `thumbnails.set` | `src/publish/youtube.ts` |
| Short | **YouTube Shorts** | Same API, vertical < 3 min, `#shorts` title, public at the slot | `youtube.ts` |
| Short | **Instagram Reels** | Meta Graph API: container with `video_url` = the public GitHub release asset (binary rupload fails with ProcessingFailedError), wait FINISHED, `media_publish`; direct upload of an IG-spec rendition as fallback | `src/publish/meta.ts` |
| Short | **Facebook Reels** | Page token → Reels upload API | `meta.ts` |
| Short | **TikTok** | **Post for Me** API (project "InforMed", @informedlab only): signed upload URL → `social-posts` (public, AI-generated label) → poll results | `src/publish/postforme.ts` |
| Carousel | **Instagram** | Graph API carousel from public image URLs (repo `media` branch via raw.githubusercontent.com) | `meta.ts` |
| Carousel | **Facebook** | Page photo album post | `meta.ts` |
| Carousel | **TikTok** | Post for Me photo post (up to 35 images) with TikTok's `auto_add_music` (API can't choose a track) | `postforme.ts` |
| Carousel | **Threads** | Our Meta app's Threads API: image item containers → CAROUSEL container (≤ 500 chars, no hashtags) → publish | `src/publish/threads.ts` |

Manual release of any item: Actions → Publisher → Run workflow → `item = <date>/<item-id>` (optional `platforms`).

---

## 6. Platform setup (what to create, which secrets)
| Service | Setup | GitHub secrets |
|---|---|---|
| **Claude** | `claude setup-token` (1-year OAuth token) | `CLAUDE_CODE_OAUTH_TOKEN` |
| **ElevenLabs** | API key with TTS + SFX + Music permissions | `ELEVENLABS_API_KEY` |
| **YouTube** | Google Cloud project → enable YouTube Data API v3 (+ Analytics) → OAuth consent screen (external, **published to production**, privacy + terms URLs) → OAuth client *Desktop* → `npm run auth:youtube` (loopback login as the channel) | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` |
| **Instagram + Facebook** | Meta developer app (Business) with use cases *Manage messaging & content on Instagram* + *Manage everything on your Page*; Instagram professional account linked to the Page; Graph API Explorer user token (pages_*, instagram_basic, instagram_content_publish, instagram_manage_insights, business_management) → `npm run auth:meta` exchanges it for a never-expiring Page token | `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_USER_ID` |
| **Threads** | Same Meta app → add use case *Access the Threads API* (threads_basic, threads_content_publish, threads_manage_insights); redirect/uninstall/delete URLs (any public https page); App roles → add the account as **Threads Tester** → accept in Threads (Settings → Account → Website permissions → Invites) → User Token Generator → token. Renewed daily into B2 | `THREADS_ACCESS_TOKEN`, `THREADS_APP_ID`, `THREADS_APP_SECRET` |
| **TikTok** | Post for Me → **new Quickstart project per brand** → enable TikTok → connect the account (Posts + Feeds) with external ID = handle → API key (project-scoped) | `POSTFORME_API_KEY` |
| **Backblaze B2** | Private, encrypted bucket + application key restricted to that bucket (read/write) | `B2_KEY_ID`, `B2_APPLICATION_KEY` |
| **Telegram** | @BotFather `/newbot` → token; message the bot once → chat id from `getUpdates` | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| **GitHub** | Public repo; bot commits as `informed-bot`; owner commits with the GitHub *noreply* email (email-privacy push protection) | `GITHUB_TOKEN` (automatic) |

---

## 7. Automation, safety and learning loops
- **Fully automated review** (`review.mode: "auto"`): checks hold anything doubtful → **Editor-in-Chief** publishes or drops (hard media failures always dropped). Owner gets Telegram FYIs with a **🛑 Don't post** veto.
- **Fact-check gates** on topics, scripts/slides and packaging; niche guardrails + banned topics in config.
- **Quality loop:** every item's QA findings → `data/quality/log.jsonl` → Quality Coach → `data/craft-notes.md`.
- **Performance loop:** metrics → Performance Analyst → `data/learnings.md`.
- **Resilience:** agents wait out Claude usage limits; long videos staggered; Sonnet for high-volume agents; a rendered video is never lost if packaging fails; failure alerts on Telegram.

---

## 8. Lessons learned (save the next build a day)
- **Claude subscription usage limits** are the real bottleneck: stagger jobs, use Sonnet for volume work, sample the critic on long videos, wait for the reset instead of failing.
- **Instagram Reels**: publish from a public `video_url`; the resumable binary upload fails.
- **TikTok**: a self-built TikTok app posts private-only until audit → use Post for Me's approved app. Music on photo posts can only be TikTok's auto pick.
- **YouTube**: consent screen must be *In production* (testing-mode refresh tokens die in 7 days). Uploads from our project went public without an audit. Default quota 10k/day ≈ 6 uploads.
- **ElevenLabs**: Starter plan rejects mp3 192 kbps (use 128); music ≈ 905 credits/min, so build a small library once.
- **HyperFrames**: never put timing on an element that is itself stretched (wrap in a timed div); use absolute tween values; bundle GSAP locally.
- **Whisper QA** needs normalization (numbers, "twenty twenty-four" vs "two thousand twenty-four", UK/US spelling, spelled acronyms) or it holds good videos.
- **Carousels**: detect overlapping text boxes, not only footer overflow.
- **Telegram** only accepts a button acknowledgement for a few seconds → long-poll listener.
- **GitHub scheduled runs** can start 10–30 min late; keep slack before the first posting slot.
- **Windows dev machine**: bash heredocs mangle `\n`/`\s` → edit regex-heavy code with a file-based patch or the editor.

---

## 9. Recreate it for a new niche (checklist to give Claude Code)
1. Copy this repo into a new **public** repo; update `README.md`.
2. `config/channel.json`: brand (name, handle, colours, disclaimer), audience, **niche** (brief, pillars, guardrails, radar match/subreddits/YouTube/news/PubMed queries), cadence, schedule + timezone, platforms, voice (ElevenLabs voice id), review mode.
3. Replace `brand/` logos and adapt `agents/_shared.md` + the safety/banned topics for the niche.
4. Create the accounts/apps in section 6 for the new brand: **new** YouTube OAuth token, Meta Page/IG/Threads (a new Meta app or a new use case), a **new Post for Me project** (never reuse another brand's project), a new B2 bucket + restricted key, a new Telegram bot.
5. Set all secrets with `gh secret set` (never commit `.env`).
6. Generate the music library + SFX kit once (`audio-assets.yml`).
7. Run Daily production with `test_run: true` (and `only: long` for the long-video path) → check outputs, Telegram, B2.
8. Enable Daily, Publisher, Analytics, Telegram, Radar workflows.

Suggested opening prompt for the new session:
> "Build a fully automated faceless social channel for the **<niche>** niche, modelled on `<path or URL of this repo>/docs/BLUEPRINT.md`. Same stack (GitHub Actions, Claude Agent SDK agents, HyperFrames cartoon videos, ElevenLabs, Post for Me for TikTok, Meta Graph + Threads APIs, YouTube Data API, Backblaze B2, Telegram), same cadence and fully automated review. Brand: <name, colours, logo path>. Accounts: <URLs>. Timezone of the audience: <tz>."
