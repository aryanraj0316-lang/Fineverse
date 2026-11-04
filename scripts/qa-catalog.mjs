import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.QA_BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400 && (response.url().includes("/products/") || response.url().includes("/_next/image"))) errors.push(`${response.status()} ${response.url()}`);
});
await page.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
await fs.mkdir("qa/catalog", { recursive: true });
try {
  await page.goto(`${base}/shop`);
  await expect(page.locator("[data-product-card]")).toHaveCount(42);
  for (const category of ["Electronics", "Clothing", "Wearables", "Bags", "Footwear", "Home"]) {
    await expect(page.getByRole("group", { name: "Category", exact: true }).getByRole("button", { name: category, exact: true })).toBeVisible();
  }
  for (const [category, count, subtype, filteredCount] of [["bags", 5, "Backpacks", 1], ["footwear", 5, "Sneakers", 1], ["home", 5, "Lighting", 1], ["electronics", 9, "Chargers", 2], ["clothing", 9, "Knitwear", 2], ["wearables", 9, "Watch straps", 1]]) {
    await page.goto(`${base}/shop/${category}`);
    await expect(page.locator("[data-product-card]")).toHaveCount(count);
    await page.getByRole("button", { name: subtype, exact: true }).click();
    await expect(page.locator("[data-product-card]")).toHaveCount(filteredCount);
    await page.reload();
    await expect(page.locator("[data-product-card]")).toHaveCount(filteredCount);
  }
  for (const [audience, included, excluded] of [["men", "Everyday Polo", "Rib Cardigan"], ["women", "Rib Cardigan", "Everyday Polo"]]) {
    await page.goto(`${base}/shop/${audience}`);
    await expect(page.getByRole("heading", { name: audience === "men" ? "Men" : "Women", exact: true })).toBeVisible();
    await expect(page.locator("[data-product-card]")).toHaveCount(audience === "men" ? 25 : 20);
    await expect(page.locator("[data-product-card]").first()).toContainText(included);
    await expect(page.locator("[data-product-card]").filter({ hasText: included })).toHaveCount(1);
    await expect(page.locator("[data-product-card]").filter({ hasText: excluded })).toHaveCount(0);
    await page.getByRole("group", { name: "Category", exact: true }).getByRole("button", { name: "Clothing", exact: true }).click();
    await expect(page.locator("[data-product-card]")).toHaveCount(audience === "men" ? 8 : 3);
  }
  // Exercise real client navigation, including cached pages and their old filters.
  for (const audience of ["men", "women", "men"]) {
    await page.getByRole("navigation", { name: "Main", exact: true }).getByRole("link", { name: audience === "men" ? "Men" : "Women", exact: true }).click();
    await expect(page.getByRole("heading", { name: audience === "men" ? "Men" : "Women", exact: true })).toBeVisible();
    await expect(page.locator("[data-product-card]:visible")).toHaveCount(audience === "men" ? 25 : 20);
    await expect(page.locator("[data-product-card]:visible").first()).toContainText(audience === "men" ? "Everyday Polo" : "Rib Cardigan");
    await page.getByRole("group", { name: "Category", exact: true }).getByRole("button", { name: "Clothing", exact: true }).click();
    await expect(page.locator("[data-product-card]:visible")).toHaveCount(audience === "men" ? 8 : 3);
  }
  await page.goto(`${base}/products/pulse-earbuds`);
  const slider = page.getByRole("slider", { name: "Rotate Pulse Earbuds", exact: true });
  await expect(slider).toHaveAttribute("tabindex", "0");
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "1");
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "2");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowLeft");
  await expect(slider).toHaveAttribute("aria-valuenow", "7");
  await page.keyboard.press("Home");
  const box = await slider.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 96, box.y + box.height / 2);
  await page.mouse.up();
  await expect(slider).toHaveAttribute("aria-valuenow", "3");
  await expect(page.getByRole("button", { name: "Play rotation", exact: true })).toHaveCount(0);
  await expect(page.getByRole("slider", { name: "Product viewing angle", exact: true })).toHaveCount(0);
  await expect(page.getByText(/AI-generated concept/)).toHaveCount(0);
  await page.getByRole("radio", { name: "Basalt", exact: true }).click();
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByAltText("Pulse Earbuds in Basalt, 0 degree view")).toHaveAttribute("src", /basalt\/0.webp/);
  await page.screenshot({ path: "qa/catalog/desktop-spin.png" });
  await page.getByRole("button", { name: "Photos", exact: true }).click();
  await expect(slider).toHaveCount(0);
  await page.getByRole("button", { name: "360° view", exact: true }).click();
  await expect(slider).toBeVisible();

  await page.goto(`${base}/products/pace-sneaker`);
  await page.getByRole("radiogroup", { name: "Size", exact: true }).getByRole("radio", { name: "UK 8", exact: true }).click();
  await page.getByRole("button", { name: "Add to cart", exact: true }).first().click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("fineverse:cart") ?? "{}").state?.lines?.length ?? 0)).toBe(1);
  await page.goto(`${base}/cart`);
  await expect(page.getByRole("link", { name: "Pace Sneaker", exact: true }).first()).toBeVisible();
  await expect(page.getByText("Chalk / UK 8", { exact: true }).first()).toBeVisible();

  for (const width of [390, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/products/ritual-mug`);
    await expect(page.getByRole("slider", { name: "Rotate Ritual Mug", exact: true })).toHaveAttribute("tabindex", "0");
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error(`Horizontal overflow at ${width}px`);
    await page.screenshot({ path: `qa/catalog/${width}-spin.png` });
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Menu", exact: true });
  await menu.getByRole("button", { name: "Home", exact: true }).click();
  await menu.getByRole("link", { name: "Lighting", exact: true }).click();
  await expect(page).toHaveURL(/\/shop\/home\?type=lighting/, { timeout: 20000 });
  await expect(page.locator("[data-product-card]:visible")).toHaveCount(1);
  await page.goto(base);
  await expect(page.locator(".category-index [data-category-link]")).toHaveCount(6);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS: 42 products; all six categories and filters; Men/Women edits; persistent URLs; drag and keyboard rotation; removed viewer controls and caption; colour changes; footwear cart; responsive layouts and mobile menu.");
} finally { await browser.close(); }
