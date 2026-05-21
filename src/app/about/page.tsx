import type { Metadata, Route } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/v2/CircuitBackground";
import ScanlineOverlay from "@/components/v2/ScanlineOverlay";

export const metadata: Metadata = {
  title: "About — CircuitOracle",
  description:
    "Why CircuitOracle exists. A manifesto for multi-agent schematic analysis at engineering depth.",
};

const PRINCIPLES: ReadonlyArray<{ tag: string; body: string }> = [
  {
    tag: "01",
    body:
      "A schematic is a compressed engineering decision. Reading it back out requires more than pattern-matching component icons — it requires arguing about why the values are what they are.",
  },
  {
    tag: "02",
    body:
      "One large model with one prompt produces one opinion. Three smaller, specialized prompts argue with each other first, and a fourth one writes the verdict. The work shows.",
  },
  {
    tag: "03",
    body:
      "We stream tokens because waiting 45 seconds for a wall of text is rude. You should watch the synthesis assemble itself, the way you'd watch an engineer think on a whiteboard.",
  },
  {
    tag: "04",
    body:
      "This is not a replacement for an electrical engineer. It is the second opinion you didn't have a colleague around to give you at 1am.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <CircuitBackground />
      <ScanlineOverlay intensity="subtle" />

      <main
        className="relative z-10"
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          padding: "96px 24px 64px",
        }}
      >
        {/* Top nav strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "56px",
          }}
        >
          <Link
            href="/"
            className="co-mono"
            style={{
              color: "var(--co-text-dim)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textDecoration: "none",
            }}
          >
            ← BACK TO ANALYZE
          </Link>
          <span
            className="co-mono"
            style={{
              color: "var(--co-muted)",
              fontSize: "12px",
              letterSpacing: "0.18em",
            }}
          >
            DOC · ABOUT · REV 02
          </span>
        </div>

        {/* Eyebrow */}
        <div
          className="co-label"
          style={{
            color: "var(--co-phosphor)",
            marginBottom: "20px",
            opacity: 0.9,
          }}
        >
          [ MANIFESTO · NO BULLETS ABOUT SYNERGY ]
        </div>

        {/* Hero headline */}
        <h1
          className="co-display"
          style={{
            fontSize: "clamp(40px, 7vw, 76px)",
            lineHeight: 0.95,
            margin: "0 0 32px",
            color: "var(--co-text)",
          }}
        >
          We built CircuitOracle because{" "}
          <span style={{ color: "var(--co-phosphor)" }}>
            nobody reads schematics out loud anymore
          </span>
          .
        </h1>

        {/* Lead */}
        <p
          style={{
            fontFamily: "var(--co-font-body)",
            fontSize: "21px",
            lineHeight: 1.6,
            color: "var(--co-text-dim)",
            margin: "0 0 48px",
            maxWidth: "62ch",
          }}
        >
          When you ask a senior analog engineer to look at an unfamiliar circuit,
          they do four things at once. They list the parts. They trace the signal
          path. They decide what the thing is for. Then they tell you what they
          would change. CircuitOracle is that four-step habit, wired up as four
          Claude agents running in parallel, with the synthesis streamed as it
          writes itself.
        </p>

        {/* Divider */}
        <div
          aria-hidden
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, var(--co-phosphor) 0%, transparent 60%)",
            opacity: 0.35,
            margin: "0 0 48px",
          }}
        />

        {/* Principles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", marginBottom: "64px" }}>
          {PRINCIPLES.map((p) => (
            <div
              key={p.tag}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: "24px",
                alignItems: "start",
              }}
            >
              <span
                className="co-mono"
                style={{
                  color: "var(--co-amber)",
                  fontSize: "14px",
                  letterSpacing: "0.18em",
                  lineHeight: 1.4,
                  paddingTop: "3px",
                }}
              >
                {p.tag}
              </span>
              <p
                style={{
                  fontFamily: "var(--co-font-body)",
                  fontSize: "17px",
                  lineHeight: 1.65,
                  color: "var(--co-text)",
                  margin: 0,
                  maxWidth: "62ch",
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Provenance / builder card */}
        <div
          style={{
            border: "1px solid var(--co-border-strong)",
            backgroundColor: "var(--co-surface)",
            padding: "28px",
            marginBottom: "48px",
            position: "relative",
          }}
        >
          <div
            className="co-label"
            style={{ color: "var(--co-muted)", marginBottom: "16px" }}
          >
            [ PROVENANCE ]
          </div>
          <p
            style={{
              fontFamily: "var(--co-font-body)",
              fontSize: "17px",
              lineHeight: 1.65,
              color: "var(--co-text)",
              margin: "0 0 16px",
              maxWidth: "62ch",
            }}
          >
            CircuitOracle is built by people who got tired of pasting screenshots
            of schematics into chat windows and getting back a 5-line summary
            that confused a feedback resistor with a bypass cap. We wanted a tool
            that argued with itself before it argued with us.
          </p>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "var(--co-text-dim)",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            Stack: Next.js · Claude (claude-sonnet-4-6) · SSE · vision input ·
            no image retention, no training data extracted, no &quot;your
            schematic is now ours&quot; clause buried in TOS.
          </p>
        </div>

        {/* CTA strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <Link
            href={"/" as Route}
            className="co-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 22px",
              backgroundColor: "var(--co-phosphor)",
              color: "var(--co-bg)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ANALYZE A SCHEMATIC <span aria-hidden>→</span>
          </Link>
          <Link
            href={"/how-it-works" as Route}
            className="co-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 22px",
              border: "1px solid var(--co-border-strong)",
              color: "var(--co-text)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textDecoration: "none",
            }}
          >
            HOW IT WORKS
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
