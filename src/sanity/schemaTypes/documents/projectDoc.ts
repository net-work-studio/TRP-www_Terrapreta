import { MasterDetailIcon } from "@sanity/icons/MasterDetail";
import { defineField, defineType } from "sanity";

export const projectDoc = defineType({
  type: "document",
  name: "project",
  title: "Project",
  icon: MasterDetailIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A project needs a title before publishing."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (rule) => [
        rule.required().error("A slug is required to generate the project URL."),
      ],
      options: {
        source: "name",
      },
    }),
    defineField({
      type: "string",
      name: "publicationScope",
      description:
        "Choose whether this project has a public detail page or only appears in the projects overview.",
      initialValue: "full",
      validation: (rule) => [
        rule.custom((value) =>
          value === undefined || value === "full" || value === "overview"
            ? true
            : "Choose full project or overview only.",
        ),
      ],
      options: {
        list: [
          { title: "Full project", value: "full" },
          { title: "Overview only", value: "overview" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      type: "imageObject",
      name: "mainImage",
      title: "Main Image",
      validation: (rule) => [
        rule.required().error("A main image is required for project pages."),
      ],
    }),
    defineField({
      type: "string",
      name: "status",
      title: "Status",
      options: {
        list: [
          { title: "On Hold", value: "on-hold" },
          { title: "In Progress", value: "in-progress" },
          { title: "In Construction", value: "in-construction" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (rule) => [
        rule.required().error("Choose the current project status."),
      ],
    }),
    defineField({ type: "string", name: "location", title: "Location" }),
    defineField({
      type: "string",
      name: "areaRestored",
      title: "Area Restored",
      description: "Specify the unit of measurement",
    }),
    defineField({
      type: "string",
      name: "interventionType",
      title: "Intervention Type",
    }),
    defineField({
      type: "text",
      name: "shortDescription",
      title: "Short Description",
      validation: (rule) => [
        rule
          .max(220)
          .warning("Keep project summaries under 220 characters for cards and SEO."),
      ],
    }),
    defineField({
      type: "gridDimensionObject",
      name: "gridDimension",
    }),
    defineField({
      type: "reference",
      name: "tag",
      to: [{ type: "tag" }],
    }),
    defineField({
      type: "contentObject",
      name: "pageContent",
      title: "Page Content",
    }),
    defineField({
      type: "reference",
      name: "relatedService",
      title: "Related Service",
      to: [{ type: "service" }],
    }),
    defineField({
      type: "reference",
      name: "relatedResearch",
      title: "Related Research",
      to: [{ type: "research" }],
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
      media: "mainImage.image",
      publicationScope: "publicationScope",
      status: "status",
      title: "name",
    },
    prepare({ media, publicationScope, status, title }) {
      const scopeLabel =
        publicationScope === "overview" ? "Overview only" : "Full project";
      return {
        media,
        subtitle: status ? `${scopeLabel} - ${status}` : scopeLabel,
        title: title || "Untitled project",
      };
    },
  },
});
