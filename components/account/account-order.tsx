"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderDetail } from "@/components/orders/order-detail";
import { buttonClasses } from "@/components/ui/button";
import { useAuth } from "@/stores/auth";
import { findOrder, useOrders } from "@/stores/orders";

export function AccountOrder({ id }: { id: string }) {
  const user = useAuth((s) => s.user);
  const placed = useOrders((s) => s.placed);
  const order = findOrder(placed, id);
  const visible = order && user && order.phone === user.phone;

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2rem)] pb-24">
      <Link href="/account" className="inline-flex items-center gap-2 text-small underline-offset-4 hover:underline">
        <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} /> All orders
      </Link>
      {visible ? (
        <div className="mt-6">
          <OrderDetail order={order} />
        </div>
      ) : (
        <div className="mt-6 max-w-md">
          <h1 className="type-display text-h1">{user ? "Order not found" : "Log in to see this order"}</h1>
          <p className="mt-3 text-body-lg">
            {user ? `There's no order ${id} on this account.` : "Orders are linked to your mobile number."}
          </p>
          <Link href={user ? "/track" : "/login"} className={buttonClasses("primary", "md", "mt-6")}>
            {user ? "Track an order" : "Log in"}
          </Link>
        </div>
      )}
    </div>
  );
}
