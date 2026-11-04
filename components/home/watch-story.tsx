import { ProductAnatomy } from "@/components/product/product-anatomy";
import { watchAnatomy } from "@/data/product-anatomy";
import { getFrameSources } from "@/lib/frames";

interface WatchDetails {
  display: string;
  battery: string;
  waterResistance: string;
  glass: string;
  case: string;
  strap: string;
}

export function WatchStory({ product, details, watch }: {
  product: { title: string; href: string; price: string; summary: string };
  details: WatchDetails;
  watch: { src: string; width: number; height: number };
}) {
  const parts = watchAnatomy.map((part) => ({ ...part, spec:
    part.id === "glass" ? details.glass :
    part.id === "display" ? details.display :
    part.id === "battery" ? details.battery :
    part.id === "case" ? details.case + " / " + details.strap.split(",")[0] :
    part.spec,
  }));
  return <ProductAnatomy id="tide-watch" kind="watch" theme="light" eyebrow="Fineverse wearables" title="Built for every day."
    product={product} assembledSrc={watch.src} parts={parts}
    stats={[{ label: "AMOLED display", value: details.display.split("-inch")[0] + '"' }, { label: "Typical battery life", value: details.battery.split(" typical")[0]! }, { label: "Water resistance", value: details.waterResistance.split(",")[0]! }]}
    collectionHref="/shop/wearables" frames={getFrameSources("tide-breakdown")} />;
}
