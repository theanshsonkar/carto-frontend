"use client";

import { QRCodeSVG } from "qrcode.react";
import { ContainerMark } from "@/components/ui/Logo";
import { archetype, concentration, SITE_URL, type Passport } from "./passport-data";
import { CountUp } from "./CountUp";
import { Scramble } from "./Scramble";
import { SplitReveal } from "./SplitReveal";
import { InspectionStamp } from "./InspectionStamp";

/** Where the pass's QR code points — the Carto landing page. */
const LANDING_URL = SITE_URL;

/**
 * BoardingPass — the shareable hero, built as an actual BOARDING PASS in Carto's
 * blueprint language. Anatomy: a route-blue "airline" header band, a big
 * FROM → TO route (repo → its archetype, airport-code style) with a flight
 * path, a labeled detail strip (the flight-info grid), an OCR-style MRZ, and a
 * perforated right stub that echoes the route + carries the scannable QR,
 * pass number and digest. All the motion (count-up, scramble decode, split
 * reveal, drawn inspection stamp) rides along.
 */
export function BoardingPass({ p }: { p: Passport }) {
  const a = archetype(p);
  const c = concentration(p);
  const [owner, name] = p.repo.split("/");
  const gradeTone = p.health >= 85 ? "text-safe" : p.health >= 72 ? "text-route" : "text-signal";
  const primaryLang = p.languages[0]?.name ?? p.stack[0] ?? "n/a";
  const after = p.reindexTax.split("→").map((s) => s.trim())[1] ?? "3µs";
  const fromCode = code3(name);
  const toCode = code3(a.title.replace(/^THE /, ""));

  return (
    <div className="relative mx-auto w-full max-w-[1280px]">
      {/* ---- perforation seam + notches at the stub boundary (desktop) ---- */}
      <div className="flex flex-col border border-ink bg-panel shadow-hard-lg md:flex-row">
        {/* ============================== MAIN ============================== */}
        <div className="relative min-w-0 flex-1">
          {/* airline header band */}
          <div className="relative flex items-center justify-between gap-3 overflow-hidden bg-route px-5 py-2.5 text-paper">
            <div aria-hidden className="bp-guilloche-blue pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative flex items-center gap-2">
              <ContainerMark />
              <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em]">
                Carto Container Authority
              </span>
            </div>
            <div className="relative flex items-center gap-3">
              <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/80 sm:inline">
                Boarding Pass
              </span>
              <span className="border border-paper/50 px-2 py-0.5 font-display text-sm font-bold leading-none">
                {p.grade}
              </span>
            </div>
          </div>

          {/* body */}
          <div className="relative overflow-hidden">
            <div aria-hidden className="bp-guilloche pointer-events-none absolute inset-0 opacity-[0.45]" />
            <span aria-hidden className="bp-sheen pointer-events-none absolute inset-0" />

            {/* gate/inspection stamp */}
            <InspectionStamp
              grade={p.grade}
              title={a.title.replace(/^THE /, "")}
              toneClass={gradeTone}
              posClass="top-3 right-3 md:right-6"
            />

            <div className="relative flex flex-col gap-5 p-6 md:p-7">
              {/* route row — FROM → TO */}
              <div className="flex items-end gap-3 pr-24 md:gap-4 md:pr-28">
                <RouteEnd code={fromCode} label="repository" sub={`${owner}/${name}`} />
                <FlightPath />
                <RouteEnd code={toCode} label="classified as" sub={`${a.emoji} ${a.title}`} align="right" toneClass={gradeTone} />
              </div>

              {/* detail strip — the flight-info grid */}
              <div className="grid grid-cols-3 border-t border-ink/15 sm:grid-cols-6">
                <Cell label="concentration">
                  <CountUp value={c.pct} />%
                </Cell>
                <Cell label="files">
                  <CountUp value={p.files} format={(n) => Math.round(n).toLocaleString()} />
                </Cell>
                <Cell label="domains">
                  <CountUp value={p.domainsCount} />
                </Cell>
                <Cell label="blast" tone="text-signal">
                  <CountUp value={p.blast.count} />
                </Cell>
                <Cell label="cross-domain" tone="text-signal">
                  <CountUp value={p.crossDomain} format={(n) => Math.round(n).toLocaleString()} />
                </Cell>
                <Cell label="p(incident)" tone={gradeTone}>
                  <CountUp value={p.risk} decimals={2} />
                </Cell>
              </div>

              {/* secondary fields */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink/15 pt-4 sm:grid-cols-4">
                <Field label="nationality" value={primaryLang} />
                <Field label="source ref" value={`@${p.commit}`} />
                <Field label="authority" value="carto engine · v4" />
                <Field label="reindex tax" value={`→ ${after}`} />
              </div>

              {/* machine-readable zone */}
              <div className="mrz border-t border-dashed border-ink/40 bg-panel-2/60 px-3 py-2 text-[0.66rem] leading-[1.35] text-ink-2">
                <div>
                  <Scramble text={mrz1(owner, name)} chars="mrz" duration={1.4} />
                </div>
                <div>
                  <Scramble text={mrz2(p)} chars="mrz" duration={1.6} delay={0.15} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================== STUB ============================== */}
        <div className="relative flex shrink-0 flex-col gap-4 border-t-2 border-dashed border-paper/40 bg-route p-5 text-paper md:w-[220px] md:border-t-0 md:border-l-2 md:border-paper/50">
          {/* perforation notches punched onto the seam (the stub's left border) */}
          <span
            aria-hidden
            className="absolute left-0 top-[-9px] z-20 hidden h-[18px] w-[18px] -translate-x-1/2 rounded-full border border-ink bg-paper md:block"
          />
          <span
            aria-hidden
            className="absolute left-0 bottom-[-9px] z-20 hidden h-[18px] w-[18px] -translate-x-1/2 rounded-full border border-ink bg-paper md:block"
          />
          <div aria-hidden className="bp-guilloche-blue pointer-events-none absolute inset-0 opacity-70" />

          <div className="relative flex items-center justify-between">
            <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em]">Boarding Pass</span>
            <span aria-hidden className="text-sm leading-none">{a.emoji}</span>
          </div>

          {/* stub echoes the route */}
          <div className="relative flex items-center gap-2 font-display text-2xl font-bold leading-none">
            <span>{fromCode}</span>
            <span aria-hidden className="text-paper/60">→</span>
            <span>{toCode}</span>
          </div>

          <div className="relative">
            <Field label="gate / domain" value={c.name} light />
          </div>

          {/* scannable QR + identity */}
          <a
            href={LANDING_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Scan or tap to open Carto"
            className="relative mt-auto flex items-end gap-3"
          >
            <span className="shrink-0 border border-ink bg-paper p-1.5 leading-[0] shadow-hard transition-transform hover:-translate-y-0.5">
              <QRCodeSVG value={LANDING_URL} size={64} bgColor="#f4f1e9" fgColor="#15140e" level="M" marginSize={0} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-paper/70">scan → carto</div>
              <div className="mt-1 font-mono text-[0.82rem] tracking-[0.18em]">
                <Scramble text={passportNo(p)} chars="code" />
              </div>
              <div className="mt-1 truncate font-mono text-[0.5rem] uppercase tracking-[0.14em] text-paper/70">
                digest · <Scramble text={p.digest} chars="hex" duration={1.3} />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* route pieces                                                        */
/* ------------------------------------------------------------------ */

function RouteEnd({
  code,
  label,
  sub,
  align = "left",
  toneClass = "text-ink",
}: {
  code: string;
  label: string;
  sub: string;
  align?: "left" | "right";
  toneClass?: string;
}) {
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <div className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-3">{label}</div>
      <SplitReveal className={`font-display text-[clamp(2.3rem,7vw,4rem)] font-bold leading-[0.9] tracking-tight ${toneClass}`}>
        {code}
      </SplitReveal>
      <div className="truncate font-mono text-[0.66rem] text-ink-2" title={sub}>
        {sub}
      </div>
    </div>
  );
}

