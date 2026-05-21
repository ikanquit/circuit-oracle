export interface ComponentEntry {
  designator?: string;
  type: string;
  value?: string;
  partNumber?: string;
  functionalRole: string;
}

export interface ComponentAgentResult {
  components: ComponentEntry[];
  totalCount: number;
  summary: string;
}

export interface CircuitStage {
  name: string;
  description: string;
  components?: string[];
}

export interface FeedbackPath {
  type: "positive" | "negative" | "unknown";
  description: string;
}

export interface TopologyAgentResult {
  topologyName: string;
  stages: CircuitStage[];
  feedbackPaths: FeedbackPath[];
  keyNodes: string[];
  powerSupplyTopology?: string;
}

export interface DomainAgentResult {
  primaryDomain:
    | "audio"
    | "RF/communications"
    | "power electronics"
    | "signal processing"
    | "digital logic"
    | "sensors/instrumentation"
    | "motor control"
    | "mixed-signal"
    | "unknown";
  specificApplication: string;
  frequencyRange?: string;
  impedance?: string;
  industryContext: string;
}

export interface AgentError {
  error: true;
  message: string;
}

export type AgentResult<T> = T | AgentError;

export function isAgentError<T>(result: AgentResult<T>): result is AgentError {
  return (result as AgentError).error === true;
}

export interface KeyParameter {
  name: string;
  value: string;
  unit?: string;
  notes?: string;
}

export interface FailureMode {
  scenario: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface Improvement {
  area: string;
  suggestion: string;
  rationale: string;
}

export interface SynthesisResult {
  operatingPrinciple: string;
  keyParameters: KeyParameter[];
  designDecisions: string;
  failureModes: FailureMode[];
  improvements: Improvement[];
}

export interface AnalysisResult {
  components: AgentResult<ComponentAgentResult>;
  topology: AgentResult<TopologyAgentResult>;
  domain: AgentResult<DomainAgentResult>;
  synthesis: SynthesisResult;
}

export type AgentName = "component" | "topology" | "domain" | "synthesis" | "verifier";

export interface VerifierResult {
  verdict: "confirmed" | "likely" | "uncertain" | "mismatch";
  confidence: number;
  matchedCircuit?: string;
  notes: string;
}

export interface AgentDoneEvent {
  agent: AgentName;
  result: AgentResult<ComponentAgentResult | TopologyAgentResult | DomainAgentResult>;
  durationMs: number;
}

export interface StageEvent {
  stage: "parallel" | "synthesis" | "verification";
  agents?: AgentName[];
}

export interface SynthesisChunkEvent {
  text: string;
}

export interface DoneEvent {
  full: AnalysisResult;
}

export interface ErrorEvent {
  error: string;
  code?: string;
}
