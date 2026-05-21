import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

// Next.js metadata route conventions
export const runtime = "edge";
export const alt = SITE.ogImage.alt;
export const size = { width: SITE.ogImage.width, height: SITE.ogImage.height };
export const contentType = "image/png";

/**
 * Default Open Graph image for CircuitOracle.
 *
 * Visual language matches the v2 aesthetic:
 *   - Dark blueprint background (#050608) with a subtle grid + diagonal stripes
 *   - Phosphor-green title with a soft glow
 *   - Monospace meta labels (top + bottom rails) mimicking an oscilloscope HUD
 *   - A schematic motif on the right: IC chip with traces + a passing waveform
 *
 * No external font fetches — we lean on `monospace` + the default `sans-serif`
 * so the route stays edge-runtime-friendly and resilient if Google Fonts is
 * unreachable at build time.
 */
export default async function OpengraphImage() {
  const phosphor = "#c6ff4d";
  const phosphorDim = "#7a9e26";
  const blueprint = "#4f9eff";
  const amber = "#ffb547";
  const text = "#f0eee6";
  const muted = "#6a6c75";
  const bg = "#050608";
  const surface = "#0c0e12";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: bg,
          color: text,
          fontFamily: "monospace",
          position: "relative",
          padding: 64,
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(198,255,77,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(198,255,77,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* Vignette glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 75% 50%, rgba(198,255,77,0.10), transparent 55%)",
            display: "flex",
          }}
        />

        {/* Scanline overlay (very subtle) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(198,255,77,0.025) 0px, rgba(198,255,77,0.025) 1px, transparent 1px, transparent 3px)",
            display: "flex",
          }}
        />

        {/* Top rail — oscilloscope HUD */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: "0.2em",
            color: muted,
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: phosphor,
                boxShadow: `0 0 12px ${phosphor}`,
              }}
            />
            <span>CH1 // SCHEMATIC IN</span>
          </div>
          <span style={{ color: amber }}>v2.0 / ANALYSIS PIPELINE</span>
        </div>

        {/* Main layout: title block + IC motif */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
            marginTop: 40,
          }}
        >
          {/* Left: brand + tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 16,
                color: blueprint,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ display: "block" }}>
                <rect
                  x="2"
                  y="2"
                  width="10"
                  height="10"
                  transform="rotate(45 7 7)"
                  fill="none"
                  stroke={blueprint}
                  strokeWidth="1.5"
                />
              </svg>
              <span>SIGNAL ACQUIRED</span>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 132,
                fontWeight: 900,
                lineHeight: 0.92,
                marginTop: 28,
                color: phosphor,
                letterSpacing: "-0.04em",
                textShadow: `0 0 18px rgba(198,255,77,0.45), 0 0 40px rgba(198,255,77,0.22)`,
              }}
            >
              CircuitOracle
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 32,
                marginTop: 28,
                color: text,
                lineHeight: 1.2,
                fontFamily: "sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Upload a schematic. Four Claude agents read it in parallel.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 22,
                marginTop: 18,
                color: muted,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              components / topology / domain / synthesis
            </div>
          </div>

          {/* Right: schematic / IC motif */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              marginRight: 8,
            }}
          >
            {/* Waveform plate */}
            <svg width="320" height="100" viewBox="0 0 320 100">
              <path
                d="M0 50 L40 50 L52 20 L76 80 L100 50 L140 50 L152 30 L176 70 L200 50 L260 50 L268 36 L284 64 L300 50 L320 50"
                stroke={phosphor}
                strokeWidth="3"
                fill="none"
                style={{ filter: `drop-shadow(0 0 6px ${phosphor})` }}
              />
              <line
                x1="0"
                y1="50"
                x2="320"
                y2="50"
                stroke={phosphorDim}
                strokeOpacity="0.35"
                strokeDasharray="4 6"
                strokeWidth="1"
              />
            </svg>

            {/* IC chip */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Top pins */}
              <div style={{ display: "flex", gap: 14 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`t-${i}`}
                    style={{
                      width: 8,
                      height: 22,
                      background: "#3a3f47",
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  width: 280,
                  height: 200,
                  background: surface,
                  border: `2px solid ${phosphorDim}`,
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: `0 0 32px rgba(198,255,77,0.15)`,
                }}
              >
                {/* Index notch */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 14,
                    background: bg,
                    borderBottomLeftRadius: 14,
                    borderBottomRightRadius: 14,
                    display: "flex",
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    color: muted,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    marginTop: 10,
                    display: "flex",
                  }}
                >
                  CO-4106
                </div>
                <div
                  style={{
                    fontSize: 38,
                    color: phosphor,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    marginTop: 14,
                    display: "flex",
                    textShadow: `0 0 12px rgba(198,255,77,0.55)`,
                  }}
                >
                  ORACLE
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: muted,
                    letterSpacing: "0.3em",
                    marginTop: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: "block" }}>
                    <polygon points="5,1 9,9 1,9" fill={muted} />
                  </svg>
                  AI / CLAUDE
                </div>
              </div>
              {/* Bottom pins */}
              <div style={{ display: "flex", gap: 14 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`b-${i}`}
                    style={{
                      width: 8,
                      height: 22,
                      background: "#3a3f47",
                      borderBottomLeftRadius: 2,
                      borderBottomRightRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            color: muted,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            zIndex: 2,
            marginTop: 24,
            borderTop: `1px solid rgba(255,255,255,0.08)`,
            paddingTop: 18,
          }}
        >
          <span>github.com/ikanquit/circuit-oracle</span>
          <span
            style={{
              color: phosphor,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: phosphor,
                boxShadow: `0 0 10px ${phosphor}`,
                display: "flex",
              }}
            />
            LIVE / MULTI-AGENT
          </span>
          <span>powered by claude sonnet</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
