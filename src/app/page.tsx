"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import AnalysisResult from "@/components/AnalysisResult";
import CircuitBackground from "@/components/v2/CircuitBackground";
import ScanlineOverlay from "@/components/v2/ScanlineOverlay";
import HeroCinematic from "@/components/v2/HeroCinematic";
import SchematicUpload from "@/components/v2/SchematicUpload";
import ICChipAgentCard, { ChipStatus } from "@/components/v2/ICChipAgentCard";
import OscilloscopeLoader from "@/components/v2/OscilloscopeLoader";
import BlueprintResults from "@/components/v2/BlueprintResults";
import StatusHUD from "@/components/v2/StatusHUD";
import TickerFooter from "@/components/v2/TickerFooter";
import SampleAnalysisStrip from "@/components/v2/SampleAnalysisStrip";
import {
  AnalysisResult as AnalysisResultType,
  AgentName,
  ComponentAgentResult,
  TopologyAgentResult,
  DomainAgentResult,
} from "@/lib/agents/types";

type PipelineStage = "idle" | "parallel" | "synthesis" | "done";

interface AgentRow {
  name: AgentName;
  label: string;
  partNumber: string;
  description: string;
  status: ChipStatus;
  durationMs?: number;
}

const INITIAL_AGENTS: AgentRow[] = [
  {
    name: "component",
    label: "COMPONENT",
    partNumber: "CO-7401N",
    description: "Counts every resistor, names every IC.",
    status: "pending",
  },
  {
    name: "topology",
    label: "TOPOLOGY",
    partNumber: "CO-7402T",
    description: "Follows every net from input to output.",
    status: "pending",
  },
  {
    name: "domain",
    label: "DOMAIN",
    partNumber: "CO-7403D",
    description: "Decides what this circuit is actually for.",
    status: "pending",
  },
  {
    name: "synthesis",
    label: "SYNTHESIS",
    partNumber: "CO-7499S",
    description: "Reads the other three, writes the verdict.",
    status: "pending",
  },
];

