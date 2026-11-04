# Scroll-driven headphone and watch breakdowns

Both homepage product chapters use the existing canvas frame-sequence technique in `ScrollFrames`. Scrolling pins the chapter, scrubs the product from assembled to separated components, then progressively draws leader lines and reveals six labels. Reverse scrolling reverses both the frames and labels. There are no mode buttons or click-driven sidebars.

The Hush chapter uses the site's night scene; Tide uses the golden scene. Both retain Archivo display typography, cobalt product links and the site's existing colors. Phone, portrait tablet and landscape layouts share the same scroll interaction. Reduced motion shows the completed breakdown without pinning.

## Sources and rendering

- Component artwork: `public/breakdowns/{headphones,watch}/`.
- Originals: `assets-src/breakdowns/`; generation prompts: `data/breakdown-art-prompts.json`.
- Whole watch: `public/hero/items/watch.png`.
- Motion mapping: `lib/breakdown-motion.ts`.
- Parts and label coordinates: `data/product-anatomy.ts`.
- Rendering: `scripts/render-breakdown-frames.mjs` composites transparent WebP frames from existing artwork. Each chapter has 96 desktop and 72 mobile frames.
- Runtime: `components/product/product-anatomy.tsx` drives the player, leaders and labels from one scroll playhead. Inactive chapters release decoded frames.

Internal components are illustrative product studies, not measured service diagrams.

## Validation

```sh
npm run frames:breakdowns
node scripts/check-breakdown-frames.mjs
npm run qa:anatomy
```

The build checks all 336 expected frame names and representative dimensions/transparency. Browser QA checks actual canvas pixel changes and frame indices forward and backward, sequential labels, pinning, overflow, reduced motion and browser errors at 390x844, 768x1024, 1440x900, 1024x1366 and 640x360. Screenshots are saved to `qa/catalog/*-scrub-*.png`.
