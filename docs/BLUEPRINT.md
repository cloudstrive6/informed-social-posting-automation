# Blueprint: fully automated faceless social channel

How the InforMed system is built, published and operated, written so it can be recreated for another niche.
(Code: this repo. Setup details: [SETUP.md](SETUP.md). Connecting the social accounts: [SOCIAL-ACCOUNTS-SETUP.md](SOCIAL-ACCOUNTS-SETUP.md). Visual style: [STYLE.md](STYLE.md).)
_Last updated 2026-09-29._

---

## 1. Architecture at a glance

- **Runtime:** GitHub Actions only (public repo = free minutes). No server. State lives in `data/` and is committed back by the bot.
- **Brains:** Claude agents through the **Claude Agent SDK**, authenticated with one `CLAUDE_CODE_OAUTH_TOKEN` (`claude setup-token`, valid 1 year). Every agent has a prompt in `agents/*.md`; every answer is forced into a JSON schema (`src/lib/schemas.ts`).
- **Config:** everything channel-specific is in `config/channel.json`: brand, audience, **niche** (brief, pillars, guardrails, radar sources), cadence, **schedule**, **spacing**, platforms, voice, video, music, QA thresholds, safety, review mode, models, **YouTube playlists**. Pronunciations: `config/pronunciations.json`.
- **Niche (current):** GLP-1, positive and evidence-based (9 content pillars; each pillar = a YouTube playlist).
- **Cadence (per day):** 1 long video (8–15 min), 3 Shorts (< 90 s), 1 carousel.

### Daily schedule (New York time; each piece drops on all its platforms at the same minute)
| Time (NY) | Time (NZ, NZDT) | Piece | Platforms |
|---|---|---|---|
| 08:00 | 01:00 | Short #1 | YouTube Shorts, Instagram Reels, TikTok, Facebook Reels |
| 13:00 | 06:00 | Short #2 | same |
| 14:00 | 07:00 | **Long video** | YouTube |
| 17:30 | 10:30 | Carousel | Instagram, Facebook, TikTok (photo), Threads |
| 20:00 | 13:00 | Short #3 | same as Shorts |

Spacing rule (`config.spacing`): never two pieces of a kind on a platform closer than **long 8 h, short 4 h, carousel 16 h** (so never more than one carousel a day), enforced when slots are assigned and again right before posting.

### Workflows (`.github/workflows/`)
| Workflow | When | Does |
|---|---|---|
| `radar.yml` Trend radar | every 4 h | Signals (PubMed niche query, Google News queries, Google Trends, Wikipedia spikes, Reddit, YouTube) → Trend Scout → `data/radar/latest.json` |
| `daily.yml` Daily production | **22:00 New York the evening before** (cron 02:00 UTC + backups 02:30/03:00; a one-run-per-day guard skips duplicates) | Plan → produce Shorts + carousels in parallel, then the long video → **finalize**: GitHub release, `media` branch, **B2 archive**, Editor-in-Chief on held items, **spaceOut**, YouTube pre-scheduling, quality log, craft notes, Telegram summary. Inputs: `date`, `test_run`, `only` |
| `publish.yml` Publisher | **always-on loop**: each run checks every minute for ~5.5 h, then starts its successor (cron = watchdog) | Posts whatever is due within ~1 min of its slot. Manual inputs: `item` (+`platforms`) post now · `replace_youtube` · `unschedule_youtube` · `fix_description` |
| `analytics.yml` | daily | Renews the Threads token; pulls metrics → Performance Analyst → `data/learnings.md` |
| `telegram.yml` | every 5 min (listens ~4.5 min) | Telegram buttons (veto / approve) and `/pending` |
| `notify-failures.yml` | on any workflow failure | Telegram alert with the run link |
| `review.yml` | issue labelled | Legacy human-review path (`approved` / `rejected` labels) |
| `audio-assets.yml` | manual | Generates the SFX kit / music library once |

---

