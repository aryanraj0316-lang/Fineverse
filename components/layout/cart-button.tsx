"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { selectCartCount, useCart } from "@/stores/cart";

/** Opens the cart drawer; /cart is the fallback without JavaScript. */
export function CartButton() {
  const count = useCart(selectCartCount);
  const open = useCart((s) => s.open);
  const label = count === 0 ? "Cart, empty" : `Cart, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <Link
      href="/cart"
      aria-label={label}
      data-cart-button
      onClick={(e) => {
        e.preventDefault();
        open();
      }}
      className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-basalt/5"
    >
      <ShoppingCart aria-hidden className="size-[22px]" strokeWidth={1.5} />
      {count > 0 && (
        <span
          key={count}
          aria-hidden
          data-price
          className="absolute top-0.5 right-0 grid h-[18px] min-w-[18px] animate-[badge-tick_220ms_var(--ease-out)] place-items-center rounded-full bg-cobalt px-1 text-micro leading-none font-semibold text-chalk"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
