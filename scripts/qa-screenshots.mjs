// Visual QA: screenshots at 390 px and 1440 px for the current phase.
//
//   npm run dev            (in another terminal; defaults to port 3000)
//   npm run qa -- --phase=1 --base=http://localhost:3000
//
// Writes PNGs to qa/screenshots/phase-<n>/ and any browser console errors to
// qa/screenshots/phase-<n>/console.txt.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const arg = (name, fallback) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const phase = arg("phase", "1");
const base = arg("base", "http://localhost:3000");
const out = `qa/screenshots/phase-${phase}`;
mkdirSync(out, { recursive: true });

const viewports = [
  { name: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "1440", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
];

const errors = [];

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 300));
  });
}

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext(vp);
  const page = await context.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`[${vp.name}] ${page.url()} ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${vp.name}] ${page.url()} ${e.message}`));
  const shot = (name, opts = {}) => page.screenshot({ path: `${out}/${vp.name}-${name}.png`, ...opts });

  // Home: hero scrubbed to 0, 0.3, 0.6 and 1.0 of its pinned scroll
  await page.goto(`${base}/`);
  await settle(page);
  await shot("home-hero");
  for (const p of [0, 0.3, 0.6, 1]) {
    await page.evaluate((progress) => {
      const hero = document.querySelector(".hero");
      const spacer = hero?.parentElement?.classList.contains("pin-spacer") ? hero.parentElement : null;
      const distance = spacer ? spacer.offsetHeight - hero.offsetHeight : 0;
      window.scrollTo(0, Math.round(distance * progress));
    }, p);
    await page.waitForTimeout(1600); // scrub smoothing + Lenis
    await shot(`hero-${String(p).replace(".", "")}`);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await shot("home-full", { fullPage: true });
  await scrollToBottom(page);
  await settle(page);
  await page.locator("footer").screenshot({ path: `${out}/${vp.name}-footer.png` });

  // Nav state after the hero: solid bar after scrolling back up a little
  await page.evaluate(() => window.scrollBy(0, -200));
  await page.waitForTimeout(500);
  await shot("nav-after-hero");

  // Menus
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  if (vp.isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(500);
    await shot("mobile-menu");
    await page.getByRole("button", { name: "Electronics" }).click();
    await page.waitForTimeout(300);
    await shot("mobile-menu-electronics");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  } else {
    await page.getByRole("link", { name: "Electronics", exact: true }).first().hover();
    await page.waitForTimeout(500);
    await shot("mega-menu");
    await page.mouse.move(700, 600);
    await page.waitForTimeout(400);
  }

  // Style guide (dev only)
  await page.goto(`${base}/styleguide`);
  await settle(page);
  await shot("styleguide", { fullPage: true });

  await context.close();
}

// Reduced motion: the home page must still look designed.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${base}/`);
  await settle(page);
  await page.screenshot({ path: `${out}/1440-reduced-motion-hero.png` });
  await context.close();
}

await browser.close();
writeFileSync(`${out}/console.txt`, errors.join("\n") || "No console errors.");
console.log(`Screenshots in ${out}/ (${errors.length} console errors)`);
