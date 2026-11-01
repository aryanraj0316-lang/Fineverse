"use client";

import Image from "next/image";
import Link from "next/link";
import type { OrderSeed } from "@/data/orders";
import { priceOrder, formatPhone } from "@/lib/checkout";
import { formatPrice } from "@/lib/commerce";
import { TrackingTimeline } from "./tracking-timeline";

const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" });

/** Order header, tracking, items, address and payment. Used by account, track and confirmation. */
export function OrderDetail({ order, showTracking = true }: { order: OrderSeed & { giftNote?: string }; showTracking?: boolean }) {
  const totals = priceOrder(order.lines, { coupon: order.coupon, delivery: order.delivery, payment: order.payment });
  const delivered = order.status === "delivered";

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-basalt/70">
            Order {order.id} · placed {new Date(order.placed).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}
          </p>
          <p className="mt-1 type-heading text-h2">
            {delivered ? `Delivered ${longDate(order.steps.delivered ?? order.estimated)}` : `Arriving by ${longDate(order.estimated)}`}
          </p>
        </div>
        {order.courier && (
          <p className="text-small text-basalt/75">
            {order.courier.name} · <span data-price>{order.courier.awb}</span>
          </p>
        )}
      </div>

      {showTracking && <TrackingTimeline status={order.status} steps={order.steps} />}

      <div className="grid gap-10 lg:grid-cols-12">
        <section aria-label="Items" className="lg:col-span-7">
          <ul className="border-t border-basalt/10">
            {totals.lines.map((l) => (
              <li key={`${l.line.variantId}-${l.line.bundleId ?? ""}`} className="flex gap-4 border-b border-basalt/10 py-4">
                <Link href={l.product.href} className="w-16 shrink-0 overflow-hidden rounded-surface bg-sand">
                  <Image src={l.image.src} alt={l.image.alt} width={l.image.width} height={l.image.height} sizes="64px" className="aspect-[4/5] h-auto w-full object-cover" />
                </Link>
                <div className="flex flex-1 justify-between gap-3">
                  <div>
                    <Link href={l.product.href} className="text-small font-semibold hover:underline">
                      {l.product.title}
                    </Link>
                    <p className="text-micro text-basalt/70">
                      {l.variant.title} · Qty {l.line.quantity}
                      {l.line.bundleId && " · Everyday Kit"}
                    </p>
                  </div>
                  <p data-price className="text-small">
                    {formatPrice(l.lineTotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {order.giftNote && (
            <p className="mt-4 text-small">
              <span className="font-semibold">Gift note:</span> {order.giftNote}
            </p>
          )}
        </section>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <section aria-label="Delivery address" className="text-small">
            <h3 className="font-semibold">Delivering to</h3>
            <address className="mt-2 not-italic text-basalt/80">
              {order.address.name}
              <br />
              {order.address.line1}
              {order.address.line2 && (
                <>
                  <br />
                  {order.address.line2}
                </>
              )}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              {formatPhone(order.phone)}
            </address>
          </section>
          <section aria-label="Payment" className="text-small">
            <h3 className="font-semibold">Payment</h3>
            <dl className="mt-2 flex flex-col gap-1.5" data-price>
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.bundleSaving > 0 && (
                <div className="flex justify-between">
                  <dt>Everyday Kit saving</dt>
                  <dd>−{formatPrice(totals.bundleSaving)}</dd>
                </div>
              )}
              {totals.couponDiscount > 0 && (
                <div className="flex justify-between">
                  <dt>Code {order.coupon}</dt>
                  <dd>−{formatPrice(totals.couponDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>{order.delivery === "express" ? "Express delivery" : "Delivery"}</dt>
                <dd>{totals.shipping ? formatPrice(totals.shipping) : "Free"}</dd>
              </div>
              {totals.codFee > 0 && (
                <div className="flex justify-between">
                  <dt>Cash on delivery fee</dt>
                  <dd>{formatPrice(totals.codFee)}</dd>
                </div>
              )}
              <div className="mt-1 flex justify-between border-t border-basalt/10 pt-2 font-semibold">
                <dt>{order.payment === "cod" ? "To pay on delivery" : "Paid"}</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>
          </section>
          <p className="text-small">
            Need help with this order?{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
