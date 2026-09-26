/**
 * One-time Instagram + Facebook setup. Turns a short-lived user token into a never-expiring Page token
 * and finds the Instagram professional account linked to the InforMed Lab Page.
 *
 *   1. developers.facebook.com → create an app (type "Business"), add products "Facebook Login for Business" and "Instagram".
 *   2. Graph API Explorer → select your app → "Get User Access Token" with permissions:
 *      pages_show_list, pages_read_engagement, pages_manage_posts, business_management,
 *      instagram_basic, instagram_content_publish, instagram_manage_insights
 *   3. npm run auth:meta  → paste the app id/secret and that token.
 */
import { ask, done, offerToSaveSecrets } from "./_helpers.js";

const V = process.env.META_GRAPH_VERSION ?? "v23.0";
const get = (path: string) => fetch(`https://graph.facebook.com/${V}/${path}`).then(r => r.json() as Promise<any>);

const appId = await ask("Meta App ID: ", "META_APP_ID");
const appSecret = await ask("Meta App secret: ", "META_APP_SECRET");
const shortToken = await ask("Short-lived user access token (from Graph API Explorer): ", "META_USER_TOKEN");

const long = await get(`oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`);
if (!long.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(long)}`);

const pages = await get(`me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${long.access_token}`);
if (!pages.data?.length) throw new Error(`No Pages found for this user: ${JSON.stringify(pages)}`);
pages.data.forEach((p: any, i: number) => console.log(`  [${i}] ${p.name} (${p.id}) → IG: ${p.instagram_business_account?.username ?? "none linked"}`));
const byName = pages.data.findIndex((p: any) => /informed/i.test(p.name));
const pick = pages.data.length === 1 ? 0 : byName >= 0 ? byName : Number(await ask("Which Page is InforMed Lab? [index]: "));
const page = pages.data[pick];
if (!page.instagram_business_account) console.log("⚠ No Instagram professional account is linked to this Page. Link @informedlab in Page settings → Linked accounts, then re-run.");

const dbg = await get(`debug_token?input_token=${page.access_token}&access_token=${appId}|${appSecret}`);
console.log(`\nPage token expires: ${dbg.data?.expires_at ? (dbg.data.expires_at === 0 ? "never" : new Date(dbg.data.expires_at * 1000).toISOString()) : "never"}`);

await offerToSaveSecrets({
  META_PAGE_ACCESS_TOKEN: page.access_token,
  META_PAGE_ID: page.id,
  ...(page.instagram_business_account ? { META_IG_USER_ID: page.instagram_business_account.id } : {}),
});
done();
