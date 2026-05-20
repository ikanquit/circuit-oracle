"use client";

import { useEffect, useRef, useState, type CSSProperties, type JSX } from "react";

interface OscilloscopeLoaderProps {
  label?: string;
  width?: number;
  height?: number;
  waveform?: "sine" | "square" | "noise";
}

const PHOSPHOR = "#c6ff4d";
const GRID_DIM = "rgba(198,255,77,0.10)";
const GRID_AXIS = "rgba(198,255,77,0.25)";

const GRID_COLS = 8;
const GRID_ROWS = 6;
const TICKS_PER_DIV = 5;

export default function OscilloscopeLoader({
  label = "ACQUIRING SIGNAL",
  width = 360,
  height = 200,
  waveform = "sine",
}: OscilloscopeLoaderProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const lastCounterUpdateRef = useRef<number>(0);
  const noiseBufferRef = useRef<number[] | null>(null);

  const [frameCounter, setFrameCounter] = useState<number>(0);
  const [recBlink, setRecBlink] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Pre-fill noise buffer for noise waveform random walk.
    if (waveform === "noise") {
      const buf: number[] = new Array(width);
      let v = 0;
      for (let i = 0; i < width; i++) {
        v += (Math.random() - 0.5) * 6;
        v *= 0.96;
        buf[i] = v;
      }
      noiseBufferRef.current = buf;
    } else {
      noiseBufferRef.current = null;
    }

    const drawGraticule = (): void => {
      ctx.save();
      ctx.lineWidth = 1;

      // Light grid: 8 vertical + 6 horizontal lines.
      ctx.strokeStyle = GRID_DIM;
      ctx.beginPath();
      for (let i = 1; i < GRID_COLS; i++) {
        const x = Math.round((i * width) / GRID_COLS) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let j = 1; j < GRID_ROWS; j++) {
        const y = Math.round((j * height) / GRID_ROWS) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Center crosshair (brighter).
      const cx = Math.round(width / 2) + 0.5;
      const cy = Math.round(height / 2) + 0.5;
      ctx.strokeStyle = GRID_AXIS;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      // Tick marks every 1/5 of a division on the center axes.
      const divW = width / GRID_COLS;
      const divH = height / GRID_ROWS;
      const tickW = divW / TICKS_PER_DIV;
      const tickH = divH / TICKS_PER_DIV;
      const tickLen = 3;

      ctx.strokeStyle = GRID_AXIS;
      ctx.beginPath();
      // Horizontal axis ticks (vertical strokes).
      const totalTicksX = GRID_COLS * TICKS_PER_DIV;
      for (let i = 0; i <= totalTicksX; i++) {
        const x = Math.round(i * tickW) + 0.5;
        ctx.moveTo(x, cy - tickLen);
        ctx.lineTo(x, cy + tickLen);
      }
      // Vertical axis ticks (horizontal strokes).
      const totalTicksY = GRID_ROWS * TICKS_PER_DIV;
      for (let j = 0; j <= totalTicksY; j++) {
        const y = Math.round(j * tickH) + 0.5;
        ctx.moveTo(cx - tickLen, y);
        ctx.lineTo(cx + tickLen, y);
      }
      ctx.stroke();

      // Outer screen frame.
      ctx.strokeStyle = "rgba(198,255,77,0.15)";
      ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

      ctx.restore();
    };

    const computeY = (x: number, midY: number, amplitude: number): number => {
      if (waveform === "noise") {
        const buf = noiseBufferRef.current;
        if (!buf) return midY;
        // Scroll the noise buffer: shift left and append a new sample each frame
        // (handled in shiftNoise below). Here we just read the buffer.
        return midY + buf[x];
      }
      const period = width / 4; // ~2 full cycles across screen
      const angle = (x / period) * Math.PI * 2 + phaseRef.current;
      if (waveform === "square") {
        const s = Math.sign(Math.sin(angle));
        return midY + amplitude * (s === 0 ? 1 : s) * 0.85;
      }
      return midY + amplitude * Math.sin(angle);
    };

    const shiftNoise = (): void => {
      const buf = noiseBufferRef.current;
      if (!buf) return;
      // Random walk, scrolled.
      const last = buf[buf.length - 1];
      let next = last + (Math.random() - 0.5) * 8;
      next *= 0.95;
      // Clamp gently.
      const maxAmp = height * 0.32;
      if (next > maxAmp) next = maxAmp;
      if (next < -maxAmp) next = -maxAmp;
      buf.shift();
      buf.push(next);
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, width, height);
      drawGraticule();

      const midY = height / 2;
      const amplitude = height * 0.32;

      if (waveform === "noise") {
        shiftNoise();
      }

      // Build trace points once.
      const points: Array<{ x: number; y: number }> = new Array(width);
      for (let x = 0; x < width; x++) {
        points[x] = { x, y: computeY(x, midY, amplitude) };
      }

      // Main trace (with glow).
      ctx.save();
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = PHOSPHOR;
      ctx.shadowColor = PHOSPHOR;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();

      // Leading edge brighter (last 20% white-tinted).
      const leadStart = Math.floor(points.length * 0.8);
      if (leadStart < points.length - 1) {
        ctx.save();
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(240,255,210,0.95)";
        ctx.shadowColor = PHOSPHOR;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(points[leadStart].x, points[leadStart].y);
        for (let i = leadStart + 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Bright dot at the very leading edge.
        const tip = points[points.length - 1];
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.arc(tip.x, tip.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Respect prefers-reduced-motion — render a single static frame
    // instead of running the rAF loop. The graticule + trace are still
    // visible, just frozen.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      draw();
      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }

    const tick = (now: number): void => {
      frameRef.current += 1;

      // Advance phase for periodic waveforms.
      phaseRef.current += waveform === "square" ? 0.06 : 0.09;

      draw();

      // Throttle setState for frame counter to ~10Hz.
      if (now - lastCounterUpdateRef.current >= 100) {
        lastCounterUpdateRef.current = now;
        setFrameCounter(frameRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [width, height, waveform]);

  // REC indicator blink (~1Hz) — interval, not rAF. Skip under
  // prefers-reduced-motion so the dot stays solid red.
  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setRecBlink((b) => !b);
    }, 600);
    return () => window.clearInterval(id);
  }, []);

  const formattedFrame = `#${String(frameCounter % 10000).padStart(4, "0")}`;

  const frameStyle: CSSProperties = {
    background: "var(--co-surface)",
    border: "1px solid var(--co-border)",
    padding: 16,
    borderRadius: 2,
    display: "inline-block",
  };

  const screenWrapStyle: CSSProperties = {
    position: "relative",
    width,
    height,
    background: "var(--co-bg)",
    border: "1px solid var(--co-border)",
    overflow: "hidden",
  };

  const hudBase: CSSProperties = {
    position: "absolute",
    fontFamily: "var(--co-font-mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    lineHeight: 1,
    pointerEvents: "none",
    textTransform: "uppercase",
  };

  const phosphorDim: CSSProperties = {
    color: "var(--co-phosphor-dim)",
  };

  const mutedDim: CSSProperties = {
    color: "var(--co-muted)",
  };

  const recStyle: CSSProperties = {
    color: "#ff4d4d",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  return (
    <div
      className="co-osc-root"
      style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}
      aria-label={label}
      role="status"
    >
      <div style={frameStyle}>
        <div style={screenWrapStyle}>
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: `${width}px`,
              height: `${height}px`,
            }}
          />

          {/* HUD: top-left */}
          <div
            className="co-mono"
            style={{ ...hudBase, ...phosphorDim, top: 6, left: 8 }}
          >
            CH1&nbsp;&nbsp;5V/DIV
          </div>

          {/* HUD: top-right */}
          <div
            className="co-mono"
            style={{ ...hudBase, ...phosphorDim, top: 6, right: 8 }}
          >
            100ms/DIV
          </div>

          {/* HUD: bottom-left (REC) */}
          <div
            className="co-mono"
            style={{ ...hudBase, ...recStyle, bottom: 6, left: 8 }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ff4d4d",
                boxShadow: "0 0 6px #ff4d4d",
                opacity: recBlink ? 1 : 0.15,
                transition: "opacity 120ms linear",
              }}
            />
            REC
          </div>

          {/* HUD: bottom-right (frame counter) */}
          <div
            className="co-mono"
            style={{ ...hudBase, ...mutedDim, bottom: 6, right: 8 }}
          >
            {formattedFrame}
          </div>
        </div>
      </div>

      <div
        className="co-mono co-label"
        style={{
          color: "var(--co-text-dim)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textAlign: "center",
        }}
      >
        <span style={{ color: "var(--co-phosphor)", marginRight: 6 }}>&#9656;</span>
        {label}
      </div>
    </div>
  );
}
