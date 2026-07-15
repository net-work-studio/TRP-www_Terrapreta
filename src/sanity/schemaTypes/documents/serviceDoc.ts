import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "../helpers/groups";

const MAX_CAPABILITIES = 6;
const [metaGroup, contentGroup, seoGroup] = groups;

const serviceGroups = [
  metaGroup,
  contentGroup,
  {
    name: "related",
    title: "Related",
    icon: LinkIcon,
  },
  seoGroup,
];

export const serviceDoc = defineType({
  type: "document",
  name: "service",
  title: "Service",
  icon: DocumentTextIcon,
  groups: serviceGroups,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      group: "meta",
      validation: (rule) => [
        rule.required().error("A service needs a title before publishing."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "meta",
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
      group: "content",
      validation: (rule) => [
        rule
          .max(220)
          .warning("Keep service summaries under 220 characters for cards and SEO."),
      ],
    }),
    defineField({
      type: "editorialImage",
      name: "mainImage",
      title: "Main Image",
      group: "content",
      validation: (rule) => [
        rule.required().error("A main image is required for service pages."),
      ],
    }),
    defineField({
      type: "array",
      name: "clients",
      title: "Clients",
      group: "related",
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
      group: "related",
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
      type: "richTextContent",
      name: "content",
      title: "Content",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "relatedProject",
      title: "Related Project",
      group: "related",
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
      group: "related",
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
      description: "shortDescription",
      media: "mainImage",
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
