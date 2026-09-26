import { query } from "@anthropic-ai/claude-agent-sdk";
import { join } from "node:path";
import { config, DATA, ROOT } from "./config.js";
import { readText } from "./fsx.js";
import { log } from "./log.js";

export type AgentName =
  | "trend-scout" | "content-strategist" | "fact-checker" | "scriptwriter-long" | "scriptwriter-short"
  | "narration-director" | "title-writer" | "thumbnail-designer" | "seo-writer"
  | "carousel-designer" | "social-copywriter" | "performance-analyst" | "motion-designer" | "visual-critic" | "sound-designer";

export interface AgentRun<T> {
  agent: AgentName;
  /** The task for this run. Objects are serialized as JSON. */
  input: string | object;
  /** JSON Schema (draft-07) the agent's final answer must satisfy. */
  schema: object;
  /** Built-in tools the agent may use. Research agents get WebSearch/WebFetch; others get none. */
  web?: boolean;
  /** Extra built-in tools (e.g. ["Read"] so a critic can look at frame images). */
  tools?: string[];
  cwd?: string;
  model?: string;
  maxTurns?: number;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
}

/** Shared context every agent sees: brand, audience, safety rules and the latest performance learnings. */
function sharedContext(): string {
  const b = config.brand;
  return [
    readText(join(ROOT, "agents", "_shared.md")),
    `\n## Live brand config\n- Brand: ${b.name} (${b.handle}) — ${b.tagline}\n- Mission: ${b.mission}`,
    `- Audience: ${config.audience.description}`,
    `- Brand colors: blue ${b.colors.blue}, green ${b.colors.green}, dark ${b.colors.dark}, light ${b.colors.light}`,
    `- Never cover: ${config.safety.bannedTopics.join("; ")}`,
    `- Today's date: ${new Date().toISOString().slice(0, 10)}`,
    `\n## What we've learned from our own analytics (apply it)\n${readText(join(DATA, "learnings.md"), "_No learnings yet — first weeks of the channel._")}`,
  ].join("\n");
}

export async function runAgent<T>(run: AgentRun<T>): Promise<T> {
  const system = `${readText(join(ROOT, "agents", `${run.agent}.md`))}\n\n---\n${sharedContext()}`;
  const prompt = typeof run.input === "string" ? run.input : "Task input (JSON):\n```json\n" + JSON.stringify(run.input, null, 2) + "\n```";
  const tools = [...(run.web ? ["WebSearch", "WebFetch"] : []), ...(run.tools ?? [])];

  for (let attempt = 1; attempt <= 2; attempt++) {
    const started = Date.now();
    log.info(`agent:${run.agent} starting (attempt ${attempt}${run.web ? ", web" : ""})`);
    try {
      let out: T | undefined;
      let failure = "";
      for await (const msg of query({
        prompt,
        options: {
          systemPrompt: system,
          model: run.model ?? config.models.default,
          tools,
          allowedTools: tools,
          permissionMode: "dontAsk",
          settingSources: [],
          persistSession: false,
          ...(run.cwd ? { cwd: run.cwd } : {}),
          maxTurns: run.maxTurns ?? (run.web ? 40 : run.tools?.length ? 30 : 8),
          effort: run.effort,
          outputFormat: { type: "json_schema", schema: run.schema as any },
        },
      })) {
        if (msg.type === "result") {
          if (msg.subtype === "success" && msg.structured_output) out = msg.structured_output as T;
          else failure = `${msg.subtype}${"errors" in msg && msg.errors ? `: ${JSON.stringify(msg.errors).slice(0, 400)}` : ""}`;
        }
      }
      if (out) {
        log.info(`agent:${run.agent} done in ${Math.round((Date.now() - started) / 1000)}s`);
        return out;
      }
      throw new Error(`agent ${run.agent} produced no structured output (${failure || "unknown"})`);
    } catch (e) {
      log.warn(`agent:${run.agent} failed: ${(e as Error).message}`);
      if (attempt === 2) throw e;
    }
  }
  throw new Error("unreachable");
}
