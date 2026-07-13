import { Reveal } from "./ui/Reveal";
import { Card } from "./ui/Card";

const nevers = [
  ["Sends your code anywhere", "Local only. SQLite on disk. No telemetry, no cloud."],
  ["Writes secrets into the container", ".cartoignore blocks .env & credential files by default."],
  ["Touches your manual notes", "Only writes between CARTO:AUTO markers."],
  ["Costs money", "MIT. Free forever."],
];

export function Trust() {
  return (
    <section className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <span className="eyebrow">[ WHAT CARTO NEVER DOES ]</span>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
            Your code stays{" "}
            <span className="text-route">on your machine.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {nevers.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06}>
              <Card className="flex h-full flex-col">
                <div className="flex flex-1 items-start gap-4 p-6">
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center border border-ink bg-signal text-paper"
                  >
                    ✕
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">{t}</h3>
                    <p className="mt-1 text-[0.86rem] leading-relaxed text-ink-2">{d}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
