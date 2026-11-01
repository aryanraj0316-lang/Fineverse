const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  // scroll to explore-escape section (right after hero, hero is pinned 180% so scroll a good amount)
  await page.mouse.move(800, 450);
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "escape-section.png", fullPage: false });

  console.log("ERRORS:", JSON.stringify(errors, null, 2));
  await browser.close();
})();
