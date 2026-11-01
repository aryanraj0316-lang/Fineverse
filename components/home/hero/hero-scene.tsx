import { getImageProps } from "next/image";
import { formatPrice, getKit } from "@/lib/commerce";
import { getFrameSources } from "@/lib/frames";
import { site } from "@/lib/site";
import { HeroStage } from "./hero-stage";

/** Server part of the hero: gathers data and image sources for the client stage. */
export function HeroScene() {
  const kit = getKit();

  const common = { alt: "", sizes: "100vw", quality: 75 } as const;
  const {
    props: { srcSet: portrait },
  } = getImageProps({ ...common, src: "/hero/background-mobile.webp", width: 1080, height: 1920 });
  const {
    props: { srcSet: landscape, src },
  } = getImageProps({ ...common, src: "/hero/background-desktop.webp", width: 1672, height: 941 });

  return (
    <HeroStage
      products={kit.slots.map((s) => ({
        slot: s.slot,
        title: s.product.title,
        href: s.product.href,
        price: formatPrice(s.product.priceFrom),
      }))}
      kitHref={kit.href}
      kitPrice={formatPrice(kit.price)}
      tagline={site.tagline}
      headline={kit.title}
      subline={`Five pieces, ${kit.discountPercent}% less than buying them separately.`}
      background={{ landscape: landscape ?? "", portrait: portrait ?? "", src: src ?? "", width: 1672, height: 941 }}
      frames={getFrameSources("hero-bg")}
    />
  );
}
