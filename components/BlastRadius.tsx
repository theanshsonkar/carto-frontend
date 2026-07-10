import { Reveal } from "./ui/Reveal";

/**
 * BlastRadius - the signature capability, staged as a full-bleed dark anchor.
 * "Search finds files that mention something. Blast radius finds files that
 * break." A ring visual + the microsecond numbers.
 */
export function BlastRadius() {
  return (
    <section id="blast" className="relative overflow-hidden border-b border-line bg-night text-night-text">
      <div aria-hidden className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-route), transparent)" }}
      />

      <div className="shell relative grid gap-14 py-20 md:grid-cols-[1fr_0.9fr] md:items-center md:py-28">
        <Reveal>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-night-muted">
            [ THE SIGNATURE MOVE · BLAST RADIUS ]
          </span>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            Know what breaks
            <br />
            <span className="text-night-route">before you touch it.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-night-muted">
            Search finds files that <em>mention</em> something. Blast radius
            finds files that <span className="text-night-text">break</span> when
            you change something - transitively, over the real import graph. On
            a 7,500-file repo, one query returns in about 3 microseconds thanks
            to a Roaring-Bitmap engine.
          </p>
          <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-night-muted">
            Then it goes one step further: every file carries a{" "}
            <span className="text-night-text">predictive risk score</span> -{" "}
            <span className="font-mono text-[0.9em] text-night-route">
              P(this file causes the next incident)
            </span>{" "}
            from 0 to 1, learned from churn and past breakage. You see not just
            what breaks, but what&rsquo;s most likely to hurt.
          </p>

          {/* predictive-risk meter */}
          <div className="mt-6 max-w-xl border border-night-line bg-night-panel px-4 py-3.5">
            <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.1em] text-night-muted">
              <span>predicted risk · session.ts</span>
              <span className="text-signal">0.82 · HIGH</span>
            </div>
            <div className="mt-2.5 h-1.5 w-full bg-night-line">
              <div className="h-full w-[82%] bg-signal" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-px border border-night-line bg-night-line">
            {[
              ["2.7µs", "blast radius p50"],
              ["84µs", "validate_diff p50"],
              ["750ns", "high-impact p50"],
            ].map(([v, k]) => (
              <div key={k} className="bg-night-panel px-3 py-3.5 sm:px-4 sm:py-4">
                <p className="font-display text-xl font-semibold text-night-text sm:text-2xl">{v}</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.08em] text-night-muted sm:text-[0.66rem] sm:tracking-[0.1em]">{k}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* the ring - one file, its cone of consequences */}
        <Reveal delay={0.12}>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            {[92, 68, 44].map((size) => (
              <span
                key={size}
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-night-route/40"
                style={{ width: `${size}%`, height: `${size}%` }}
              />
            ))}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal softpulse"
            />
            {/* satellite nodes */}
            {[0, 45, 120, 200, 260, 310].map((deg, i) => (
              <span
                key={deg}
                aria-hidden
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-night-route"
                style={{
                  transform: `rotate(${deg}deg) translateX(${110 + (i % 3) * 26}px) rotate(-${deg}deg)`,
                }}
              />
            ))}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap border border-night-line bg-night-panel px-3 py-1.5 font-mono text-[0.72rem]">
              <span className="text-signal">session.ts</span>
              <span className="text-night-muted"> → </span>
              <span className="text-night-text">88 dependents · P 0.82</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
