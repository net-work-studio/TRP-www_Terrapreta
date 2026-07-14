import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "../helpers/groups";
import { richTextBlock } from "../helpers/richTextBlock";

export const journalDoc = defineType({
  type: "document",
  name: "journal",
  title: "Journal",
  icon: DocumentTextIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      group: "meta",
      validation: (rule) => [
        rule.required().error("A journal entry needs a title before publishing."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "meta",
      validation: (rule) => [
        rule.required().error("A slug is required to generate the journal URL."),
      ],
      options: {
        source: "name",
      },
    }),
    defineField({
      type: "gridDimensionObject",
      name: "gridDimension",
      title: "Grid Dimension",
      group: "content",
    }),
    defineField({
      type: "reference",
      name: "tag",
      title: "Tag",
      group: "content",
      to: [{ type: "tag" }],
      validation: (rule) => [
        rule.required().error("Choose a tag for this journal entry."),
      ],
    }),
    defineField({
      type: "string",
      name: "location",
      title: "Location",
      group: "content",
      description:
        "Use always a city and country in English, never a state or region. (Example: Milan, Italy)",
      validation: (rule) => [
        rule.required().error("Add the city and country for this journal entry."),
      ],
    }),
    defineField({
      type: "date",
      name: "publishingDate",
      title: "Publishing Date",
      group: "content",
      validation: (rule) => [
        rule.required().error("Choose a publishing date."),
      ],
    }),
    defineField({
      type: "imageObject",
      name: "mainImage",
      title: "Main Image",
      group: "content",
      validation: (rule) => [
        rule.required().error("A main image is required for journal pages."),
      ],
    }),
    defineField({
      type: "text",
      name: "shortDescription",
      title: "Short Description",
      group: "content",
      validation: (rule) => [
        rule.required().error("Add a short summary for journal cards and SEO."),
        rule
          .max(220)
          .warning("Keep journal summaries under 220 characters for cards and SEO."),
      ],
    }),
    defineField({
      type: "array",
      name: "contentObject",
      title: "Content",
      group: "content",
      validation: (rule) => [
        rule.required().error("Add content before publishing this journal entry."),
      ],
      of: [richTextBlock, defineArrayMember({ type: "imageObject" })],
    }),
    defineField({
      type: "reference",
      name: "relatedService",
      title: "Related Service",
      to: [{ type: "service" }],
      group: "content",
    }),
    defineField({
      type: "reference",
      name: "relatedProject",
      title: "Related Project",
      to: [{ type: "project" }],
      group: "content",
    }),
    defineField({
      type: "reference",
      name: "relatedResearch",
      title: "Related Research",
      to: [{ type: "research" }],
      group: "content",
    }),
    defineField({
      type: "seoObject",
      name: "seo",
      title: "SEO",
      group: "seo",
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
      title: "name",
      subtitle: "publishingDate",
      media: "mainImage.image",
    },
  },
});
