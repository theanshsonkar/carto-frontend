import { Reveal } from "./ui/Reveal";
import { Card } from "./ui/Card";

const steps = [
  {
    verb: "Build",
    tag: "carto init",
    body: "Parses your repo: imports, routes, models, domains, blast radius, and writes the container to .carto/. Auto-wires every AI tool it finds on your machine.",
  },
  {
    verb: "Run",
    tag: "carto serve",
    body: "Serves the container over MCP: a compact core-10 plus parameterized families, so your AI spends its context on your code, not a tool menu. Auto-syncs on commit, checkout, merge & rebase. It stays fresh by itself. Decisions and drift persist in one SQLite file.",
  },
  {
    verb: "Attach",
    tag: "via MCP / ANCI",
    body: "Cursor, Claude, Copilot, Kiro: every tool queries the same container instead of building its own index. Or read the ANCI file directly, no runtime.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ ADD IT IN A MINUTE ]</span>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            Build. Run. <span className="text-route">Attach.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.verb} delay={i * 0.08}>
              <Card className="flex h-full flex-col">
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">
                      [ 0{i + 1} ]
                    </span>
                    <span className="font-mono text-[0.72rem] text-route">{s.tag}</span>
                  </div>
                  <h3 className="mt-5 font-display text-4xl font-medium leading-none tracking-tight text-ink md:text-5xl">
                    {s.verb}
                    <span className="text-route">.</span>
                  </h3>
                  <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
