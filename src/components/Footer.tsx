import Link from "next/link";
import type { CSSProperties, JSX } from "react";

/**
 * Site-wide compact footer.
 *
 * Used on subpages (/about, /how-it-works, etc.). The homepage uses the
 * full-bleed TickerFooter from src/components/v2/. This one is intentionally
 * restrained — thin border, monospace labels, subtle phosphor.
 */

const NAV_LINKS: ReadonlyArray<{ label: string; href: string; external?: boolean }> = [
  { label: "ANALYZE", href: "/" },
  { label: "SAMPLES", href: "/samples" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "ABOUT", href: "/about" },
  {
    label: "GITHUB",
    href: "https://github.com/ikanquit/circuit-oracle",
    external: true,
  },
];

const META_CELLS: ReadonlyArray<{ label: string; value: string }> = [
  { label: "MODEL", value: "gemini-2.5-flash" },
  { label: "PIPELINE", value: "4 agents · parallel + synthesis" },
  { label: "RUNTIME", value: "Next.js · SSE · 60s max" },
];

const baseLinkStyle: CSSProperties = {
  fontFamily: "var(--co-font-mono)",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--co-text-dim)",
  textDecoration: "none",
  transition: "color 120ms ease",
  paddingBlock: "3px",
};

export default function Footer(): JSX.Element {
  return (
    <footer
      data-co-footer="site"
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "var(--co-surface)",
        borderTop: "1px solid var(--co-border-strong)",
        color: "var(--co-text)",
        overflow: "hidden",
      }}
    >
      {/* Subtle scanline veil */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(198,255,77,0.018) 0, rgba(198,255,77,0.018) 1px, transparent 1px, transparent 3px)",
          zIndex: 0,
        }}
      />

      {/* Phosphor hairline */}
      <div
        aria-hidden
        style={{
          height: "1px",
          width: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(198,255,77,0.35) 50%, transparent 100%)",
          position: "relative",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px 32px 28px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 2fr)",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* LEFT — wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
          <Link
            href="/"
            aria-label="CircuitOracle home"
            className="co-display"
            style={{
              color: "var(--co-text)",
              fontSize: "28px",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "baseline",
              gap: "1px",
            }}
          >
            <span>CIRCUIT</span>
            <span style={{ color: "var(--co-phosphor)", opacity: 0.85 }}>/</span>
            <span>ORACLE</span>
          </Link>
          <p
            className="co-mono"
            style={{
              color: "var(--co-muted)",
              fontSize: "13px",
              letterSpacing: "0.1em",
              lineHeight: 1.55,
              maxWidth: "34ch",
              margin: 0,
            }}
          >
            Multi-agent schematic analysis at engineering depth.
          </p>
        </div>

        {/* RIGHT — nav grid + meta */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "32px",
            minWidth: 0,
          }}
        >
          {/* Nav */}
          <nav
            aria-label="Site"
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <span
              className="co-label"
              style={{
                color: "var(--co-muted)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                marginBottom: "8px",
              }}
            >
              [ NAV ]
            </span>
            {NAV_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...baseLinkStyle, display: "inline-flex", alignItems: "center", gap: "6px" }}
                  className="co-footer-link"
                  aria-label={link.label === "GITHUB" ? "GitHub repository" : link.label}
                >
                  {link.label === "GITHUB" && (
                    <svg
                      aria-hidden
                      width="14"
                      height="14"
                      viewBox="0 0 98 96"
                      fill="currentColor"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                    </svg>
                  )}
                  {link.label}
                  {link.label !== "GITHUB" && (
                    <span aria-hidden style={{ color: "var(--co-muted)", fontSize: "11px" }}>↗</span>
                  )}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  style={baseLinkStyle}
                  className="co-footer-link"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Meta cells */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span
              className="co-label"
              style={{
                color: "var(--co-muted)",
                fontSize: "11px",
                letterSpacing: "0.18em",
              }}
            >
              [ SYSTEM ]
            </span>
            {META_CELLS.map((cell) => (
              <div
                key={cell.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(72px, 84px) minmax(0, 1fr)",
                  gap: "12px",
                  alignItems: "baseline",
                }}
              >
                <span
                  className="co-mono"
                  style={{
                    color: "var(--co-muted)",
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                  }}
                >
                  {cell.label}
                </span>
                <span
                  className="co-mono"
                  style={{
                    color: "var(--co-text-dim)",
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    wordBreak: "break-word",
                  }}
                >
                  {cell.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signature line */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid var(--co-border)",
          padding: "12px 32px",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <span
          className="co-mono"
          style={{
            color: "var(--co-muted)",
            fontSize: "12px",
            letterSpacing: "0.14em",
          }}
        >
          © 2026 · CIRCUIT/ORACLE · NOT A SUBSTITUTE FOR A REAL EE
        </span>

        <span
          className="co-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--co-text-dim)",
            fontSize: "12px",
            letterSpacing: "0.14em",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "5px",
              height: "5px",
              borderRadius: "9999px",
              backgroundColor: "var(--co-phosphor)",
              boxShadow: "0 0 5px var(--co-phosphor)",
            }}
          />
          SYSTEM NOMINAL
        </span>
      </div>

      <style>{`
        .co-footer-link:hover { color: var(--co-phosphor) !important; }
        @media (max-width: 768px) {
          footer[data-co-footer="site"] > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          footer[data-co-footer="site"] > div:nth-of-type(2) > div:last-of-type {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </footer>
  );
}
