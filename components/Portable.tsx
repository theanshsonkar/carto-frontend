import { Reveal } from "./ui/Reveal";
import { Card, CardHeader } from "./ui/Card";

/**
 * Portable - the "build once, pull anywhere" story: single-file export/import,
 * the ANCI open format, container identity + integrity. This is the future
 * vision from CARTO_PLAN made concrete.
 */
export function Portable() {
  return (
    <section id="portable" className="border-b border-line">
      <div className="shell py-16 md:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <span className="eyebrow">[ BUILD ONCE · PULL ANYWHERE ]</span>
            <h2 className="mt-5 font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              An open format,{" "}
              <span className="text-route">not a lock-in.</span>
            </h2>
            <p className="mt-6 text-[1rem] leading-relaxed text-ink-2">
              The container is a portable artifact -{" "}
              <span className="font-mono text-[0.9em] text-ink">.carto/anci.&#123;yaml,bin&#125;</span>{" "}
              - with a verifiable identity: source commit, tree hash, pinned
              grammar versions, and a sha256 content digest. Same repo → same
              digest. Build it on one machine, load it on another - the digest
              is checked on load, and every AI tool reads it with zero re-index.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          {/* left: the flow */}
          <Reveal className="h-full">
            <Card className="flex h-full flex-col">
              <CardHeader title="carto · build once" label="portable" dot="safe" />
              <div className="flex flex-1 flex-col justify-between p-7">
                <div className="space-y-px bg-line">
                  {[
                    ["carto init", "parse the repo → build the container", "map"],
                    ["carto export --out myrepo.anci", "pack yaml + bitmap + manifest into one file", "box"],
                    ["carto load myrepo.anci", "unpack on any machine - no re-index, digest verified", "pull"],
                  ].map(([cmd, desc], i) => (
                    <div key={cmd} className="flex items-center gap-4 bg-panel py-3">
                      <span className="font-mono text-[0.7rem] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[0.82rem] text-ink">{cmd}</p>
                        <p className="truncate font-mono text-[0.7rem] text-ink-2">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-line pt-5 text-[0.86rem] leading-relaxed text-ink-2">
                  Loaded containers are treated as untrusted data, never
                  instructions - portability without a prompt-injection hole.
                </p>
              </div>
            </Card>
          </Reveal>

          {/* right: consumer API */}
          <Reveal className="h-full" delay={0.1}>
            <Card tone="dark" className="flex h-full flex-col">
              <CardHeader title="consumer.js" label="read it, no runtime" tone="dark" dot="route" />
              <div className="flex flex-1 flex-col p-7">
                <pre className="overflow-x-auto font-mono text-[0.78rem] leading-relaxed text-night-text">
{`const { loadAnci } =
  require('carto-md/src/anci/consumer');

const c = loadAnci('./.carto');

c.domains;
// [{ name: 'AUTH', file_count: 42 }, …]

c.blastRadius('src/auth/session.ts');
// { count: 88, hops: 3, files: [ … ] }

c.getHighImpactFiles(5);
// top 5 by transitive dependents`}
                </pre>
                <p className="mt-auto pt-5 font-mono text-[0.7rem] text-night-muted">
                  ↳ zero Carto runtime · zero deps · JS today, Python next
                </p>
              </div>
            </Card>
          </Reveal>
        </div>

        {/* everyday CLI + CI story */}
        <Reveal delay={0.1}>
          <div className="mt-8 border border-line bg-panel p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xl text-[0.95rem] leading-relaxed text-ink-2">
                The container is a CLI you live in, not a black box. Everyday
                commands answer questions straight from the map - and{" "}
                <span className="font-mono text-[0.9em] text-ink">pr-impact</span>{" "}
                shapes the blast radius between two refs, so it drops straight
                into CI.
              </p>
              <span className="eyebrow">[ EVERYDAY COMMANDS ]</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                ["carto impact", "what breaks if I touch this"],
                ["carto why", "why does this file matter"],
                ["carto check", "grade the working tree"],
                ["carto status", "is the map fresh"],
                ["carto doctor", "diagnose the container"],
                ["carto pr-impact", "diff-shaped impact for CI"],
              ].map(([cmd, desc]) => (
                <span
                  key={cmd}
                  title={desc}
                  className="group inline-flex items-center gap-2 border border-line bg-panel-2 px-3 py-1.5 font-mono text-[0.8rem] text-ink transition-colors hover:border-route hover:text-route"
                >
                  <span className="text-ink-3 group-hover:text-route" aria-hidden>$</span>
                  {cmd}
                </span>
              ))}
            </div>

            <p className="mt-6 border-t border-line pt-5 font-mono text-[0.72rem] text-ink-2">
              <span className="text-route">↳ multi-repo</span> · load many
              containers side by side - monorepos and org-wide, one map per repo,
              queried together.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
