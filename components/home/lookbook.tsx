"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { QuickAddButton } from "@/components/shop/add-to-cart-button";

export interface Hotspot {
  handle: string;
  x: number;
  y: number;
  title: string;
  href: string;
  price: string;
  image: { src: string; alt: string; width: number; height: number };
  description: string;
  variantId?: string;
  needsChoice: boolean;
  available: boolean;
}

interface Img { src: string; alt: string; width: number; height: number; }

export function Lookbook({ main, hotspots }: { main: Img; hotspots: Hotspot[] }) {
  const [selected, setSelected] = useState(hotspots[0]?.handle);
  const active = hotspots.find((item) => item.handle === selected) ?? hotspots[0];
  if (!active) return null;
  const activeIndex = hotspots.indexOf(active);
  return (
    <section id="the-lookbook" className="lookbook-edit" aria-labelledby="lookbook-title">
      <header className="lookbook-heading">
        <div><p className="editorial-kicker">The lookbook / The terrace edit</p><h2 id="lookbook-title" className="type-heading">Better together.</h2></div>
        <div><p>A few good pieces. An everyday well spent.<br />Explore the details that bring it all together.</p><Link href="/kit">Discover the everyday kit <ArrowUpRight size={16} aria-hidden /></Link></div>
      </header>
      <div className="lookbook-layout">
        <div className="lookbook-scene">
          <div className="lookbook-scene-image">
            <Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(min-width: 64rem) 68vw, 100vw" quality={85} />
            <div className="lookbook-scene-tag"><span className="lookbook-status-dot" />The terrace, golden hour</div>
            {hotspots.map((item, index) => (
              <button key={item.handle} type="button" data-lookbook-hotspot={item.handle} aria-label={`Explore ${item.title}`} aria-pressed={active.handle === item.handle} aria-controls="lookbook-product" onClick={() => setSelected(item.handle)} className="lookbook-marker" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
                {active.handle === item.handle ? <span>{String(index + 1).padStart(2, "0")}</span> : <Plus size={18} strokeWidth={1.5} aria-hidden />}
              </button>
            ))}
          </div>
          <div className="lookbook-scene-caption"><span><span aria-hidden>01 / </span>A study in everyday essentials.</span><span>Select a + to explore <ArrowUpRight size={14} aria-hidden /></span></div>
        </div>
        <aside id="lookbook-product" className="lookbook-product-panel" aria-label="Shop the terrace edit">
          <div className="lookbook-panel-top"><p>In this edit</p><span>{String(activeIndex + 1).padStart(2, "0")} / {String(hotspots.length).padStart(2, "0")}</span></div>
          <div className="lookbook-selected" data-product-card>
            <Link href={active.href} className="lookbook-product-image" aria-label={`View ${active.title}`}><Image key={active.handle} src={active.image.src} alt={active.image.alt} fill sizes="(min-width: 64rem) 320px, 45vw" className="object-contain" /></Link>
            <div className="lookbook-product-copy" aria-live="polite" aria-atomic="true"><p className="lookbook-product-type">Selected essential</p><Link href={active.href} className="lookbook-product-title">{active.title}<ArrowUpRight size={18} aria-hidden /></Link><p data-price className="lookbook-product-price">{active.price}</p><p className="lookbook-product-description">{active.description}</p></div>
            <QuickAddButton key={active.handle} variantId={active.variantId} href={active.href} needsChoice={active.needsChoice} available={active.available} imageSelector=".lookbook-product-image img" className="lookbook-add" />
          </div>
          <div className="lookbook-piece-list" aria-label="Choose a piece">
            {hotspots.map((item, index) => <button key={item.handle} type="button" aria-pressed={active.handle === item.handle} data-lookbook-piece={item.handle} onClick={() => setSelected(item.handle)}><span className="lookbook-piece-number">{String(index + 1).padStart(2, "0")}</span><span>{item.title}</span>{active.handle === item.handle ? <Check size={15} aria-hidden /> : <ArrowUpRight size={15} aria-hidden />}</button>)}
          </div>
        </aside>
      </div>
    </section>
  );
}
