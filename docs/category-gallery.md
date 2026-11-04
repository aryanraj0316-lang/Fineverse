# Homepage category gallery

Replaces the oversized category wordmarks, changing landscape backgrounds and floating cutouts with a responsive gallery of six category photographs.

- Three columns on wide screens; two columns on tablet and phone.
- Live product counts and category links come from the commerce catalog.
- Consistent photograph framing, clear titles, descriptive captions and an always-visible navigation arrow.
- Cards fade upward once on entry, with a short stagger. Mouse hover gently scales the image without moving the surrounding layout.
- Content is visible without JavaScript. Entrance and hover movement respect reduced-motion preferences. Keyboard focus and link activation remain native.

## Artwork

Six new photographs generated with the built-in image generation tool. Exact prompts are saved in `data/category-art-prompts.json`. The shared direction is tactile studio still life, warm neutral materials, natural directional light and realistic product arrangements.

- Original PNGs: `assets-src/category-editorial/{category}.png`.
- Delivery images: `public/categories/{category}.webp`, 1200 × 960, WebP quality 88.
- Existing product photographs and other homepage scenes remain separate assets.

```sh
npm run qa:categories
```

Checks six category links and loaded images at 360, 390, 768, 1440 and 1920 pixels, layout overflow, keyboard navigation, stable hover geometry and reduced motion. Screenshots are saved to `qa/catalog/categories-{width}.png`.
