import Link from "next/link";
import { ContainerMark } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <ContainerMark />
            <span className="font-display text-lg font-semibold tracking-tight">Carto</span>
          </div>
          <p className="mt-4 max-w-xs text-[0.86rem] leading-relaxed text-ink-2">
            The portable AI container for your codebase. Package a repo once -
            every AI tool understands it, and knows what breaks before it
            changes anything.
          </p>
          <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3">
            MIT · One SQLite file · No cloud
          </p>
        </div>

        {[
          ["Product", [["Container", "#container"], ["Blast radius", "#blast"], ["Portable", "#portable"], ["Speed", "#speed"]]],
          ["Resources", [["Docs", "https://github.com/theanshsonkar/carto/tree/main/docs"], ["Quickstart", "https://github.com/theanshsonkar/carto/blob/main/docs/quickstart.md"], ["ANCI spec", "https://github.com/theanshsonkar/carto/blob/main/docs/anci/v0.1-DRAFT.md"], ["Changelog", "https://github.com/theanshsonkar/carto/blob/main/CHANGELOG.md"]]],
          ["Project", [["GitHub", "https://github.com/theanshsonkar/carto"], ["npm", "https://www.npmjs.com/package/carto-md"], ["License", "https://github.com/theanshsonkar/carto/blob/main/LICENSE"], ["Emfirge", "https://www.emfirge.cloud"]]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <h4 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">
              {title as string}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {(links as string[][]).map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.86rem] text-ink-2 transition-colors hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="font-mono text-[0.72rem] text-ink-3">
            © {new Date().getFullYear()} Carto · Built by Ansh Sonkar
          </p>
          <p className="font-mono text-[0.72rem] text-ink-3">
            Your code changes. Carto knows. Every AI you use knows - and remembers.
          </p>
        </div>
      </div>
    </footer>
  );
}
