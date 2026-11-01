"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { useLineReveal } from "@/components/motion/use-line-reveal";
import { gsap } from "@/lib/gsap";
import { useDeferredGSAP } from "@/components/motion/use-deferred-gsap";

/**
 * Clothing in morning light. The camera pushes into the folded overshirt until
 * its fabric fills the screen, then the headline settles over the weave.
 * (A `shirt-unfold` frame sequence could replace the push-in; see README.)
 */
export function ClothingWorld({
  product,
  collectionHref,
  shirt,
}: {
  product: { title: string; href: string; price: string; summary: string };
  collectionHref: string;
  shirt: { src: string; width: number; height: number };
}) {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  useLineReveal(headline);

  useDeferredGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", portrait: "(orientation: portrait)" }, (ctx) => {
        const { motion, portrait } = ctx.conditions as { motion: boolean; portrait: boolean };
        if (!motion) return;
        const q = gsap.utils.selector(el);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=90%", pin: true, scrub: 0.5, anticipatePin: 1 },
        });
        tl.fromTo(q(".cw-shirt"), { scale: 1, rotation: -6, yPercent: 4 }, { scale: portrait ? 3.4 : 3.1, rotation: 0, yPercent: 0, duration: 6, ease: "power2.inOut" }, 0);
        tl.fromTo(q(".cw-morning"), { opacity: 0.35 }, { opacity: 0.85, duration: 6 }, 0);
        tl.fromTo(q(".cw-scrim"), { opacity: 0 }, { opacity: 1, duration: 2 }, 3.8);
        tl.fromTo(q(".cw-copy"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, 4.2);
        tl.to({}, { duration: 1.2 });
      });
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="clothing-title" className="clothing-world relative isolate h-svh min-h-[34rem] overflow-hidden bg-[#e9e4dc]">
      <Image src="/worlds/morning-desktop.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-landscape -z-20 object-cover" />
      <Image src="/worlds/morning-mobile.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-portrait -z-20 object-cover" />

      <div className="cw-shirt-wrap" aria-hidden>
        <Image src={shirt.src} alt="" width={shirt.width} height={shirt.height} sizes="(orientation: portrait) 90vw, 46vw" quality={85} className="cw-shirt h-auto w-full" />
      </div>
      {/* Soft morning light falling from the upper left. */}
      <div aria-hidden className="cw-morning" />
      <div aria-hidden className="cw-scrim" />

      <div className="cw-copy on-dark absolute inset-x-0 bottom-0 px-gutter pb-14 text-chalk lg:pb-20">
        <h2 id="clothing-title" ref={headline} className="type-display max-w-[14ch] text-display">
          380 gsm brushed cotton.
        </h2>
        <p className="mt-5 max-w-[42ch] text-body-lg text-chalk/90">{product.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={collectionHref} className={buttonClasses("primary")}>
            Shop clothing
          </Link>
          <Link href={product.href} className={buttonClasses("secondary", "md", "border-chalk/40 text-chalk hover:border-chalk")}>
            {product.title} · <span data-price>{product.price}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
