"use client";

import { useState, useRef, useCallback } from "react";
import Header from "@/components/Header";
import CircuitUploader from "@/components/CircuitUploader";
import AgentPipeline, { AgentState, AgentStatus } from "@/components/AgentPipeline";
import AnalysisResult from "@/components/AnalysisResult";
import {
  AnalysisResult as AnalysisResultType,
  AgentName,
  ComponentAgentResult,
  TopologyAgentResult,
  DomainAgentResult,
} from "@/lib/agents/types";

type PipelineStage = "idle" | "parallel" | "synthesis" | "done";

const INITIAL_AGENTS: AgentState[] = [
  { name: "component", status: "pending" },
  { name: "topology", status: "pending" },
  { name: "domain", status: "pending" },
  { name: "synthesis", status: "pending" },
];

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("idle");
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [synthStreaming, setSynthStreaming] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const synthRef = useRef("");
  // Partial agent results as they come in (for rendering while synthesis is running)
  const partialResult = useRef<Partial<AnalysisResultType>>({});

  const updateAgentStatus = useCallback(
    (name: AgentName, status: AgentStatus, durationMs?: number) => {
      setAgents((prev) =>
        prev.map((a) =>
          a.name === name ? { ...a, status, durationMs: durationMs ?? a.durationMs } : a
        )
      );
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;

    // Reset state
    setIsAnalyzing(true);
    setPipelineStage("idle");
    setAgents(INITIAL_AGENTS);
    setResult(null);
    setSynthStreaming("");
    setErrorMessage(null);
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
        const errorData = await response.json().catch(() => ({ error: "Request failed" }));
        const retryAfter = response.headers.get("Retry-After");
        if (response.status === 429) {
          setErrorMessage(
            `Rate limit reached. Please wait ${retryAfter ?? 60} seconds before trying again.`
          );
        } else {
          setErrorMessage(errorData.error ?? "Analysis failed. Please try again.");
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

      const processLine = (line: string) => {
        if (!line.trim()) return;

        if (line.startsWith("event: ")) {
          // handled with next data line
          return;
        }

        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);

            // We need event type — get it from the last buffered event line
            // Actually we process event+data together below
            void parsed;
          } catch {
            // not JSON
          }
        }
      };

      void processLine; // used below via buffer parsing

      // Parse SSE properly: collect event + data pairs
      let currentEvent = "";

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
              // ignore parse errors
            }
            currentEvent = "";
          }
        }
      };

      const handleSSEEvent = (event: string, data: Record<string, unknown>) => {
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
            partialResult.current.components = agentResult as ComponentAgentResult;
          } else if (agent === "topology") {
            partialResult.current.topology = agentResult as TopologyAgentResult;
          } else if (agent === "domain") {
            partialResult.current.domain = agentResult as DomainAgentResult;
          } else if (agent === "synthesis") {
            updateAgentStatus("synthesis", "done", duration);
          }

          // Show partial results immediately as agents complete
          if (
            partialResult.current.components ||
            partialResult.current.topology ||
            partialResult.current.domain
          ) {
            setResult((prev) => ({
              ...(prev ?? {
                components: { error: true, message: "pending" },
                topology: { error: true, message: "pending" },
                domain: { error: true, message: "pending" },
                synthesis: { error: true, message: "pending" } as unknown as AnalysisResultType["synthesis"],
              }),
              ...partialResult.current,
            }) as AnalysisResultType);
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

      // Read the stream
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

  const showRightPanel =
    pipelineStage !== "idle" || result !== null || synthStreaming !== "";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Hero text — only shown before analysis */}
        {pipelineStage === "idle" && !result && (
          <div className="mb-8 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              style={{ color: "var(--text)" }}
            >
              Understand any circuit, instantly
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
              Upload a schematic image and three specialized AI agents analyze it in
              parallel — components, topology, and domain — then a synthesis agent
              produces an engineering-depth explanation.
            </p>
          </div>
        )}

        <div
          className={`grid gap-6 ${
            showRightPanel ? "lg:grid-cols-[420px_1fr]" : "max-w-md mx-auto"
          }`}
        >
          {/* Left panel */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--text)" }}
              >
                Upload Schematic
              </h3>
              <CircuitUploader
                onFile={setSelectedFile}
                onQuestion={setQuestion}
                onSubmit={handleSubmit}
                isAnalyzing={isAnalyzing}
                question={question}
                selectedFile={selectedFile}
                onClear={handleClear}
              />
            </div>

            {/* Agent pipeline */}
            {pipelineStage !== "idle" && (
              <AgentPipeline agents={agents} stage={pipelineStage} />
            )}

            {/* Error message */}
            {errorMessage && (
              <div
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--error) 8%, var(--surface))",
                  borderColor: "color-mix(in srgb, var(--error) 30%, transparent)",
                  color: "var(--error)",
                }}
              >
                <p className="font-semibold mb-0.5">Analysis Failed</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Right panel */}
          {showRightPanel && (
            <div
              className="rounded-xl border p-5 overflow-y-auto"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                maxHeight: "calc(100vh - 180px)",
              }}
            >
              <AnalysisResult
                result={result}
                synthStreaming={synthStreaming}
                isStreaming={isAnalyzing && pipelineStage === "synthesis"}
              />

              {/* Placeholder while parallel phase is running */}
              {pipelineStage === "parallel" && !result && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: "var(--border)",
                      borderTopColor: "var(--accent)",
                    }}
                  />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Running parallel analysis agents…
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer
        className="border-t py-4 px-4 sm:px-6 text-center"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          CircuitOracle — Multi-agent AI schematic analysis
        </p>
      </footer>
    </div>
  );
}
