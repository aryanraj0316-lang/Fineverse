# Progress

Screenshots for each phase are in `qa/screenshots/phase-<n>/` (not committed).
Regenerate them with `npm run dev`, then `npm run qa -- --phase=<n> --base=http://localhost:3000`.

---

## Phase 1: setup, tokens, type, shell, nav, footer, data (2026-10-31)

**Scope note:** you asked for UI only, no backend. The product data is plain mock
data in `data/`, read through a few small functions in `lib/commerce/`. The cart
is a local store. There is no server, database, real login or payment.

### Built
- Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript 5.9 strict,
  Tailwind 4.3, GSAP 3.15 + Lenis 1.3 on one animation loop, Motion 14, Zustand 5.
- Tokens: six colours, a type scale and radius levels in `app/globals.css`.
  Off-palette colours and sizes are switched off, so they can't creep in.
- Archivo as one self-hosted 61 KB variable file, including the ₹ glyph
  (`app/fonts/`, rebuild with `scripts/build-font.py`).
- Nav: transparent over the hero, solid after it, hides on scroll down and
  returns on scroll up. Desktop mega-menu with hover intent and keyboard
  access; full-screen mobile menu built on `<dialog>`, so focus trapping
  and Escape come from the browser. Cart badge reads the cart store.
- Footer: the terrace at sunset, newsletter with plain validation messages,
  links, and "Fineverse" carved into the floor (SVG filter plus perspective).
- Catalogue: 18 products, 40 colourways, variants with stock, the Everyday Kit
  (10% off, rounded down to ₹…99: exactly ₹24,999 for the default picks).
- Home: the hero's start state, layered as specified (terrace → shadows → back
  products → wordmark → front products → copy). It's static for now; Phase 2
  adds the scroll choreography.
- Images: interim cut-outs, 10 packshots from your renders, 70 labelled
  placeholders, sunset stand-in. See `ASSETS_TODO.md`.
- Dev-only `/styleguide` page for reviewing tokens.

### Critique (390 px and 1440 px), and what I changed
1. **Nav over a moving hero.** After scrolling, the clear nav sat on top of the
   products and the "Electronics" link disappeared into the watch strap.
   Fixed: the nav is clear only while the hero is at rest at the top of the
   page (or pinned, from Phase 2), and turns solid as soon as it moves.
2. **Wordmark width.** Width 66 was too condensed next to the mockup's rounder
   letters. I compared 62/66/70/75 on `/styleguide` and chose 70, then
   measured the rendered width in the browser so it fills 95% of the screen
   exactly, as in the mockup.
3. **Earbuds and sunglasses too low.** They were mostly hidden behind the
   letters. Moved up so they peek over the top, as in the mockup.
