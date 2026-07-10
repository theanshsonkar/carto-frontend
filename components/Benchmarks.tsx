import { Reveal } from "./ui/Reveal";
import { Card, CardHeader } from "./ui/Card";

const rows = [
  ["cal.com", "4,352", "3.9s", "805ms", "3.1 MB"],
  ["supabase/supabase", "6,358", "5.9s", "967ms", "4.8 MB"],
  ["vercel/next.js", "6,193", "6.9s", "978ms", "15.1 MB"],
  ["microsoft/vscode", "7,567", "8.6s", "1.1s", "14.3 MB"],
];

export function Benchmarks() {
  return (
    <section id="speed" className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ SPEED · REAL REPOS ]</span>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            Packs a 7,500-file repo in{" "}
            <span className="text-route">under nine seconds.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ink-2">
            Fresh runs on real open-source repos (Apple M-series, 8 CPUs, 8 GB
            RAM). Re-syncs are incremental - under a second on every repo here.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="mt-10 overflow-hidden">
            <CardHeader title="carto bench · fresh runs" label="M-series · 8 CPU · 8 GB" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-panel-2">
                    {["Repo", "Files", "First index", "Re-index", "Container"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3 ${i > 0 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r[0]} className="border-b border-line last:border-0 bg-panel">
                      <td className="px-4 py-3 font-mono text-[0.82rem] text-ink">{r[0]}</td>
                      {r.slice(1).map((c, i) => (
                        <td key={i} className="px-4 py-3 text-right font-mono text-[0.82rem] text-ink-2">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
