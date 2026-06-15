import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { richTextBlock } from "../helpers/richTextBlock";

const MAX_CAPABILITIES = 6;

export const serviceDoc = defineType({
  type: "document",
  name: "service",
  title: "Service",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A service needs a title before publishing."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (rule) => [
        rule.required().error("A slug is required to generate the service URL."),
      ],
      options: {
        source: "name",
      },
    }),
    defineField({
      type: "text",
      name: "shortDescription",
      title: "Short Description",
      validation: (rule) => [
        rule
          .max(220)
          .warning("Keep service summaries under 220 characters for cards and SEO."),
      ],
    }),
    defineField({
      type: "imageObject",
      name: "mainImage",
      title: "Main Image",
      validation: (rule) => [
        rule.required().error("A main image is required for service pages."),
      ],
    }),
    defineField({
      type: "array",
      name: "clients",
      title: "Clients",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "organization" }],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "capabilities",
      title: "Capabilities",
      description: `You can select up to ${MAX_CAPABILITIES} capabilities`,
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "capability" }] }),
      ],
      validation: (rule) => [
        rule
          .max(MAX_CAPABILITIES)
          .error(`Select no more than ${MAX_CAPABILITIES} capabilities.`),
      ],
    }),
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      of: [richTextBlock, defineArrayMember({ type: "imageObject" })],
    }),
    defineField({
      type: "array",
      name: "relatedProject",
      title: "Related Project",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "relatedResearch",
      title: "Related Research",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "research" }],
        }),
      ],
    }),
    defineField({
      type: "seoObject",
      name: "seo",
      title: "SEO",
      description: "Search engine optimization settings",
      initialValue: {
        robotsIndex: "index",
        robotsFollow: "follow",
        twitterCard: "summary_large_image",
      },
    }),
  ],
  preview: {
    select: {
      description: "shortDescription",
      media: "mainImage.image",
      title: "name",
    },
    prepare({ description, media, title }) {
      return {
        media,
        subtitle: description || "Service",
        title: title || "Untitled service",
      };
    },
  },
});