4. **Floor shadows invisible** on the textured stone. Made larger and denser.
   In Phase 2 they become dynamic (they react to each product's height).
5. **Tagline orphan.** "together." wrapped onto its own line. Now balanced over
   two lines, as in the mockup.
6. **Carved footer wordmark looked like cheap 3D text.** The first CSS version
   read as raised, leaning letters. Rebuilt as SVG: the cut darkens the stone
   (the texture shows through) with a shadowed inner wall, and the perspective
   is long enough that the letters no longer lean. On portrait screens it
   stacks as "Fine / verse" so it stays legible.
7. **Footer contrast on mobile.** White links landed on the bright horizon.
   Deepened the sky gradient and moved About / Privacy / Terms into the legal row.
8. **Footer year** used `new Date()` during prerender, which Next flagged. It's
   now read in the browser only.
9. **Solid nav was 95% opaque**, so the cobalt button showed through faintly.
   Now fully opaque.

### Removed (not earning its place)
The mega-menu's category sentence ("Earbuds, headphones, speakers and power
banks.") sat next to a list of exactly those links. Removed; the link list
now aligns with the logo.

### Open issues for Phase 2
- On mobile the floor is only the bottom quarter of the stand-in background;
  the landed two-column arrangement will be tight until a real 9:16 plate arrives.
- The desktop plate is 1672 px wide and slightly soft at 1440 px and above.
- The hero cut-outs are full-size PNGs in `public/` (served resized as
  AVIF/WebP, so download size is small); revisit in the Phase 8 performance pass.

---

## Phase 2: `<ScrollFrames>` and the scroll-scrubbed hero

### Built
- `components/motion/scroll-frames.tsx`: canvas player for optional frame
  sequences. It loads the poster, then every 8th frame, then every 4th, then
  every 2nd, then the rest; decodes with `createImageBitmap`; cover-fits at
  DPR ≤ 2; draws only when the frame changes; pauses while off-screen; picks the
  desktop or mobile set by aspect ratio; falls back to a still. `lib/frames.ts`
  detects `public/frames/<name>/` at build time. Tested with a temporary
  60-frame sequence (progressive order confirmed, scrubs forwards and back),
  then removed.
- Hero (`components/home/hero/hero-stage.tsx`), one GSAP timeline pinned with
  `scrub: 0.8` (250% of the screen height on landscape, 170% on portrait):
  - Beat 1: background pushes in to 1.08; products drift apart and tilt;
    shadows widen and fade as they rise.
  - Beat 2: products land one by one in a row (two columns on phones), with
    a small settle; shadows sharpen on touchdown.
  - Beat 3: each half of the wordmark travels into the same half of the nav
    logo, then cross-fades. The nav logo now uses the wordmark's own lettering,
    so the handoff is seamless. "The Everyday Kit" headline appears. Landed
    products become links showing name and price (on hover with a mouse,
    always on touch).
  - A warm light sweep crosses the scene; products bob gently before scrolling.
- All poses are data in `hero-items.ts`; `?debug` shows progress, beat markers
  and ScrollTrigger markers.
- Reduced motion: no pin. The landed still, with the full wordmark, is set
  entirely in CSS, so nothing jumps after the page loads.
- First-visit intro (`components/home/intro.tsx`): the F mark draws, then the
  overlay wipes up into the hero's first frame, in 1.15 s, pure CSS from first
  paint. Skips on tap, key or scroll; remembered in sessionStorage.

### Critique and fixes
1. **The timeline never ran on landscape screens.** GSAP's `matchMedia` only
   runs when a listed query matches, and I had listed only portrait and
   reduced motion. Added landscape.
2. **One product landed 110 px too low.** GSAP folded the CSS centring
   (`translate: -50% -50%`) into its transform inconsistently between React's
   two dev effect runs. Products are now centred with `left/top` maths, so GSAP
   owns `transform` outright. Every start and landed position measures exact
   on both screen sizes.
3. **Stale CSS in the dev server.** Tailwind's new Turbopack loader stopped
   picking up stylesheet edits. Switched to the standard `@tailwindcss/postcss`
   plugin; edits now hot-reload.
4. **Mobile products landed in mid-air.** The stand-in mobile background had
   floor only in its bottom quarter. Rebuilt the stand-in from the desktop
   plate with the floor remapped as if the camera tilts down (horizon at 52%),
   and moved the two-column landing onto it.
5. **Intro cut short and waiting on JavaScript.** Moved the animation to CSS so
   it starts at first paint and always finishes within 1.2 s.

### Removed
The headline's subline listed the five products, which the landed labels
already name. It now just states the saving.

### Open
- The hero background is a still with a CSS push; dropping frames into
  `public/frames/hero-bg/desktop/` and `/mobile/` switches it to a scrubbed
  film with no code changes.

---

## Phase 3: the rest of the home page

### Built (in page order)
- **Category index:** "Electronics / Clothing / Wearables" set huge and edge
  to edge (width measured in the browser). Hovering a name (or scrolling it
  to the middle of the screen on touch devices) floats its product in front
  of the letters with a shadow, and crossfades the scene to that category's
  light: night, morning or golden hour. Text turns white for night.
- **Electronics world:** the terrace at night with a cone of light and a
  cursor-following torch (desktop, fine pointers only). The Hush Headphones
  separate into headband, shells, drivers and cushions; leader lines draw to
  five spec labels taken from the product data. Pinned on desktop; on phones it
  plays as you scroll past, with the specs as a list.
- **Watch story:** the Tide Watch at monumental scale, partly cropped, in
  golden light. It turns into place while lines draw to the glass, crown and
  strap. Line endpoints are measured from the real layout on every refresh.
- **Bestsellers:** the five bestsellers on CSS stone plinths with placards
  (name, one fact, price, "Add to cart", or "Choose size" for clothing).
  Pinned horizontal travel on desktop; swipe with snap on phones.
- **Clothing world:** morning light; the camera pushes into the folded
  overshirt until the weave fills the screen, then the headline settles over it.
- **Lookbook:** a large still life with two close-ups overlapping its edges
  at different scroll speeds; "+" hotspots open a card with price and add to cart.
- **Reviews:** one review at a time, set large; arrows, swipe or arrow keys,
  never automatic.
- Shared: toasts that repeat the button's verb ("Added to cart"), a single
  `addToCart` action (the Phase 4 drawer and fly-to-cart animation plug into
  it), mock reviews data, and line-by-line headline reveals on the three
  world headlines only.
- Stand-in imagery (see `ASSETS_TODO.md`): night, morning and golden grades of
  the terrace, and the still life composed from the product cut-outs.

### Critique and fixes
1. Category names fell short of the edges: measured the real width (4.107 em)
   and fixed the size.
2. Watch headline ran onto the watch face, and two spec labels were dark text
   on the dark watch. Narrower headline; specs are now small stone cards.
3. Electronics labels on the right were clipped at the screen edge: smaller
   figure, narrower labels.
4. On phones the Electronics section was pinned while taller than the
   screen, cutting off its specs. Unpinned on phones.
5. On phones the watch headline overlapped the watch. The text now starts
   below it.
6. Fabric close-up: a mirrored fabric tile produced an obvious kaleidoscope
   pattern, so I dropped it in favour of pushing into the real render.
7. Two GSAP `matchMedia` blocks could skip reduced-motion phones (no
   condition matched). Each now lists an always-matching condition, and
   reduced motion shows every world's final frame (exploded headphones,
   labels drawn, fabric close-up with headline).

