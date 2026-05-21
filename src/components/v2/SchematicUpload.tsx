"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type JSX,
  type DragEvent,
  type ChangeEvent,
  type CSSProperties,
} from "react";

interface SchematicUploadProps {
  onFile: (file: File | null) => void;
  onQuestion: (q: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
  question: string;
  selectedFile: File | null;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function truncateMiddle(name: string, max = 38): string {
  if (name.length <= max) return name;
  const keep = Math.floor((max - 1) / 2);
  return `${name.slice(0, keep)}…${name.slice(name.length - keep)}`;
}

function formatKB(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/* ------------------------------------------------------------------ */
/* Corner brackets — 4 absolutely-positioned L-shapes                 */
/* ------------------------------------------------------------------ */

const BRACKET_LEN = 8;
const BRACKET_STROKE = 1;

type Corner = "tl" | "tr" | "bl" | "br";

function CornerBracket({ corner }: { corner: Corner }): JSX.Element {
  // Each bracket is a span with two pseudo-like inner spans (horizontal + vertical)
  const base: CSSProperties = {
    position: "absolute",
    width: BRACKET_LEN,
    height: BRACKET_LEN,
    pointerEvents: "none",
    color: "var(--co-phosphor)",
  };

  const positions: Record<Corner, CSSProperties> = {
    tl: { top: -1, left: -1 },
    tr: { top: -1, right: -1 },
    bl: { bottom: -1, left: -1 },
    br: { bottom: -1, right: -1 },
  };

  const horizontal: CSSProperties = {
    position: "absolute",
    height: BRACKET_STROKE,
    width: BRACKET_LEN,
    background: "currentColor",
    top: corner === "tl" || corner === "tr" ? 0 : "auto",
    bottom: corner === "bl" || corner === "br" ? 0 : "auto",
    left: corner === "tl" || corner === "bl" ? 0 : "auto",
    right: corner === "tr" || corner === "br" ? 0 : "auto",
  };

  const vertical: CSSProperties = {
    position: "absolute",
    width: BRACKET_STROKE,
    height: BRACKET_LEN,
    background: "currentColor",
    top: corner === "tl" || corner === "tr" ? 0 : "auto",
    bottom: corner === "bl" || corner === "br" ? 0 : "auto",
    left: corner === "tl" || corner === "bl" ? 0 : "auto",
    right: corner === "tr" || corner === "br" ? 0 : "auto",
  };

  return (
    <span style={{ ...base, ...positions[corner] }} aria-hidden="true">
      <span style={horizontal} />
      <span style={vertical} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* IC / hexagon icon                                                  */
/* ------------------------------------------------------------------ */

function ICIcon({ opacity }: { opacity: number }): JSX.Element {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      style={{
        color: "var(--co-phosphor)",
        opacity,
        transition: "opacity 180ms ease",
      }}
      aria-hidden="true"
    >
      {/* outer hex */}
      <path
        d="M23 3 L40 13 L40 33 L23 43 L6 33 L6 13 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* inner die */}
      <rect
        x="14"
        y="14"
        width="18"
        height="18"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* pin 1 dot */}
      <circle cx="17" cy="17" r="1.2" fill="currentColor" />
      {/* leads */}
      <line x1="14" y1="19" x2="9" y2="19" stroke="currentColor" strokeWidth="0.9" />
      <line x1="14" y1="23" x2="9" y2="23" stroke="currentColor" strokeWidth="0.9" />
      <line x1="14" y1="27" x2="9" y2="27" stroke="currentColor" strokeWidth="0.9" />
      <line x1="32" y1="19" x2="37" y2="19" stroke="currentColor" strokeWidth="0.9" />
      <line x1="32" y1="23" x2="37" y2="23" stroke="currentColor" strokeWidth="0.9" />
      <line x1="32" y1="27" x2="37" y2="27" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function SchematicUpload({
  onFile,
  onQuestion,
  onSubmit,
  onClear,
  isAnalyzing,
  question,
  selectedFile,
}: SchematicUploadProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textareaFocused, setTextareaFocused] = useState(false);

  /* Manage object URL lifecycle */
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  /* File ingestion */
  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      onFile(file);
    },
    [onFile],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile],
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleEject = () => {
    if (inputRef.current) inputRef.current.value = "";
    onClear();
  };

  const canSubmit = !!selectedFile && !isAnalyzing;
  const dropActive = dragging || hover;

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col gap-5" style={{ color: "var(--co-text)" }}>
      {/* === Header strip ============================================ */}
      <div className="flex items-center justify-between px-1">
        <span
          className="co-mono"
          style={{
            fontSize: 11,
            color: "var(--co-muted)",
          }}
        >
          [ INPUT TRAY · 01 ]
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: selectedFile ? "var(--co-phosphor)" : "var(--co-muted)",
              boxShadow: selectedFile
                ? "0 0 6px var(--co-phosphor), 0 0 12px rgba(198,255,77,0.35)"
                : "none",
              transition: "background 200ms ease, box-shadow 200ms ease",
            }}
          />
          <span
            className="co-mono"
            style={{
              fontSize: 11,
              color: selectedFile ? "var(--co-phosphor)" : "var(--co-muted)",
            }}
          >
            {selectedFile ? "LOADED" : "STANDBY"}
          </span>
        </span>
      </div>

