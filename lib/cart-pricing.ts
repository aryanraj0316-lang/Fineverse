import { getPolicy, getVariant, priceKit } from "@/lib/commerce";
import type { Product, Rupees, Variant } from "@/lib/commerce";
import type { CartLine } from "@/stores/cart";

export interface PricedLine {
  line: CartLine;
  product: Product;
  variant: Variant;
  image: { src: string; alt: string; width: number; height: number };
  lineTotal: Rupees;
}

export interface CartTotals {
  lines: PricedLine[];
  count: number;
  subtotal: Rupees;
  /** Everyday Kit savings, one entry per complete kit in the cart. */
  bundleSaving: Rupees;
  /** Subtotal less bundle savings, before delivery. */
  merchandise: Rupees;
  freeShippingThreshold: Rupees;
  /** How much more to spend for free delivery (0 when reached). */
  toFreeShipping: Rupees;
}

/**
 * Prices a cart from catalogue data. Lines added together as a kit share a
 * bundleId; each complete kit (all five lines) gets the kit discount.
 */
export function priceCart(cartLines: CartLine[]): CartTotals {
  const lines: PricedLine[] = cartLines.flatMap((line) => {
    const found = getVariant(line.variantId);
    if (!found) return [];
    const colour = found.product.colours.find((c) => c.name === found.variant.colour) ?? found.product.colours[0]!;
    return [{ line, product: found.product, variant: found.variant, image: colour.images[0], lineTotal: found.variant.price * line.quantity }];
  });

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  let bundleSaving = 0;
  const bundles = new Map<string, PricedLine[]>();
  for (const l of lines) if (l.line.bundleId) bundles.set(l.line.bundleId, [...(bundles.get(l.line.bundleId) ?? []), l]);
  for (const group of bundles.values()) {
    if (group.length < 5) continue; // only complete kits get the kit price
    const sets = Math.min(...group.map((l) => l.line.quantity));
    const separate = group.reduce((s, l) => s + l.variant.price, 0);
    bundleSaving += priceKit(separate).saving * sets;
  }

  const merchandise = subtotal - bundleSaving;
  const { freeShippingThreshold } = getPolicy();
  return {
    lines,
    count: lines.reduce((n, l) => n + l.line.quantity, 0),
    subtotal,
    bundleSaving,
    merchandise,
    freeShippingThreshold,
    toFreeShipping: Math.max(0, freeShippingThreshold - merchandise),
  };
}
