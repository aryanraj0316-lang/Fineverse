import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [source, handle, colour] = process.argv.slice(2);
if (!source || !/^[a-z0-9-]+$/.test(handle) || !/^[a-z0-9-]+$/.test(colour)) throw new Error("Expected source, product handle and colour slug");
const directory = path.join("public", "products", handle, "generated", colour);
await fs.mkdir(directory, { recursive: true });
const sources = path.join("assets-src", "product-turntables", handle);
await fs.mkdir(sources, { recursive: true });
await fs.copyFile(source, path.join(sources, `${colour}.png`));
const { width, height } = await sharp(source).metadata();
const cellWidth = Math.floor(width / 4);
const cellHeight = Math.floor(height / 2);
for (let frame = 0; frame < 8; frame++) {
  await sharp(source).extract({ left: (frame % 4) * cellWidth, top: Math.floor(frame / 4) * cellHeight, width: cellWidth, height: cellHeight }).resize(640, 640, { fit: "contain", background: "#f5f0e9" }).webp({ quality: 88 }).toFile(path.join(directory, `${frame}.webp`));
}
await fs.writeFile(path.join(directory, "manifest.json"), JSON.stringify({ handle, colour, frames: 8, width: 640, height: 640 }));
console.log(`Imported ${handle}/${colour}: 8 angles`);
