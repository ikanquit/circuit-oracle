import { ImageResponse } from "next/og";

// Favicon — generated dynamically. Static favicons in /public override this
// if the branding stream drops them in (Next.js prefers static files at
// `/favicon.ico` over this conventions route).
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * 32×32 favicon: phosphor-green "C" mark on a dark surface, mimicking the
 * Oracle IC chip — minimal so it stays legible at tab-favicon scale.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050608",
          color: "#c6ff4d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          fontWeight: 900,
          fontFamily: "monospace",
          borderRadius: 6,
          border: "1.5px solid #7a9e26",
          letterSpacing: "-0.04em",
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
