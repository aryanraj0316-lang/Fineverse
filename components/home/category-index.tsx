"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

export interface CategoryEntry {
  handle: string;
  title: string;
  href: string;
  count: number;
  summary: string;
  image: { src: string; alt: string; width: number; height: number };
}

export function CategoryIndex({ categories }: { categories: CategoryEntry[] }) {
  const list = useRef<HTMLUListElement>(null);
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !window.IntersectionObserver) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const card = entry.target as HTMLElement;
        animations.push(card.animate(
          [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 650, delay: Number(card.dataset.position) % 3 * 75, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
        ));
        observer.unobserve(card);
      }
    }, { threshold: 0.12 });
    list.current?.querySelectorAll("li").forEach((card) => observer.observe(card));
    const stop = () => { if (preference.matches) { observer.disconnect(); animations.forEach((animation) => animation.cancel()); } };
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); preference.removeEventListener("change", stop); };
  }, []);

  return (
    <section id="collections" aria-labelledby="categories-title" className="category-index category-gallery">
      <div className="category-gallery-inner">
        <header className="category-gallery-header">
          <div>
            <p className="category-gallery-eyebrow">Shop by category</p>
            <h2 id="categories-title" className="category-gallery-title">Good design.<br />Every day.</h2>
          </div>
          <div className="category-gallery-intro">
            <p>From the things you wear to the spaces you make your own. Discover {total} essentials across {categories.length} collections.</p>
            <Link href="/shop" className="category-gallery-all">View all products <ArrowUpRight aria-hidden size={18} strokeWidth={1.5} /></Link>
          </div>
        </header>
        <ul ref={list} className="category-gallery-grid">
          {categories.map((category, index) => (
            <li key={category.handle} data-position={index}>
              <Link href={category.href} data-category-link={category.handle} className="category-gallery-card">
                <div className="category-gallery-media">
                  <Image src={category.image.src} alt={category.image.alt} fill sizes="(min-width: 68rem) 32vw, 48vw" quality={85} className="category-gallery-image" />
                  <span className="category-gallery-number" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="category-gallery-caption">
                  <div className="category-gallery-copy">
                    <div className="category-gallery-label"><h3>{category.title}</h3><span>{category.count} products</span></div>
                    <p>{category.summary}</p>
                  </div>
                  <span className="category-gallery-arrow" aria-hidden><ArrowUpRight size={20} strokeWidth={1.5} /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
