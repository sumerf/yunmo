import { siteConfig } from "../config/site";

export const DEFAULT_SITE_FALLBACK = "https://example.com";

export const getSiteBase = (site?: URL | string | null) =>
  (site ?? siteConfig.site) || DEFAULT_SITE_FALLBACK;

export const toAbsoluteUrl = (value: string, site?: URL | string | null) =>
  new URL(value, getSiteBase(site)).toString();
