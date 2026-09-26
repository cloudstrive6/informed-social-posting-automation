import { log } from "./log.js";

const UA = "InforMedLab-ContentBot/1.0 (+https://www.youtube.com/@InforMedLab)";

/** fetch with timeout + retries on 429/5xx/network errors. */
export async function http(url: string, init: RequestInit & { retries?: number; timeoutMs?: number } = {}): Promise<Response> {
  const { retries = 3, timeoutMs = 60_000, ...rest } = init;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...rest,
        headers: { "user-agent": UA, ...(rest.headers as Record<string, string> | undefined) },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        const wait = Number(res.headers.get("retry-after")) * 1000 || 2000 * 2 ** attempt;
        log.warn(`HTTP ${res.status} ${url.slice(0, 90)} — retrying in ${wait}ms`);
        await sleep(wait);
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await sleep(2000 * 2 ** attempt);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function httpJson<T = any>(url: string, init: Parameters<typeof http>[1] = {}): Promise<T> {
  const res = await http(url, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url.split("?")[0]}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : ({} as T);
}

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
