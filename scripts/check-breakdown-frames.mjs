import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

for (const product of ["hush-breakdown", "tide-breakdown"]) {
  for (const [layout, count, width, height] of [["desktop", 96, 960, 768], ["mobile", 72, 600, 720]]) {
    const folder = path.join("public/frames", product, layout);
    const files = (await fs.readdir(folder)).filter((file) => file.endsWith(".webp")).sort();
    const expected = Array.from({ length: count }, (_, i) => `${String(i + 1).padStart(4, "0")}.webp`);
    if (files.join() !== expected.join()) throw new Error(`Missing or unexpected frames in ${folder}`);
    for (const index of [0, Math.floor(count / 2), count - 1]) {
      const metadata = await sharp(path.join(folder, files[index])).metadata();
      if (metadata.width !== width || metadata.height !== height || !metadata.hasAlpha) throw new Error(`Invalid transparent frame: ${folder}/${files[index]}`);
    }
  }
}
console.log("PASS: 336 transparent product breakdown frames, complete desktop and mobile sequences.");
