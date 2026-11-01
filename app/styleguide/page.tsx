import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { formatPrice, getKit } from "@/lib/commerce";

export const metadata: Metadata = { title: "Style guide", robots: { index: false } };

const colours = [
  ["basalt", "#1D1C1A", "Wordmark, text, icons"],
  ["stone", "#F3E9DE", "Page background"],
  ["sand", "#D6CCBC", "Product stage, cards, skeletons"],
  ["haze", "#ACBCCF", "Sky wash next to imagery only"],
  ["chalk", "#FFFFFF", "Raised surfaces: drawer, modals, inputs"],
  ["cobalt", "#0039FE", "Interactive only: buttons, badge, focus, selected"],
] as const;

const scale = [
  ["text-display type-display", "display", "Hear less noise."],
  ["text-h1 type-heading", "h1", "Tide Watch"],
  ["text-h2 type-heading", "h2", "Bestsellers"],
  ["text-h3 type-heading", "h3", "Shirts and overshirts"],
  ["text-body-lg", "body-lg", "Tech, clothing and wearables that work together."],
  ["text-body", "body", "A 220 gsm combed-cotton tee with a tight rib collar that keeps its shape."],
  ["text-small", "small", "Delivery by Tuesday · Cash on delivery available"],
  ["text-micro", "micro", "Prices include GST"],
] as const;

/** Dev-only reference for tokens; not linked anywhere and 404s in production. */
export default function StyleGuidePage() {
  if (process.env.NODE_ENV === "production") notFound();
  const kit = getKit();

  return (
    <div className="px-gutter pt-[calc(var(--nav-h)+3rem)] pb-24">
      <h1 className="type-display text-display">Style guide</h1>

      <section className="mt-16">
        <h2 className="type-heading text-h2">Colour</h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {colours.map(([name, hex, role]) => (
            <li key={name}>
              <div className="aspect-[4/3] rounded-surface border border-basalt/10" style={{ background: hex }} />
              <p className="mt-2 text-small font-semibold">{name}</p>
              <p className="text-micro text-basalt/70">{hex}</p>
              <p className="text-micro text-basalt/70">{role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="type-heading text-h2">Wordmark width (Archivo 900, tracking −0.04em)</h2>
        <div className="mt-6 flex flex-col gap-6">
          {[62, 66, 70, 75].map((w) => (
            <div key={w} className="border-t border-basalt/10 pt-3">
              <p className="text-micro text-basalt/70">wdth {w}</p>
              <p
                data-wordmark-sample={w}
                className="type-wordmark inline-block text-[12vw]"
                style={{ fontStretch: `${w}%`, textBox: "trim-both cap alphabetic" } as React.CSSProperties}
              >
                Fineverse
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-heading text-h2">Type scale</h2>
        <ul className="mt-6 flex flex-col gap-6">
          {scale.map(([cls, name, sample]) => (
            <li key={name} className="grid gap-2 border-t border-basalt/10 pt-3 md:grid-cols-[8rem_1fr]">
              <span className="text-micro text-basalt/70">{name}</span>
              <span className={cls}>{sample}</span>
            </li>
          ))}
          <li className="grid gap-2 border-t border-basalt/10 pt-3 md:grid-cols-[8rem_1fr]">
            <span className="text-micro text-basalt/70">mega</span>
            <span className="type-mega text-mega leading-[0.84]">Wearables</span>
          </li>
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="type-heading text-h2">Actions and radius</h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href="#" className={buttonClasses("primary", "lg")}>
            Shop the Everyday Kit — <span data-price>{formatPrice(kit.price)}</span>
            <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
          </a>
          <a href="#" className={buttonClasses("primary")}>Add to cart</a>
          <a href="#" className={buttonClasses("secondary")}>Choose size</a>
          <input
            aria-label="Pincode"
            placeholder="Pincode"
            className="h-12 w-40 rounded-field border border-basalt/25 bg-chalk px-4 text-body"
          />
          <span className="grid size-11 place-items-center rounded-full border border-basalt/25">○</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-micro text-basalt/70">
          <div><div className="h-24 bg-sand" />Architecture · 0</div>
          <div><div className="h-24 rounded-surface bg-sand" />Surface · 4 px</div>
          <div><div className="h-24 rounded-field bg-sand" />Field · 8 px</div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="type-heading text-h2">Kit pricing check</h2>
        <p className="mt-4 text-body" data-price>
          Separately {formatPrice(kit.separatePrice)} · Kit {formatPrice(kit.price)} · You save{" "}
          {formatPrice(kit.saving)}
        </p>
      </section>
    </div>
  );
}
