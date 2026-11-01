"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, CreditCard, Lock } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { checkCoupon, INDIAN_STATES, normalisePhone, priceOrder, validate } from "@/lib/checkout";
import { formatPrice, getPolicy } from "@/lib/commerce";
import { checkPincode, formatDeliveryDate } from "@/lib/delivery";
import { cx } from "@/lib/cx";
import { useAuth } from "@/stores/auth";
import { useCart } from "@/stores/cart";
import { placeOrder } from "@/stores/orders";

type Field = "phone" | "email" | "name" | "line1" | "city" | "state" | "pincode";

const fieldClass = "mt-1.5 h-12 w-full rounded-field border bg-chalk px-4 text-body";

export function CheckoutForm() {
  const id = useId();
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.setQuantity);
  const user = useAuth((s) => s.user);
  const policy = getPolicy();

  const [values, setValues] = useState<Record<Field | "line2", string>>({
    phone: user?.phone ?? "",
    email: "",
    name: user?.name ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [touched, setTouched] = useState(false);
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<"online" | "cod">("online");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code?: string; message?: string; ok?: boolean }>({});
  const [gift, setGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  const totals = useMemo(() => priceOrder(lines, { coupon: coupon.code, delivery, payment }), [lines, coupon.code, delivery, payment]);
  const pin = useMemo(() => (validate.pincode(values.pincode) ? null : checkPincode(values.pincode)), [values.pincode]);
  const codAvailable = !pin || !pin.ok || pin.cod;

  const errors: Partial<Record<Field, string>> = {
    phone: validate.phone(values.phone) ?? undefined,
    email: validate.email(values.email) ?? undefined,
    name: validate.required(values.name, "the full name for delivery") ?? undefined,
    line1: validate.required(values.line1, "the house or flat number and street") ?? undefined,
    city: validate.required(values.city, "the city or town") ?? undefined,
    state: values.state ? undefined : "Choose a state.",
    pincode: validate.pincode(values.pincode) ?? undefined,
  };
  const show = (f: Field) => (touched ? errors[f] : undefined);

  if (totals.lines.length === 0) {
    return (
      <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
        <h1 className="type-display text-display">Checkout</h1>
        <p className="mt-6 text-body-lg">Your cart is empty, so there&rsquo;s nothing to check out yet.</p>
        <Link href="/shop" className={buttonClasses("primary", "md", "mt-6")}>
          Browse the shop
        </Link>
      </div>
    );
  }

  const set = (f: Field | "line2") => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues((v) => ({ ...v, [f]: e.target.value }));

  const input = (f: Field | "line2", label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const err = f === "line2" ? undefined : show(f);
    return (
      <div>
        <label htmlFor={`${id}-${f}`} className="text-small font-medium">
          {label}
        </label>
        <input
          id={`${id}-${f}`}
          name={f}
          value={values[f]}
          onChange={set(f)}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-${f}-err` : undefined}
          className={cx(fieldClass, err ? "border-error" : "border-basalt/25")}
          {...props}
        />
        {err && (
          <p id={`${id}-${f}-err`} className="mt-1.5 text-small text-error">
            {err}
          </p>
        )}
      </div>
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const first = (Object.keys(errors) as Field[]).find((f) => errors[f]);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    if (payment === "cod" && !codAvailable) return;
    setPlacing(true);
    const orderId = placeOrder({
      estimate: pin && pin.ok ? (delivery === "express" ? pin.express : pin.standard) : undefined,
      phone: normalisePhone(values.phone),
      email: values.email.trim(),
      lines: lines.map((l) => ({ ...l })),
      address: { name: values.name, line1: values.line1, line2: values.line2 || undefined, city: values.city, state: values.state, pincode: values.pincode },
      delivery,
      payment,
      coupon: coupon.ok ? coupon.code : undefined,
      giftNote: gift && giftNote.trim() ? giftNote.trim() : undefined,
      total: totals.total,
    });
    // Empty the cart, then show the confirmation.
    lines.forEach((l) => clearCart(l.variantId, 0, l.bundleId));
    router.push(`/checkout/confirmation?order=${orderId}`);
  };

  const summary = (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-4">
        {totals.lines.map((l) => (
          <li key={`${l.line.variantId}-${l.line.bundleId ?? ""}`} className="flex gap-3">
            <div className="relative w-14 shrink-0">
              <Image src={l.image.src} alt={l.image.alt} width={l.image.width} height={l.image.height} sizes="56px" className="aspect-[4/5] h-auto w-full rounded-surface bg-sand object-cover" />
              <span data-price className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-basalt text-micro text-chalk">
                {l.line.quantity}
              </span>
            </div>
            <div className="flex flex-1 justify-between gap-3 text-small">
              <div>
                <p className="font-semibold">{l.product.title}</p>
                <p className="text-micro text-basalt/70">
                  {l.variant.title}
                  {l.line.bundleId && " · Everyday Kit"}
                </p>
              </div>
              <span data-price>{formatPrice(l.lineTotal)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <label htmlFor={`${id}-coupon`} className="text-small font-medium">
          Discount code
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id={`${id}-coupon`}
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            autoCapitalize="characters"
            aria-describedby={`${id}-coupon-msg`}
            className="h-11 min-w-0 flex-1 rounded-field border border-basalt/25 bg-chalk px-4 text-body uppercase"
          />
          <button
            type="button"
            onClick={() => {
              const r = checkCoupon(couponInput);
              setCoupon(r.ok ? { code: r.code, ok: true, message: `${r.code} applied: ${r.label}.` } : { ok: false, message: r.error });
            }}
            className="h-11 rounded-full border border-basalt/25 px-5 text-small font-medium hover:border-basalt"
          >
            Apply
          </button>
        </div>
        <p id={`${id}-coupon-msg`} aria-live="polite" className={cx("mt-1.5 text-small", coupon.ok === false && "text-error")}>
          {coupon.message}
          {coupon.ok && (
            <button
              type="button"
              className="ml-2 underline underline-offset-4"
              onClick={() => {
                setCoupon({});
                setCouponInput("");
              }}
            >
              Remove
            </button>
          )}
        </p>
      </div>

      <dl className="flex flex-col gap-1.5 border-t border-basalt/10 pt-4 text-small" data-price>
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
            <dt>Code {coupon.code}</dt>
            <dd>−{formatPrice(totals.couponDiscount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>{delivery === "express" ? "Express delivery" : "Delivery"}</dt>
          <dd>{totals.shipping ? formatPrice(totals.shipping) : "Free"}</dd>
        </div>
        {totals.codFee > 0 && (
          <div className="flex justify-between">
            <dt>Cash on delivery fee</dt>
            <dd>{formatPrice(totals.codFee)}</dd>
          </div>
        )}
        <div className="mt-1 flex justify-between border-t border-basalt/10 pt-2 text-body font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      <p className="text-micro text-basalt/70">Prices include GST.</p>
    </div>
  );

  const step = (n: number, title: string, children: React.ReactNode) => (
    <fieldset className="border-t border-basalt/10 pt-6">
      <legend className="flex items-center gap-3 type-heading text-h3">
        <span aria-hidden className="grid size-7 place-items-center rounded-full bg-basalt text-micro text-chalk">
          {n}
        </span>
        {title}
      </legend>
      <div className="mt-5">{children}</div>
    </fieldset>
  );

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2rem)] pb-24">
      <h1 className="type-display text-h1">Checkout</h1>

      {/* Phones: summary collapses to one line at the top */}
      <div className="mt-6 rounded-surface bg-chalk lg:hidden">
        <button
          type="button"
          aria-expanded={summaryOpen}
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 p-4 text-small font-medium"
        >
          <span>
            {summaryOpen ? "Hide" : "Show"} order summary ({totals.count} {totals.count === 1 ? "item" : "items"})
          </span>
          <span className="flex items-center gap-2" data-price>
            {formatPrice(totals.total)}
            <ChevronDown aria-hidden className={cx("size-4 transition-transform", summaryOpen && "rotate-180")} strokeWidth={1.5} />
          </span>
        </button>
        {summaryOpen && <div className="border-t border-basalt/10 p-4">{summary}</div>}
      </div>

      <form noValidate onSubmit={submit} className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-10 lg:col-span-7">
          {step(
            1,
            "Contact",
            <div className="grid gap-5 sm:grid-cols-2">
              {input("phone", "Mobile number", { type: "tel", inputMode: "tel", autoComplete: "tel-national", placeholder: "98765 43210" })}
              {input("email", "Email for the receipt", { type: "email", autoComplete: "email" })}
            </div>,
          )}

          {step(
            2,
            "Delivery address",
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">{input("name", "Full name", { autoComplete: "name" })}</div>
              <div className="sm:col-span-2">{input("line1", "House or flat number, street", { autoComplete: "address-line1" })}</div>
              <div className="sm:col-span-2">{input("line2", "Area or landmark (optional)", { autoComplete: "address-line2" })}</div>
              {input("pincode", "Pincode", { inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
              {input("city", "City or town", { autoComplete: "address-level2" })}
              <div className="sm:col-span-2">
                <label htmlFor={`${id}-state`} className="text-small font-medium">
                  State
                </label>
                <select
                  id={`${id}-state`}
                  value={values.state}
                  onChange={set("state")}
                  autoComplete="address-level1"
                  aria-invalid={show("state") ? true : undefined}
                  aria-describedby={show("state") ? `${id}-state-err` : undefined}
                  className={cx(fieldClass, show("state") ? "border-error" : "border-basalt/25")}
                >
                  <option value="">Choose a state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {show("state") && (
                  <p id={`${id}-state-err`} className="mt-1.5 text-small text-error">
                    {show("state")}
                  </p>
                )}
              </div>
            </div>,
          )}

          {step(
            3,
            "Delivery",
            <div role="radiogroup" aria-label="Delivery method" className="grid gap-3">
              {(
                [
                  ["standard", "Standard", totals.merchandise >= policy.freeShippingThreshold ? "Free" : formatPrice(policy.standardShipping), pin?.ok ? pin.standard : null],
                  ["express", "Express", formatPrice(policy.expressShipping), pin?.ok ? pin.express : null],
                ] as const
              ).map(([value, label, price, date]) => (
                <label key={value} className={cx("flex cursor-pointer items-center gap-4 rounded-field border p-4", delivery === value ? "border-cobalt ring-1 ring-cobalt" : "border-basalt/20")}>
                  <input type="radio" name="delivery" value={value} checked={delivery === value} onChange={() => setDelivery(value)} className="size-4 accent-cobalt" />
                  <span className="flex-1 text-small">
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-basalt/70">{date ? `Arrives by ${formatDeliveryDate(date)}` : "Enter your pincode to see the date"}</span>
                  </span>
                  <span data-price className="text-small font-semibold">
                    {price}
                  </span>
                </label>
              ))}
            </div>,
          )}

          {step(
            4,
            "Payment",
            <div role="radiogroup" aria-label="Payment method" className="grid gap-3">
              <label className={cx("flex cursor-pointer gap-4 rounded-field border p-4", payment === "online" ? "border-cobalt ring-1 ring-cobalt" : "border-basalt/20")}>
                <input type="radio" name="payment" checked={payment === "online"} onChange={() => setPayment("online")} className="mt-1 size-4 accent-cobalt" />
                <span className="flex-1 text-small">
                  <span className="flex items-center gap-2 font-semibold">
                    <CreditCard aria-hidden className="size-4" strokeWidth={1.5} /> UPI, cards or net banking
                  </span>
                  {payment === "online" && (
                    <span className="mt-3 block rounded-field border border-dashed border-basalt/30 bg-stone p-4 text-basalt/80">
                      <span className="flex items-center gap-2 font-semibold text-basalt">
                        <Lock aria-hidden className="size-4" strokeWidth={1.5} /> Payment provider goes here
                      </span>
                      This is a placeholder for Razorpay or Stripe. In this demo no payment is taken: placing the order goes straight to the
                      confirmation page.
                    </span>
                  )}
                </span>
              </label>
              <label className={cx("flex gap-4 rounded-field border p-4", !codAvailable ? "cursor-not-allowed opacity-60" : "cursor-pointer", payment === "cod" ? "border-cobalt ring-1 ring-cobalt" : "border-basalt/20")}>
                <input type="radio" name="payment" disabled={!codAvailable} checked={payment === "cod"} onChange={() => setPayment("cod")} className="mt-1 size-4 accent-cobalt" />
                <span className="flex-1 text-small">
                  <span className="block font-semibold">
                    Cash on delivery <span data-price className="font-normal text-basalt/70">(+{formatPrice(policy.codFee)})</span>
                  </span>
                  <span className="block text-basalt/70">
                    {codAvailable ? "Pay in cash or by UPI when the order arrives." : `Cash on delivery isn't available for ${values.pincode}. Pay online instead.`}
                  </span>
                </span>
              </label>
            </div>,
          )}

          <div className="border-t border-basalt/10 pt-6">
            <label className="flex cursor-pointer items-center gap-3 text-small">
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="size-4 accent-cobalt" />
              Add a gift note (prices are left off the packing slip)
            </label>
            <AnimatePresence>
              {gift && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <label htmlFor={`${id}-gift`} className="sr-only">
                    Gift note
                  </label>
                  <textarea
                    id={`${id}-gift`}
                    rows={3}
                    maxLength={200}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="mt-3 w-full rounded-field border border-basalt/25 bg-chalk px-4 py-3 text-body"
                    aria-describedby={`${id}-gift-count`}
                  />
                  <p id={`${id}-gift-count`} className="text-right text-micro text-basalt/70" data-price>
                    {200 - giftNote.length} characters left
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="submit" disabled={placing} className={buttonClasses("primary", "lg", "w-full")}>
            Place order · <span data-price>{formatPrice(totals.total)}</span>
          </button>
        </div>

        <aside aria-label="Order summary" className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[calc(var(--nav-h)+1.5rem)] rounded-surface bg-chalk p-6">
            <h2 className="type-heading text-h3">Order summary</h2>
            <div className="mt-5">{summary}</div>
          </div>
        </aside>
      </form>
    </div>
  );
}
