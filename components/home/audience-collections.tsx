import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/commerce";

const edits = [
  { audience: "men", title: "For him.", label: "The men's edit", description: "Easy layers. A considered everyday.", categories: "Clothing / Footwear / Accessories", image: "/home/edits/men.webp", alt: "Navy polo and stone trousers, styled in warm architectural light" },
  { audience: "women", title: "For her.", label: "The women's edit", description: "Soft textures. Strong essentials.", categories: "Clothing / Footwear / Accessories", image: "/home/edits/women.webp", alt: "Cream knitwear styled in a sunlit architectural setting" },
] as const;

export function AudienceCollections() {
  return (
    <section id="everyday-edits" className="audience-edits" aria-labelledby="shop-edits-title">
      <header className="edits-header">
        <div><p className="editorial-kicker">Two perspectives. One everyday.</p><h2 id="shop-edits-title" className="type-heading">Find your everyday.</h2></div>
        <p>Pieces to live in. Details to make your own.<br />Discover a wardrobe that works together.</p>
      </header>
      <div className="edits-grid">
        {edits.map((edit, index) => (
          <Link key={edit.audience} href={`/shop/${edit.audience}`} className="edit-card" data-audience-edit={edit.audience}>
            <div className="edit-card-media"><Image src={edit.image} alt={edit.alt} fill sizes="(min-width: 48rem) 48vw, 100vw" quality={85} className="edit-card-image" /></div>
            <div className="edit-card-top"><span>{edit.label}</span><span>{String(index + 1).padStart(2, "0")} / 02</span></div>
            <div className="edit-card-caption"><div><p>{edit.description}</p><h3>{edit.title}</h3></div><span className="edit-card-arrow" aria-hidden><ArrowUpRight size={24} strokeWidth={1.5} /></span></div>
            <div className="edit-card-footer"><span>{edit.categories}</span><span>Explore {getProducts({ audience: edit.audience }).length} pieces <ArrowUpRight size={14} aria-hidden /></span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
