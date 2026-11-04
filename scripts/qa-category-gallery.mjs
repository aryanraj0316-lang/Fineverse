import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
await fs.mkdir("qa/catalog", { recursive: true });
try {
  for (const width of [360, 390, 768, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
    await page.goto(`${base}/#collections`);
    const section = page.locator("#collections");
    await section.scrollIntoViewIfNeeded();
    const cards = section.locator("[data-category-link]");
    await expect(cards).toHaveCount(6);
    for (const category of ["electronics", "clothing", "wearables", "bags", "footwear", "home"]) {
      await expect(section.locator(`[data-category-link="${category}"]`)).toHaveAttribute("href", `/shop/${category}`);
    }
    await expect.poll(() => section.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error(`Horizontal overflow at ${width}px`);
    const columns = await section.locator("ul").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length);
    if (columns !== (width >= 1088 ? 3 : 2)) throw new Error(`Wrong grid at ${width}px: ${columns}`);
    await expect.poll(() => section.locator("li").evaluateAll((items) => items.every((item) => !item.getAnimations().some((animation) => animation.playState === "running")))).toBe(true);
    await section.screenshot({ path: `qa/catalog/categories-${width}.png`, animations: "disabled" });
    await cards.first().focus();
    await expect(cards.first()).toBeFocused();
    if (width === 1440) {
      const before = await cards.first().boundingBox();
      await cards.first().hover();
      const after = await cards.first().boundingBox();
      if (Math.abs(before.width - after.width) > 1 || Math.abs(before.height - after.height) > 1) throw new Error("Hover changes card layout");
      await cards.first().press("Enter");
      await expect(page).toHaveURL(/\/shop\/electronics/);
      await expect(page.getByRole("heading", { name: "Electronics", exact: true })).toBeVisible();
    }
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
  await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
  await page.goto(`${base}/#collections`);
  await page.locator("#collections").scrollIntoViewIfNeeded();
  const active = await page.locator("#collections li").evaluateAll((items) => items.flatMap((item) => item.getAnimations()).filter((animation) => animation.playState === "running").length);
  if (active) throw new Error("Entrance animations run with reduced motion");
  await page.close();
  console.log("PASS: six category links and images, five responsive widths, no overflow, stable hover layout, keyboard navigation, reduced motion.");
} finally { await browser.close(); }
