# Blueprint: connecting social accounts for automated posting

Step-by-step setup of every platform connection the pipeline posts through, as done for InforMed (2026-09).
Use it to connect a new brand. Companion docs: [BLUEPRINT.md](BLUEPRINT.md) (whole system), [SETUP.md](SETUP.md).

**Rules that apply to every step**
- One set of connections **per brand**: its own Google Cloud OAuth token, Meta Page/IG/Threads, Post for Me project, Telegram bot. Never reuse another brand's project or token.
- Secrets go into the local `.env` (git-ignored) and then into **GitHub → Settings → Secrets** with `gh secret set NAME` (the helper scripts do this with `SAVE_SECRETS=1`). Never paste a secret into a chat, an issue or a commit.
- Restrict every key to the one API it needs; give tokens only the scopes listed here.
- Before first use, make sure the brand accounts exist and are set up as **professional/business** accounts (below).

---

## 0. Accounts to have first
| Platform | Account type needed | Notes |
|---|---|---|
| YouTube | A channel owned by a Google account (brand account is fine) | Note the Google account that owns it |
| Facebook | A **Facebook Page** for the brand | You must be an admin of the Page |
| Instagram | **Professional** account (Creator or Business) **linked to the Facebook Page** | Page → Settings → Linked accounts → Instagram |
| Threads | Profile of the same Instagram account | Created from the Instagram app |
| TikTok | TikTok account for the brand (Business account recommended) | Login details for the OAuth approval |

---

## 1. YouTube (Shorts + long videos, playlists): own Google Cloud app

**Result:** `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`

