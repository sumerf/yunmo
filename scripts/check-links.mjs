import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { resolveSiteUrl } from "../site-env.mjs";

const distDir = path.resolve("dist");
const checked = new Map();
const REQUEST_TIMEOUT_MS = 12000;
const CONCURRENCY = 4;
const SKIP_HOSTS = new Set([
  "sns.qzone.qq.com",
  "service.weibo.com"
]);

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(fullPath);
      return entry.name.endsWith(".html") ? [fullPath] : [];
    })
  );
  return files.flat();
}

function extractLinks(html) {
  return [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((match) => match[1]);
}

function detectSiteOrigin(htmlContents) {
  const configured = resolveSiteUrl();
  if (configured) return configured;

  for (const html of htmlContents) {
    const match = html.match(/<link[^>]+rel="canonical"[^>]+href="(https?:\/\/[^"]+)"/i);
    if (match) {
      try {
        return new URL(match[1]).origin;
      } catch {
        // Ignore invalid canonical values and continue.
      }
    }
  }

  return undefined;
}

async function localPathExists(url) {
  const parsed = new URL(url);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === "/404/" || pathname === "/404") {
    pathname = "/404.html";
  }
  if (pathname.endsWith("/")) {
    pathname = `${pathname}index.html`;
  } else if (!path.extname(pathname)) {
    pathname = `${pathname}/index.html`;
  }
  const localFile = path.join(distDir, pathname);
  return readFile(localFile, "utf8")
    .then(() => true)
    .catch(() => false);
}

async function checkUrl(url) {
  if (checked.has(url)) return checked.get(url);
  const parsed = new URL(url);

  if (SKIP_HOSTS.has(parsed.hostname)) {
    const result = { ok: true, status: "skipped" };
    checked.set(url, result);
    return result;
  }

  if (siteOrigin && parsed.origin === siteOrigin) {
    const exists = await localPathExists(url);
    const result = { ok: exists, status: exists ? "local" : "missing-local-file" };
    checked.set(url, result);
    return result;
  }

  const fetchWithTimeout = async (resource, options) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      return await fetch(resource, {
        ...options,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
  };

  const result = await fetchWithTimeout(url, { method: "HEAD", redirect: "follow" })
    .then((response) => ({ ok: response.ok, status: response.status }))
    .catch(async () => {
      const response = await fetchWithTimeout(url, { method: "GET", redirect: "follow" });
      return { ok: response.ok, status: response.status };
    })
    .catch((error) => ({ ok: false, status: error.name === "AbortError" ? "timeout" : error.message }));

  checked.set(url, result);
  return result;
}

const htmlFiles = await collectHtmlFiles(distDir);
const htmlContents = await Promise.all(htmlFiles.map((file) => readFile(file, "utf8")));
const siteOrigin = detectSiteOrigin(htmlContents);
const urls = [...new Set(htmlContents.flatMap(extractLinks))];
const failures = [];

for (let index = 0; index < urls.length; index += CONCURRENCY) {
  const batch = urls.slice(index, index + CONCURRENCY);
  const results = await Promise.all(
    batch.map(async (url) => ({
      url,
      result: await checkUrl(url)
    }))
  );

  for (const { url, result } of results) {
    if (!result.ok) failures.push({ url, status: result.status });
  }
}

if (failures.length) {
  console.error("External link check failed:");
  failures.forEach((item) => console.error(`- ${item.url} (${item.status})`));
  process.exitCode = 1;
} else {
  console.log(`External link check passed for ${urls.length} links.`);
}
