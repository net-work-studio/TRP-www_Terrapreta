import { DatabaseIcon } from "@sanity/icons/Database";
import { LinkIcon } from "@sanity/icons/Link";
import { MasterDetailIcon } from "@sanity/icons/MasterDetail";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";
import { groups } from "../helpers/groups";

const [metaGroup, contentGroup, seoGroup] = groups;

const projectGroups = [
  metaGroup,
  contentGroup,
  {
    name: "layout",
    title: "Layout",
    icon: MasterDetailIcon,
  },
  {
    name: "data",
    title: "Data",
    icon: DatabaseIcon,
  },
  {
    name: "related",
    title: "Related",
    icon: LinkIcon,
  },
  seoGroup,
];

export const projectDoc = defineType({
  type: "document",
  name: "project",
  title: "Project",
  icon: MasterDetailIcon,
  groups: projectGroups,
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      group: "meta",
      validation: (rule) => [
        rule.required().error("A project needs a title before publishing."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "meta",
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
      group: "layout",
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
      type: "editorialImage",
      name: "mainImage",
      title: "Main Image",
      group: "content",
      validation: (rule) => [
        rule.required().error("A main image is required for project pages."),
      ],
    }),
    defineField({
      type: "string",
      name: "status",
      title: "Realization Status",
      group: "data",
      description:
        "Optionally indicate whether the project is still in progress or has been completed.",
      options: {
        list: [
          { title: "In Progress", value: "in-progress" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule.custom((value) =>
          value === undefined ||
          value === "in-progress" ||
          value === "completed"
            ? true
            : "Choose in progress or completed.",
        ),
      ],
    }),
    defineField({
      type: "number",
      name: "year",
      group: "data",
      description:
        "Optionally add the year most relevant to presenting this project, such as its completion or competition-result year.",
      validation: (rule) => [
        rule.integer().min(1000).max(9999).error("Enter a four-digit year."),
      ],
    }),
    defineField({
      type: "competitionObject",
      name: "competition",
      group: "data",
      description:
        "Add competition details only when this project was a competition entry.",
    }),
    defineField({
      type: "string",
      name: "location",
      title: "Location",
      group: "data",
    }),
    defineField({
      type: "string",
      name: "areaRestored",
      title: "Area Restored",
      group: "data",
      description: "Specify the unit of measurement",
    }),
    defineField({
      type: "string",
      name: "interventionType",
      title: "Intervention Type",
      group: "data",
    }),
    defineField({
      type: "text",
      name: "challenge",
      group: "data",
      description:
        "Summarize the condition or problem the project was created to address.",
      rows: 3,
      validation: (rule) => [
        rule
          .max(400)
          .warning("Keep the challenge under 400 characters for concise display."),
      ],
    }),
    defineField({
      type: "array",
      name: "clients",
      group: "data",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "organization" }],
        }),
      ],
      validation: (rule) => [
        rule.unique().error("Add each client only once."),
      ],
    }),
    defineField({
      type: "array",
      name: "roles",
      group: "data",
      description:
        "Add one plain-text statement for each of Terrapreta's roles in the project.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => [
            rule.required().error("Enter a role or remove the empty item."),
            rule
              .max(240)
              .warning("Keep each role under 240 characters for concise display."),
          ],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "team",
      group: "data",
      description:
        "Add each contributing organization once and summarize everything it did.",
      of: [defineArrayMember({ type: "projectTeamMember" })],
      validation: (rule) => [
        rule.custom((members) => {
          const teamMembers = (members ?? []) as {
            organization?: { _ref?: string };
          }[];
          const organizationIds = teamMembers
            .map((member) => member?.organization?._ref)
            .filter(Boolean);
          return new Set(organizationIds).size === organizationIds.length
            ? true
            : "Add each team organization only once and combine its contributions.";
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "nbsApplied",
      title: "NbS Applied",
      group: "data",
      description:
        "List the nature-based solutions applied in this project using concise names.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => [
            rule
              .required()
              .error("Enter a nature-based solution or remove the empty item."),
            rule
              .max(100)
              .warning("Keep each solution name under 100 characters."),
          ],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "fundingProgrammes",
      title: "Funding / Programmes",
      group: "data",
      description:
        "Add the funding sources or programmes associated with this project.",
      of: [defineArrayMember({ type: "fundingProgramme" })],
    }),
    defineField({
      type: "text",
      name: "shortDescription",
      title: "Short Description",
      group: "content",
      validation: (rule) => [
        rule
          .max(220)
          .warning("Keep project summaries under 220 characters for cards and SEO."),
      ],
    }),
    defineField({
      type: "gridDimensionObject",
      name: "gridDimension",
      group: "layout",
    }),
    defineField({
      type: "reference",
      name: "tag",
      group: "data",
      to: [{ type: "tag" }],
    }),
    defineField({
      type: "richTextContent",
      name: "pageContent",
      title: "Page Content",
      group: "content",
    }),
    defineField({
      type: "array",
      name: "relatedService",
      title: "Related Services",
      group: "related",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "service" }],
        }),
      ],
      validation: (rule) => [
        rule.unique().error("Add each related service only once."),
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
      validation: (rule) => [
        rule.unique().error("Add each related research item only once."),
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
    orderRankField({ type: "project", newItemPosition: "before" }),
  ],
  preview: {
    select: {
      media: "mainImage",
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
