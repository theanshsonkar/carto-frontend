"use client";

import { useEffect, useRef, useState } from "react";
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
  const [phase, setPhase] = useState<Phase>("loading");
  const [passport, setPassport] = useState<Passport | null>(null);
  const [repo, setRepo] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get("repo");
    if (!repo) {
      setPhase("empty");
      return;
    }
    setRepo(repo);
    setPhase("scanning");
    let cancelled = false;

    // Animate the intermediate parse lines while the real backend works.
    const seq = steps(repo);
    seq.forEach((s, i) => {
      const t = setTimeout(() => {
        if (!cancelled) setLines((prev) => [...prev, s]);
      }, 300 + i * 320);
      timers.current.push(t);
    });

    // Fetch the REAL cached passport (polls a first-time parse, falls back to
    // the generator on error/timeout so the page always resolves).
    resolvePassportAsync(repo, {
      onRunning: () => {
        if (cancelled) return;
        setLines((prev) =>
          prev.some((l) => l.text.includes("first parse"))
            ? prev
            : [...prev, { text: "→ first parse of this repo — hang tight (~1 min)…", tone: "muted" }]
        );
      },
    }).then(({ passport }) => {
      if (cancelled) return;
      setPassport(passport);
      setLines((prev) => [...prev, { text: `✓ boarding pass ready`, tone: "safe" }]);
      const d = setTimeout(() => {
        if (!cancelled) setPhase("done");
      }, 600);
      timers.current.push(d);
    });

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative w-full px-4 py-6 md:px-6 md:py-8">
            {phase === "empty" && <Empty />}

            {phase === "scanning" && <Scan lines={lines} repo={passport?.repo ?? repo} />}

            {phase === "done" && passport && (
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Scan({ lines, repo }: { lines: Line[]; repo: string }) {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-center font-mono text-[0.8rem] uppercase tracking-[0.16em] text-ink-3">
        packaging {repo}…
      </p>
      <div className="relative mt-6 overflow-hidden border border-ink bg-night text-night-text shadow-hard">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16 scan"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(122,162,247,0.12), transparent)" }}
        />
        <pre className="relative min-h-[168px] px-4 py-4 font-mono text-[0.78rem] leading-relaxed">
          {lines.map((l, i) => (
            <div
              key={i}
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
