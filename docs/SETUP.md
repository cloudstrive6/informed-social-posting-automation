# Setup guide

Everything below is one-time. Budget about 2–3 hours, plus waiting time for platform approvals (YouTube and TikTok audits can take 1–4 weeks). The system works before the audits complete, but YouTube and TikTok posts stay **private** until then.

## 0. Put the code on GitHub (public repo)

```bash
git init && git add . && git commit -m "InforMed automation"
gh repo create informed-social-automation --public --source . --push
```

The repo being public is what makes GitHub Actions minutes free. Secrets stay private: they live in GitHub Secrets, never in the code. Never commit `.env`.

Then in the repo: **Settings → Actions → General → Workflow permissions → "Read and write permissions"** (the bot commits state and opens review issues).

## 1. Claude (the agents' brains) — required

```bash
claude setup-token
```
Save the token as the secret **`CLAUDE_CODE_OAUTH_TOKEN`**. The system makes about 40–60 agent runs a day (several use web research), so a Claude **Max** plan is recommended; on Pro you'll hit usage limits.

## 2. ElevenLabs — narration, music, sound effects (recommended, paid)

1. Create an account at https://elevenlabs.io and pick a plan with API access and commercial rights. At full cadence narration is roughly **30k characters/day (~900k/month)**. On `eleven_multilingual_v2` (1 credit/char) that needs the Scale tier; on `eleven_flash_v2_5` (half the credits, slightly less expressive) Pro is enough. Check current prices on the pricing page before choosing.
2. Profile → API keys → create a key → secret **`ELEVENLABS_API_KEY`**.
3. Choose the narrator: Voice Library → pick a voice → copy its **Voice ID** into `config/channel.json` → `voice.elevenlabs.voiceId` (default is "George", a warm storyteller).
4. The sound-effects kit (`assets/sfx/`, 30 sounds) is already generated and in the repo. Optionally run the **Generate audio assets** workflow with `music` to build a music library (4 tracks × 5 moods). This uses a lot of credits, so only do it on a larger plan; otherwise the free generated score is used. After that, music and SFX cost nothing per video. To get a fresh score for every video instead, set `music.provider` to `elevenlabs` (about 1,000 music-minutes a month at full cadence).

**Credit budget:** `voice.elevenlabs` in `config/channel.json` sets `monthlyCredits` (Starter = 40,000), the renewal day, and `useFor` (which content gets ElevenLabs; default `["short"]`). Every character is tracked in `data/usage/elevenlabs.json`. A video only uses ElevenLabs if its entire narration fits in the remaining budget, so no video changes voice partway through; the rest use Chatterbox. Custom SFX pause when under 25% of the budget is left. Rough guide at full cadence: Shorts need about 80k credits a month and long-form about 800k (half that with `eleven_flash_v2_5` and `creditsPerChar: 0.5`). Upgrade and raise `monthlyCredits` / add `"long"` to `useFor` when you're ready.

Without the key, everything still works on the free voices (Chatterbox → Kokoro), the built-in synth score and synthesized SFX.

## 2c. Backblaze B2 — permanent media archive (optional)

Every finished item (video, thumbnail, slides, script, captions, QA reports) is copied to the private bucket
`informed-lab-media` under `content/<date>/<item-id>/`. GitHub Releases remain the working store for publishing.

1. https://secure.backblaze.com/app_keys.htm → **Add a New Application Key**, restricted to bucket `informed-lab-media`, Read and Write.
2. Secrets **`B2_KEY_ID`** (the keyID) and **`B2_APPLICATION_KEY`** (shown once).
3. Optional overrides: `B2_BUCKET`, `B2_REGION` (default `us-west-004`), `B2_ENDPOINT`.
4. Backfill a day that was produced before the keys existed: `npx tsx src/publish/b2.ts out/<date>`.

## 3. YouTube

