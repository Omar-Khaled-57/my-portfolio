// Flameo-Plan PWA-A — capture install-dialog screenshots for the manifest.
// Usage: CHROME_PATH=... node scripts/generate-screenshots.mjs
// Requires a preview server on the URL passed (default http://localhost:4173/).
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "screenshots");
const URL = process.env.URL || "http://localhost:4173/";

const targets = [
  { name: "desktop.png", width: 1280, height: 720, deviceScaleFactor: 1 },
  { name: "mobile.png", width: 412, height: 896, deviceScaleFactor: 1 },
];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const target of targets) {
    const page = await browser.newPage();
    await page.setViewport({
      width: target.width,
      height: target.height,
      deviceScaleFactor: target.deviceScaleFactor,
    });
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait for the loader overlay to be removed and below-fold content to settle.
    await page.waitForFunction(
      () => document.querySelector(".loader-overlay") === null,
      { timeout: 30000, polling: 500 },
    );
    await new Promise((r) => setTimeout(r, 1500));

    const file = join(OUT_DIR, target.name);
    await page.screenshot({ path: file, type: "png" });
    console.log(`wrote ${file} (${target.width}x${target.height})`);
    await page.close();
  }
} finally {
  await browser.close();
}