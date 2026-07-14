"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeRepo } from "@/components/package/passport-data";

/**
 * Hero - the pitch on the left, the container "manifest" card on the right.
 * The card is styled as the packaged .carto artifact: an identity header
 * (commit + digest), the layers it carries, and a blast-radius readout - the
 * payoff a visitor is about to get for their own repo.
 */
export function Hero() {
  const [copied, setCopied] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoErr, setRepoErr] = useState<string | null>(null);

  function copyInstall() {
    navigator.clipboard?.writeText("npm i -g carto-md").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  // "Get your pass" — reuse the same normalize + hard-navigate contract as the
  // /package console, so the /r URL gets the correct per-repo OG meta.
  function getPass(raw: string) {
    const repo = normalizeRepo(raw);
    if (!repo) {
      setRepoErr("Enter a GitHub URL or owner/repo, e.g. vercel/next.js");
      return;
    }
    window.location.assign(`/r?repo=${encodeURIComponent(repo)}`);
  }

  return (
    <section id="container" className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[620px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-route-soft), transparent)" }}
      />

      <div className="shell relative grid gap-14 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-28">
        {/* ---- left: the pitch ---- */}
        <div className="rise min-w-0">
          <span className="inline-flex max-w-full items-center gap-2.5 border border-line bg-panel px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.02em] text-ink-2">
            <span className="h-1.5 w-1.5 shrink-0 bg-route softpulse" aria-hidden />
            AI writes faster than you can verify
          </span>

          <h1 className="mt-8 max-w-2xl font-display font-medium text-ink [font-size:var(--text-display)] [letter-spacing:var(--text-display--letter-spacing)] [line-height:var(--text-display--line-height)]">
            Package a repo once.
            <br />
            <span className="text-route">Every AI knows what breaks.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            Your agent can change 40 files before you understand the first
            one. Tests catch broken behavior. Linters catch broken syntax.
            Neither sees what it did to the{" "}
            <span className="text-ink">shape of your system.</span> Carto packs
            that into one portable container, so any AI tool knows{" "}
            <span className="text-ink">what breaks before the diff lands.</span>
          </p>

          {/* primary CTA — get your pass (interactive scan, no install) */}
          <form
            className="mt-9 max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              getPass(repoUrl);
            }}
          >
            <div className="flex h-12 items-stretch border border-ink bg-panel shadow-hard transition-shadow focus-within:shadow-hard-lg">
              <span aria-hidden className="flex items-center border-r border-line px-3 font-mono text-[0.76rem] text-ink-3">
                github.com/
              </span>
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="vercel/next.js"
                aria-label="Public GitHub repository"
                className="min-w-0 flex-1 bg-transparent px-3 font-mono text-[0.85rem] text-ink outline-none placeholder:text-ink-3"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center whitespace-nowrap bg-route px-4 font-mono text-[0.82rem] font-medium text-paper transition-colors hover:bg-route-strong"
              >
                Get your pass →
              </button>
            </div>
            {repoErr ? (
              <p className="mt-2 font-mono text-[0.72rem] text-signal">{repoErr}</p>
            ) : (
              <p className="mt-2 font-mono text-[0.72rem] text-ink-3">
                free · no install · any public repo → a shareable boarding pass
              </p>
            )}
          </form>

          {/* secondary CTA — install the CLI */}
          <p className="mt-7 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3">
            or bring it to your editor
          </p>
          <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div
              id="install"
              className="flex h-12 max-w-full items-stretch border border-route bg-route font-mono text-[0.82rem] text-paper sm:text-[0.9rem]"
            >
              <span aria-hidden className="flex items-center border-r border-paper/25 px-3 text-paper/70 sm:px-3.5">$</span>
              <span className="flex items-center overflow-x-auto whitespace-nowrap px-3 sm:px-4">npm i -g carto-md</span>
              <button
                type="button"
                onClick={copyInstall}
                aria-label="Copy install command"
                className="flex shrink-0 items-center border-l border-paper/25 px-3 text-paper/85 transition-colors hover:bg-route-strong hover:text-paper sm:px-4"
              >
                {copied ? "copied ✓" : "copy"}
              </button>
            </div>
            <a
              href="https://github.com/theanshsonkar/carto"
              className="btn-secondary"
            >
              View on GitHub
            </a>
          </div>

          <p className="mt-3 font-mono text-[0.72rem] text-ink-3">
            then <span className="text-ink">cd your-repo &amp;&amp; carto init</span> packages it
          </p>

          <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">
            Free · MIT · One SQLite file · No cloud · No telemetry
          </p>
        </div>

        {/* ---- right: the container manifest card ---- */}
        <div className="rise min-w-0" style={{ animationDelay: "0.12s" }}>
          <ManifestCard />
        </div>
      </div>
    </section>
  );
}

function ManifestCard() {
  const [count, setCount] = useState(0);
  const footRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = footRef.current;
    if (!el) return;
    const TARGET = 88;
    const DURATION = 900;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !ran.current) {
            ran.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / DURATION);
              // easeOutCubic for a snappy settle
              const eased = 1 - Math.pow(1 - t, 3);
              setCount(Math.round(eased * TARGET));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-route-soft), transparent)" }}
      />
      <div className="group/card relative overflow-hidden border border-ink bg-panel shadow-hard transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg">
        {/* header - container identity */}
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 font-mono text-[0.72rem] text-ink-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-safe softpulse" aria-hidden />
            <span className="truncate">.carto / container</span>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.68rem] text-safe">
            <span aria-hidden>✓</span> digest verified
          </span>
        </div>

        {/* identity rows */}
        <dl className="grid grid-cols-2 gap-px border-b border-line bg-line">
          {[
            ["source", "supabase@a3f9c1"],
            ["files", "6,358"],
            ["digest", "sha256:9e4b…c07"],
            ["anci", "v0.1 · reproducible"],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0 bg-panel px-4 py-2.5">
              <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-3">{k}</dt>
              <dd className="mt-0.5 truncate font-mono text-[0.8rem] text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        {/* layers it carries - stagger in, highlight on hover */}
        <div className="space-y-px bg-line">
          {LAYERS.map(([name, desc], i) => (
            <div
              key={name}
              className="group/row flex items-center gap-3 bg-panel px-4 py-2.5 rise transition-colors duration-150 hover:bg-panel-2"
              style={{ animationDelay: `${0.35 + i * 0.08}s` }}
            >
              <span className="shrink-0 font-mono text-[0.62rem] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span className="w-20 shrink-0 font-display text-sm font-semibold text-ink sm:w-24">{name}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[0.72rem] text-ink-2">{desc}</span>
              <span
                className="h-1.5 w-1.5 bg-route transition-transform duration-150 group-hover/row:scale-[2.2]"
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* blast readout footer - counts up when it scrolls into view */}
        <div ref={footRef} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line bg-signal-soft px-4 py-3">
          <span className="font-mono text-[0.72rem] text-ink">
            <span className="text-signal">◆</span> change <span className="font-semibold">session.ts</span>
          </span>
          <span className="font-mono text-[0.72rem] font-semibold text-signal">
            {count} files break · P {(count / 100).toFixed(2)} · 2.7µs
          </span>
        </div>
      </div>
    </div>
  );
}

const LAYERS: [string, string][] = [
  ["Structural", "imports · routes · models · domains"],
  ["Episodic", "every decision & validated diff"],
  ["Temporal", "snapshots · churn · drift"],
  ["Semantic", "invariants & conventions"],
  ["Procedural", "patterns mined from git"],
];
