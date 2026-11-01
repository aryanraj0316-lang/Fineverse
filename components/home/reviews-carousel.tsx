"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Stars } from "@/components/ui/stars";

export interface ReviewSlide {
  id: string;
  quote: string;
  author: string;
  city: string;
  rating: number;
  product: { title: string; href: string };
}

/** One review at a time, set large. Arrows, swipe or arrow keys; it never advances on its own. */
export function ReviewsCarousel({ reviews }: { reviews: ReviewSlide[] }) {
  const [index, setIndex] = useState(0);
  const start = useRef<number | null>(null);
  const review = reviews[index];
  const go = (delta: number) => setIndex((i) => (i + delta + reviews.length) % reviews.length);
  if (!review) return null;

  return (
    <section aria-labelledby="reviews-title" aria-roledescription="carousel" className="border-t border-basalt/10 px-gutter py-24 lg:py-36">
      <h2 id="reviews-title" className="type-heading text-h2">
        Reviews
      </h2>

      <div
        className="mt-10 grid min-h-[24rem] touch-pan-y content-between lg:mt-14 lg:min-h-[28rem]"
        onPointerDown={(e) => (start.current = e.clientX)}
        onPointerUp={(e) => {
          if (start.current === null) return;
          const dx = e.clientX - start.current;
          start.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={review.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${reviews.length}`}
          >
            <blockquote className="type-display max-w-[24ch] text-h1 lg:text-[clamp(2.5rem,1rem+3.6vw,4.5rem)] lg:leading-[1.02]">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-small">
              <Stars rating={review.rating} />
              <span className="font-semibold">
                {review.author}, {review.city}
              </span>
              <span className="text-basalt/70">
                Bought the{" "}
                <Link href={review.product.href} className="underline underline-offset-4">
                  {review.product.title}
                </Link>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-3">
          <button type="button" aria-label="Previous review" onClick={() => go(-1)} className="grid size-12 place-items-center rounded-full border border-basalt/25 transition-colors hover:border-basalt">
            <ArrowLeft aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
          <button type="button" aria-label="Next review" onClick={() => go(1)} className="grid size-12 place-items-center rounded-full border border-basalt/25 transition-colors hover:border-basalt">
            <ArrowRight aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
          <span aria-live="polite" className="ml-2 text-small text-basalt/70" data-price>
            {index + 1} of {reviews.length}
          </span>
        </div>
      </div>
    </section>
  );
}
