import { runAgent } from "../lib/agent.js";
import { config } from "../lib/config.js";
import { log } from "../lib/log.js";
import type { Scene } from "../lib/schemas.js";
import type { Timeline } from "./tts.js";
import { COMPONENT_NAMES } from "./vector/components.js";
import { Shot, ShotPlan, shotPlanSchema } from "./vector/shots.js";

const BATCH = 10;

/** Ask the Motion Designer for shots, in parallel batches of scenes (long videos have 50–80 scenes). */
export async function planShots(scenes: Scene[], tl: Timeline, vertical: boolean, topic: string): Promise<Shot[]> {
  const dur = new Map(tl.scenes.map((s, i) => [s.id, (tl.scenes[i + 1]?.start ?? tl.duration) - s.start]));
  const batches: Scene[][] = [];
  for (let i = 0; i < scenes.length; i += BATCH) batches.push(scenes.slice(i, i + BATCH));

  const run = (batch: Scene[], bi: number) => runAgent<ShotPlan>({
    agent: "motion-designer", model: config.models.writer, schema: shotPlanSchema, effort: "medium",
    input: {
      format: vertical ? "vertical 9:16 (1080x1920)" : "horizontal 16:9 (1920x1080)",
      topic,
      part: `${bi + 1} of ${batches.length}`,
      previous_context: bi > 0 ? batches[bi - 1].slice(-2).map(s => s.narration) : [],
      scenes: batch.map(s => ({
        id: s.id, section: s.section, narration: s.narration, seconds: +(dur.get(s.id) ?? 5).toFixed(1),
        writer_visual_hint: s.visual, on_screen_text: s.on_screen_text,
      })),
    },
  }).then(p => p.shots).catch(e => {
    log.warn(`motion designer batch ${bi + 1} failed (${(e as Error).message}); using fallback shots`);
    return batch.map(fallbackShot);
  });

  const out: Shot[] = [];
  for (let i = 0; i < batches.length; i += 3) {
    const res = await Promise.all(batches.slice(i, i + 3).map((b, k) => run(b, i + k)));
    res.forEach(r => out.push(...r));
  }
  // keep only shots for known scenes, with valid components
  const ids = new Set(scenes.map(s => s.id));
  const shots = out.filter(s => ids.has(s.scene_id)).map(s => ({ ...s, elements: s.elements.filter(e => COMPONENT_NAMES.includes(e.type)) }));
  for (const sc of scenes) if (!shots.some(s => s.scene_id === sc.id)) shots.push(fallbackShot(sc));
  log.info(`motion plan: ${shots.length} shots for ${scenes.length} scenes`);
  return shots;
}

/** Send criticised scenes back to the Motion Designer; returns the full shot list with those scenes replaced. */
export async function reviseShots(all: Shot[], scenes: Scene[], sceneIds: Set<string>, feedback: object[], tl: Timeline, vertical: boolean, topic: string): Promise<Shot[]> {
  const dur = new Map(tl.scenes.map((s, i) => [s.id, (tl.scenes[i + 1]?.start ?? tl.duration) - s.start]));
  const target = scenes.filter(s => sceneIds.has(s.id));
  try {
    const plan = await runAgent<ShotPlan>({
      agent: "motion-designer", model: config.models.writer, schema: shotPlanSchema, effort: "medium",
      input: {
        format: vertical ? "vertical 9:16 (1080x1920)" : "horizontal 16:9 (1920x1080)", topic,
        task: "Revise the shots for ONLY these scenes, applying the critic feedback.",
        scenes: target.map(s => ({ id: s.id, narration: s.narration, seconds: +(dur.get(s.id) ?? 5).toFixed(1) })),
        current_shots: all.filter(s => sceneIds.has(s.scene_id)),
        critic_feedback: feedback,
      },
    });
    const fresh = plan.shots.filter(s => sceneIds.has(s.scene_id)).map(s => ({ ...s, elements: s.elements.filter(e => COMPONENT_NAMES.includes(e.type)) }));
    const covered = new Set(fresh.map(s => s.scene_id));
    const order = new Map(scenes.map((s, i) => [s.id, i]));
    return [...all.filter(s => !covered.has(s.scene_id)), ...fresh].sort((a, b) => (order.get(a.scene_id)! - order.get(b.scene_id)!) || 0);
  } catch (e) {
    log.warn(`shot revision failed, keeping originals: ${(e as Error).message}`);
    return all;
  }
}

/** Safe default if the designer fails: brand mood, mascot + a relevant element. */
function fallbackShot(s: Scene): Shot {
  return {
    scene_id: s.id, cue: s.narration.split(" ").slice(0, 3).join(" "), mood: "brand", background: "bokeh", camera: "push-in", transition: "fade",
    elements: [
      { type: "cell", variant: "healthy", tone: "primary", x: 50, y: 48, size: 40, count: 1, spread: 0, motion: "breathe", enter: "pop", enter_at: 0, depth: "mid", label: "", flip: false },
      { type: "molecule", variant: "", tone: "accent", x: 50, y: 50, size: 10, count: 8, spread: 40, motion: "float", enter: "pop", enter_at: 0.2, depth: "bg", label: "", flip: false },
    ],
    title: { style: s.on_screen_text ? "headline" : "none", text: s.on_screen_text ?? "", sub: "", items: [] },
  };
}
