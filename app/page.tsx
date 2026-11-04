import { Bestsellers, type Exhibit } from "@/components/home/bestsellers";
import { CategoryIndex } from "@/components/home/category-index";
import { AudienceCollections } from "@/components/home/audience-collections";
import { ClothingWorld } from "@/components/home/clothing-world";
import { ElectronicsWorld } from "@/components/home/electronics-world";
import { HeroScene } from "@/components/home/hero/hero-scene";
import { Intro, introScript } from "@/components/home/intro";
import { Lookbook, type Hotspot } from "@/components/home/lookbook";
import { ReviewsCarousel } from "@/components/home/reviews-carousel";
import { FabricEdit, DesignManifesto, ShoppingNotes } from "@/components/home/brand-content";
import { WatchStory } from "@/components/home/watch-story";
import { featuredReviewIds } from "@/data/reviews";
import homeProductImages from "@/data/home-product-images.json";
import bestsellerImages from "@/data/bestseller-images.json";
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
  "roam-backpack": 0.65,
  "pace-sneaker": 0.9,
  "cove-speaker": 0.75,
  "chrono-watch": 0.5,
  "form-lamp": 0.68,
};
const featureImages: Record<string, { src: string; width: number; height: number }> = homeProductImages;

export default function HomePage() {
  const collections = getCollections();
  const headphones = product("hush-headphones");
  const watch = product("tide-watch");
  const overshirt = product("field-overshirt");

  const categorySummaries = {
    electronics: "Earbuds, headphones & charging.",
    clothing: "Everyday layers & essential knitwear.",
    wearables: "Watches, fitness bands & eyewear.",
    bags: "Backpacks, totes & weekend carry.",
    footwear: "Sneakers, sandals & leather shoes.",
    home: "Lighting, ceramics & soft furnishings.",
  };
  const categories = collections.map((c) => ({
      handle: c.handle,
      title: c.title,
      href: c.href,
      count: getProducts({ category: c.handle }).length,
      summary: categorySummaries[c.handle],
      image: { src: `/categories/${c.handle}.webp`, alt: `${c.title} essentials from Fineverse, arranged in a studio still life`, width: 1200, height: 960 },
  }));

  const exhibits: Exhibit[] = (Object.keys(bestsellerImages) as (keyof typeof bestsellerImages)[])
    .map((handle) => ({ product: product(handle), image: bestsellerImages[handle] }))
    .map(({ product: p, image }) => ({
      handle: p.handle,
      title: p.title,
      href: p.href,
      price: formatPrice(p.priceFrom),
      meta: p.highlights[0] ?? p.typeTitle,
      cutout: image,
      scale: PLINTH_SCALE[p.handle] ?? 0.7,
      ...quickAdd(p),
    }));

  // Positions follow the new terrace photo, with all five products inside its edges.
  const hotspotPositions: [string, number, number][] = [
    ["field-overshirt", 34, 65],
    ["tide-watch", 57, 68],
    ["arc-sunglasses", 17, 79],
    ["pulse-earbuds", 72, 77],
    ["cell-power-bank", 88, 69],
  ];
  const hotspots: Hotspot[] = hotspotPositions.map(([handle, x, y]) => {
    const p = product(handle);
    return { handle, x, y, title: p.title, href: p.href, price: formatPrice(p.priceFrom), image: { ...(featureImages[handle] ?? p.colours[0]!.images[0]!), alt: p.title }, description: p.highlights[0] ?? p.typeTitle, ...quickAdd(p) };
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
      <AudienceCollections />
      <ElectronicsWorld
        product={{
          title: headphones.title,
          href: headphones.href,
          price: formatPrice(headphones.priceFrom),
          summary: "Adaptive noise cancelling, 40 mm drivers and 40 hours per charge. They fold flat into a felt case.",
        }}
        details={{
          drivers: spec(headphones, "Drivers"),
          battery: spec(headphones, "Battery"),
          weight: spec(headphones, "Weight"),
          cushions: spec(headphones, "Cushions"),
          quickCharge: spec(headphones, "Quick charge"),
          bluetooth: spec(headphones, "Bluetooth"),
        }}
        collectionHref={electronics.href}
      />
      <WatchStory
        product={{
          title: watch.title,
          href: watch.href,
          price: formatPrice(watch.priceFrom),
          summary: `${watch.highlights[0]}. ${watch.highlights[1]}. A round aluminium case under sapphire glass.`,
        }}
        details={{
          display: spec(watch, "Display"),
          battery: spec(watch, "Battery"),
          waterResistance: spec(watch, "Water resistance"),
          glass: spec(watch, "Glass"),
          case: spec(watch, "Case"),
          strap: spec(watch, "Strap"),
        }}
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
        main={{ src: "/home/products-v2/terrace.webp", alt: "Five everyday essentials arranged on a sunlit limestone terrace with a sculptural arch", width: 1586, height: 992 }}
        hotspots={hotspots}
      />
      <FabricEdit />
      <DesignManifesto />
      <ReviewsCarousel reviews={slides} />
      <ShoppingNotes />
    </>
  );
}
