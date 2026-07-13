"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

/** Char sets tuned to the passport's document language. */
const SETS: Record<string, string> = {
  mrz: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",
  hex: "0123456789abcdef",
  code: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
};

/**
 * Scramble — text that "decodes" into its final value the first time it scrolls
 * into view, like a scanner reading a passport chip. Perfect for the MRZ, the
 * content digest, and the pass number. Reduced-motion → shows final text at once.
 */
export function Scramble({
  text,
  chars = "code",
  duration = 1.1,
  delay = 0,
  className,
}: {
  text: string;
  chars?: "mrz" | "hex" | "code" | string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      el.textContent = text;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const charSet = SETS[chars] ?? chars;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 95%",
        once: true,
        onEnter: () =>
          gsap.to(el, {
            duration,
            delay,
            scrambleText: { text, chars: charSet, speed: 0.5 },
          }),
      });
      return () => st.kill();
    },
    { dependencies: [text] }
  );

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
