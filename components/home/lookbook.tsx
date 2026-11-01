"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import { QuickAddButton } from "@/components/shop/add-to-cart-button";
import { gsap } from "@/lib/gsap";
import { useDeferredGSAP } from "@/components/motion/use-deferred-gsap";
import { cx } from "@/lib/cx";

export interface Hotspot {
  handle: string;
  x: number;
  y: number;
  title: string;
  href: string;
  price: string;
  variantId?: string;
  needsChoice: boolean;
  available: boolean;
}

interface Img {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Magazine spread: one large image with two smaller ones overlapping its edges,
 * moving at different speeds. "+" hotspots open a small card for each product.
 */
export function Lookbook({ main, details, hotspots }: { main: Img; details: [Img, Img]; hotspots: Hotspot[] }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  useDeferredGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 25rem) and (prefers-reduced-motion: no-preference)", () => {
        const scroll = { trigger: el, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(".lb-detail-a", { y: 70 }, { y: -70, ease: "none", scrollTrigger: scroll });
        gsap.fromTo(".lb-detail-b", { y: -40 }, { y: 40, ease: "none", scrollTrigger: scroll });
      });
      return () => mm.revert();
    },
    root,
  );

  // Close the card on Escape or a click elsewhere.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-hotspot]")) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <section ref={root} aria-labelledby="lookbook-title" className="relative px-gutter py-24 lg:py-36">
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <h2 id="lookbook-title" className="type-heading text-h2">
            Lookbook
          </h2>
          <p className="mt-2 max-w-[40ch] text-body text-basalt/75">The kit on the terrace, late afternoon. Tap a + to see each piece.</p>
        </div>
      </div>

      <div className="relative mx-auto lg:w-[78%]">
        <div className="lb-main relative overflow-hidden">
          <Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(min-width: 64rem) 78vw, 100vw" quality={75} className="h-auto w-full" />
          {hotspots.map((h) => {
            const isOpen = open === h.handle;
            return (
              <div key={h.handle} data-hotspot data-product-card className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={`${h.title}, ${h.price}`}
                  onClick={() => setOpen(isOpen ? null : h.handle)}
                  className={cx(
                    "lb-hotspot grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-chalk/90 text-basalt shadow-[0_4px_16px_-4px_rgb(29_28_26/0.4)] transition-transform hover:scale-110",
                    isOpen && "rotate-45",
                  )}
                >
                  <Plus aria-hidden className="size-4" strokeWidth={2} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
                      className={cx(
                        "absolute bottom-7 z-10 w-60 rounded-surface bg-chalk p-4 text-basalt shadow-[0_16px_40px_-16px_rgb(29_28_26/0.45)]",
                        h.x > 60 ? "right-0" : "left-0",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link href={h.href} className="text-small font-semibold hover:underline">
                          {h.title}
                        </Link>
                        <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="-mt-1 -mr-1 grid size-7 place-items-center rounded-full hover:bg-basalt/5">
                          <X aria-hidden className="size-4" strokeWidth={1.75} />
                        </button>
                      </div>
                      <p data-price className="mt-1 text-small text-basalt/70">
                        {h.price}
                      </p>
                      <QuickAddButton
                        variantId={h.variantId}
                        href={h.href}
                        needsChoice={h.needsChoice}
                        available={h.available}
                        className="mt-3 h-10 w-full text-small"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 lg:contents">
          <div className="lb-detail-a overflow-hidden lg:absolute lg:top-[8%] lg:-left-[16%] lg:w-[24%]">
            <Image src={details[0].src} alt={details[0].alt} width={details[0].width} height={details[0].height} sizes="(min-width: 64rem) 20vw, 50vw" className="h-auto w-full" />
          </div>
          <div className="lb-detail-b overflow-hidden lg:absolute lg:-right-[14%] lg:-bottom-[14%] lg:w-[26%]">
            <Image src={details[1].src} alt={details[1].alt} width={details[1].width} height={details[1].height} sizes="(min-width: 64rem) 22vw, 50vw" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
