"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { OrderDetail } from "@/components/orders/order-detail";
import { useUrlParams } from "@/lib/use-url-params";
import { findOrder, useOrders } from "@/stores/orders";

/** Calm closure: a tick draws itself, then the order summary. No confetti. */
export function ConfirmationView() {
  const [params] = useUrlParams();
  const placed = useOrders((s) => s.placed);
  const id = params.get("order") ?? "";
  const order = id ? findOrder(placed, id) : undefined;

  if (!order) {
    return (
      <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
        <h1 className="type-display text-h1">Order not found</h1>
        <p className="mt-4 text-body-lg">We couldn&rsquo;t find that order in this browser. You can look it up with your phone number instead.</p>
        <Link href="/track" className={buttonClasses("primary", "md", "mt-6")}>
          Track an order
        </Link>
      </div>
    );
  }

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <svg viewBox="0 0 56 56" className="size-14 shrink-0" aria-hidden>
          <circle cx="28" cy="28" r="27" fill="#0039fe" className="animate-[fade-in_300ms_var(--ease-out)_both]" />
          <path
            d="M16 29 l8 8 l16 -18"
            fill="none"
            stroke="#fff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            className="animate-[draw-tick_500ms_var(--ease-out)_200ms_both]"
          />
        </svg>
        <div>
          <h1 className="type-display text-h1">Thank you. Your order is placed.</h1>
          <p className="mt-2 text-body-lg text-basalt/80">
            We&rsquo;ve sent the receipt to {order.email}. Order number <span data-price className="font-semibold whitespace-nowrap">{order.id}</span>.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <OrderDetail order={order} />
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href={`/track?order=${order.id}&phone=${order.phone}`} className={buttonClasses("primary", "md")}>
          Track this order
        </Link>
        <Link href="/shop" className={buttonClasses("secondary", "md")}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
