/**
 * Read-only access to the mock catalogue. Pages and components get product
 * data, prices and stock only from here, never from data/ directly.
 */
import { productSeeds, type ProductSeed } from "@/data/products";
import { collectionSeeds } from "@/data/collections";
import { kitSeed } from "@/data/kit";
import { policySeed } from "@/data/policy";
import { reviewSeeds } from "@/data/reviews";
import { roundDownTo99 } from "./money";
import type {
  CategoryHandle,
  Collection,
  ColourOption,
  Kit,
  Product,
  Review,
  Rupees,
  StorePolicy,
  Variant,
} from "./types";

const PACKSHOT = { width: 1200, height: 1500 };
const DETAIL = { width: 960, height: 1200 };

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Interim cut-outs of the five photographed products (see ASSETS_TODO.md). */
const CUTOUTS: Record<string, { width: number; height: number }> = {
  watch: { width: 965, height: 1048 },
  earbuds: { width: 869, height: 851 },
  sunglasses: { width: 1325, height: 566 },
  overshirt: { width: 1078, height: 906 },
  powerbank: { width: 933, height: 879 },
};

const typeTitles = new Map(
  collectionSeeds.flatMap((c) => c.types.map((t) => [t.handle, t.title] as const)),
);

function buildProduct(seed: ProductSeed): Product {
  const colours: ColourOption[] = seed.colours.map((c) => {
    const slug = slugify(c.name);
    const base = `/products/${seed.handle}/${slug}`;
    return {
      name: c.name,
      slug,
      swatch: c.swatch,
      images: [
        { src: `${base}-1.webp`, alt: `${seed.title} in ${c.name}`, ...PACKSHOT },
        { src: `${base}-2.webp`, alt: `${seed.title} in ${c.name}, close-up`, ...DETAIL },
      ],
    };
  });

  const optionValues = seed.option?.values ?? [undefined];
  const variants: Variant[] = seed.colours.flatMap((c) =>
    optionValues.map((o) => {
      const key = o ? `${c.name}/${o.name}` : c.name;
      const stock = seed.stock.overrides?.[key] ?? seed.stock.overrides?.[c.name] ?? seed.stock.default;
      return {
        id: [seed.handle, slugify(c.name), o ? slugify(o.name) : null].filter(Boolean).join(":"),
        colour: c.name,
        option: o?.name,
        title: o ? `${c.name} / ${o.name}` : c.name,
        price: seed.price + (o?.priceDelta ?? 0),
        stock,
        available: stock > 0,
      };
    }),
  );

  const prices = variants.map((v) => v.price);
  const cut = seed.kitSlot ? CUTOUTS[seed.kitSlot] : undefined;
  const reviews = reviewSeeds.filter((r) => r.product === seed.handle);
  return {
    handle: seed.handle,
    href: `/products/${seed.handle}`,
    title: seed.title,
    category: seed.category,
    type: seed.type,
    typeTitle: typeTitles.get(seed.type) ?? seed.type,
    description: seed.description,
    highlights: seed.highlights,
    specs: seed.specs,
    colours,
    option: seed.option
      ? { name: seed.option.name, values: seed.option.values.map((v) => v.name) }
      : undefined,
    variants,
    priceFrom: Math.min(...prices),
    priceTo: Math.max(...prices),
    available: variants.some((v) => v.available),
    tags: seed.tags ?? [],
    kitSlot: seed.kitSlot,
    sizeGuide: seed.sizeGuide,
    added: seed.added,
    cutout: cut && seed.kitSlot ? { src: `/hero/items/${seed.kitSlot}.png`, alt: seed.title, ...cut } : undefined,
    rating: reviews.length
      ? { average: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10, count: reviews.length }
      : undefined,
  };
}

const products: Product[] = productSeeds.map(buildProduct);
const byHandle = new Map(products.map((p) => [p.handle, p]));

function requireProduct(handle: string): Product {
  const product = byHandle.get(handle);
  if (!product) throw new Error(`Unknown product handle in mock data: ${handle}`);
  return product;
}

