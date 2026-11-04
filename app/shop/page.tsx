import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { getCollections, getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Shop electronics, clothing, wearables, bags, footwear and home essentials from Fineverse. Cash on delivery and 7-day returns across India.",
};

export default function ShopAllPage() {
  return (
    <ShopView
      title="Shop all"
      intro="Considered essentials for every part of your day. Explore electronics, clothing, wearables, bags, footwear and home."
      products={getProducts()}
      groups={getCollections().map((c) => ({ value: c.handle, label: c.title }))}
      groupParam="category"
    />
  );
}
