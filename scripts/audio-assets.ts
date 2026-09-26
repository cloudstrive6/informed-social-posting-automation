/**
 * One-time ElevenLabs asset generation (needs ELEVENLABS_API_KEY):
 *   npm run sfx:kit        → assets/sfx/<name>/1..3.mp3  (the sounds used on every animation event)
 *   npm run music:library  → assets/music/<mood>/eleven-1..N.mp3  (reusable scores; cheapest way to get real music)
 * Commit the results; every video then uses them at no extra cost.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { config, ROOT } from "../src/lib/config.js";
import { ensureDir } from "../src/lib/fsx.js";
import { elevenMusic, elevenSfx } from "../src/media/eleven.js";

const KIT: Record<string, [string, number]> = {
  pop: ["soft cartoon bubble pop for an animated explainer, short, clean, playful, no reverb", 0.6],
  bubble: ["cute bubbly squelch of cells appearing in a science animation, quick sequence of soft blips", 0.8],
  blip: ["friendly soft digital UI blip for a label appearing in a motion graphic", 0.5],
  ding: ["bright gentle chime ding for a statistic reveal, positive, clean", 1.5],
  whoosh: ["smooth airy whoosh transition for an animated documentary, cinematic, soft", 1.0],
  whip: ["fast whip pan swish transition, snappy, clean", 0.6],
  swoosh: ["gentle short swoosh of an object sliding in, motion graphics", 0.7],
  swell: ["short cinematic reverse swell riser leading into a reveal", 1.6],
  hit: ["deep soft cinematic impact boom with a warm tail, for a dramatic title card", 2.0],
  tick: ["tiny soft wooden click for a quick cut", 0.5],
};

const mode = process.argv[2];
if (mode === "sfx") {
  for (const [name, [prompt, secs]] of Object.entries(KIT)) {
    const dir = ensureDir(join(ROOT, "assets", "sfx", name));
    for (let v = 1; v <= 3; v++) {
      const out = join(dir, `${v}.mp3`);
      if (existsSync(out)) continue;
      await elevenSfx(`${prompt}, variation ${v}`, secs, out);
      console.log(`✓ ${name}/${v}`);
    }
  }
} else if (mode === "music") {
  // ~905 credits per minute of music: one 3-minute track per mood ≈ 13.6k credits for the whole library
  const perMood = Number(process.argv[3] ?? 1), seconds = Number(process.argv[4] ?? 180);
  for (const [mood, prompt] of Object.entries(config.music.prompts)) {
    const dir = ensureDir(join(ROOT, "assets", "music", mood));
    for (let v = 1; v <= perMood; v++) {
      const out = join(dir, `eleven-${v}.mp3`);
      if (existsSync(out)) continue;
      await elevenMusic(`${prompt}. Variation ${v}: ${["more minimal", "more melodic", "more rhythmic", "more cinematic"][(v - 1) % 4]}.`, seconds, out);
      console.log(`✓ ${mood}/${v}`);
    }
  }
} else {
  console.log("usage: tsx scripts/audio-assets.ts sfx | music [perMood=1] [seconds=180]");
}
