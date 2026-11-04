"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { FrameSet, FrameSources } from "@/lib/frames";
import { ScrollTrigger } from "@/lib/gsap";
import { cx } from "@/lib/cx";

export interface ScrollFramesHandle {
  /** Draw the frame for a progress value between 0 and 1. Cheap to call every tick. */
  render: (progress: number) => void;
}

interface Props {
  sources: FrameSources;
  /** Shown before the first frame decodes, with reduced motion, and if loading fails. */
  fallbackSrc: string;
  fallbackAlt?: string;
  /** Frame shown with reduced motion (0–1). Defaults to the last frame. */
  reducedMotionProgress?: number;
  /**
   * Standalone mode: scrub through the frames as `trigger` scrolls between
   * start and end. Leave out when a parent timeline calls `render()`.
   */
  trigger?: () => Element | null;
  start?: string;
  end?: string;
  className?: string;
  /** Keep the scene behind transparent product frames visible. */
  transparent?: boolean;
  /** Free decoded frames while a below-the-fold scene is off screen. */
  releaseOffscreen?: boolean;
  /** Optional breakpoint for sequences whose composition follows CSS layout. */
  mobileMedia?: string;
}

/**
 * Canvas player for video-scrubbed sequences.
 *
 * Improvements on reference-project/components/hero-scroll-canvas.tsx:
 * - no RAF loop of its own: draws only when the frame index changes;
 * - fetch + createImageBitmap decodes off the main thread;
 * - progressive order: poster, then every 8th frame, every 4th, every 2nd, the
 *   rest, so scrubbing works early and sharpens as frames arrive;
 * - desktop or mobile set chosen by aspect ratio (re-checked on resize);
 * - pauses drawing and loading while off-screen; frees bitmaps on unmount;
 * - cover-fit with DPR capped at 2; still-image fallback and reduced motion.
 */
