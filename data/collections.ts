import type { CategoryHandle } from "./products";

/** The light each category lives in on the home page and its landing page. */
export type World = "night" | "morning" | "golden";

export interface CollectionSeed {
  handle: CategoryHandle;
  title: string;
  description: string;
  world: World;
  /** Product shown in the mega-menu and the category index. */
  featured: string;
  types: { handle: string; title: string }[];
}

export const collectionSeeds: CollectionSeed[] = [
  {
    handle: "electronics",
    title: "Electronics",
    description: "Earbuds, headphones, speakers and power banks.",
    world: "night",
    featured: "pulse-earbuds",
    types: [
      { handle: "earbuds", title: "Earbuds" },
      { handle: "headphones", title: "Headphones" },
      { handle: "speakers", title: "Speakers" },
      { handle: "power-banks", title: "Power banks" },
    ],
  },
  {
    handle: "clothing",
    title: "Clothing",
    description: "Overshirts, shirts, tees, trousers and outerwear.",
    world: "morning",
    featured: "field-overshirt",
    types: [
      { handle: "shirts", title: "Shirts and overshirts" },
      { handle: "t-shirts", title: "T-shirts" },
      { handle: "trousers", title: "Trousers" },
      { handle: "outerwear", title: "Outerwear" },
    ],
  },
  {
    handle: "wearables",
    title: "Wearables",
    description: "Smartwatches, fitness bands and sunglasses.",
    world: "golden",
    featured: "tide-watch",
    types: [
      { handle: "smartwatches", title: "Smartwatches" },
      { handle: "fitness-bands", title: "Fitness bands" },
      { handle: "sunglasses", title: "Sunglasses" },
    ],
  },
];
