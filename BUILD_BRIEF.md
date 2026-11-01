# Build brief (final): Fineverse, a scroll-cinematic e-commerce store

You are the design lead and senior front-end engineer on this project. The client is paying for a storefront that feels like a flagship brand site (think the restraint of Aesop, the product theatre of Apple's product pages, the craft of Nothing or Teenage Engineering), and it must also work as a real shop: browse, choose a variant, add to cart, reach checkout. Visual ambition and commerce usability have equal weight. A beautiful site that is slow, janky on mobile, or confusing to buy from is a failure.

Do not start coding until you have finished Phase 0 and I have approved the plan.

---

## 1. Project facts

- Brand: **Fineverse**, a new e-commerce store launching in India.
- What we sell: **Electronics** (earbuds, headphones, speakers, power banks), **Clothing** (everyday premium basics and outerwear), **Wearables** (smartwatches, fitness bands, sunglasses).
- Hero product: **The Everyday Kit**: watch, earbuds, sunglasses, overshirt and power bank, sold as a bundle.
- Price range: ₹999 to ₹24,999. INR with Indian number formatting (₹12,499).
- Audience: 18–35, urban India, buying mostly on phones, cares about design and quality, compares before buying. Trust signals (delivery date, COD, easy returns) matter.
- Three words: **bold, precise, premium**
- Must NOT feel like: a discount marketplace, a gamer/RGB store, a loud sale site, or a generic template.

### Visual theme: "Everything, in its place" (locked: matches `/reference/home-hero.png`)

The approved hero mockup is in `/reference/home-hero.png`. Match its look closely: a sunlit outdoor stone terrace with rocks, a concrete wall, sea and hills; a giant heavy black "Fineverse" wordmark across the full width; the products (round matte black smartwatch, off-white earbuds case, black sunglasses, folded warm-grey overshirt, graphite power bank) floating at different depths, some in front of the letters and some behind; soft shadows on the stone floor; small nav; one cobalt button.

- **Mood**: sunlit, architectural, Mediterranean calm, real materials (stone, concrete, fabric, matte metal), cinematic product photography.
- **Palette** (finalise in Phase 0): sky-washed pale stone, warm sand, deep black for the wordmark and text, white, and one cobalt blue used only for interactive elements (buttons, cart badge, focus, selected variant).
- **Type**: one grotesk family; a very heavy condensed-ish weight for the giant wordmark (match the mockup), regular weight for body.
- **Three worlds** for the categories, each a different light on the same architecture: Electronics at night on the terrace (dark, rim-lit, cursor-following light on desktop); Clothing in soft morning light with full-screen fabric close-ups; Wearables in golden late-afternoon light with the watch at monumental scale. Transitions between them are scroll-driven light changes, not cuts.
- **Mobile first**: design and test the mobile hero first.
- Shop grid, product page, cart and checkout stay clean, professional and fast, with COD, delivery estimate and returns near the buy button.
- Mock catalogue: 18 products, 6 per category, short professional names (e.g. "Tide Watch", "Pulse Earbuds", "Field Overshirt"), realistic INR prices, variants, stock levels, plain descriptions.
- Assets provided:
  - `/public/hero/background-desktop.webp` (16:9) and `background-mobile.webp` (9:16): the terrace scene with no products and no text
  - `/public/hero/items/watch.png`, `earbuds.png`, `sunglasses.png`, `overshirt.png`, `powerbank.png`: transparent cut-outs matching the mockup's angles and lighting
  - `/public/frames/hero-bg/desktop/` and `/mobile/`: OPTIONAL video frames (WebP, `0001.webp`…) of the empty terrace with a slow camera push and light shifting from late morning to golden hour. If present, the hero background is video-scrubbed from these frames; if absent, the still background is used.
  - `/public/frames/watch-360/`, `/public/frames/shirt-unfold/`, `/public/frames/headphones-explode/`: OPTIONAL video frames for those sections. If present, scrub them; if absent, fall back to the layered-stills version described in each section.
  - `/public/products/` packshots, 4:5, plus `*-2.webp` second angle
  - `/public/lifestyle/` lifestyle images
  - `/reference/home-hero.png` and `/reference/section-*.png`: approved mockups (never ship these)

If any of these are missing, use clearly named placeholders and list them in `ASSETS_TODO.md`. Never pull random stock photos.

## 2. Reference project

I am attaching a previous project of mine (a travel site) in `/reference-project/`. Study how it does the scroll-scrubbed hero (`components/hero-scroll-canvas.tsx`, `components/hero.tsx`), the Lenis + GSAP setup (`lib/`), and the parallax gallery. Reuse the techniques, improve the engineering, and do not reuse its look. Specifically avoid its near-black + acid-green palette, emoji icons, and the nav overlapping hero copy.

---

## 3. Phase 0: design plan (stop and wait for approval)

Write `DESIGN_PLAN.md` containing:

1. **Concept**: the concept is locked ("Everything, in its place", see the mockups in `/reference/`). Restate it in two sentences and explain how each home section expresses it. Study every mockup and list what you will match exactly and where you will improve on it.
2. **Tokens**: 4–6 named hex colours with roles; typefaces with roles (one or two families, chosen for this brand, not Inter/Poppins/Montserrat/Playfair by default); a type scale; spacing scale; radius rules that vary by hierarchy.
3. **Layout**: ASCII wireframes for every page in section 5, at desktop and mobile.
4. **Motion map**: a table of every animation, what triggers it (scroll / user action / load), duration, easing, and why it exists. Every row must justify itself.
5. **Self-review**: run your plan against the "generic defaults" list in section 7. For each default you find, say what you changed and why.

---

## 4. Tech stack

Check current stable versions with npm before installing; do not pin from memory.

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- GSAP with ScrollTrigger (and SplitText for headline reveals) for scroll choreography
- Lenis for smooth scroll, synced to GSAP's ticker (one RAF loop, not two)
- Motion (Framer Motion) for component-level UI transitions: cart drawer, variant switches, layout animations, page transitions
- Zustand for cart state, persisted to localStorage
- A typed commerce layer at `lib/commerce/` with an interface (`getProducts`, `getProduct`, `getCollection`, `createCart`, `addLine`…) backed by local mock data in `data/products.ts`. Write it so swapping in Shopify Storefront API later means writing one adapter file, nothing else.
- Playwright (already familiar from the reference project) for visual QA screenshots
- A reusable `<ScrollFrames>` component for every video-scrubbed sequence: canvas renderer, ScrollTrigger-driven, desktop/mobile frame sets chosen by aspect ratio, progressive loading (frame 1 as poster, then every 8th frame, then gaps), `createImageBitmap`, cover-fit, DPR capped at 2, redraw only on frame change, pauses when off-screen (IntersectionObserver), still-image fallback. Improve on `/reference-project/components/hero-scroll-canvas.tsx`.
- Optional lazy-loaded WebGL ripple on product image hover, with a CSS fallback. No other WebGL.

---

## 5. Pages and features

### Home

1. **Intro (≤1.2 s, first visit only, skippable)**: brand mark resolves, then hands off directly into the hero's first frame so there is no visual cut. Store "seen" in sessionStorage.
2. **Scroll-scrubbed hero** (the signature moment). Built from layers, not video, so the giant wordmark stays razor sharp and products can sit both in front of and behind it. It must scrub exactly like a video: scrolling down plays it forward, scrolling up plays it back, at any speed.
   - Pinned section, ~300vh, one GSAP timeline with ScrollTrigger `scrub: 0.8`.
   - Background: if `/public/frames/hero-bg/` exists, the terrace is a video-scrubbed `<ScrollFrames>` plate (camera push + light shifting toward golden hour) under all other layers, so the whole scene genuinely moves like film while the wordmark and products stay razor sharp on top. Otherwise use the still background with a slow scale push.
   - Layers, back to front: terrace background → product shadows (generated in code as blurred ellipses on the floor) → products placed behind the wordmark (earbuds, sunglasses) → giant "Fineverse" wordmark (live text) → products in front (watch, overshirt, power bank) → nav, copy, button.
   - Start state: matches `/reference/home-hero.png`, with products gently bobbing in idle motion (a few pixels, slow) before scrolling.
   - Beat 1: background slowly pushes in (scale 1 → 1.08) while products drift apart at different speeds and depths (parallax), each rotating slightly; shadows respond to height.
   - Beat 2: products descend and land on the terrace floor one by one in a precise row, each with a small settle; shadows sharpen as they touch down. With products out of the way the full wordmark is revealed and readable.
   - Beat 3: the wordmark scales down and travels into the nav logo position; a headline line and the "Shop the Everyday Kit — ₹24,999" button appear; each landed product shows its name and price on hover/tap.
   - Light: a subtle warm sweep moves across the scene during the scroll (a gradient overlay), so the scene feels alive.
   - Mobile: 9:16 background, wordmark stacked on two lines, products in a 2-column landing arrangement, shorter pin.
   - All poses (start, mid, landed) are data per item so the choreography is easy to tune; dev-only `?debug` overlay shows progress and beat markers.
   - Reduced motion: landed state as a still, no pin.
3. **Category index**: the three category names set huge, stacked, edge to edge ("Electronics / Clothing / Wearables"). Hovering (desktop) or scrolling past (mobile) a name reveals a floating product cut-out in front of the letters with its own shadow, and the background light shifts to that category's world. Click goes to the category. Match `/reference/section-categories.png`.
4. **Electronics world**: the terrace at night. Headphones float in a single cone of light; on scroll they separate into an exploded view (`<ScrollFrames>` from `headphones-explode` if present, else layered cut-outs) with thin leader lines labelling each part. Cursor-following light on desktop. Match `/reference/section-electronics.png`.
5. **Watch story**: the Tide Watch at monumental scale, partly cropped by the viewport, with three specs placed around it and connected to the relevant part by thin leader lines (crown, glass, strap). On scroll the watch rotates (`<ScrollFrames>` from `watch-360` if present, else layered stills crossfade) and each spec draws its line in. Match `/reference/section-watch.png`.
6. **Bestsellers as an exhibition**: each product sits on its own stone plinth on the terrace like a museum piece, with a small placard (name, price, "Add to cart"). Desktop: horizontal pinned scroll along the row of plinths; mobile: swipe with snap. Match `/reference/section-bestsellers.png`.
7. **Clothing world**: full-bleed fabric macro in morning light; the overshirt unfolds across the screen on scroll (`<ScrollFrames>` from `shirt-unfold` if present, else a sequence of stills), headline set over it. Match `/reference/section-clothing.png`.
8. **Lookbook spread**: magazine-style: one huge lifestyle image with two smaller images overlapping its edges at different scroll speeds; small "+" hotspots on the products open a mini card with name, price and "Add to cart". Match `/reference/section-lookbook.png`.
9. **Reviews**: one large review at a time, set big as a typographic statement, with name, product and rating; arrows or swipe to change (never auto-advance).
10. **Footer**: the terrace at sunset, a giant "Fineverse" wordmark carved into the stone floor in perspective, newsletter signup and links above it. Match `/reference/section-footer.png`.

### Shop / collection page
- Filter and sort with URL state; grid reflows with Motion `layout` animation.
- Hover: secondary image, quick-add with size/colour.
- Skeleton states that match the real layout; no spinners.

### Product page
- Image gallery: vertical scroll of large images on desktop with sticky buy box; swipe gallery with progress bar on mobile.
- Variant selector updates image, price, availability with a short crossfade, and updates the URL.
- Sticky add-to-cart bar appears on mobile once the main button scrolls away.
- Add to cart: the product thumbnail flies into the cart icon (FLIP), the icon count ticks, the drawer opens. Total time under 700 ms.
- Details accordion, delivery and returns info, related products.

### Cart and checkout
- Cart drawer: quantity steppers, remove with undo, free-shipping progress bar, subtotal.
- Checkout page: contact, address, delivery method, order summary. Payment step is a clearly marked placeholder ready for Razorpay/Stripe. Form validation messages say exactly what to fix.

### Everyday Kit bundle builder (`/kit`)
- All five kit items shown in the landed hero arrangement; pick colour/size for each item inline; the running total and the saving vs buying separately update live; one "Add kit to cart" adds all lines as a bundle. Items can be swapped for alternatives in the same category.

### Search
- Command-palette style overlay (opens from the nav icon and `/` or `Ctrl+K`): instant results with thumbnails, prices and category, recent searches, keyboard navigation, empty state that suggests categories. Full results page at `/search?q=`.

### Wishlist
- Heart on cards and product pages, persisted locally; `/wishlist` page; move to cart in one tap.

### Account (mock auth, ready for a real provider)
- Login / sign-up with phone OTP flow UI (mock code `123456`), `/account` with orders, addresses, and wishlist tabs; order detail page with a visual tracking timeline (Ordered → Packed → Shipped → Out for delivery → Delivered).
- `/track` page: track an order by order ID + phone without logging in.

### Product page extras
- Pincode check for delivery date and COD availability (mock rules).
- Size guide modal for clothing with a measurement diagram.
- Reviews with rating breakdown, filter by rating, photo reviews, "Write a review" form (mock submit).
- "Notify me" for out-of-stock variants; low-stock message only when stock data actually says so.
- "Complete the kit": the other Everyday Kit items as quick-adds.
- Recently viewed products (local).

### Cart and checkout extras
- Coupon field with clear valid/invalid messages (mock code `FINE10`), gift note, COD fee shown when selected, order confirmation page with a calm success animation and order summary.

### Content pages
- About (brand story with the terrace imagery), FAQ (searchable accordion), Contact (form + WhatsApp link), Shipping, Returns, Privacy, Terms, and a designed 404 (a lone product on the empty terrace with "This page isn't in its place." and a link home).

### Global
- Page transitions between routes: short, under 500 ms, never blocks interaction.
- Custom cursor only if Phase 0 justifies it, and never on touch devices.
- Mega-menu on desktop for Electronics / Clothing / Wearables showing subcategories and one featured product image; full-screen animated menu on mobile.
- Toast notifications for cart, wishlist and form actions, using the same verbs as the buttons.
- Navigation: transparent over the hero, gains a background after the hero, hides on scroll down and shows on scroll up. It must never overlap hero copy at any viewport size.

---

## 6. Quality bar (non-negotiable)

- 60 fps scroll on a mid-range Android phone. Animate only `transform`, `opacity`, `clip-path`. No animating `width`, `top`, `filter: blur` on large elements.
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. LCP < 2.5 s, CLS < 0.05.
- Total hero image payload: under 2.5 MB desktop, 1.5 MB mobile.
- `prefers-reduced-motion`: every scroll effect has a calm static equivalent; the site must still look designed, not broken.
- Keyboard: visible focus states, drawer traps focus and closes on Escape, all controls reachable.
- Every ScrollTrigger and listener cleaned up on unmount; `ScrollTrigger.refresh()` after images and fonts load; no pin jumps on route change.
- Works at 360 px, 390 px, 768 px, 1024 px, 1440 px, 1920 px.
- Product data, prices and stock come only from `lib/commerce`; no hard-coded prices in components.
- Structured data (Product, Offer) on product pages; proper metadata and OG images.

---

## 7. Anti-generic rules

These are the things that make a site read as AI-made. Do not use them unless Phase 0 gives a specific reason.

- Default palettes: cream + serif + terracotta; near-black + one neon accent; purple/blue gradients; glassmorphism on everything.
- Identical rounded cards with the same soft shadow everywhere; one border-radius for every element.
- ALL-CAPS tracked-out eyebrow labels above every heading; "01 / 02 / 03" numbering on things that are not a sequence; a "→" glued to every link.
- Highlighting one word of a headline in italic or a different colour.
- Fade-and-slide-up on every section. Motion should be concentrated in the hero, the three worlds, the product story and responses to user actions; between those big moments, let the page breathe.
- Emoji as icons. Use one consistent icon set or custom SVG.
- Copy like "Elevate your everyday", "Crafted for the modern you", "Experience the difference", "Unleash". Write plain, specific copy about the actual product: what it's made of, how it's used, what it costs, when it arrives. Buttons say what happens ("Add to cart", "Choose size"), and the confirmation uses the same words ("Added to cart").
- Fake stats ("10k+ happy customers") and fake press logos.

---

## 8. Process

Work in phases. After each phase: run the dev server, take Playwright screenshots at 390 px and 1440 px (including mid-scroll screenshots of the hero at progress 0, 0.3, 0.6, 1.0), look at them, write a short critique in `PROGRESS.md` (what looks off, what you fixed), then continue.

1. Phase 0: design plan → wait for my approval
2. Phase 1: project setup, tokens, typography, layout shell, nav, footer, commerce data layer
3. Phase 2: `<ScrollFrames>` component + scroll-scrubbed hero (get this perfect before moving on, including mobile and reduced-motion)
4. Phase 3: rest of the home page
5. Phase 4: shop page, product page (with all extras), cart drawer, add-to-cart animation
6. Phase 5: Everyday Kit builder, search, wishlist
7. Phase 6: checkout, confirmation, account, order tracking
8. Phase 7: content pages and 404
9. Phase 8: performance pass, accessibility pass, Lighthouse report, cross-viewport screenshots, final `README.md` explaining how to swap hero layers, add or replace video frame sequences, retune the scroll choreography, and connect a real store (Shopify adapter + Razorpay)

Before finishing each phase, look at the screen the way the client would and remove one thing that isn't earning its place.

---

## Approved Phase 0 decisions (added after approval)

1. Everything committed to git first; the travel site moved into `reference-project/`; Fineverse built at the repo root.
2. Temporary cut-outs made with a local background-removal tool. The earbuds and overshirt are listed in `ASSETS_TODO.md` as needing clean replacements.
3. Layouts follow this brief, not the full-page mockup: huge stacked category names, products on stone plinths, one large review at a time, carved wordmark footer, and the other section designs exactly as described above. The full-page mockup (`reference/home-full.png`) is used only for colours, lighting, photography style and typography.
4. Missing assets (mobile background, headphones, video frames, section mockups) use clean placeholders, are listed in `ASSETS_TODO.md`, and work continues.
5. Scope (added during Phase 1): **front-end UI only, no backend.** Products, cart, checkout, account and order tracking work on local mock data (`data/`, read through `lib/commerce/`). No server, database, real authentication or payment integration.
