"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { priceCart } from "@/lib/cart-pricing";
import { formatPrice, getPolicy } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { useCart, type CartLine } from "@/stores/cart";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Cart lines, free-delivery progress and totals. Used by the drawer and /cart. */
export function CartContents({ onNavigate, page = false }: { onNavigate?: () => void; page?: boolean }) {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const add = useCart((s) => s.add);
  const totals = useMemo(() => priceCart(lines), [lines]);
  const policy = getPolicy();
  const [removed, setRemoved] = useState<{ line: CartLine; title: string } | null>(null);

  if (totals.lines.length === 0 && !removed) {
    return (
      <div className="flex flex-col items-start gap-6 p-6">
        <p className="text-body-lg">Your cart is empty.</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["Electronics", "/shop/electronics"],
            ["Clothing", "/shop/clothing"],
            ["Wearables", "/shop/wearables"],
            ["The Everyday Kit", "/kit"],
          ].map(([label, href]) => (
            <Link key={href} href={href!} onClick={onNavigate} className={buttonClasses("secondary", "sm")}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const progress = Math.min(1, totals.merchandise / policy.freeShippingThreshold);

  return (
    <div className={cx("flex min-h-full flex-col", page && "lg:grid lg:grid-cols-12 lg:gap-12")}>
      <div className={cx("flex-1 px-5", page && "lg:col-span-7 lg:px-0")}>
        <div className="pt-5 pb-4">
          <p className="text-small">
            {totals.toFreeShipping > 0 ? (
              <>
                <span data-price className="font-semibold">
                  {formatPrice(totals.toFreeShipping)}
                </span>{" "}
                away from free delivery
              </>
            ) : (
              <span className="font-semibold">Free delivery on this order</span>
            )}
          </p>
          <div aria-hidden className="mt-2 h-1 overflow-hidden rounded-full bg-basalt/10">
            <div className="h-full origin-left bg-cobalt transition-transform duration-400 ease-out" style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>

        <ul className="border-t border-basalt/10">
          <AnimatePresence initial={false}>
            {removed && (
              <motion.li
                key="removed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-3 border-b border-basalt/10 py-4 text-small"
              >
                <span>Removed {removed.title}.</span>
                <button
                  type="button"
                  className="font-medium underline underline-offset-4"
                  onClick={() => {
                    add([removed.line]);
                    setRemoved(null);
                  }}
                >
                  Undo
                </button>
              </motion.li>
            )}
            {totals.lines.map((l) => (
              <motion.li
                key={`${l.line.variantId}-${l.line.bundleId ?? ""}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.25, ease }}
                className="flex gap-4 border-b border-basalt/10 py-4"
              >
                <Link href={l.product.href} onClick={onNavigate} className="w-20 shrink-0 overflow-hidden rounded-surface bg-sand">
                  <Image src={l.image.src} alt={l.image.alt} width={l.image.width} height={l.image.height} sizes="80px" className="aspect-[4/5] h-auto w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={l.product.href} onClick={onNavigate} className="text-small font-semibold hover:underline">
                        {l.product.title}
                      </Link>
                      <p className="text-micro text-basalt/70">
                        {l.variant.title}
                        {l.line.bundleId && " · Everyday Kit"}
                      </p>
                    </div>
                    <p data-price className="text-small font-semibold">
                      {formatPrice(l.lineTotal)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-basalt/20">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${l.product.title}`}
                        onClick={() => setQuantity(l.line.variantId, l.line.quantity - 1, l.line.bundleId)}
                        disabled={l.line.quantity <= 1}
                        className="grid size-9 place-items-center rounded-full disabled:opacity-30"
                      >
                        <Minus aria-hidden className="size-4" strokeWidth={1.5} />
                      </button>
                      <span data-price aria-live="polite" className="w-7 text-center text-small" aria-label={`Quantity ${l.line.quantity}`}>
                        {l.line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${l.product.title}`}
                        onClick={() => setQuantity(l.line.variantId, l.line.quantity + 1, l.line.bundleId)}
                        disabled={l.line.quantity >= Math.min(l.variant.stock, 10)}
                        className="grid size-9 place-items-center rounded-full disabled:opacity-30"
                      >
                        <Plus aria-hidden className="size-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        remove(l.line.variantId, l.line.bundleId);
                        setRemoved({ line: l.line, title: l.product.title });
                      }}
                      className="text-small text-basalt/70 underline-offset-4 hover:text-basalt hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className={cx("sticky bottom-0 border-t border-basalt/10 bg-chalk px-5 pt-4 pb-5", page && "lg:static lg:col-span-5 lg:self-start lg:rounded-surface lg:border lg:p-6")}>
        <dl className="flex flex-col gap-1.5 text-small">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd data-price>{formatPrice(totals.subtotal)}</dd>
          </div>
          {totals.bundleSaving > 0 && (
            <div className="flex justify-between">
              <dt>Everyday Kit saving</dt>
              <dd data-price>−{formatPrice(totals.bundleSaving)}</dd>
            </div>
          )}
          <div className="flex justify-between text-basalt/70">
            <dt>Delivery</dt>
            <dd>{totals.toFreeShipping > 0 ? `${formatPrice(policy.standardShipping)} (free over ${formatPrice(policy.freeShippingThreshold)})` : "Free"}</dd>
          </div>
        </dl>
        <Link href="/checkout" onClick={onNavigate} className={buttonClasses("primary", "lg", "mt-4 w-full")}>
          Checkout · <span data-price>{formatPrice(totals.merchandise)}</span>
        </Link>
        <p className="mt-3 text-center text-micro text-basalt/70">
          Cash on delivery available · {policy.returnDays}-day returns
        </p>
      </div>
    </div>
  );
}
