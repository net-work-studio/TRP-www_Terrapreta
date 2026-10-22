import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";
import { SITE_DEFAULTS } from "@/lib/constants";
import { formatSeoTitle } from "@/lib/seo-title";
import type { Site } from "@/sanity/types";

export const seoObject = defineType({
  type: "object",
  name: "seoObject",
  title: "SEO",
  icon: SearchIcon,
  groups: [
    { name: "search", icon: SearchIcon, default: true },
    { name: "social", icon: SearchIcon },
    { name: "structuredData", title: "Structured data", icon: SearchIcon },
  ],
  fields: [
    defineField({
      type: "string",
      name: "metaTitle",
      group: "search",
      description:
        "Search title. On website pages with a Heading override, this is also the default visible heading. The website adds the Site brand suffix to metadata; aim for 60 characters including the suffix.",
      validation: (rule) => [
        rule
          .custom(async (value, context) => {
            if (!value) {
              return true;
            }
            const site =
              context.document?._type === "site"
                ? context.document
                : await context
                    .getClient({ apiVersion: "2026-01-16" })
                    .getDocument<Site>("site");
            const brandName =
              (typeof site?.brandName === "string" && site.brandName) ||
              SITE_DEFAULTS.name;
            const { length } = formatSeoTitle(value, brandName);
            return (
              length <= 60 ||
              `The rendered title is ${length} characters including the brand. Aim for 60 or fewer.`
            );
          })
          .warning(),
      ],
    }),
    defineField({
      type: "text",
      name: "metaDescription",
      group: "search",
      rows: 3,
      description: "Description for search results (150-160 chars)",
      validation: (rule) => [
        rule
          .max(160)
          .warning("Meta descriptions should be under 160 characters"),
      ],
    }),
    defineField({
      type: "image",
      name: "ogImage",
      group: "social",
      title: "Social Share Image",
      description: "Custom image for social sharing (1200x630px recommended)",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          description:
            "Describe the image for social previews. Defaults to the page title.",
          validation: (rule) => [
            rule
              .max(140)
              .warning("Keep social-image alt text under 140 characters."),
          ],
        }),
      ],
    }),
    defineField({
      type: "url",
      name: "canonicalUrl",
      group: "search",
      title: "Canonical URL",
      hidden: ({ document }) => document?._type === "site",
      description:
        "Override the default canonical URL (leave empty to use page URL)",
      validation: (rule) => [
        rule
          .uri({ scheme: ["http", "https"] })
          .error("Canonical URL must start with http:// or https://"),
      ],
    }),
    defineField({
      type: "string",
      name: "robotsIndex",
      group: "search",
      title: "Indexing",
      options: {
        list: [
          { title: "Index", value: "index" },
          { title: "Noindex", value: "noindex" },
        ],
        layout: "radio",
      },
      initialValue: "index",
    }),
    defineField({
      type: "string",
      name: "robotsFollow",
      group: "search",
      title: "Link Following",
      options: {
        list: [
          { title: "Follow", value: "follow" },
          { title: "Nofollow", value: "nofollow" },
        ],
        layout: "radio",
      },
      initialValue: "follow",
    }),
    defineField({
      type: "string",
      name: "schemaType",
      group: "structuredData",
      title: "Primary Schema Type",
      hidden: ({ document }) => document?._type !== "journal",
      description:
        "Journal structured-data type. Other routes use a type matching their content.",
      options: {
        list: [
          { title: "Blog posting", value: "BlogPosting" },
          { title: "Article", value: "Article" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule.custom(
          (value, context) =>
            context.document?._type !== "journal" ||
            !value ||
            ["Article", "BlogPosting"].includes(value) ||
            "Choose Article or Blog posting for a journal entry."
        ),
      ],
    }),
    defineField({
      type: "customSchema",
      name: "customSchema",
      group: "structuredData",
      title: "Custom Schema Properties",
      hidden: ({ document }) =>
        !["project", "service", "journal"].includes(document?._type || ""),
    }),
    defineField({
      type: "string",
      name: "ogTitle",
      group: "social",
      title: "OG Title Override",
      description: "Override the Open Graph title (defaults to meta title)",
    }),
    defineField({
      type: "text",
      name: "ogDescription",
      group: "social",
      title: "OG Description Override",
      description:
        "Override the Open Graph description (defaults to meta description)",
      rows: 3,
    }),
    defineField({
      type: "string",
      name: "twitterCard",
      group: "social",
      title: "Twitter Card Type",
      options: {
        list: [
          { title: "Summary Large Image", value: "summary_large_image" },
          { title: "Summary", value: "summary" },
        ],
        layout: "radio",
      },
      initialValue: "summary_large_image",
    }),
  ],
  preview: {
    select: {
      description: "metaDescription",
      title: "metaTitle",
    },
    prepare({ description, title }) {
      return {
        subtitle: description || "SEO settings",
        title: title || "Default SEO",
      };
    },
  },
});