### Removed
The bestsellers subtitle ("…each on its own plinth") described the design
rather than the products.

---

## Phase 4: shop, product page, cart drawer, add-to-cart animation

### Built
- **Shop** (`/shop`, `/shop/[collection]`): type or category chips, colour,
  price band, in-stock filter and five sorts, all in the URL. The grid reflows
  with Motion layout animation; filters become a sheet on phones. Static
  skeleton in the page's exact shape while a route loads.
- **Product card:** second image on hover; quick-add bar with colour and
  size (a "+" button on touch screens); wishlist heart; "Choose size" where a
  size must be picked, instead of adding a guessed size.
- **Product page** (`/products/[handle]`, all 18 prerendered):
  - gallery stacked beside a sticky buy box on desktop, swipe with a progress
    bar on phones;
  - colour and size pickers update the image, price and availability with a
    short crossfade, and write `?colour=&size=` to the URL;
  - "Only N left" appears only when stock is 5 or fewer; out-of-stock variants
    offer "Notify me";
  - delivery, cash on delivery and returns sit right under the button; the
    pincode check gives specific errors and dates (mock rules in
    `lib/delivery.ts`); size guide with a measurement diagram;
  - accordion (details, specs, delivery and returns, care), reviews with a
    rating breakdown, rating filter, customer photos and a validated
    write-a-review form; "Complete the kit"; related; recently viewed;
  - sticky add-to-cart bar on phones; Product/Offer/AggregateRating JSON-LD.
