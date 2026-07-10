"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal - fades + rises its children into view once, when scrolled near.
 * CSS-only animation (`rise`), gated by an IntersectionObserver so below-fold
 * sections animate as you reach them instead of all at load.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${shown ? "rise" : "opacity-0"} ${className}`}
      style={shown ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