## 2. The agent team (`agents/*.md`)
| Agent | Model | Job |
|---|---|---|
| Trend Scout | Opus | Ranks radar signals into early/rising topics inside the niche |
| Content Strategist | Opus | Daily slate: ids, topics, angles, keywords, **pillar** (= playlist); rotates pillars |
| Fact-Checker | Opus + web | Screens topics; checks scripts/slides (PASS / REVISE / HOLD); packaging check (only the fields that exist) |
| Scriptwriter (long / short) | Opus | Hook-driven scripts (long 1,400–2,000 words, auto expand/trim; short 110–150 words) |
| Narration Director | Opus | Rewrites for the ear and pacing (no respelling: the lexicon does that) |
| Pronunciation Coach | Opus + web | Looks up hard terms missing from the lexicon (drug labels, medical dictionaries) |
| Motion Designer | Opus (Shorts) / Sonnet (long) | Plans every animated shot (characters, faces, speech bubbles, backdrops, camera) |
| Visual Critic | Sonnet (vision) | Scores contact sheets of key frames; sends fixes back |
| Sound Designer | Sonnet | Music gain + SFX levels from measured loudness; custom SFX |
| Title Writer | Opus | 5+ CTR title candidates |
| Thumbnail Designer | Opus | 3 psychology-driven cartoon thumbnail concepts |
| Thumbnail Judge | Sonnet (vision) | Picks the likeliest click at phone size |
| SEO Writer | Sonnet | Description (AEO), chapters, tags, pinned comment |
| Carousel Designer | Opus | 6–9 slide comic infographic carousels |
| Social Copywriter | Sonnet | Captions: YouTube Shorts, Instagram, TikTok, Facebook, Threads (no hashtags) |
| Packaging Editor | Sonnet | Applies packaging-check fixes to long-video title/thumbnail/description (never adds social captions) |
| Editor-in-Chief | Opus | Final publish/drop call on anything held (fully automated mode) |
| Playlist Curator | Sonnet | Picks the playlist for videos that have no pillar tag |
| Quality Coach | Opus | Turns recurring QA findings into `data/craft-notes.md` |
| Performance Analyst | Opus | Turns metrics into `data/learnings.md` |

Shared context every agent sees: `agents/_shared.md` + brand/audience/niche/guardrails from config + `learnings.md` + `craft-notes.md`.

---

## 3. Production pipeline (per piece)

1. **Plan** (`src/plan/planDay.ts`): radar → strategist (with pillars) → fact-checker screens topics. Content date = tomorrow when started in the evening.
2. **Script ⇄ fact-check loop** (`writeWithFactCheck`): up to 2 revision rounds; minor fixes auto-applied; long scripts kept inside the 8–15 min word window.
3. **Narration** (`narrateChecked` → `narrate`): voice chain **Chirp 3 HD "Algenib" → ElevenLabs → Chatterbox → Kokoro**; Whisper checks every scene against the script (vocabulary prompt + tolerance for long technical terms); retakes on mismatch; hard holds if a video is outside 8–15 min (long) or over 90 s (Short).
4. **Pronunciation**: `config/pronunciations.json` (curated, stressed syllable in capitals) + `data/pronunciations.json` (learned) applied to ElevenLabs/Chatterbox; Chirp reads the plain script (it spells capitalized respellings as letters).
5. **Visuals**: Motion Designer shot plan → HyperFrames composition → layout audit + near-empty-shot check + Visual Critic → revise → render 1080p **60 fps** (long videos: critic samples the first minute + every other shot).
6. **Frame checks** (ffmpeg): black frames, freezes, photosensitive flashing.
7. **Audio**: music (normalized to −16 LUFS, ducked ~4–5 dB under the voice, target ≈ 13 dB under the voice overall / ≈ 18 dB while speaking) + SFX kit + custom SFX → Sound Designer → mix to −15 LUFS → Whisper masking check.
8. **Packaging**: titles → thumbnails (3 rendered, judge picks, runners-up kept for YouTube Test & compare) → SEO / captions → **packaging check loop** (checker ⇄ editor) → description cleaned of any social captions.
9. **Finalize**: GitHub Release per day, `media` branch (public image URLs), **B2 archive**, Editor-in-Chief, spacing, YouTube pre-scheduling (`publishAt`), quality log, learned pronunciations.
10. **Publish** at the slot (always-on loop); YouTube videos added to their **playlists**; posting report to Telegram.

---

## 4. Toolset
| Area | Tool | Cost |
|---|---|---|
| Agents | Claude Agent SDK + Claude subscription OAuth token | subscription |
| Animation | Own engine (`src/media/animated.ts`, `vector/`): flat-vector SVG components, cartoon faces + blinking + talking mouths, speech bubbles, illustrated backdrops, doodle theme; **GSAP**; **HyperFrames 0.8.77** renders HTML → MP4 | free |
| Illustrations | Microsoft **Fluent Emoji (Flat)** + **Healthicons** (MIT, via Iconify) | free |
| Voice | **Google Cloud TTS Chirp 3 HD** (voice *Algenib*), free up to 1M characters/month (usage guard in `data/usage/chirp.json`); fallbacks: **ElevenLabs** (Jeremy), **Chatterbox** Turbo, **Kokoro** | free (ElevenLabs optional) |
| Music | **Eleven Music** library: 1 × 3-min track per mood in `assets/music/` (generate once, reuse) | one-time credits |
| SFX | ElevenLabs sound-effect kit (30 reusable, `assets/sfx/`) + a few custom per video | small |
| Speech QA / captions | **faster-whisper** (word timing, vocabulary prompt); normalizer (numbers, acronyms, UK/US spelling, years, near-miss technical terms) | free |
| Media processing | **ffmpeg**, **Playwright/Chromium** | free |
| Carousels | Own comic-infographic renderer (`src/media/comic.ts`), 1080×1350 JPEG, auto-fit + overlap detection | free |
| Thumbnails | Own cartoon engine (`thumbCartoon.ts`) + judge (`thumbPick.ts`) | free |
| Fonts | Montserrat, Fredoka, Bangers (OFL) | free |
| Storage | GitHub Releases + `media` branch (working), **Backblaze B2** (archive + small state like the Threads token) | pennies |
| Notifications | **Telegram** bot | free |

