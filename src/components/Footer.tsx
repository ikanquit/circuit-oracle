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
  { label: "MODEL", value: "claude-sonnet-4-6" },
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
                  style={baseLinkStyle}
                  className="co-footer-link"
                >
                  {link.label}{" "}
                  <span
                    aria-hidden
                    style={{ color: "var(--co-muted)", fontSize: "11px" }}
                  >
                    ↗
                  </span>
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