1. **Google Cloud project**: <https://console.cloud.google.com/projectcreate> → e.g. "InforMed Upload". Link a billing account (Billing → Link) if you'll also use Google TTS; YouTube itself is free.
2. **Enable APIs** (APIs & Services → Library): **YouTube Data API v3**, **YouTube Analytics API**.
3. **OAuth consent screen** (APIs & Services → OAuth consent screen / Google Auth Platform):
   - User type **External**; app name; support email; **app logo** optional.
   - **Privacy policy URL** and **Terms URL**: public pages (this repo's `PRIVACY.md` and `TERMS.md` on GitHub work).
   - Scopes don't need to be listed for a private-use app.
   - **Publish the app ("In production")**. In *Testing* mode refresh tokens expire after 7 days and Google shows "access_denied" to anyone not listed as a test user. An unverified production app shows a warning on the consent page; click *Advanced → Go to app*.
4. **OAuth client**: Credentials → Create credentials → **OAuth client ID** → type **Desktop app** → copy the client ID + secret into `.env` (`YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`).
5. **Authorize the channel**: `SAVE_SECRETS=1 npm run auth:youtube` prints a Google URL and waits on `http://127.0.0.1:53682/callback`. Open the URL in the browser where the channel's Google account is signed in → choose the channel → approve. Scopes requested:
   - `youtube.upload` (upload), `youtube.readonly` (stats), `yt-analytics.readonly` (analytics)
   - **`youtube.force-ssl`**: playlists, editing descriptions, making a video private, deleting a replaced upload, pinned comments. Include it from day one.
   The script exchanges the code for a **refresh token** and saves all three secrets to GitHub.
6. **Check**: an upload goes public at its `publishAt` time; playlists are created on first use (config `youtube.playlists`).

**Limits:** default quota 10,000 units/day ≈ 6 uploads (1,600 each) + thumbnails (50) + playlist inserts (50). Request more in the Google Cloud quota page if needed. Custom thumbnails need a verified channel (phone verification in YouTube Studio).

---

## 2. Instagram + Facebook: Meta app (Graph API)

**Result:** `META_PAGE_ACCESS_TOKEN` (never expires), `META_PAGE_ID`, `META_IG_USER_ID` (+ `META_APP_ID`, `META_APP_SECRET` locally)

1. **Meta developer account**: <https://developers.facebook.com> (log in with the Facebook account that admins the Page).
2. **Create app**: My Apps → Create app → use cases **"Manage messaging & content on Instagram"** and **"Manage everything on your Page"** (type Business, attach the brand's business portfolio). App name e.g. "InforMed Publisher".
3. App settings → Basic: copy **App ID** and **App secret** into `.env` (`META_APP_ID`, `META_APP_SECRET`). Add privacy policy URL + app icon if asked.
4. **User token with the right permissions**: Tools → **Graph API Explorer** → select the app → *User token* → add permissions:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `pages_manage_metadata`, `business_management`, `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `publish_video` → **Generate Access Token** → approve for the brand's Page + Instagram account → paste the token into `.env` as `META_USER_TOKEN`.
5. **Exchange for a permanent Page token**: `SAVE_SECRETS=1 npm run auth:meta` → exchanges the short-lived user token for a long-lived one → reads the Page (the one whose name matches the brand) and its linked Instagram account → saves `META_PAGE_ACCESS_TOKEN` (a Page token from a long-lived user token **doesn't expire**), `META_PAGE_ID`, `META_IG_USER_ID`. Then clear `META_USER_TOKEN` from `.env`.
6. **Check**: `debug_token` shows the Page token with *Expires: Never*.

**Notes:** Development-mode apps can post to Pages/IG accounts the app's admins manage; no App Review is needed for your own accounts. Instagram Reels: publish from a **public video URL** (our GitHub release asset); the resumable binary upload fails. Instagram carousels need **public image URLs** (we serve them from the repo's `media` branch).

---

## 3. Threads: same Meta app, Threads API use case

**Result:** `THREADS_ACCESS_TOKEN` (60 days, auto-renewed), `THREADS_APP_ID`, `THREADS_APP_SECRET`

1. In the same Meta app: Use cases → **Add use cases** → **Access the Threads API** → Save.
2. Use cases → Access the Threads API → **Customize → Permissions**: add `threads_basic` (default), **`threads_content_publish`**, **`threads_manage_insights`**.
3. **Settings** tab of the use case: note the **Threads app ID**; *Show* the **Threads app secret** → `.env`. Fill **Redirect Callback URLs**, **Uninstall** and **Delete** callback URLs with any public https page you control (e.g. the repo URL / `PRIVACY.md`). Pick the redirect URL from the suggestion so it becomes a chip, then **Save**.
4. **App roles → Roles → Add People → "Threads Tester"** → search the brand's Threads username → Add (status *Pending*).
5. In the **Threads app** (or threads.com) logged in as the brand: **Settings → Account → Website permissions → Invites → Accept** the app.
6. Back in the use case **Settings → User Token Generator**: the tester appears → **Generate access token** → copy into `.env` as `THREADS_ACCESS_TOKEN` → `gh secret set` (with `THREADS_APP_ID`, `THREADS_APP_SECRET`).
7. **Check**: `GET https://graph.threads.net/v1.0/me?fields=id,username` returns the brand; `me/threads_publishing_limit` shows the quota (250 posts/day).

**Token lifetime:** Threads user tokens last **60 days**. The daily Analytics workflow calls `refresh_access_token` (allowed once the token is 24 h old) and stores the current token in the private B2 bucket (`secrets/threads-token.json`); a Telegram alert fires if renewal ever fails. Testers can post without App Review. House style: **no hashtags on Threads**.

---

## 4. TikTok: Post for Me (approved app, public posting)

**Result:** `POSTFORME_API_KEY`

Why not our own TikTok app: a self-built TikTok developer app can only post **private (SELF_ONLY)** until it passes TikTok's Content Posting audit. Post for Me's approved app posts publicly right away.

1. <https://app.postforme.dev> → sign in → **Projects → +** → name = the brand → type **Quickstart Project** (uses Post for Me's approved credentials). **Use a new project per brand**; never add a brand to another brand's project.
2. Project → **Setup** → **TikTok → Enable** (standard TikTok, not "TikTok Business", unless you need business metrics).
3. Project → **Social Media Accounts → Connect an account → TikTok** → Permissions **Posts + Feeds** (Feeds = metrics) → External ID = the brand handle (e.g. `informedlab`) → **Connect TikTok** → TikTok's consent page shows the brand account (use *Switch account* if not) → **Continue**.
4. Project → **API Keys → Create API Key** → copy into `.env` as `POSTFORME_API_KEY` → `gh secret set POSTFORME_API_KEY`. The key is project-scoped: it only sees this brand's accounts.
5. **Check**: `GET https://api.postforme.dev/v1/social-accounts?platform=tiktok` (Bearer key) lists only the brand's account with status `connected`.

**Notes:** the code refuses to post to any account whose external ID / username isn't the brand handle. Videos are posted public and labelled AI-generated (AI narration). TikTok photo carousels get TikTok's auto-picked music (the API can't choose a track).

---

## 5. Notifications: Telegram bot (optional but recommended)

**Result:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

1. In Telegram, message **@BotFather** → `/newbot` → name + username ending in `bot` → copy the token into `.env`.
2. Open the bot and **send it a message** (e.g. "hi"; the Start button alone may not register).
3. Get your chat id: `https://api.telegram.org/bot<TOKEN>/getUpdates` → `message.chat.id` → `.env` → `gh secret set` both.
4. The bot then sends posting reports, failure alerts, daily summaries and Editor-in-Chief decisions (with a *Don't post* veto).

---

## 6. Secrets checklist (GitHub → Settings → Secrets and variables → Actions)
| Secret | From | Lifetime |
|---|---|---|
| `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` | Google Cloud OAuth client (Desktop) | permanent |
| `YOUTUBE_REFRESH_TOKEN` | `npm run auth:youtube` | permanent while the app is *In production* and access isn't revoked |
| `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_USER_ID` | `npm run auth:meta` | never expires (re-run if the Page password/permissions change) |
| `THREADS_ACCESS_TOKEN`, `THREADS_APP_ID`, `THREADS_APP_SECRET` | Threads use case → User Token Generator | 60 days, renewed daily into B2 |
| `POSTFORME_API_KEY` | Post for Me project → API Keys | until deleted |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | @BotFather / getUpdates | until revoked |
| `ANTHROPIC_API_KEY` (optional backup) | Anthropic Console → API keys (add credits + a spend limit) | until deleted; used only when the Claude subscription hits its weekly cap |
| `B2_KEY_ID`, `B2_APPLICATION_KEY` | Backblaze (needed for the Threads token store + archive) | until deleted |

---

## 7. Verify everything end to end
1. Run **Daily production** with `test_run: true` → items are produced and held (nothing posts).
2. Actions → **Publisher** → Run workflow → `item = <date>/<item-id>` → posts that one item to all its platforms now; check each link in the Telegram report.
3. Check YouTube Studio (visibility, playlist, description), Instagram, Facebook Page, TikTok profile and Threads profile.

## 8. Troubleshooting (seen during the InforMed setup)
| Symptom | Cause | Fix |
|---|---|---|
| Google: *Error 403: access_denied* | OAuth app in **Testing** mode | Publish the app to **In production** (and add privacy/terms URLs) |
| YouTube API: *insufficient authentication scopes* | Refresh token lacks `youtube.force-ssl` | Re-run `npm run auth:youtube` with the full scope list |
| Instagram Reel: *ProcessingFailedError* on upload | Resumable binary upload | Publish via `video_url` (public release asset) |
| Graph API Explorer: permissions not added | Pressing Enter in the permission box | Click each suggested permission |
| Threads settings won't save: "specify an OAuth redirect URL" | URL typed but not turned into a chip | Pick the suggestion so it becomes a chip, then Save |
| Threads token generator shows nobody | Tester invite not accepted yet | Accept in Threads → Settings → Account → Website permissions → Invites |
| TikTok posts private-only | Using your own TikTok developer app before audit | Use Post for Me (approved app) |
| Git push rejected: *email privacy restrictions* | Commit uses a private email | Set the repo's `user.email` to your GitHub noreply address |
