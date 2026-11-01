"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { QuickAddButton } from "@/components/shop/add-to-cart-button";
import { gsap } from "@/lib/gsap";
import { useDeferredGSAP } from "@/components/motion/use-deferred-gsap";

export interface Exhibit {
  handle: string;
  title: string;
  href: string;
  price: string;
  meta: string;
  variantId?: string;
  needsChoice: boolean;
  available: boolean;
  cutout: { src: string; width: number; height: number };
  /** Rendered width on the plinth, as a fraction of the plinth width. */
  scale: number;
}

/**
 * Bestsellers as an exhibition: each product on its own stone plinth with a
 * placard. Desktop: the row slides past while the section is pinned.
 * Phones: a native swipe row with snap points.
 */
export function Bestsellers({ items, viewAllHref }: { items: Exhibit[]; viewAllHref: string }) {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
        const track = el.querySelector<HTMLElement>(".bs-track");
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - el.clientWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="bestsellers-title" className="bestsellers relative isolate overflow-hidden bg-stone">
      <Image src="/worlds/morning-desktop.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-landscape -z-20 object-cover object-bottom" />
      <Image src="/worlds/morning-mobile.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-portrait -z-20 object-cover object-bottom" />

      <div className="flex min-h-svh flex-col pt-[calc(var(--nav-h)+2.5rem)] pb-10">
        <div className="flex items-end justify-between gap-6 px-gutter">
          <div>
            <h2 id="bestsellers-title" className="type-heading text-h2">
              Bestsellers
            </h2>
          </div>
          <Link href={viewAllHref} className="shrink-0 text-small font-medium underline decoration-basalt/30 underline-offset-4 hover:decoration-basalt">
            View all
          </Link>
        </div>

        <div className="bs-scroller mt-auto">
          <ul className="bs-track">
            {items.map((item) => (
              <li key={item.handle} className="bs-exhibit" data-product-card>
                <div className="bs-stage">
                  <div className="bs-shadow" aria-hidden />
                  <Image
                    src={item.cutout.src}
                    alt={item.title}
                    width={item.cutout.width}
                    height={item.cutout.height}
                    sizes="(min-width: 64rem) 20vw, 50vw"
                    quality={85}
                    className="bs-product"
                    style={{ width: `${item.scale * 100}%` }}
                  />
                </div>
                <div className="bs-plinth" aria-hidden />
                <div className="bs-placard">
                  <Link href={item.href} className="block">
                    <h3 className="text-small font-semibold">{item.title}</h3>
                    <p className="text-micro text-basalt/70">{item.meta}</p>
                  </Link>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span data-price className="text-small font-semibold">
                      {item.price}
                    </span>
                    <QuickAddButton
                      variantId={item.variantId}
                      href={item.href}
                      needsChoice={item.needsChoice}
                      available={item.available}
                      imageSelector=".bs-product"
                      className="h-10 px-4 text-small"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
