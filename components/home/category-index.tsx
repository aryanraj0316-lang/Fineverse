"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";

export interface CategoryEntry {
  handle: string;
  title: string;
  href: string;
  world: "night" | "morning" | "golden";
  product: { title: string; image: { src: string; width: number; height: number } };
}

/**
 * Three category names, huge and stacked. Hover (or, on touch screens, scroll
 * a name to the middle of the screen) floats that category's product in front
 * of the letters and shifts the light to its world.
 */
export function CategoryIndex({ categories }: { categories: CategoryEntry[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const activeWorld = categories.find((c) => c.handle === active)?.world;

  // Touch screens: the name nearest the middle of the screen is active.
  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) return;
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-category]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.category ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="categories-title"
      data-world={activeWorld}
      className="category-index relative isolate overflow-hidden"
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
    >
      <h2 id="categories-title" className="sr-only">
        Shop by category
      </h2>

      {(["night", "morning", "golden"] as const).map((world) => (
        <div
          key={world}
          aria-hidden
          className={cx("ci-world absolute inset-0 -z-10", activeWorld === world && "is-active")}
        >
          <Image src={`/worlds/${world}-desktop.webp`} alt="" fill sizes="100vw" quality={60} className="ci-world-landscape object-cover" />
          <Image src={`/worlds/${world}-mobile.webp`} alt="" fill sizes="100vw" quality={60} className="ci-world-portrait object-cover" />
        </div>
      ))}

      <ul ref={listRef} className="relative px-gutter py-[14vh]">
        {categories.map((c) => {
          const isActive = active === c.handle;
          return (
            <li key={c.handle} data-category={c.handle} className="relative">
              <Link
                href={c.href}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(c.handle)}
                onFocus={() => setActive(c.handle)}
                className="ci-name type-mega block"
              >
                {c.title}
              </Link>
              <div aria-hidden className={cx("ci-cutout", isActive && "is-active")}>
                <div className="ci-cutout-shadow" />
                <Image
                  src={c.product.image.src}
                  alt=""
                  width={c.product.image.width}
                  height={c.product.image.height}
                  sizes="(orientation: portrait) 40vw, 22vw"
                  quality={85}
                  className="relative h-auto w-full"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
