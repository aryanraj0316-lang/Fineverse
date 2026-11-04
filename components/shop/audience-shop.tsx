import { getCollections, getProducts } from "@/lib/commerce";
import { ShopView } from "./shop-view";

export function AudienceShop({ audience }: { audience: "men" | "women" }) {
  const featuredHandle = audience === "men" ? "everyday-polo" : "rib-cardigan";
  const products = [...getProducts({ audience })].sort((a, b) =>
    Number(b.handle === featuredHandle) - Number(a.handle === featuredHandle)
    || Number(a.audiences.length > 1) - Number(b.audiences.length > 1),
  );
  return (
    <ShopView
      key={audience}
      title={audience === "men" ? "Men" : "Women"}
      intro={audience === "men" ? "Everyday layers, considered accessories and footwear for wherever the day takes you." : "Easy layers, thoughtful accessories and everyday footwear. Find your next favourite."}
      products={products}
      groups={getCollections().filter((collection) => products.some((product) => product.category === collection.handle)).map((collection) => ({ value: collection.handle, label: collection.title }))}
      groupParam="category"
      audience={audience}
    />
  );
}
