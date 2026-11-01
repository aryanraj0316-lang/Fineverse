import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { getCollections, getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Electronics, clothing and wearables from Fineverse. Cash on delivery and 7-day returns across India.",
};

export default function ShopAllPage() {
  return (
    <ShopView
      title="Shop all"
      intro="Everything we make: electronics, clothing and wearables."
      products={getProducts()}
      groups={getCollections().map((c) => ({ value: c.handle, label: c.title }))}
      groupParam="category"
    />
  );
}
