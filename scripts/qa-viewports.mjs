// Cross-viewport screenshots of the key pages at the six required widths.
//
//   npm run build && npm run start            (or npm run dev)
//   npm run qa:viewports -- --base=http://localhost:3000
//
// Writes to qa/screenshots/viewports/<width>-<page>.png
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = "qa/screenshots/viewports";
mkdirSync(out, { recursive: true });

const widths = [
  { w: 360, h: 780, mobile: true },
  { w: 390, h: 844, mobile: true },
  { w: 768, h: 1024, mobile: true },
  { w: 1024, h: 768, mobile: false },
  { w: 1440, h: 900, mobile: false },
  { w: 1920, h: 1080, mobile: false },
];
const pages = [
  ["home", "/"],
  ["shop", "/shop/clothing"],
  ["product", "/products/tide-watch"],
  ["kit", "/kit"],
  ["checkout", "/checkout"],
  ["404", "/missing-page"],
];

const browser = await chromium.launch();
for (const v of widths) {
  const context = await browser.newContext({
    viewport: { width: v.w, height: v.h },
    isMobile: v.mobile,
    hasTouch: v.mobile,
    deviceScaleFactor: v.mobile ? 2 : 1,
  });
  await context.addInitScript(() => sessionStorage.setItem("fineverse:intro-seen", "1"));
  const page = await context.newPage();
  for (const [name, path] of pages) {
    await page.goto(base + path);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${v.w}-${name}.png` });
  }
  // The hero at the end of its scroll (products landed, wordmark in the nav)
  await page.goto(base + "/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const spacer = hero?.parentElement;
    if (hero && spacer?.classList.contains("pin-spacer")) window.scrollTo(0, spacer.offsetHeight - hero.offsetHeight);
  });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/${v.w}-home-landed.png` });
  await context.close();
}
await browser.close();
console.log(`Screenshots in ${out}/`);
