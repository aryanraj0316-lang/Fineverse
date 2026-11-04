import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [source, handle] = process.argv.slice(2);
if (!source || !/^[a-z0-9-]+$/.test(handle)) throw new Error("Expected image source and category handle");
await fs.mkdir("assets-src/category-editorial", { recursive: true });
await fs.mkdir("public/categories", { recursive: true });
await fs.copyFile(source, path.join("assets-src/category-editorial", `${handle}.png`));
await sharp(source).resize(1200, 960, { fit: "cover", position: "centre" }).webp({ quality: 88 }).toFile(path.join("public/categories", `${handle}.webp`));
console.log(`Imported category art: ${handle}`);
