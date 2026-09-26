import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname } from "node:path";

export function ensureDir(p: string) { mkdirSync(p, { recursive: true }); return p; }

export function readJson<T>(p: string, fallback?: T): T {
  if (!existsSync(p)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`File not found: ${p}`);
  }
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

export function writeJson(p: string, v: unknown) {
  ensureDir(dirname(p));
  writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
}

export function writeText(p: string, s: string) { ensureDir(dirname(p)); writeFileSync(p, s); }
export function readText(p: string, fallback = "") { return existsSync(p) ? readFileSync(p, "utf8") : fallback; }
export function listDirs(p: string) {
  return existsSync(p) ? readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name) : [];
}

export function slugify(s: string, max = 48) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, max).replace(/-$/, "");
}
