import type { MetadataRoute } from "next";
import { ROUTES } from "@/shared/config/routes";
import { getSiteUrl } from "@/shared/config/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  return [
    { url: site.toString(), changeFrequency: "monthly", priority: 1 },
    {
      url: new URL(ROUTES.agentArchitecture, site).toString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
