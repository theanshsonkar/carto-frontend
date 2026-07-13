"use client";

import { useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(DrawSVGPlugin, useGSAP);

/**
 * InspectionStamp — the rotated "Carto · inspected" mark. Same look as the old
 * CSS stamp (double ink ring, under-inked via multiply blend, rotated), but the
 * rings now DRAW ON while the stamp thuds down and the grade fades in — like a
 * customs stamp being pressed and certified. Reduced-motion → static, drawn.
 */
export function InspectionStamp({
  grade,
  title,
  toneClass,
  posClass = "-top-3 right-4 md:right-8",
}: {
  grade: string;
  title: string;
  toneClass: string;
  posClass?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const rings = el.querySelectorAll("circle");
      const content = el.querySelector("[data-stamp-content]");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(el, { opacity: 0.82, scale: 1, rotate: -9 });
        gsap.set(rings, { drawSVG: "100%" });
        gsap.set(content, { opacity: 1 });
        return;
      }

      gsap.set(el, { opacity: 0, scale: 1.8, rotate: -9 });
      gsap.set(rings, { drawSVG: "0%" });
      gsap.set(content, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.55 });
      tl.to(el, { opacity: 0.82, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, 0)
        .to(rings, { drawSVG: "100%", duration: 0.5, stagger: 0.08, ease: "power2.inOut" }, 0.05)
        .to(content, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0.32);

      return () => {
        tl.kill();
      };
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className={`pointer-events-none absolute z-10 h-[112px] w-[112px] md:h-[132px] md:w-[132px] ${posClass} ${toneClass}`}
      style={{ mixBlendMode: "multiply", opacity: 0 }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="40.5" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div
        data-stamp-content
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em]">Carto · inspected</span>
        <span className="font-display text-4xl font-bold leading-none md:text-5xl">{grade}</span>
        <span className="max-w-[88%] font-mono text-[0.5rem] uppercase leading-tight tracking-[0.14em]">
          {title}
        </span>
      </div>
    </div>
  );
}