- **Cart:** drawer on `<dialog>` (focus trap, Escape, focus return) with
  quantity steppers, remove with inline undo, free-delivery progress, the kit
  saving when all five kit lines are present, and checkout. `/cart` is the
  full-page fallback.
- **Add to cart:** the product image flies into the cart icon, the badge
  ticks, and the drawer slides in; the toast says "Added to cart".

### Checked in a real browser (both sizes)
Filters through the URL; colour change updates the URL; "Choose a size
first." without a size; add to cart opens the drawer; remove then undo
restores the line; pincode "5600" says "A pincode has 6 digits. You entered
4."; "560001" shows dates and cash on delivery; review form lists what to fix.
No console errors.

### Fixes
1. Next 16.4 warned that the product and category pages read the URL
   parameter outside `<Suspense>`, which slows client navigation. The
   parameter is now read inside a Suspense boundary with a skeleton fallback.
2. Click to open drawer measured about 920 ms in dev. The flight is now
   340 ms and the drawer starts as the image arrives (target under 700 ms;
   re-measured in the production build in Phase 8).
3. Card colour buttons had the same accessible name on every card ("Olive");
   they now include the product name.
4. The shop's product count wrapped on phones.

### Removed
The zoom on the first card image on hover: the second image fades in over
it, so the zoom was never seen.

---

## Phase 5: Everyday Kit builder, search, wishlist

### Built
- **Kit builder** (`/kit`): the five pieces standing on the terrace, as in the
  hero's landed scene. Each piece has a model picker ("Swap" for alternatives
  in its category), colour and size or option choices, and its own price.
  The separate total, the saving and the kit price roll as they change. "Add
  kit to cart" checks every piece ("Choose a size for the Field Overshirt.")
  and adds all five as one bundle; the cart then shows the kit saving. Total
  bar is sticky on phones.
- **Search:** a command palette from the nav icon, `/` or Ctrl/⌘+K, with
  instant results (thumbnail, category, price), arrow keys and Enter, recent
  searches, and category suggestions when nothing matches. Full results at
  `/search?q=`. Ranked catalogue search in `lib/commerce`.
- **Wishlist:** hearts on cards and product pages (saved locally); `/wishlist`
  with "Move to cart" in one tap ("Choose size" for clothing), remove, and an
  empty state with a lone pair of sunglasses on the terrace.
- **Page transitions:** each new page fades in over 280 ms, opacity only,
  never blocking clicks; off with reduced motion.

### Checked in a real browser (both sizes)
Kit size error, then a ₹24,999 kit in the cart (₹27,795 less ₹2,796).
Ctrl+K, type "watch", 2 results plus "See all", arrows and Enter open the
product. `/search?q=linen` finds the Shore Shirt; "zzz" shows the empty state.
Save, then Move to cart, empties the wishlist. No console errors.

### Fixes
- Kit heading was hard to read over the bright rock: added a soft stone wash
  behind it.
- React Compiler lint: the bundle id (uses the clock) moved out of the
  component; recent searches are read through a subscribed store instead of
  state set in an effect.

### Removed
The "(swap)" suffix after every alternative in the kit's model menus: the
menu itself is the swap, so the suffix was noise.

---

## Phase 6: checkout, confirmation, account, order tracking (UI on mock data)

