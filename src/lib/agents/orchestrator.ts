import { anthropic, MODEL } from "@/lib/anthropic";
import {
  ComponentAgentResult,
  TopologyAgentResult,
  DomainAgentResult,
  AgentResult,
  SynthesisResult,
  AnalysisResult,
  AgentName,
} from "./types";
import {
  COMPONENT_AGENT_SYSTEM,
  TOPOLOGY_AGENT_SYSTEM,
  DOMAIN_AGENT_SYSTEM,
  SYNTHESIS_AGENT_SYSTEM,
  buildComponentPrompt,
  buildTopologyPrompt,
  buildDomainPrompt,
  buildSynthesisPrompt,
} from "./prompts";
import type { SupportedImageMediaType } from "@/lib/validation";

type SSESender = (event: string, data: unknown) => void;

interface ImageInput {
  base64: string;
  mediaType: SupportedImageMediaType;
}

function parseJSONFromResponse(text: string): unknown {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim();
  return JSON.parse(cleaned);
}

/**
 * Build a user-safe agent error message. Avoids leaking raw SDK errors
 * (which can contain API keys, internal hostnames, model names, or stack
 * frames) into the SSE stream that reaches the browser.
 */
function safeAgentMessage(err: unknown, agentLabel: string): string {
  // Always log the full error server-side for debugging.
  console.error(`[CircuitOracle] ${agentLabel} agent error:`, err);

  const raw = err instanceof Error ? err.message : String(err ?? "");
  const lower = raw.toLowerCase();

  if (lower.includes("rate") && lower.includes("limit")) {
    return "Upstream rate limit reached.";
  }
  if (lower.includes("timeout") || lower.includes("etimedout")) {
    return "Agent timed out.";
  }
  if (lower.includes("overloaded") || lower.includes("503")) {
    return "AI service overloaded.";
  }
  if (lower.includes("invalid_api_key") || lower.includes("authentication")) {
    return "Server misconfiguration.";
  }
  if (
    err instanceof SyntaxError ||
    lower.includes("json") ||
    lower.includes("unexpected token")
  ) {
    return "Agent returned malformed output.";
  }
  return `${agentLabel} agent failed.`;
}

async function runComponentAgent(
  image: ImageInput,
  question?: string
): Promise<AgentResult<ComponentAgentResult>> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: COMPONENT_AGENT_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType,
                data: image.base64,
              },
            },
            { type: "text", text: buildComponentPrompt(question) },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = parseJSONFromResponse(text) as ComponentAgentResult;
    return parsed;
  } catch (err) {
    return { error: true, message: safeAgentMessage(err, "Component") };
  }
}

async function runTopologyAgent(
  image: ImageInput,
  question?: string
): Promise<AgentResult<TopologyAgentResult>> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: TOPOLOGY_AGENT_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType,
                data: image.base64,
              },
            },
            { type: "text", text: buildTopologyPrompt(question) },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = parseJSONFromResponse(text) as TopologyAgentResult;
    return parsed;
  } catch (err) {
    return { error: true, message: safeAgentMessage(err, "Topology") };
  }
}

async function runDomainAgent(
  image: ImageInput,
  question?: string
): Promise<AgentResult<DomainAgentResult>> {
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: DOMAIN_AGENT_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType,
                data: image.base64,
              },
            },
            { type: "text", text: buildDomainPrompt(question) },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = parseJSONFromResponse(text) as DomainAgentResult;
    return parsed;
  } catch (err) {
    return { error: true, message: safeAgentMessage(err, "Domain") };
  }
}

interface SynthesisAgentOutput {
  result: AgentResult<SynthesisResult>;
  synthesisText: string;
  synthesisComplete: boolean;
}

async function runSynthesisAgent(
  image: ImageInput,
  componentResult: AgentResult<ComponentAgentResult>,
  topologyResult: AgentResult<TopologyAgentResult>,
  domainResult: AgentResult<DomainAgentResult>,
  send: SSESender,
  question?: string
): Promise<SynthesisAgentOutput> {
  try {
    const prompt = buildSynthesisPrompt(componentResult, topologyResult, domainResult, question);

    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      system: SYNTHESIS_AGENT_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: image.mediaType,
                data: image.base64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    let fullText = "";

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        const text = chunk.delta.text;
        fullText += text;
        send("synthesis_chunk", { text });
      }
    }

    const parsed = parseJSONFromResponse(fullText) as SynthesisResult;
    return { result: parsed, synthesisText: fullText, synthesisComplete: true };
  } catch (err) {
    return {
      result: { error: true, message: safeAgentMessage(err, "Synthesis") },
      synthesisText: "",
      synthesisComplete: false,
    };
  }
}

export interface OrchestrateResult {
  analysis: AnalysisResult;
  synthesisText: string;
}

export async function orchestrate(
  image: ImageInput,
  send: SSESender,
  question?: string
): Promise<OrchestrateResult> {
  // Phase 1: parallel agents
  send("stage", {
    stage: "parallel",
    agents: ["component", "topology", "domain"] as AgentName[],
  });

  const agentNames: AgentName[] = ["component", "topology", "domain"];
  const startTimes: Record<AgentName, number> = {
    component: Date.now(),
    topology: Date.now(),
    domain: Date.now(),
    synthesis: 0,
  };

  const [componentSettled, topologySettled, domainSettled] = await Promise.allSettled([
    (async () => {
      const t = Date.now();
      const result = await runComponentAgent(image, question);
      send("agent_done", {
        agent: "component" as AgentName,
        result,
        durationMs: Date.now() - t,
      });
      return result;
    })(),
    (async () => {
      const t = Date.now();
      const result = await runTopologyAgent(image, question);
      send("agent_done", {
        agent: "topology" as AgentName,
        result,
        durationMs: Date.now() - t,
      });
      return result;
    })(),
    (async () => {
      const t = Date.now();
      const result = await runDomainAgent(image, question);
      send("agent_done", {
        agent: "domain" as AgentName,
        result,
        durationMs: Date.now() - t,
      });
      return result;
    })(),
  ]);

  // Extract results, handling failures
  const componentResult: AgentResult<ComponentAgentResult> =
    componentSettled.status === "fulfilled"
      ? componentSettled.value
      : { error: true, message: String(componentSettled.reason) };

  const topologyResult: AgentResult<TopologyAgentResult> =
    topologySettled.status === "fulfilled"
      ? topologySettled.value
      : { error: true, message: String(topologySettled.reason) };

  const domainResult: AgentResult<DomainAgentResult> =
    domainSettled.status === "fulfilled"
      ? domainSettled.value
      : { error: true, message: String(domainSettled.reason) };

  // Phase 2: synthesis
  send("stage", { stage: "synthesis" });

  const synthesisStart = Date.now();
  const { result: synthesisResult, synthesisText } = await runSynthesisAgent(
    image,
    componentResult,
    topologyResult,
    domainResult,
    send,
    question
  );

  // Always emit agent_done for synthesis so the UI can reflect both
  // success and error states. The page reads `result.error === true` to
  // distinguish, matching the other 3 agents.
  send("agent_done", {
    agent: "synthesis" as AgentName,
    result: synthesisResult,
    durationMs: Date.now() - synthesisStart,
  });

  // Suppress unused variable warning
  void agentNames;
  void startTimes;

  const analysis: AnalysisResult = {
    components: componentResult,
    topology: topologyResult,
    domain: domainResult,
    synthesis: synthesisResult as SynthesisResult,
  };

  return { analysis, synthesisText };
}
