"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<RefObject<Lenis | null>>({ current: null });

/** The Lenis instance, or null with reduced motion. Read `.current` in event handlers. */
export const useLenis = () => useContext(LenisContext);

/**
 * One animation loop: Lenis is driven by GSAP's ticker (autoRaf off), and
 * every Lenis scroll updates ScrollTrigger. With reduced motion there is no
 * Lenis at all and the page scrolls natively.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false, // touch keeps native momentum: smoother on mid-range Android
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    const onTick = (time: number) => lenis.raf(time * 1000);
    const offScroll = lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;

    return () => {
      offScroll();
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Fonts change the wordmark's metrics after swap: re-measure once if they
  // weren't ready yet (each refresh re-measures every pinned section).
  useEffect(() => {
    if (document.fonts?.status === "loaded") return;
    let active = true;
    document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
    };
  }, []);

  // Route changes (not the first load): the new page has created its own
  // triggers by now, so re-measure once.
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = "";
    lenisRef.current?.resize();
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
