"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { addToCart } from "@/lib/cart-actions";
import { formatPrice, type Product } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { WishlistButton } from "./wishlist-button";

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Shop card. Hover (mouse) shows the second image and a quick-add bar with
 * colour and size; on touch screens the "+" button opens the same bar.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [quick, setQuick] = useState(false);
  const colour = product.colours[0]!;
  const price =
    product.priceFrom === product.priceTo ? formatPrice(product.priceFrom) : `From ${formatPrice(product.priceFrom)}`;

  return (
    <article data-product-card className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-surface bg-sand">
        {/* Mouse shortcut to the product; the title link below is the accessible one. */}
        <Link href={product.href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <Image
            src={colour.images[0].src}
            alt=""
            width={colour.images[0].width}
            height={colour.images[0].height}
            sizes="(min-width: 64rem) 25vw, 50vw"
            loading={priority ? "eager" : undefined}
            fetchPriority={priority ? "high" : undefined}
            className="card-image absolute inset-0 h-full w-full object-cover"
          />
          <Image
            src={colour.images[1].src}
            alt=""
            width={colour.images[1].width}
            height={colour.images[1].height}
            sizes="(min-width: 64rem) 25vw, 50vw"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-out [@media(hover:hover)]:group-hover:opacity-100"
          />
        </Link>
        {!product.available && (
          <span className="absolute top-3 left-3 rounded-full bg-chalk/90 px-2.5 py-1 text-micro font-medium">Out of stock</span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <WishlistButton handle={product.handle} title={product.title} className="bg-chalk/60" />
          {product.available && (
            <button
              type="button"
              aria-label={`Quick add ${product.title}`}
              aria-expanded={quick}
              onClick={() => setQuick((q) => !q)}
              className="grid size-10 place-items-center rounded-full bg-chalk/60 hover:bg-chalk/80 [@media(hover:hover)]:hidden"
            >
              <Plus aria-hidden className={cx("size-5 transition-transform", quick && "rotate-45")} strokeWidth={1.5} />
            </button>
          )}
        </div>
        {product.available && <QuickAddBar product={product} forceOpen={quick} onDone={() => setQuick(false)} />}
      </div>

      <Link href={product.href} className="mt-3 flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block text-small font-semibold">{product.title}</span>
          <span className="block text-micro text-basalt/70">
            {product.colours.length > 1 ? `${product.colours.length} colours` : colour.name}
            {product.option && ` · ${product.option.values.length} ${product.option.name.toLowerCase()}s`}
          </span>
        </span>
        <span data-price className="shrink-0 text-small font-semibold">
          {price}
        </span>
      </Link>
    </article>
  );
}

function QuickAddBar({ product, forceOpen, onDone }: { product: Product; forceOpen: boolean; onDone: () => void }) {
  const [colour, setColour] = useState(product.colours[0]!.name);
  const [option, setOption] = useState<string | undefined>(
    product.option && product.option.name !== "Size" && product.option.name !== "Waist" ? product.option.values[0] : undefined,
  );
  const [error, setError] = useState<string | null>(null);
  const variant = product.variants.find((v) => v.colour === colour && v.option === option);
  const needsOption = product.option && !option;

  return (
    <div
      className={cx(
        "quick-add absolute inset-x-2 bottom-2 z-10 rounded-surface bg-chalk/95 p-3 shadow-[0_8px_24px_-12px_rgb(29_28_26/0.4)] transition-[opacity,translate] duration-250 ease-out",
        forceOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0 [@media(hover:hover)]:group-focus-within:pointer-events-auto [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100",
      )}
    >
      {product.colours.length > 1 && (
        <div role="radiogroup" aria-label={`${product.title} colour`} className="flex flex-wrap gap-1.5">
          {product.colours.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={colour === c.name}
              aria-label={`${product.title}, ${c.name}`}
              title={c.name}
              onClick={() => setColour(c.name)}
              className={cx("size-6 rounded-full border border-basalt/20", colour === c.name && "ring-2 ring-cobalt ring-offset-2")}
              style={{ background: c.swatch }}
            />
          ))}
        </div>
      )}
      {product.option && (
        <div role="radiogroup" aria-label={`${product.title} ${product.option.name.toLowerCase()}`} className="mt-2 flex flex-wrap gap-1.5">
          {product.option.values.map((v) => {
            const stock = product.variants.find((x) => x.colour === colour && x.option === v)?.stock ?? 0;
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={option === v}
                disabled={stock === 0}
                onClick={() => {
                  setOption(v);
                  setError(null);
                }}
                className={cx(
                  "h-8 min-w-8 rounded-full border px-2.5 text-micro font-medium disabled:line-through disabled:opacity-40",
                  option === v ? "border-cobalt bg-cobalt text-chalk" : "border-basalt/20 hover:border-basalt",
                )}
              >
                {v}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        className="mt-3 h-10 w-full rounded-full bg-cobalt text-small font-medium text-chalk transition-colors hover:bg-cobalt-press disabled:opacity-50"
        disabled={variant ? !variant.available : false}
        onClick={async (e) => {
          if (needsOption || !variant) {
            setError(`Choose a ${product.option?.name.toLowerCase()} first.`);
            return;
          }
          const image = e.currentTarget.closest("[data-product-card]")?.querySelector<HTMLImageElement>(".card-image");
          onDone();
          await addToCart({ lines: [{ variantId: variant.id, quantity: 1 }], sourceImage: image });
        }}
      >
        {needsOption ? `Choose ${product.option?.name.toLowerCase()}` : variant && !variant.available ? "Out of stock" : "Add to cart"}
      </button>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease }} role="alert" className="mt-2 text-micro text-error">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
