import { readFile } from "node:fs/promises";
import path from "node:path";
import { resolveSiteUrl } from "../site-env.mjs";

const key = process.env.INDEXNOW_KEY ?? "yunmo-indexnow-key";
const sitemapPath = path.resolve("dist", "sitemap-index.xml");

const xml = await readFile(sitemapPath, "utf8");
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const detectedSite = resolveSiteUrl() ?? (urls[0] ? new URL(urls[0]).origin : undefined);

if (!detectedSite) {
  console.error("IndexNow submit failed: could not determine site URL. Set PUBLIC_SITE_URL or SITE_URL.");
  process.exit(1);
}

const keyLocation = `${detectedSite.replace(/\/$/, "")}/${key}.txt`;

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  body: JSON.stringify({
    host: new URL(detectedSite).hostname,
    key,
    keyLocation,
    urlList: urls
  })
});

if (!response.ok) {
  const body = await response.text();
  console.error(`IndexNow submit failed: ${response.status} ${body}`);
  process.exit(1);
}

console.log(`IndexNow submitted ${urls.length} URLs.`);
