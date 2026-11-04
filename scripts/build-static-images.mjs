import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Resize once during deployment, never on the small production web instance.
sharp.concurrency(1);
const output = "public/image-cache";
await fs.mkdir(output, { recursive: true });
const manifest = {};
let total = 0;
async function scan(folder) {
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      if (["image-cache", "frames", "generated"].includes(entry.name)) continue;
      await scan(file);
      continue;
    }
    if (!/\.(png|jpe?g|webp)$/i.test(entry.name)) continue;
    const source = "/" + path.relative("public", file).split(path.sep).join("/");
    const bytes = await fs.readFile(file);
    const metadata = await sharp(bytes).metadata();
    if (!metadata.width || metadata.width <= 800 && /\.webp$/i.test(file)) continue;
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    const widths = [...new Set([320, 640, 960, 1440, 1920].map((width) => Math.min(width, metadata.width)))];
    const variants = [];
    for (const width of widths) {
      const name = `${hash}-${width}.webp`;
      const target = path.join(output, name);
      try { await fs.access(target); }
      catch { await sharp(bytes).resize({ width, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 95, effort: 3 }).toFile(target); }
      variants.push({ width, src: `/image-cache/${name}` });
      total++;
    }
    manifest[source] = variants;
  }
}
await scan("public");
await fs.writeFile("data/static-image-manifest.json", JSON.stringify(manifest) + "\n");
console.log(`Prepared ${total} static responsive images for ${Object.keys(manifest).length} sources; no runtime image encoding.`);
