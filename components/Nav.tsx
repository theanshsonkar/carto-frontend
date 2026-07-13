"use client";

import { useState } from "react";
import Link from "next/link";
import { ContainerMark } from "@/components/ui/Logo";

const LINKS: [string, string][] = [
  ["Verify gap", "#verify-gap"],
  ["Blast radius", "#blast"],
  ["Portable", "#portable"],
  ["Boarding pass", "/package"],
];

const REPO = "https://github.com/theanshsonkar/carto";

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <ContainerMark />
          <span className="font-display text-lg font-semibold tracking-tight">
            Carto
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[0.8rem] text-ink-2 transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* GitHub stars pill — desktop only */}
          <a
            href={REPO}
            aria-label="Star Carto on GitHub"
            className="hidden h-9 items-center gap-2 border border-line px-3 font-mono text-[0.78rem] text-ink-2 transition-colors hover:border-ink hover:text-ink sm:inline-flex"
          >
            <GitHubMark />
            <span aria-hidden className="text-ink-3">★</span>
            63
          </a>

          {/* mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-9 w-9 place-items-center border border-line text-ink transition-colors hover:border-ink md:hidden"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-200 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-[1.5px] w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-200 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile dropdown panel */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-line bg-paper/95 backdrop-blur-md md:hidden ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        } transition-[max-height] duration-300 ease-out`}
      >
        <div className="shell flex flex-col py-2">
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="border-b border-line/70 py-3 font-mono text-[0.9rem] text-ink-2 transition-colors last:border-0 hover:text-ink"
            >
              {label}
            </a>
          ))}
          <a
            href={REPO}
            onClick={() => setOpen(false)}
            className="mt-3 mb-2 inline-flex h-11 items-center justify-center gap-2 border border-ink font-mono text-[0.82rem] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <GitHubMark />
            Star on GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
