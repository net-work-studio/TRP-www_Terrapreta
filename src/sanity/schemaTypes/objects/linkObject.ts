import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const linkObject = defineType({
  type: "object",
  name: "linkObject",
  title: "Link",
  icon: LinkIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A link needs visible text."),
      ],
    }),
    defineField({
      type: "string",
      name: "type",
      title: "Type",
      validation: (rule) => [
        rule
          .required()
          .error("Choose whether this is an internal or external link."),
      ],
      initialValue: "internal",
      options: {
        layout: "radio",
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
      },
    }),
    defineField({
      type: "reference",
      name: "page",
      title: "Page",
      to: [
        { type: "page" },
        { type: "about" },
        { type: "journal" },
        { type: "project" },
        { type: "service" },
        { type: "research" },
        { type: "press" },
      ],
      hidden: ({ parent }) => parent?.type !== "internal",
      validation: (rule) => [
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "internal" && !value?._ref) {
            return "Choose the internal page this link points to.";
          }
          return true;
        }),
      ],
    }),
    defineField({
      type: "string",
      name: "href",
      title: "URL",
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (rule) => [
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "external" && !value) {
            return "Add the external URL this link points to.";
          }
          return true;
        }),
      ],
    }),
    defineField({
      type: "string",
      name: "target",
      title: "Target",
      validation: (rule) => [
        rule.required().error("Choose how this link should open."),
      ],
      initialValue: "_self",
      options: {
        list: [
          { title: "Self", value: "_self" },
          { title: "Blank", value: "_blank" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      href: "href",
      pageTitle: "page.name",
      title: "name",
      type: "type",
    },
    prepare({ href, pageTitle, title, type }) {
      const destination = type === "external" ? href : pageTitle;
      return {
        subtitle: destination || "Link",
        title: title || "Untitled link",
      };
    },
  },
});
