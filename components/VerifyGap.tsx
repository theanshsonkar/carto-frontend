import { Reveal } from "./ui/Reveal";
import { Card } from "./ui/Card";
import Link from "next/link";

/**
 * VerifyGap - the payoff for the hero's promise. Draws the CI trinity as three
 * seats: TESTS (behavior) and LINTERS (syntax) are covered/green; STRUCTURE -
 * what a change does to the shape of the system - is the empty red seat nothing
 * watches. The route-blue capstone shows Carto taking that third seat, graded
 * before the diff lands.
 */
export function VerifyGap() {
  return (
    <section id="verify-gap" className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ THE VERIFY GAP ]</span>
          <h2 className="mt-5 max-w-4xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            You have two safety nets.{" "}
            <span className="text-route">The one that matters isn&apos;t there.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink-2">
            Your agent can change 40 files before you read the first one. Two
            checks stand between it and <span className="text-ink">main</span> -
            and both of them are looking the wrong way.
          </p>
        </Reveal>

        {/* the three seats */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
          {SEATS.map((s, i) => (
            <Reveal key={s.tag} delay={i * 0.08}>
              <Card
                className={`group flex h-full flex-col ${s.empty ? "bg-signal-soft" : ""}`}
                lift={!s.empty}
              >
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[0.72rem] ${s.empty ? "text-signal" : "text-safe"}`}
                    >
                      {s.tag}
                    </span>
                    <span
                      aria-hidden
                      className={`h-1.5 w-6 origin-right transition-transform duration-200 group-hover:scale-x-150 ${s.empty ? "bg-signal" : "bg-safe"}`}
                    />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                    {s.question}
                  </h3>

                  {/* the verdict glyph - the emotional beat of each column */}
                  <div className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border font-mono text-lg ${
                        s.empty
                          ? "border-signal text-signal"
                          : "border-safe text-safe"
                      }`}
                    >
                      {s.empty ? "✕" : "✓"}
                    </span>
                    <span
                      className={`font-mono text-[0.72rem] uppercase tracking-[0.14em] ${s.empty ? "text-signal" : "text-safe"}`}
                    >
                      {s.verdict}
                    </span>
                  </div>

                  <p className="mt-5 text-[0.88rem] leading-relaxed text-ink-2">
                    {s.body}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* the capstone - Carto takes the third seat, proven on a real repo */}
        <Reveal delay={0.12}>
          <div className="mt-6 overflow-hidden border border-ink bg-route text-paper shadow-hard">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-paper/20 px-7 py-5">
              <p className="font-display text-lg font-medium leading-snug md:text-2xl">
                Carto takes the third seat.
              </p>
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-paper/70">
                the structural check
              </span>
            </div>

            {/* real readout - supabase ground truth */}
            <div className="border-b border-paper/20 px-7 pt-6">
              <div className="font-mono text-[0.72rem] text-paper/70">
                <span className="text-paper">$</span> carto package supabase/supabase
              </div>
              <div className="mt-1 font-mono text-[0.72rem] text-paper/60">
                6,795 files · 22,309 edges · 6 domains · packaged in 5.9s
              </div>
            </div>

            <div className="grid gap-px bg-paper/20 sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.label} className="bg-route px-7 py-6">
                  <div className="font-display text-4xl font-semibold leading-none text-paper">
                    {s.value}
                  </div>
                  <div className="mt-3 text-[0.86rem] leading-snug text-paper/90">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-paper/20 bg-route-strong px-7 py-4">
              <span className="font-mono text-[0.78rem] text-paper">
                <span className="text-paper">◆</span> your tests and linters
                catch <span className="font-semibold">none</span> of it
              </span>
              <span className="font-mono text-[0.72rem] font-semibold text-paper">
                graded in 84µs · HIGH-risk edits blocked before they reach disk
              </span>
            </div>
          </div>
        </Reveal>

        {/* the invitation - turn the reader into a doer */}
        <Reveal delay={0.16}>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 border border-ink bg-panel px-7 py-5 shadow-hard sm:flex-row sm:items-center">
            <span className="font-display text-lg font-medium text-ink">
              See the shape of a repo you know
              <span className="text-route"> →</span>
            </span>
            <div className="flex flex-wrap gap-2.5">
              {CHIPS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/r?repo=${encodeURIComponent(c.slug)}`}
                  className="group inline-flex items-center gap-2 border border-ink bg-panel px-3.5 py-2 font-mono text-[0.78rem] text-ink shadow-hard transition-[transform,box-shadow] duration-150 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-hard-lg"
                >
                  <span className="h-1.5 w-1.5 bg-route transition-transform duration-150 group-hover:scale-[1.8]" aria-hidden />
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const SEATS: {
  tag: string;
  question: string;
  verdict: string;
  body: string;
  empty?: boolean;
}[] = [
  {
    tag: "tests",
    question: "Did behavior break?",
    verdict: "covered",
    body: "Runtime, assertions, coverage. They tell you a function returned the wrong value, after you already wrote it.",
  },
  {
    tag: "linters",
    question: "Did syntax break?",
    verdict: "covered",
    body: "Types, style, formatting. They tell you a line is malformed, one file at a time, never the whole graph.",
  },
  {
    tag: "structure",
    question: "What did it do to the shape?",
    verdict: "blind spot",
    body: "Nothing in your pipeline sees that an edit crossed a domain boundary, coupled two systems, or put 88 files one change away from breaking.",
    empty: true,
  },
];

const STATS: { value: string; label: string }[] = [
  {
    value: "88",
    label: "files break from touching one file, the worst change in the repo",
  },
  {
    value: "537",
    label: "edges cross a domain boundary they shouldn't",
  },
  {
    value: "310",
    label: "AUTH reaches into CORE, the tightest coupling in the graph",
  },
];

const CHIPS: { slug: string; label: string }[] = [
  { slug: "supabase/supabase", label: "supabase" },
  { slug: "vercel/next.js", label: "next.js" },
  { slug: "facebook/react", label: "react" },
];
