"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { NavSentinel } from "@/components/layout/nav-sentinel";
import { ScrollFrames, type ScrollFramesHandle } from "@/components/motion/scroll-frames";
import { buttonClasses } from "@/components/ui/button";
import type { FrameSources } from "@/lib/frames";
import { gsap, useGSAP } from "@/lib/gsap";
import { beats, heroItems, type Choreography, type HeroItem, type Pose } from "./hero-items";

export interface HeroProduct {
  slot: string;
  title: string;
  href: string;
  price: string;
}

interface Props {
  products: HeroProduct[];
  kitHref: string;
  kitPrice: string;
  tagline: string;
  headline: string;
  subline: string;
  background: { landscape: string; portrait: string; src: string; width: number; height: number };
  frames?: FrameSources;
}

const DURATION = 10; // timeline units; beats are fractions of this
const noopSubscribe = () => () => {};

export function HeroStage({ products, kitHref, kitPrice, tagline, headline, subline, background, frames }: Props) {
  const root = useRef<HTMLElement>(null);
  const framesRef = useRef<ScrollFramesHandle>(null);
  const debugRef = useRef<HTMLSpanElement>(null);
  const [landed, setLanded] = useState(false);
  // ?debug shows progress and ScrollTrigger markers. Read from location directly so
  // a dev tool doesn't need useSearchParams (and a Suspense boundary).
  const debug = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).has("debug"),
    () => false,
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(
        // GSAP runs this when any condition matches, so landscape must be listed too.
        {
          landscape: "(orientation: landscape)",
          portrait: "(orientation: portrait)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { portrait, reduce } = context.conditions as { portrait: boolean; reduce: boolean };
          // Reduced motion: CSS already shows the landed still (see .hero in globals.css).
          if (reduce) {
            setLanded(true);
            return () => setLanded(false);
          }

          const mode = portrait ? "mobile" : "desktop";
          const q = gsap.utils.selector(el);
          const W = () => el.clientWidth;
          const H = () => el.clientHeight;
          const logo = document.querySelector<HTMLElement>("[data-nav-bar] [data-nav-logo]");

          // Idle bob before scrolling: on an inner wrapper, so it never fights the timeline.
          const floats = q(".hero-float") as HTMLElement[];
          const bobs = floats.map((f, i) =>
            gsap.to(f, {
              y: -4 - (i % 3),
              rotation: i % 2 ? 0.7 : -0.7,
              duration: 3.6 + (i % 4) * 0.45,
              delay: i * 0.25,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            }),
          );
          let bobbing = true;
          const setBob = (on: boolean) => {
            if (on === bobbing) return;
            bobbing = on;
            if (on) bobs.forEach((b) => b.play());
            else {
              bobs.forEach((b) => b.pause());
              gsap.to(floats, { y: 0, rotation: 0, duration: 0.4, overwrite: "auto" });
            }
          };

          let isLanded = false;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              // Short enough that the scrub follows a normal scroll: about one
              // and a third screens of scrolling from float to landed.
              end: portrait ? "+=110%" : "+=130%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              markers: debug,
              onUpdate: (self) => setBob(self.progress < 0.002),
            },
            onUpdate: () => {
              const p = tl.progress();
              framesRef.current?.render(p);
              if (debugRef.current) debugRef.current.textContent = p.toFixed(3);
              const nowLanded = p > 0.93;
              if (nowLanded !== isLanded) {
                isLanded = nowLanded;
                setLanded(nowLanded);
              }
            },
          });

          const at = (fraction: number) => fraction * DURATION;

          // Background push and the warm light sweep run the whole length.
          tl.to(q(".hero-bg"), { scale: 1.08, duration: DURATION }, 0);
          tl.fromTo(q(".hero-sweep"), { xPercent: -55 }, { xPercent: 55, duration: DURATION }, 0);
          tl.to(q(".hero-sweep"), { keyframes: { opacity: [0, 1, 0.6] }, duration: DURATION }, 0);

          if (logo) tl.to(logo, { opacity: 0, duration: 0.6 }, 0);

          for (const item of heroItems) {
            animateItem(tl, q, item, item[mode], W, H, at);
          }

          // Copy: the tagline gives way to the kit headline.
          tl.to(q(".hero-tagline"), { opacity: 0, y: 12, duration: 0.8 }, portrait ? at(beats.land) : at(beats.handoff));
          tl.fromTo(
            q(".hero-headline"),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
            at(beats.handoff) + 1.2,
          );

          // Beat 3: each part of the wordmark travels into the same part of the nav logo.
          const h1 = q(".hero-wordmark")[0] as HTMLElement | undefined;
          const parts = q(".hero-wordmark > span") as HTMLElement[];
          const logoParts = logo ? Array.from(logo.querySelectorAll<HTMLElement>("span")) : [];
          if (h1 && logo && logoParts.length === parts.length) {
            const scale = () => parseFloat(getComputedStyle(logo).fontSize) / parseFloat(getComputedStyle(h1).fontSize);
            parts.forEach((part, i) => {
              const target = logoParts[i]!;
              tl.to(
                part,
                {
                  x: () => target.offsetLeft - (h1.offsetLeft + part.offsetLeft),
                  y: () => target.offsetTop - (h1.offsetTop + part.offsetTop),
                  scale,
                  transformOrigin: "0 0",
                  duration: 2.6,
                  ease: "power2.inOut",
                },
                at(beats.handoff),
              );
            });
            tl.to(parts, { opacity: 0, duration: 0.25 }, DURATION - 0.3);
            tl.to(logo, { opacity: 1, duration: 0.25 }, DURATION - 0.3);
          }

          return () => {
            bobs.forEach((b) => b.kill());
            setLanded(false);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [debug] },
  );

  const bySlot = new Map(products.map((p) => [p.slot, p]));
  const back = heroItems.filter((i) => i.layer === "back");
  const front = heroItems.filter((i) => i.layer === "front");

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      data-landed={landed ? "" : undefined}
      className="hero relative isolate h-svh min-h-[34rem] overflow-hidden"
    >
      <NavSentinel />

      <div className="hero-bg absolute inset-0 -z-10">
        {frames ? (
          <ScrollFrames ref={framesRef} sources={frames} fallbackSrc={background.src} className="h-full w-full" />
        ) : (
          <picture>
            <source media="(orientation: portrait)" srcSet={background.portrait} />
            <source media="(orientation: landscape)" srcSet={background.landscape} />
            <img
              src={background.src}
              width={background.width}
              height={background.height}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </picture>
        )}
      </div>
      <div aria-hidden className="hero-sweep" />

      {heroItems.map((item) => (
        <div key={`shadow-${item.slot}`} aria-hidden data-slot={item.slot} className="hero-shadow" style={shadowVars(item)} />
      ))}

      {back.map((item) => (
        <HeroItemImage key={item.slot} item={item} />
      ))}

      <h1 id="hero-title" aria-label="Fineverse" className="hero-wordmark type-wordmark">
        <span>Fine</span>
        <br className="hero-br" />
        <span>verse</span>
      </h1>

      {front.map((item) => (
        <HeroItemImage key={item.slot} item={item} />
      ))}

      {/* Landed products: hit areas over each product's landed footprint, with its name and price. */}
      {heroItems.map((item) => {
        const product = bySlot.get(item.slot);
        if (!product) return null;
        return (
          <Link
            key={`spot-${item.slot}`}
            href={product.href}
            tabIndex={landed ? 0 : -1}
            aria-hidden={landed ? undefined : true}
            className="hero-spot"
            style={itemVars(item)}
          >
            <span className="hero-label">
              <span className="font-medium">{product.title}</span>
              <span data-price className="text-basalt/70">
                {product.price}
              </span>
            </span>
          </Link>
        );
      })}

      <div className="hero-headline">
        <h2 className="type-display text-display">{headline}</h2>
        <p className="mt-3 max-w-[34em] text-body-lg text-balance">{subline}</p>
      </div>

      <div className="hero-copy">
        <p className="hero-tagline max-w-[19em] text-body-lg text-balance lg:text-[1.375rem] lg:leading-[1.3]">
          {tagline}
        </p>
        <Link href={kitHref} className={buttonClasses("primary", "lg")}>
          <span>
            Shop the Everyday Kit — <span data-price>{kitPrice}</span>
          </span>
          <ArrowRight aria-hidden className="size-5" strokeWidth={1.75} />
        </Link>
      </div>

      {debug && (
        <div className="fixed right-3 bottom-3 z-[70] rounded-surface bg-basalt px-3 py-2 font-mono text-micro text-chalk">
          progress <span ref={debugRef}>0.000</span> · beats: land {beats.land}, handoff {beats.handoff}
        </div>
      )}
    </section>
  );
}

