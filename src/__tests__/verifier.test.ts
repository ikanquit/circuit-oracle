import { describe, it, expect } from "vitest";
import { buildVerifierPrompt } from "@/lib/agents/prompts";
import { isAgentError } from "@/lib/agents/types";
import type { VerifierResult, AgentResult } from "@/lib/agents/types";

describe("buildVerifierPrompt", () => {
  it("includes synthesis text in the prompt", () => {
    const synthesisText = '{"operatingPrinciple":"inverting amplifier"}';
    const prompt = buildVerifierPrompt(synthesisText);
    expect(prompt).toContain(synthesisText);
    expect(prompt).toContain("Synthesis Analysis");
  });

  it("truncates synthesis text to 6000 characters", () => {
    const longText = "x".repeat(10000);
    const prompt = buildVerifierPrompt(longText);
    // prompt contains at most 6000 chars of the synthesis text
    const synthesisSection = prompt.split("## Synthesis Analysis")[1] ?? "";
    expect(synthesisSection.length).toBeLessThan(7000);
  });
});

describe("isAgentError (VerifierResult)", () => {
  it("returns false for a valid VerifierResult", () => {
    const result: AgentResult<VerifierResult> = {
      verdict: "confirmed",
      confidence: 92,
      matchedCircuit: "Non-inverting op-amp amplifier",
      notes: "Topology and gain calculation match the schematic.",
    };
    expect(isAgentError(result)).toBe(false);
  });

  it("returns true for an agent error response", () => {
    const result: AgentResult<VerifierResult> = {
      error: true,
      message: "Verifier agent failed.",
    };
    expect(isAgentError(result)).toBe(true);
  });
});
