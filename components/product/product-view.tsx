"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, RotateCcw, Truck } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { buttonClasses } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { addToCart } from "@/lib/cart-actions";
import { formatPrice, getPolicy, needsChoice, slugify, type Product } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { useUrlParams } from "@/lib/use-url-params";
import { useRecent } from "@/stores/recent";
import { NotifyMe } from "./notify-me";
import { PincodeCheck } from "./pincode-check";
import { SizeGuide } from "./size-guide";
import { ProductSpin } from "./product-spin";

const ease = [0.2, 0.7, 0.2, 1] as const;
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2, ease } };

export function ProductView({ product }: { product: Product }) {
  const policy = getPolicy();
  const [params, setParams] = useUrlParams();
  const [notify, setNotify] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const mainButton = useRef<HTMLButtonElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const optionGroup = useRef<HTMLDivElement>(null);

  const optionKey = product.option?.name.toLowerCase() ?? "option";
  const firstAvailableColour = product.colours.find((c) => product.variants.some((v) => v.colour === c.name && v.available)) ?? product.colours[0]!;
  const colour = product.colours.find((c) => c.slug === params.get("colour")) ?? firstAvailableColour;
  const choiceRequired = needsChoice(product);
  const optionParam = product.option?.values.find((v) => slugify(v) === params.get(optionKey));
  const option = optionParam ?? (product.option && !choiceRequired ? product.option.values[0] : undefined);
  const variant = product.variants.find((v) => v.colour === colour.name && v.option === option);
  const colourVariants = product.variants.filter((v) => v.colour === colour.name);
  const price = variant?.price ?? Math.min(...colourVariants.map((v) => v.price));

  // Remember this product for "Recently viewed".
  useEffect(() => {
    useRecent.getState().record(product.handle);
  }, [product.handle]);

  // Phones: show the sticky bar once the main button has scrolled away.
  useEffect(() => {
    const el = mainButton.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry) setStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = async (source: HTMLImageElement | null) => {
    if (!variant) {
      setError(`Choose a ${optionKey} first.`);
      optionGroup.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus();
      optionGroup.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    if (!variant.available) return setNotify(true);
    setAdding(true);
    await addToCart({ lines: [{ variantId: variant.id, quantity: 1 }], sourceImage: source });
    setAdding(false);
  };

  const buttonLabel = !variant ? `Choose ${optionKey}` : !variant.available ? "Notify me when it's back" : "Add to cart";
  const stockNote = variant && variant.available && variant.stock <= 5 ? `Only ${variant.stock} left` : null;
  const care = product.specs.find(([l]) => l === "Care")?.[1];

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:px-gutter lg:pt-[calc(var(--nav-h)+2rem)]">
      {/* Gallery: stacked on desktop, swipe with progress bar on phones */}
      <div ref={gallery} className="lg:col-span-7">
        <Gallery key={colour.slug} images={colour.images} title={product.title} spin={colour.spin} colour={colour.name} />
      </div>

      {/* Buy box */}
      <div className="px-gutter pt-6 lg:col-span-5 lg:px-0 lg:pt-0">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
          <p className="text-small text-basalt/70">{product.typeTitle}</p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h1 className="type-heading text-h1">{product.title}</h1>
            <WishlistButton handle={product.handle} title={product.title} className="-mt-1 -mr-2 shrink-0" />
          </div>
          {product.rating && (
            <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-small">
              <Stars rating={product.rating.average} />
              <span className="underline underline-offset-4">
                {product.rating.average} ({product.rating.count} reviews)
              </span>
            </a>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={price} {...fade} data-price className="mt-4 text-h3 font-semibold">
              {formatPrice(price)}
            </motion.p>
          </AnimatePresence>
          <p className="text-micro text-basalt/70">Inclusive of GST</p>

          {/* Colour */}
          <div className="mt-6">
            <p className="text-small">
              Colour: <span className="font-semibold">{colour.name}</span>
            </p>
            <div role="radiogroup" aria-label="Colour" className="mt-2 flex flex-wrap gap-2">
              {product.colours.map((c) => {
                const soldOut = !product.variants.some((v) => v.colour === c.name && v.available);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    role="radio"
                    aria-checked={c.slug === colour.slug}
                    aria-label={`${c.name}${soldOut ? ", out of stock" : ""}`}
                    title={c.name}
                    onClick={() => setParams({ colour: c.slug })}
                    className={cx(
                      "relative size-10 rounded-full border border-basalt/20 transition-shadow",
                      c.slug === colour.slug && "ring-2 ring-cobalt ring-offset-2 ring-offset-stone",
                      soldOut && "opacity-50",
                    )}
                    style={{ background: c.swatch }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size / case / capacity */}
          {product.option && (
            <div className="mt-6" ref={optionGroup}>
              <div className="flex items-center justify-between">
                <p className="text-small">
                  {product.option.name}: <span className="font-semibold">{option ?? "Choose one"}</span>
                </p>
                {product.sizeGuide && <SizeGuide kind={product.sizeGuide} />}
              </div>
              <div role="radiogroup" aria-label={product.option.name} className="mt-2 flex flex-wrap gap-2">
                {product.option.values.map((v) => {
                  const stock = product.variants.find((x) => x.colour === colour.name && x.option === v)?.stock ?? 0;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={option === v}
                      aria-label={`${v}${stock === 0 ? ", out of stock" : ""}`}
                      onClick={() => {
                        setParams({ [optionKey]: slugify(v) });
                        setError(null);
                      }}
                      className={cx(
                        "h-11 min-w-12 rounded-full border px-4 text-small font-medium transition-colors",
                        option === v ? "border-cobalt bg-cobalt text-chalk" : "border-basalt/25 hover:border-basalt",
                        stock === 0 && option !== v && "text-basalt/45 line-through decoration-basalt/40",
                      )}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability: only says "low" when the stock data says so */}
          <div className="mt-5 min-h-6 text-small" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={`${variant?.id ?? "none"}-${error ?? ""}`} {...fade} className={cx(error && "text-error")}>
                {error ?? (variant ? (variant.available ? stockNote ?? "In stock, ready to ship" : `${variant.title} is out of stock`) : "")}
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            ref={mainButton}
            type="button"
            disabled={adding}
            onClick={() => add(gallery.current?.querySelector<HTMLImageElement>("[data-gallery-image]") ?? null)}
            className={buttonClasses(variant && !variant.available ? "secondary" : "primary", "lg", "mt-3 w-full")}
          >
            {buttonLabel}
          </button>

          <ul className="mt-5 flex flex-col gap-2.5 text-small">
            <li className="flex items-center gap-3">
              <Truck aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
              Free delivery over {formatPrice(policy.freeShippingThreshold)}, otherwise {formatPrice(policy.standardShipping)}
            </li>
            <li className="flex items-center gap-3">
              <Banknote aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
              Cash on delivery available ({formatPrice(policy.codFee)} fee)
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
              {policy.returnDays}-day returns, free pickup
            </li>
          </ul>

          <div className="mt-6">
            <p className="mb-2 text-small font-medium">Check delivery date</p>
            <PincodeCheck />
          </div>

          <Accordion
            headingLevel={2}
            className="mt-8"
            defaultOpen="details"
            items={[
              {
                id: "details",
                title: "Details",
                content: (
                  <>
                    <p>{product.description}</p>
                    <ul className="mt-3 list-disc pl-5">
                      {product.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </>
                ),
              },
              {
                id: "specs",
                title: "Specifications",
                content: (
                  <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 gap-y-2 text-small">
                    {product.specs.map(([l, v]) => (
                      <div key={l} className="contents">
                        <dt className="font-semibold text-basalt">{l}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
              {
                id: "delivery",
                title: "Delivery and returns",
                content: (
                  <p>
                    Orders placed before 2 pm ship the same day. Standard delivery is free over {formatPrice(policy.freeShippingThreshold)}; express costs{" "}
                    {formatPrice(policy.expressShipping)}. Return anything unused within {policy.returnDays} days and we&rsquo;ll pick it up for free.
                  </p>
                ),
              },
              ...(care ? [{ id: "care", title: "Care", content: <p>{care}</p> }] : []),
            ]}
          />
        </div>
      </div>

      {/* Phones: sticky add-to-cart bar once the main button is off screen */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.2, ease }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-basalt/10 bg-chalk px-gutter py-3 lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-small font-semibold">{product.title}</p>
              <p data-price className="text-small text-basalt/70">
                {formatPrice(price)}
                {variant ? ` · ${variant.title}` : ""}
              </p>
            </div>
            <button type="button" disabled={adding} onClick={() => add(gallery.current?.querySelector<HTMLImageElement>("[data-gallery-image]") ?? null)} className={buttonClasses(variant && !variant.available ? "secondary" : "primary", "md")}>
              {buttonLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <NotifyMe open={notify} onClose={() => setNotify(false)} productTitle={product.title} variantTitle={variant?.title ?? colour.name} />
    </div>
  );
}

function Gallery({ images, title, spin, colour }: { images: Product["colours"][number]["images"]; title: string; spin?: string[]; colour: string }) {
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"photos" | "spin">(spin ? "spin" : "photos");

  return (
    <div>
      {spin && (
        <div className="mb-4 flex gap-2 px-gutter pt-4 lg:px-0 lg:pt-0" role="group" aria-label="Product gallery mode">
          <button type="button" aria-pressed={mode === "photos"} onClick={() => setMode("photos")} className={buttonClasses(mode === "photos" ? "primary" : "secondary", "sm")}>Photos</button>
          <button type="button" aria-pressed={mode === "spin"} onClick={() => setMode("spin")} className={buttonClasses(mode === "spin" ? "primary" : "secondary", "sm")}>360° view</button>
        </div>
      )}
      {spin && mode === "spin" && <ProductSpin frames={spin} title={title} colour={colour} />}
      <div hidden={mode === "spin"}>
      <motion.div
        ref={track}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease }}
        onScroll={() => {
          const el = track.current;
          if (!el || !bar.current) return;
          const max = el.scrollWidth - el.clientWidth;
          bar.current.style.transform = `scaleX(${max ? (el.scrollLeft + el.clientWidth) / el.scrollWidth : 1})`;
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-4 lg:overflow-visible"
        aria-label={`${title} images`}
        role="region"
        tabIndex={0}
      >
        {images.map((img, i) => (
          <div key={img.src} className="w-full shrink-0 snap-center bg-sand lg:overflow-hidden lg:rounded-surface">
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 64rem) 58vw, 100vw"
              loading={i === 0 ? "eager" : undefined}
              fetchPriority={i === 0 ? "high" : undefined}
              data-gallery-image={i === 0 ? "" : undefined}
              className="aspect-[4/5] h-auto w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
      <div aria-hidden className="mx-gutter mt-3 h-0.5 overflow-hidden rounded-full bg-basalt/10 lg:hidden">
        <div ref={bar} className="h-full origin-left bg-basalt transition-transform duration-150" style={{ transform: `scaleX(${1 / images.length})` }} />
      </div>
      </div>
    </div>
  );
}
