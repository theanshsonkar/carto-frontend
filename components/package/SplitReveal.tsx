"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * SplitReveal — reveals a short headline character-by-character as it enters
 * view (SplitText). Used for the "PASSPORT" document title. Reduced-motion →
 * plain text, no split.
 */
export function SplitReveal({
  children,
  className,
  duration = 0.5,
  stagger = 0.035,
  delay = 0,
}: {
  children: string;
  className?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const split = SplitText.create(el, { type: "chars", charsClass: "inline-block" });
      const tween = gsap.from(split.chars, {
        yPercent: 115,
        opacity: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        paused: true,
      });
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => tween.play(),
      });
      return () => {
        st.kill();
        tween.kill();
        split.revert();
      };
    },
    { dependencies: [children] }
  );

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", overflow: "hidden" }}>
      {children}
    </span>
  );
}
