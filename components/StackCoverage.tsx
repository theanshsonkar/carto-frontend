"use client";

import { useState } from "react";
import { Card } from "./ui/Card";

/**
 * StackCoverage - the "does it understand my stack?" answer, folded into one
 * tabbed panel so four dense lists cost a single list's height. Tabs swap the
 * body in place: Languages · Routers · Models · MCP tools. This is the
 * evaluator's #1 question ("will it read *my* framework?") made concrete.
 */

type TabKey = "langs" | "routers" | "models" | "tools";

const LANGS = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "Kotlin",
  "C", "C++", "C#", "Ruby", "PHP", "Swift", "Dart", "R", "Prisma", "HTML",
];

const ROUTERS = [
  "Express", "Next.js", "tRPC", "React Router", "FastAPI", "Flask", "Django",
  "Gin", "Echo", "Chi", "Actix", "Axum", "Rocket", "Spring", "JAX-RS",
  "ASP.NET", "Rails", "Sinatra",
];

const MODELS = [
  "Prisma", "Zod", "Drizzle", "Pydantic", "SQLAlchemy", "Django",
  "Go structs", "Rust structs", "JPA", "ActiveRecord", "Eloquent",
];

const TOOLS: [string, string][] = [
  ["get_architecture · get_context", "orient in the repo; full context for one file"],
  ["impact", "blast radius / simulate / neighbors / data flow"],
  ["validate_diff", "grade a proposed diff: risk + violations"],
  ["get_change_plan", "natural-language intent → files to touch"],
  ["memory", "search past decisions, logs, sessions"],
  ["history", "drift, hotspots, evolution, churn, health"],
  ["patterns", "mined invariants, conventions, co-change"],
  ["get_predictive_risk", "P(next incident) score per file"],
  ["get_minimal_context_for_intent", "token-budgeted context picker"],
];

const TABS: { key: TabKey; label: string; count: string }[] = [
  { key: "langs", label: "Languages", count: "17" },
  { key: "routers", label: "Routers", count: "18" },
  { key: "models", label: "Models / ORMs", count: "11" },
  { key: "tools", label: "MCP tools", count: "core-10" },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-line bg-panel px-3 py-1.5 font-mono text-[0.8rem] text-ink transition-colors hover:border-route hover:text-route">
      {children}
    </span>
  );
}

export function StackCoverage() {
  const [tab, setTab] = useState<TabKey>("routers");

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-[0.95rem] leading-relaxed text-ink-2">
          Structural intelligence is only worth anything if it reads{" "}
          <span className="text-ink">your</span> stack. It parses{" "}
          <span className="text-ink">17 languages</span> and detects routes and
          data models across the frameworks you actually ship.
        </p>
        <span className="eyebrow">[ WILL IT READ MY STACK? ]</span>
      </div>

      <Card className="mt-6 overflow-hidden">
        {/* tab bar - reuses the numbered-spec rhythm */}
        <div className="flex flex-wrap border-b border-line bg-panel-2">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={active}
                className={`flex items-center gap-2 border-r border-line px-5 py-3 font-mono text-[0.75rem] transition-colors ${
                  active
                    ? "bg-panel text-ink"
                    : "text-ink-3 hover:bg-panel/60 hover:text-ink-2"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 ${active ? "bg-route" : "bg-line"}`}
                  aria-hidden
                />
                {t.label}
                <span className="text-ink-3">· {t.count}</span>
              </button>
            );
          })}
        </div>

        {/* body - swaps in place */}
        <div className="p-7">
          {tab === "langs" && (
            <div className="flex flex-wrap gap-2.5">
              {LANGS.map((l) => (
                <Chip key={l}>{l}</Chip>
              ))}
            </div>
          )}

          {tab === "routers" && (
            <>
              <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-3">
                Route detection: endpoints, methods & handlers
              </p>
              <div className="flex flex-wrap gap-2.5">
                {ROUTERS.map((r) => (
                  <Chip key={r}>{r}</Chip>
                ))}
              </div>
            </>
          )}

          {tab === "models" && (
            <>
              <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-3">
                Data-model extraction: schemas, tables & validators
              </p>
              <div className="flex flex-wrap gap-2.5">
                {MODELS.map((m) => (
                  <Chip key={m}>{m}</Chip>
                ))}
              </div>
            </>
          )}

          {tab === "tools" && (
            <>
              <p className="mb-5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-3">
                Tools your AI can call over MCP: core-10 plus families
              </p>
              <div className="grid gap-px bg-line sm:grid-cols-2">
                {TOOLS.map(([name, desc]) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 bg-panel px-4 py-3"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 bg-route" aria-hidden />
                    <span className="font-mono text-[0.8rem] text-ink">{name}</span>
                    <span className="ml-auto truncate font-mono text-[0.7rem] text-ink-2">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
