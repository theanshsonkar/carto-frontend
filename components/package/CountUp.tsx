"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * CountUp — a number that animates from 0 to `value` the first time it scrolls
 * into view (so tiles below the fold still animate when reached). Respects
 * prefers-reduced-motion. Optional `decimals` / `format` for locale strings,
 * percentages, etc. On-brand: snappy power2.out, no easing theatrics.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1,
  format,
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const fmt = (n: number) => (format ? format(n) : n.toFixed(decimals));
      const reduced =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        el.textContent = fmt(value);
        return;
      }

      const obj = { n: 0 };
      el.textContent = fmt(0);
      const tween = gsap.to(obj, {
        n: value,
        duration,
        ease: "power2.out",
        paused: true,
        onUpdate: () => {
          el.textContent = fmt(obj.n);
        },
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
      };
    },
    { dependencies: [value] }
  );

  return <span ref={ref} className={className} />;
}
