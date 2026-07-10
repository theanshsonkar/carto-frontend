import { Reveal } from "./ui/Reveal";
import { Card } from "./ui/Card";

/**
 * Problem - "the re-indexing tax". Index vs container framing, straight from
 * the README's "an index is not a container" argument.
 */
export function Problem() {
  return (
    <section className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ THE RE-INDEXING TAX ]</span>
          <p className="mt-5 max-w-4xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            Every AI tool re-reads your entire codebase from scratch, every
            session.{" "}
            <span className="text-route">And forgets it all by the next one.</span>
          </p>
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink-2">
            Cursor builds its own index. Copilot builds its own. Claude Code
            builds its own. Same parsing, every tool, every time - and none of
            them remember what they learned yesterday. An index is a snapshot
            of right now, thrown away at the end of the session. A container is
            portable, versioned, and remembers.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-6 md:grid-cols-2 md:items-stretch">
            {/* the loser — any tool's index, visually muted */}
            <Card className="h-full opacity-90" lift={false}>
              <div className="flex items-center justify-between border-b border-line px-7 py-4">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">
                  Any tool&apos;s index
                </span>
                <span className="font-mono text-[0.7rem] text-signal">stateless · thrown away</span>
              </div>
              <ul className="space-y-3 p-7">
                {[
                  "Rebuilt from zero every session",
                  "Lives inside one tool, walled off",
                  "Knows what's there, not what breaks",
                  "Forgets every decision instantly",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-ink-3">
                    <span className="mt-0.5 shrink-0 font-mono text-signal" aria-hidden>✕</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Card>

            {/* the winner — the Carto container, made to dominate on sight */}
            <div className="relative">
              <span className="absolute -top-3 left-7 z-10 border border-ink bg-route px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper">
                What Carto does instead
              </span>
              <Card className="h-full">
                <div className="h-1.5 w-full bg-route" aria-hidden />
                <div className="flex items-center justify-between border-b border-line bg-route-soft px-7 py-4">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-route-ink">
                    The Carto container
                  </span>
                  <span className="font-mono text-[0.7rem] text-safe">portable · versioned</span>
                </div>
                <ul className="space-y-3 p-7">
                  {[
                    "Built once, read by every tool in seconds",
                    "Portable open format, no re-index",
                    "Blast radius: knows what breaks before you edit",
                    "Remembers decisions, drift & history across sessions",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-ink">
                      <span className="mt-0.5 shrink-0 font-mono text-route" aria-hidden>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </Reveal>

        {/* capstone — the line that lands the moment you scroll here */}
        <Reveal delay={0.15}>
          <div className="mt-6 border border-ink bg-ink px-7 py-6 text-paper shadow-hard">
            <p className="font-display text-lg font-medium leading-snug md:text-2xl">
              One container replaces every tool&apos;s private index.{" "}
              <span className="text-night-route">
                Then it carries what no index can:
              </span>{" "}
              blast radius, predictive risk, cross-domain guardrails, and full
              history.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
