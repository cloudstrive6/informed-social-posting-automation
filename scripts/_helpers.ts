import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";

// pick up values saved in the git-ignored .env (e.g. YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET)
try { process.loadEnvFile(".env"); } catch { /* no .env */ }

const rl = createInterface({ input: process.stdin, output: process.stdout });

export async function ask(q: string, envName?: string): Promise<string> {
  if (envName && process.env[envName]) return process.env[envName]!;
  return (await rl.question(q)).trim();
}

export function done() { rl.close(); }

/** Store secrets in the GitHub repo via `gh secret set` (value passed on stdin, never on the command line). */
export async function offerToSaveSecrets(values: Record<string, string>) {
  const yes = process.env.SAVE_SECRETS === "1" || (await rl.question("\nSave these as GitHub Actions secrets for this repo now? (requires `gh auth login`) [y/N] ")).trim().toLowerCase() === "y";
  if (!yes) {
    console.log("\nAdd them manually: GitHub repo → Settings → Secrets and variables → Actions → New repository secret.");
    return;
  }
  for (const [name, value] of Object.entries(values)) {
    await new Promise<void>((resolve, reject) => {
      const p = spawn("gh", ["secret", "set", name], { stdio: ["pipe", "inherit", "inherit"], shell: process.platform === "win32" });
      p.stdin.end(value);
      p.on("close", code => (code === 0 ? resolve() : reject(new Error(`gh secret set ${name} failed`))));
    });
    console.log(`  ✓ ${name}`);
  }
}
