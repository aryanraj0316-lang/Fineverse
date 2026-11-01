"use client";

import { useEffect, useRef } from "react";
import { useUi } from "@/stores/ui";

/**
 * Place inside a hero, as its first child. The nav stays transparent only
 * while the hero is at rest at the top of the viewport (or pinned there).
 * As soon as the hero starts moving under the nav, the nav turns solid, so
 * hero content never passes behind the nav links.
 */
export function NavSentinel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { setOverHero } = useUi.getState();

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setOverHero(entry.isIntersecting);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      // Leaving the page (or Activity hiding it): the nav must not stay transparent.
      setOverHero(false);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-nav-sentinel
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-px"
    />
  );
}
