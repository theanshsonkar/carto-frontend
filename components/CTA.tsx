/**
 * CTA - full-bleed route-blue anchor. The final push: package your repo.
 */
export function CTA() {
  return (
    <section className="relative overflow-hidden bg-route text-paper">
      <div aria-hidden className="bp-grid-blue pointer-events-none absolute inset-0" />
      <div className="shell relative flex flex-col items-center py-24 text-center md:py-32">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper/70">
          [ SHIP THE MAP ]
        </span>
        <h2 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
          Package your codebase once.
          <br />
          Let every AI understand it.
        </h2>
        <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-paper/80">
          One command builds the container and wires itself into every AI tool
          on your machine. Free, MIT, and it never leaves your disk.
        </p>

        <div className="mt-9 flex max-w-full items-stretch border border-paper/40 bg-route-strong font-mono text-[0.8rem] sm:text-[0.9rem]">
          <span aria-hidden className="flex items-center border-r border-paper/30 px-3 text-paper/60">$</span>
          <span className="flex items-center overflow-x-auto whitespace-nowrap px-4 py-3 text-paper sm:px-5">npm i -g carto-md && carto init</span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/package"
            className="inline-flex h-12 items-center justify-center gap-2.5 border border-paper bg-paper px-8 text-sm font-medium text-route transition-colors hover:bg-transparent hover:text-paper"
          >
            Package a public repo
            <span aria-hidden>→</span>
          </a>
          <a
            href="https://github.com/theanshsonkar/carto"
            className="inline-flex h-12 items-center justify-center gap-2.5 border border-paper/40 px-8 text-sm font-medium text-paper transition-colors hover:border-paper"
          >
            View on GitHub
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