export function getProducts(filter?: { category?: CategoryHandle; tag?: string }): Product[] {
  return products.filter(
    (p) =>
      (!filter?.category || p.category === filter.category) &&
      (!filter?.tag || p.tags.includes(filter.tag)),
  );
}

export function getProduct(handle: string): Product | undefined {
  return byHandle.get(handle);
}

export function getVariant(variantId: string): { product: Product; variant: Variant } | undefined {
  const handle = variantId.split(":")[0] ?? "";
  const product = byHandle.get(handle);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}

/** First in-stock variant, preferring the first colour. */
export function defaultVariant(product: Product): Variant | undefined {
  return product.variants.find((v) => v.available) ?? product.variants[0];
}

/** Clothing sizes must be chosen; capacity or case size has a sensible default. */
export function needsChoice(product: Product): boolean {
  return product.option?.name === "Size" || product.option?.name === "Waist";
}

export function getReviews(handle?: string): Review[] {
  return reviewSeeds
    .filter((r) => !handle || r.product === handle)
    .map((r) => ({
      ...r,
      photos: (r.photos ?? []).map((src) => ({ src, alt: `Photo from ${r.author}`, width: 1200, height: 1500 })),
    }));
}

export function getCollections(): Collection[] {
  return collectionSeeds.map((c) => ({
    handle: c.handle,
    href: `/shop/${c.handle}`,
    title: c.title,
    description: c.description,
    world: c.world,
    types: c.types.map((t) => ({ ...t, href: `/shop/${c.handle}?type=${t.handle}` })),
    featured: requireProduct(c.featured),
  }));
}

export function getCollection(handle: string): Collection | undefined {
  return getCollections().find((c) => c.handle === handle);
}

/** Kit price for any set of picks: the items' total less the kit discount, rounded down to ₹…99. */
export function priceKit(separatePrice: Rupees): { price: Rupees; saving: Rupees } {
  const price = roundDownTo99(separatePrice * (1 - kitSeed.discountPercent / 100));
  return { price, saving: separatePrice - price };
}

export function getKit(): Kit {
  const slots = kitSeed.slots.map((s) => ({
    slot: s.slot,
    label: s.label,
    product: requireProduct(s.defaultProduct),
    alternatives: s.alternatives.map(requireProduct),
  }));
  const separatePrice = slots.reduce((sum, s) => sum + s.product.priceFrom, 0);
  return {
    handle: kitSeed.handle,
    href: "/kit",
    title: kitSeed.title,
    description: kitSeed.description,
    discountPercent: kitSeed.discountPercent,
    slots,
    separatePrice,
    ...priceKit(separatePrice),
  };
}

export function getPolicy(): StorePolicy {
  const { freeShippingThreshold, standardShipping, expressShipping, codFee, returnDays } = policySeed;
  return { freeShippingThreshold, standardShipping, expressShipping, codFee, returnDays };
}

/**
 * Simple ranked search over the catalogue: title matches first, then product
 * type, category, colours and highlights. Every word in the query must match.
 */
export function searchProducts(query: string): Product[] {
  const words = query.toLowerCase().trim().split(/s+/).filter(Boolean);
  if (!words.length) return [];
  const scored = products.flatMap((p) => {
    const title = p.title.toLowerCase();
    const haystack = [p.title, p.typeTitle, p.type, p.category, ...p.colours.map((c) => c.name), ...p.highlights].join(" ").toLowerCase();
    if (!words.every((w) => haystack.includes(w))) return [];
    let score = 0;
    for (const w of words) {
      if (title.startsWith(w)) score += 6;
      else if (title.split(" ").some((t) => t.startsWith(w))) score += 4;
      else if (title.includes(w)) score += 3;
      else if (p.typeTitle.toLowerCase().includes(w)) score += 2;
      else score += 1;
    }
    return [{ p, score }];
  });
  return scored.sort((a, b) => b.score - a.score || a.p.title.localeCompare(b.p.title)).map((x) => x.p);
}
