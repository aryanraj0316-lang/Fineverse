# Fineverse: Design Plan (Phase 0)

Status: **approved 2026-10-31.** D1–D3 resolved as recommended, with layouts following the brief (see the end of `BUILD_BRIEF.md`). Scope: front-end UI only, on mock data. Values changed during Phase 1 are marked *(updated)*.

---

## 0. What I found in the workspace (read this first)

The brief assumes a folder layout that doesn't exist yet. Here is what is actually here:

| Brief expects | What exists | Plan |
|---|---|---|
| `/reference-project/` (travel site) | The travel site **is** this repo's root (`app/`, `components/`, `lib/`) | See decision D1 below |
| `/reference/home-hero.png` | `3ebee0ee-….png` (1672×941), the hero mockup | Move to `reference/home-hero.png` |
| `/reference/section-*.png` (6 files) | **One** full-page mockup `cb2ab607-….png` (1024×1536) covering every home section | Move to `reference/home-full.png`. Section notes below work from crops of it |
| `/public/hero/background-desktop.webp` | `b0930f1d-….png` (1672×941, empty terrace) | Convert to WebP. **Too small for 1440/1920 desktop at 2× DPR**: needs a ≥2560 px master |
| `background-mobile.webp` (9:16) | Missing | Interim: centre crop of the desktop plate (≈530×941, soft on phones). Needs a real 9:16 render |
| `/public/hero/items/*.png` transparent cut-outs | 5 product renders: watch, earbuds, sunglasses, overshirt, power bank. **None have transparency**: 4 on sand `#D6CCBC`, the watch on white | See decision D2 |
| `/public/frames/*` (optional) | None | Use the still and layered fallbacks the brief describes |
| `/public/products/` packshots (18 × 2) | 5 usable renders (above) | Reuse for 5 products; the other 13 get labelled placeholders |
| `/public/lifestyle/` | None | Labelled placeholders (lookbook, clothing macro, About) |
| Headphones (Electronics world) | None. The mockup shows them in the Electronics tile but there's no source file | Placeholder |

Everything missing will be listed in `ASSETS_TODO.md` with exact sizes. No stock photos.

### Decisions I need from you

- **D1: where the new app lives.** Recommended: move the travel site into `reference-project/` (one `git mv`, history kept) and build Fineverse at the repo root, as the brief describes. Alternative: build Fineverse in a new `fineverse/` folder and leave the travel site untouched.
- **D2: cut-outs.** Recommended: until you supply real alpha PNGs, I generate interim cut-outs locally with a background-removal model (`rembg`, about 170 MB one-time download) and clean up the edges. The watch, sunglasses and power bank will cut cleanly. **The earbuds (beige on beige) and the overshirt (warm grey on sand) will have weak edges**, so they're flagged as must-replace. Alternative: wait for your cut-outs and use labelled boxes until then.
- **D3: brief vs. full-page mockup.** In several sections the mockup shows a simpler layout than the brief (see §1.3). I plan to follow the **brief's interactions** and dress them in the **mockup's visual language**: its photography, light, type and button style. Say if you'd rather match the mockup literally.

---

## 1. Concept

### 1.1 "Everything, in its place"

Fineverse sells a few objects that are made to be used together, and the site shows them as objects in a real, sunlit, architectural place, never as floating ads. Every scroll moment moves something to where it belongs: products land on the stone, the wordmark settles into the nav, the light moves across the day, and the shop itself stays calm and orderly.

### 1.2 How each home section expresses it

| # | Section | How it expresses the concept |
|---|---|---|
| 1 | Intro | The "F" mark resolves and becomes the first frame of the hero. Nothing is replaced, it moves into position. |
| 2 | Hero | Five floating products drift, descend and land in a precise row on the terrace. The wordmark shrinks into its place in the nav. This is the concept, literally. |
| 3 | Category index | Three names, each with its own object and its own light. Hovering puts the object in front of its name. |
| 4 | Electronics world | Night on the same terrace. The headphones come apart into their parts, each part labelled and in its place. |
| 5 | Watch story | One object at monumental scale; specs pinned to the exact parts they describe (crown, glass, strap). |
| 6 | Bestsellers | Products on stone plinths, like a gallery: each item has its own place and a placard. |
| 7 | Clothing world | Morning light. The folded overshirt unfolds, the fabric seen up close. |
| 8 | Lookbook | The products in use, on people, in the same landscape. Hotspots show where each item is. |
| 9 | Reviews | One statement at a time, set large, with room around it. |
| 10 | Footer | Sunset on the terrace; the wordmark is cut into the floor. The day ends where it began. |

### 1.3 Mockup study: what I match exactly and where I improve

**Hero (`home-hero.png`): match exactly**
- Terrace plate: rock left, concrete portal right, sea and hills on the horizon, sky running from `#ACBCCF` down to warm haze.
- Wordmark: live text, heavy black grotesk, tight tracking, edge to edge with about 2.5% side margin. Cap height is about 40% of viewport height, top at about 9.5% from the top.
- Depth: earbuds and sunglasses **behind** the letters; watch, overshirt and power bank **in front**. Shadows on the floor are soft and offset to the lower left, so the sun is upper right.
- Small nav: wordmark logo, three category links, search and cart icons, cobalt cart badge.
- Bottom left: "Tech, clothing and wearables that work together." Bottom right: one cobalt pill button.

