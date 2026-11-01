"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { useLineReveal } from "@/components/motion/use-line-reveal";
import { gsap } from "@/lib/gsap";
import { useDeferredGSAP } from "@/components/motion/use-deferred-gsap";

export interface WatchSpec {
  part: "glass" | "crown" | "strap";
  label: string;
  value: string;
}

/** Points on the watch cut-out (fractions of its width/height) each spec connects to. */
const ANCHORS: Record<WatchSpec["part"], { x: number; y: number }> = {
  glass: { x: 0.33, y: 0.4 },
  crown: { x: 0.69, y: 0.325 },
  strap: { x: 0.86, y: 0.72 },
};

export function WatchStory({
  product,
  specs,
  watch,
}: {
  product: { title: string; href: string; price: string; summary: string };
  specs: WatchSpec[];
  watch: { src: string; width: number; height: number };
}) {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  useLineReveal(headline);

  useDeferredGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const img = q(".ws-watch")[0] as HTMLElement | undefined;
      const svg = q(".ws-lines")[0] as SVGSVGElement | undefined;

      // Leader lines are measured from the real layout: watch anchor → label edge.
      const layout = () => {
        if (!img || !svg) return;
        const box = el.getBoundingClientRect();
        const w = img.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
        for (const spec of specs) {
          const label = q(`.ws-spec[data-part="${spec.part}"]`)[0] as HTMLElement | undefined;
          const path = q(`.ws-line[data-part="${spec.part}"]`)[0] as SVGPathElement | undefined;
          const dot = q(`.ws-dot[data-part="${spec.part}"]`)[0] as SVGCircleElement | undefined;
          if (!label || !path || !dot) continue;
          // Measure against the untransformed watch so lines land on the final pose.
          const a = ANCHORS[spec.part];
          const ax = w.left - box.left + a.x * w.width;
          const ay = w.top - box.top + a.y * w.height;
          const l = label.getBoundingClientRect();
          const toLeft = l.left - box.left > ax;
          const lx = toLeft ? l.left - box.left - 12 : l.right - box.left + 12;
          const ly = l.top - box.top + 12;
          path.setAttribute("d", `M${ax} ${ay} L${(ax + lx) / 2} ${ly} L${lx} ${ly}`);
          dot.setAttribute("cx", String(ax));
          dot.setAttribute("cy", String(ay));
        }
      };

      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 64rem)" },
        (ctx) => {
          const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
          if (!desktop) return; // phones: specs are a list, no lines
          gsap.set(img ?? [], { rotation: 0, scale: 1 });
          layout();
          if (!motion) return;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=80%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              onRefresh: () => {
                const p = tl.progress();
                tl.progress(1);
                layout();
                tl.progress(p);
              },
            },
          });
          tl.fromTo(img ?? [], { rotation: -14, scale: 1.08, xPercent: 6 }, { rotation: 0, scale: 1, xPercent: 0, duration: 6, ease: "power2.out" }, 0);
          specs.forEach((spec, i) => {
            const start = 1.5 + i * 1.4;
            tl.fromTo(q(`.ws-line[data-part="${spec.part}"]`), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1 }, start);
            tl.fromTo(q(`.ws-dot[data-part="${spec.part}"]`), { opacity: 0 }, { opacity: 1, duration: 0.3 }, start);
            tl.fromTo(q(`.ws-spec[data-part="${spec.part}"]`), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, start + 0.7);
          });
          tl.to({}, { duration: 1 }); // hold the finished state briefly
        },
      );
      window.addEventListener("resize", layout);
      return () => {
        window.removeEventListener("resize", layout);
        mm.revert();
      };
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="watch-title" className="watch-story relative isolate overflow-hidden bg-[#c9a27a]">
      <Image src="/worlds/golden-desktop.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-landscape -z-20 object-cover" />
      <Image src="/worlds/golden-mobile.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-portrait -z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(243_233_222/0.55),transparent_55%)]" />

      <div className="ws-watch-wrap" aria-hidden>
        <Image
          src={watch.src}
          alt=""
          width={watch.width}
          height={watch.height}
          sizes="(min-width: 64rem) 75vw, 130vw"
          quality={85}
          className="ws-watch h-auto w-full"
        />
      </div>

      <svg aria-hidden className="ws-lines pointer-events-none absolute inset-0 hidden h-full w-full lg:block">
        {specs.map((s) => (
          <g key={s.part}>
            <path className="ws-line" data-part={s.part} pathLength={1} strokeDasharray="1" fill="none" stroke="#1d1c1a" strokeWidth="1" />
            <circle className="ws-dot" data-part={s.part} r="4" fill="#1d1c1a" />
          </g>
        ))}
      </svg>

      <div className="relative flex min-h-svh flex-col justify-end px-gutter pt-[124vw] pb-16 lg:pt-0 lg:pb-20">
        <div className="max-w-xl">
          <h2 id="watch-title" ref={headline} className="type-display max-w-[9ch] text-display">
            Built for every day.
          </h2>
          <p className="mt-5 max-w-[36ch] text-body-lg">{product.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href={product.href} className={buttonClasses("primary")}>
              View {product.title}
            </Link>
            <span data-price className="text-body">
              {product.price}
            </span>
          </div>
        </div>

        {specs.map((s) => (
          <p key={s.part} data-part={s.part} className={`ws-spec ws-spec--${s.part} text-small`}>
            <span className="block font-semibold">{s.label}</span>
            <span className="block text-basalt/75">{s.value}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
