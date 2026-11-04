import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const errors = [];
const handles = ["field-overshirt", "tide-watch", "arc-sunglasses", "pulse-earbuds", "cell-power-bank"];
await fs.mkdir("qa/catalog", { recursive: true });
try {
  for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1440, 1000], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    for (const audience of ["men", "women"]) {
      const link = page.locator(`[data-audience-edit="${audience}"]`);
      await expect(link).toHaveAttribute("href", `/shop/${audience}`);
      await link.scrollIntoViewIfNeeded();
      await expect.poll(() => link.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    for (const id of ["everyday-edits", "the-lookbook"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      for (const image of await section.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
      }
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Overflow at ${width}`);
      await section.screenshot({ path: `qa/catalog/${id}-${width}.png`, animations: "disabled", style: ".site-header,a[href='#main']{visibility:hidden!important}" });
    }
    for (const handle of handles) {
      const marker = page.locator(`[data-lookbook-hotspot="${handle}"]`);
      await marker.click();
      await expect(marker).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(`[data-lookbook-piece="${handle}"]`)).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(".lookbook-product-title")).toHaveAttribute("href", `/products/${handle}`);
      await expect.poll(() => page.locator(".lookbook-product-image img").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    const watchRow = page.locator('[data-lookbook-piece="tide-watch"]');
    await watchRow.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-lookbook-hotspot="tide-watch"]')).toHaveAttribute("aria-pressed", "true");
    if (width === 1440) {
      await page.locator(".lookbook-add").click();
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("fineverse:cart"))?.state.lines.length)).toBe(1);
      await expect(page.getByRole("dialog")).toBeVisible();
    }
    console.log(`PASS ${width}x${height}: editorial images, collection links, five synchronized hotspots and keyboard selection.`);
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
  await page.goto(base);
  const panelImage = page.locator(".lookbook-product-image img");
  await panelImage.scrollIntoViewIfNeeded();
  expect(await panelImage.evaluate((image) => getComputedStyle(image).animationName)).toBe("none");
  for (const route of ["/shop/men", "/shop/women"]) expect((await page.request.get(base + route)).ok()).toBe(true);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS: add-to-cart, audience routes, reduced motion; no browser errors.");
} finally { await browser.close(); }