### Built
- **Checkout** (`/checkout`): contact, address (with an Indian state list),
  delivery (standard or express, with dates once the pincode is valid) and
  payment. Online payment is a clearly marked placeholder panel for
  Razorpay or Stripe; cash on delivery adds its ₹49 fee and is disabled, with
  the reason, for pincodes the mock rules don't serve. Discount code `FINE10`
  (10% off) with specific valid and invalid messages; an optional gift note
  with a character count; the summary collapses to one line on phones.
  Every error says exactly what to fix ("A mobile number has 10 digits. You
  entered 9."), and focus moves to the first one.
- **Confirmation:** a tick draws itself, then the order number, arrival date,
  items, address and the full payment breakdown. No confetti.
- **Login** (`/login`): mobile number, then a 6-box one-time code (demo code
  123456; paste and autofill supported). A wrong code shakes the boxes and
  says so; resend after 30 s.
- **Account** (`/account`): orders, addresses (saved locally, with an add
  form) and wishlist tabs; order detail at `/account/orders/[id]` with a
  tracking timeline (Ordered → Packed → Shipped → Out for delivery →
  Delivered), horizontal on desktop and vertical on phones.
- **Track** (`/track`): order number + mobile number, no login.
- Three sample past orders (mobile 98765 43210) so the account and tracking
  pages have something to show.

### Checked in a real browser (both sizes)
Empty submit flags 8 fields; FINE15 rejected, fine10 accepted; COD chosen;
₹12,999 − ₹1,300 + ₹49 = ₹11,748 placed; confirmation renders; FV-10482 tracks
as shipped with courier and times; FV-99999 gives a clear not-found message;
a wrong code then 123456 logs in; the account lists the new order with the
three samples; order detail opens. No console errors.

### Fixes
- Dates on order and review pages are formatted in India time so the server
  and browser always agree (no hydration mismatches).
- Order creation (which reads the clock) moved out of the component into
  the orders store.
- The order number on the confirmation page broke across two lines.

### Removed
The generic "Check the highlighted fields above." line under the form: each
field already names its own problem and focus moves to the first one.

---

## Phase 7: content pages and 404

### Built
- **About:** the brand story on the terrace imagery: what we make, the
  materials, where it's made, and how we sell (cash on delivery, 7-day
  returns, no sale countdowns), ending with the kit.
- **FAQ:** five groups, instant search across questions and answers, and an
  empty state that points to Contact.
- **Contact:** a validated form (name, email or mobile, topic, optional order
  number, message) with an inline thank-you; WhatsApp, email, phone and hours.
  Support details live in `lib/site.ts` as obvious placeholders
  (`help@fineverse.example`, an all-zero number), listed in `ASSETS_TODO.md`.
- **Shipping and Returns:** every price and day count comes from the store
  policy, so they can't drift from checkout.
- **Privacy and Terms:** plain-language templates, each with a visible note
  that it must be reviewed by a legal adviser before launch (DPDP Act,
  company name and GSTIN).
- **404:** a lone pair of sunglasses on the empty terrace: "This page isn't
  in its place.", with links home and to the shop. Returns a real 404 status.
- A shared content template: 65-character measure, sticky "On this page" list
  on desktop, jump chips on phones.

### Checked
All pages at 390 and 1440 px; FAQ search filters; the contact form lists what
to fix; unknown URLs return 404. No console errors.

### Fixes
- The 404's sunglasses overlapped the heading; moved clear on both sizes.
- Policy pages used plain `<a>` for internal links (full reloads); now Next
  links.
- The dev server served a stale `lib/site.ts`; a clean restart fixed it
  (dev-only, not a code issue).

### Removed
The phone number on the Contact page. The page sends people to the form,
WhatsApp and email; a phone line was one more placeholder for a channel the
store doesn't offer.

---

## Phase 8: performance, accessibility, cross-viewport QA, handover

### Lighthouse (mobile, production build, second run)

| Page | Before | After | Accessibility | Best practices | SEO | LCP | TBT |
|---|---|---|---|---|---|---|---|
| Home | 81 | **85** | 100 | 100 | 100 | 1.0 s | 570 ms |
| Shop | 76 | **77–85** | 100 | 100 | 100 | 2.7–3.8 s | 340–470 ms |
| Product (Tide Watch) | 79 | **89** | 100 (was 95) | 100 | 100 | 2.7 s | 320 ms |
| Kit | 92 | **90** | 100 | 100 | 100 | 1.0 s | 410 ms |
| About | – | **90** | 100 | 100 | 100 | 3.4 s | 140 ms |
| Checkout | – | **88** | 100 | 100 | 63* | 3.2 s | 260 ms |
| FAQ | – | **96** | 100 | 100 | 100 | 1.0 s | 210 ms |

