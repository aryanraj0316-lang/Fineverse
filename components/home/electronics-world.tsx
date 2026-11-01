"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { useLineReveal } from "@/components/motion/use-line-reveal";
import { gsap } from "@/lib/gsap";
import { useDeferredGSAP } from "@/components/motion/use-deferred-gsap";
import { HeadphonesFigure, PART_ANCHORS } from "./headphones-figure";

type Part = keyof typeof PART_ANCHORS;

export interface PartLabel {
  part: Part;
  label: string;
  value: string;
}

/** Where each label sits, in % of the figure box (the figure fills 70% of the width, centred). */
const LABEL_POS: Record<Part, { x: number; y: number; side: "left" | "right" }> = {
  headband: { x: 0, y: 4, side: "left" },
  cushion: { x: 0, y: 46, side: "left" },
  driver: { x: 100, y: 58, side: "right" },
  mic: { x: 100, y: 22, side: "right" },
  shell: { x: 100, y: 86, side: "right" },
};

/** Exploded offsets for each part group, in viewBox units. */
const EXPLODE: Record<string, { x?: number; y?: number }> = {
  headband: { y: -70 },
  "shell-left": { x: -70 },
  "driver-left": { x: -18 },
  "cushion-left": { x: 46 },
  "cushion-right": { x: -46 },
  "driver-right": { x: 18 },
  "shell-right": { x: 70 },
};

/** Anchor positions after the explode (viewBox units). */
function explodedAnchor(part: Part) {
  const a = PART_ANCHORS[part];
  const shift =
    part === "headband" ? { x: 0, y: -70 } :
    part === "cushion" ? { x: 46, y: 0 } :
    part === "driver" ? { x: -18, y: 0 } :
    { x: 70, y: 0 };
  return { x: a.x + shift.x, y: a.y + shift.y };
}

export function ElectronicsWorld({
  product,
  labels,
  collectionHref,
}: {
  product: { title: string; href: string; price: string; summary: string };
  labels: PartLabel[];
  collectionHref: string;
}) {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  useLineReveal(headline);

  useDeferredGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 64rem)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motion, desktop, fine } = ctx.conditions as { motion: boolean; desktop: boolean; fine: boolean };
          const q = gsap.utils.selector(el);
          if (!motion) {
            // Reduced motion: the final, exploded frame with labels already drawn.
            for (const [part, offset] of Object.entries(EXPLODE)) gsap.set(q(`[data-part="${part}"]`), offset);
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            // Desktop pins the scene; on phones the section is taller than the
            // screen, so the explode simply plays as the figure scrolls past.
            scrollTrigger: desktop
              ? { trigger: el, start: "top top", end: "+=90%", pin: true, scrub: 0.5, anticipatePin: 1 }
              : { trigger: q(".ew-stage")[0], start: "top 80%", end: "bottom 45%", scrub: 0.8 },
          });
          tl.fromTo(q(".ew-figure"), { scale: 0.9, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }, 0);
          tl.fromTo(q(".ew-cone"), { opacity: 0.5 }, { opacity: 1, duration: 1.5 }, 0);
          for (const [part, offset] of Object.entries(EXPLODE)) {
            tl.to(q(`[data-part="${part}"]`), { ...offset, duration: 4, ease: "power2.inOut" }, 1.2);
          }
          q(".ew-line").forEach((line, i) => {
            tl.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2 }, 3.4 + i * 0.5);
          });
          tl.fromTo(q(".ew-label"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.5 }, 4);

          // A light that follows the cursor, as if you were holding a torch.
          if (fine) {
            const light = q(".ew-torch")[0] as HTMLElement | undefined;
            if (light) {
              const xTo = gsap.quickTo(light, "x", { duration: 0.6, ease: "power3.out" });
              const yTo = gsap.quickTo(light, "y", { duration: 0.6, ease: "power3.out" });
              const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                xTo(e.clientX - r.left);
                yTo(e.clientY - r.top);
              };
              el.addEventListener("pointermove", move);
              return () => el.removeEventListener("pointermove", move);
            }
          }
        },
      );
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="electronics-title" className="electronics-world on-dark relative isolate overflow-hidden bg-[#07080b] text-chalk">
      <Image src="/worlds/night-desktop.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-landscape -z-20 object-cover" />
      <Image src="/worlds/night-mobile.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-portrait -z-20 object-cover" />
      <div aria-hidden className="ew-cone" />
      <div aria-hidden className="ew-torch" />

      <div className="relative grid min-h-svh items-center gap-10 px-gutter pt-[calc(var(--nav-h)+2rem)] pb-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <h2 id="electronics-title" ref={headline} className="type-display text-display">
            Hear less noise.
          </h2>
          <p className="mt-5 max-w-[34ch] text-body-lg text-chalk/85">{product.summary}</p>
          <p className="mt-6 text-small text-chalk/70">
            {product.title} · <span data-price>{product.price}</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={collectionHref} className={buttonClasses("primary")}>
              Shop electronics
            </Link>
            <Link href={product.href} className={buttonClasses("secondary", "md", "border-chalk/35 text-chalk hover:border-chalk")}>
              View {product.title}
            </Link>
          </div>
        </div>

        <div className="ew-stage relative lg:col-span-8">
          <div className="ew-figure relative mx-auto w-[86%] lg:w-[58%]">
            <HeadphonesFigure />
            {/* Leader lines, in the figure's own coordinates. */}
            <svg viewBox="0 0 800 640" aria-hidden className="ew-lines pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
              {labels.map(({ part }) => {
                const a = explodedAnchor(part);
                const p = LABEL_POS[part];
                const lx = (p.x / 100) * 800 + (p.side === "left" ? -12 : 12);
                const ly = (p.y / 100) * 640;
                return (
                  <g key={part}>
                    <path
                      className="ew-line"
                      d={`M${a.x} ${a.y} L${(a.x + lx) / 2 + (p.side === "left" ? -30 : 30)} ${ly} L${lx} ${ly}`}
                      pathLength={1}
                      strokeDasharray="1"
                      fill="none"
                      stroke="rgb(255 255 255 / 0.55)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle cx={a.x} cy={a.y} r="3.5" fill="#fff" className="ew-label" />
                  </g>
                );
              })}
            </svg>
            {labels.map(({ part, label, value }) => {
              const p = LABEL_POS[part];
              return (
                <p
                  key={part}
                  className="ew-label absolute hidden w-[11rem] -translate-y-1/2 text-small lg:block"
                  style={{
                    top: `${p.y}%`,
                    ...(p.side === "left" ? { right: `calc(100% + 0.75rem)`, textAlign: "right" } : { left: `calc(100% + 0.75rem)` }),
                  }}
                >
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-chalk/75">{value}</span>
                </p>
              );
            })}
          </div>
          {/* Phones: the same specs as a list under the figure. */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-small lg:hidden">
            {labels.map(({ part, label, value }) => (
              <div key={part}>
                <dt className="font-semibold">{label}</dt>
                <dd className="text-chalk/75">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