      {/* === Outer panel ============================================= */}
      <div
        className="relative"
        style={{
          background: "var(--co-surface)",
          border: "1px solid var(--co-border-strong)",
          padding: 18,
        }}
      >
        <CornerBracket corner="tl" />
        <CornerBracket corner="tr" />
        <CornerBracket corner="bl" />
        <CornerBracket corner="br" />

        {/* ---- Drop zone / sample card -------------------------------- */}
        {!selectedFile ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Drop schematic or click to browse"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="relative flex flex-col items-center justify-center select-none cursor-pointer"
            style={{
              padding: "64px 24px",
              border: "1px dashed",
              borderColor: dropActive
                ? "var(--co-phosphor)"
                : "var(--co-border-strong)",
              background: dropActive
                ? "color-mix(in srgb, var(--co-phosphor) 4%, transparent)"
                : "transparent",
              transition:
                "border-color 180ms ease, background 180ms ease",
            }}
          >
            {/* tiny ascii-style coordinate marks */}
            <span
              className="co-mono absolute"
              style={{
                top: 8,
                left: 10,
                fontSize: 9,
                color: "var(--co-muted)",
                opacity: 0.55,
              }}
            >
              X+0.00
            </span>
            <span
              className="co-mono absolute"
              style={{
                top: 8,
                right: 10,
                fontSize: 9,
                color: "var(--co-muted)",
                opacity: 0.55,
              }}
            >
              Y+0.00
            </span>
            <span
              className="co-mono absolute"
              style={{
                bottom: 8,
                left: 10,
                fontSize: 9,
                color: "var(--co-muted)",
                opacity: 0.55,
              }}
            >
              Z-AXIS · MOUNT
            </span>
            <span
              className="co-mono absolute"
              style={{
                bottom: 8,
                right: 10,
                fontSize: 9,
                color: "var(--co-muted)",
                opacity: 0.55,
              }}
            >
              REV.A
            </span>

            <ICIcon opacity={dropActive ? 1 : 0.4} />

            <div
              className="co-mono"
              style={{
                marginTop: 18,
                fontSize: 15,
                color: "var(--co-text)",
                letterSpacing: "0.2em",
              }}
            >
              {dragging ? "RELEASE TO LOAD" : "DROP SCHEMATIC"}
            </div>
            <div
              className="co-mono"
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "var(--co-muted)",
                letterSpacing: "0.12em",
              }}
            >
              PNG · JPG · WEBP · ≤10MB
            </div>

            {/* faint divider + browse hint */}
            <div
              style={{
                marginTop: 18,
                width: 28,
                height: 1,
                background: "var(--co-border-strong)",
              }}
            />
            <div
              className="co-mono"
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "var(--co-muted)",
                letterSpacing: "0.18em",
              }}
            >
              CLICK TO BROWSE
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col"
            style={{
              border: "1px solid var(--co-border-strong)",
              background: "var(--co-surface-2)",
            }}
          >
            {/* Top bar: file name + size + eject */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid var(--co-border)",
                background:
                  "color-mix(in srgb, var(--co-phosphor) 3%, transparent)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    background: "var(--co-phosphor)",
                    boxShadow: "0 0 6px var(--co-phosphor)",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="co-mono"
                  style={{
                    fontSize: 13,
                    color: "var(--co-text)",
                    letterSpacing: "0.08em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={selectedFile.name}
                >
                  {truncateMiddle(selectedFile.name)}
                </span>
                <span
                  className="co-mono"
                  style={{
                    fontSize: 11,
                    color: "var(--co-muted)",
                    letterSpacing: "0.1em",
                    flexShrink: 0,
                  }}
                >
                  · {formatKB(selectedFile.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleEject}
                disabled={isAnalyzing}
                className="co-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "var(--co-amber)",
                  background: "transparent",
                  border: "1px solid color-mix(in srgb, var(--co-amber) 35%, transparent)",
                  padding: "4px 10px",
                  cursor: isAnalyzing ? "not-allowed" : "pointer",
                  opacity: isAnalyzing ? 0.4 : 1,
                  transition: "background 150ms ease, color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  if (isAnalyzing) return;
                  e.currentTarget.style.background =
                    "color-mix(in srgb, var(--co-amber) 12%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                aria-label="Eject sample"
              >
                ◁ EJECT
              </button>
            </div>

            {/* Preview */}
            <div
              className="flex items-center justify-center"
              style={{
                padding: 12,
                background:
                  "repeating-linear-gradient(45deg, var(--co-surface-2) 0 8px, var(--co-surface) 8px 16px)",
              }}
            >
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt={`Preview of ${selectedFile.name}`}
                  style={{
                    maxHeight: 120,
                    maxWidth: "100%",
                    objectFit: "contain",
                    border: "1px solid var(--co-phosphor)",
                    boxShadow:
                      "0 0 0 1px rgba(198,255,77,0.18), 0 0 24px rgba(198,255,77,0.08)",
                    background: "var(--co-bg)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  className="co-mono"
                  style={{ fontSize: 11, color: "var(--co-muted)" }}
                >
                  GENERATING THUMBNAIL…
                </div>
              )}
            </div>

            {/* Footer meta line */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "8px 12px",
                borderTop: "1px solid var(--co-border)",
              }}
            >
              <span
                className="co-mono"
                style={{ fontSize: 11, color: "var(--co-muted)" }}
              >
                TYPE · {selectedFile.type.replace("image/", "").toUpperCase() || "BIN"}
              </span>
              <span
                className="co-mono"
                style={{ fontSize: 11, color: "var(--co-muted)" }}
              >
                STATUS · READY
              </span>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      {/* === Optional query ========================================== */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="schematic-query"
            className="co-label"
            style={{ color: "var(--co-muted)" }}
          >
            OPTIONAL QUERY
          </label>
          <span
            className="co-mono"
            style={{
              fontSize: 11,
              color: "var(--co-muted)",
              letterSpacing: "0.15em",
            }}
          >
            {question.length.toString().padStart(3, "0")} / 500
          </span>
        </div>
        <textarea
          id="schematic-query"
          value={question}
          onChange={(e) => onQuestion(e.target.value)}
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          placeholder="What part interests you? (optional)"
          maxLength={500}
          rows={3}
          spellCheck={false}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--co-surface-2)",
            color: "var(--co-text)",
            border: "1px solid",
            borderColor: textareaFocused
              ? "var(--co-phosphor)"
              : "var(--co-border)",
            borderRadius: 2,
            resize: "vertical",
            fontFamily: "var(--co-font-mono)",
            fontSize: 13,
            letterSpacing: "0.04em",
            lineHeight: 1.55,
            transition: "border-color 160ms ease",
            boxShadow: textareaFocused
              ? "0 0 0 1px color-mix(in srgb, var(--co-phosphor) 35%, transparent)"
              : "none",
          }}
        />
      </div>

      {/* === Submit button =========================================== */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-busy={isAnalyzing}
        aria-label={
          isAnalyzing
            ? "Analyzing schematic, please wait"
            : "Initiate schematic analysis"
        }
        className="co-mono relative"
        style={{
          width: "100%",
          padding: "16px 20px",
          background: canSubmit ? "var(--co-phosphor)" : "var(--co-surface-2)",
          color: canSubmit ? "var(--co-bg)" : "var(--co-muted)",
          border: "1px solid",
          borderColor: canSubmit
            ? "var(--co-phosphor)"
            : "var(--co-border-strong)",
          borderRadius: 0,
          fontSize: 13,
          letterSpacing: "0.25em",
          fontWeight: 700,
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition:
            "background 150ms ease, color 150ms ease, box-shadow 200ms ease",
          boxShadow: canSubmit
            ? "0 0 0 1px rgba(198,255,77,0.25), 0 0 24px rgba(198,255,77,0.18)"
            : "none",
          animation: isAnalyzing ? "co-submit-pulse 1.6s ease-in-out infinite" : "none",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!canSubmit) return;
          e.currentTarget.style.background =
            "color-mix(in srgb, var(--co-phosphor) 88%, white)";
        }}
        onMouseLeave={(e) => {
          if (!canSubmit) return;
          e.currentTarget.style.background = "var(--co-phosphor)";
        }}
      >
        <style>{`
          @keyframes co-submit-pulse {
            0%, 100% {
              box-shadow: 0 0 0 1px rgba(255,181,71,0.25), 0 0 18px rgba(255,181,71,0.18);
              background: var(--co-amber);
              color: var(--co-bg);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(255,181,71,0.55), 0 0 32px rgba(255,181,71,0.42);
              background: color-mix(in srgb, var(--co-amber) 88%, white);
              color: var(--co-bg);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            button[aria-busy="true"] {
              animation: none !important;
            }
          }
        `}</style>
        <span>
          {isAnalyzing ? "■ ANALYZING…" : "▸ INITIATE ANALYSIS"}
        </span>
      </button>

      {/* tiny footer signature */}
      <div
        className="flex items-center justify-between px-1"
        style={{ marginTop: -4 }}
      >
        <span
          className="co-mono"
          style={{ fontSize: 11, color: "var(--co-muted)" }}
        >
          CH·01 · 3-AGENT PARALLEL PIPELINE
        </span>
        <span
          className="co-mono"
          style={{ fontSize: 11, color: "var(--co-muted)" }}
        >
          v2 · MK.II
        </span>
      </div>
    </div>
  );
}
