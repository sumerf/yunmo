import { siteConfig } from "../config/site";

const normalizeSite = (value?: string | URL | null) => {
  if (!value) return undefined;
  try {
    const href = typeof value === "string" ? value : value.toString();
    return new URL(href).toString().replace(/\/+$/, "");
  } catch {
    return undefined;
  }
};

export function GET({ site }: { site?: URL }) {
  const resolvedSite = normalizeSite(site) ?? normalizeSite(siteConfig.site);
  const sitemapLine = resolvedSite ? `Sitemap: ${resolvedSite}/sitemap-index.xml\n` : "";

  return new Response(`User-agent: *\nAllow: /\n\n${sitemapLine}`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
