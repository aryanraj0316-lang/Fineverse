"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { buttonClasses } from "@/components/ui/button";
import { addToCart } from "@/lib/cart-actions";
import { defaultVariant, formatPrice, getProduct, needsChoice } from "@/lib/commerce";
import { useWishlist } from "@/stores/wishlist";

/** Saved products with "Move to cart" in one tap (or "Choose size" when a size is needed). */
export function WishlistView() {
  const handles = useWishlist((s) => s.handles);
  const remove = useWishlist((s) => s.remove);
  const products = handles.flatMap((h) => {
    const p = getProduct(h);
    return p ? [p] : [];
  });

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <h1 className="type-display text-display">Wishlist</h1>
      {products.length === 0 ? (
        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden rounded-surface">
            <Image src="/worlds/morning-desktop.webp" alt="" fill sizes="(min-width: 48rem) 50vw, 100vw" quality={60} className="-z-10 object-cover object-bottom" />
            <Image src="/hero/items/sunglasses.png" alt="" width={1325} height={566} sizes="30vw" className="mb-[12%] w-1/2" />
          </div>
          <div>
            <p className="text-body-lg">Nothing saved yet. Tap the heart on any product to keep it here.</p>
            <Link href="/shop" className={buttonClasses("primary", "md", "mt-6")}>
              Browse the shop
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false}>
            {products.map((p) => {
              const image = p.colours[0]!.images[0];
              const v = defaultVariant(p);
              const choose = needsChoice(p);
              return (
                <motion.li key={p.handle} layout exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} data-product-card className="flex flex-col">
                  <Link href={p.href} className="overflow-hidden rounded-surface bg-sand">
                    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 64rem) 25vw, 50vw" className="wish-image aspect-[4/5] h-auto w-full object-cover" />
                  </Link>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <Link href={p.href} className="text-small font-semibold hover:underline">
                      {p.title}
                    </Link>
                    <span data-price className="text-small font-semibold">
                      {formatPrice(p.priceFrom)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {choose ? (
                      <Link href={p.href} className={buttonClasses("secondary", "sm")}>
                        Choose size
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={!p.available || !v}
                        className={buttonClasses("primary", "sm")}
                        onClick={async (e) => {
                          const img = e.currentTarget.closest("[data-product-card]")?.querySelector<HTMLImageElement>(".wish-image");
                          await addToCart({ lines: [{ variantId: v!.id, quantity: 1 }], sourceImage: img, message: "Moved to cart" });
                          remove(p.handle);
                        }}
                      >
                        {p.available ? "Move to cart" : "Out of stock"}
                      </button>
                    )}
                    <button type="button" onClick={() => remove(p.handle)} className="text-small text-basalt/70 underline-offset-4 hover:text-basalt hover:underline">
                      Remove
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