function HeroItemImage({ item }: { item: HeroItem }) {
  return (
    <div className="hero-item" data-slot={item.slot} data-layer={item.layer} style={itemVars(item)}>
      <div className="hero-float">
        <Image
          src={item.src}
          alt=""
          width={item.width}
          height={item.height}
          quality={85}
          sizes="(orientation: portrait) 62vw, 34vw"
          className="h-auto w-full select-none"
          draggable={false}
          loading="eager"
        />
      </div>
    </div>
  );
}

type Q = ReturnType<typeof gsap.utils.selector>;

/** Beat 1 drift, then beat 2 landing (with a small settle) for one product and its shadow. */
function animateItem(
  tl: gsap.core.Timeline,
  q: Q,
  item: HeroItem,
  c: Choreography,
  W: () => number,
  H: () => number,
  at: (f: number) => number,
) {
  const el = q(`.hero-item[data-slot="${item.slot}"]`)[0];
  const shadow = q(`.hero-shadow[data-slot="${item.slot}"]`)[0];
  if (!el || !shadow) return;
  const s = c.start;
  const dx = (p: Pose) => () => ((p.x - s.x) / 100) * W();
  const dy = (p: Pose) => () => ((p.y - s.y) / 100) * H();

  const driftEnd = at(beats.land);
  tl.to(el, { x: dx(c.mid), y: dy(c.mid), scale: c.mid.w / s.w, rotation: c.mid.r ?? 0, duration: driftEnd, ease: "sine.inOut" }, 0);

  const landStart = driftEnd + item.order * 0.5;
  const fall = 1.25;
  const settle = 0.3;
  tl.to(el, { x: dx(c.landed), scale: c.landed.w / s.w, rotation: c.landed.r ?? 0, duration: fall + settle, ease: "power2.inOut" }, landStart);
  tl.to(el, {
    keyframes: [
      { y: () => dy(c.landed)() + 0.012 * H(), duration: fall, ease: "power2.in" },
      { y: dy(c.landed), duration: settle, ease: "power1.out" },
    ],
  }, landStart);

  // Shadows: wider and fainter while the product rises, sharp and dark on touchdown.
  const ss = c.shadow.start;
  const sl = c.shadow.landed;
  const startWidth = s.w * ss.w;
  const landedScale = (c.landed.w * sl.w) / startWidth;
  tl.to(shadow, { scale: 1.2, opacity: (ss.opacity / SHADOW_MAX) * 0.6, duration: driftEnd, ease: "sine.inOut" }, 0);
  tl.to(
    shadow,
    {
      x: () => ((sl.x - ss.x) / 100) * W(),
      y: () => ((sl.y - ss.y) / 100) * H(),
      scaleX: landedScale,
      scaleY: landedScale * 0.8,
      opacity: sl.opacity / SHADOW_MAX,
      duration: fall,
      ease: "power2.in",
    },
    landStart,
  );
}

