"use client";

import Image from "next/image";
import Link from "next/link";
import { QuickAddButton } from "@/components/shop/add-to-cart-button";
import { ProductCard } from "@/components/shop/product-card";
import { defaultVariant, formatPrice, getProduct, needsChoice, type Product } from "@/lib/commerce";
import { useRecent } from "@/stores/recent";

/** The other Everyday Kit pieces as quick adds. */
export function CompleteTheKit({ items }: { items: Product[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="kit-row" className="border-t border-basalt/10 px-gutter py-16">
      <div className="flex items-end justify-between gap-4">
        <h2 id="kit-row" className="type-heading text-h2">
          Complete the kit
        </h2>
        <Link href="/kit" className="text-small font-medium underline underline-offset-4">
          Build the Everyday Kit
        </Link>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => {
          const v = defaultVariant(p);
          const image = p.colours[0]!.images[0];
          return (
            <li key={p.handle} data-product-card className="flex flex-col">
              <Link href={p.href} className="overflow-hidden rounded-surface bg-sand">
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 48rem) 22vw, 45vw" className="kit-thumb aspect-[4/5] h-auto w-full object-cover" />
              </Link>
              <div className="mt-3 flex items-start justify-between gap-2">
                <Link href={p.href} className="text-small font-semibold hover:underline">
                  {p.title}
                </Link>
                <span data-price className="text-small">
                  {formatPrice(p.priceFrom)}
                </span>
              </div>
              <QuickAddButton
                variantId={v?.id}
                href={p.href}
                needsChoice={needsChoice(p)}
                available={p.available}
                imageSelector=".kit-thumb"
                variant="secondary"
                className="mt-3 h-10 w-full text-small"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ProductRow({ title, products }: { title: string; products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="border-t border-basalt/10 px-gutter py-16" aria-label={title}>
      <h2 className="type-heading text-h2">{title}</h2>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {products.map((p) => (
          <li key={p.handle}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Recently viewed, read from local storage after hydration. */
export function RecentlyViewed({ exclude }: { exclude: string }) {
  const handles = useRecent((s) => s.handles);
  const products = handles
    .filter((h) => h !== exclude)
    .slice(0, 4)
    .flatMap((h) => {
      const p = getProduct(h);
      return p ? [p] : [];
    });
  return <ProductRow title="Recently viewed" products={products} />;
}
