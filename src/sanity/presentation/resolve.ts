import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";
import { LIVE_WEBSITE_PAGE_IDS, WEBSITE_PAGES } from "@/lib/website-pages";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    ...Object.fromEntries(
      LIVE_WEBSITE_PAGE_IDS.map((id) => [
        id,
        defineLocations({
          locations: [
            { title: WEBSITE_PAGES[id].title, href: WEBSITE_PAGES[id].path },
          ],
        }),
      ])
    ),
    journal: defineLocations({
      select: {
        title: "name",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/journal/${doc?.slug}`,
          },
          { title: "Journal index", href: "/journal" },
        ],
      }),
    }),
    project: defineLocations({
      select: {
        title: "name",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/projects/${doc?.slug}`,
          },
          { title: "Projects index", href: "/projects" },
        ],
      }),
    }),
    service: defineLocations({
      select: {
        title: "name",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/services/${doc?.slug}`,
          },
          { title: "Services index", href: "/services" },
        ],
      }),
    }),
  },
};