/** The darkest shadow alpha; each shadow's opacity is a fraction of it. */
const SHADOW_MAX = 0.62;

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

function itemVars({ desktop: d, mobile: m, width, height }: HeroItem): Vars {
  return {
    "--x": `${d.start.x}%`,
    "--y": `${d.start.y}%`,
    "--w": d.start.w,
    "--lx": `${d.landed.x}%`,
    "--ly": `${d.landed.y}%`,
    "--lw": d.landed.w,
    "--lr": `${d.landed.r ?? 0}deg`,
    "--mx": `${m.start.x}%`,
    "--my": `${m.start.y}%`,
    "--mw": m.start.w,
    "--mlx": `${m.landed.x}%`,
    "--mly": `${m.landed.y}%`,
    "--mlw": m.landed.w,
    "--mlr": `${m.landed.r ?? 0}deg`,
    "--ratio": `${width} / ${height}`,
    "--hr": height / width,
  };
}

function shadowVars({ desktop: d, mobile: m }: HeroItem): Vars {
  return {
    "--x": `${d.shadow.start.x}%`,
    "--y": `${d.shadow.start.y}%`,
    "--w": (d.start.w * d.shadow.start.w) / 100,
    "--so": d.shadow.start.opacity / SHADOW_MAX,
    "--lx": `${d.shadow.landed.x}%`,
    "--ly": `${d.shadow.landed.y}%`,
    "--lw": (d.landed.w * d.shadow.landed.w) / 100,
    "--lso": d.shadow.landed.opacity / SHADOW_MAX,
    "--mx": `${m.shadow.start.x}%`,
    "--my": `${m.shadow.start.y}%`,
    "--mw": (m.start.w * m.shadow.start.w) / 100,
    "--mso": m.shadow.start.opacity / SHADOW_MAX,
    "--mlx": `${m.shadow.landed.x}%`,
    "--mly": `${m.shadow.landed.y}%`,
    "--mlw": (m.landed.w * m.shadow.landed.w) / 100,
    "--mlso": m.shadow.landed.opacity / SHADOW_MAX,
    "--hr": 1 / 3.6,
  };
}
