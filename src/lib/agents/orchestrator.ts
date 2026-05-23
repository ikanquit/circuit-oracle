import { getGemini, MODEL } from "@/lib/gemini";
import {
  ComponentAgentResult,
  TopologyAgentResult,
  DomainAgentResult,
  AgentResult,
  SynthesisResult,
  VerifierResult,
  AnalysisResult,
  AgentName,
} from "./types";
import {
  COMPONENT_AGENT_SYSTEM,
  TOPOLOGY_AGENT_SYSTEM,
  DOMAIN_AGENT_SYSTEM,
  SYNTHESIS_AGENT_SYSTEM,
  VERIFIER_AGENT_SYSTEM,
  buildComponentPrompt,
  buildTopologyPrompt,
  buildDomainPrompt,
  buildSynthesisPrompt,
  buildVerifierPrompt,
} from "./prompts";
import type { SupportedImageMediaType } from "@/lib/validation";

type SSESender = (event: string, data: unknown) => void;

interface ImageInput {
  base64: string;
  mediaType: SupportedImageMediaType;
}

function parseJSONFromResponse(text: string): unknown {
  // Gemini with responseMimeType=application/json usually returns clean JSON,
  // but be defensive: strip markdown fences if a model decides to add them.
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
  if (
    lower.includes("gemini_api_key") ||
    lower.includes("google_api_key") ||
    lower.includes("api key not valid") ||
    lower.includes("invalid_api_key") ||
    lower.includes("permission_denied") ||
    lower.includes("authentication")
  ) {
    return "Server misconfiguration — Gemini API key missing or invalid.";
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

interface JsonAgentParams {
  systemPrompt: string;
  prompt: string;
  image: ImageInput;
  maxOutputTokens: number;
}

async function callJsonAgent<T>(params: JsonAgentParams): Promise<T> {
  const response = await getGemini().models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: params.image.mediaType, data: params.image.base64 } },
          { text: params.prompt },
        ],
      },
    ],
    config: {
      systemInstruction: params.systemPrompt,
      responseMimeType: "application/json",
      maxOutputTokens: params.maxOutputTokens,
    },
  });
  const text = response.text ?? "";
  return parseJSONFromResponse(text) as T;
}

async function runComponentAgent(
  image: ImageInput,
  question?: string
): Promise<AgentResult<ComponentAgentResult>> {
  try {
    return await callJsonAgent<ComponentAgentResult>({
      systemPrompt: COMPONENT_AGENT_SYSTEM,
      prompt: buildComponentPrompt(question),
      image,
      maxOutputTokens: 2048,
    });
  } catch (err) {
    return { error: true, message: safeAgentMessage(err, "Component") };
  }
}

async function runTopologyAgent(
  image: ImageInput,
  question?: string
): Promise<AgentResult<TopologyAgentResult>> {
  try {
    return await callJsonAgent<TopologyAgentResult>({
      systemPrompt: TOPOLOGY_AGENT_SYSTEM,
      prompt: buildTopologyPrompt(question),
      image,
      maxOutputTokens: 2048,
    });
  } catch (err) {
    return { error: true, message: safeAgentMessage(err, "Topology") };
  }
}

async function runDomainAgent(
  image: ImageInput,
  question?: string
): Promise<AgentResult<DomainAgentResult>> {
  try {
    return await callJsonAgent<DomainAgentResult>({
      systemPrompt: DOMAIN_AGENT_SYSTEM,
      prompt: buildDomainPrompt(question),
      image,
      maxOutputTokens: 1024,
    });
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

    const stream = await getGemini().models.generateContentStream({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: image.mediaType, data: image.base64 } },
            { text: prompt },
          ],
        },
      ],
      config: {
        systemInstruction: SYNTHESIS_AGENT_SYSTEM,
        responseMimeType: "application/json",
        // 8192 — Gemini 2.5 Flash is more verbose than the SDK we swapped
        // from, and synthesis with prose-heavy "operatingPrinciple" sections
        // was truncating around 4k. Headroom matters here because a cut-off
        // JSON string blows up parsing for the whole response.
        maxOutputTokens: 8192,
      },
    });

    let fullText = "";

    for await (const chunk of stream) {
      const text = chunk.text ?? "";
      if (text) {
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

async function runVerifierAgent(
  image: ImageInput,
  synthesisText: string
): Promise<AgentResult<VerifierResult>> {
  try {
    return await callJsonAgent<VerifierResult>({
      systemPrompt: VERIFIER_AGENT_SYSTEM,
      prompt: buildVerifierPrompt(synthesisText),
      image,
      maxOutputTokens: 512,
    });
  } catch (err) {
    return { error: true, message: safeAgentMessage(err, "Verifier") };
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
    verifier: 0,
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

  // Phase 3: verification (runs only when synthesis produced text to verify)
  if (synthesisText) {
    send("stage", { stage: "verification" });

    const verifierStart = Date.now();
    const verifierResult = await runVerifierAgent(image, synthesisText);

    send("agent_done", {
      agent: "verifier" as AgentName,
      result: verifierResult,
      durationMs: Date.now() - verifierStart,
    });
  }

  return { analysis, synthesisText };
}
