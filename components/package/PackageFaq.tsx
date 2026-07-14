import { Reveal } from "../ui/Reveal";

/**
 * PackageFaq — static FAQ for the /package page. Answers what someone asks
 * before pasting a repo: what a boarding pass is, whether it is real data,
 * whether code is run, how to get it for their own repo, the badge, cost.
 * Native <details>/<summary>, zero JS, same brand language as the landing FAQ.
 */

const faqs: [string, React.ReactNode][] = [
  [
    "So it's just shared context across my AI tools?",
    "No — that's the least of it. Carto is the layer between your codebase and your AI. Your repo becomes a portable container that sits in the path: every change your AI tool proposes passes through it, gets graded, and the dangerous ones are blocked before they reach disk. A plain index is passive context you hope the AI reads. Carto is context that pushes back.",
  ],
  [
    "I already use Cursor or Copilot — what does Carto add?",
    "They each build their own index of your repo and throw it away when the tab closes. Carto packages the repo once into a container every tool shares, so your AI starts each session already knowing your architecture, blast radius and past decisions, instead of re-reading 40 files to guess.",
  ],
  [
    "Can it actually stop my AI from making a risky change?",
    "Yes. Carto grades every diff your AI proposes for risk and boundary violations before you ever see it, and the MCP middleware can block a HIGH-risk edit before it reaches disk. It's a guardrail that pushes back, not a report you read after the damage is done.",
  ],
  [
    "How is this different from my tests and linter?",
    "Tests catch broken behavior. Linters catch broken syntax. Neither sees what a change did to the shape of your system. Carto shows the blast radius: touch one file and it names the files that break, transitively, before the diff lands.",
  ],
  [
    "Does it remember what we decided last week?",
    "Yes. Every decision and validated diff is saved in one local SQLite file. Ask \u201Cdid we agree on snake_case here?\u201D six weeks later and you get the actual verdict, not a fresh guess. The container gets smarter the longer the repo lives.",
  ],
  [
    "What exactly is a boarding pass?",
    "It is Carto's one-page container for a repo: its archetype, a structural grade, the worst blast radius, cross-domain coupling, domains and predictive risk. The same container your AI reads so it knows what breaks before it edits.",
  ],
  [
    "Is this my repo's real data?",
    "The featured repos (supabase, next.js, react) show real Carto output. Any other repo you paste renders a representative preview of the boarding pass so you can see the format. For verified numbers on your own repo, run carto init locally. Live web parsing is on the way.",
  ],
  [
    "Does Carto run or store my code?",
    "No. Carto parses source statically with tree-sitter and never executes it. The CLI is local-only: one SQLite file on your disk, no cloud, no account, no telemetry. .cartoignore blocks .env and credential files by default.",
  ],
  [
    "How do I get a boarding pass for my own repo?",
    "npm i -g carto-md, then carto init in your project. Carto builds the container and wires into your AI tools. You can also paste any public GitHub repo above to preview the format first.",
  ],
  [
    "What is the README badge?",
    "A live boarding-pass image you embed in your README. It renders your repo's pass and links back to the full page, so anyone browsing the repo sees its architecture at a glance.",
  ],
  [
    "How much does it cost?",
    "Free. MIT-licensed, one SQLite file, no cloud bill. That's the whole pricing page.",
  ],
];

export function PackageFaq() {
  return (
    <section id="faq" className="border-b border-line bg-panel">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ BEFORE YOU PASTE A REPO ]</span>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            The short answers.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 border border-ink bg-paper shadow-hard">
            {faqs.map(([q, a], i) => (
              <details key={i} className="group border-b border-line last:border-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-panel-2 [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-center gap-3">
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
