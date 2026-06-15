import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
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
