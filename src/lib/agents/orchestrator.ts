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
    const message = err instanceof Error ? err.message : "Unknown error in component agent";
    return { error: true, message };
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
    const message = err instanceof Error ? err.message : "Unknown error in topology agent";
    return { error: true, message };
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
    const message = err instanceof Error ? err.message : "Unknown error in domain agent";
    return { error: true, message };
  }
}

async function runSynthesisAgent(
  image: ImageInput,
  componentResult: AgentResult<ComponentAgentResult>,
  topologyResult: AgentResult<TopologyAgentResult>,
  domainResult: AgentResult<DomainAgentResult>,
  send: SSESender,
  question?: string
): Promise<AgentResult<SynthesisResult>> {
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
    return parsed;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error in synthesis agent";
    return { error: true, message };
  }
}

export async function orchestrate(
  image: ImageInput,
  send: SSESender,
  question?: string
): Promise<AnalysisResult> {
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
  const synthesisResult = await runSynthesisAgent(
    image,
    componentResult,
    topologyResult,
    domainResult,
    send,
    question
  );

  if (!("error" in synthesisResult && synthesisResult.error)) {
    send("agent_done", {
      agent: "synthesis" as AgentName,
      result: synthesisResult,
      durationMs: Date.now() - synthesisStart,
    });
  }

  // Suppress unused variable warning
  void agentNames;
  void startTimes;

  const analysis: AnalysisResult = {
    components: componentResult,
    topology: topologyResult,
    domain: domainResult,
    synthesis: synthesisResult as SynthesisResult,
  };

  return analysis;
}
