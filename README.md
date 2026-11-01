# Fineverse

A scroll-cinematic storefront for electronics, clothing and wearables. Five
products float over an empty stone terrace, then land on the floor as you
scroll, and the wordmark travels into the navigation bar.

**This is the front end only.** Products, prices, stock, reviews, orders and
sign-in all run on mock data in the browser. There is no server, database,
payment provider or real authentication. Where each one would plug in is
described under [Connecting a real store](#connecting-a-real-store).

| Document | What it holds |
|---|---|
| `BUILD_BRIEF.md` | The client brief and the approved Phase 0 decisions |
| `DESIGN_PLAN.md` | Tokens, wireframes and the motion map |
| `PROGRESS.md` | What was built in each phase, with a critique |
| `ASSETS_TODO.md` | Every stand-in image and placeholder detail to replace |

## Running it

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to the live address (for example
`https://fineverse.in`) when deploying. Share images, canonical links and
product structured data use it. Without it they point at `localhost:3000`.

Stack: Next.js 16 (App Router, Cache Components, Turbopack), React 19,
TypeScript (strict), Tailwind CSS 4, GSAP with ScrollTrigger, Lenis smooth
scrolling, Motion for layout animation, and Zustand for client state.

### Things to try

- **Sign in:** any 10-digit mobile number, OTP `123456`. Use `9876543210` to
  see an account with three past orders.
- **Track an order:** `FV-10482`, `FV-10377` or `FV-10291` with `9876543210`.
- **Discount code:** `FINE10` at checkout.
- **Pincodes:** any valid six-digit pincode gets a delivery estimate.
  Pincodes starting 18, 19, 79 or 744 are prepaid only, with no cash on
  delivery (see `lib/delivery.ts`).
- **Search:** <kbd>Ctrl</kbd>+<kbd>K</kbd> or <kbd>/</kbd> from any page.
- **Hero tuning view:** add `?debug` to the home page URL.

## Project map

```
app/                 Routes. Each page is a thin server component.
  globals.css        Design tokens (colour, type, radii) and the hero's CSS.
  fonts.ts           Self-hosted Archivo subset (app/fonts/).
components/
  home/              Home page sections; hero/ holds the scroll-scrubbed hero.
  motion/            ScrollFrames, useLineReveal, useDeferredGSAP.
  shop/ product/ cart/ kit/ checkout/ account/ orders/ search/ content/
  layout/            Header, mega-menu, mobile menu, footer.
  ui/                Button, Dialog, Accordion, Toaster and other primitives.
lib/
  commerce/          The only source of products, prices and stock.
  cart-pricing.ts    Cart totals, free-delivery threshold.
  checkout.ts        Discount codes, validators, Indian states, order pricing.
  delivery.ts        Mock pincode lookup.
  frames.ts          Finds optional frame sequences in public/frames/.
  site.ts            Site name, URL and support contact details.
stores/              Client state (cart, wishlist, recently viewed, orders,
                     sign-in, toasts), saved to localStorage.
data/                The mock catalogue, kit, store policy, reviews and orders.
public/              Images. Every stand-in sits at its final path.
scripts/             Font build and QA scripts.
reference-project/   The old travel site, kept for technique only. Excluded
                     from type checking, linting and Tailwind.
```

## Changing the hero

The hero is `components/home/hero/`. `hero-scene.tsx` loads the data,
`hero-stage.tsx` builds the scroll timeline, and `hero-items.ts` holds every
pose.

### Swapping the images

Replace the files in place. No code change is needed unless an image's pixel
size changes.

| Layer | File |
|---|---|
| Background, landscape | `public/hero/background-desktop.webp` (master ≥ 2560 × 1440) |
| Background, portrait | `public/hero/background-mobile.webp` (1080 × 1920) |
| Products | `public/hero/items/{watch,earbuds,sunglasses,overshirt,powerbank}.png` (transparent PNG) |

If a product cut-out's size changes, update its `width` and `height` in
`hero-items.ts`. The layout uses them for the aspect ratio. Keep a little
transparent margin around each product, and keep every product lit from the
same side as the background.

### Retuning the choreography

Each item in `hero-items.ts` has a `desktop` and a `mobile` choreography, each
with three poses and a floor shadow:

- `start`: where it floats when the page loads
- `mid`: where it drifts to as scrolling begins
- `landed`: where it rests on the floor
- `shadow`: the floor shadow's position, width and opacity, at start and on landing

A pose is `{ x, y, w, r }`. `x` and `y` are the item's centre as a percentage
of the hero's width and height, `w` is its width as a percentage of the
stage width, and `r` is the rotation in degrees. Landscape screens use
`desktop`, and portrait screens (phones, upright tablets) use `mobile`.

`beats` sets when things happen, as a fraction of the scroll: products drift
from 0, land from `0.34` (one after another, in `order`), and the wordmark
hands off to the nav at `0.7`. The pin length is `end` in `hero-stage.tsx`
(`+=130%` landscape, `+=110%` portrait). Longer pins feel slow: visitors have to scroll a long way to see the animation through.

Open `/?debug` while tuning: it shows the scroll progress and ScrollTrigger's
start and end markers.

With reduced motion, the hero is a still of the landed state, set entirely in
CSS (see "Reduced motion" in `globals.css`). Check it after retuning.

### Frame sequences

The hero background can scrub through a video rendered as frames. Export the
frames as WebP files numbered `0001.webp`, `0002.webp` and so on, and put
them in:

```
public/frames/hero-bg/desktop/   1920 × 1080, 120–180 frames
public/frames/hero-bg/mobile/    1080 × 1920
```

(or a single `public/frames/hero-bg/` folder for both). `lib/frames.ts` finds
them at build time and the hero switches from the still to the frames. Remove
the folder to switch back. Frames load coarse to fine (every 8th frame,
then every 4th, and so on), the nearest loaded frame is drawn meanwhile, and
the still shows until the first one decodes. Reduced motion loads one frame.

The watch, overshirt and headphones sections don't use frames yet.
`<ScrollFrames>` in `components/motion/scroll-frames.tsx` has a standalone
mode for this:

```tsx
// In the section's server component (undefined when there are no frames):
const frames = getFrameSources("watch-360");

// In the client section:
{frames ? (
  <ScrollFrames
    sources={frames}
    fallbackSrc="/products/tide-watch/basalt-1.webp"
    trigger={() => sectionRef.current}
    start="top top"
    end="+=150%"
  />
) : (
  /* the current still */
)}
```

## Connecting a real store

Everything reads through a small set of seams, so a real backend replaces
those modules, not the components.

| Concern | Today | Replace with |
|---|---|---|
| Catalogue, prices, stock, collections, reviews | `lib/commerce/catalog.ts` reading `data/*.ts` | The same functions (`getProducts`, `getProduct`, `getCollections`, `getKit`, `searchProducts`…) calling Shopify, Medusa, or your own API. Components only see the types in `lib/commerce/types.ts`. |
| Money | Whole rupees; `formatPrice` in `lib/commerce/money.ts` | Keep `formatPrice` for display. Most platforms return paise or decimal strings: convert at the seam. |
| Cart | `stores/cart.ts` (Zustand, localStorage) | A server cart. `lib/cart-actions.ts` (`addToCart`) is the single entry point every "Add to cart" button calls. |
| Delivery estimates | `lib/delivery.ts` (mock pincode table) | Your courier's serviceability API. |
| Checkout and payment | `components/checkout/checkout-form.tsx` validates, then `placeOrder` in `stores/orders.ts` saves the order locally | Create the order on the server, then open Razorpay, Cashfree or similar for UPI, cards and net banking. Cash on delivery skips the payment step. Pricing in `lib/checkout.ts` should then be repeated on the server, which decides the final amount. |
| Sign-in | `stores/auth.ts`, OTP `123456` | A real OTP provider. The login page only calls `signIn` and `signOut`. |
| Orders and tracking | `data/orders.ts` plus orders placed in this browser | Your order API and the courier's tracking events. `TrackingTimeline` takes the current status and a date for each step reached. |
| Newsletter, contact form, notify-me | Validate, then show a thank-you | POST to your email or CRM provider. |

Caching: Cache Components is on. Catalogue reads are synchronous today, so
pages are prerendered. When they become network calls, mark them with
`'use cache'` and a `cacheLife` that fits how often prices and stock change,
and keep request-time data (cookies, search params) inside `<Suspense>`.

## Design rules

- Colours, type sizes and radii are tokens in `app/globals.css`. Tailwind's
  default palette and scale are switched off, so `text-red-500` won't work.
- Product data and prices come only from `lib/commerce`. Format prices with
  `formatPrice`.
- Animate only `transform`, `opacity` and `clip-path`. Every effect has a
  reduced-motion state.
- No `new Date()`, `Math.random()` or request data during render, except
  inside `<Suspense>` or client effects (a Cache Components rule).
- Buttons: use `buttonClasses(variant, size)` with `sm`, `md` or `lg`. Don't
  override height or text size in `className`: there is no class merging, so
  the override may lose.
- The font is a subset of Archivo (weights 400–900, widths 62–100, including
  ₹). To add characters, edit and run `scripts/build-font.py`.

## Performance

- Below-the-fold home sections build their scroll animations only when they
  come within a screen of the viewport (`useDeferredGSAP`). At load, only the
  hero's timeline exists.
- The cart drawer and search palette load after the page (`LazyOverlays`).
- CSS is inlined in the HTML (`experimental.inlineCss`), so there is no
  render-blocking stylesheet request.
- The image that is largest on first paint on each page loads eagerly with
  high priority. Everything else is lazy.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run qa -- --phase=8 --base=http://localhost:3000     # 390 and 1440 px, hero states, menus
npm run qa:viewports -- --base=http://localhost:3000     # 360, 390, 768, 1024, 1440, 1920 px
npm i -D lighthouse                                     # once
npm run lighthouse -- --base=http://localhost:3000 / /shop /products/tide-watch
```

Screenshots go to `qa/screenshots/`, Lighthouse reports to `qa/lighthouse/`.
Run Lighthouse against `npm run build && npm run start`, not the dev server,
and run it twice. The first visit to each image triggers on-demand resizing,
which a real host would already have cached.
