"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import type { OrderAddress } from "@/data/orders";
import { formatPhone, INDIAN_STATES, priceOrder, validate } from "@/lib/checkout";
import { formatPrice } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { useAuth } from "@/stores/auth";
import { allOrders, useOrders } from "@/stores/orders";
import { toast } from "@/stores/toast";

const TABS = ["Orders", "Addresses", "Wishlist"] as const;
const STATUS_LABEL = { ordered: "Ordered", packed: "Packed", shipped: "Shipped", "out-for-delivery": "Out for delivery", delivered: "Delivered" } as const;
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

export function AccountView() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const placed = useOrders((s) => s.placed);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Orders");
  const tabId = useId();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-gutter pt-[calc(var(--nav-h)+3rem)] pb-24">
        <h1 className="type-display text-h1">Account</h1>
        <p className="mt-4 text-body-lg">Log in with your mobile number to see orders, addresses and your wishlist.</p>
        <Link href="/login" className={buttonClasses("primary", "lg", "mt-6 w-full")}>
          Log in
        </Link>
        <p className="mt-6 text-small text-basalt/75">
          Only want to check a delivery?{" "}
          <Link href="/track" className="underline underline-offset-4">
            Track an order without logging in
          </Link>
        </p>
      </div>
    );
  }

  const orders = allOrders(placed).filter((o) => o.phone === user.phone);

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-display text-h1">{user.name ? `Hello, ${user.name.split(" ")[0]}` : "Your account"}</h1>
          <p className="mt-1 text-small text-basalt/70">+91 {formatPhone(user.phone)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut();
            toast("Logged out");
          }}
          className="text-small underline underline-offset-4"
        >
          Log out
        </button>
      </div>

      <div role="tablist" aria-label="Account" className="mt-8 flex gap-1 border-b border-basalt/10">
        {TABS.map((t) => (
          <button
            key={t}
            id={`${tabId}-${t}`}
            role="tab"
            type="button"
            aria-selected={tab === t}
            aria-controls={`${tabId}-${t}-panel`}
            onClick={() => setTab(t)}
            onKeyDown={(e) => {
              const i = TABS.indexOf(t);
              if (e.key === "ArrowRight") setTab(TABS[(i + 1) % TABS.length]!);
              if (e.key === "ArrowLeft") setTab(TABS[(i + TABS.length - 1) % TABS.length]!);
            }}
            tabIndex={tab === t ? 0 : -1}
            className={cx("-mb-px border-b-2 px-4 py-3 text-small font-medium", tab === t ? "border-basalt" : "border-transparent text-basalt/70 hover:text-basalt")}
          >
            {t}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${tabId}-${tab}-panel`} aria-labelledby={`${tabId}-${tab}`} className="mt-8">
        {tab === "Orders" &&
          (orders.length ? (
            <ul className="border-t border-basalt/10">
              {orders.map((o) => {
                const t = priceOrder(o.lines, { coupon: o.coupon, delivery: o.delivery, payment: o.payment });
                return (
                  <li key={o.id} className="border-b border-basalt/10">
                    <Link href={`/account/orders/${o.id}`} className="flex items-center gap-4 py-5">
                      <div className="flex-1">
                        <p className="text-small font-semibold">
                          {o.id} <span className="font-normal text-basalt/70">· {shortDate(o.placed)}</span>
                        </p>
                        <p className="text-small text-basalt/75">
                          {STATUS_LABEL[o.status]}
                          {o.status === "delivered" ? "" : ` · arriving by ${shortDate(o.estimated)}`} · {t.count} {t.count === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <span data-price className="text-small font-semibold">
                        {formatPrice(t.total)}
                      </span>
                      <ChevronRight aria-hidden className="size-4" strokeWidth={1.5} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-body-lg">No orders yet.</p>
          ))}

        {tab === "Addresses" && <Addresses orders={orders.map((o) => o.address)} />}

        {tab === "Wishlist" && (
          <div className="-mx-gutter -mt-[calc(var(--nav-h)+2.5rem)] [&_h1]:sr-only">
            <WishlistView />
          </div>
        )}
      </div>
    </div>
  );
}

function Addresses({ orders }: { orders: OrderAddress[] }) {
  const saved = useAuth((s) => s.addresses);
  const add = useAuth((s) => s.addAddress);
  const removeAddress = useAuth((s) => s.removeAddress);
  const [adding, setAdding] = useState(false);
  const fromOrders = orders.filter((a, i) => orders.findIndex((b) => b.line1 === a.line1 && b.pincode === a.pincode) === i);

  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fromOrders.map((a) => (
          <li key={`${a.line1}-${a.pincode}`} className="rounded-surface bg-chalk p-5 text-small">
            <p className="font-semibold">{a.name}</p>
            <AddressLines a={a} />
            <p className="mt-3 text-micro text-basalt/70">Used on past orders</p>
          </li>
        ))}
        {saved.map((a, i) => (
          <li key={`saved-${i}`} className="rounded-surface bg-chalk p-5 text-small">
            <p className="font-semibold">{a.name}</p>
            <AddressLines a={a} />
            <button type="button" onClick={() => removeAddress(i)} className="mt-3 underline underline-offset-4">
              Remove
            </button>
          </li>
        ))}
      </ul>
      {adding ? (
        <AddressForm
          onCancel={() => setAdding(false)}
          onSave={(a) => {
            add(a);
            setAdding(false);
            toast("Address saved");
          }}
        />
      ) : (
        <button type="button" onClick={() => setAdding(true)} className={buttonClasses("secondary", "md", "mt-6")}>
          Add an address
        </button>
      )}
    </div>
  );
}

function AddressLines({ a }: { a: OrderAddress }) {
  return (
    <address className="mt-1 not-italic text-basalt/80">
      {a.line1}
      {a.line2 && (
        <>
          <br />
          {a.line2}
        </>
      )}
      <br />
      {a.city}, {a.state} {a.pincode}
    </address>
  );
}

function AddressForm({ onSave, onCancel }: { onSave: (a: OrderAddress) => void; onCancel: () => void }) {
  const id = useId();
  const [v, setV] = useState<OrderAddress>({ name: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderAddress, string>>>({});
  const field = (k: keyof OrderAddress, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`${id}-${k}`} className="text-small font-medium">
        {label}
      </label>
      <input
        id={`${id}-${k}`}
        value={v[k] ?? ""}
        onChange={(e) => setV({ ...v, [k]: e.target.value })}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        className={cx("mt-1.5 h-12 w-full rounded-field border bg-chalk px-4 text-body", errors[k] ? "border-error" : "border-basalt/25")}
        {...extra}
      />
      {errors[k] && (
        <p id={`${id}-${k}-err`} className="mt-1.5 text-small text-error">
          {errors[k]}
        </p>
      )}
    </div>
  );
  return (
    <form
      noValidate
      className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const next = {
          name: validate.required(v.name, "the full name") ?? undefined,
          line1: validate.required(v.line1, "the house or flat number and street") ?? undefined,
          city: validate.required(v.city, "the city or town") ?? undefined,
          state: v.state ? undefined : "Choose a state.",
          pincode: validate.pincode(v.pincode) ?? undefined,
        };
        setErrors(next);
        if (Object.values(next).some(Boolean)) return;
        onSave({ ...v, line2: v.line2 || undefined });
      }}
    >
      <div className="sm:col-span-2">{field("name", "Full name", { autoComplete: "name" })}</div>
      <div className="sm:col-span-2">{field("line1", "House or flat number, street", { autoComplete: "address-line1" })}</div>
      <div className="sm:col-span-2">{field("line2", "Area or landmark (optional)", { autoComplete: "address-line2" })}</div>
      {field("pincode", "Pincode", { inputMode: "numeric", maxLength: 6 })}
      {field("city", "City or town")}
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-state`} className="text-small font-medium">
          State
        </label>
        <select
          id={`${id}-state`}
          value={v.state}
          onChange={(e) => setV({ ...v, state: e.target.value })}
          aria-invalid={errors.state ? true : undefined}
          className={cx("mt-1.5 h-12 w-full rounded-field border bg-chalk px-4 text-body", errors.state ? "border-error" : "border-basalt/25")}
        >
          <option value="">Choose a state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {errors.state && <p className="mt-1.5 text-small text-error">{errors.state}</p>}
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" className={buttonClasses("primary", "md")}>
          Save address
        </button>
        <button type="button" onClick={onCancel} className={buttonClasses("secondary", "md")}>
          Cancel
        </button>
      </div>
    </form>
  );
}
