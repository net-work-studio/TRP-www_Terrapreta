import type { MetadataRoute } from "next";
import { SITE_DEFAULTS } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_DEFAULTS.baseUrl}/sitemap.xml`,
  };
}
