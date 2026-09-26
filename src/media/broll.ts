import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { config } from "../lib/config.js";
import { ensureDir } from "../lib/fsx.js";
import { log } from "../lib/log.js";
import { ffmpeg } from "./exec.js";
import { Orientation, stockVideo } from "./stock.js";

export interface BrollSegment { start: number; end: number; query: string; dim: boolean }

/**
 * Build ONE continuous background video from stock clips (cut on a frame-exact grid).
 * Rendering a single background under HTML overlays is far faster and more robust than
 * asking the browser renderer to decode 100 separate clips.
 */
export async function buildBroll(segments: BrollSegment[], orientation: Orientation, dir: string, maxPiece: number, fallbackQuery: string): Promise<string> {
  const fps = config.video.fps;
  const [W, H] = orientation === "landscape" ? [1920, 1080] : [1080, 1920];
  const clipsDir = ensureDir(join(dir, "clips"));
  const segDir = ensureDir(join(dir, "segments"));
  const used = new Set<string>();
  const list: string[] = [];
  let n = 0;

  for (const seg of segments) {
    const len = seg.end - seg.start;
    const pieces = Math.max(1, Math.ceil(len / maxPiece));
    for (let p = 0; p < pieces; p++) {
      const a = seg.start + (len * p) / pieces, b = seg.start + (len * (p + 1)) / pieces;
      const frames = Math.round(b * fps) - Math.round(a * fps);
      if (frames <= 0) continue;
      const clip = (await stockVideo(seg.query, orientation, clipsDir, used)) ?? (await stockVideo(fallbackQuery, orientation, clipsDir, used));
      const out = join(segDir, `seg-${String(n++).padStart(4, "0")}.mp4`);
      const look = seg.dim ? ",eq=brightness=-0.22:saturation=0.75,gblur=sigma=10" : ",eq=contrast=1.05:saturation=1.08";
      const encode = ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(fps),
        // keyframe every second: the renderer seeks constantly and sparse keyframes freeze frames
        "-g", String(fps), "-keyint_min", String(fps), "-frames:v", String(frames), out];
      if (clip) {
        await ffmpeg(["-stream_loop", "-1", "-ss", "0.4", "-i", clip,
          "-vf", `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${fps},setsar=1${look}`, ...encode]);
      } else {
        log.warn(`no stock clip for "${seg.query}" — using brand gradient`);
        await ffmpeg(["-f", "lavfi", "-i", `gradients=s=${W}x${H}:c0=0x23b1dc:c1=0x95ca5b:speed=0.01:r=${fps}`, ...encode]);
      }
      list.push(`file '${resolve(out).replace(/\\/g, "/")}'`);
    }
  }
  const listFile = join(dir, "segments.txt");
  writeFileSync(listFile, list.join("\n"));
  const bg = join(dir, "bg.mp4");
  await ffmpeg(["-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", bg]);
  log.info(`b-roll: ${n} cuts, ${used.size} unique clips`);
  return bg;
}
