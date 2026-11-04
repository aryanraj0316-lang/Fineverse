"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { ScrollFrames, type ScrollFramesHandle } from "@/components/motion/scroll-frames";
import { useDeferredGSAP } from "@/components/motion/use-deferred-gsap";
import { buttonClasses } from "@/components/ui/button";
import { componentLabelProgress } from "@/lib/breakdown-motion";
import type { FrameSources } from "@/lib/frames";
import { gsap } from "@/lib/gsap";

export interface AnatomyPart {
  id: string;
  name: string;
  spec: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
  anchorX?: number;
  anchorY?: number;
  rotation?: number;
}

export interface ProductAnatomyProps {
  id: string;
  kind: "headphones" | "watch";
  theme: "dark" | "light";
  eyebrow: string;
  title: string;
  product: { title: string; href: string; price: string; summary: string };
  assembledSrc: string;
  parts: AnatomyPart[];
  stats: { label: string; value: string }[];
  collectionHref?: string;
  frames?: FrameSources;
  background?: { desktop: string; mobile: string };
}

export function ProductAnatomy({ id, kind, theme, eyebrow, title, product, assembledSrc, parts, stats, collectionHref, frames, background }: ProductAnatomyProps) {
  const root = useRef<HTMLElement>(null);
  const player = useRef<ScrollFramesHandle>(null);
  const world = theme === "dark" ? "night" : "golden";

  useDeferredGSAP(() => {
    const element = root.current;
    if (!element) return;
    const labels = Array.from(element.querySelectorAll<HTMLElement>("[data-component-label]"));
    const paths = Array.from(element.querySelectorAll<SVGPathElement>("[data-component-line]"));
    const dots = Array.from(element.querySelectorAll<SVGCircleElement>("[data-component-dot]"));
    const progressBar = element.querySelector<HTMLElement>(".scrub-story-progress > span");
    const paint = (progress: number) => {
      element.dataset.scrubProgress = progress.toFixed(4);
      player.current?.render(progress);
      parts.forEach((_, index) => {
        const reveal = componentLabelProgress(progress, index);
        const label = labels[index];
        if (label) {
          label.style.opacity = String(reveal);
          label.style.visibility = reveal > .01 ? "visible" : "hidden";
          label.style.transform = `translate(-50%, calc(-50% + ${(1 - reveal) * 8}px))`;
        }
        const line = paths[index];
        if (line) { line.style.strokeDashoffset = String(1 - reveal); line.style.opacity = String(reveal); }
        if (dots[index]) dots[index]!.style.opacity = String(reveal);
      });
      if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    };
    const mm = gsap.matchMedia();
    mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduce) {
        element.dataset.scrubReady = "static";
        paint(1);
        return;
      }
      const playhead = { progress: 0 };
      paint(0);
      const timeline = gsap.timeline({
        onUpdate: () => paint(playhead.progress),
        scrollTrigger: {
          id: `product-${id}`,
          trigger: element,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 2.2),
          pin: true,
          scrub: .35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            element.dataset.scrollStart = String(self.start);
            element.dataset.scrollEnd = String(self.end);
            paint(playhead.progress);
          },
        },
      });
      timeline.to(playhead, { progress: 1, duration: 1, ease: "none" });
      element.dataset.scrubReady = "true";
      return () => { delete element.dataset.scrubReady; };
    });
    return () => mm.revert();
  }, root);

  const poster = frames?.desktop ? `${frames.desktop.path}/0001.webp` : assembledSrc;
  return (
    <section ref={root} id={id} aria-labelledby={`${id}-title`} data-scrub-product={kind} data-scrub-progress="0" className={`scroll-product-scene scene-${world}${theme === "dark" ? " on-dark" : ""} ${kind === "headphones" ? "electronics-world" : "watch-story"}`}>
      <Image src={background?.desktop ?? `/worlds/${world}-desktop.webp`} alt="" fill sizes="100vw" quality={background ? 85 : 60} className="ci-world-landscape scene-background object-cover" />
      <Image src={background?.mobile ?? `/worlds/${world}-mobile.webp`} alt="" fill sizes="100vw" quality={background ? 85 : 60} className="ci-world-portrait scene-background object-cover" />
      <div className="scene-product-scrim" aria-hidden />
      <div className="scroll-product-inner">
        <div className="scroll-product-copy">
          <p className="scroll-product-eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="type-display">{title}</h2>
          <p className="scroll-product-summary">{product.summary}</p>
          <p className="scroll-product-price">{product.title}<span aria-hidden> · </span><span data-price>{product.price}</span></p>
          <div className="scroll-product-actions">
            <Link href={product.href} className={buttonClasses("primary", "md")}>Explore {product.title}</Link>
            {collectionHref && <Link href={collectionHref} className="scroll-product-collection">Shop the collection</Link>}
          </div>
          <div className="scrub-story-progress" aria-hidden><span /></div>
          <p className="scroll-product-hint"><ArrowDown size={14} strokeWidth={1.5} aria-hidden />Scroll to explore the details</p>
        </div>

        <div className="scroll-product-visual">
          <div className="scroll-product-stage" role="img" aria-label={`${product.title}: scroll-controlled component breakdown`}>
            {frames ? <ScrollFrames ref={player} sources={frames} fallbackSrc={poster} fallbackAlt="" transparent releaseOffscreen mobileMedia="(max-width: 49.99rem) and (orientation: portrait)" reducedMotionProgress={1} className="scroll-product-canvas" /> : <Image src={assembledSrc} alt="" fill unoptimized className="object-contain" />}
            <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className="scroll-product-lines" aria-hidden>
              {parts.map((part) => {
                const x = (part.anchorX ?? part.x) * 10, y = (part.anchorY ?? part.y) * 8;
                const lx = part.labelX * 10, ly = part.labelY * 8;
                return <g key={part.id}><path data-component-line={part.id} d={`M${x} ${y}L${(x + lx) / 2} ${ly}L${lx} ${ly}`} pathLength="1" /><circle data-component-dot={part.id} cx={x} cy={y} r="3" /></g>;
              })}
            </svg>
            {parts.map((part, index) => <div key={part.id} data-component-label={part.id} className="scroll-product-callout" style={{ left: `${part.labelX}%`, top: `${part.labelY}%` }}><span className="scroll-product-label-index" aria-hidden>{String(index + 1).padStart(2, "0")}</span><div><h3>{part.name}</h3><p>{part.spec}</p></div></div>)}
          </div>
        </div>
        <dl className="scroll-product-stats">{stats.map((stat) => <div key={stat.label}><dd>{stat.value}</dd><dt>{stat.label}</dt></div>)}</dl>
        <ul className="sr-only">{parts.map((part) => <li key={part.id}>{part.name}: {part.spec}. {part.description}</li>)}</ul>
      </div>
    </section>
  );
}
