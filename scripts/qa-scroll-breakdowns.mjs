import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const errors = [];
await fs.mkdir("qa/catalog", { recursive: true });

async function seek(page, scene, progress) {
  const range = await scene.evaluate((element) => ({ start: Number(element.dataset.scrollStart), end: Number(element.dataset.scrollEnd) }));
  await page.evaluate(({ range, progress }) => window.scrollTo({ top: range.start + (range.end - range.start) * progress, behavior: "instant" }), { range, progress });
  await expect.poll(async () => Math.abs(Number(await scene.getAttribute("data-scrub-progress")) - progress), { timeout: 10000 }).toBeLessThan(.006);
  await expect.poll(() => scene.locator("canvas").evaluate((canvas) => canvas.dataset.frame !== undefined && Math.abs(Number(canvas.dataset.frame) - Number(canvas.dataset.targetFrame)) === 0), { timeout: 20000 }).toBe(true);
}

async function fingerprint(scene) {
  return scene.locator("canvas").evaluate((canvas) => {
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let hash = 0;
    for (let i = 0; i < pixels.length; i += 997) hash = (hash * 31 + pixels[i]) >>> 0;
    return hash;
  });
}

async function visibleLabels(scene) {
  return scene.locator("[data-component-label]").evaluateAll((labels) => labels.filter((label) => Number(getComputedStyle(label).opacity) > .5).length);
}

try {
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 900], [1024, 1366], [640, 360]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    for (const id of ["hush-headphones", "tide-watch"]) {
      const scene = page.locator(`#${id}`);
      await scene.scrollIntoViewIfNeeded();
      await expect(scene).toHaveAttribute("data-scrub-ready", "true", { timeout: 10000 });
      await expect(scene.locator("canvas")).toHaveCount(1);
      await expect(scene.locator("button")).toHaveCount(0);
      await seek(page, scene, .03);
      expect(await visibleLabels(scene)).toBe(0);
      const assembled = await fingerprint(scene);
      const initialFrame = await scene.locator("canvas").getAttribute("data-frame");
      await seek(page, scene, .42);
      expect(await fingerprint(scene)).not.toBe(assembled);
      expect(await visibleLabels(scene)).toBe(0);
      await seek(page, scene, .73);
      const partial = await visibleLabels(scene);
      expect(partial).toBeGreaterThan(0);
      expect(partial).toBeLessThan(6);
      await seek(page, scene, .99);
      expect(await visibleLabels(scene)).toBe(6);
      expect(Math.abs(await scene.evaluate((element) => element.getBoundingClientRect().top))).toBeLessThan(2);
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error(`Overflow at ${width}x${height}`);
      await page.screenshot({ path: `qa/catalog/${id}-scrub-${width}x${height}.png`, animations: "disabled", style: ".site-header,a[href='#main']{visibility:hidden!important}" });
      await seek(page, scene, .03);
      expect(await visibleLabels(scene)).toBe(0);
      expect(await scene.locator("canvas").getAttribute("data-frame")).toBe(initialFrame);
      expect(await fingerprint(scene)).toBe(assembled);
      console.log(`${id} ${width}x${height}: forward/reverse frames and sequential labels PASS`);
    }
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
  await page.goto(base);
  for (const id of ["hush-headphones", "tide-watch"]) {
    const scene = page.locator(`#${id}`);
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-scrub-ready", "static");
    await expect.poll(() => visibleLabels(scene)).toBe(6);
    expect(await scene.evaluate((element) => element.parentElement.classList.contains("pin-spacer"))).toBe(false);
  }
  await page.close();
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS: both pinned frame-sequence scenes scrub forward and backward; labels follow scroll; desktop, portrait tablet, phone and landscape; static reduced-motion fallback.");
} finally { await browser.close(); }
