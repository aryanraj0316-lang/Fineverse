const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

  await page.goto("http://localhost:3001", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // scroll incrementally via wheel until the "Our Story" heading is in viewport
  let found = false;
  for (let i = 0; i < 30; i++) {
    const box = await page.evaluate(() => {
      const el = [...document.querySelectorAll("h2")].find((h) =>
        h.textContent?.includes("Our Story")
      );
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, vh: window.innerHeight };
    });
    if (box && box.top < box.vh * 0.5 && box.top > -200) {
      found = true;
      break;
    }
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(150);
  }
  console.log("found heading in view:", found);

  await page.waitForTimeout(500);
  await page.screenshot({ path: "story-1.png" });
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(600);
  await page.screenshot({ path: "story-2.png" });

  console.log("ERRORS:", JSON.stringify(errors, null, 2));
  await browser.close();
})();