export const ScrollFrames = forwardRef<ScrollFramesHandle, Props>(function ScrollFrames(
  { sources, fallbackSrc, fallbackAlt = "", reducedMotionProgress = 1, trigger, start = "top top", end = "bottom bottom", className, transparent = false, releaseOffscreen = false, mobileMedia },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const api = useRef<{ render: (p: number) => void }>({ render: () => {} });

  useImperativeHandle(ref, () => ({ render: (p: number) => api.current.render(p) }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: transparent });
    const handle = api.current;
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pickSet = (): FrameSet | undefined =>
      (mobileMedia ? window.matchMedia(mobileMedia).matches : window.innerWidth / window.innerHeight < 1) ? sources.mobile ?? sources.desktop : sources.desktop ?? sources.mobile;

    let set = pickSet();
    let frames: (ImageBitmap | undefined)[] = [];
    let abort = new AbortController();
    let visible = !releaseOffscreen;
    let released = releaseOffscreen;
    const waiting = new Set<() => void>();
    const wakeLoader = () => { waiting.forEach((resume) => resume()); waiting.clear(); };
    let progress = reduce ? reducedMotionProgress : 0;
    let drawn = -1;
    let sizeKey = "";

    const url = (s: FrameSet, i: number) => `${s.path}/${String(i + 1).padStart(s.pad, "0")}.webp`;

    // Poster first, then every 8th, 4th, 2nd frame, then the rest.
    const loadOrder = (count: number) => {
      const target = Math.round(progress * (count - 1));
      const seen = new Set<number>([target, 0]);
      const order = target === 0 ? [0] : [target, 0];
      for (const step of [8, 4, 2, 1]) {
        for (let i = 0; i < count; i += step) {
          if (seen.has(i)) continue;
          seen.add(i);
          order.push(i);
        }
      }
      if (!seen.has(count - 1)) order.push(count - 1);
      return order;
    };

    const nearestLoaded = (index: number) => {
      for (let d = 0; d < frames.length; d++) {
        if (frames[index - d]) return index - d;
        if (frames[index + d]) return index + d;
      }
      return -1;
    };

    const draw = (force = false) => {
      if (!set || !visible) return;
      const target = Math.round(progress * (set.count - 1));
      canvas.dataset.targetFrame = String(target);
      const index = nearestLoaded(target);
      if (index < 0) return;
      const key = `${canvas.width}x${canvas.height}`;
      if (!force && index === drawn && key === sizeKey) return;
      const bitmap = frames[index]!;
      // cover-fit
      const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height);
      const w = bitmap.width * scale;
      const h = bitmap.height * scale;
      if (transparent) ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      drawn = index;
      canvas.dataset.frame = String(index);
      canvas.dataset.targetFrame = String(target);
      canvas.dataset.progress = progress.toFixed(4);
      sizeKey = key;
      if (fallbackRef.current) fallbackRef.current.style.opacity = "0";
    };

    const load = async (s: FrameSet, signal: AbortSignal) => {
      const order = reduce ? [Math.round(reducedMotionProgress * (s.count - 1))] : loadOrder(s.count);
      const queue = [...order];
      const worker = async () => {
        while (queue.length && !signal.aborted) {
          if (!visible) await new Promise<void>((resolve) => {
            const resume = () => { waiting.delete(resume); signal.removeEventListener("abort", resume); resolve(); };
            waiting.add(resume);
            signal.addEventListener("abort", resume, { once: true });
          });
          if (signal.aborted) return;
          const i = queue.shift()!;
          try {
            const res = await fetch(url(s, i), { signal });
            const bitmap = await createImageBitmap(await res.blob());
            if (signal.aborted) {
              bitmap.close();
              return;
            }
            frames[i] = bitmap;
            const target = Math.round(progress * (s.count - 1));
            // Redraw if this frame is closer to the target than what's on screen.
            if (drawn < 0 || Math.abs(i - target) < Math.abs(drawn - target)) draw(true);
          } catch {
            if (signal.aborted) return;
          }
        }
      };
      await Promise.all(Array.from({ length: 4 }, worker));
    };

    const reset = () => {
      abort.abort();
      frames.forEach((b) => b?.close());
      frames = [];
      drawn = -1;
      abort = new AbortController();
      if (set) {
        canvas.dataset.frameCount = String(set.count);
        frames = new Array(set.count);
        if (visible) { released = false; void load(set, abort.signal); }
        else released = true;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const next = pickSet();
      if (next !== set) {
        set = next;
        reset();
      } else draw(true);
    };

    let resizeFrame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) {
        if (released) reset();
        else wakeLoader();
        draw(true);
      } else if (releaseOffscreen) {
        abort.abort();
        wakeLoader();
        frames.forEach((bitmap) => bitmap?.close());
        frames = [];
        drawn = -1;
        released = true;
      }
    });
    io.observe(canvas);

    handle.render = (p: number) => {
      if (reduce) return;
      progress = Math.min(1, Math.max(0, p));
      canvas.dataset.progress = progress.toFixed(4);
      draw();
    };

    resize();
    reset();

    let st: ScrollTrigger | undefined;
    const triggerEl = trigger?.();
    if (triggerEl && !reduce) {
      st = ScrollTrigger.create({
        trigger: triggerEl,
        start,
        end,
        scrub: true,
        onUpdate: (self) => handle.render(self.progress),
      });
    }

    return () => {
      st?.kill();
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(resizeFrame);
      abort.abort();
      wakeLoader();
      frames.forEach((b) => b?.close());
      frames = [];
      handle.render = () => {};
    };
  }, [sources, reducedMotionProgress, trigger, start, end, transparent, releaseOffscreen, mobileMedia]);

  return (
    <div className={cx("relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- poster shown until the first frame decodes */}
      <img
        ref={fallbackRef}
        src={fallbackSrc}
        alt={fallbackAlt}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
    </div>
  );
});
