import manifest from "@/data/static-image-manifest.json";

/** Shared by the client loader and server-side getImageProps. */
export default function staticImageSource({ src, width }: { src: string; width: number; quality?: number }): string {
  const variants = (manifest as Record<string, { width: number; src: string }[]>)[src];
  if (!variants?.length) return src;
  return (variants.find((variant) => variant.width >= width) ?? variants[variants.length - 1])!.src;
}
