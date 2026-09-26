import { spawn } from "node:child_process";

/** Run a command, streaming output; reject on non-zero exit. Returns captured stdout. */
export function run(cmd: string, args: string[], opts: { cwd?: string; quiet?: boolean; env?: NodeJS.ProcessEnv } = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const shell = process.platform === "win32" && cmd === "npx";
    // with a shell, arguments are concatenated: quote anything with spaces/special chars
    const a = shell ? args.map(x => (/[\s&|<>^"]/.test(x) ? `"${x.replace(/"/g, '\\"')}"` : x)) : args;
    const p = spawn(cmd, a, { cwd: opts.cwd, env: opts.env ?? process.env, shell });
    let out = "", err = "";
    p.stdout.on("data", d => { out += d; if (!opts.quiet) process.stdout.write(d); });
    p.stderr.on("data", d => { err += d; if (!opts.quiet) process.stderr.write(d); });
    p.on("error", reject);
    p.on("close", code => code === 0 ? resolve(out) : reject(new Error(`${cmd} ${args.slice(0, 4).join(" ")}… exited ${code}: ${err.slice(-1500)}`)));
  });
}

export const ffmpeg = (args: string[]) => run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { quiet: true });

export async function probeDuration(file: string): Promise<number> {
  const out = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file], { quiet: true });
  return Number(out.trim()) || 0;
}
