import { existsSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { config, ROOT } from "../lib/config.js";
import { writeJson } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { ffmpeg, probeDuration, run } from "./exec.js";

const HF = "hyperframes@0.8.77";

/** Render a HyperFrames project folder (index.html) to a silent MP4 at the configured fps (60 by default). */
export async function renderComposition(projectDir: string, outFile: string, safeCapture = false): Promise<string> {
  log.info(`rendering ${projectDir} → ${outFile} @ ${config.video.fps}fps`);
  // render inside the project folder (relative path: no quoting issues with spaces), then move
  await run("npx", ["-y", HF, "render", "--output", "render.mp4", "--fps", String(config.video.fps), "--quality", config.video.quality, "--workers", "auto", "--quiet"], {
    cwd: projectDir,
    // safeCapture: full-fidelity screenshot capture (slower) — used to re-render if frame checks find glitches
    env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1", HYPERFRAMES_NO_TELEMETRY: "1", ...(safeCapture ? { PRODUCER_EXPERIMENTAL_FAST_CAPTURE: "false" } : {}) },
  });
  renameSync(join(projectDir, "render.mp4"), outFile);
  return outFile;
}

/** Your own tracks win: assets/music/<mood>/*, then assets/music/*. */
function userMusic(mood: string, seed: string): string | undefined {
  for (const dir of [join(ROOT, "assets", "music", mood), join(ROOT, "assets", "music")]) {
    let files: string[] = [];
    try { files = readdirSync(dir).filter(f => /\.(mp3|wav|m4a|ogg|flac)$/i.test(f)); } catch { /* none */ }
    if (files.length) {
      const h = [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
      return join(dir, files[h % files.length]);
    }
  }
  return undefined;
}

const py = () => process.env.PYTHON ?? "python";
const hash = (s: string) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);

/** Shot palettes → score mood. */
export function musicMood(moods: string[]): string {
  const count = new Map<string, number>();
  for (const m of moods) count.set(m, (count.get(m) ?? 0) + 1);
  const top = [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "body";
  return ({ body: "wonder", immune: "tense", clinic: "hopeful", night: "curious", warm: "hopeful", brand: "curious" } as Record<string, string>)[top] ?? "curious";
}

/** Music stem for a video: your library track → Eleven Music (per video) → built-in synth. */
export async function musicStem(mood: string, seconds: number, seed: string, workDir: string, prompt?: string): Promise<string | undefined> {
  const lib = userMusic(mood, seed);
  if (lib && config.music.provider !== "elevenlabs") return lib;
  if (config.music.provider === "elevenlabs" && process.env.ELEVENLABS_API_KEY) {
    const out = join(workDir, "music-eleven.mp3");
    if (existsSync(out)) return out;
    try {
      const { elevenMusic } = await import("./eleven.js");
      return await elevenMusic(prompt ?? config.music.prompts[mood] ?? config.music.prompts.curious, seconds + 2, out);
    } catch (e) { log.warn(`Eleven Music failed, using fallback: ${(e as Error).message.slice(0, 200)}`); }
  }
  if (lib) return lib;
  const out = join(workDir, "music.wav");
  if (!existsSync(out)) await run(py(), [join(ROOT, "python", "audio_kit.py"), "music", mood, String(seconds + 1), out, String(hash(seed) % 1000)], { quiet: true });
  return out;
}

/** Build the SFX stem from cues (kit samples / custom files / synth), ducking cues that land on speech. */
export async function sfxStem(cues: { t: number; sfx?: string; file?: string; gain: number; accent?: boolean }[], speech: [number, number][], seconds: number, workDir: string): Promise<string | undefined> {
  if (!cues.length) return undefined;
  const cuesFile = join(workDir, "sfx-cues.json");
  writeJson(cuesFile, { cues, speech, duck_db: 6 });
  const out = join(workDir, "sfx.wav");
  const kit = config.sfx.provider === "kit" ? join(ROOT, "assets", "sfx") : "";
  await run(py(), [join(ROOT, "python", "audio_kit.py"), "sfx", cuesFile, String(seconds + 1), out, ...(kit ? [kit] : [])], { quiet: true });
  return out;
}

/** Mix narration + music (sidechain-ducked under the voice) + SFX onto the video. Gains are linear. */
export async function mixStems(video: string, narration: string, music: string | undefined, sfx: string | undefined, musicGain: number, sfxGain: number, out: string) {
  const inputs = ["-i", video, "-i", narration];
  const graph: string[] = [music ? `[1:a]loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000,asplit=2[v][sc]` : `[1:a]loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000[v]`];
  const mixIn = ["[v]"];
  let idx = 2;
  if (music) {
    inputs.push("-stream_loop", "-1", "-i", music);
    graph.push(`[${idx}:a]aresample=48000,volume=${musicGain.toFixed(3)}[m]`, `[m][sc]sidechaincompress=threshold=0.04:ratio=6:attack=30:release=500[md]`);
    mixIn.push("[md]"); idx++;
  }
  if (sfx) { inputs.push("-i", sfx); graph.push(`[${idx}:a]aresample=48000,volume=${sfxGain.toFixed(3)}[fx]`); mixIn.push("[fx]"); }
  graph.push(`${mixIn.join("")}amix=inputs=${mixIn.length}:duration=first:normalize=0,alimiter=limit=0.95[a]`);
  await ffmpeg([...inputs, "-filter_complex", graph.join(";"),
    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-shortest", "-movflags", "+faststart", out]);
  return out;
}

export interface MixOptions { seed: string; mood?: string; cues?: { t: number; sfx: string; gain: number }[]; workDir: string }

/**
 * Final mix: loudness-normalized narration + music bed ducking under the voice + SFX track,
 * muxed onto the rendered video (H.264/AAC 48 kHz, faststart).
 */
export async function muxAudio(video: string, narration: string, out: string, seedOrOpts: string | MixOptions): Promise<string> {
  const o: MixOptions = typeof seedOrOpts === "string" ? { seed: seedOrOpts, workDir: join(narration, "..") } : seedOrOpts;
  const duration = await probeDuration(video);
  const mood = o.mood ?? "curious";
  let music = userMusic(mood, o.seed);
  if (!music && config.video.style === "animated") {
    music = join(o.workDir, "music.wav");
    if (!existsSync(music)) await run(py(), [join(ROOT, "python", "audio_kit.py"), "music", mood, String(duration + 1), music, String(hash(o.seed) % 1000)], { quiet: true });
  }
  let sfx: string | undefined;
  if (o.cues?.length) {
    const cuesFile = join(o.workDir, "sfx-cues.json");
    writeJson(cuesFile, o.cues);
    sfx = join(o.workDir, "sfx.wav");
    await run(py(), [join(ROOT, "python", "audio_kit.py"), "sfx", cuesFile, String(duration + 1), sfx], { quiet: true });
  }

  const inputs = ["-i", video, "-i", narration];
  const graph: string[] = [`[1:a]loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000,asplit=2[v][sc]`];
  const mixIn = ["[v]"];
  let idx = 2;
  if (music) {
    inputs.push("-stream_loop", "-1", "-i", music);
    graph.push(`[${idx}:a]aresample=48000,volume=${config.video.musicVolume}[m]`, `[m][sc]sidechaincompress=threshold=0.04:ratio=6:attack=30:release=500[md]`);
    mixIn.push("[md]"); idx++;
  } else graph[0] = `[1:a]loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000[v]`;
  if (sfx) {
    inputs.push("-i", sfx);
    graph.push(`[${idx}:a]aresample=48000,volume=${config.video.sfxVolume}[fx]`);
    mixIn.push("[fx]"); idx++;
  }
  graph.push(`${mixIn.join("")}amix=inputs=${mixIn.length}:duration=first:normalize=0,alimiter=limit=0.95[a]`);
  await ffmpeg([...inputs, "-filter_complex", graph.join(";"),
    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-shortest", "-movflags", "+faststart", out]);
  return out;
}
