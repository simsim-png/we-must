import { copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Config } from "@react-router/dev/config";
import { SITE_URL } from "./app/lib/constants";
import { allPaths } from "./app/lib/paths";

export default {
  // Static site: every route is prerendered to HTML at build time.
  ssr: false,
  prerender: () => allPaths(),
  async buildEnd({ reactRouterConfig }) {
    const urls = allPaths()
      .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    const client = join(reactRouterConfig.buildDirectory, "client");
    await writeFile(join(client, "sitemap.xml"), xml);
    // Static hosts (Vercel) serve 404.html with a 404 status; the app then renders its 404 route.
    await copyFile(join(client, "__spa-fallback.html"), join(client, "404.html"));
  },
} satisfies Config;
