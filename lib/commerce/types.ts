import type { CategoryHandle, KitSlot, SizeGuideKind } from "@/data/products";
import type { World } from "@/data/collections";

export type { CategoryHandle, KitSlot, SizeGuideKind, World };

/** All prices are whole rupees. Format them with `formatPrice`. */
export type Rupees = number;

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ColourOption {
  name: string;
  slug: string;
  swatch: string;
  /** [packshot, second angle] */
  images: [ProductImage, ProductImage];
}

export interface Variant {
  id: string;
  colour: string;
  /** Value of the second option (size, case, capacity, waist), if the product has one. */
  option?: string;
  title: string;
  price: Rupees;
  stock: number;
  available: boolean;
}

export interface Product {
  handle: string;
  href: string;
  title: string;
  category: CategoryHandle;
  type: string;
  typeTitle: string;
  description: string;
  highlights: string[];
  specs: [label: string, value: string][];
  colours: ColourOption[];
  /** Name and values of the second option, e.g. Size: S–XXL. */
  option?: { name: string; values: string[] };
  variants: Variant[];
  priceFrom: Rupees;
  priceTo: Rupees;
  available: boolean;
  tags: string[];
  kitSlot?: KitSlot;
  sizeGuide?: SizeGuideKind;
  added: string;
  /** Transparent cut-out for scenes (hero, plinths), where one exists. */
  cutout?: ProductImage;
  rating?: { average: number; count: number };
}

export interface Review {
  id: string;
  product: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  variant?: string;
  photos: ProductImage[];
}

export interface Collection {
  handle: CategoryHandle;
  href: string;
  title: string;
  description: string;
  world: World;
  types: { handle: string; title: string; href: string }[];
  featured: Product;
}

export interface KitSlotInfo {
  slot: KitSlot;
  label: string;
  product: Product;
  alternatives: Product[];
}

export interface Kit {
  handle: string;
  href: string;
  title: string;
  description: string;
  discountPercent: number;
  slots: KitSlotInfo[];
  /** Price of the default picks bought separately. */
  separatePrice: Rupees;
  /** Kit price of the default picks. */
  price: Rupees;
  saving: Rupees;
}

export interface StorePolicy {
  freeShippingThreshold: Rupees;
  standardShipping: Rupees;
  expressShipping: Rupees;
  codFee: Rupees;
  returnDays: number;
}
