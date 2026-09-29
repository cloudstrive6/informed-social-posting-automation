/**
 * One-time YouTube authorization. Produces the refresh token the pipeline uses to upload.
 *   1. Google Cloud Console → create an OAuth client of type "Desktop app" (YouTube Data API v3 + YouTube Analytics API enabled).
 *   2. npm run auth:youtube   → sign in with the Google account that owns @InforMedLab (pick the channel if asked).
 */
import { createServer } from "node:http";
import { ask, done, offerToSaveSecrets } from "./_helpers.js";

const PORT = 53682;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  // edit metadata of uploaded videos + post pinned comments
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

const clientId = await ask("OAuth client ID: ", "YOUTUBE_CLIENT_ID");
const clientSecret = await ask("OAuth client secret: ", "YOUTUBE_CLIENT_SECRET");

const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
  client_id: clientId, redirect_uri: REDIRECT, response_type: "code", scope: SCOPES.join(" "),
  access_type: "offline", prompt: "consent",
});
console.log(`\nOpen this URL in your browser and approve access:\n\n${url}\n`);

const code = await new Promise<string>((resolve, reject) => {
  const server = createServer((req, res) => {
    const u = new URL(req.url ?? "/", REDIRECT);
    const c = u.searchParams.get("code");
    res.end(c ? "InforMed: authorized. You can close this tab." : `Error: ${u.searchParams.get("error")}`);
    server.close();
    c ? resolve(c) : reject(new Error(u.searchParams.get("error") ?? "no code"));
  }).listen(PORT, "127.0.0.1");
});

const tok = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: REDIRECT, grant_type: "authorization_code" }),
}).then(r => r.json() as Promise<any>);
if (!tok.refresh_token) throw new Error(`No refresh token returned: ${JSON.stringify(tok)}`);

const ch = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { headers: { authorization: `Bearer ${tok.access_token}` } }).then(r => r.json() as Promise<any>);
console.log(`\nAuthorized channel: ${ch.items?.[0]?.snippet?.title ?? "(unknown)"} ${ch.items?.[0]?.snippet?.customUrl ?? ""}`);
console.log("Make sure this is @InforMedLab. Also set the OAuth consent screen to 'In production' — in 'Testing' mode Google expires refresh tokens after 7 days.");

await offerToSaveSecrets({ YOUTUBE_CLIENT_ID: clientId, YOUTUBE_CLIENT_SECRET: clientSecret, YOUTUBE_REFRESH_TOKEN: tok.refresh_token });
done();
