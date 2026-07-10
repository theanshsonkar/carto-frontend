"use client";

/**
 * ToolStrip - the "Auto-wires into" strip: an infinite scrolling row of the
 * real tool brand marks. The track renders the list twice and translates by
 * -50% for a seamless loop; it pauses on hover and respects reduced-motion.
 * Edges fade via a mask so logos slide in/out softly. Logos are the real
 * brand SVGs served from /public/logos.
 */

const TOOLS = [
  { name: "Cursor", logo: "/logos/cursor.svg" },
  { name: "Claude Code", logo: "/logos/claude.svg" },
  { name: "Codex", logo: "/logos/codex.svg" },
  { name: "Copilot", logo: "/logos/copilot.svg" },
  { name: "VS Code", logo: "/logos/vscode.svg" },
  { name: "Zed", logo: "/logos/zed.svg" },
  { name: "Windsurf", logo: "/logos/windsurf.svg" },
  { name: "JetBrains", logo: "/logos/jetbrains.svg" },
  { name: "Kiro", logo: "/logos/kiro.svg" },
];

function Item({ name, logo }: { name: string; logo: string }) {
  return (
    <li className="flex shrink-0 items-center gap-2.5 px-7">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={`${name} logo`}
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
        loading="lazy"
        draggable={false}
      />
      <span className="whitespace-nowrap font-mono text-[0.82rem] tracking-tight text-ink-2">
        {name}
      </span>
    </li>
  );
}

export function ToolStrip() {
  return (
    <section className="border-b border-line bg-panel">
      <div className="shell py-10">
        <p className="text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">
          Auto-wires into
        </p>

        <div className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <ul
            className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ ["--marquee-duration" as string]: "42s" }}
            aria-hidden="true"
          >
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <Item key={i} name={t.name} logo={t.logo} />
            ))}
          </ul>

          {/* static, screen-reader-only list of the real names */}
          <ul className="sr-only">
            {TOOLS.map((t) => (
              <li key={t.name}>{t.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
