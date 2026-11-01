"use client";

import type { RefObject } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, useGSAP } from "@/lib/gsap";

// Registered here, not in lib/gsap, so pages without world headlines don't ship it.
if (typeof window !== "undefined") gsap.registerPlugin(SplitText);

/**
 * Reveals a headline line by line (masked slide), once, when it scrolls into
 * view. Used only for the three world headlines (DESIGN_PLAN.md motion #15).
 */
export function useLineReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let split: SplitText | undefined;
      let tween: gsap.core.Tween | undefined;
      let cancelled = false;
      const run = () => {
        if (cancelled) return;
        split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "reveal-line" });
        tween = gsap.from(split.lines, {
          yPercent: 105,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      };
      // Split after fonts load so line breaks match the final layout.
      if (document.fonts?.status === "loaded") run();
      else document.fonts?.ready.then(run);
      // Created after an await, so outside useGSAP's context: clean up by hand.
      return () => {
        cancelled = true;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref },
  );
}