function generateJobId(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  return `JOB-${yyyy}-${mm}-${dd}-${hex}`;
}

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("idle");
  const [agents, setAgents] = useState<AgentRow[]>(INITIAL_AGENTS);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [synthStreaming, setSynthStreaming] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string>(() => generateJobId());

  const synthRef = useRef("");
  const partialResult = useRef<Partial<AnalysisResultType>>({});

  const updateAgentStatus = useCallback(
    (name: AgentName, status: ChipStatus, durationMs?: number) => {
      setAgents((prev) =>
        prev.map((a) =>
          a.name === name
            ? { ...a, status, durationMs: durationMs ?? a.durationMs }
            : a
        )
      );
    },
    []
  );

  const scrollToUpload = useCallback(() => {
    const el = document.getElementById("upload-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setPipelineStage("idle");
    setAgents(INITIAL_AGENTS);
    setResult(null);
    setSynthStreaming("");
    setErrorMessage(null);
    setJobId(generateJobId());
    synthRef.current = "";
    partialResult.current = {};

    const formData = new FormData();
    formData.append("image", selectedFile);
    if (question.trim()) {
      formData.append("question", question.trim());
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Request failed" }));
        const retryAfter = response.headers.get("Retry-After");
        if (response.status === 429) {
          setErrorMessage(
            `Rate limit reached. Wait ${retryAfter ?? 60}s before retrying.`
          );
        } else {
          setErrorMessage(errorData.error ?? "Analysis failed.");
        }
        setIsAnalyzing(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setErrorMessage("Streaming not supported in this browser.");
        setIsAnalyzing(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";

      const handleSSEEvent = (
        event: string,
        data: Record<string, unknown>
      ) => {
        if (event === "stage") {
          const stage = data.stage as string;
          if (stage === "parallel") {
            setPipelineStage("parallel");
            setAgents((prev) =>
              prev.map((a) =>
                ["component", "topology", "domain"].includes(a.name)
                  ? { ...a, status: "running" }
                  : a
              )
            );
          } else if (stage === "synthesis") {
            setPipelineStage("synthesis");
            updateAgentStatus("synthesis", "running");
          }
        } else if (event === "agent_done") {
          const agent = data.agent as AgentName;
          const agentResult = data.result;
          const duration = data.durationMs as number;

          const hasError =
            agentResult &&
            typeof agentResult === "object" &&
            (agentResult as Record<string, unknown>).error === true;

          updateAgentStatus(agent, hasError ? "error" : "done", duration);

          if (agent === "component") {
            partialResult.current.components =
              agentResult as ComponentAgentResult;
          } else if (agent === "topology") {
            partialResult.current.topology =
              agentResult as TopologyAgentResult;
          } else if (agent === "domain") {
            partialResult.current.domain = agentResult as DomainAgentResult;
          } else if (agent === "synthesis") {
            updateAgentStatus("synthesis", "done", duration);
          }

          if (
            partialResult.current.components ||
            partialResult.current.topology ||
            partialResult.current.domain
          ) {
            setResult(
              (prev) =>
                ({
                  ...(prev ?? {
                    components: { error: true, message: "pending" },
                    topology: { error: true, message: "pending" },
                    domain: { error: true, message: "pending" },
                    synthesis: {
                      error: true,
                      message: "pending",
                    } as unknown as AnalysisResultType["synthesis"],
                  }),
                  ...partialResult.current,
                }) as AnalysisResultType
            );
          }
        } else if (event === "synthesis_chunk") {
          const text = data.text as string;
          synthRef.current += text;
          setSynthStreaming(synthRef.current);
        } else if (event === "done") {
          const full = data.full as AnalysisResultType;
          setResult(full);
          setSynthStreaming("");
          setPipelineStage("done");
          setIsAnalyzing(false);
        } else if (event === "error") {
          setErrorMessage((data.error as string) ?? "Analysis failed.");
          setIsAnalyzing(false);
        }
      };

      const processSSEChunk = (chunk: string) => {
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              handleSSEEvent(currentEvent, data);
            } catch {
              /* ignore */
            }
            currentEvent = "";
          }
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        processSSEChunk(chunk);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setErrorMessage(msg);
      setIsAnalyzing(false);
    }
  }, [selectedFile, question, updateAgentStatus]);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setSynthStreaming("");
    setErrorMessage(null);
    setPipelineStage("idle");
    setAgents(INITIAL_AGENTS);
    synthRef.current = "";
    partialResult.current = {};
  }, []);

  const showAnalysisShell = useMemo(
    () => pipelineStage !== "idle" || result !== null || synthStreaming !== "",
    [pipelineStage, result, synthStreaming]
  );

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />
      <ScanlineOverlay intensity="subtle" />

      <main className="relative z-10">
        <HeroCinematic onCtaClick={scrollToUpload} />

        <div id="sample-archive">
          <SampleAnalysisStrip />
        </div>

        <section
          id="upload-section"
          className="px-4 sm:px-8 lg:px-12 py-16 max-w-[1400px] mx-auto w-full"
        >
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: showAnalysisShell
                ? "minmax(0, 440px) 1fr"
                : "minmax(0, 540px)",
              justifyContent: showAnalysisShell ? undefined : "center",
            }}
          >
            {/* Left column — upload + pipeline */}
            <div className="flex flex-col gap-6 min-w-0">
              <SchematicUpload
                onFile={setSelectedFile}
                onQuestion={setQuestion}
                onSubmit={handleSubmit}
                onClear={handleClear}
                isAnalyzing={isAnalyzing}
                question={question}
                selectedFile={selectedFile}
              />

              {pipelineStage !== "idle" && (
                <div>
                  <div
                    className="co-label mb-3"
                    style={{ color: "var(--co-muted)" }}
                  >
                    [ AGENT PIPELINE · 04 ]
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {agents.map((a) => (
                      <ICChipAgentCard
                        key={a.name}
                        label={a.label}
                        partNumber={a.partNumber}
                        status={a.status}
                        description={a.description}
                        durationMs={a.durationMs}
                      />
                    ))}
                  </div>
                </div>
              )}

              {errorMessage && (
                <div
                  className="border px-4 py-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--co-danger) 8%, var(--co-surface))",
                    borderColor:
                      "color-mix(in srgb, var(--co-danger) 35%, transparent)",
                    color: "var(--co-danger)",
                    fontFamily: "var(--co-font-mono)",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest font-semibold mb-1"
                    style={{ color: "var(--co-danger)" }}
                  >
                    ▲ FAULT DETECTED
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--co-text-dim)" }}
                  >
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Right column — analysis output */}
            {showAnalysisShell && (
              <BlueprintResults
                title="ANALYSIS OUTPUT"
                jobId={jobId}
                stage={pipelineStage}
              >
                {pipelineStage === "parallel" && !result ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-6">
                    <OscilloscopeLoader
                      label="ACQUIRING SIGNAL · PARALLEL × 3"
                      waveform="sine"
                    />
                    <p
                      className="co-mono text-xs"
                      style={{ color: "var(--co-text-dim)" }}
                    >
                      Running component / topology / domain agents
                    </p>
                  </div>
                ) : (
                  <AnalysisResult
                    result={result}
                    synthStreaming={synthStreaming}
                    isStreaming={
                      isAnalyzing && pipelineStage === "synthesis"
                    }
                  />
                )}
              </BlueprintResults>
            )}
          </div>
        </section>

        <TickerFooter />
      </main>

      <StatusHUD pipelineStage={pipelineStage} />
    </div>
  );
}
