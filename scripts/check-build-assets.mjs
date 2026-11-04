import { execFileSync } from "node:child_process";
execFileSync(process.execPath, ["scripts/sync-product-images.mjs", "--check"], { stdio: "inherit" });
execFileSync(process.execPath, ["scripts/check-breakdown-frames.mjs"], { stdio: "inherit" });
