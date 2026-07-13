"use client";

import { useState } from "react";
import { buildAiBrief, type Passport } from "./passport-data";

/**
 * AiBrief — the hand-off. Left: what the brief is + the 3-step setup. Right: a
 * document-style card previewing the .md file with a download button. The file
 * is generated client-side from the passport (buildAiBrief) — no backend. The
 * user downloads it and hands it to their AI, which then walks them through
 * installing Carto on any repo. Blueprint aesthetic, square corners, hard shadow.
 */
export function AiBrief({ p }: { p: Passport }) {
  const [copied, setCopied] = useState(false);
  const filename = `carto-brief-${p.repo.replace("/", "-")}.md`;
  const brief = buildAiBrief(p);
  // first lines, for the little document preview
  const preview = brief.split("\n").slice(0, 9).join("\n");

  function download() {
    const blob = new Blob([brief], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copy() {
    navigator.clipboard?.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-safe" aria-hidden />
        <span className="font-mono text-[0.76rem] uppercase tracking-[0.18em] text-ink-2">
          hand-off · brief your AI
        </span>
      </div>

      <div className="grid border border-ink shadow-hard-lg md:grid-cols-2">
        {/* ---- left: the pitch + steps ---- */}
        <div className="flex min-w-0 flex-col justify-between gap-6 bg-panel p-6 md:p-8">
          <div>
            <h3 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
              Give this boarding pass to your AI.
            </h3>
            <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-ink-2">
              Download the brief and drop it into Claude, Cursor, Copilot, or Kiro. It carries this
              repo&apos;s real findings and teaches your AI what Carto is, then it walks you through
              packaging <span className="text-ink">any</span> repo into a container it can query.
            </p>
          </div>

          <ol className="space-y-3">
            {[
              ["Download the brief", "One .md file: the findings above, plus setup instructions for your AI."],
              ["Hand it to your AI", "Paste or attach it. Your assistant reads it and asks which repo to package."],
              ["It sets up Carto", "npm i -g carto-md → carto init. Your AI then queries the container directly."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-ink bg-route font-mono text-[0.76rem] font-semibold text-paper shadow-hard">
                  {i + 1}
                </span>
                <div>
                  <div className="font-mono text-[0.82rem] font-medium text-ink">{t}</div>
                  <div className="mt-0.5 text-[0.9rem] leading-snug text-ink-3">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- right: the document card ---- */}
        <div className="flex min-w-0 flex-col border-t border-ink bg-panel-2 p-6 md:border-l md:border-t-0 md:p-8">
          {/* file window */}
          <div className="flex flex-1 flex-col overflow-hidden border border-ink bg-paper shadow-hard">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-ink bg-route px-3 py-2 text-paper">
              <span aria-hidden className="h-2 w-2 rounded-full bg-paper/70" />
              <span aria-hidden className="h-2 w-2 rounded-full bg-paper/40" />
              <span aria-hidden className="h-2 w-2 rounded-full bg-paper/40" />
              <span className="ml-2 truncate font-mono text-[0.72rem] tracking-wide">{filename}</span>
              <span className="ml-auto border border-paper/40 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em]">
                md
              </span>
            </div>
            {/* preview */}
            <div className="relative min-h-[168px] flex-1">
              <pre className="overflow-hidden px-4 py-3 font-mono text-[0.7rem] leading-relaxed text-ink-2">
                {preview}
              </pre>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                style={{ background: "linear-gradient(to bottom, transparent, var(--color-paper, #f4f1e9))" }}
              />
            </div>
          </div>

          {/* actions */}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={download}
              className="flex flex-1 items-center justify-center gap-2 border border-ink bg-route px-4 py-3 font-mono text-[0.8rem] font-semibold text-paper shadow-hard transition-colors hover:bg-route-strong"
            >
              ⭳ Download brief
            </button>
            <button
              type="button"
              onClick={copy}
              className="flex items-center justify-center border border-ink bg-panel px-4 py-3 font-mono text-[0.8rem] text-ink shadow-hard transition-colors hover:bg-panel-2"
            >
              {copied ? "copied ✓" : "Copy"}
            </button>
          </div>
          <p className="mt-3 font-mono text-[0.68rem] leading-snug text-ink-3">
            Generated locally from this boarding pass. Your code never leaves your machine.
          </p>
        </div>
      </div>
    </div>
  );
}
