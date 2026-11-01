import type { KitSlot } from "./products";

export interface KitSlotSeed {
  slot: KitSlot;
  /** What the slot is for, shown in the kit builder. */
  label: string;
  defaultProduct: string;
  /** Products that can replace the default, from the same category. */
  alternatives: string[];
}

export interface KitSeed {
  handle: string;
  title: string;
  description: string;
  /** Percentage off the five items bought separately. */
  discountPercent: number;
  slots: KitSlotSeed[];
}

/**
 * The Everyday Kit. Kit price = items' total minus `discountPercent`,
 * rounded down to the nearest ₹…99 (so rounding always favours the customer).
 * With the default picks that is exactly ₹24,999.
 */
export const kitSeed: KitSeed = {
  handle: "everyday-kit",
  title: "The Everyday Kit",
  description:
    "A watch, earbuds, sunglasses, an overshirt and a power bank, chosen to be carried and worn together. Pick a colour and size for each, or swap any item for another in its category.",
  discountPercent: 10,
  slots: [
    {
      slot: "watch",
      label: "Watch",
      defaultProduct: "tide-watch",
      alternatives: ["tide-watch-titanium", "pace-band"],
    },
    {
      slot: "earbuds",
      label: "Audio",
      defaultProduct: "pulse-earbuds",
      alternatives: ["tone-earbuds"],
    },
    {
      slot: "sunglasses",
      label: "Sunglasses",
      defaultProduct: "arc-sunglasses",
      alternatives: ["halo-sunglasses", "vale-sunglasses"],
    },
    {
      slot: "overshirt",
      label: "Layer",
      defaultProduct: "field-overshirt",
      alternatives: ["shell-jacket", "loop-hoodie"],
    },
    {
      slot: "powerbank",
      label: "Power",
      defaultProduct: "cell-power-bank",
      alternatives: ["cell-mini"],
    },
  ],
};
