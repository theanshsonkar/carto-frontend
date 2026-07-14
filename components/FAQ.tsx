import { Reveal } from "./ui/Reveal";

/**
 * FAQ - the one supporting block worth having (Evil Martians dev-tool study).
 * Native <details>/<summary> so it's accessible and needs zero JS. Answers the
 * questions an OSS visitor asks before running `npm i`: privacy, tools,
 * languages, freshness, multi-repo, cost.
 */

const faqs: [string, React.ReactNode][] = [
  [
    "So it's just shared context across my AI tools?",
    "No, that's the least of it. Carto is the layer between your codebase and your AI. Your repo becomes a portable container that sits in the path: every change your AI tool proposes passes through it, gets graded, and the dangerous ones are blocked before they reach disk. A plain index is passive context you hope the AI reads. Carto is context that pushes back.",
  ],
  [
    "I already use Cursor or Copilot. What does Carto add?",
    "They each build their own index of your repo and throw it away when the tab closes. Carto packages the repo once into a container every tool shares, so your AI starts each session already knowing your architecture, blast radius and past decisions, instead of re-reading 40 files to guess.",
  ],
  [
    "Can it actually stop my AI from making a risky change?",
    "Yes. Carto grades every diff your AI proposes for risk and boundary violations before you ever see it, and the MCP middleware can block a HIGH-risk edit before it reaches disk. It's a guardrail that pushes back, not a report you read after the damage is done.",
  ],
  [
    "How is this different from my tests and linter?",
    "Tests catch broken behavior. Linters catch broken syntax. Neither sees what a change did to the shape of your system. Carto shows the blast radius: touch one file and it names the 22 others that break, transitively, before the diff lands.",
  ],
  [
    "Does it remember what we decided last week?",
    "Yes. Every decision and validated diff is saved in one local SQLite file. Ask \u201Cdid we agree on snake_case here?\u201D six weeks later and you get the actual verdict, not a fresh guess. The container gets smarter the longer the repo lives.",
  ],
  [
    "Does my code ever leave my machine?",
    "No. Carto is local-only: a SQLite database plus an open ANCI file inside a .carto/ folder on your disk. No cloud, no account, no telemetry, ever. .cartoignore blocks .env and credential files by default.",
  ],
  [
    "Which AI tools does it work with?",
    "Any MCP client: Cursor, Claude Code, Copilot, Kiro, Zed, Windsurf, JetBrains and more are auto-wired when you run carto init. Or read the ANCI file directly with zero Carto runtime.",
  ],
  [
    "Will it understand my stack?",
    "It parses 17 languages with tree-sitter, detects routes across Express, Next.js, tRPC, FastAPI, Flask, Django, Gin, Axum, Spring, Rails and ASP.NET, and extracts data models from Prisma, Zod, Drizzle, Pydantic, SQLAlchemy and JPA.",
  ],
  [
    "How does the container stay fresh?",
    "It auto-syncs on git events: commit, checkout, merge and rebase, and re-syncs are incremental, under a second on every repo we benchmark. If the repo moves ahead of the index, queries warn that the graph is stale instead of answering with old data.",
  ],
  [
    "Does it work across multiple repos?",
    "Yes. Load many containers side by side for monorepos or org-wide setups: one map per repo, queried together.",
  ],
  [
    "Is this Docker?",
    "No. Docker containerizes compute: the OS and binaries a CPU needs. Carto containerizes context: the import graph, blast radius and structural boundaries an LLM needs to reason about your code without re-reading it. No daemon, no image pull.",
  ],
  [
    "How much does it cost?",
    "Free. MIT-licensed, one SQLite file, no cloud bill. That's the whole pricing page.",
  ],
];

export function FAQ() {
  return (
    <section id="faq" className="border-b border-line bg-panel">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ QUESTIONS BEFORE YOU INSTALL ]</span>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            The short answers.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 border border-ink bg-paper shadow-hard">
            {faqs.map(([q, a], i) => (
              <details
                key={i}
                className="group border-b border-line last:border-0"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-panel-2 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[0.7rem] text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base font-semibold text-ink md:text-lg">
                      {q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center border border-line font-mono text-ink-2 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 pl-[3.4rem] text-[0.9rem] leading-relaxed text-ink-2">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
