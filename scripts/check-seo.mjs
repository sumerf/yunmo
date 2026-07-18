import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { hasResolvedSiteUrl } from "../site-env.mjs";

const distDir = path.resolve("dist");
const requiredFiles = [
  path.join(distDir, "index.html"),
  path.join(distDir, "robots.txt")
];

if (hasResolvedSiteUrl()) {
  requiredFiles.push(path.join(distDir, "sitemap-index.xml"));
}

for (const file of requiredFiles) {
  await access(file).catch(() => {
    console.error(`Missing required build artifact: ${file}`);
    process.exit(1);
  });
}

const html = await readFile(path.join(distDir, "index.html"), "utf8");
const checks = [
  ["title", /<title>.+<\/title>/i],
  ["description", /<meta name="description" content="[^"]+"/i],
  ["canonical", /<link[^>]+rel="canonical"[^>]+href="[^"]+"/i],
  ["open graph", /<meta property="og:title" content="[^"]+"/i],
  ["json-ld", /<script[^>]+type="application\/ld\+json"[^>]*>/i]
];

const failures = checks.filter(([, pattern]) => !pattern.test(html)).map(([label]) => label);

if (failures.length) {
  console.error(`SEO check failed: missing ${failures.join(", ")}.`);
  process.exit(1);
}

console.log("SEO base check passed.");
