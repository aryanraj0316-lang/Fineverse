import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/product-view";
import { CompleteTheKit, ProductRow, RecentlyViewed } from "@/components/product/product-rows";
import { ReviewsSection } from "@/components/product/reviews-section";
import { getCollection, getKit, getProduct, getProducts, getReviews } from "@/lib/commerce";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getProducts().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) return {};
  const image = p.colours[0]!.images[0];
  const description = p.description.split(". ")[0] + ".";
  return {
    title: p.title,
    description,
    alternates: { canonical: p.href },
    openGraph: { title: `${p.title} · Fineverse`, description, images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] },
  };
}

/**
 * The URL parameter is read inside <Suspense>, so the route's shared shell (and
 * instant client navigations) never depend on one URL. Each product is still
 * prerendered in full by generateStaticParams.
 */
export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div aria-hidden className="lg:grid lg:grid-cols-12 lg:gap-10 lg:px-gutter lg:pt-[calc(var(--nav-h)+2rem)]">
      <div className="aspect-[4/5] bg-sand/70 lg:col-span-7 lg:rounded-surface" />
      <div className="px-gutter pt-6 lg:col-span-5 lg:px-0 lg:pt-0">
        <div className="h-4 w-24 rounded-surface bg-sand/60" />
        <div className="mt-3 h-12 w-3/4 rounded-surface bg-sand/70" />
        <div className="mt-5 h-7 w-28 rounded-surface bg-sand/60" />
        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="size-10 rounded-full bg-sand/60" />
          ))}
        </div>
        <div className="mt-8 h-14 rounded-full bg-sand/70" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: { params: PageProps<"/products/[handle]">["params"] }) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const collection = getCollection(product.category);
  const reviews = getReviews(product.handle);
  const related = getProducts({ category: product.category }).filter((p) => p.handle !== product.handle).slice(0, 4);
  const kit = getKit();
  const kitItems = kit.slots.map((s) => s.product).filter((p) => p.handle !== product.handle);

  // Structured data: Product with one Offer per variant, and the review summary.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.variants[0]?.id,
    brand: { "@type": "Brand", name: site.name },
    image: product.colours.flatMap((c) => c.images.map((i) => new URL(i.src, site.url).toString())),
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.id,
      name: v.title,
      price: v.price,
      priceCurrency: "INR",
      availability: v.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: new URL(product.href, site.url).toString(),
    })),
    ...(product.rating && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.average, reviewCount: product.rating.count },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="px-gutter pt-[calc(var(--nav-h)+1rem)] text-small text-basalt/70 lg:hidden">
        <Link href={collection?.href ?? "/shop"} className="hover:underline">
          {collection?.title ?? "Shop"}
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page">{product.typeTitle}</span>
      </nav>
      <div className="pt-3 lg:pt-0">
        <ProductView product={product} />
      </div>
      <ReviewsSection reviews={reviews} productTitle={product.title} />
      <CompleteTheKit items={kitItems} />
      <ProductRow title={`More ${collection?.title.toLowerCase() ?? "products"}`} products={related} />
      <RecentlyViewed exclude={product.handle} />
    </>
  );
}
