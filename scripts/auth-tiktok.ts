/**
 * One-time TikTok authorization for the Content Posting API.
 *   1. developers.tiktok.com → create an app, add "Login Kit" + "Content Posting API" (enable Direct Post),
 *      request scopes user.info.basic, video.upload, video.publish, and register a redirect URI.
 *   2. npm run auth:tiktok → open the printed URL while logged in as @informedlab, approve,
 *      then paste the full URL you were redirected to.
 * Note: until TikTok approves your app's audit, posts can only be private (SELF_ONLY).
 */
import { randomBytes } from "node:crypto";
import { ask, done, offerToSaveSecrets } from "./_helpers.js";

const clientKey = await ask("TikTok client key: ", "TIKTOK_CLIENT_KEY");
const clientSecret = await ask("TikTok client secret: ", "TIKTOK_CLIENT_SECRET");
const redirect = await ask("Registered redirect URI: ", "TIKTOK_REDIRECT_URI");
const state = randomBytes(8).toString("hex");

console.log("\nOpen this URL, log in as @informedlab and approve:\n\n" + "https://www.tiktok.com/v2/auth/authorize/?" + new URLSearchParams({
  client_key: clientKey, scope: "user.info.basic,video.upload,video.publish", response_type: "code", redirect_uri: redirect, state,
}) + "\n");

const back = new URL(await ask("Paste the full URL you were redirected to: "));
if (back.searchParams.get("state") !== state) throw new Error("State mismatch — start again.");
const code = back.searchParams.get("code");
if (!code) throw new Error(`No code in URL: ${back.search}`);

const tok = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
  method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_key: clientKey, client_secret: clientSecret, code, grant_type: "authorization_code", redirect_uri: redirect }),
}).then(r => r.json() as Promise<any>);
if (!tok.refresh_token) throw new Error(`Token exchange failed: ${JSON.stringify(tok)}`);
console.log(`Authorized. Refresh token valid for ~${Math.round(tok.refresh_expires_in / 86400)} days — re-run this script before then.`);

await offerToSaveSecrets({ TIKTOK_CLIENT_KEY: clientKey, TIKTOK_CLIENT_SECRET: clientSecret, TIKTOK_REFRESH_TOKEN: tok.refresh_token });
done();
