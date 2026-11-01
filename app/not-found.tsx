import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** A lone product on the empty terrace. */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden px-gutter pt-[calc(var(--nav-h)+2rem)] pb-14">
      <Image src="/hero/background-desktop.webp" alt="" fill sizes="100vw" quality={60} loading="eager" fetchPriority="high" className="ci-world-landscape -z-20 object-cover" />
      <Image src="/hero/background-mobile.webp" alt="" fill sizes="100vw" quality={60} className="ci-world-portrait -z-20 object-cover" />

      <div aria-hidden className="absolute top-[34%] left-1/2 -z-10 w-[58vw] -translate-x-1/2 -translate-y-1/2 md:top-[50%] md:left-[70%] md:w-[min(26vw,22rem)]">
        <Image src="/hero/items/sunglasses.png" alt="" width={1325} height={566} sizes="(max-width: 48rem) 58vw, 30vw" className="h-auto w-full" />
        <div className="mx-auto mt-6 h-4 w-3/4 bg-[radial-gradient(closest-side,rgb(29_28_26/0.4),transparent)]" />
      </div>

      <div className="max-w-xl">
        <p className="text-small text-basalt/70">404</p>
        <h1 className="type-display text-display">This page isn&rsquo;t in its place.</h1>
        <p className="mt-3 text-body-lg">The link may be old, or the page has moved.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className={buttonClasses("primary", "lg")}>
            Back to home
          </Link>
          <Link href="/shop" className={buttonClasses("secondary", "lg", "bg-stone/70")}>
            Browse the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
