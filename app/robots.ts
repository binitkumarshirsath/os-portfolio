import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/config/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    // The API routes cost model tokens; crawlers have no reason to call them.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
