const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  const height = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((h) => window.scrollTo(0, h), height);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "footer-waited.png" });
  await browser.close();
})();
