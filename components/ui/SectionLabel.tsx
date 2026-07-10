/**
 * SectionLabel - the thin monospace spec header that sits above each section,
 * echoing the current site's numbered-section rhythm.
 */
export function SectionLabel({
  name,
  index,
  total,
}: {
  name: string;
  index: number;
  total: number;
}) {
  return (
    <div className="border-b border-line bg-panel">
      <div className="shell flex items-center justify-between py-3">
        <span className="eyebrow flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-route" aria-hidden />
          {name}
        </span>
        <span className="font-mono text-[0.7rem] text-ink-3">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
