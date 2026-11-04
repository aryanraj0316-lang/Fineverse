import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [source, product, part] = process.argv.slice(2);
if (!source || !["headphones", "watch"].includes(product) || !/^[a-z0-9-]+$/.test(part)) throw new Error("Expected source, product and part");
const sources = path.join("assets-src", "breakdowns", product);
const output = path.join("public", "breakdowns", product);
await fs.mkdir(sources, { recursive: true });
await fs.mkdir(output, { recursive: true });
await fs.copyFile(source, path.join(sources, `${part}.png`));
const metadata = await sharp(source).metadata();
if (!metadata.hasAlpha) throw new Error(`${product}/${part} has no alpha channel`);
const stats = await sharp(source).stats();
if (stats.channels[3]?.min !== 0) throw new Error(`${product}/${part} has no transparent pixels`);
await sharp(source).trim({ threshold: 12 }).resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(output, `${part}.webp`));
console.log(`Imported ${product}/${part}: transparent component`);
