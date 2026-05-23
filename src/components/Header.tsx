"use client";

export default function Header() {
  return (
    <header
      className="w-full border-b"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            ⚡
          </div>
          <div>
            <h1
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              CircuitOracle
            </h1>
            <p
              className="text-[14px]"
              style={{ color: "var(--co-text-dim)" }}
            >
              AI-powered schematic analysis
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <span
            className="text-[13px] px-2.5 py-1 rounded font-mono"
            style={{
              backgroundColor: "var(--surface2)",
              color: "var(--co-text-dim)",
              border: "1px solid var(--border)",
            }}
          >
            gemini-2.5-flash
          </span>
          <span
            className="text-[13px] px-2.5 py-1 rounded font-mono"
            style={{
              backgroundColor: "color-mix(in srgb, var(--success) 15%, transparent)",
              color: "var(--success)",
              border: "1px solid color-mix(in srgb, var(--success) 30%, transparent)",
            }}
          >
            ● live
          </span>
        </div>
      </div>
    </header>
  );
}
