const trimSlash = (value) => value.replace(/\/+$/, "");

export function normalizeSiteUrl(value) {
  if (!value || typeof value !== "string") return undefined;
  const candidate = value.trim();
  if (!candidate) return undefined;
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;

  try {
    return trimSlash(new URL(withProtocol).toString());
  } catch {
    return undefined;
  }
}

export function resolveSiteUrl(env = process.env) {
  return normalizeSiteUrl(
    env.PUBLIC_SITE_URL ??
    env.SITE_URL ??
    env.VERCEL_PROJECT_PRODUCTION_URL ??
    env.VERCEL_URL ??
    env.DEPLOY_PRIME_URL ??
    env.DEPLOY_URL ??
    env.CF_PAGES_URL ??
    env.URL ??
    ""
  );
}

export function hasResolvedSiteUrl(env = process.env) {
  return Boolean(resolveSiteUrl(env));
}
