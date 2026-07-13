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
import { resolvePassport, type Passport } from "@/components/package/passport-data";

type Phase = "loading" | "scanning" | "done" | "empty";
type Line = { text: string; tone: "muted" | "route" | "safe" };

function steps(p: Passport): Line[] {
  return [
    { text: `$ carto package ${p.repo}`, tone: "muted" },
    { text: `→ cloning @ ${p.commit}`, tone: "route" },
    { text: `→ parsing ${p.files.toLocaleString()} files`, tone: "route" },
    { text: `→ mapping ${p.edges.toLocaleString()} imports`, tone: "route" },
    { text: `→ detecting ${p.domainsCount} domains`, tone: "route" },
    { text: `→ computing blast radius`, tone: "route" },
    { text: `✓ boarding pass ready`, tone: "safe" },
  ];
}

export default function ResultPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [passport, setPassport] = useState<Passport | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get("repo");
    if (!repo) {
      setPhase("empty");
      return;
    }
    const p = resolvePassport(repo);
    setPassport(p);
    setPhase("scanning");

    const seq = steps(p);
    seq.forEach((s, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, s]);
        if (i === seq.length - 1) {
          const d = setTimeout(() => setPhase("done"), 500);
          timers.current.push(d);
        }
      }, 300 + i * 320);
      timers.current.push(t);
    });

    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative w-full px-4 py-6 md:px-6 md:py-8">
            {phase === "empty" && <Empty />}

            {phase === "scanning" && passport && <Scan lines={lines} repo={passport.repo} />}

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
