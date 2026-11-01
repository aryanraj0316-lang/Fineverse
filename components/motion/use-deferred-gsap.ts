"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Setup = () => void | (() => void);

const queue = new Set<() => void>();
let frame = 0;

function flush() {
  frame = 0;
  const jobs = [...queue];
  queue.clear();
  jobs.forEach((job) => job());
  // One sort and one re-measure for everything set up in this frame.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

function schedule(job: () => void) {
  queue.add(job);
  if (!frame) frame = requestAnimationFrame(flush);
  return () => queue.delete(job);
}

/**
 * Like useGSAP, but the scroll choreography for a below-the-fold section is
 * built only when the section comes within one screen of the viewport. At
 * page load only the hero's timeline exists, which keeps the main thread free.
 *
 * Pins added this way grow the page *below* the visitor, so nothing on screen
 * moves. If the page loads already scrolled (a reload mid-page), every section
 * is built straight away so the restored position stays correct.
 */
export function useDeferredGSAP(setup: Setup, scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    let ctx: gsap.Context | undefined;
    let cleanup: void | (() => void);
    let cancel: (() => void) | undefined;
    const build = () => {
      cancel = schedule(() => {
        ctx = gsap.context(() => {
          cleanup = setup();
        }, el);
      });
    };

    let io: IntersectionObserver | undefined;
    if (window.scrollY > 10) build();
    else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry || (!entry.isIntersecting && entry.boundingClientRect.top > 0)) return;
          io?.disconnect();
          build();
        },
        { rootMargin: "100% 0px 100% 0px" },
      );
      io.observe(el);
    }

    return () => {
      io?.disconnect();
      cancel?.();
      if (typeof cleanup === "function") cleanup();
      ctx?.revert();
    };
    // The setup reads refs and stable props only; run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
