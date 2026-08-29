#!/usr/bin/env node
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const queue = [
    path.join(homedir(), ".cache", "puppeteer"),
    path.join(homedir(), ".cache", "ms-playwright"),
  ];
  const scanned = new Set();
  while (queue.length > 0) {
    const dir = queue.shift();
    if (!dir || scanned.has(dir) || !existsSync(dir)) continue;
    scanned.add(dir);
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const candidate = path.join(dir, entry.name);
      if (!entry.isDirectory()) continue;
      if (existsSync(path.join(candidate, "chrome"))) return path.join(candidate, "chrome");
      if (existsSync(path.join(candidate, "headless_shell"))) return path.join(candidate, "headless_shell");
      queue.push(candidate);
    }
  }
  return null;
}

const argv = process.argv.slice(2);
const urlArg = argv.find((a) => a.startsWith("http"));
const getArg = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : fallback;
};

if (!urlArg) {
  console.error("Usage: perf-audit <url> [--runs N] [--preset mobile|desktop] [--max-spread N]");
  process.exit(1);
}

const RUNS = parseInt(getArg("--runs", "5"), 10);
const PRESET = getArg("--preset", "mobile");
const MAX_SPREAD = parseInt(getArg("--max-spread", "3"), 10);

const METRICS = ["score", "FCP", "LCP", "TBT", "CLS", "SI"];

async function runOnce(url, port) {
  const result = await lighthouse(url, {
    port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance"],
    preset: PRESET,
  });
  const audits = result.lhr.audits;
  return {
    score: Math.round((result.lhr.categories.performance.score || 0) * 100),
    FCP: Math.round((audits["first-contentful-paint"]?.numericValue || 0) / 10) / 100,
    LCP: Math.round((audits["largest-contentful-paint"]?.numericValue || 0) / 10) / 100,
    TBT: Math.round((audits["total-blocking-time"]?.numericValue || 0) / 10) / 100,
    CLS: Math.round((audits["cumulative-layout-shift"]?.numericValue || 0) * 1000) / 1000,
    SI: Math.round((audits["speed-index"]?.numericValue || 0) / 10) / 100,
  };
}

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

const results = [];
const chromePath = findChrome();
const chrome = await launch({
  chromePath,
  chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`run ${i + 1}/${RUNS}... `);
    const r = await runOnce(urlArg, chrome.port);
    results.push(r);
    console.log(`score=${r.score} FCP=${r.FCP}s LCP=${r.LCP}s TBT=${r.TBT}s CLS=${r.CLS} SI=${r.SI}s`);
  }
} finally {
  await chrome.kill();
}

const pad = (s, n) => String(s).padStart(n);
const line = (rows) => rows.map((c) => c).join("  ");

console.log(`\n${PRESET} preset, ${RUNS} runs on ${urlArg}`);
console.log(line(["metric", pad("min", 8), pad("median", 8), pad("max", 8), pad("spread", 8)]));
const spreadByMetric = {};
for (const m of METRICS) {
  const values = results.map((r) => r[m]);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const med = median(values);
  const spread = high - low;
  spreadByMetric[m] = spread;
  const unit = m === "score" ? "" : m === "CLS" ? "" : "s";
  console.log(
    line([pad(m, 8), pad(`${low}${unit}`, 8), pad(`${med}${unit}`, 8), pad(`${high}${unit}`, 8), pad(spread.toFixed(2), 8)])
  );
}

const scoreSpread = spreadByMetric.score;
const pass = scoreSpread <= MAX_SPREAD;
console.log(`\nScore spread: ${scoreSpread} point(s) — ${pass ? "PASS" : "FAIL"} (max allowed ${MAX_SPREAD})`);
process.exit(pass ? 0 : 1);