import { ImageResponse } from "next/og";

// Apple touch icon — generated at build time from JSX.
// Mirrors the IC-chip mark in public/icon.svg using the brand monochrome palette.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 28,
          position: "relative",
        }}
      >
        {/* Chip body */}
        <div
          style={{
            width: 100,
            height: 100,
            background: "#0c0e12",
            border: "4px solid #c6ff4d",
            borderRadius: 8,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Diagonal "slash" — die mark */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 24,
              width: 78,
              height: 8,
              background: "#c6ff4d",
              transform: "rotate(126deg)",
              transformOrigin: "left top",
            }}
          />
          {/* Pin-1 amber dot */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#ffb547",
            }}
          />
          {/* Center die dot */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "#ffb547",
            }}
          />
        </div>

        {/* Pins — left */}
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 56,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`l${i}`}
              style={{ width: 18, height: 8, background: "#c6ff4d" }}
            />
          ))}
        </div>
        {/* Pins — right */}
        <div
          style={{
            position: "absolute",
            right: 22,
            top: 56,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`r${i}`}
              style={{ width: 18, height: 8, background: "#c6ff4d" }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
