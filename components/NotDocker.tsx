import { Reveal } from "./ui/Reveal";

/**
 * NotDocker - a slim clarification band. Docker containerizes compute; Carto
 * containerizes context. Heads off the obvious question the metaphor invites.
 */
export function NotDocker() {
  return (
    <section className="border-b border-line bg-panel">
      <div className="shell py-14 md:py-16">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <span className="eyebrow">[ IS THIS DOCKER? ]</span>
              <p className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-ink md:text-3xl">
                No. Docker containerizes{" "}
                <span className="text-ink-3">compute.</span>
                <br />
                Carto containerizes{" "}
                <span className="text-route">context.</span>
              </p>
            </div>
            <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink-2">
              <p>
                Docker packs the OS, libraries, and binaries a CPU needs to run
                your code anywhere. Carto packs the import graph, blast radius,
                and structural boundaries an <span className="text-ink">LLM</span>{" "}
                needs to reason about your code without re-reading it.
              </p>
              <p>
                No daemon, no image pull, no virtual network - just a lightweight{" "}
                <span className="font-mono text-[0.9em] text-ink">.carto/</span>{" "}
                folder: a local SQLite database plus an open ANCI map. It costs
                nothing while idle, answers a blast-radius query in microseconds,
                and never touches the cloud.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
