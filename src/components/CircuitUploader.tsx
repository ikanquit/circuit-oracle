"use client";

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import ExampleBadge from "./ExampleBadge";

interface CircuitUploaderProps {
  onFile: (file: File) => void;
  onQuestion: (q: string) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
  question: string;
  selectedFile: File | null;
  onClear: () => void;
}

export default function CircuitUploader({
  onFile,
  onQuestion,
  onSubmit,
  isAnalyzing,
  question,
  selectedFile,
  onClear,
}: CircuitUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFile(file);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear();
  };

  const canSubmit = selectedFile && !isAnalyzing;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        className="relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden"
        style={{
          borderColor: dragging ? "var(--accent)" : previewUrl ? "var(--border)" : "var(--border)",
          backgroundColor: dragging
            ? "color-mix(in srgb, var(--accent) 8%, var(--surface2))"
            : "var(--surface2)",
          minHeight: previewUrl ? "auto" : "220px",
        }}
        onClick={() => !previewUrl && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Circuit schematic preview"
              className="w-full object-contain rounded-xl"
              style={{ maxHeight: "320px" }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                backgroundColor: "color-mix(in srgb, var(--error) 80%, black)",
                color: "#fff",
              }}
              title="Remove image"
            >
              ✕
            </button>
            <div
              className="absolute bottom-0 left-0 right-0 px-3 py-2 text-[13px] font-mono"
              style={{
                backgroundColor: "color-mix(in srgb, black 70%, transparent)",
                color: "var(--muted)",
              }}
            >
              {selectedFile?.name} &nbsp;·&nbsp;{" "}
              {selectedFile ? (selectedFile.size / 1024).toFixed(0) + " KB" : ""}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6 gap-3 select-none">
            <div className="text-4xl opacity-60">🖼</div>
            <div className="text-center">
              <p className="font-medium text-base" style={{ color: "var(--text)" }}>
                Drop your schematic here
              </p>
              <p className="text-[13px] mt-1" style={{ color: "var(--muted)" }}>
                or click to browse — PNG, JPG, GIF, WebP up to 10MB
              </p>
            </div>
            <ExampleBadge />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Question input */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-[13px] font-medium"
          style={{ color: "var(--muted)" }}
          htmlFor="question-input"
        >
          Specific question{" "}
          <span className="opacity-50">(optional)</span>
        </label>
        <input
          id="question-input"
          type="text"
          value={question}
          onChange={(e) => onQuestion(e.target.value)}
          placeholder="e.g. What is the voltage gain? Is this thermally stable?"
          maxLength={500}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--surface2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "var(--accent)";
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "var(--border)";
          }}
        />
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: canSubmit ? "var(--accent)" : "var(--surface2)",
          color: canSubmit ? "#fff" : "var(--muted)",
          border: "1px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!canSubmit) return;
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-hover)";
        }}
        onMouseLeave={(e) => {
          if (!canSubmit) return;
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent)";
        }}
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
            Analyzing…
          </span>
        ) : (
          "Analyze Circuit →"
        )}
      </button>
    </div>
  );
}
