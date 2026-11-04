import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import ts from "typescript";

async function readModule(file) {
  const loaded = { exports: {} };
  const source = ts.transpile(await fs.readFile(file, "utf8"), { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 });
  new Function("exports", source)(loaded.exports);
  return loaded.exports;
}

const { headphoneAnatomy, watchAnatomy } = await readModule("data/product-anatomy.ts");
const { partSpread, partVisibility, assembledVisibility } = await readModule("lib/breakdown-motion.ts");
const recipes = [
  { name: "hush-breakdown", kind: "headphones", parts: headphoneAnatomy, assembled: "public/breakdowns/headphones/assembled.webp" },
  { name: "tide-breakdown", kind: "watch", parts: watchAnatomy, assembled: "public/hero/items/watch.png" },
];
const formats = [{ name: "desktop", width: 960, height: 768, count: 96 }, { name: "mobile", width: 600, height: 720, count: 72 }];

function fade(layer, opacity) {
  if (opacity > .999) return layer.data;
  const data = Buffer.from(layer.data);
  for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * opacity);
  return data;
}

for (const recipe of recipes) {
  const sources = new Map();
  for (const part of recipe.parts) sources.set(part.id, await sharp(`public/breakdowns/${recipe.kind}/${part.id}.webp`).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
  const full = await sharp(recipe.assembled).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const format of formats) {
    const root = path.resolve("public/frames", recipe.name, format.name);
    await fs.mkdir(root, { recursive: true });
    for (const file of await fs.readdir(root)) if (/^\d+\.webp$/.test(file)) await fs.unlink(path.join(root, file));
    const cache = new Map();
    const resized = async (key, source, boxWidth, boxHeight) => {
      const width = Math.max(1, Math.round(boxWidth));
      const height = Math.max(1, Math.round(boxHeight));
      const id = `${key}:${width}:${height}`;
      if (!cache.has(id)) cache.set(id, await sharp(source.data, { raw: source.info }).resize(width, height, { fit: "inside" }).raw().toBuffer({ resolveWithObject: true }));
      return cache.get(id);
    };
    const whole = await resized("assembled", full, format.width * (recipe.kind === "watch" ? .60 : .66), format.height * .84);
    for (let i = 0; i < format.count; i++) {
      const progress = i / (format.count - 1);
      const layers = [];
      const alpha = assembledVisibility(progress);
      if (alpha > .001) layers.push({ input: fade(whole, alpha), raw: whole.info, left: Math.round((format.width - whole.info.width) / 2), top: Math.round((format.height - whole.info.height) / 2) });
      const ordered = recipe.parts.map((part, index) => ({ part, index, depth: recipe.kind === "watch" ? (part.id === "case" ? 2 : 12 - index) : index + 2 })).sort((a, b) => a.depth - b.depth);
      for (const { part, index } of ordered) {
        const opacity = partVisibility(progress, index);
        if (opacity < .001) continue;
        const spread = partSpread(progress, index);
        const scale = .35 + .65 * spread;
        const image = await resized(part.id, sources.get(part.id), format.width * part.width / 100 * scale, format.height * part.height / 100 * scale);
        const x = (50 + (part.x - 50) * spread) / 100 * format.width;
        const y = (50 + (part.y - 50) * spread) / 100 * format.height;
        const left = Math.max(0, Math.min(format.width - image.info.width, Math.round(x - image.info.width / 2)));
        const top = Math.max(0, Math.min(format.height - image.info.height, Math.round(y - image.info.height / 2)));
        layers.push({ input: fade(image, opacity), raw: image.info, left, top });
      }
      await sharp({ create: { width: format.width, height: format.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(layers).webp({ quality: 85, alphaQuality: 95, effort: 2 }).toFile(path.join(root, `${String(i + 1).padStart(4, "0")}.webp`));
    }
    console.log(`${recipe.name}/${format.name}: ${format.count} transparent scrub frames (${format.width}x${format.height})`);
  }
}
