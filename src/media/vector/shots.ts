import { COMPONENT_NAMES } from "./components.js";
import { MOODS } from "./palettes.js";

export const MOTIONS = ["float", "breathe", "spin", "drift-left", "drift-right", "wobble", "orbit", "swim", "pulse", "bob", "none"] as const;
export const ENTERS = ["pop", "fade", "slide-left", "slide-right", "rise", "grow", "none"] as const;
export const BACKGROUNDS = ["gradient", "cells", "bokeh", "stars", "clinic", "bloodstream", "tissue", "room", "kitchen", "outdoors", "body"] as const;
/** Expressions for personified elements (MapWarden-style characters with faces). */
export const FACES = ["none", "happy", "worried", "shocked", "sad", "angry", "sick", "proud", "sleepy"] as const;
/** `dive`: in the shot's last ~0.7 s the camera zooms hard into the main character, so the cut reads as diving into it. */
export const CAMERAS = ["push-in", "pull-out", "pan-left", "pan-right", "drift", "static", "dive"] as const;
/**
 * Shot transitions (all 0.6 s or under). `lens`: a circle opening from the incoming hero's position; `wave`: a soft
 * wavy edge sweeping across; `corner`: a wipe from a corner; `flash`: a white flash cut (never on a sombre beat:
 * the engine swaps it for `fade` there).
 */
export const TRANSITIONS = ["cut", "iris", "zoom", "whip", "fade", "slide-up", "lens", "wave", "corner", "flash"] as const;
/** `typed`: a headline typed out character by character with a caret (a section opener). `stat` numbers count up. */
export const TITLE_STYLES = ["none", "label", "headline", "chips", "stat", "typed"] as const;

export interface ShotElement {
  type: string; variant: string; tone: "primary" | "secondary" | "accent";
  x: number; y: number; size: number; count: number; spread: number;
  motion: (typeof MOTIONS)[number]; enter: (typeof ENTERS)[number]; enter_at: number;
  depth: "bg" | "mid" | "fg"; label: string; flip: boolean;
  /** give the element a cartoon face with this expression */
  face: (typeof FACES)[number];
  /** short speech-bubble line the character says ("" for none) */
  says: string;
}
export interface Shot {
  scene_id: string; cue: string; mood: string;
  background: (typeof BACKGROUNDS)[number]; camera: (typeof CAMERAS)[number]; transition: (typeof TRANSITIONS)[number];
  elements: ShotElement[];
  title: { style: (typeof TITLE_STYLES)[number]; text: string; sub: string; items: string[] };
}
export interface ShotPlan { shots: Shot[] }

const str = { type: "string" } as const;
const num = (min: number, max: number) => ({ type: "number", minimum: min, maximum: max });
const en = (v: readonly string[]) => ({ enum: [...v] });

export const shotPlanSchema = {
  type: "object", additionalProperties: false, required: ["shots"],
  properties: {
    shots: {
      type: "array", minItems: 1,
      items: {
        type: "object", additionalProperties: false,
        required: ["scene_id", "cue", "mood", "background", "camera", "transition", "elements", "title"],
        properties: {
          scene_id: str, cue: str, mood: en(MOODS), background: en(BACKGROUNDS), camera: en(CAMERAS), transition: en(TRANSITIONS),
          elements: {
            type: "array", maxItems: 8,
            items: {
              type: "object", additionalProperties: false,
              required: ["type", "variant", "tone", "x", "y", "size", "count", "spread", "motion", "enter", "enter_at", "depth", "label", "flip", "face", "says"],
              properties: {
                type: en(COMPONENT_NAMES), variant: str, tone: en(["primary", "secondary", "accent"]),
                x: num(0, 100), y: num(0, 100), size: num(2, 90), count: num(1, 40), spread: num(0, 60),
                motion: en(MOTIONS), enter: en(ENTERS), enter_at: num(0, 0.9), depth: en(["bg", "mid", "fg"]), label: str, flip: { type: "boolean" },
                face: en(FACES), says: str,
              },
            },
          },
          title: {
            type: "object", additionalProperties: false, required: ["style", "text", "sub", "items"],
            properties: { style: en(TITLE_STYLES), text: str, sub: str, items: { type: "array", items: str, maxItems: 5 } },
          },
        },
      },
    },
  },
};
