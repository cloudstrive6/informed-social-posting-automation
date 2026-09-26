const t = () => new Date().toISOString().slice(11, 19);
export const log = {
  info: (...a: unknown[]) => console.log(`[${t()}]`, ...a),
  warn: (...a: unknown[]) => console.warn(`[${t()}] WARN`, ...a),
  error: (...a: unknown[]) => console.error(`[${t()}] ERROR`, ...a),
  step: (s: string) => console.log(`\n[${t()}] === ${s} ===`),
};
