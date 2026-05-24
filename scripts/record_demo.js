/**
 * Walkthrough recorder for the CircuitOracle README.
 *
 * Records the landing page + a pre-baked sample analysis. Does NOT call
 * the live /api/analyze route — those calls are bounded by the Gemini
 * free-tier daily quota and can rate-limit mid-recording. The samples
 * pages render the same UI with cached analysis JSON, so the walkthrough
 * is authentic without needing live tokens.
 *
 * Run: node scripts/record_demo.js
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.resolve(__dirname, "..", "frames");
const URL = "https://circuitoracle.vercel.app/";
const SAMPLE_URL = "https://circuitoracle.vercel.app/samples/inverting-amp";
const WIDTH = 1280;
const HEIGHT = 800;
const CHROME =
  "/home/user/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: { dir: OUT_DIR, size: { width: WIDTH, height: HEIGHT } },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log("> landing");
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await wait(2500);

  console.log("> hero scroll");
  await page.evaluate(() => window.scrollBy({ top: 280, behavior: "smooth" }));
  await wait(1500);

  console.log("> scroll to sample archive");
  await page.evaluate(() => {
    const el = document.querySelector(
      "[aria-label='Sample analysis archive'], #sample-archive, [data-sample-archive]"
    );
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      window.scrollBy({ top: 600, behavior: "smooth" });
    }
  });
  await wait(2000);

  console.log("> navigate to sample");
  await page.goto(SAMPLE_URL, { waitUntil: "domcontentloaded" });
  await wait(2500);

  console.log("> slow scroll through sample content");
  // Smoothly scroll the analysis from top to bottom over ~12 seconds.
  const totalScrollMs = 12000;
  const steps = 40;
  for (let i = 0; i < steps; i++) {
    await page.evaluate((stepIdx) => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      // Easing: start fast, slow at the bottom
      const t = stepIdx / 40;
      const eased = 1 - Math.pow(1 - t, 2);
      window.scrollTo({ top: max * eased, behavior: "instant" });
    }, i);
    await wait(totalScrollMs / steps);
  }

  // Pause at the bottom briefly to let the reader catch up
  await wait(2000);

  // Scroll back to top
  await page.evaluate(() =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  await wait(2500);

  console.log("> closing");
  await context.close();
  await browser.close();

  const files = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".webm") && f !== "demo.webm");
  if (files.length) {
    const src = path.join(OUT_DIR, files[0]);
    const dst = path.join(OUT_DIR, "demo.webm");
    if (fs.existsSync(dst)) fs.unlinkSync(dst);
    fs.renameSync(src, dst);
    console.log("> saved:", dst);
  } else {
    console.error("> no video produced");
    process.exit(2);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
