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
    description: "Earbuds, headphones, speakers, power banks and chargers.",
    world: "night",
    featured: "pulse-earbuds",
    types: [
      { handle: "earbuds", title: "Earbuds" },
      { handle: "headphones", title: "Headphones" },
      { handle: "speakers", title: "Speakers" },
      { handle: "power-banks", title: "Power banks" },
      { handle: "chargers", title: "Chargers" },
      { handle: "usb-hubs", title: "USB hubs" },
    ],
  },
  {
    handle: "clothing",
    title: "Clothing",
    description: "Overshirts, shirts, tees, trousers, outerwear and knitwear.",
    world: "morning",
    featured: "field-overshirt",
    types: [
      { handle: "shirts", title: "Shirts and overshirts" },
      { handle: "t-shirts", title: "T-shirts" },
      { handle: "trousers", title: "Trousers" },
      { handle: "outerwear", title: "Outerwear" },
      { handle: "knitwear", title: "Knitwear" },
    ],
  },
  {
    handle: "wearables",
    title: "Wearables",
    description: "Smartwatches, fitness bands, sunglasses and watch straps.",
    world: "golden",
    featured: "tide-watch",
    types: [
      { handle: "smartwatches", title: "Smartwatches" },
      { handle: "fitness-bands", title: "Fitness bands" },
      { handle: "sunglasses", title: "Sunglasses" },
      { handle: "watch-straps", title: "Watch straps" },
      { handle: "analog-watches", title: "Analogue watches" },
    ],
  },
  {
    handle: "bags", title: "Bags", world: "morning", featured: "roam-backpack",
    description: "Backpacks, weekend duffels, slings, totes and messenger bags for everyday journeys.",
    types: [{ handle: "backpacks", title: "Backpacks" }, { handle: "duffels", title: "Duffels" }, { handle: "slings", title: "Slings" }, { handle: "totes", title: "Totes" }, { handle: "messenger-bags", title: "Messenger bags" }, { handle: "tech-organizers", title: "Tech organizers" }],
  },
  {
    handle: "footwear", title: "Footwear", world: "golden", featured: "pace-sneaker",
    description: "Everyday sneakers, trail runners, sandals, ballet flats and leather derbies.",
    types: [{ handle: "sneakers", title: "Sneakers" }, { handle: "running-shoes", title: "Running shoes" }, { handle: "sandals", title: "Sandals" }, { handle: "flats", title: "Flats" }, { handle: "formal-shoes", title: "Formal shoes" }],
  },
  {
    handle: "home", title: "Home", world: "morning", featured: "form-lamp",
    description: "Considered lighting, stoneware, desk accessories, decorative pieces and soft furnishings.",
    types: [{ handle: "lighting", title: "Lighting" }, { handle: "drinkware", title: "Drinkware" }, { handle: "desk-accessories", title: "Desk accessories" }, { handle: "decor", title: "Decor" }, { handle: "soft-furnishings", title: "Soft furnishings" }],
  },
];
