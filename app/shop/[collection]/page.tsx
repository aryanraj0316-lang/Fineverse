import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopSkeleton } from "@/components/shop/shop-skeleton";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/shop/shop-view";
import { getCollection, getCollections, getProducts } from "@/lib/commerce";

export function generateStaticParams() {
  return getCollections().map((c) => ({ collection: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  const c = getCollection(collection);
  return c ? { title: c.title, description: `${c.description} Cash on delivery and 7-day returns across India.` } : {};
}

/** The URL parameter is read inside <Suspense> so the shared route shell stays URL-independent. */
export default function CollectionPage({ params }: PageProps<"/shop/[collection]">) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

async function CollectionContent({ params }: { params: PageProps<"/shop/[collection]">["params"] }) {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  return (
    <ShopView
      title={c.title}
      intro={c.description}
      products={getProducts({ category: c.handle })}
      groups={c.types.map((t) => ({ value: t.handle, label: t.title }))}
      groupParam="type"
    />
  );
}