---

## 5. How each piece is published
| Content | Platform | How | Code |
|---|---|---|---|
| Long video | **YouTube** | Own Google Cloud OAuth app → Data API v3 resumable upload at finalize, private with `publishAt` (public at the slot); custom thumbnail; added to its pillar playlist | `src/publish/youtube.ts`, `playlists.ts` |
| Short | **YouTube Shorts** | Same API; also added to its pillar playlist + "GLP-1 in 60 Seconds" | `youtube.ts`, `playlists.ts` |
| Short | **Instagram Reels** | Graph API container with `video_url` = public GitHub release asset (binary rupload fails), wait FINISHED, publish | `src/publish/meta.ts` |
| Short | **Facebook Reels** | Page token → Reels upload API | `meta.ts` |
| Short | **TikTok** | **Post for Me** (project "InforMed", @informedlab only): signed upload → `social-posts` (public, AI-generated label) | `src/publish/postforme.ts` |
| Carousel | **Instagram** | Graph API carousel from public image URLs (`media` branch) | `meta.ts` |
| Carousel | **Facebook** | Page photo album | `meta.ts` |
| Carousel | **TikTok** | Post for Me photo post with TikTok's `auto_add_music` (API can't pick a track) | `postforme.ts` |
| Carousel | **Threads** | Our Meta app's Threads API: image items → CAROUSEL (≤ 500 chars, no hashtags) | `src/publish/threads.ts` |

**Maintenance (Actions → Publisher → Run workflow):** `item` = post an item now (optionally `platforms`) · `unschedule_youtube` = keep a scheduled video private · `replace_youtube` = delete an old upload and publish a remade file from the release · `fix_description` = strip stray captions from a live description.

---

