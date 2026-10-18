/**
 * The site's public origin, for absolute URLs (Open Graph images, sitemap).
 * SITE_URL wins; on Vercel the production domain is provided automatically;
 * locally it falls back to the dev server. Server-side only (reads env).
 */
export function getSiteUrl(): URL {
  const explicit = process.env.SITE_URL;
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (explicit) return new URL(explicit);
  if (vercelDomain) return new URL(`https://${vercelDomain}`);
  return new URL("http://localhost:3000");
}
