import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { ROOT } from "../lib/config.js";
import { ensureDir } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { run } from "../media/exec.js";

/**
 * Media lives outside git history:
 *  - videos/thumbnails/slides → a GitHub Release per day (tag `content-YYYY-MM-DD`)
 *  - carousel images also → the `media` branch, because Instagram needs public direct image URLs
 *    (raw.githubusercontent.com serves them with a proper image/* content type).
 */
const repo = () => {
  const r = process.env.GITHUB_REPOSITORY;
  if (!r) throw new Error("GITHUB_REPOSITORY not set (run inside GitHub Actions or export it)");
  return r;
};
const gh = (args: string[]) => run("gh", args, { quiet: true });

export async function uploadToRelease(tag: string, files: string[]) {
  try { await gh(["release", "view", tag, "--repo", repo()]); }
  catch {
    await gh(["release", "create", tag, "--repo", repo(), "--title", `Content ${tag.replace("content-", "")}`, "--notes", "Automated InforMed content batch.", "--prerelease"]);
  }
  for (let i = 0; i < files.length; i += 10) {
    await gh(["release", "upload", tag, "--repo", repo(), "--clobber", ...files.slice(i, i + 10)]);
  }
  log.info(`uploaded ${files.length} files to release ${tag}`);
}

export async function downloadFromRelease(tag: string, name: string): Promise<string> {
  const dir = ensureDir(join(ROOT, ".cache", "media", tag));
  const file = join(dir, name);
  if (!existsSync(file)) await gh(["release", "download", tag, "--repo", repo(), "--pattern", name, "--dir", dir, "--clobber"]);
  return file;
}

async function ensureMediaBranch() {
  try { await gh(["api", `repos/${repo()}/branches/media`]); }
  catch {
    const def = (await gh(["api", `repos/${repo()}`, "--jq", ".default_branch"])).trim();
    const sha = (await gh(["api", `repos/${repo()}/git/ref/heads/${def}`, "--jq", ".object.sha"])).trim();
    await gh(["api", `repos/${repo()}/git/refs`, "-f", "ref=refs/heads/media", "-f", `sha=${sha}`]);
  }
}

/** Put images on the `media` branch and return their public raw URLs. */
export async function publishImages(files: string[], prefix: string): Promise<string[]> {
  await ensureMediaBranch();
  const urls: string[] = [];
  for (const f of files) {
    const path = `carousels/${prefix}/${basename(f)}`;
    let sha: string | undefined;
    try { sha = (await gh(["api", `repos/${repo()}/contents/${path}?ref=media`, "--jq", ".sha"])).trim(); } catch { /* new file */ }
    // body via --input: base64 images exceed the OS per-argument length limit
    const body = join(ensureDir(join(ROOT, ".cache", "tmp")), `put-${basename(f)}.json`);
    writeFileSync(body, JSON.stringify({ message: `media: ${path}`, branch: "media", content: readFileSync(f).toString("base64"), ...(sha ? { sha } : {}) }));
    await gh(["api", "-X", "PUT", `repos/${repo()}/contents/${path}`, "--input", body]);
    urls.push(`https://raw.githubusercontent.com/${repo()}/media/${path}`);
  }
  return urls;
}
