# InforMed: working notes for Claude Code sessions

Fully automated faceless health channel **InforMed** (handle `@informedlab` / YouTube `@InforMedLab`), currently focused on
the **GLP-1 micro-niche** with a positive, evidence-based framing. Everything runs on **GitHub Actions** in this public
repo; the owner is hands-off and talks to Claude Code (locally or in a cloud session) to change or fix things.

Read first: [docs/BLUEPRINT.md](docs/BLUEPRINT.md) (whole system), [docs/SOCIAL-ACCOUNTS-SETUP.md](docs/SOCIAL-ACCOUNTS-SETUP.md)
(platform connections, secrets), [docs/SETUP.md](docs/SETUP.md), [docs/STYLE.md](docs/STYLE.md). Config: `config/channel.json`.
Agent prompts: `agents/*.md`. State: `data/` (queue per content date in `data/queue/<date>/<id>.json`, usage counters, learnings).

## Owner's standing rules (always apply)
- **Never handle credentials in forms or chat.** The owner creates keys/apps, accepts terms, approves OAuth and payments.
  Secrets live only in GitHub Actions secrets (and the owner's local `.env`, which is never committed). The repo is public:
  never commit keys, tokens, account IDs that aren't already public, or personal data.
- Ask before: creating keys/apps, accepting terms/OAuth, paying, deleting published posts, or other outward-facing actions
  the owner hasn't asked for.
- **Post for Me:** TikTok only, in the dedicated "InforMed" project. Never touch the owner's other Post for Me projects.
- **YouTube stays on the owner's own Google Cloud app** (not Post for Me).
- **Keep the repo public** (free Actions minutes; Instagram/Threads/TikTok fetch media from public release and `media`
  branch URLs). Making it private needs a migration first (see BLUEPRINT).
- Review is fully automated (`review.mode: "auto"`, Editor-in-Chief agent); the fact-check gate must stay.
- No hashtags on Threads. Long videos 8–15 min; Shorts up to 178 s (YouTube counts up to 3 min as Shorts; Facebook gets ones over 90 s as a regular Page video). One long video, three Shorts, one carousel per day.
- Voice: Google Chirp 3 HD `en-US-Chirp3-HD-Algenib` for everything (fallbacks: ElevenLabs → Chatterbox → Kokoro).
- Prefer free tools; paid services only with the owner's OK. Commit with clear messages; push to `main`.

## How things run
- `daily.yml` (02:00 UTC + backups with a duplicate guard): plan → produce Shorts/carousel/long in parallel → finalize
  (release upload, B2 archive, Editor-in-Chief, slots). GitHub's cron often fires hours late; that's expected.
- `publish.yml`: always-on loop (~5.5 h per run, then restarts itself) posting whatever is due, every minute.
- **Ops watchdog** (`src/ops/watchdog.ts`, inside the publish loop, every ~10 min): starts production at 22:05 NY if
  GitHub's cron hasn't, re-runs failed production jobs once, gives transient publish failures a second round, re-uploads
  YouTube videos that never processed, makes overdue scheduled videos public, and **orders a replacement long video**
  (`daily.yml replace_long=true`, up to 2 per day) when the day's long video is dropped, so no day goes without one. Anything else → `ops.yml` (**Ops Engineer**
  agent, `agents/ops-engineer.md`): diagnoses, unblocks, fixes code (typecheck, push to `main`), reports on Telegram.
  Max 4 escalations/day; state in `data/ops/`. Run by hand: `gh workflow run ops.yml -f incident="..."`.
- Agents run on the Claude subscription (`CLAUDE_CODE_OAUTH_TOKEN`). Short session limits are waited out; the **weekly
  cap** switches the run to the backup API key (secret `ANTHROPIC_API_KEY`, budget `config.fallbackApi`). Interactive
  Claude Code work uses the same subscription allowance.
- Telegram bot sends posting reports, failures, daily summary, Editor-in-Chief decisions (veto button).

## Maintenance (works from a phone or a cloud session: everything runs in Actions)
`gh workflow run <file> -f key=value` (or GitHub → Actions → Run workflow):
- `publish.yml`: `item=<date>/<id>` (+ `platforms=`) publish now · `replace_youtube` · `unschedule_youtube` ·
  `playlist_youtube` · `fix_description` · `inspect_facebook` (space-separated refs) · `repost_facebook`
- `remake.yml`: `item=<date>/<id>` re-voices/re-renders a Short or long video → candidate + contact sheet on Telegram;
  `replace_youtube=true` also swaps the YouTube upload if QA passes.
- `daily.yml`: `test_run=true` (produce, hold everything), `only=long|short|carousel` (re-plans the day!), `date=`,
  `replace_long=true` + `date=` (plan and produce ONE extra long video for that day; the rest of the day is untouched).
- Status: `gh run list --workflow daily.yml`, `gh run view <id> --log-failed`, and the item JSONs in `data/queue/`
  (post `status`, `slot`, `published_at`, `error`). Schedule is in New York time; NZ (owner) = NY + 17 h (NZDT).

## Gotchas
- `data/` is committed by the bots; pull (`git pull --rebase`) before editing, and expect bot commits in between.
- Release assets are shared per day (`content-<date>`): file names must be item-unique (slides are `<id>-slide-NN.jpg`).
- Chirp gets plain text (it spells out CAPS respellings); the pronunciation lexicon is for ElevenLabs/Chatterbox.
- YouTube quota: ~6 uploads/day. Threads tokens last 60 days (renewed daily into B2 by `analytics.yml`).
- Instagram Reels must use the public release URL (`video_url`); binary upload fails.
- HyperFrames: wrap timed images in a full-frame div (an element carrying `class="clip"` + timing gets stretched).
- Local Windows PC only: Python venvs `python/.venv` (Kokoro, ≤3.12) and `python/.venv-cb` (Chatterbox + Whisper);
  TLS inspection needs `pip-system-certs`. Bash heredocs mangle `\b`-style escapes; use Write/Edit or Python files.
