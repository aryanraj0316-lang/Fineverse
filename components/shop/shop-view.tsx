"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { buttonClasses } from "@/components/ui/button";
import type { Product } from "@/lib/commerce";
import { cx } from "@/lib/cx";
import { useUrlParams } from "@/lib/use-url-params";
import { ProductCard } from "./product-card";

export interface ShopGroup {
  /** URL value for ?type= (or ?category= on the all-products page). */
  value: string;
  label: string;
}

const PRICE_BANDS = [
  { value: "under-2000", label: "Under ₹2,000", test: (p: number) => p < 2000 },
  { value: "2000-5000", label: "₹2,000 to ₹5,000", test: (p: number) => p >= 2000 && p <= 5000 },
  { value: "5000-15000", label: "₹5,000 to ₹15,000", test: (p: number) => p > 5000 && p <= 15000 },
  { value: "over-15000", label: "Over ₹15,000", test: (p: number) => p > 15000 },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "bestsellers", label: "Bestsellers" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const ease = [0.2, 0.7, 0.2, 1] as const;

export function ShopView({
  title,
  intro,
  products,
  groups,
  groupParam,
  audience,
}: {
  title: string;
  intro: string;
  products: Product[];
  groups: ShopGroup[];
  groupParam: "type" | "category";
  audience?: "men" | "women";
}) {
  const [params, setParams] = useUrlParams();
  const [sheet, setSheet] = useState(false);
  const group = params.get(groupParam);
  const colourParam = params.get("colour");
  const colours = useMemo(() => (colourParam ? colourParam.split(",") : []), [colourParam]);
  const price = params.get("price");
  const inStock = params.get("stock") === "in";
  const sort = params.get("sort") ?? "featured";

  const allColours = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colours.forEach((c) => map.set(c.name, c.swatch)));
    return [...map.entries()];
  }, [products]);

  const visible = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.value === price);
    const list = products.filter(
      (p) =>
        (!group || (groupParam === "type" ? p.type === group : p.category === group)) &&
        (!colours.length || p.colours.some((c) => colours.includes(c.name))) &&
        (!band || band.test(p.priceFrom)) &&
        (!inStock || p.available),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "price-desc") sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "newest") sorted.sort((a, b) => b.added.localeCompare(a.added));
    if (sort === "bestsellers")
      sorted.sort((a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) || (b.rating?.count ?? 0) - (a.rating?.count ?? 0));
    return sorted;
  }, [products, group, groupParam, colours, price, inStock, sort]);

  const active = (group ? 1 : 0) + colours.length + (price ? 1 : 0) + (inStock ? 1 : 0);
  const clear = () => setParams({ [groupParam]: null, colour: null, price: null, stock: null });

  const filterControls = (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="text-small font-semibold">Colour</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {allColours.map(([name, swatch]) => {
            const on = colours.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                onClick={() => setParams({ colour: (on ? colours.filter((c) => c !== name) : [...colours, name]).join(",") || null })}
                className={cx(
                  "flex h-9 items-center gap-2 rounded-full border pr-3 pl-1.5 text-small",
                  on ? "border-cobalt text-basalt ring-1 ring-cobalt" : "border-basalt/20 hover:border-basalt",
                )}
              >
                <span aria-hidden className="size-6 rounded-full border border-basalt/15" style={{ background: swatch }} />
                {name}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-small font-semibold">Price</legend>
        <div className="mt-3 flex flex-col gap-2">
          {PRICE_BANDS.map((b) => (
            <label key={b.value} className="flex cursor-pointer items-center gap-3 text-small">
              <input
                type="radio"
                name="price"
                checked={price === b.value}
                onChange={() => setParams({ price: b.value })}
                className="size-4 accent-cobalt"
              />
              {b.label}
            </label>
          ))}
          {price && (
            <button type="button" onClick={() => setParams({ price: null })} className="self-start text-small underline underline-offset-4">
              Any price
            </button>
          )}
        </div>
      </fieldset>
      <label className="flex cursor-pointer items-center gap-3 text-small">
        <input type="checkbox" checked={inStock} onChange={(e) => setParams({ stock: e.target.checked ? "in" : null })} className="size-4 accent-cobalt" />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <header className="max-w-3xl">
        <h1 className="type-display text-display">{title}</h1>
        <p className="mt-3 text-body-lg text-basalt/75">{intro}</p>
      </header>

      <nav aria-label="Shop edits" className="mt-6 flex flex-wrap gap-3">
        {[{ href: "/shop", label: "Shop all", value: undefined }, { href: "/shop/men", label: "Men", value: "men" }, { href: "/shop/women", label: "Women", value: "women" }].map((edit) => (
          <Link key={edit.href} href={edit.href} aria-current={edit.value === audience && groupParam === "category" ? "page" : undefined} className={cx("rounded-full border px-5 py-2.5 text-small font-medium transition-colors", edit.value === audience && groupParam === "category" ? "border-cobalt bg-cobalt text-chalk" : "border-basalt/20 hover:border-basalt")}>{edit.label}</Link>
        ))}
      </nav>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label={groupParam === "type" ? "Product type" : "Category"}>
        {[{ value: "", label: "All" }, ...groups].map((g) => {
          const on = (group ?? "") === g.value;
          return (
            <button
              key={g.value || "all"}
              type="button"
              aria-pressed={on}
              onClick={() => setParams({ [groupParam]: g.value || null })}
              className={cx(
                "h-10 shrink-0 rounded-full border px-4 text-small font-medium transition-colors",
                on ? "border-basalt bg-basalt text-chalk" : "border-basalt/20 hover:border-basalt",
              )}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-b border-basalt/10 pb-4">
        <p className="text-small whitespace-nowrap text-basalt/75" aria-live="polite">
          <span data-price>{visible.length}</span> {visible.length === 1 ? "product" : "products"}
        </p>
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" onClick={() => setSheet(true)} className={buttonClasses("secondary", "sm", "shrink-0 lg:hidden")}>
            <SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.5} />
            Filter{active ? ` (${active})` : ""}
          </button>
          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParams({ sort: e.target.value === "featured" ? null : e.target.value })}
            className="h-11 min-w-0 rounded-full border border-basalt/25 bg-transparent px-4 text-small"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-10">
        <aside className="hidden lg:col-span-3 lg:block xl:col-span-2" aria-label="Filters">
          {filterControls}
          {active > 0 && (
            <button type="button" onClick={clear} className="mt-8 text-small underline underline-offset-4">
              Clear filters
            </button>
          )}
        </aside>

        <div className="lg:col-span-9 xl:col-span-10">
          {visible.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-16">
              <p className="text-body-lg">No products match these filters.</p>
              <button type="button" onClick={clear} className={buttonClasses("secondary")}>
                Clear filters
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((p, i) => (
                  <motion.li
                    key={p.handle}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <ProductCard product={p} priority={i < 2} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>

      <Dialog open={sheet} onClose={() => setSheet(false)} title="Filter">
        <div className="p-5">{filterControls}</div>
        <div className="sticky bottom-0 flex gap-3 border-t border-basalt/10 bg-chalk p-5">
          <button type="button" onClick={clear} className={buttonClasses("secondary", "md", "flex-1")}>
            Clear
          </button>
          <button type="button" onClick={() => setSheet(false)} className={buttonClasses("primary", "md", "flex-1")}>
            Show {visible.length} {visible.length === 1 ? "product" : "products"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
