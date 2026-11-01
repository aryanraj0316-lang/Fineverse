import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountOrder } from "@/components/account/account-order";
import { orderSeeds } from "@/data/orders";

export const metadata: Metadata = { title: "Order", robots: { index: false } };

export function generateStaticParams() {
  return orderSeeds.map((o) => ({ id: o.id }));
}

/** The order id is read inside <Suspense>; orders placed in the browser render on demand. */
export default function OrderPage({ params }: PageProps<"/account/orders/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <OrderContent params={params} />
    </Suspense>
  );
}

async function OrderContent({ params }: { params: PageProps<"/account/orders/[id]">["params"] }) {
  const { id } = await params;
  return <AccountOrder id={id} />;
}