function FlightPath() {
  return (
    <div className="mb-3 flex flex-1 items-center gap-1 text-route">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-route" />
      <span aria-hidden className="flex-1 border-t border-dashed border-route/50" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden>
        <path d="M22 12L3 4.5l3.2 7.5L3 19.5 22 12z" />
      </svg>
      <span aria-hidden className="flex-1 border-t border-dashed border-route/50" />
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* fields                                                              */
/* ------------------------------------------------------------------ */

function Cell({
  label,
  tone = "text-ink",
  children,
}: {
  label: string;
  tone?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l border-ink/10 px-3 py-2.5 first:border-l-0 first:pl-0">
      <div className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-ink-3">{label}</div>
      <div className={`mt-1 font-display text-xl font-semibold leading-none ${tone}`}>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  light = false,
  className = "",
}: {
  label: string;
  value: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className={`font-mono text-[0.56rem] uppercase tracking-[0.16em] ${light ? "text-paper/60" : "text-ink-3"}`}>
        {label}
      </div>
      <div className={`truncate font-mono text-[0.9rem] font-medium tracking-wide ${light ? "text-paper" : "text-ink"}`} title={value}>
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* codes + machine-readable zone                                       */
/* ------------------------------------------------------------------ */

/** A 3-letter "airport code" from a name (repo or archetype). */
function code3(s: string): string {
  const clean = s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (clean.slice(0, 3) || "CTO").padEnd(3, "X");
}

/** Deterministic pass number derived from repo + commit. */
function passportNo(p: Passport): string {
  let h = 0;
  for (const ch of p.repo + p.commit) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const s = h.toString(36).toUpperCase().padEnd(8, "0").slice(0, 8);
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

function pad(s: string, n = 44): string {
  return (s + "<".repeat(n)).slice(0, n);
}
function clean(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "<");
}
function mrz1(owner: string, name: string): string {
  return pad(`PC<CTO<${clean(owner)}<<${clean(name)}`);
}
function mrz2(p: Passport): string {
  const dg = clean(p.digest.replace("sha256:", "")).slice(0, 8);
  return pad(`${dg}<${p.files}F<${p.domainsCount}D<${p.crossDomain}X<${clean(p.grade)}`);
}
