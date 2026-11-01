import { Bestsellers, type Exhibit } from "@/components/home/bestsellers";
import { CategoryIndex } from "@/components/home/category-index";
import { ClothingWorld } from "@/components/home/clothing-world";
import { ElectronicsWorld, type PartLabel } from "@/components/home/electronics-world";
import { HeroScene } from "@/components/home/hero/hero-scene";
import { Intro, introScript } from "@/components/home/intro";
import { Lookbook, type Hotspot } from "@/components/home/lookbook";
import { ReviewsCarousel } from "@/components/home/reviews-carousel";
import { WatchStory, type WatchSpec } from "@/components/home/watch-story";
import { featuredReviewIds } from "@/data/reviews";
import {
  defaultVariant,
  formatPrice,
  getCollections,
  getProduct,
  getProducts,
  getReviews,
  needsChoice,
  type Product,
} from "@/lib/commerce";

const spec = (p: Product, label: string) => p.specs.find(([l]) => l === label)?.[1] ?? "";

function product(handle: string): Product {
  const p = getProduct(handle);
  if (!p) throw new Error(`Home page needs product "${handle}"`);
  return p;
}

const quickAdd = (p: Product) => ({
  variantId: defaultVariant(p)?.id,
  needsChoice: needsChoice(p),
  available: p.available,
});

/** Cut-outs sized on their plinths so the exhibits read at a consistent scale. */
const PLINTH_SCALE: Record<string, number> = {
  "pulse-earbuds": 0.58,
  "tide-watch": 0.6,
  "field-overshirt": 0.9,
  "arc-sunglasses": 0.92,
  "cell-power-bank": 0.56,
};

export default function HomePage() {
  const collections = getCollections();
  const headphones = product("hush-headphones");
  const watch = product("tide-watch");
  const overshirt = product("field-overshirt");

  const categories = collections.map((c) => {
    const featured = c.featured.cutout ? c.featured : product(c.handle === "electronics" ? "pulse-earbuds" : c.featured.handle);
    return {
      handle: c.handle,
      title: c.title,
      href: c.href,
      world: c.world,
      product: { title: featured.title, image: featured.cutout! },
    };
  });

  const partLabels: PartLabel[] = [
    { part: "headband", label: "Folds flat", value: spec(headphones, "Weight") },
    { part: "cushion", label: "Cushions", value: spec(headphones, "Cushions") },
    { part: "driver", label: "Drivers", value: spec(headphones, "Drivers") },
    { part: "mic", label: "Microphones", value: spec(headphones, "Microphones") },
    { part: "shell", label: "Battery", value: spec(headphones, "Battery") },
  ];

  const watchSpecs: WatchSpec[] = [
    { part: "glass", label: "Glass", value: `${spec(watch, "Glass")} over a ${spec(watch, "Display").split(",")[0]}` },
    { part: "crown", label: "Crown", value: spec(watch, "Crown") },
    { part: "strap", label: "Strap", value: spec(watch, "Strap") },
  ];

  const exhibits: Exhibit[] = getProducts({ tag: "bestseller" })
    .filter((p) => p.cutout)
    .map((p) => ({
      handle: p.handle,
      title: p.title,
      href: p.href,
      price: formatPrice(p.priceFrom),
      meta: p.highlights[0] ?? p.typeTitle,
      cutout: p.cutout!,
      scale: PLINTH_SCALE[p.handle] ?? 0.7,
      ...quickAdd(p),
    }));

  // Hotspot positions on the still life (public/lifestyle/still-life-terrace.webp).
  const hotspotPositions: [string, number, number][] = [
    ["field-overshirt", 40, 78],
    ["tide-watch", 64, 82],
    ["arc-sunglasses", 22, 89],
    ["pulse-earbuds", 79, 87],
    ["cell-power-bank", 92, 89],
  ];
  const hotspots: Hotspot[] = hotspotPositions.map(([handle, x, y]) => {
    const p = product(handle);
    return { handle, x, y, title: p.title, href: p.href, price: formatPrice(p.priceFrom), ...quickAdd(p) };
  });

  const reviews = getReviews();
  const slides = featuredReviewIds.flatMap((id) => {
    const r = reviews.find((x) => x.id === id);
    const p = r && getProduct(r.product);
    return r && p
      ? [{ id: r.id, quote: r.body.split(". ")[0]!.replace(/\.$/, "") + ".", author: r.author, city: r.city, rating: r.rating, product: { title: p.title, href: p.href } }]
      : [];
  });

  const electronics = collections.find((c) => c.handle === "electronics")!;
  const clothing = collections.find((c) => c.handle === "clothing")!;

  return (
    <>
      {/* Must run before the hero paints, so it sits first in the page. */}
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <Intro />
      <HeroScene />
      <CategoryIndex categories={categories} />
      <ElectronicsWorld
        product={{
          title: headphones.title,
          href: headphones.href,
          price: formatPrice(headphones.priceFrom),
          summary: "Adaptive noise cancelling, 40 mm drivers and 40 hours per charge. They fold flat into a felt case.",
        }}
        labels={partLabels}
        collectionHref={electronics.href}
      />
      <WatchStory
        product={{
          title: watch.title,
          href: watch.href,
          price: formatPrice(watch.priceFrom),
          summary: `${watch.highlights[0]}. ${watch.highlights[1]}. A round aluminium case under sapphire glass.`,
        }}
        specs={watchSpecs}
        watch={watch.cutout!}
      />
      <Bestsellers items={exhibits} viewAllHref="/shop?sort=bestsellers" />
      <ClothingWorld
        product={{
          title: overshirt.title,
          href: overshirt.href,
          price: formatPrice(overshirt.priceFrom),
          summary: "The Field Overshirt: a jacquard weave with two flap pockets and a relaxed, boxy fit. Made in Tiruppur.",
        }}
        collectionHref={clothing.href}
        shirt={overshirt.cutout!}
      />
      <Lookbook
        main={{ src: "/lifestyle/still-life-terrace.webp", alt: "The Everyday Kit resting on the stone terrace in late-afternoon light", width: 1600, height: 1000 }}
        details={[
          { src: "/products/tide-watch/basalt-2.webp", alt: "Tide Watch, close-up of the dial and crown", width: 960, height: 1200 },
          { src: "/products/field-overshirt/stone-grey-2.webp", alt: "Field Overshirt, close-up of the collar and label", width: 960, height: 1200 },
        ]}
        hotspots={hotspots}
      />
      <ReviewsCarousel reviews={slides} />
    </>
  );
}
