import { SearchIcon } from "@sanity/icons/Search";
import { defineArrayMember, defineField, defineType } from "sanity";

export const seoObject = defineType({
  type: "object",
  name: "seoObject",
  title: "SEO",
  icon: SearchIcon,
  fields: [
    defineField({
      type: "string",
      name: "metaTitle",
      title: "Meta Title",
      description: "Override page title for search engines (50-60 chars)",
      validation: (rule) => [
        rule.max(60).warning("Meta titles should be under 60 characters"),
      ],
    }),
    defineField({
      type: "text",
      name: "metaDescription",
      title: "Meta Description",
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
      title: "Social Share Image",
      description: "Custom image for social sharing (1200x630px recommended)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      type: "url",
      name: "canonicalUrl",
      title: "Canonical URL",
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
      title: "Primary Schema Type",
      description: "Override the default JSON-LD schema type for this page",
      options: {
        list: [
          { title: "Organization", value: "Organization" },
          { title: "Service", value: "Service" },
          { title: "Project", value: "Project" },
          { title: "Article", value: "Article" },
          { title: "LocalBusiness", value: "LocalBusiness" },
        ],
      },
    }),
    defineField({
      type: "object",
      name: "customSchema",
      title: "Custom Schema Properties",
      fields: [
        defineField({
          type: "text",
          name: "knowsAbout",
          title: "Knows About",
          description:
            "Comma-separated topics (e.g., 'soil regeneration, ecosystem restoration')",
        }),
        defineField({
          type: "array",
          name: "hasOfferCatalog",
          title: "Services Offered",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),
    defineField({
      type: "string",
      name: "ogTitle",
      title: "OG Title Override",
      description: "Override the Open Graph title (defaults to meta title)",
    }),
    defineField({
      type: "text",
      name: "ogDescription",
      title: "OG Description Override",
      description:
        "Override the Open Graph description (defaults to meta description)",
      rows: 3,
    }),
    defineField({
      type: "string",
      name: "twitterCard",
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
