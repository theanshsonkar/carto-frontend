"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * PassportStage — reveals each [data-reveal] child with a crisp rise+fade as it
 * enters the viewport. The first block (above the fold) triggers on load, so it
 * doubles as the entrance. Snappy, square, on-brand — power3.out, short throw,
 * no bounce. Respects prefers-reduced-motion (shows everything instantly).
 */
export function PassportStage({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      items.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 22 });
        // This stage mounts on a phase change (scan → done), NOT a fresh page
        // load, so ScrollTrigger's onEnter can miss an element that is already
        // in the viewport — leaving the above-the-fold boarding pass stuck at
        // opacity:0. So reveal anything already on-screen immediately, and only
        // defer the below-the-fold blocks to their scroll trigger.
        const inView = el.getBoundingClientRect().top < window.innerHeight * 0.88;
        if (inView) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", delay: i * 0.08 });
        } else {
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }),
          });
        }
      });
      ScrollTrigger.refresh();
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
