import type { ProductSeed } from "./products";

type Audience = NonNullable<ProductSeed["audiences"]>;

/** Explicit assignments for existing products. New products can set audiences on their seed. */
export const productAudiences: Record<string, Audience> = {
  "field-overshirt": ["men"],
  "shore-shirt": ["men"],
  "stride-trousers": ["men"],
  "shell-jacket": ["men"],
  "ridge-knit": ["men"],
  "base-tee": ["men", "women"],
  "loop-hoodie": ["men", "women"],
  "tide-watch": ["men", "women"],
  "tide-watch-titanium": ["men", "women"],
  "pace-band": ["men", "women"],
  "arc-sunglasses": ["men", "women"],
  "halo-sunglasses": ["men", "women"],
  "vale-sunglasses": ["men", "women"],
  "link-strap": ["men", "women"],
  "roam-backpack": ["men", "women"],
  "weekend-duffel": ["men", "women"],
  "cross-sling": ["men", "women"],
  "market-tote": ["men", "women"],
  "transit-messenger": ["men", "women"],
  "pace-sneaker": ["men", "women"],
  "trail-runner": ["men", "women"],
  "coast-sandal": ["men", "women"],
};
