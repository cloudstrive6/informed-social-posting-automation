/**
 * Same-day replacement for a held or dropped Short (pure decision logic, no I/O; used by the ops watchdog and by
 * planReplacementShort so both pick the same slot). Tested in scripts/watchdog-selftest.ts.
 */
export const MAX_SHORT_REPLACEMENTS_PER_DAY = 2;
export const SHORT_REPLACEMENT_MIN_LEAD_MS = 2 * 3600_000;

export interface ShortLike {
  /** ISO time of the Short's slot (first post target), if known */
  slot?: string;
  /** held, failed or otherwise not going to post */
  dropped: boolean;
}

/**
 * Which Short slot (index into config.schedule.short) a replacement should fill, or undefined for none.
 * Needs: at least one dropped Short, fewer live Shorts than slots, fewer than the daily maximum of replacements
 * so far, and a target slot still at least minLeadMs away. Prefers the earliest dropped Short's own slot that is
 * not already covered by a live Short; then any other uncovered slot; otherwise the day's last slot if no live Short already sits there.
 */
export function pickShortReplacementSlot(opts: {
  shorts: ShortLike[]; slotTimes: string[]; now: number; tries: number;
  maxPerDay?: number; minLeadMs?: number;
}): number | undefined {
  const { shorts, slotTimes, now, tries } = opts;
  const max = opts.maxPerDay ?? MAX_SHORT_REPLACEMENTS_PER_DAY;
  const lead = opts.minLeadMs ?? SHORT_REPLACEMENT_MIN_LEAD_MS;
  if (!slotTimes.length || tries >= max) return undefined;
  const live = shorts.filter(s => !s.dropped);
  if (!shorts.some(s => s.dropped) || live.length >= slotTimes.length) return undefined;
  const ms = slotTimes.map(t => Date.parse(t));
  const eligible = (i: number) => ms[i] - now >= lead;
  const covered = (i: number) => live.some(s => s.slot && Date.parse(s.slot) === ms[i]);
  const droppedOwn = [...new Set(shorts.filter(s => s.dropped && s.slot).map(s => ms.indexOf(Date.parse(s.slot!))))]
    .filter(i => i >= 0 && eligible(i) && !covered(i)).sort((a, b) => ms[a] - ms[b]);
  if (droppedOwn.length) return droppedOwn[0];
  const free = ms.map((_, i) => i).filter(i => eligible(i) && !covered(i)).sort((a, b) => ms[a] - ms[b]);
  if (free.length) return free[0];
  const last = ms.indexOf(Math.max(...ms));
  return eligible(last) && !covered(last) ? last : undefined;
}
