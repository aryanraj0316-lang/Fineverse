# Editorial homepage sections

The Men/Women collection doors use matching editorial campaign images, clear category labels, live catalog counts and direct audience collection links. Hover and keyboard focus subtly scale the image and emphasize the arrow; reduced motion removes the zoom.

The terrace lookbook keeps the full still life without overlapping detail photographs. Five accessible hotspots and five product rows select the same product panel, with its catalog image, specification, price and shopping action. Sized products link to size selection; eligible products use the existing cart flow. The layout becomes a stacked scene and product panel on tablets and phones.

Artwork was generated with the built-in image_gen tool:
- Delivery: `public/home/edits/men.webp`, `public/home/edits/women.webp`.
- Original PNGs: `assets-src/audience-editorial/`.
- Exact prompt set: `data/audience-art-prompts.json`.
- The lookbook now uses `public/home/products-v2/terrace.webp` and five new transparent product photographs shared with Bestsellers. Originals are in `assets-src/home-product-refresh/`, dimensions are in `data/home-product-images.json`, and exact built-in image_gen prompts are in `data/home-product-refresh-prompts.json`. Original hero cutouts remain available for the other homepage scenes. Hotspot coordinates follow the new photograph, and the image keeps its natural aspect ratio so the products remain fully visible.

Run `npm run qa:editorial` against the preview, or set QA_BASE_URL. It checks five widths, decoded images, all five synchronized hotspots, keyboard selection, audience routes, adding the watch to cart, reduced motion and browser errors. Screenshots are in `qa/catalog/{everyday-edits,the-lookbook}-{width}.png`.

## Different Bestsellers selection

The homepage Bestsellers now features Roam Backpack, Pace Sneaker, Cove Speaker, Chrono Watch and Form Lamp. It uses catalog prices, stock, size selection and cart variants for those exact products. Transparent cutouts were generated with built-in image_gen from their catalog photos. Delivery: `public/home/bestsellers-v3/`; originals: `assets-src/bestsellers-v3/`; dimensions: `data/bestseller-images.json`; exact prompts: `data/bestseller-image-prompts.json`. The lookbook and kit keep their separate product selection.

The hero wordmark and starting/drift poses are lower and more centered beneath the navigation. Landed poses and scroll choreography remain. Browser verification covers navigation clearance at five scroll positions at 390x844, 768x1024, 1440x900, 1920x900 and 640x360; plus the replacement product links, decoded images, sneaker size selection and backpack cart action.
