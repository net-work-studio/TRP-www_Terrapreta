import type { MetadataRoute } from "next";
import { SITE_DEFAULTS } from "@/lib/constants";
import { getWebsitePagesSitemap } from "@/lib/website-page-sitemap";
import { LIVE_WEBSITE_PAGE_IDS } from "@/lib/website-pages";
import { sanityFetchMetadata } from "@/sanity/lib/live";
import {
  JOURNAL_SITEMAP_QUERY,
  PROJECTS_SITEMAP_QUERY,
  SERVICES_SITEMAP_QUERY,
  WEBSITE_PAGES_SITEMAP_QUERY,
} from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    sanityFetchMetadata({
      query: PROJECTS_SITEMAP_QUERY,
      perspective: "published",
    }),
    sanityFetchMetadata({
      query: JOURNAL_SITEMAP_QUERY,
      perspective: "published",
    }),
    sanityFetchMetadata({
      query: SERVICES_SITEMAP_QUERY,
      perspective: "published",
    }),
    sanityFetchMetadata({
      query: WEBSITE_PAGES_SITEMAP_QUERY,
      params: { ids: ["site", ...LIVE_WEBSITE_PAGE_IDS] },
      perspective: "published",
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    ...getWebsitePagesSitemap(websitePages ?? [], baseUrl),
    {
      url: `${baseUrl}/impressum`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...(projects ?? [])
      .filter((project) => project.slug)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...(journal ?? [])
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${baseUrl}/journal/${post.slug}`,
        lastModified: new Date(post._updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...(services ?? [])
      .filter((service) => service.slug)
      .map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(service._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
