"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { normalisePhone, validate } from "@/lib/checkout";
import { useUrlParams } from "@/lib/use-url-params";
import { cx } from "@/lib/cx";
import { findOrder, useOrders } from "@/stores/orders";
import { OrderDetail } from "./order-detail";

/** Track by order number + phone, no login. Prefills from ?order=&phone=. */
export function TrackView() {
  const id = useId();
  const [params, setParams] = useUrlParams();
  const placed = useOrders((s) => s.placed);
  const [orderInput, setOrderInput] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ order?: string; phone?: string; lookup?: string }>({});

  const urlOrder = params.get("order") ?? "";
  const urlPhone = params.get("phone") ?? "";
  const orderValue = orderInput ?? urlOrder;
  const phoneValue = phoneInput ?? urlPhone;
  const found = urlOrder && urlPhone ? findOrder(placed, urlOrder) : undefined;
  const match = found && found.phone === normalisePhone(urlPhone) ? found : undefined;
  const notFound = Boolean(urlOrder && urlPhone && !match);

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <h1 className="type-display text-h1">Track an order</h1>
      <p className="mt-2 text-body-lg text-basalt/75">No login needed. Use the order number from your confirmation SMS or email.</p>

      <form
        noValidate
        className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          const next = {
            order: orderValue.trim() ? (/^FV-?\d{5}$/i.test(orderValue.trim()) ? undefined : "Order numbers look like FV-10482.") : "Enter your order number.",
            phone: validate.phone(phoneValue) ?? undefined,
          };
          setErrors(next);
          if (next.order || next.phone) return;
          const order = orderValue.trim().toUpperCase().replace(/^FV-?/, "FV-");
          setParams({ order, phone: normalisePhone(phoneValue) });
        }}
      >
        <div>
          <label htmlFor={`${id}-order`} className="text-small font-medium">
            Order number
          </label>
          <input
            id={`${id}-order`}
            value={orderValue}
            onChange={(e) => setOrderInput(e.target.value)}
            placeholder="FV-10482"
            autoCapitalize="characters"
            aria-invalid={errors.order ? true : undefined}
            aria-describedby={errors.order ? `${id}-order-err` : undefined}
            className={cx("mt-1.5 h-12 w-full rounded-field border bg-chalk px-4 text-body uppercase", errors.order ? "border-error" : "border-basalt/25")}
          />
          {errors.order && (
            <p id={`${id}-order-err`} className="mt-1.5 text-small text-error">
              {errors.order}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="text-small font-medium">
            Mobile number on the order
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            value={phoneValue}
            onChange={(e) => setPhoneInput(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id}-phone-err` : undefined}
            className={cx("mt-1.5 h-12 w-full rounded-field border bg-chalk px-4 text-body", errors.phone ? "border-error" : "border-basalt/25")}
          />
          {errors.phone && (
            <p id={`${id}-phone-err`} className="mt-1.5 text-small text-error">
              {errors.phone}
            </p>
          )}
        </div>
        <button type="submit" className={buttonClasses("primary", "md", "sm:mt-[1.875rem]")}>
          Track order
        </button>
      </form>

      <div aria-live="polite" className="mt-12">
        {notFound && (
          <p className="max-w-xl text-body-lg">
            We couldn&rsquo;t find order {urlOrder} for that mobile number. Check both against your confirmation, or{" "}
            <Link href="/contact" className="underline underline-offset-4">
              contact us
            </Link>
            .
          </p>
        )}
        {match && <OrderDetail order={match} />}
        {!urlOrder && (
          <p className="text-small text-basalt/70">
            Demo: try order <span data-price>FV-10482</span> with mobile <span data-price>98765 43210</span>.
          </p>
        )}
      </div>
    </div>
  );
}
