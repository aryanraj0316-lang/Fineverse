import Image from "next/image";
import Link from "next/link";
import { formatPrice, getPolicy } from "@/lib/commerce";
import { footerLinks, legalLinks } from "@/lib/site";
import { CarvedWordmark } from "./carved-wordmark";
import { CurrentYear } from "./current-year";
import { NewsletterForm } from "./newsletter-form";

/**
 * The terrace at sunset. Newsletter and links sit in the sky; the wordmark is
 * cut into the stone floor, in perspective.
 */
export function SiteFooter() {
  const policy = getPolicy();

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-[#2b2438] text-chalk">
      <Image
        src="/footer/terrace-sunset.webp"
        alt=""
        fill
        sizes="100vw"
        quality={60}
        className="-z-20 object-cover object-bottom"
      />
      {/* Deepens the sky behind the text so it stays readable over the glow. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(24_18_34/0.72)_0%,rgb(24_18_34/0.5)_50%,rgb(24_18_34/0)_72%)]"
      />

      <div className="grid gap-12 px-gutter pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-28">
        <section aria-labelledby="newsletter-title" className="lg:col-span-5">
          <h2 id="newsletter-title" className="type-display text-h2">
            New drops, by email
          </h2>
          <p className="mt-3 max-w-[40ch] text-body text-chalk/85">
            One email when something new arrives. No sale countdowns.
          </p>
          <NewsletterForm />
        </section>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-4 lg:col-start-9">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="text-small font-semibold">{group.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-small text-chalk/85 transition-colors hover:text-chalk">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* The carved floor. Decorative: the brand name is already in the nav. */}
      <div className="mt-10 mb-6 px-[3vw]">
        <CarvedWordmark />
      </div>

      <div className="relative flex flex-col gap-3 px-gutter pb-8 text-micro text-chalk/90 lg:flex-row lg:items-center lg:justify-between">
        <p>
          © <CurrentYear /> Fineverse. Prices include GST. Free delivery over{" "}
          <span data-price>{formatPrice(policy.freeShippingThreshold)}</span>.
        </p>
        <ul className="flex gap-5">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="underline-offset-4 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p>UPI, cards, net banking and cash on delivery</p>
      </div>
    </footer>
  );
}
