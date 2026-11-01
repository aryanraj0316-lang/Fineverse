"use client";

import { useCart, type CartLine } from "@/stores/cart";
import { toast } from "@/stores/toast";

export interface AddOptions {
  lines: CartLine[];
  /** Image to fly into the cart icon (the FLIP animation). */
  sourceImage?: HTMLImageElement | null;
  /** Toast text; defaults to "Added to cart". */
  message?: string;
}

let bundleCounter = 0;
/** A unique id shared by the lines of one "Add kit to cart". */
export function newBundleId() {
  bundleCounter += 1;
  return `kit-${Date.now().toString(36)}-${bundleCounter}`;
}

type Flyer = (image: HTMLImageElement) => Promise<void>;
let flyer: Flyer | null = null;

/** The cart drawer registers the fly-to-cart animation here. */
export function registerFlyer(fn: Flyer | null) {
  flyer = fn;
}

/**
 * Every "Add to cart" button calls this: the thumbnail flies to the cart icon,
 * the badge ticks, then the drawer opens and a toast repeats the button's verb.
 */
export async function addToCart({ lines, sourceImage, message = "Added to cart" }: AddOptions) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fly = !reduce && sourceImage && flyer ? flyer(sourceImage) : Promise.resolve();
  await fly;
  useCart.getState().add(lines);
  useCart.getState().open();
  toast(message);
}
