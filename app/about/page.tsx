import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { formatPrice, getKit, getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "About",
  description: "Fineverse makes a small set of electronics, clothing and wearables designed to be used together.",
};

export default function AboutPage() {
  const kit = getKit();
  return (
    <div>
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden px-gutter pt-[calc(var(--nav-h)+3rem)] pb-14">
        <Image src="/hero/background-desktop.webp" alt="The empty stone terrace above the sea" fill sizes="100vw" quality={60} loading="eager" fetchPriority="high" className="ci-world-landscape -z-10 object-cover" />
        <Image src="/hero/background-mobile.webp" alt="" fill sizes="100vw" quality={60} loading="eager" fetchPriority="high" className="ci-world-portrait -z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_40%,rgb(243_233_222/0.92))]" />
        <div className="max-w-3xl">
          <h1 className="type-display text-display">Everything, in its place.</h1>
          <p className="mt-4 max-w-[46ch] text-body-lg">
            The clothes you reach for. The sound you get lost in. The pieces that make a space your own. Fineverse brings together
            everyday essentials through a shared eye for shape, texture and useful detail.
          </p>
        </div>
      </section>

      <div className="px-gutter py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <h2 className="type-heading text-h2">Fewer things, made properly</h2>
            <p className="mt-4 text-body-lg text-basalt/80">
              Explore {getProducts().length} pieces across clothing, electronics, wearables, bags, footwear and home. Start with the details: sapphire glass on the watch,
              380 gsm brushed cotton for the overshirt, a textured shell on the power bank so it doesn&rsquo;t show fingerprints.
            </p>
          </section>
          <div className="relative overflow-hidden rounded-surface lg:col-span-6 lg:col-start-7">
            <Image src="/home/products-v2/terrace.webp" alt="Everyday essentials arranged on a sunlit limestone terrace" width={1586} height={992} sizes="(min-width: 64rem) 50vw, 100vw" className="h-auto w-full" />
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-surface lg:col-span-5">
            <Image src="/products/field-overshirt/stone-grey-2.webp" alt="Close-up of the Field Overshirt's collar and label" width={960} height={1200} sizes="(min-width: 64rem) 40vw, 100vw" className="h-auto w-full" />
          </div>
          <section className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <h2 className="type-heading text-h2">Made in India, for Indian days</h2>
            <p className="mt-4 text-body-lg text-basalt/80">
              Our clothing is cut and sewn in Tiruppur and Bengaluru, in fabrics that breathe in humid heat. Electronics are designed for the
              way people here actually use them: long commutes, monsoon rain, one charger for everything.
            </p>
          </section>
        </div>

        <section className="mt-20 rounded-surface bg-chalk p-8 lg:mt-28 lg:p-12">
          <h2 className="type-heading text-h2">How we sell</h2>
          <ul className="mt-6 grid gap-6 text-body md:grid-cols-3">
            <li>
              <p className="font-semibold">Cash on delivery</p>
              <p className="mt-1 text-basalt/75">On most pincodes, so you can see it before you pay.</p>
            </li>
            <li>
              <p className="font-semibold">7-day returns</p>
              <p className="mt-1 text-basalt/75">We pick up from your door for free.</p>
            </li>
            <li>
              <p className="font-semibold">Plain prices</p>
              <p className="mt-1 text-basalt/75">No sale countdowns. The kit is the only bundle, and it&rsquo;s 10% less.</p>
            </li>
          </ul>
          <Link href={kit.href} className={buttonClasses("primary", "lg", "mt-8")}>
            Shop the Everyday Kit — <span data-price>{formatPrice(kit.price)}</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
