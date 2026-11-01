"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart-actions";
import { buttonClasses } from "@/components/ui/button";
import { cx } from "@/lib/cx";

/**
 * Quick add for cards, placards and hotspots. Products that need a size choice
 * get a "Choose size" link to the product page instead, because adding a
 * guessed size would be wrong.
 */
export function QuickAddButton({
  variantId,
  href,
  needsChoice,
  available,
  imageSelector,
  variant = "primary",
  size = "md",
  className,
}: {
  variantId?: string;
  href: string;
  needsChoice: boolean;
  available: boolean;
  /** CSS selector (within the closest [data-product-card]) of the image that flies to the cart. */
  imageSelector?: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  if (needsChoice || !variantId) {
    return (
      <Link href={href} className={buttonClasses("secondary", size, className)}>
        Choose size
      </Link>
    );
  }
  if (!available) {
    return (
      <Link href={href} className={buttonClasses("secondary", size, className)}>
        Out of stock
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      className={buttonClasses(variant, size, cx(className))}
      onClick={async (event) => {
        setBusy(true);
        const card = event.currentTarget.closest("[data-product-card]");
        const image = imageSelector ? card?.querySelector<HTMLImageElement>(imageSelector) : null;
        await addToCart({ lines: [{ variantId, quantity: 1 }], sourceImage: image });
        setBusy(false);
      }}
    >
      Add to cart
    </button>
  );
}
