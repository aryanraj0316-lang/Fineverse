# Assets to supply

Headphone and watch feature update: both homepage showcases use transparent scroll-scrubbed frame sequences in `public/frames/{hush,tide}-breakdown/`, composed from component images in `public/breakdowns/`. Scroll controls the separation and sequential labels in both directions. See `docs/product-anatomy.md` for imagery, prompts and checks. Additional Hush photographs remain available in `public/home/audio/`.

Catalog update: all 42 products and 64 colour variants now use generated packshots and eight-angle turntables in `public/products/{handle}/generated/{colour}/`. The legacy product-placeholder list below is historical; those files are preserved but superseded by `data/generated-product-images.json`. See `docs/product-imagery.md` for sources, prompts and validation. Scene and hero assets listed below remain separate.

Everything below is either missing or a stand-in. Every placeholder sits at its
final file path, so replacing an asset means overwriting the file; no code
changes are needed. Sources for the files I generated are in `assets-src/`.

Legend: **Replace** = stand-in in use, needs the real asset. **Stand-in** = made
from the assets you supplied (graded, cropped or composed) so the page works;
replace for launch.

Updated after Phase 8: every section of the site now has an image, so nothing
is blocking. The list is in rough order of how much each one shows.

## Must replace first

| File | Status | What's needed |
|---|---|---|
| `public/hero/items/earbuds.png` | **Replace** (your decision) | Clean transparent cut-out. The interim one was made with a background-removal model (beige case on a beige backdrop), so edges are approximate. PNG with alpha, ≥ 1600 px on the long side, same angle and light as `reference/home-hero.png`. |
| `public/hero/items/overshirt.png` | **Replace** (your decision) | Same as above: clean alpha PNG of the folded overshirt. |
| `public/hero/background-mobile.webp` | **Replace** | Real 9:16 render of the empty terrace, 1080 × 1920. The stand-in is built from the desktop plate with the floor stretched as if the camera tilted down (horizon at 52%), so it is soft and the floor texture is smeared. Frame the real one with the floor filling the lower half: on phones the products land on it in two columns. |
| `public/hero/background-desktop.webp` | **Replace** (higher resolution) | Supplied at 1672 × 941, which is soft on 1440 px and larger screens. Needs a ≥ 2560 × 1440 master of the same shot. |

## Interim but usable

| File | Status | Notes |
|---|---|---|
| `public/hero/items/watch.png`, `sunglasses.png`, `powerbank.png` | Interim cut-outs | Generated from your renders with soft, colour-corrected edges. They look clean at hero size; replace with studio alpha PNGs when you have them. |
| `public/products/{tide-watch/basalt, pulse-earbuds/sand, arc-sunglasses/basalt, field-overshirt/stone-grey, cell-power-bank/graphite}-1.webp` | Generated | The cut-out on the sand backdrop with a soft floor shadow, 1200 × 1500. |
| `…-2.webp` for the same five | Generated | A close crop of the same render, not a true second angle. Replace with a real second angle, 960 × 1200. |
| `public/footer/terrace-sunset.webp` | **Stand-in** | The day terrace colour-graded to sunset. Needs a real sunset render of the terrace, 2560 × 1440, camera a little higher so the floor fills the lower 30–40% (the wordmark is carved into it). |

## Product photography (70 placeholders)

Labelled sand placeholders ("Placeholder image") at the final paths. Packshots
`-1.webp`: 1200 × 1500 (4:5), product centred on the sand backdrop `#D6CCBC`,
soft floor shadow, matching the five renders. Second angles `-2.webp`: 960 × 1200.

| Folder in `public/products/` | Files |
|---|---|
| `arc-sunglasses/` | `tortoise-1.webp`, `tortoise-2.webp` |
| `base-tee/` | `basalt-1.webp`, `basalt-2.webp`, `chalk-1.webp`, `chalk-2.webp`, `sand-1.webp`, `sand-2.webp` |
| `cell-mini/` | `graphite-1.webp`, `graphite-2.webp`, `sand-1.webp`, `sand-2.webp` |
| `cove-speaker/` | `basalt-1.webp`, `basalt-2.webp`, `sand-1.webp`, `sand-2.webp` |
| `field-overshirt/` | `basalt-1.webp`, `basalt-2.webp`, `olive-1.webp`, `olive-2.webp` |
| `halo-sunglasses/` | `gold-1.webp`, `gold-2.webp`, `gunmetal-1.webp`, `gunmetal-2.webp` |
| `hush-headphones/` | `basalt-1.webp`, `basalt-2.webp`, `stone-1.webp`, `stone-2.webp` |
| `loop-hoodie/` | `basalt-1.webp`, `basalt-2.webp`, `grey-melange-1.webp`, `grey-melange-2.webp` |
| `pace-band/` | `basalt-1.webp`, `basalt-2.webp`, `sage-1.webp`, `sage-2.webp`, `sand-1.webp`, `sand-2.webp` |
| `pulse-earbuds/` | `basalt-1.webp`, `basalt-2.webp` |
| `shell-jacket/` | `basalt-1.webp`, `basalt-2.webp`, `olive-1.webp`, `olive-2.webp` |
| `shore-shirt/` | `chalk-1.webp`, `chalk-2.webp`, `haze-1.webp`, `haze-2.webp`, `sand-1.webp`, `sand-2.webp` |
| `stride-trousers/` | `basalt-1.webp`, `basalt-2.webp`, `khaki-1.webp`, `khaki-2.webp`, `stone-1.webp`, `stone-2.webp` |
| `tide-watch/` | `sand-1.webp`, `sand-2.webp` |
| `tide-watch-titanium/` | `basalt-1.webp`, `basalt-2.webp`, `natural-1.webp`, `natural-2.webp` |
| `tone-earbuds/` | `basalt-1.webp`, `basalt-2.webp`, `chalk-1.webp`, `chalk-2.webp` |
| `vale-sunglasses/` | `basalt-1.webp`, `basalt-2.webp`, `stone-1.webp`, `stone-2.webp` |

