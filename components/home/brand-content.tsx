import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Truck, RotateCcw, CreditCard } from "lucide-react";
import { getProduct, getPolicy, formatPrice } from "@/lib/commerce";

export function FabricEdit() {
  const handles = ["field-overshirt", "loop-hoodie", "shore-shirt"];
  return <section id="fabric-edit" className="fabric-edit" aria-labelledby="fabric-edit-title">
    <header className="content-edit-header"><div><p className="editorial-kicker">The fabric edit</p><h2 id="fabric-edit-title">Feel the difference.</h2></div><div><p>Weight, weave and room to move.<br />Everyday layers, considered down to the thread.</p><Link href="/shop/clothing">Explore the clothing edit <ArrowUpRight size={16} aria-hidden /></Link></div></header>
    <div className="fabric-edit-grid">{handles.map((handle, index) => {
      const product = getProduct(handle)!;
      const image = product.colours[0]!.images[0]!;
      const fabric = product.specs.find(([label]) => label === "Fabric")?.[1] ?? product.highlights[0]!;
      const fit = product.specs.find(([label]) => label === "Fit")?.[1]?.split(".")[0] ?? "Everyday comfort";
      return <Link href={product.href} className="fabric-edit-card" key={handle}><div className="fabric-edit-image"><Image src={image.src} alt={image.alt} fill sizes="(min-width: 48rem) 32vw, 85vw" className="object-contain" /><span className="fabric-edit-index">0{index + 1} / Material study</span></div><div className="fabric-edit-caption"><p>{fabric}</p><div><h3>{product.title}</h3><ArrowUpRight size={20} aria-hidden /></div><p className="fabric-edit-fit">{fit}<span data-price>{formatPrice(product.priceFrom)}</span></p></div></Link>;
    })}</div>
  </section>;
}

export function DesignManifesto() {
  const products = ["fold-desk-lamp", "pebble-speaker", "folio-tech-pouch"].map((handle) => getProduct(handle)!);
  return <section id="our-approach" className="design-manifesto" aria-labelledby="manifesto-title">
    <div className="manifesto-photo"><Image src="/home/manifesto/studio-collection.webp" alt="Fold Desk Lamp, Pebble Speaker and Folio Tech Pouch arranged in a sunlit stone studio" fill sizes="(min-width: 64rem) 50vw, 100vw" quality={85} className="object-cover" /><span>The studio collection</span></div>
    <div className="manifesto-copy"><p className="editorial-kicker">Designed around your day</p><h2 id="manifesto-title">A world of things.<br />A little more you.</h2><p>The clothes you reach for. The sound you get lost in. The pieces that make a space feel like yours. Fineverse brings them together through a shared eye for shape, texture and useful detail.</p><p>Start with what you love. Add what makes life easier. Build an everyday that feels like your own.</p><dl><div><dt>01 / Material</dt><dd>Texture you can see. Details you can feel.</dd></div><div><dt>02 / Function</dt><dd>Useful features with a place in your routine.</dd></div><div><dt>03 / Expression</dt><dd>Easy to put together. Yours to make personal.</dd></div></dl><ul className="manifesto-product-links" aria-label="Shop the studio collection">{products.map((product) => <li key={product.handle}><Link href={product.href}><span>{product.title}</span><span data-price>{formatPrice(product.priceFrom)}</span><ArrowUpRight size={16} aria-hidden /></Link></li>)}</ul><Link href="/about">Get to know Fineverse <ArrowUpRight size={17} aria-hidden /></Link></div>
  </section>;
}

export function ShoppingNotes() {
  const policy = getPolicy();
  const notes = [
    { icon: Truck, title: "A simpler delivery.", text: `Standard delivery is free on orders over ${formatPrice(policy.freeShippingThreshold)}. Check your pincode for an estimated arrival.`, href: "/shipping", link: "Delivery details" },
    { icon: RotateCcw, title: "Room to reconsider.", text: `Eligible unused pieces can be returned within ${policy.returnDays} days. Read the conditions before you order.`, href: "/returns", link: "Returns explained" },
    { icon: CreditCard, title: "Your way to pay.", text: "Choose UPI, cards or net banking. Cash on delivery is available on eligible pincodes; fees apply.", href: "/faq", link: "Payment questions" },
  ];
  return <section id="shopping-notes" className="shopping-notes" aria-labelledby="shopping-notes-title"><header><p className="editorial-kicker">Good to know</p><h2 id="shopping-notes-title">Considered pieces.<br />Clear details.</h2><Link href="/faq">All your questions, answered <ArrowUpRight size={16} aria-hidden /></Link></header><div className="shopping-notes-grid">{notes.map(({ icon: Icon, ...note }) => <article key={note.href}><Icon size={25} strokeWidth={1.25} aria-hidden /><h3>{note.title}</h3><p>{note.text}</p><Link href={note.href}>{note.link}<ArrowUpRight size={15} aria-hidden /></Link></article>)}</div></section>;
}
