"use client";

import { useEffect, useRef } from "react";

const KEY = "fineverse:intro-seen";

/**
 * Runs before first paint (inline in the HTML): marks <html> so the intro
 * overlay covers the hero from the very first frame on a first visit.
 */
export const introScript = `try{if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="play"}catch(e){}`;

/**
 * First visit only, 1.15 s, skippable. The F mark draws itself, then the stone
 * overlay wipes upward to reveal the hero already in its first frame.
 *
 * The animation is pure CSS (see .intro in globals.css), so it starts at first
 * paint and never waits for JavaScript. This component only handles skipping
 * and remembering that the intro has been seen this session.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = ref.current;
    if (!overlay || root.dataset.intro !== "play") return;

    const done = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      delete root.dataset.intro;
    };
    const finish = (event: AnimationEvent) => {
      if (event.target === overlay) done();
    };
    // Slow hydration: the CSS animation may already have finished.
    if (getComputedStyle(overlay).visibility === "hidden") return done();
    const skip = () => overlay.classList.add("intro--skip");
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

    overlay.addEventListener("animationend", finish);
    events.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
    return () => {
      overlay.removeEventListener("animationend", finish);
      events.forEach((e) => window.removeEventListener(e, skip));
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="intro">
      <svg viewBox="0 0 32 32" className="size-24">
        <path
          d="M9 7h15.5l-2.2 4.4H13.6v3.5h7.6l-2.2 4.4h-5.4V25H9z"
          fill="#1d1c1a"
          stroke="#1d1c1a"
          strokeWidth="0.6"
          strokeLinejoin="round"
          pathLength={100}
        />
      </svg>
    </div>
  );
}
