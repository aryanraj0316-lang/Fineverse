// Lighthouse (mobile defaults) through Playwright's Chromium, against a
// production build. Writes JSON + HTML reports to qa/lighthouse/.
//
//   npm i -D lighthouse          (once; not installed by default, it's large)
//   npm run build && npm run start
//   npm run lighthouse -- --base=http://localhost:3000 / /shop /products/tide-watch
//
// Run it twice: the first visit to each image triggers on-demand resizing,
// which a real host would already have cached.
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

let lighthouse;
try {
  ({ default: lighthouse } = await import("lighthouse"));
} catch {
  console.error("Lighthouse isn't installed. Run: npm i -D lighthouse");
  process.exit(1);
}

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3000";
const out = args.find((a) => a.startsWith("--out="))?.split("=")[1] ?? "qa/lighthouse";
const paths = args.filter((a) => !a.startsWith("--"));
if (paths.length === 0) paths.push("/", "/shop", "/products/tide-watch", "/kit");
mkdirSync(out, { recursive: true });

const port = 9333;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
for (const path of paths) {
  const result = await lighthouse(base + path, { port, output: ["json", "html"], logLevel: "error" });
  const name = path === "/" ? "home" : path.replace(/^\//, "").replace(/[/?=&]/g, "-");
  writeFileSync(`${out}/${name}.report.json`, result.report[0]);
  writeFileSync(`${out}/${name}.report.html`, result.report[1]);

  const { categories, audits: a } = result.lhr;
  console.log(`\n${path}: ${Object.values(categories).map((c) => `${c.title} ${Math.round(c.score * 100)}`).join(" | ")}`);
  console.log(
    `  LCP ${a["largest-contentful-paint"].displayValue} · CLS ${a["cumulative-layout-shift"].displayValue} · ` +
      `TBT ${a["total-blocking-time"].displayValue} · FCP ${a["first-contentful-paint"].displayValue}`,
  );
  for (const [id, audit] of Object.entries(a)) {
    if (audit.score !== null && audit.score < 0.9 && !["informative", "notApplicable", "manual"].includes(audit.scoreDisplayMode)) {
      console.log(`  - ${id} (${audit.score}) ${audit.displayValue ?? ""}`);
    }
  }
}
await browser.close();
