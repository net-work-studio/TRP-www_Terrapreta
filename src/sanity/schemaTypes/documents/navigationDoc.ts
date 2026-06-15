import { LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const navigationDoc = defineType({
  type: "document",
  name: "navigation",
  title: "Navigation",
  icon: LinkIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A navigation menu needs a title."),
      ],
    }),
    defineField({
      type: "array",
      name: "links",
      title: "Links",
      of: [defineArrayMember({ type: "linkObject" })],
      validation: (rule) => [
        rule.min(1).error("Add at least one navigation link."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        subtitle: "Navigation",
        title: title || "Untitled navigation",
      };
    },
  },
});
