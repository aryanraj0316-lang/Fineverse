"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { buttonClasses } from "@/components/ui/button";
import { addToCart, newBundleId } from "@/lib/cart-actions";
import { formatPrice, needsChoice, priceKit, type Kit, type Product } from "@/lib/commerce";
import { cx } from "@/lib/cx";

interface Pick {
  handle: string;
  colour: string;
  option?: string;
}

const ease = [0.2, 0.7, 0.2, 1] as const;

function initialPick(p: Product): Pick {
  const colour = p.colours.find((c) => p.variants.some((v) => v.colour === c.name && v.available))?.name ?? p.colours[0]!.name;
  return { handle: p.handle, colour, option: p.option && !needsChoice(p) ? p.option.values[0] : undefined };
}

/** Prices roll vertically when they change (DESIGN_PLAN motion #34). */
function Rolling({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cx("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} data-price initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.3, ease }}>
          {formatPrice(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function KitBuilder({ kit }: { kit: Kit }) {
  const [picks, setPicks] = useState<Record<string, Pick>>(() =>
    Object.fromEntries(kit.slots.map((s) => [s.slot, initialPick(s.product)])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const rows = kit.slots.map((slot) => {
    const options = [slot.product, ...slot.alternatives];
    const pick = picks[slot.slot]!;
    const product = options.find((p) => p.handle === pick.handle)!;
    const variant = product.variants.find((v) => v.colour === pick.colour && v.option === pick.option);
    const colourPrices = product.variants.filter((v) => v.colour === pick.colour).map((v) => v.price);
    const price = variant?.price ?? Math.min(...colourPrices);
    return { slot, options, pick, product, variant, price };
  });

  const separate = rows.reduce((s, r) => s + r.price, 0);
  const { price: kitPrice, saving } = priceKit(separate);

  const update = (slot: string, next: Partial<Pick>) => {
    setPicks((p) => ({ ...p, [slot]: { ...p[slot]!, ...next } }));
    setErrors((e) => ({ ...e, [slot]: "" }));
  };

  const add = async () => {
    const next: Record<string, string> = {};
    for (const r of rows) {
      if (!r.variant) next[r.slot.slot] = `Choose a ${r.product.option?.name.toLowerCase()} for the ${r.product.title}.`;
      else if (!r.variant.available) next[r.slot.slot] = `${r.product.title} in ${r.variant.title} is out of stock. Choose another option.`;
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`kit-slot-${first}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setAdding(true);
    const bundleId = newBundleId();
    await addToCart({
      lines: rows.map((r) => ({ variantId: r.variant!.id, quantity: 1, bundleId })),
      sourceImage: stage.current?.querySelector("img"),
      message: "Added kit to cart",
    });
    setAdding(false);
  };

  return (
    <div className="pb-32 lg:pb-24">
      {/* The kit standing on the terrace, as in the hero's landed scene */}
      <div ref={stage} className="relative isolate overflow-hidden pt-[calc(var(--nav-h)+2rem)]">
        <Image src="/worlds/morning-desktop.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-landscape -z-10 object-cover object-bottom" />
        <Image src="/worlds/morning-mobile.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-portrait -z-10 object-cover object-bottom" />
        {/* Keeps the heading readable over the bright rock. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(243_233_222/0.92)_0%,rgb(243_233_222/0.55)_30%,transparent_55%)]" />
        <div className="px-gutter">
          <h1 className="type-display text-display">{kit.title}</h1>
          <p className="mt-3 max-w-[46ch] text-body-lg">{kit.description}</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 items-end gap-x-4 gap-y-8 px-gutter pb-10 sm:grid-cols-3 lg:mt-16 lg:grid-cols-5 lg:pb-14" aria-label="Your kit">
          {rows.map((r) => {
            const colour = r.product.colours.find((c) => c.name === r.pick.colour) ?? r.product.colours[0]!;
            const usesCutout = r.product.cutout && colour.name === r.product.colours[0]!.name;
            return (
              <li key={r.slot.slot} className="flex flex-col items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${r.product.handle}-${colour.slug}`}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="relative flex h-36 w-full items-end justify-center lg:h-48"
                  >
                    {usesCutout ? (
                      <Image src={r.product.cutout!.src} alt={r.product.title} width={r.product.cutout!.width} height={r.product.cutout!.height} sizes="(min-width: 64rem) 16vw, 40vw" className="relative max-h-full w-auto object-contain" />
                    ) : (
                      <Image src={colour.images[0].src} alt={colour.images[0].alt} width={colour.images[0].width} height={colour.images[0].height} sizes="(min-width: 64rem) 12vw, 30vw" className="relative aspect-[4/5] h-full w-auto rounded-surface object-cover" />
                    )}
                  </motion.div>
                </AnimatePresence>
                <div aria-hidden className="mt-1 h-3 w-2/3 bg-[radial-gradient(closest-side,rgb(29_28_26/0.35),transparent)]" />
                <p className="mt-2 text-center text-small font-semibold">{r.product.title}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Choices for each piece */}
      <div className="px-gutter pt-10">
        <h2 className="type-heading text-h2">Choose each piece</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {rows.map((r) => (
            <li key={r.slot.slot} id={`kit-slot-${r.slot.slot}`} className={cx("flex flex-col rounded-surface bg-chalk p-4", errors[r.slot.slot] && "ring-2 ring-error")}>
              <p className="text-micro text-basalt/70">{r.slot.label}</p>
              <label className="mt-1 block">
                <span className="sr-only">{r.slot.label}: model</span>
                <select
                  value={r.product.handle}
                  onChange={(e) => {
                    const p = r.options.find((o) => o.handle === e.target.value)!;
                    update(r.slot.slot, initialPick(p));
                  }}
                  className="h-11 w-full rounded-field border border-basalt/20 bg-chalk px-3 text-small font-semibold"
                >
                  {r.options.map((o) => (
                    <option key={o.handle} value={o.handle}>
                      {o.title}
                    </option>
                  ))}
                </select>
              </label>

              {r.product.colours.length > 1 && (
                <div role="radiogroup" aria-label={`${r.product.title} colour`} className="mt-3 flex flex-wrap gap-2">
                  {r.product.colours.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      role="radio"
                      aria-checked={r.pick.colour === c.name}
                      aria-label={c.name}
                      title={c.name}
                      onClick={() => update(r.slot.slot, { colour: c.name })}
                      className={cx("size-8 rounded-full border border-basalt/20", r.pick.colour === c.name && "ring-2 ring-cobalt ring-offset-2 ring-offset-chalk")}
                      style={{ background: c.swatch }}
                    />
                  ))}
                </div>
              )}
              {r.product.option && (
                <div role="radiogroup" aria-label={`${r.product.title} ${r.product.option.name.toLowerCase()}`} className="mt-3 flex flex-wrap gap-1.5">
                  {r.product.option.values.map((v) => {
                    const stock = r.product.variants.find((x) => x.colour === r.pick.colour && x.option === v)?.stock ?? 0;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={r.pick.option === v}
                        aria-label={`${v}${stock === 0 ? ", out of stock" : ""}`}
                        disabled={stock === 0}
                        onClick={() => update(r.slot.slot, { option: v })}
                        className={cx(
                          "h-9 min-w-9 rounded-full border px-3 text-micro font-medium disabled:line-through disabled:opacity-40",
                          r.pick.option === v ? "border-cobalt bg-cobalt text-chalk" : "border-basalt/20 hover:border-basalt",
                        )}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                <Rolling value={r.price} className="text-small font-semibold" />
                <Link href={r.product.href} className="text-micro underline underline-offset-4">
                  Details
                </Link>
              </div>
              {errors[r.slot.slot] && (
                <p role="alert" className="mt-2 text-micro text-error">
                  {errors[r.slot.slot]}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Running total: sticky on phones */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-basalt/10 bg-chalk/95 px-gutter py-3 lg:static lg:mx-gutter lg:mt-8 lg:rounded-surface lg:border lg:bg-chalk lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-small">
            <div className="flex gap-2">
              <dt className="text-basalt/70">Separately</dt>
              <dd className="line-through decoration-basalt/40">
                <Rolling value={separate} />
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-basalt/70">You save</dt>
              <dd className="font-semibold">
                <Rolling value={saving} />
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="sr-only">Kit price</dt>
              <dd className="text-h3 font-semibold">
                <Rolling value={kitPrice} />
              </dd>
            </div>
          </dl>
          <button type="button" disabled={adding} onClick={add} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
            Add kit to cart
          </button>
        </div>
      </div>
    </div>
  );
}
