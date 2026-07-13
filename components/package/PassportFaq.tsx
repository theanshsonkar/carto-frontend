"use client";

import { useState } from "react";
import { baseName, type Passport } from "./passport-data";

/**
 * PassportFaq — the "answered like a builder would ask" section under the
 * nerd stats. Two jobs: disarm the skeptic ("is this made up?") and teach the
 * newcomer ("what even is a blast radius?"). A few answers interpolate the
 * live passport so it reads specific to the repo on screen. Brand accordion —
 * square corners, hard shadow, mono question labels — same family as nerd stats.
 */

type QA = { q: string; a: (p: Passport) => string };

const FAQ: QA[] = [
  {
    q: "Are these numbers real, or made up?",
    a: (p) =>
      `Real. Every stat is measured from ${p.repo}'s actual import graph: ${p.files.toLocaleString()} files, ${p.domainsCount} domains, ${p.crossDomain} cross-domain imports, and blast radius. Carto counts what's actually there. The grade is the arithmetic in the receipt above. No vibes.`,
  },
  {
    q: "How do you know all this without running my code?",
    a: (p) =>
      `Carto reads the source with tree-sitter (the same kind of parser your editor uses) and builds a map of what imports what. All ${p.files.toLocaleString()} files were parsed, never executed. Everything else is derived from that graph.`,
  },
  {
    q: "What's a “blast radius”?",
    a: (p) =>
      `The number of files that would break if you changed one file, followed transitively through the import graph. Not "files that mention this" (that's search): "files that depend on this." Here the worst is ${baseName(
        p.blast.file
      )}: touch it and ${p.blast.count} files are in the blast radius.`,
  },
  {
    q: "What's a “domain”?",
    a: (p) => {
      const top = [...p.domains].sort((x, y) => y.files - x.files)[0];
      return `A cluster of files that belong together: AUTH, PAYMENTS, DATABASE, and so on. Carto groups them from the import structure, no config. Here the biggest is ${top.name} with ${top.files.toLocaleString()} files.`;
    },
  },
  {
    q: "Why do “cross-domain imports” matter?",
    a: (p) =>
      `Each one is a place where one area reaches into another. A few is normal; ${p.crossDomain} means the boundaries are leaky: change one domain and you risk breaking another. The biggest here is ${p.topCoupling.from} → ${p.topCoupling.to} (${p.topCoupling.count}×).`,
  },
  {
    q: "How is the grade calculated?",
    a: () =>
      `Open “nerd stats” above. Every ± point traces to a real signal: domain balance, boundary leaks, blast containment, routes, and models. Repos without routes or models aren't penalized; those lines just show N/A. Health = base + the sum of those lines.`,
  },
  {
    q: "Is my code sent anywhere?",
    a: () =>
      `No. Carto is local-only: one SQLite file on your disk, no telemetry, no cloud. .env and credential files are ignored by default, and it never writes secrets into the container.`,
  },
  {
    q: "Can I get this for my own repo?",
    a: () =>
      `Yes. Install once with npm i -g carto-md, then run carto init in your project. It builds the container and wires into your AI tool automatically. Your assistant then knows your architecture without re-reading it every session.`,
  },
];

export function PassportFaq({ p }: { p: Passport }) {
  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-route" aria-hidden />
        <span className="font-mono text-[0.76rem] uppercase tracking-[0.18em] text-ink-2">
          questions · answers
        </span>
      </div>

      <div className="border border-ink bg-panel shadow-hard">
        {FAQ.map((item, i) => (
          <FaqRow key={item.q} item={item} p={p} first={i === 0} />
        ))}
      </div>
    </div>
  );
}

function FaqRow({ item, p, first }: { item: QA; p: Passport; first: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={first ? "" : "border-t border-line"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-panel-2"
      >
        <span className="font-mono text-[0.86rem] font-medium text-ink">{item.q}</span>
        <span className="shrink-0 font-mono text-ink-3" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 pr-10 text-[0.92rem] leading-relaxed text-ink-2">{item.a(p)}</div>
      )}
    </div>
  );
}
