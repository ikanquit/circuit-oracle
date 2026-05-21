"use client";

interface ExampleBadgeProps {
  onClick?: () => void;
}

export default function ExampleBadge({ onClick }: ExampleBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[13px] px-3.5 py-2 rounded-full transition-colors cursor-pointer"
      style={{
        backgroundColor: "var(--surface2)",
        color: "var(--muted)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
      }}
    >
      <span>⚡</span>
      <span>Try an example →</span>
    </button>
  );
}
