import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { resolveSiteUrl } from "./site-env.mjs";

const site = resolveSiteUrl();

export default defineConfig({
  site,
  integrations: [sitemap()],
  compressHTML: true,
  vite: {
    build: {
      minify: "esbuild"
    }
  }
});