**Hero: where I improve**
- **Shadows**: the mockup's shadows are baked into the floor and don't match the product positions. Ours are generated per item, so they track height and sharpen on landing.
- **Contrast**: the left half of the hero copy sits on bright floor. I add a very soft floor-darkening gradient behind the copy only, to keep it at 4.5:1 or better.
- **Nav overlap**: the mockup nav sits only about 50 px above the wordmark. I reserve a fixed nav band so nothing overlaps at any width. On short desktop viewports (height under 760 px) the wordmark scales by viewport height, not width.
- **Mobile**: the mockup is desktop only. On mobile the wordmark stacks as "Fine / verse", products sit in a 2-column landing, and the copy and button go in a bottom sheet area clear of products.
- **Button arrow**: kept on this one primary CTA only (see §5).

**Full-page mockup (`home-full.png`): section by section**

| Section | Mockup shows | I match | I change (and why) |
|---|---|---|---|
| Categories | 3 photo tiles: headphones at night, shirt on stone, watch at golden hour | The three lights (night, morning, golden) and the product per world | Brief asks for huge stacked names with a hover reveal. I keep the tiles' photography as the **light change** behind the names. On mobile, each name gets its tile image as a full-width band, because hover doesn't exist there |
| Bestsellers | 4 sand cards, small radius, cart icon button | Sand ground, name plus price in bold, ₹ formatting | Brief asks for plinths and placards with horizontal pin. I keep the mockup's restraint: plinths are plain stone blocks, not pedestals with ornament. The cart icon becomes an "Add to cart" text button because icon-only buttons are ambiguous for purchase |
| Watch | "Built for every day." large crop of the dial, 3 spec icons | Monumental crop, headline, the three specs (14-day battery, water resistant to 50 m, sapphire glass) | Specs move from an icon row into leader-line callouts pointing at crown, glass and strap (brief). Body copy rewritten to be specific (see §5) |
| Electronics | "Hear less noise." earbuds at night, cobalt button | Night world, headline, button style | Brief specifies headphones exploding. I use **headphones** for the explode, and reuse "Hear less noise." as the world's headline. The earbuds feature in the bestsellers and kit |
| Lookbook | 3 equal images in a row | Photography direction: people in the overshirt, watch, sunglasses, same coast | Brief asks for one large image with two smaller ones overlapping, plus hotspots. Equal-width rows are a template pattern |
| Reviews | 3 short quotes in columns | Name plus "Purchased {product}" line | One review at a time, set large (brief). Three small quotes read as filler |
| Footer | Flat wordmark plus 4 link columns plus newsletter on stone | Link groups, newsletter with cobalt button, legal row | Wordmark carved into the floor in perspective, at sunset (brief). Links stay flat and readable above it |

---

## 2. Tokens

### 2.1 Colour (sampled from the mockups)

