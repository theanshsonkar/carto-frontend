import type { ReactNode } from "react";

/**
 * Card - the manifest-card chrome from the hero, made reusable: a solid ink
 * border with a hard offset drop-shadow. Works on light (`panel`) or dark
 * (`night`) surfaces; the shadow stays ink so it reads the same on the paper
 * background.
 */
export function Card({
  children,
  tone = "light",
  className = "",
  lift = true,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  lift?: boolean;
}) {
  const surface =
    tone === "dark" ? "bg-night text-night-text" : "bg-panel text-ink";
  const hover = lift
    ? "transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg"
    : "";
  return (
    <div
      className={`relative border border-ink ${surface} shadow-hard ${hover} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - the identity bar: a status dot + monospace title on the left,
 * an optional label on the right, over a hairline rule.
 */
export function CardHeader({
  title,
  label,
  tone = "light",
  dot = "safe",
}: {
  title: string;
  label?: string;
  tone?: "light" | "dark";
  dot?: "safe" | "route" | "signal";
}) {
  const line = tone === "dark" ? "border-night-line" : "border-line";
  const titleColor = tone === "dark" ? "text-night-muted" : "text-ink-2";
  const labelColor = tone === "dark" ? "text-night-muted" : "text-ink-3";
  const dotColor =
    dot === "signal" ? "bg-signal" : dot === "route" ? "bg-route" : "bg-safe";
  return (
    <div className={`flex items-center justify-between border-b ${line} px-4 py-3`}>
      <div className={`flex items-center gap-2 font-mono text-[0.72rem] ${titleColor}`}>
        <span className={`h-2 w-2 rounded-full ${dotColor} softpulse`} aria-hidden />
        {title}
      </div>
      {label ? (
        <span className={`font-mono text-[0.68rem] ${labelColor}`}>{label}</span>
      ) : null}
    </div>
  );
}