## Section imagery (stand-ins in use)

| File | Status | What's needed |
|---|---|---|
| `public/worlds/night-{desktop,mobile}.webp` | **Stand-in** | Night grade of the day terrace (Electronics world, category index). Needs a real night render of the same camera: 2560 × 1440 and 1080 × 1920. |
| `public/worlds/morning-{desktop,mobile}.webp` | **Stand-in** | Morning grade (Clothing world, Bestsellers, category index). Same sizes. |
| `public/worlds/golden-{desktop,mobile}.webp` | **Stand-in** | Golden-hour grade (Watch story, category index). Same sizes. The mobile versions are built like the mobile hero plate, so they share its softness. |
| `public/lifestyle/still-life-terrace.webp` | **Stand-in** | Lookbook and About. Composed from the five cut-outs on the terrace. Needs a real photograph: the kit on the terrace in late-afternoon light, 2560 × 1600. Hotspot positions are in `app/page.tsx` (`hotspotPositions`); adjust them to the new photo. |
| Headphones (Electronics world) | **Stand-in** | Drawn as an SVG illustration in `components/home/headphones-figure.tsx` because no render exists. For the real thing: a Hush Headphones render split into headband, two shells, two drivers and two cushions as aligned alpha PNGs on one canvas size, or a `headphones-explode` frame sequence (below). |
| Overshirt close-up (Clothing world) | Interim | The section zooms into the overshirt cut-out until the weave fills the screen, which is soft at full zoom. A real fabric macro in morning light (2560 × 1440 and 1080 × 1920), or the `shirt-unfold` frames, would replace it. |
| Watch story | Interim | Uses the Tide Watch cut-out at large scale. A ≥ 2400 px render (or the `watch-360` frames) would stay sharp when cropped. |
| Stone plinths (Bestsellers) | Built in CSS | Optional: a stone texture or render. |
| Review photos | Stand-in | Five reviews in `data/reviews.ts` show product close-ups as "customer photos". Swap for real customer photos, or delete the `photos` field. |
| `app/opengraph-image.jpg` | Generated | The share image (1200 × 630) is a screenshot of the hero at load. Regenerate it once the real hero assets are in. Product pages share their own packshot. |

## Details to fill in before launch (not images)

| Where | What |
|---|---|
| `lib/site.ts` | Support email (`help@fineverse.example`) and WhatsApp number (`910000000000`) are deliberately non-working placeholders. |
| `NEXT_PUBLIC_SITE_URL` (environment variable) | The live address, e.g. `https://fineverse.in`. Share images, canonical links and JSON-LD use it; without it they point at `localhost:3000`. |
| `app/privacy`, `app/terms` | Template text with a visible "review before launch" note: company name, GSTIN, grievance officer (DPDP Act). |

## Optional video frame sequences (none supplied; fallbacks in use)

Format: WebP, numbered `0001.webp`, `0002.webp`…

- **Hero background:** wired up. Drop frames into `public/frames/hero-bg/` and
  the hero scrubs through them on the next build; with none it shows the still.
- **Watch, shirt, headphones:** not wired up yet. Each section currently
  animates its still or SVG. Adding a sequence means placing
  `<ScrollFrames>` in that section (see "Frame sequences" in `README.md`),
  about a 20-line change per section.

| Folder | Frames | Size |
|---|---|---|
| `public/frames/hero-bg/desktop/` and `/mobile/` | 120–180 | 1920 × 1080 and 1080 × 1920, quality ~70. Keep each set under ~2.5 MB (desktop) and ~1.5 MB (mobile) in total for the frames loaded first. |
| `public/frames/watch-360/` | 90–120 | 1600 × 1600, alpha or on the scene background |
| `public/frames/shirt-unfold/` | 90–120 | 1920 × 1080 |
| `public/frames/headphones-explode/` | 90–120 | 1600 × 1600 |

## Section mockups

`reference/section-*.png` were not supplied. Per your Phase 0 decision, section
layouts follow `BUILD_BRIEF.md`, and `reference/home-full.png` is used only for
colour, light, photography style and type.
