import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [source, handle] = process.argv.slice(2);
if (!source || !/^[a-z0-9-]+$/.test(handle)) throw new Error("Expected source and audio image handle");
await fs.mkdir("assets-src/hush-editorial", { recursive: true });
await fs.mkdir("public/home/audio", { recursive: true });
await fs.copyFile(source, path.join("assets-src/hush-editorial", `${handle}.png`));
await sharp(source).resize(1600, 1600, { fit: "cover", withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join("public/home/audio", `${handle}.webp`));
console.log(`Imported Hush image: ${handle}`);
