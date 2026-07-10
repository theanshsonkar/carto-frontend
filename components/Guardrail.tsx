import { Reveal } from "./ui/Reveal";
import { Card } from "./ui/Card";

/**
 * Guardrail - the "context that pushes back" message. Most tools hand the AI
 * context and hope. Carto grades every diff before it lands and can block a
 * HIGH-risk edit before it reaches disk. Also covers staleness warnings.
 */
export function Guardrail() {
  return (
    <section id="guardrail" className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <span className="eyebrow">[ PASSIVE CONTEXT vs. ACTIVE GUARDRAIL ]</span>
            <h2 className="mt-5 font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Most tools hand the AI context and hope.{" "}
              <span className="text-route">Carto pushes back.</span>
            </h2>
            <p className="mt-6 text-[1rem] leading-relaxed text-ink-2">
              Every proposed diff is graded <em>before</em> it lands - blast
              radius, risk, cross-domain violations - and a HIGH-risk edit can
              be blocked before it ever reaches disk. The container doesn’t just
              inform the model; it stops the bad change.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              tag: "cross-domain",
              title: "Catch boundary violations",
              body: "A change in PAYMENTS that reaches into AUTH is flagged 🔴 HIGH - Carto auto-detects domains from the import graph and knows when an edit crosses a line it shouldn't.",
              tone: "signal",
            },
            {
              tag: "mcp-middleware",
              title: "Block at the door",
              body: "carto mcp-middleware --block-on HIGH wraps any MCP server and stops a risky write before it reaches the model, or disk.",
              tone: "signal",
            },
            {
              tag: "staleness",
              title: "Never serve stale numbers",
              body: "If the repo moves ahead of the index, queries warn “graph is N commits stale” instead of quietly answering with old data.",
              tone: "route",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <Card className="group flex h-full flex-col">
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.72rem] text-route">{c.tag}</span>
                    <span
                      aria-hidden
                      className={`h-1.5 w-6 origin-right transition-transform duration-200 group-hover:scale-x-150 ${c.tone === "signal" ? "bg-signal" : "bg-route"}`}
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-2">{c.body}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* the verdict strip */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border border-ink bg-signal-soft px-6 py-4 shadow-hard sm:flex-row">
            <span className="font-mono text-[0.8rem] text-ink">
              <span className="text-signal">◆ BLOCKED</span> ·{" "}
              <span className="font-semibold">checkout.ts</span>{" "}
              <span className="text-ink-2">(PAYMENTS)</span> reaches{" "}
              <span className="font-semibold">auth/session.ts</span>{" "}
              <span className="text-ink-2">(AUTH)</span> - cross-domain write
            </span>
            <span className="font-mono text-[0.72rem] text-ink-2">
              graded in 84µs · verdict remembered for next session
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
