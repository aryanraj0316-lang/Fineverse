import { ProductAnatomy } from "@/components/product/product-anatomy";
import { headphoneAnatomy } from "@/data/product-anatomy";
import { getFrameSources } from "@/lib/frames";

interface AudioDetails {
  drivers: string;
  battery: string;
  weight: string;
  cushions: string;
  quickCharge: string;
  bluetooth: string;
}

export function ElectronicsWorld({ product, details, collectionHref }: {
  product: { title: string; href: string; price: string; summary: string };
  details: AudioDetails;
  collectionHref: string;
}) {
  return <ProductAnatomy id="hush-headphones" kind="headphones" theme="dark" eyebrow="Fineverse audio" title="Hear less noise."
    background={{ desktop: "/home/audio/acoustic-studio-desktop.webp", mobile: "/home/audio/acoustic-studio-mobile.webp" }}
    product={product} assembledSrc="/breakdowns/headphones/assembled.webp" parts={headphoneAnatomy.map((part) => ({ ...part, spec: part.id === "driver" ? details.drivers : part.id === "cushion" ? details.cushions : part.id === "battery" ? details.battery : part.spec }))}
    stats={[{ label: "Dynamic drivers", value: details.drivers.replace(" dynamic", "") }, { label: "Listening with ANC", value: details.battery.split(" with")[0]! }, { label: "Headset weight", value: details.weight }]}
    collectionHref={collectionHref} frames={getFrameSources("hush-breakdown")} />;
}
