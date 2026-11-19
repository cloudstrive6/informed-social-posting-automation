/**
 * Medical safety for every picture the pipeline draws (videos, Shorts, thumbnails, carousels) and every bespoke sound.
 * Owner rule: nothing that suggests how to dose or inject a medicine. Added 2026-11-18, after the first fast-style long
 * video drew syringes with faces, a "Yours / Hers" syringe pair and an "injection pen being readied" sound.
 *
 * - Injection devices (syringe, needle, vial, injection pen, vaccine, IV drip) are never drawn: they become a closed
 *   medicine box with no speech bubble. A plain writing pen is fine.
 * - No speech bubble or label talks about a dose or an injection, or shows a dose amount ("2.5 mg").
 * - Pill characters stay (the Pill vs Patch Shorts star one); the rule above keeps them off their dose.
 */
import type { ShotElement } from "./shots.js";

const BRANDS = "ozempic|wegovy|mounjaro|zepbound|saxenda|victoza|trulicity|glp-?1|semaglutide|tirzepatide|liraglutide";
/** Injection devices asked for by name. */
export const DEVICE = new RegExp(
  String.raw`syring|needle|inject|vials?\b|amp(o|ou|u)les?\b|vaccin|\bjabs?\b|\b(flu|vaccine|booster|insulin) shots?\b|lancet|cannula|kwik ?pen|auto-?inject|` +
  String.raw`\binsulin (pens?|syringes?|vials?|shots?)\b|\b(dose|dosing|drug|medicine|medication|weight[- ]loss|diabetes|epi|single-dose|multi-dose|prefilled|pre-filled|${BRANDS}) ?pens?\b|` +
  String.raw`\biv\b|intravenous|\b(iv|saline) drips?\b|blood[- ]bag`, "i");
/** Illustrations that are never drawn, whatever a request resolved to. */
export const BLOCKED_ICON = /syringe|injection|intravenous|blood-bag|sewing-needle/;
/** Words a bubble or label must not say: dosing, injecting, dose amounts, titration. */
export const DOSE_TALK = /\bdos(e|es|ed|ing|age)\b|inject|needle|\bjabs?\b|\d+(\.\d+)? ?(mg|mcg|µg|ug|ml|iu)\b|\b(take|took|taking) (one|two|three|four|\d+) (pills?|tablets?|capsules?|doses?|shots?)\b|titrat/i;
/** The neutral stand-in for a device. */
export const DEVICE_STANDIN = "package";

/** The element as it may be drawn (idempotent; returns the same object when nothing changes). */
export function safeMedicalArt(e: ShotElement): ShotElement {
  const label = e.label && DOSE_TALK.test(e.label) ? "" : e.label;
  if (e.type === "syringe" || (e.type === "icon" && DEVICE.test(e.variant)))
    return { ...e, type: "icon", variant: DEVICE_STANDIN, says: "", label };
  const says = e.says && DOSE_TALK.test(e.says) ? "" : e.says;
  return says !== e.says || label !== e.label ? { ...e, says, label } : e;
}

/** A free-text art request (thumbnails, carousels): a device becomes the stand-in. */
export const safeArtQuery = (q: string) => (/^syringe\b/i.test(q) || DEVICE.test(q) ? DEVICE_STANDIN : q);

/** Bespoke sound prompts that imitate injecting or taking a medicine (a ballpoint pen or a frying pan is fine). */
export const MEDICAL_SFX = new RegExp(
  String.raw`inject|needle|syring|plunger|lancet|\bjabs?\b|\b(flu|vaccine|booster|insulin) shots?\b|auto-?inject|vials?\b|amp(o|ou|u)le|insulin|kwik ?pen|` +
  String.raw`\b(dose|dosing|medicine|medication|injection|epi|${BRANDS}) ?pens?\b|\bpills?\b|(pill|prescription|medicine) bottle|blister|` +
  String.raw`swallow(ing|s)? (a |an |the |two |some )?(pill|tablet|capsule|medicine)|\b(tablet|capsule)s? (rattl|clink|drop|pour)|` +
  String.raw`\bpen (cap|being|readied|primed|priming|dial)|\bprim(e|ed|ing) the pen|dial(s|ing)? (to|up) the|\bcap (pulled|removed|comes|snaps)`, "i");
