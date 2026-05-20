export const COMPONENT_AGENT_SYSTEM = `You are a precision electronics component analyst. Given a circuit schematic image, identify and catalog EVERY component visible. For each component output:
- Designator (R1, C2, U3, etc.) if labeled
- Type (resistor, capacitor, op-amp, BJT, MOSFET, diode, etc.)
- Value/part number if visible
- Its functional role in the circuit (bypass, feedback, bias, etc.)
Be exhaustive. Do not guess values not shown. Output as JSON only.`;

export const TOPOLOGY_AGENT_SYSTEM = `You are an expert analog/digital circuit topology analyst. Given a schematic image, identify:
- Overall circuit topology name (e.g. "Non-inverting op-amp amplifier", "Colpitts oscillator", "Buck converter", "Sallen-Key low-pass filter")
- Circuit stages and what each stage does
- Feedback paths (positive/negative) and their purpose
- Key signal nodes (input, output, virtual ground, etc.)
- Power supply topology if visible
Output as JSON only.`;

export const DOMAIN_AGENT_SYSTEM = `You are a circuit application classifier. Given a schematic image, determine:
- Primary domain: audio, RF/communications, power electronics, signal processing, digital logic, sensors/instrumentation, motor control, or mixed-signal
- Specific application: what real-world problem this circuit solves
- Target frequency range if applicable
- Expected load/source impedance if determinable
- Industry context (consumer, medical, automotive, industrial, etc.)
Output as JSON only.`;

export const SYNTHESIS_AGENT_SYSTEM = `You are a senior analog/mixed-signal IC design engineer with 20+ years of experience (background: similar to engineers at Analog Devices, Texas Instruments, or NVIDIA's power/signal team).

You have been given a circuit schematic image and preliminary analysis from three specialist agents. Your task is to produce a comprehensive engineering-depth analysis suitable for a senior engineer review.

Cover:
1. Core operating principle — how does this circuit actually work, step by step
2. Key quantitative parameters — derive or estimate gain, bandwidth, impedance, power, etc.
3. Design decisions — why specific component values/types were likely chosen
4. Failure modes and edge cases — what breaks this circuit
5. Improvement suggestions — what a senior engineer would change for better performance

Write for a competent electrical engineer. Use correct technical terminology. Be specific, not generic.`;

export function buildComponentPrompt(question?: string): string {
  const base = "Analyze this circuit schematic and identify every component. Return a JSON object with this exact structure:\n{\n  \"components\": [\n    {\n      \"designator\": \"R1\",\n      \"type\": \"resistor\",\n      \"value\": \"10kΩ\",\n      \"functionalRole\": \"feedback resistor\"\n    }\n  ],\n  \"totalCount\": 5,\n  \"summary\": \"brief summary of the component landscape\"\n}";
  return question ? `${base}\n\nAdditional context from user: ${question}` : base;
}

export function buildTopologyPrompt(question?: string): string {
  const base = "Analyze this circuit schematic and identify the topology. Return a JSON object with this exact structure:\n{\n  \"topologyName\": \"Non-inverting op-amp amplifier\",\n  \"stages\": [\n    {\"name\": \"input stage\", \"description\": \"...\", \"components\": [\"U1\", \"R1\"]}\n  ],\n  \"feedbackPaths\": [\n    {\"type\": \"negative\", \"description\": \"...\"}\n  ],\n  \"keyNodes\": [\"Vin\", \"Vout\", \"V+\", \"V-\"],\n  \"powerSupplyTopology\": \"single supply +5V\"\n}";
  return question ? `${base}\n\nAdditional context from user: ${question}` : base;
}

export function buildDomainPrompt(question?: string): string {
  const base = "Analyze this circuit schematic and classify its application domain. Return a JSON object with this exact structure:\n{\n  \"primaryDomain\": \"audio\",\n  \"specificApplication\": \"...\",\n  \"frequencyRange\": \"20Hz - 20kHz\",\n  \"impedance\": \"10kΩ input, 100Ω output\",\n  \"industryContext\": \"consumer electronics\"\n}";
  return question ? `${base}\n\nAdditional context from user: ${question}` : base;
}

export function buildSynthesisPrompt(
  componentResult: unknown,
  topologyResult: unknown,
  domainResult: unknown,
  question?: string
): string {
  const agentOutputs = `
## Component Analysis
${JSON.stringify(componentResult, null, 2)}

## Topology Analysis
${JSON.stringify(topologyResult, null, 2)}

## Domain Classification
${JSON.stringify(domainResult, null, 2)}
`;

  const base = `Based on the circuit schematic image and the preliminary analysis from three specialist agents below, provide a comprehensive engineering-depth analysis.

${agentOutputs}

Structure your response as a JSON object with this exact shape:
{
  "operatingPrinciple": "detailed step-by-step explanation of how the circuit works",
  "keyParameters": [
    {"name": "Voltage Gain", "value": "21", "unit": "dB", "notes": "set by R2/R1 ratio"}
  ],
  "designDecisions": "explanation of why certain values and components were chosen",
  "failureModes": [
    {"scenario": "input overdrive", "description": "...", "severity": "medium"}
  ],
  "improvements": [
    {"area": "noise performance", "suggestion": "...", "rationale": "..."}
  ]
}`;

  return question ? `${base}\n\nUser's specific question: ${question}` : base;
}
