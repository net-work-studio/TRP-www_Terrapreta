import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { SITE_DEFAULTS } from "@/lib/constants";
import { getDeployedSitemapRedirects } from "@/lib/redirects";
import { getContentSitemap } from "@/lib/website-page-sitemap";
import { LIVE_WEBSITE_PAGE_IDS } from "@/lib/website-pages";
import { sanityFetch } from "@/sanity/lib/live";
import {
  JOURNAL_SITEMAP_QUERY,
  PROJECTS_SITEMAP_QUERY,
  SERVICES_SITEMAP_QUERY,
  WEBSITE_PAGES_SITEMAP_QUERY,
} from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  const { baseUrl } = SITE_DEFAULTS;

  // Perspective is intentionally hardcoded to "published": a sitemap must only
  // expose live URLs, and resolving request state here would read
  // cookies() and force the sitemap to render dynamically. Do not "fix" this to
  // use a dynamic perspective.
  const [
    { data: projects },
    { data: journal },
    { data: services },
    { data: websitePages },
  ] = await Promise.all([
    sanityFetch({
      stega: false,
      query: PROJECTS_SITEMAP_QUERY,
      perspective: "published",
    }),
    sanityFetch({
      stega: false,
      query: JOURNAL_SITEMAP_QUERY,
      perspective: "published",
    }),
    sanityFetch({
      stega: false,
      query: SERVICES_SITEMAP_QUERY,
      perspective: "published",
    }),
    sanityFetch({
      stega: false,
      query: WEBSITE_PAGES_SITEMAP_QUERY,
      params: { ids: ["site", ...LIVE_WEBSITE_PAGE_IDS] },
      perspective: "published",
    }),
  ]);

  // Bound staleness even when no browser is connected to Sanity Live.
  cacheLife({ revalidate: 300, expire: 600 });
  return getContentSitemap({
    pages: websitePages ?? [],
    projects: projects ?? [],
    journal: journal ?? [],
    services: services ?? [],
    redirects: getDeployedSitemapRedirects(),
    baseUrl,
  });
}