## 6. Platform setup (what to create, which secrets)
| Service | Setup | GitHub secrets |
|---|---|---|
| **Claude** | `claude setup-token` (1-year OAuth token) | `CLAUDE_CODE_OAUTH_TOKEN` |
| **Google TTS (Chirp 3 HD)** | Same Google Cloud project as YouTube (must have billing linked; free tier covers our use) → enable **Cloud Text-to-Speech API** → API key restricted to that API (application restriction: None) | `GOOGLE_TTS_API_KEY` |
| **YouTube** | Google Cloud project → YouTube Data API v3 (+ Analytics) → OAuth consent screen (external, **In production**, privacy + terms URLs) → OAuth client *Desktop* → `npm run auth:youtube` (scopes: `youtube.upload`, `youtube.readonly`, `yt-analytics.readonly`, **`youtube.force-ssl`** for playlists / edits / deletes) | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` |
| **Instagram + Facebook** | Meta developer app (Business) with *Instagram* + *Pages* use cases; IG professional account linked to the Page; Graph API Explorer token → `npm run auth:meta` → never-expiring Page token | `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_USER_ID` |
| **Threads** | Same Meta app → use case *Access the Threads API* (threads_basic, threads_content_publish, threads_manage_insights); redirect/uninstall/delete URLs; add the account as **Threads Tester** → accept in Threads (Settings → Account → Website permissions → Invites) → User Token Generator. Renewed daily into B2 | `THREADS_ACCESS_TOKEN`, `THREADS_APP_ID`, `THREADS_APP_SECRET` |
| **TikTok** | Post for Me → **new Quickstart project per brand** → enable TikTok → connect the account (Posts + Feeds; external ID = handle) → project API key | `POSTFORME_API_KEY` |
| **ElevenLabs** (optional) | API key (TTS + SFX + Music) | `ELEVENLABS_API_KEY` |
| **Backblaze B2** | Private, encrypted bucket + key restricted to that bucket | `B2_KEY_ID`, `B2_APPLICATION_KEY` |
| **Telegram** | @BotFather `/newbot`; message the bot once → chat id from `getUpdates` | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| **GitHub** | Public repo; bot commits as `informed-bot`; owner commits with the GitHub *noreply* email | `GITHUB_TOKEN` (automatic) |

---

## 7. Automation, safety and learning loops
- **Fully automated review** (`review.mode: "auto"`): checks hold anything doubtful → **Editor-in-Chief** publishes or drops (hard media failures always dropped). Telegram FYIs with a **🛑 Don't post** veto.
- **Fact-check gates** on topics, scripts/slides and packaging; niche guardrails + banned topics in config.
- **Quality loop:** QA findings → `data/quality/log.jsonl` → Quality Coach → `data/craft-notes.md`.
- **Performance loop:** metrics → Performance Analyst → `data/learnings.md`.
- **Punctuality:** always-on Publisher + spacing rule + production the evening before.
- **Resilience:** agents wait out Claude usage limits; Sonnet for high-volume agents; rendered videos never lost if packaging fails; voice fallback chain; backup cron starts with a duplicate guard; failure alerts on Telegram.

---

## 8. Lessons learned (save the next build a day)
- **Claude subscription usage limits** are the real bottleneck: stagger jobs, use Sonnet for volume work, sample the critic on long videos, wait for the reset instead of failing. 1 long video/day is far lighter than 3.
- **GitHub scheduled workflows are unreliable**: a `*/15` cron fired only every 3–8 h and daily crons were dropped → use a self-chaining always-on loop for publishing, backup crons + a duplicate guard for production.
- **Never "post ASAP" when a slot passed** → it bunches posts; re-slot with spacing instead.
- **Instagram Reels**: publish from a public `video_url`; the resumable binary upload fails.
- **TikTok**: a self-built TikTok app is private-only until audit → Post for Me. Photo-post music is TikTok's auto pick only.
- **YouTube**: consent screen *In production*; add `youtube.force-ssl` from day one (playlists, edits, deletes need it); quota 10k/day ≈ 6 uploads.
- **Voices**: Google Chirp 3 HD is the best *free* narrator (1M chars/month) and knows drug names; it reads capitalized respellings as letters, so give it plain text. Open models that beat Chatterbox are either non-commercial (Breeze, Fish S2, Voxtral) or need a GPU (Higgs, VibeVoice).
- **Pronunciation**: a fixed lexicon beats letting an agent respell ad hoc; Whisper can't detect stress, so the lexicon must be right at the source.
- **Packaging checker** must know which fields exist per format, or it demands (and an editor pastes) social captions into a YouTube description; keep a code-level cleanup as a backstop.
- **ElevenLabs**: Starter rejects mp3 192 kbps (use 128); music ≈ 905 credits/min → build a small library once; a 10-min narration ≈ 10k credits.
- **HyperFrames**: never put timing on an element that is itself stretched (wrap in a timed div); absolute tween values; bundle GSAP locally.
- **Whisper QA** needs normalization (numbers, years, UK/US spelling, spelled acronyms, near-miss technical terms) or it holds good videos.
- **Carousels**: detect overlapping text boxes, not only footer overflow.
- **Telegram** only accepts a button acknowledgement for a few seconds → long-poll listener.
- **Windows dev machine**: bash heredocs mangle `\n`/`\s` → edit regex-heavy code with a file-based patch or the editor.

---

## 9. Recreate it for a new niche (checklist to give Claude Code)
1. Copy this repo into a new **public** repo; update `README.md`.
2. `config/channel.json`: brand (name, handle, colours, disclaimer), audience, **niche** (brief, pillars, guardrails, radar match/subreddits/YouTube/news/PubMed queries), cadence, schedule + timezone, spacing, platforms, voice (Chirp voice name; ElevenLabs voice id if used), review mode, **YouTube playlists (one per pillar + a Shorts playlist)**.
3. Replace `brand/` logos; adapt `agents/_shared.md`, safety/banned topics and `config/pronunciations.json` for the niche.
4. Create the accounts/apps in section 6 for the new brand: **new** YouTube OAuth token (with `youtube.force-ssl`), Google TTS key, Meta Page/IG/Threads, a **new Post for Me project** (never reuse another brand's), a new B2 bucket + restricted key, a new Telegram bot.
5. Set all secrets with `gh secret set` (never commit `.env`).
6. Generate the music library + SFX kit once (`audio-assets.yml`).
7. Run Daily production with `test_run: true` (and `only: long`) → check outputs, Telegram, B2.
8. Enable Daily, Publisher (starts its own loop), Analytics, Telegram, Radar workflows.

Suggested opening prompt for the new session:
> "Build a fully automated faceless social channel for the **<niche>** niche, modelled on `<path or URL of this repo>/docs/BLUEPRINT.md`. Same stack (GitHub Actions, Claude Agent SDK agents, HyperFrames cartoon videos, Google Chirp 3 HD narration, Post for Me for TikTok, Meta Graph + Threads APIs, YouTube Data API with playlists, Backblaze B2, Telegram), same cadence, spacing and fully automated review. Brand: <name, colours, logo path>. Accounts: <URLs>. Audience timezone: <tz>."
