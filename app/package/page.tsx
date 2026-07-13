import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PackageConsole } from "@/components/package/PackageConsole";

export const metadata: Metadata = {
  title: "Package a repo · Carto",
  description:
    "Paste any public GitHub repo. Carto packages it in seconds and hands back a shareable boarding pass: architecture, domains, blast radius, and a health score. No install, no account.",
};

const TRUST = [
  ["No install", "runs in your browser"],
  ["No account", "paste a URL, that's it"],
  ["Parsed, never run", "tree-sitter, static only"],
  ["Cached by digest", "same commit, instant"],
];

export default function PackagePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* ---- hero + drop zone ---- */}
        <section className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[620px] rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--color-route-soft), transparent)" }}
          />
          <div className="shell relative py-16 md:py-20">
            <span className="inline-flex items-center gap-2.5 border border-line bg-panel px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.02em] text-ink-2">
              <span className="h-1.5 w-1.5 bg-route softpulse" aria-hidden />
              See any repo the way your AI should
            </span>

            <h1 className="mt-7 max-w-3xl font-display font-medium text-ink [font-size:var(--text-display)] [letter-spacing:var(--text-display--letter-spacing)] [line-height:var(--text-display--line-height)]">
              Package a repo.
              <br />
              <span className="text-route">Get its boarding pass.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              Paste any public GitHub repo. Carto maps its architecture and
              hands back a shareable{" "}
              <span className="text-ink">boarding pass</span>: domains, a live
              dependency graph, and the one thing other analyzers miss:{" "}
              <span className="text-ink">what breaks before you change it.</span>
            </p>

            <div className="mt-9">
              <PackageConsole />
            </div>
          </div>
        </section>

        {/* ---- trust strip ---- */}
        <section className="border-b border-line bg-panel">
          <div className="shell grid grid-cols-2 gap-px bg-line md:grid-cols-4">
            {TRUST.map(([h, s]) => (
              <div key={h} className="bg-panel px-5 py-5">
                <div className="font-display text-sm font-semibold text-ink">{h}</div>
                <div className="mt-1 font-mono text-[0.72rem] text-ink-3">{s}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- why it matters ---- */}
        <section className="border-b border-line">
          <div className="shell py-16 md:py-20">
            <span className="eyebrow flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-route" aria-hidden />
              WHY A BOARDING PASS
            </span>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  t: "Your AI stops re-indexing",
                  b: "Every tool re-reads the whole repo each session. The boarding pass is the map it should start from, built once, read in seconds.",
                },
                {
                  t: "Blast radius, not just structure",
                  b: "gitdiagram shows you the shape. Carto shows you the consequences: touch one file, see exactly what breaks across domains.",
                },
                {
                  t: "Shareable proof",
                  b: "Drop the badge in your README or share the link. One screenshot says more about your architecture than a paragraph.",
                },
              ].map((c) => (
                <div key={c.t} className="border border-ink bg-panel p-6 shadow-hard">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{c.t}</h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-2">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
