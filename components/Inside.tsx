import { Reveal } from "./ui/Reveal";
import { Card } from "./ui/Card";
import { StackCoverage } from "./StackCoverage";

const layers = [
  {
    n: "01",
    name: "Structural",
    tag: "the shape of the repo",
    body: "Import graph, routes, models, and auto-detected domains, parsed once with tree-sitter across 17 languages.",
  },
  {
    n: "02",
    name: "Episodic",
    tag: "what was decided",
    body: "Every validated diff and decision, queryable weeks later. “Did we agree on snake_case here?” Get the actual verdict.",
  },
  {
    n: "03",
    name: "Temporal",
    tag: "the map over time",
    body: "Snapshots every commit. Tracks churn, drift, and architectural events. The container gets smarter the longer the repo lives.",
  },
  {
    n: "04",
    name: "Semantic",
    tag: "the unwritten rules",
    body: "Invariants and conventions mined from the import graph, not declared by humans, discovered from how the code actually connects.",
  },
  {
    n: "05",
    name: "Procedural",
    tag: "how changes happen",
    body: "Patterns mined from git history. “When a route is added, auth middleware is touched 89% of the time.”",
  },
];

/**
 * Inside - the five memory layers the container carries. Structural
 * intelligence is the headline; the other four are what makes it a container
 * and not just an index.
 */
export function Inside() {
  return (
    <section className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <span className="eyebrow">[ INSIDE THE CONTAINER ]</span>
            <h2 className="mt-5 font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Structural intelligence,{" "}
              <span className="text-route">plus four memories an index can’t carry.</span>
            </h2>
            <p className="mt-6 text-[1rem] leading-relaxed text-ink-2">
              Your AI tool sees files. Carto’s container sees architecture,
              history, and consequences: five layers, packed into one SQLite
              file and exposed to any tool over MCP.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-5">
          {layers.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.06}>
              <Card className="group flex h-full flex-col">
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.7rem] text-ink-3">{l.n}</span>
                    <span className="h-1.5 w-1.5 bg-route transition-transform duration-150 group-hover:scale-[2.2]" aria-hidden />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-ink">
                    {l.name}
                  </h3>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-route">
                    {l.tag}
                  </p>
                  <p className="mt-4 text-[0.86rem] leading-relaxed text-ink-2">
                    {l.body}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <StackCoverage />
        </Reveal>
      </div>
    </section>
  );
}
