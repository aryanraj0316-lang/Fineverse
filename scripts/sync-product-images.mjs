import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const catalogue = {};
for (const product of await fs.readdir("public/products", { withFileTypes: true })) {
  if (!product.isDirectory()) continue;
  const root = path.join("public/products", product.name, "generated");
  let colours;
  try { colours = await fs.readdir(root); } catch { continue; }
  for (const colour of colours) {
    let manifest;
    try {
      manifest = JSON.parse(await fs.readFile(path.join(root, colour, "manifest.json"), "utf8"));
    } catch (error) {
      if (error.code === "ENOENT") continue; // An import may still be writing its frames.
      throw error;
    }
    for (let i = 0; i < manifest.frames; i++) await fs.access(path.join(root, colour, `${i}.webp`));
    catalogue[`${product.name}/${colour}`] = manifest.frames;
  }
}
await fs.writeFile("data/generated-product-images.json", JSON.stringify(catalogue, null, 2) + "\n");
console.log(`Synced ${Object.keys(catalogue).length} product colours`);

if (process.argv.includes("--check")) {
  const jobs = JSON.parse(await fs.readFile("data/image-generation-jobs.json", "utf8"));
  for (const job of jobs) {
    const key = `${job.handle}/${job.slug}`;
    if (catalogue[key] !== 8) throw new Error(`Missing complete turntable: ${key}`);
    for (let i = 0; i < 8; i++) {
      const metadata = await sharp(`public/products/${job.handle}/generated/${job.slug}/${i}.webp`).metadata();
      if (metadata.width !== 640 || metadata.height !== 640) throw new Error(`Invalid frame: ${key}/${i}`);
    }
  }
  console.log(`PASS: ${jobs.length} colour variants, ${jobs.length * 8} decodable frames, eight angles each.`);
}
