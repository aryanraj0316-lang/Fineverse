"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export function ProductSpin({ frames, title, colour }: { frames: string[]; title: string; colour: string }) {
  const instructionsId = useId();
  const [frame, setFrame] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const drag = useRef<{ x: number; frame: number } | null>(null);
  const count = frames.length;
  const step = (delta: number) => setFrame((current) => (current + delta + count) % count);

  useEffect(() => {
    let cancelled = false;
    const images = frames.map((src) => {
      const img = new window.Image();
      return new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Could not load ${src}`));
        img.src = src;
      });
    });
    Promise.all(images).then(() => { if (!cancelled) setStatus("ready"); }).catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [frames]);

  return (
    <section aria-label={`${title} 360 degree view`} className="overflow-hidden rounded-surface border border-basalt/10 bg-[#f5f0e9]">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 text-small">
        <span className="rounded-full border border-basalt/20 px-3 py-1 font-medium">360° view</span>
        <span className="text-basalt/60">{colour} · {frame * 360 / count}°</span>
      </div>
      <div
        role="slider"
        tabIndex={status === "ready" ? 0 : -1}
        aria-label={`Rotate ${title}`}
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={frame}
        aria-valuetext={`${frame * 360 / count} degrees, angle ${frame + 1} of ${count}`}
        aria-describedby={instructionsId}
        className="relative aspect-square touch-pan-y cursor-grab select-none outline-offset-[-4px] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-cobalt lg:aspect-auto lg:h-[min(58vh,40rem)]"
        onKeyDown={(event) => {
          if (status !== "ready") return;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) event.preventDefault();
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
          if (event.key === "Home") setFrame(0);
          if (event.key === "End") setFrame(count - 1);
        }}
        onPointerDown={(event) => {
          if (status !== "ready" || (event.pointerType === "mouse" && event.button !== 0)) return;
          drag.current = { x: event.clientX, frame };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const offset = Math.round((event.clientX - drag.current.x) / 32);
          setFrame(((drag.current.frame + offset) % count + count) % count);
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}
      >
        <Image src={frames[frame]!} alt={`${title} in ${colour}, ${frame * 360 / count} degree view`} fill sizes="(min-width: 64rem) 58vw, 100vw" unoptimized draggable={false} data-gallery-image="" className="pointer-events-none object-contain" />
      </div>
      <p id={instructionsId} className="sr-only" role="status">
        {status === "loading" ? "Loading product angles" : status === "error" ? "Angles could not load. Switch to Photos or reload to try again." : "Drag or use the arrow keys to rotate the product"}
      </p>
    </section>
  );
}
