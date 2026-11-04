# Product imagery and 360° views

The demo catalog contains 42 products across six categories and 31 subcategories. Every one of its 64 colour variants has an eight-angle, AI-generated concept turntable. These are stepped image sequences covering a horizontal rotation, rather than measured 3D models or real product photography. Generated geometry can vary between views.

## Saved assets

- Runtime frames: `public/products/{handle}/generated/{colour-slug}/0.webp` through `7.webp`, 640 × 640.
- Original generated contact sheets: `assets-src/product-turntables/{handle}/{colour-slug}.png`.
- Completed-set registry: `data/generated-product-images.json`.
- Product and colour prompt inputs: `data/image-generation-jobs.json`.

Catalog cards use frames 0 and 1. Product pages provide Photos and 360° view modes. The viewer supports pointer dragging, arrow keys and Home/End. All frames load before rotation is enabled. Changing colour resets the viewer and loads the selected colour's sequence. Vertical touch scrolling remains enabled.

Legacy product images are preserved; the generated registry selects the new assets without overwriting existing photography. Homepage hero cutouts remain separately authored scene assets.

Men and Women edits are available at `/shop/men` and `/shop/women`, with links on the homepage, desktop/mobile navigation, shop pages and footer. Product audiences are explicit, through `data/product-audiences.ts` or the seed's `audiences` field. Unassigned products do not appear in either edit. The default featured order places each edit's exclusive products first, followed by shared items. Each edit supports category, colour, price, availability and sorting controls.

## Generation method and final prompt set

Generated with the built-in image generation tool, one contact sheet per product colour. Each entry in `data/image-generation-jobs.json` supplies the variables for this prompt:

```text
Use case: product-mockup. Asset type: ecommerce product turntable contact sheet. Generate ONE landscape 2:1 image with EXACTLY 4 columns and 2 rows of equally sized square cells. NO text, labels, dividers, gaps, props, models or logos. Subject: {title}. Product design: {description} Colour MUST be {colour}, reference hex {swatch}. Show ONE identical product in each of 8 cells (one single shoe for footwear). Rotate the SAME object around its vertical axis in row-major order: front 0 degrees, front-right 45, right side 90, rear-right 135, back 180, rear-left 225, left side 270, front-left 315. Fixed camera at slight elevation, identical scale and centered position in all cells. Entire object contained within each cell with 18 percent clear margins. Clothing shown upright on invisible mannequin with sleeves naturally extended; straps connected. Photorealistic premium studio photography, fine real material texture, soft grounded shadow, uniform warm offwhite background. Maintain exact geometry and material across all views. This is an 8-angle sprite asset, each cell crops to a product photo.
```

The initial `pulse-earbuds/sand` sheet used this prompt:

```text
Use case: product-mockup. Asset type: product turntable sprite sheet for an ecommerce 360-degree viewer. Generate ONE square image arranged as an EXACT 4 columns by 2 rows grid of equal square cells, with no gaps, dividers, text or labels. Subject: premium sand beige wireless earbuds standing in their open rounded speckled matte charging case. The SAME physically identical product in all eight cells. Each cell rotates the whole product about its vertical axis by 45 degrees, in row-major order: front 0, front right 45, right 90, rear right 135, rear 180, rear left 225, left 270, front left 315. Fixed camera elevation 15 degrees, fixed scale centered in each cell, entire object fully contained in its cell with 18 percent margin. Photorealistic studio catalog photography, warm offwhite seamless background, soft grounded shadow, fine material detail. No props, no logos. Output is a clean turntable contact sheet, not a scene.
```

The import script splits contact sheets into eight cells and encodes WebP delivery frames. It preserves the source sheet. It does not invent angles by transforming a single photograph.

## Validation and maintenance

```sh
node scripts/import-product-turntable.mjs <generated-source.png> <handle> <colour-slug>
npm run assets:sync
npm run assets:check
npm run typecheck
npm run lint
npm run build
# With the app running at localhost:3000:
npm run qa:catalog
```

The asset check requires all 64 complete sequences and decodes every frame to verify dimensions. Browser QA covers category filtering and URL persistence, drag and keyboard rotation, colour changes, a footwear size added to the cart, responsive layouts and the mobile navigation. Screenshots are written to `qa/catalog/`.
