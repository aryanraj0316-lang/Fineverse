const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "footer-real.png" });
  await browser.close();
})();
