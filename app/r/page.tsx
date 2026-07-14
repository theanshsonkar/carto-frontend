"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Wrapped } from "@/components/package/Wrapped";
import { BoardingPass } from "@/components/package/BoardingPass";
import { AiBrief } from "@/components/package/AiBrief";
import { PassportFaq } from "@/components/package/PassportFaq";
import { PassportStage } from "@/components/package/PassportStage";
import { resolvePassportAsync, type Passport } from "@/components/package/passport-data";

type Phase = "loading" | "scanning" | "done" | "empty";
type Line = { text: string; tone: "muted" | "route" | "safe" };

function steps(repo: string): Line[] {
  return [
    { text: `$ carto package ${repo}`, tone: "muted" },
    { text: `→ cloning repository`, tone: "route" },
    { text: `→ parsing files`, tone: "route" },
    { text: `→ mapping imports`, tone: "route" },
    { text: `→ detecting domains`, tone: "route" },
    { text: `→ computing blast radius`, tone: "route" },
  ];
}

export default function ResultPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative w-full px-4 py-6 md:px-6 md:py-8">
            {/* useSearchParams needs a Suspense boundary under static export. */}
            <Suspense fallback={null}>
              <RepoResult />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/**
 * Reads the (reactive) ?repo param and keys the scanner by it. The `key` is the
 * fix for stale results: when you scan a second repo, the query string changes,
 * so Scanner fully REMOUNTS with fresh state and re-runs its scan — instead of
 * the App Router reusing the old instance (which showed the previous repo's
 * boarding pass instantly).
 */
function RepoResult() {
  const repo = useSearchParams().get("repo") ?? "";
  return <Scanner key={repo} repoParam={repo} />;
}

function Scanner({ repoParam }: { repoParam: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [passport, setPassport] = useState<Passport | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!repoParam) {
      setPhase("empty");
      return;
    }
    setPhase("scanning");
    setLines([]);
    setElapsed(0);

    let cancelled = false;
    let resolved = false;
    const start = Date.now();
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const at = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(t);
    };

    // A 1-second elapsed clock — visible proof the scan is alive even while the
    // real backend is mid-parse and no new log line has arrived yet.
    const clock = setInterval(() => {
      if (!cancelled) setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    // Streamed intro steps.
    const seq = steps(repoParam);
    seq.forEach((s, i) => at(() => setLines((prev) => [...prev, s]), 250 + i * 260));

    // Rolling activity lines so the console never sits frozen during a long
    // first-time parse. These are the real phases the engine runs; we cycle
    // through them until the backend resolves.
    const activity: Line[] = [
      { text: "→ resolving module graph", tone: "route" },
      { text: "→ walking transitive imports", tone: "route" },
      { text: "→ clustering domains", tone: "route" },
      { text: "→ scoring predictive risk", tone: "route" },
      { text: "→ building blast-radius bitmap", tone: "route" },
      { text: "→ first parse of a large repo can take up to ~90s — hang tight", tone: "muted" },
    ];
    const rollFrom = (i: number) => {
      if (cancelled || resolved) return;
      setLines((prev) => [...prev, activity[i % activity.length]]);
      at(() => rollFrom(i + 1), 2600);
    };
    at(() => rollFrom(0), 250 + seq.length * 260 + 500);

    // Fetch the REAL cached passport (polls a first-time parse, falls back to
    // the generator on error/timeout so the page always resolves).
    resolvePassportAsync(repoParam).then(({ passport }) => {
      if (cancelled) return;
      resolved = true;
      setPassport(passport);
      setLines((prev) => [...prev, { text: `✓ boarding pass ready`, tone: "safe" }]);
      at(() => setPhase("done"), 600);
    });

    return () => {
      cancelled = true;
      clearInterval(clock);
      timeouts.forEach(clearTimeout);
    };
  }, [repoParam]);

  if (phase === "empty") return <Empty />;

  if (phase === "done" && passport) {
    return (
      <PassportStage className="space-y-8">
        <div data-reveal>
          <BoardingPass p={passport} />
        </div>
        <div data-reveal>
          <Wrapped p={passport} />
        </div>
        <div data-reveal>
          <AiBrief p={passport} />
        </div>
        <div data-reveal>
          <PassportFaq p={passport} />
        </div>
      </PassportStage>
    );
  }

  // "loading" (first paint before the effect runs) and "scanning" both show the
  // console; repoParam is always known here so it renders immediately.
  return <Scan lines={lines} elapsed={elapsed} repo={passport?.repo ?? repoParam} />;
}

function Scan({ lines, elapsed, repo }: { lines: Line[]; elapsed: number; repo: string }) {
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  // Keep the console a fixed height: show the most recent lines only.
  const visible = lines.slice(-12);
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-mono text-[0.8rem] uppercase tracking-[0.16em] text-ink-3">
        packaging {repo}… <span className="tabular-nums text-ink-2">{mm}:{ss}</span>
      </p>
      <div className="relative mt-6 overflow-hidden border border-ink bg-night text-night-text shadow-hard">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16 scan"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(122,162,247,0.12), transparent)" }}
        />
        <pre data-testid="scan-console" className="relative min-h-[168px] px-4 py-4 font-mono text-[0.78rem] leading-relaxed">
          {visible.map((l, i) => (
            <div
              key={`${lines.length - visible.length + i}`}
              className={`fadein ${l.tone === "route" ? "text-night-route" : l.tone === "safe" ? "text-night-safe" : "text-night-muted"}`}
            >
              {l.text}
            </div>
          ))}
          <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-night-text" aria-hidden />
        </pre>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-2xl font-semibold text-ink">No repo to package</p>
      <p className="mt-3 text-ink-2">Head back and paste a public GitHub repo.</p>
      <Link href="/package" className="btn-primary mt-6 inline-flex">
        Package a repo →
      </Link>
    </div>
  );
}
