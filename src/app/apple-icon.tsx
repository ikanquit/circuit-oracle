import { ImageResponse } from "next/og";

// Apple touch icon — 180×180 PNG. Slightly more elaborate than the favicon
// because it shows up on iOS home screens at a larger size.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const phosphor = "#c6ff4d";
  const phosphorDim = "#7a9e26";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050608",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(198,255,77,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(198,255,77,0.10) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            display: "flex",
          }}
        />
        {/* Glow plate */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(198,255,77,0.18), transparent 65%)",
            display: "flex",
          }}
        />
        {/* IC chip card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 124,
            height: 124,
            background: "#0c0e12",
            border: `3px solid ${phosphorDim}`,
            borderRadius: 18,
            color: phosphor,
            fontSize: 78,
            fontWeight: 900,
            fontFamily: "monospace",
            letterSpacing: "-0.05em",
            boxShadow: `0 0 36px rgba(198,255,77,0.35)`,
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size }
  );
}