1. https://console.cloud.google.com → new project "InforMed Upload".
2. Enable **YouTube Data API v3** and **YouTube Analytics API**.
3. **OAuth consent screen**: External, add yourself as a user, then **Publish app → In production**. (In "Testing" mode Google kills refresh tokens after 7 days.)
4. **Credentials → Create OAuth client ID → Desktop app**.
5. Locally: `npm install`, then `npm run auth:youtube`. Sign in with the Google account that owns **@InforMedLab** and pick that channel. The script can save the three secrets for you (`YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`).
6. **Verify the channel by phone** (youtube.com/verify). This enables custom thumbnails and videos longer than 15 minutes.
7. **API audit (important):** videos uploaded by an unverified API project are locked to *private*. Submit the YouTube API Services audit form (https://support.google.com/youtube/contact/yt_api_form) describing "automated uploads to our own channel". Until it's approved, the videos upload fine but you'd have to flip them to public in Studio.
8. **Quota:** the default is 10,000 units/day. 6 uploads × 1,600 + 3 thumbnails × 50 = 9,750, which fits but leaves no room for retries. Request an increase in the same audit form (ask for 50,000).

**Trend research key (optional, recommended):** create a *second* Google Cloud project, enable YouTube Data API v3, create an **API key** → secret **`YOUTUBE_API_KEY`**. A separate project means research never eats into upload quota.

## 4. Instagram + Facebook

1. Instagram **@informedlab** must be a Professional (Business or Creator) account, **linked to the InforMed Lab Facebook Page** (Page settings → Linked accounts).
2. https://developers.facebook.com → **Create app** → type *Business*. Add products **Facebook Login for Business** and **Instagram**.
3. Tools → **Graph API Explorer** → select your app → *Get User Access Token* with: `pages_show_list, pages_read_engagement, pages_manage_posts, business_management, instagram_basic, instagram_content_publish, instagram_manage_insights`.
4. `npm run auth:meta` and paste the app ID, app secret and that token. It produces a **never-expiring Page token** and saves `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_USER_ID`.

Posting to your own Page and Instagram works in the app's development mode, since you're the app admin. No App Review is needed for your own accounts.

## 5. TikTok (via Post for Me)

TikTok posts go through [Post for Me](https://app.postforme.dev), whose approved TikTok app can post publicly right away.
1. In Post for Me, the **InforMed** project (Quickstart) has TikTok enabled and **@informedlab** connected (external ID `informedlab`).
2. Project → API Keys → create a key → secret **`POSTFORME_API_KEY`**. The key only sees accounts in the InforMed project, and the code refuses to post to any account other than @informedlab.
3. Optional: `TIKTOK_PRIVACY` (`public` by default). Videos are flagged as AI-generated content (AI narration).

The older direct TikTok API path (`npm run auth:tiktok`, `TIKTOK_*` secrets) still works if no Post for Me key is set.

## 6. Optional trend sources

- Reddit (Reddit blocks anonymous requests from GitHub's servers): https://www.reddit.com/prefs/apps → create a "script" app → `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`.
- NCBI/PubMed key (higher rate limit): https://account.ncbi.nlm.nih.gov/settings/ → `NCBI_API_KEY`.

## 7. Voice and music (optional upgrades)

- **Narrator voice:** Chatterbox's default voice works out of the box. To give InforMed a signature voice, put a clean 10–20 second recording at `assets/voice/narrator.wav` (your own voice, or a voice actor who licensed it to you) and every video will be narrated in that voice. Never use a recording of someone who hasn't agreed to it.
- **Music:** each video gets an automatically generated ambient score matched to its mood. To use real tracks instead, drop royalty-free files (e.g. YouTube Audio Library, "no attribution required") into `assets/music/` or mood folders `assets/music/wonder|tense|hopeful|curious|dark/`. The mixer ducks music under the voice automatically.

## 8. First run

1. Actions tab → enable workflows.
2. Run **Trend radar** manually → check `data/radar/latest.json`.
3. Run **Daily production** manually → watch the jobs → review the GitHub Release `content-YYYY-MM-DD` (videos, thumbnails, slides) and any **Review:** issues.
4. From then on everything runs on its own. Locally, `npm run doctor` shows which secrets and tools are set up.

## Tuning

- Posting times, cadence, voice, captions, banned topics, models: `config/channel.json`.
- Agent behavior: edit the playbooks in `agents/*.md` (plain English).
- Voice: Kokoro voices `af_heart` (warm female, default), `af_bella`, `am_michael`, `am_fenrir`, `bf_emma` (British)… Set `voice.kokoroVoice`.
- The Performance Analyst writes schedule suggestions into `data/learnings.md`; apply them by editing the schedule.

## Known platform limits

- YouTube's API can't pin comments, set end screens, or run thumbnail A/B tests. Do those in Studio if you want them.
- GitHub's cron can start 5–30 minutes late at busy times, so posts land close to, not exactly on, their slot. YouTube posts are exact because they use YouTube's own scheduler.
- Scheduled workflows in a public repo pause after 60 days without commits. The bot commits daily, so this won't trigger while the system is running.
