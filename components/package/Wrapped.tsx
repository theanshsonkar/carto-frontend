"use client";

import { useState } from "react";
import { archetype, baseName, SITE_URL, type Finding, type Passport } from "./passport-data";
import { CountUp } from "./CountUp";

/**
 * Wrapped — the CRITICAL FINDINGS bento under the boarding pass. The fuller
 * 6-col mosaic: findings + context tiles, filling the width. Critical findings
 * render their consequence text in red so severity reads at a glance. Brand
 * palette as bold blocks; no black tiles.
 */
export function Wrapped({ p }: { p: Passport }) {
  const a = archetype(p);
  const gradeTone = p.health >= 85 ? "text-safe" : p.health >= 72 ? "text-route" : "text-signal";
  const f = p.findings;

  return (
    <div className="mx-auto w-full max-w-[1280px]">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-signal" aria-hidden />
        <span className="font-mono text-[0.76rem] uppercase tracking-[0.18em] text-ink-2">
          critical findings · {p.repo}
        </span>
      </div>

      <div className="grid auto-rows-[minmax(132px,auto)] grid-cols-2 gap-3 lg:auto-rows-[minmax(0,20.5vh)] lg:grid-cols-6">
        {/* findings — F1 is the headline (2-wide, bold blue) */}
        <FindingTile f={f[0]} className="col-span-2" big bold />
        <FindingTile f={f[1]} />
        <FindingTile f={f[2]} />
        <FindingTile f={f[3]} />
        <FindingTile f={f[4]} />

        {/* row 2: last finding + context */}
        <FindingTile f={f[5]} />

        {/* GRADE */}
        <Tile bg="bg-panel" text="text-ink">
          <TileKicker tone="text-route">health grade</TileKicker>
          <div className={`mt-auto font-display text-[clamp(2.4rem,5.5vw,3.75rem)] font-semibold leading-none ${gradeTone}`}>
            {p.grade}
          </div>
          <div className="mt-1 font-mono text-[0.76rem] text-ink-3"><CountUp value={p.health} />/100 structural</div>
        </Tile>

        {/* FILES */}
        <Tile bg="bg-panel-2" text="text-ink">
          <TileKicker tone="text-route">files mapped</TileKicker>
          <div className="mt-auto font-display text-[clamp(1.7rem,4vw,2.6rem)] font-semibold leading-none">
            <CountUp value={p.files} format={(n) => Math.round(n).toLocaleString()} />
          </div>
          <div className="mt-1 font-mono text-[0.76rem] text-ink-3">{p.edges.toLocaleString()} imports</div>
        </Tile>

        {/* DOMAINS */}
        <Tile bg="bg-safe" text="text-paper">
          <TileKicker tone="text-paper/70">domains</TileKicker>
          <div className="mt-auto font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none text-paper">
            <CountUp value={p.domainsCount} />
          </div>
          <div className="mt-1 font-mono text-[0.76rem] text-paper/70">{p.routes} routes · {p.models} models</div>
        </Tile>

        {/* RISK */}
        <Tile bg="bg-panel" text="text-ink">
          <TileKicker tone="text-signal">P(next incident)</TileKicker>
          <div className={`mt-auto font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none ${gradeTone}`}>
            <CountUp value={p.risk} decimals={2} />
          </div>
          <div className="mt-1 font-mono text-[0.76rem] text-ink-3">predictive</div>
        </Tile>

        {/* LEAKS */}
        <Tile bg={p.violations > 0 ? "bg-signal" : "bg-safe"} text="text-paper">
          <TileKicker tone="text-paper/70">boundary leaks</TileKicker>
          <div className="mt-auto font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none">
            <CountUp value={p.violations} />
          </div>
          <div className="mt-1 font-mono text-[0.76rem] text-paper/70">cross-domain</div>
        </Tile>
      </div>

      {/* share bar */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ShareRow p={p} />
      </div>

      {/* nerd stats (collapsed) */}
      <div className="mt-3">
        <NerdStats p={p} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* tiles                                                               */
/* ------------------------------------------------------------------ */

function Tile({
  children,
  bg,
  text,
  className = "",
}: {
  children: React.ReactNode;
  bg: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={`relative flex min-h-0 flex-col overflow-hidden border border-ink ${bg} ${text} p-4 shadow-hard ${className}`}>
      {children}
    </div>
  );
}

function TileKicker({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <div className={`font-mono text-[0.74rem] uppercase tracking-[0.16em] ${tone}`}>{children}</div>;
}

function FindingTile({ f, className = "", big = false, bold = false }: { f: Finding; className?: string; big?: boolean; bold?: boolean }) {
  const sev =
    f.tone === "signal"
      ? { label: "critical", dot: "text-signal" }
      : f.tone === "route"
      ? { label: "notable", dot: "text-route" }
      : { label: "healthy", dot: "text-safe" };
  const num = f.tone === "signal" ? "text-signal" : f.tone === "route" ? "text-route" : "text-safe";
  const size = big ? "text-[clamp(2.2rem,5vw,3.5rem)]" : "text-[clamp(1.7rem,3.6vw,2.6rem)]";
  // critical → the consequence text is red too, so severity reads at a glance
  const bodyTone = f.tone === "signal" ? "text-signal" : "text-ink-2";

  if (bold) {
    return (
      <Tile bg="bg-route" text="text-paper" className={className}>
        <div className="flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-paper/70">
          <span aria-hidden>◆</span>
          <span>{sev.label}</span>
        </div>
        <div className={`mt-auto font-display font-semibold leading-none ${size} text-paper`}>{f.big}</div>
        <div className="mt-1.5 text-[0.92rem] font-medium leading-snug text-paper/90">{f.text}</div>
      </Tile>
    );
  }

  return (
    <Tile bg="bg-panel" text="text-ink" className={className}>
      <div className="flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
        <span className={sev.dot} aria-hidden>◆</span>
        <span className={f.tone === "signal" ? "text-signal" : "text-ink-3"}>{sev.label}</span>
      </div>
      <div className={`mt-auto font-display font-semibold leading-none ${size} ${num}`}>{f.big}</div>
      <div className={`mt-1.5 text-[0.92rem] font-medium leading-snug ${bodyTone}`}>{f.text}</div>
    </Tile>
  );
}

/* ------------------------------------------------------------------ */
/* share row                                                           */
/* ------------------------------------------------------------------ */

function ShareRow({ p }: { p: Passport }) {
  const a = archetype(p);
  // content-versioned token: makes X/Slack/iMessage treat this as a new URL and
  // re-crawl the per-repo card instead of serving a stale cached preview. It
  // only changes when the repo's content (digest) changes.
  const ogv = p.digest.replace(/[^a-z0-9]/gi, "").slice(-8) || "1";
  const url = `${SITE_URL}/r?repo=${p.repo}`;
  const shareUrl = `${url}&og=${ogv}`;
  const badge = `[![Carto boarding pass](${SITE_URL}/r.png?repo=${p.repo})](${url})`;
  const worst = p.findings.find((x) => x.tone === "signal") ?? p.findings[0];
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${p.repo} is ${a.title} ${a.emoji}: ${worst.big} ${worst.text}. found by carto:`
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <CopyChip label="Copy link" value={shareUrl} />
      <CopyChip label="README badge" value={badge} />
      <a href={tweet} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center border border-ink bg-panel px-3 py-2.5 font-mono text-[0.74rem] text-ink shadow-hard transition-colors hover:bg-ink hover:text-paper">
        Share on X ↗
      </a>
      <a href="/package" className="flex items-center justify-center border border-ink bg-route px-3 py-2.5 font-mono text-[0.74rem] text-paper shadow-hard transition-colors hover:bg-route-strong">
        Package another →
      </a>
    </>
  );
}

function CopyChip({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
      }
      className="border border-ink bg-panel px-3 py-2.5 font-mono text-[0.74rem] text-ink shadow-hard transition-colors hover:bg-panel-2"
    >
      {copied ? "copied ✓" : label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* nerd stats (collapsible)                                            */
/* ------------------------------------------------------------------ */

const toneBar: Record<string, string> = {
  route: "bg-route",
  safe: "bg-safe",
  signal: "bg-signal",
  ink: "bg-ink",
};

function NerdStats({ p }: { p: Passport }) {
  const [open, setOpen] = useState(false);
  const maxD = Math.max(...p.domains.map((d) => d.files));
  const maxF = Math.max(...p.highImpact.map((x) => x.dependents));
  const gradeTone = p.health >= 85 ? "text-safe" : p.health >= 72 ? "text-route" : "text-signal";

  return (
    <div className="border border-ink bg-panel shadow-hard">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-3.5 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-ink"
      >
        <span>[ nerd stats ]</span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="grid gap-8 border-t border-line p-6 md:grid-cols-2">
          {/* WHY this grade — the receipt. Every line traces to a real signal. */}
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">
              <span>why</span>
              <span className={`font-semibold ${gradeTone}`}>{p.grade}</span>
              <span>· {p.health}/100 structural</span>
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[0.78rem]">
              {p.score.lines.map((l) => (
                <div key={l.label} className="flex items-baseline gap-3">
                  <span
                    className={`w-9 shrink-0 text-right font-semibold ${
                      l.na ? "text-ink-3" : l.pts > 0 ? "text-safe" : l.pts < 0 ? "text-signal" : "text-ink-3"
                    }`}
                  >
                    {l.na ? "n/a" : l.pts > 0 ? `+${l.pts}` : l.pts}
                  </span>
                  <span className="w-[9.5rem] shrink-0 text-ink">{l.label}</span>
                  <span className="min-w-0 flex-1 truncate text-ink-3" title={l.detail}>
                    {l.detail}
                  </span>
                </div>
              ))}
              <div className="flex items-baseline gap-3 border-t border-line pt-2">
                <span className={`w-9 shrink-0 text-right font-semibold ${gradeTone}`}>{p.health}</span>
                <span className="text-ink-2">
                  base {p.score.base} + signals → {p.grade}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">domains</div>
            <div className="mt-3 space-y-2.5">
              {p.domains.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 font-mono text-[0.76rem] text-ink">{d.name}</span>
                  <div className="h-2.5 flex-1 bg-panel-2">
                    <div className={`h-full ${toneBar[d.tone]}`} style={{ width: `${Math.max(6, (d.files / maxD) * 100)}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right font-mono text-[0.76rem] text-ink-2">{d.files}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-3">high-impact files</div>
            <div className="mt-3 space-y-2.5">
              {p.highImpact.map((x) => (
                <div key={x.path} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate font-mono text-[0.76rem] text-ink" title={x.path}>{baseName(x.path)}</span>
                  <div className="h-2.5 w-24 shrink-0 bg-panel-2">
                    <div className="h-full bg-route" style={{ width: `${(x.dependents / maxF) * 100}%` }} />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-[0.76rem] font-semibold text-route">{x.dependents}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
