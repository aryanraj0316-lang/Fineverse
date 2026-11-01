import type { Metadata } from "next";
import { KitBuilder } from "@/components/kit/kit-builder";
import { formatPrice, getKit } from "@/lib/commerce";

export function generateMetadata(): Metadata {
  const kit = getKit();
  return {
    title: kit.title,
    description: `A watch, earbuds, sunglasses, an overshirt and a power bank for ${formatPrice(kit.price)}, ${kit.discountPercent}% less than buying them separately.`,
  };
}

export default function KitPage() {
  return <KitBuilder kit={getKit()} />;
}