CLS is 0 on every page. *Checkout is deliberately `noindex`, which is the
only SEO audit it fails. Reports are in `qa/lighthouse/`.

Add to cart → drawer opening, production: **346 ms** at 1440 px, **336 ms**
at 390 px (it was about 920 ms on the dev server).

### Changed
- **Accessibility:** small grey text was 4.2:1 against the stone background;
  every `basalt/60` and `/65` is now `/70` (5.8:1 on stone, 4.9:1 on sand; AA needs 4.5:1). Product-page
  accordion titles were `h3` with no `h2` before them; the accordion takes a
  heading level and the product page uses `h2`.
- **Less work at load:** the five below-the-fold home sections build their
  scroll animations when they come within a screen of the viewport, batched
  into one re-measure (`useDeferredGSAP`). At load, only the hero's timeline
  exists (1 pin instead of 5). On a reload mid-page they build at once, so the
  restored scroll position stays right. Verified: all 5 pins exist after
  scrolling, with no errors.
- The cart drawer and search palette load after the page.
- SplitText is registered only by the hook that uses it, not on every page.
- CSS is inlined in the HTML, removing the render-blocking stylesheet.
- Largest images: the first two shop cards, the product gallery's first image,
  the About and 404 backgrounds load eagerly with high priority (instead of
  four preloads on the shop).

### Cross-viewport check (360, 390, 768, 1024, 1440, 1920 px)
`npm run qa:viewports` captures home (load and landed), shop, product, kit,
checkout and 404 at all six widths into `qa/screenshots/viewports/`. Phase-8
QA shots are in `qa/screenshots/phase-8/`; its only console errors are the
dev-only `/styleguide` returning 404 in production, as intended.

Fixed from the screenshots:
1. **Upright tablets (768 × 1024):** products and wordmark were sized by
   screen width, so the products covered most of "verse". Portrait sizes are
   now capped by height at the phone's proportions (390 : 844) and the
   wordmark is centred. Phones look the same as before; short phones
   (375 × 667) gain room too.
2. **Shop toolbar at 360 px:** the sort menu ran off the screen. It now
   shrinks to fit.
3. **Button sizes:** four buttons tried to shrink `buttonClasses` with
   `h-10 px-4 text-small`, which never applied (no class merging), so the
   Filter button was taller than the sort menu beside it. Added a real `sm`
   size (44 px, keeps the touch target) and used it in all four places.

### Handover
- `README.md`: running it, demo codes, project map, swapping hero layers,
  frame sequences, retuning the choreography with `?debug`, where a real
  store, payments and sign-in plug in, design rules, QA scripts.
- `ASSETS_TODO.md` brought up to date: world plates, still life, headphones
  illustration, review photos, share image, and the details to fill in
  before launch (support contacts, `NEXT_PUBLIC_SITE_URL`, legal pages).
- Share image `app/opengraph-image.jpg` (1200 × 630, from the hero) with alt
  text and a large card on X; product pages share their own packshot.
- `scripts/lighthouse.mjs` and `scripts/qa-viewports.mjs`, with npm scripts.

### Not done / below target
- **Shop scores 77–85** between runs. Its main image is 4 KB and is in the
  server HTML with high priority; the score is held back by script on the
  page (filter animations) under Lighthouse's simulated slow phone.
- **Home main-thread time (TBT 570 ms)** is mostly the hero's pinned timeline
  and the page's client components. More would mean splitting the hero.
- **Frame sequences** are wired up for the hero background only. The
  watch, overshirt and headphones sections animate stills or SVG; the
  README shows the change needed per section. (Corrected an earlier
  `ASSETS_TODO.md` line that said they switch automatically.)

### Removed
- One of the two full ScrollTrigger re-measures at first load (fonts were
  usually already loaded, and the route-change refresh also ran on load).
- The four ineffective button size overrides, replaced by the `sm` size.
