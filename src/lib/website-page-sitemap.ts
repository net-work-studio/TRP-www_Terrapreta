import type { MetadataRoute } from "next";
import { isRedirectSource, LEGACY_REDIRECTS } from "@/lib/redirects";
import { LIVE_WEBSITE_PAGE_IDS, WEBSITE_PAGES } from "@/lib/website-pages";
import type {
  JOURNAL_SITEMAP_QUERY_RESULT,
  PROJECTS_SITEMAP_QUERY_RESULT,
  REDIRECTS_QUERY_RESULT,
  SERVICES_SITEMAP_QUERY_RESULT,
  WEBSITE_PAGES_SITEMAP_QUERY_RESULT,
} from "@/sanity/types";

const SITEMAP_OPTIONS = {
  homePage: { changeFrequency: "daily", priority: 1 },
  contactPage: { changeFrequency: "monthly", priority: 0.8 },
  aboutPage: { changeFrequency: "monthly", priority: 0.8 },
  projectsIndexPage: { changeFrequency: "weekly", priority: 0.9 },
  journalIndexPage: { changeFrequency: "weekly", priority: 0.9 },
} as const;

export function getWebsitePagesSitemap(
  pages: WEBSITE_PAGES_SITEMAP_QUERY_RESULT,
  baseUrl: string,
  redirects: REDIRECTS_QUERY_RESULT = []
): MetadataRoute.Sitemap {
  const site = pages.find((page) => page._id === "site");

  return LIVE_WEBSITE_PAGE_IDS.flatMap((id) => {
    const page = pages.find((entry) => entry._id === id);
    if (id === "aboutPage" && !page) {
      return [];
    }
    const { path } = WEBSITE_PAGES[id];
    if (
      !isSitemapPage(
        path,
        page?.seo,
        site?.seo?.robotsIndex,
        baseUrl,
        redirects
      )
    ) {
      return [];
    }

    return [
      {
        url: new URL(path, baseUrl).toString(),
        ...(page?._updatedAt && {
          lastModified: new Date(page._updatedAt),
        }),
        ...SITEMAP_OPTIONS[id],
      } satisfies MetadataRoute.Sitemap[number],
    ];
  });
}

function isSitemapPage(
  path: string,
  seo: WEBSITE_PAGES_SITEMAP_QUERY_RESULT[number]["seo"] | undefined,
  defaultIndex: string | null | undefined,
  baseUrl: string,
  redirects: REDIRECTS_QUERY_RESULT
): boolean {
  if ((seo?.robotsIndex ?? defaultIndex) === "noindex") {
    return false;
  }
  const url = new URL(path, baseUrl).toString();
  if (
    seo?.canonicalUrl &&
    new URL(seo.canonicalUrl, baseUrl).toString() !== url
  ) {
    return false;
  }
  return !isRedirectSource(path, [
    ...LEGACY_REDIRECTS.map(({ source }) => source),
    ...redirects.flatMap(({ source, destination }) =>
      source && destination ? [source] : []
    ),
  ]);
}

export function getContentSitemap({
  pages,
  projects,
  journal,
  services,
  redirects,
  baseUrl,
}: {
  pages: WEBSITE_PAGES_SITEMAP_QUERY_RESULT;
  projects: PROJECTS_SITEMAP_QUERY_RESULT;
  journal: JOURNAL_SITEMAP_QUERY_RESULT;
  services: SERVICES_SITEMAP_QUERY_RESULT;
  redirects: REDIRECTS_QUERY_RESULT;
  baseUrl: string;
}): MetadataRoute.Sitemap {
  const defaultIndex = pages.find(({ _id }) => _id === "site")?.seo
    ?.robotsIndex;
  const staticPages: MetadataRoute.Sitemap = [
    { url: "/services", changeFrequency: "weekly", priority: 0.9 },
    { url: "/impressum", changeFrequency: "yearly", priority: 0.3 },
  ];
  return [
    ...getWebsitePagesSitemap(pages, baseUrl, redirects),
    ...staticPages.flatMap((page) =>
      isSitemapPage(page.url, undefined, defaultIndex, baseUrl, redirects)
        ? [{ ...page, url: new URL(page.url, baseUrl).toString() }]
        : []
    ),
    ...(
      [
        ["projects", projects, "monthly", 0.7],
        ["journal", journal, "weekly", 0.8],
        ["services", services, "monthly", 0.7],
      ] as const
    ).flatMap(([collection, entries, changeFrequency, priority]) =>
      entries.flatMap((entry) => {
        if (!entry.slug) {
          return [];
        }
        const path = `/${collection}/${entry.slug}`;
        return isSitemapPage(path, entry.seo, defaultIndex, baseUrl, redirects)
          ? [
              {
                url: new URL(path, baseUrl).toString(),
                lastModified: new Date(entry._updatedAt),
                changeFrequency,
                priority,
              },
            ]
          : [];
      })
    ),
  ];
}
