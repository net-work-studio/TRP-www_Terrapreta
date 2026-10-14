import type { MetadataRoute } from "next";
import { LIVE_WEBSITE_PAGE_IDS, WEBSITE_PAGES } from "@/lib/website-pages";
import type { WEBSITE_PAGES_SITEMAP_QUERY_RESULT } from "@/sanity/types";

const SITEMAP_OPTIONS = {
  homePage: { changeFrequency: "daily", priority: 1 },
  contactPage: { changeFrequency: "monthly", priority: 0.8 },
  projectsIndexPage: { changeFrequency: "weekly", priority: 0.9 },
  journalIndexPage: { changeFrequency: "weekly", priority: 0.9 },
} as const;

export function getWebsitePagesSitemap(
  pages: WEBSITE_PAGES_SITEMAP_QUERY_RESULT,
  baseUrl: string
): MetadataRoute.Sitemap {
  const site = pages.find((page) => page._id === "site");

  return LIVE_WEBSITE_PAGE_IDS.flatMap((id) => {
    const page = pages.find((entry) => entry._id === id);
    const indexing = page?.seo?.robotsIndex ?? site?.seo?.robotsIndex;
    if (indexing === "noindex") {
      return [];
    }

    return [
      {
        url: new URL(WEBSITE_PAGES[id].path, baseUrl).toString(),
        ...(page?._updatedAt && {
          lastModified: new Date(page._updatedAt),
        }),
        ...SITEMAP_OPTIONS[id],
      } satisfies MetadataRoute.Sitemap[number],
    ];
  });
}
