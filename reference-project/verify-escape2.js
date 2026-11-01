const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // find the explore-escape section by text and scroll it into view directly (bypasses Lenis/scroll simulation issues)
  const el = await page.locator("text=Explore the Unseen").first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "escape-section2.png" });

  await browser.close();
})();