| Token | Hex | Role |
|---|---|---|
| `basalt` | `#1D1C1A` | Wordmark, all text, icons, primary borders. Warm near-black, not pure black, so it sits on stone without buzzing. |
| `stone` | `#F3E9DE` | Page background (sampled from the mockup's page ground). |
| `sand` | `#D6CCBC` | Product stage: card and packshot backgrounds, plinth tops, skeletons. It's the exact backdrop of the supplied renders, so packshots blend into cards seamlessly. |
| `haze` | `#ACBCCF` | Sky wash. Used only in imagery-adjacent surfaces (hero top fade, 404 sky, About). Never for UI controls. |
| `chalk` | `#FFFFFF` | Raised surfaces: drawer, modals, inputs, search palette. |
| `cobalt` | `#0039FE` | **Interactive only**: primary buttons, cart badge, focus ring, selected variant, links in body text, progress bars. White on cobalt is 7.0:1; cobalt on stone is 5.8:1. |

Functional colours (not brand colours, used only for state): `error #B42318` (6.4:1 on chalk), `success` uses `basalt` plus a check icon rather than green, so the palette stays disciplined.

World lighting values (photography and gradient overlays, not UI tokens): night `#07080B → #1A2030`, morning `#F6F1EA` with cool shadow `#C9CFD6`, golden `#E8B57A → #C9824A`, sunset `#E58A5B → #3A2A3F`.

Text opacity steps instead of extra greys: `basalt/100` primary, `basalt/70` secondary, `basalt/50` disabled and meta (only at 16 px or larger, checked for contrast).

### 2.2 Typeface

**Archivo** (Omnibus-Type, variable, `wght` 100–900 × `wdth` 62–125, OFL, self-hosted via `next/font`). One family does every job:

| Role | Setting |
|---|---|
| Wordmark (hero, footer, 404) | wght 900, wdth 70, tracking −0.04em *(updated: chosen against the mockup on `/styleguide`; sized from the measured width so it spans 95% of the screen)* |
| Display headlines | wght 800, wdth 86, tracking −0.03em |
| Section headings | wght 700, wdth 92 |
| Category index names | wght 900, wdth 70 (condensed, so "Electronics" fits edge to edge on a 360 px phone) |
| UI, body | wght 400 / 500, wdth 100 |
| Prices | wght 600, `font-variant-numeric: tabular-nums` so totals don't jitter when they update |

*(updated)* Shipped as one self-hosted 61 KB variable subset (weight 400–900, width 62–100, Latin + ₹), not from Google's CDN.

**Why Archivo:** the mockup's wordmark is a Helvetica-Now-Black-style heavy grotesk. Archivo at 900 has the same flat terminals and big x-height. Its **width axis** gives the "condensed-ish" giant type and the plain body text from one file. Not Inter, Poppins or Montserrat. If the client later licenses Neue Haas Grotesk Display or Helvetica Now, it's a one-line swap in `app/fonts.ts`.

### 2.3 Type scale (fluid, mobile → desktop)

| Token | Size | Use |
|---|---|---|
| `wordmark` | fit-to-width (≈ 23.5vw desktop, 2 lines at 38vw mobile), clamped by `vh` | Hero, footer |
| `mega` | clamp(64px, 16vw, 240px) | Category index names |
| `display` | clamp(40px, 6.5vw, 96px) | World headlines ("Built for every day.") |
| `h1` | clamp(32px, 4vw, 56px) | Page titles, PDP product name |
| `h2` | clamp(24px, 2.6vw, 36px) | Section titles ("Bestsellers") |
| `h3` | 20px | Card group titles, drawer title |
| `body-lg` | 18px / 1.5 | Hero copy, review statement on mobile |
| `body` | 16px / 1.55 | Default (never below 16 on inputs, to prevent iOS zoom) |
| `small` | 14px / 1.45 | Card names and prices, meta |
| `micro` | 12px / 1.4 | Legal, badge counts only |

### 2.4 Spacing

4 px base: `1=4 2=8 3=12 4=16 6=24 8=32 12=48 16=64 24=96 32=128 48=192`.
Page gutter: 16 px (360) → 24 (768) → 44 (1440, matches the mockup's left edge). Grid: 4 columns on mobile, 8 on tablet, 12 on desktop. Section rhythm between "big moments": `24`–`32` (generous, so the page breathes).

### 2.5 Radius (varies by hierarchy, on purpose)

| Level | Radius | Elements | Why |
|---|---|---|---|
| Architecture | **0** | Full-bleed images, world sections, plinths, footer, drawer edge | Stone is cut square. Hard edges read as architectural and premium. |
| Surfaces | **4 px** | Product cards, modals, search palette, toasts | Barely softened, as in the mockup's bestseller cards. |
| Fields | **8 px** | Inputs, selects, pincode field, coupon field | Soft enough to read as "type here", distinct from cards. |
| Actions | **pill** (999 px) | Primary and secondary buttons, filter chips, size chips | Matches the mockup's cobalt pill. Round means "press me". |
| Points | **circle** | Icon buttons, colour swatches, hotspots, cart badge | |

Shadows: none on cards (sand on stone already separates them). Only floating layers get a shadow (drawer, palette, toast, mega-menu), and product shadows are drawn as real floor shadows.

---

## 3. Layout (ASCII wireframes)

Legend: `[ ]` button, `( )` icon button, `▒` image, `···` text.

### 3.1 Global nav

```
DESKTOP (h 72)                                                     MOBILE (h 56)
┌───────────────────────────────────────────────────────────────┐  ┌──────────────────────────┐
│ Fineverse   Electronics  Clothing  Wearables     (⌕) (♡) (👤) (🛒³)│  │ (≡)    Fineverse   (⌕)(🛒³)│
└───────────────────────────────────────────────────────────────┘  └──────────────────────────┘
 Over hero: transparent, basalt text. After hero: stone/90 + 1px basalt/10 line.
 Hides on scroll down, shows on scroll up. The hero reserves a 72/56 px band, so copy never sits under it.

MEGA-MENU (hover/focus on a category)                 MOBILE MENU (full screen)
┌───────────────────────────────────────────────────┐  ┌──────────────────────────┐
│ Earbuds        Headphones       ┌──────────────┐  │  │ (×)                      │
│ Speakers       Power banks      │ ▒ featured   │  │  │ Electronics            › │
│ View all Electronics            │  Pulse Earbuds│  │  │ Clothing               › │
│                                 │  ₹4,999       │  │  │ Wearables              › │
└─────────────────────────────────┴──────────────┘  │  │ ───────────────────────  │
                                                       │ The Everyday Kit         │
                                                       │ Track order · Account    │
                                                       │ Help · Contact           │
                                                       └──────────────────────────┘
```
(Icons above are placeholders in this doc only. The build uses one SVG icon set, Lucide, at 1.5 px stroke.)

### 3.2 Home

```
DESKTOP 1440                                              MOBILE 390
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ nav band                                     │          │ nav band           │
│ FINEVERSE (wordmark, products ↑ and ↓)       │ HERO     │ FINE               │
│   ⌚     👕      🔋     (earbuds/sunglasses  │ pinned   │  ⌚  🎧            │
│                        behind letters)       │ 300vh    │ VERSE              │
│ Tech, clothing and        [Shop the Everyday │          │  👕  🕶  🔋         │
│ wearables that work        Kit — ₹24,999 →]  │          │ Tech, clothing …   │
└──────────────────────────────────────────────┘          │ [Shop the Kit ₹…]  │
 landed state: 5 products in a row on the floor,          └────────────────────┘
 name + price on hover; wordmark is now the nav logo       pin 200vh; landed = 2 cols

┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ ELECTRONICS          ▒ (cut-out appears      │ CATEGORY │ ▒▒ night band ▒▒▒▒ │
│ CLOTHING               in front on hover,    │ INDEX    │ ELECTRONICS        │
│ WEARABLES              bg light shifts)      │          │ ▒▒ morning band ▒▒ │
└──────────────────────────────────────────────┘          │ CLOTHING           │
                                                           │ ▒▒ golden band ▒▒▒ │
                                                           │ WEARABLES          │
                                                           └────────────────────┘
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ night terrace, cone of light                 │ ELEC-    │ Hear less noise.   │
│ Hear less noise.        🎧 → exploded parts  │ TRONICS  │   🎧 exploded      │
│ ···  [Shop electronics]   ─── Drivers 40 mm  │ pin 200vh│   labels below     │
│                           ─── Cushions …     │          │ [Shop electronics] │
└──────────────────────────────────────────────┘          └────────────────────┘
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│  ▒▒▒ watch, cropped ▒▒▒ │ Built for          │ WATCH    │ ▒▒ watch crop ▒▒▒▒ │
│  ▒ ── Sapphire glass    │ every day.         │ pin 200vh│  ─ Sapphire glass  │
│  ▒ ── Crown: …          │ Tide Watch ₹12,499 │          │  ─ Crown           │
│  ▒ ── Strap: …          │ [View Tide Watch]  │          │  ─ Strap           │
└──────────────────────────────────────────────┘          │ Built for every day│
                                                           └────────────────────┘
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ Bestsellers                       View all   │ BEST-    │ Bestsellers        │
│ ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐ → (h-scroll pin)│ SELLERS  │ ┌────┐┌─           │
│ │▒▒│  │▒▒│  │▒▒│  │▒▒│  │▒▒│                 │          │ │ ▒▒ ││  swipe,   │
│ █plinth█ …                                   │          │ █████│█  snap     │
│ Pulse Earbuds ₹4,999 [Add to cart]           │          │ Name ₹ [Add]       │
└──────────────────────────────────────────────┘          └────────────────────┘
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ ▒▒▒▒▒ fabric macro, full bleed ▒▒▒▒▒▒▒▒▒▒▒▒ │ CLOTHING │ ▒ fabric macro ▒▒▒ │
│ Field Overshirt unfolds across screen        │ pin 200vh│ shirt unfolds      │
│ Made of 380 gsm brushed cotton.              │          │ headline below     │
│ [Shop clothing]                              │          │ [Shop clothing]    │
└──────────────────────────────────────────────┘          └────────────────────┘
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ Lookbook                                     │ LOOKBOOK │ ▒▒▒▒ large ▒▒▒▒▒▒▒ │
│ ┌────┐▒▒▒▒▒▒▒ large image ▒▒▒▒▒▒▒▒           │          │ ▒ (+)    (+)  ▒▒▒▒ │
│ │ ▒  │▒▒▒ (+) ▒▒▒▒▒▒▒▒▒ (+) ▒▒▒▒▒┌────┐      │          │ ┌───┐       ┌───┐  │
│ └────┘▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ▒  │      │          │ │ ▒ │       │ ▒ │  │
│                                 └────┘      │          │ └───┘       └───┘  │
└──────────────────────────────────────────────┘          └────────────────────┘
┌──────────────────────────────────────────────┐          ┌────────────────────┐
│ "The case closes with a click you can feel,  │ REVIEWS  │ "The case closes   │
│  and the battery lasted a Delhi–Goa trip."   │          │  with a click …"   │
│ ★★★★★  Aarav S. · Pulse Earbuds    (‹) (›)   │          │ ★★★★★ Aarav S.     │
└──────────────────────────────────────────────┘          │ ● ○ ○ ○  swipe     │
┌──────────────────────────────────────────────┐          └────────────────────┘
│ Get new drops by email [_______] [Subscribe] │ FOOTER   ┌────────────────────┐
│ Shop · Help · Company · Follow (link groups) │          │ newsletter         │
│ ▒▒▒ sunset terrace ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │          │ accordion links    │
│  F I N E V E R S E  (carved in floor, persp.)│          │ ▒ sunset, FINE-    │
│ © 2026 Fineverse · Privacy · Terms           │          │   VERSE in floor   │
└──────────────────────────────────────────────┘          └────────────────────┘
```

### 3.3 Shop / collection (`/shop`, `/shop/[collection]`)

```
DESKTOP                                                  MOBILE
┌──────────────────────────────────────────────┐         ┌────────────────────┐
│ Electronics                    18 products   │         │ Electronics        │
│ (All)(Earbuds)(Headphones)(Speakers)(Power)  │ chips   │ (All)(Earbuds)(Hea→│ h-scroll
│ ┌──────────┐ ┌──────────────────────────────┐│         │ [Filter·2] [Sort ▾]│ sticky
│ │Filters   │ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐  ││         │ ┌──────┐┌──────┐   │
│ │Price     │ │ │ ▒▒ │ │ ▒▒ │ │ ▒▒ │ │ ▒▒ │  ││         │ │ ▒▒ ♡ ││ ▒▒ ♡ │   │
│ │Colour ●●●│ │ │ ♡  │ │    │ │    │ │    │  ││         │ │Name  ││Name  │   │
│ │Size      │ │ │Name│ │    │ │    │ │    │  ││         │ │₹4,999││₹2,999│   │
│ │In stock ☐│ │ │₹   │ │    │ │    │ │    │  ││         │ └──────┘└──────┘   │
│ │Sort ▾    │ │ └────┘ └────┘ └────┘ └────┘  ││         └────────────────────┘
│ └──────────┘ └──────────────────────────────┘│   Filter opens a bottom sheet;
└──────────────────────────────────────────────┘   all state in the URL (?cat=&color=&sort=)
 Card hover: 2nd image crossfades; quick-add bar slides up inside the card: size/colour chips + [Add to cart]
```

### 3.4 Product page (`/p/[slug]`)

```
DESKTOP                                                  MOBILE
┌──────────────────────────────────────────────┐         ┌────────────────────┐
│ Wearables / Smartwatches                     │         │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ swipe gallery
│ ┌───────────────────────┐ ┌────────────────┐ │         │ ▒▒▒▒▒ 4:5 ▒▒▒▒▒▒▒▒ │
│ │ ▒▒▒▒ image 1 ▒▒▒▒▒▒▒▒ │ │ Tide Watch   ♡ │ │         │ ━━━━────────────── │ progress
│ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ │ ★4.6 (212)     │ │ sticky  │ Tide Watch       ♡ │
│ ├───────────────────────┤ │ ₹12,499        │ │ buy box │ ₹12,499  ★4.6      │
│ │ ▒▒▒▒ image 2 ▒▒▒▒▒▒▒▒ │ │ Colour ● ○ ○   │ │         │ Colour ● ○ ○       │
│ ├───────────────────────┤ │ Size (S)(M)(L) │ │         │ [Add to cart]      │
│ │ ▒▒▒▒ image 3 …        │ │ Size guide     │ │         │ Pincode [____][Check]
│ └───────────────────────┘ │ [Add to cart]  │ │         │ Delivery by Tue 4 Nov
│                           │ Pincode [__][✓]│ │         │ COD · 7-day returns│
│                           │ Delivery Tue 4 │ │         │ ▸ Details  ▸ Specs │
│                           │ COD available  │ │         │ Complete the kit → │
│                           │ 7-day returns  │ │         │ Reviews            │
│                           │ ▸ Details      │ │         │ Related            │
│                           │ ▸ Specs  ▸ Care│ │         ├────────────────────┤
│                           └────────────────┘ │         │ Tide Watch ₹12,499 │ sticky bar
│ Complete the kit:  ┌──┐┌──┐┌──┐┌──┐          │         │ [Add to cart]      │ (after main
│ Reviews: 4.6 ▇▇▇▇▇ breakdown │ filter │ list │         └────────────────────┘  button scrolls away)
│ Related · Recently viewed                    │
└──────────────────────────────────────────────┘
```

### 3.5 Cart drawer and checkout

```
CART DRAWER (right, 440 px; full width on mobile)  CHECKOUT /checkout
┌──────────────────────────┐                      DESKTOP                                MOBILE
│ Cart (3)             (×) │                      ┌────────────────────────┬──────────┐  ┌──────────────┐
│ ₹1,001 away from free    │                      │ 1 Contact   phone/email│ Summary  │  │ ▸ Summary ₹… │ collapsible
│ delivery ━━━━━━━━──────  │                      │ 2 Address   (form)     │ ▒ Tide … │  │ 1 Contact    │
│ ▒ Tide Watch      ₹12,499│                      │ 3 Delivery  ○ Standard │ ▒ Pulse …│  │ 2 Address    │
│   Black · 44 mm  (−)1(+) │                      │             ○ Express  │ Coupon   │  │ 3 Delivery   │
│   Remove                 │                      │ 4 Payment   ┌────────┐ │ Subtotal │  │ 4 Payment    │
│ ▒ Pulse Earbuds   ₹4,999 │                      │  (placeholder: Razorpay│ Delivery │  │ [Place order]│
│ "Removed. [Undo]"        │                      │   / Stripe, clearly    │ COD fee  │  └──────────────┘
│ ──────────────────────── │                      │   labelled)  └────────┘│ Total    │
│ Subtotal         ₹17,498 │                      │ [Place order · ₹17,498]│          │
│ [Checkout]               │                      └────────────────────────┴──────────┘
│ COD · 7-day returns      │                      Confirmation: check-mark draws in, order no.,
└──────────────────────────┘                      delivery date, summary, [Track order]
```

### 3.6 Everyday Kit builder (`/kit`)

```
DESKTOP                                                  MOBILE
┌──────────────────────────────────────────────┐         ┌────────────────────┐
│ The Everyday Kit                             │         │ The Everyday Kit   │
│ ▒ terrace floor, landed-hero arrangement ▒▒▒ │         │ ▒ ⌚ 🎧 ▒          │
│  ⌚     🎧     🕶     👕     🔋              │         │ ▒ 🕶 👕 🔋 ▒       │
│ ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐     │         │ ┌────────────────┐ │
│ │Tide  ││Pulse ││Arc   ││Field ││Cell  │     │         │ │ Tide Watch     │ │ stacked rows
│ │●○ 44 ││●○    ││●○    ││S M L ││●○    │     │         │ │ ●○  44mm  Swap │ │
│ │Swap ▾││Swap ▾││Swap ▾││Swap ▾││Swap ▾│     │         │ └────────────────┘ │
│ └──────┘└──────┘└──────┘└──────┘└──────┘     │         │ …                  │
│ Separately ₹29,445 · Kit ₹24,999 · You save  │         ├────────────────────┤
│ ₹4,446                  [Add kit to cart]    │ sticky  │ ₹24,999 save ₹4,446│ sticky
└──────────────────────────────────────────────┘         │ [Add kit to cart]  │
                                                          └────────────────────┘
```

### 3.7 Search

```
PALETTE (/, Ctrl+K, nav icon)                          RESULTS PAGE /search?q=
┌────────────────────────────────────────┐             Same as the shop grid, with heading
│ ⌕ Search products              Esc     │             "12 results for 'watch'" and the shop filters.
│ Recent: watch · overshirt   Clear      │             Empty: "No results for 'xyz'.
│ ─────────────────────────────────────  │             Try Electronics, Clothing or Wearables" + 3 tiles
│ ▒ Tide Watch      Wearables   ₹12,499 ◂│ (↑↓ Enter)
│ ▒ Tide Strap      Wearables    ₹1,499  │
│ See all 4 results for "tide"           │             MOBILE: palette is full screen,
└────────────────────────────────────────┘             input pinned top, results scroll
```

### 3.8 Wishlist, account, tracking

```
/wishlist                         /login                       /account (tabs)
┌─────────────────────────┐       ┌─────────────────────┐      ┌──────────────────────────────┐
│ Wishlist (4)            │       │ Log in or sign up   │      │ Orders | Addresses | Wishlist│
│ grid of cards; each:    │       │ +91 [__________]    │      │ FV-10482  2 items  ₹17,498   │
│ [Move to cart] Remove   │       │ [Send code]         │      │ Shipped · arrives Tue 4 Nov ›│
│ Empty: lone product on  │       │ → 6 boxes OTP       │      └──────────────────────────────┘
│ stone + [Browse shop]   │       │ Resend in 0:28      │
└─────────────────────────┘       └─────────────────────┘
/account/orders/[id]  and  /track (order ID + phone, no login)
┌───────────────────────────────────────────────────────────────┐
│ Order FV-10482 · placed 31 Oct                                │
│ ●━━━━━━●━━━━━━●━━━━━━○──────○                                  │   MOBILE: the timeline
│ Ordered Packed Shipped Out for   Delivered                    │   goes vertical
│                         delivery                              │
│ Items · Address · Payment summary · [Need help?]              │
└───────────────────────────────────────────────────────────────┘
```

### 3.9 Content pages and 404

```
CONTENT TEMPLATE (Shipping, Returns, Privacy, Terms)    ABOUT                      404
┌───────────────────────────────────┐                    ┌──────────────────┐       ┌──────────────────────┐
│ Returns                           │                    │ ▒ terrace, full  │       │ ▒ empty terrace ▒▒▒▒ │
│ ┌──────────┐ ┌──────────────────┐ │ 65-ch measure,     │   bleed ▒▒▒▒▒▒▒▒ │       │        🕶 (alone,    │
│ │ On this  │ │ body text …      │ │ sticky TOC on      │ Story in 3 short │       │        shadow)       │
│ │ page     │ │                  │ │ desktop, top       │ chapters with    │       │ This page isn't in   │
│ └──────────┘ └──────────────────┘ │ accordion on mobile│ images between   │       │ its place.           │
└───────────────────────────────────┘                    └──────────────────┘       │ [Back to home]       │
FAQ: search field + accordion grouped by topic.  CONTACT: form + WhatsApp link + hours. └──────────────────────┘
```

---

## 4. Motion map

Every row has to earn its place. Anything not listed here doesn't move. Easing names: `out` = `cubic-bezier(.2,.7,.2,1)` (GSAP `power3.out`), `inOut` = `power2.inOut`, `settle` = small overshoot `back.out(1.4)`, `none` = linear (scrubbed).

### 4.1 Signature (scroll-driven)

| # | Animation | Trigger | Duration | Easing | Why it exists |
|---|---|---|---|---|---|
| 1 | Intro: "F" mark draws, then scales into the hero's logo position | Load, first visit only (sessionStorage), skip on click, key or scroll | ≤1.2 s | out | Brand moment that *becomes* the hero's first frame. No cut, no spinner. |
| 2 | Hero idle bob: each product ±4–6 px y, ±1° | Load, loops until scroll starts | 4–6 s per item, out of phase | sine.inOut | Tells you the objects are floating, not printed. Stops at progress > 0, so there's no fight with scrub. |
| 3 | Hero beat 1: bg scale 1 → 1.08; products drift apart with per-item parallax and rotation; shadows widen and fade with height | Scroll 0–0.35 of a 300vh pin | scrub 0.8 | none | Gives depth: things nearer the camera move more. Reverses exactly on scroll up. |
| 4 | Hero beat 2: products descend and land in a row; 6 px settle; shadows sharpen | Scroll 0.35–0.7 | scrub | power2.in to contact, then settle | The concept: everything goes to its place. Clears the wordmark so it reads in full. |
| 5 | Hero beat 3: wordmark scales and translates to the nav logo rect (measured, not hard-coded); headline and CTA appear | Scroll 0.7–1.0 | scrub | inOut | Hands the brand to the nav. Reveals the buy action once the show is done. |
| 6 | Hero light sweep: warm gradient overlay travels across the scene | Scroll 0–1 | scrub | none | Makes the still plate feel like time passing. Skipped if a video-frame plate exists (the frames carry the light). |
| 7 | Hero bg frames (if `/frames/hero-bg/` exists) | Scroll 0–1 | scrub | none | Real camera push and light change; the layers stay sharp on top. |
| 8 | Category index: cut-out scales 0.92 → 1 and fades in in front of the name; bg light crossfades to that world | Hover or focus (desktop); entering the viewport centre (mobile) | 450 ms | out | Previews the world before you click. Light is the only transition between worlds. |
| 9 | Electronics: night light comes up, single cone; headphones separate into parts; leader lines draw (stroke-dashoffset) | Scroll, 200vh pin | scrub | none | Shows what's inside, labelled. Engineering is the reason to buy. |
| 10 | Electronics: cursor-following light | Pointer move (desktop, fine pointer only) | lerped 0.12/frame | none | You "hold the torch". Off on touch and reduced motion. Moves a radial-gradient position via `transform`, never repaints `background`. |
| 11 | Watch: rotates (frames, or crossfade of 3 stills); 3 spec lines draw in sequence | Scroll, 200vh pin | scrub | none | Links each claim to the physical part. |
| 12 | Bestsellers: horizontal travel along the plinths | Scroll, pinned (desktop); native swipe with snap (mobile) | scrub | none | Walking past exhibits. Mobile uses native scrolling because it's faster and accessible. |
| 13 | Clothing: overshirt unfolds (frames or stills sequence); fabric macro slow scale 1.1 → 1 | Scroll, 200vh pin | scrub | none | Shows the garment's size and the fabric up close. |
| 14 | Lookbook: two small images move at 0.85× and 1.15× scroll speed against the large one | Scroll (not pinned) | scrub | none | Magazine depth, cheap (transform only). Off on mobile under 400 px and on reduced motion. |
| 15 | World headlines (3 only: Electronics, Watch, Clothing): SplitText line mask reveal | Enters viewport, once | 700 ms, 60 ms stagger | out | Marks the 3 big moments. **No other headline animates.** |

### 4.2 Commerce (user-action-driven)

| # | Animation | Trigger | Duration | Easing | Why it exists |
|---|---|---|---|---|---|
| 16 | Nav hide/show; bg fades in after hero | Scroll direction / hero end | 250 ms | out | More screen for content, nav one flick away. |
| 17 | Mega-menu open | Hover with 120 ms intent delay, or focus | 220 ms (opacity + 8 px y) | out | Stops flicker when the mouse passes over. |
| 18 | Mobile menu | Tap ≡ | 350 ms clip-path from top; links 30 ms stagger | out | Full-screen menu needs a clear entrance; stagger is short so it's never in the way. |
| 19 | Page transition | Route change | ≤400 ms (opacity 1 → 0.6 → 1 on main, plus 2 px progress line) | out | Signals navigation without blocking clicks. |
| 20 | Shop grid reflow | Filter or sort change | 350 ms Motion `layout` | out | Shows *which* items left and stayed. |
| 21 | Card hover: second image crossfade; quick-add bar slides up | Hover (fine pointer); quick-add via a button on touch | 250 ms | out | Second angle helps comparing; quick-add saves a page load. |
| 22 | Variant switch: image, price and stock crossfade | Select colour or size | 200 ms | out | Confirms the choice changed the product. |
| 23 | Add to cart: thumbnail FLIP flies to the cart icon; badge ticks (y-roll); drawer opens | Click "Add to cart" | 450 + 100 + 150 = **≤700 ms** total | out / settle on badge | Proves where the item went. Single, fast, interruptible. |
| 24 | Cart drawer | Open / close | 320 ms in, 240 ms out (x translate + scrim opacity) | out | Spatial: the cart lives on the right. |
| 25 | Remove line, then undo | Click remove | 200 ms height-collapse via Motion `layout` (transform-based) | out | You see what disappeared, with 5 s to undo. |
| 26 | Free-shipping bar | Subtotal changes | 400 ms `scaleX` | out | Shows the progress the action just made. |
| 27 | Mobile sticky ATC bar | Main button leaves viewport | 200 ms y | out | Keeps buying one tap away. |
| 28 | Mobile gallery progress | Swipe | follows the finger (scroll-linked) | none | Shows position without dots. |
| 29 | Accordion | Toggle | 240 ms | out | Shows the content's extent. |
| 30 | Modals (size guide, notify me, review form) | Open / close | 220 ms opacity + scale 0.98 → 1 | out | Standard, short. |
| 31 | Search palette | `/`, Ctrl+K, icon | 180 ms | out | Has to feel instant. |
| 32 | Toast | Cart, wishlist or form action | 250 ms in, stays 3 s (paused on hover/focus), 200 ms out | out | Confirmation using the button's own verb. |
| 33 | Wishlist heart | Toggle | 300 ms fill plus scale 1 → 1.15 → 1 | settle | Small reward, very local. |
| 34 | Kit total and saving | Variant or swap change | number roll 300 ms | out | Shows the price changing as a result of your choice. |
| 35 | Order confirmation: check-mark stroke draws, summary fades in | Page load | 600 ms | out | Calm closure, no confetti. |
| 36 | Tracking timeline: filled segment grows to current step | Page load | 600 ms `scaleX` (`scaleY` on mobile) | out | Makes "where is it" readable at a glance. |
| 37 | OTP boxes: shake on wrong code | Submit | 300 ms x ±4 px | none | Error in the place you're looking, with text too. |
| 38 | Product image hover ripple (WebGL, lazy) | Hover on PDP and card images, fine pointer, desktop | 600 ms decay | out | Optional tactile touch. CSS fallback is a 1.03 scale. Loaded only after idle. |

**Not animated, on purpose:** section entrances between big moments (no fade-and-slide-up), reviews (instant swap with a 150 ms crossfade, never auto-advance), footer, content pages, skeletons (static sand blocks, no shimmer).

**Custom cursor: not used.** It would fight the commerce UI and help no task. The Electronics cursor light (#10) is a light in the scene, not a cursor replacement.

### 4.3 Reduced motion

`prefers-reduced-motion: reduce` gives: no Lenis, no pins. The hero renders the **landed state** as a still composition (products on the floor, wordmark readable, CTA visible). Worlds show their final frame with labels already drawn. Lookbook is static. Commerce transitions become instant or 120 ms opacity. The FLIP is replaced by the badge count updating plus the drawer opening.

---

## 5. Self-review against the "generic defaults" list

| Default (§7) | Found in plan or mockup? | What I did |
|---|---|---|
| Cream + serif + terracotta | Risk: stone ground is warm cream | Paired with a **grotesk only** and a **cobalt** accent, no serif anywhere, no terracotta. The warm-orange tones exist only as *light* in the golden and sunset worlds, never as UI colour. |
| Near-black + neon accent | Electronics world is dark | Accent stays cobalt (not neon), used only for interactive things. No glow effects. The reference project's black and acid green is not used anywhere. |
| Purple/blue gradients, glassmorphism | Nav after hero could drift into blur-glass | Nav gets a solid `stone/92` with a hairline, **no backdrop blur** (also cheaper on Android). The only gradients are lighting inside photographic scenes. |
| Identical rounded cards, same soft shadow, one radius | Mockup bestseller cards all look alike | Radius varies across 5 levels (§2.5). Cards have **no shadow**. Bestsellers are plinths, not cards. Shop cards differ from home exhibits. |
| ALL-CAPS tracked eyebrows | None in mockup | None. Sections are named by their headline. The only small labels are functional (breadcrumbs, "In stock"). |
| "01 / 02 / 03" numbering | Checkout is a real sequence | Numbers **only** on checkout steps and the tracking timeline, which are sequences. Nowhere else. |
| "→" on every link | Mockup puts → on 4 buttons and links | Arrow kept **only** on the hero's primary CTA (matches the locked hero). "View all", "See more", "Explore Electronics" lose the arrow. Chevrons only where something opens (accordion, select). |
| Italic or coloured word in headline | None | None. Headlines are one weight, one colour. |
| Fade-and-slide-up on every section | Reference project does this everywhere | Banned outside the 3 world headlines (#15). Between big moments, content is simply there. |
| Emoji as icons | Reference project uses ✦ etc. | Lucide icon set, 1.5 px stroke, plus custom SVG for the "F" mark and spec glyphs. (The emoji in §3's wireframes are sketch shorthand only.) |
| Marketing filler copy | Mockup has "A seamless balance of technology, design and comfort", "Designed for a calmer, more focused you", "Immersive sound" | Rewritten as facts, e.g. **Watch:** "14-day battery. Water resistant to 50 m. Sapphire glass over a 1.4" AMOLED display. ₹12,499." **Electronics:** "Hear less noise. Active noise cancelling to 42 dB, 30 hours of playback, USB-C fast charge: 10 minutes gives 3 hours." Buttons say the action ("Add to cart", "Choose size", "Add kit to cart") and toasts repeat the verb ("Added to cart", "Added kit to cart", "Saved to wishlist"). |
| Fake stats and press logos | None in mockup | None. Reviews are clearly mock data in dev (marked in `data/`), and ratings come from the review data, not a slogan. |

**One thing removed after review:** I had planned a scroll-progress "chapter indicator" down the right edge of the home page. It was pure decoration (sections aren't a numbered sequence), so it's gone.

---

## 6. Engineering notes (for transparency; not up for design approval)

**Versions** (checked with `npm view` today): next 16.4.3, react 19.3.1, gsap 3.15.0 (SplitText included free), lenis 1.3.27, motion 14.9.0, zustand 5.0.16, tailwindcss 4.3.3 (CSS-first `@theme` tokens), @playwright/test 1.64.1. TypeScript: npm `latest` is 7.0.2; I'll use whatever version Next 16 officially supports, and report it if that isn't 7.

**`<ScrollFrames>`: improvements over `reference-project/components/hero-scroll-canvas.tsx`**

| Reference project does | Fineverse does |
|---|---|
| Its own `requestAnimationFrame` loop that runs forever, redrawing **every frame even when nothing changed**, alongside the GSAP ticker (two loops) | No own loop. Draws from the ScrollTrigger `onUpdate` / GSAP ticker, **only when the frame index changes** |
| `HTMLImageElement` drawn directly (decode on the main thread, at draw time) | `fetch` → `createImageBitmap` off the main thread; bitmaps closed on unmount |
| Loads frames 0 → N in order | Frame 1 as poster → every 8th → every 4th → every 2nd → the rest. Scrubbing is coherent early and sharpens as it loads; draws the nearest loaded frame in either direction |
| Never pauses | IntersectionObserver: no drawing and no loading off-screen |
| Hard-coded count and path, one aspect | Props: `basePath`, `count`, `desktop`/`mobile` sets chosen by viewport aspect ratio (re-evaluated on resize), `poster`, `fallback` still |
| Resize not debounced; canvas resized on every resize event | `ResizeObserver`, rAF-coalesced, DPR capped at 2 |
| `window` CustomEvent every scroll tick | Progress passed through a ref, no events |
| No reduced-motion path | Renders the chosen still (`reducedMotionFrame`) |

**Lenis + GSAP:** the reference adds an anonymous function to `gsap.ticker` but removes `lenis.raf`, so **the ticker callback leaks** on unmount. Fineverse keeps a named callback, sets `autoRaf: false` (one loop), calls `ScrollTrigger.refresh()` after `document.fonts.ready` and hero image decode, and on route change kills all triggers via `gsap.context().revert()` and scrolls to top *before* new pins are created.

**Data layer** *(updated for the UI-only scope)*: mock data in `data/`, read only through small functions in `lib/commerce/catalog.ts` (`getProducts`, `getProduct`, `getCollections`, `getKit`…). Prices are whole rupees, formatted only through `formatPrice()` (`Intl.NumberFormat('en-IN')` → ₹12,499). The cart is a Zustand store of variant ids and quantities in localStorage; prices are always looked up from the catalogue. No adapter or server layer: a real store backend can replace `catalog.ts` later.

**QA:** Playwright script captures 390 and 1440 at hero progress 0 / 0.3 / 0.6 / 1.0 each phase, by setting scroll position against the pin's start and end, not by sleeping.

---

## 7. Next step

Reply with **approve** (plus your answers to D1–D3, or "use your recommendations"). I'll then:
1. Organise the 8 images (`reference/`, `public/hero/`), write `ASSETS_TODO.md`.
2. Start Phase 1: project setup, tokens, type, layout shell, nav, footer, commerce layer.
