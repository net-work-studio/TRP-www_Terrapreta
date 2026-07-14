import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const capabilityDoc = defineType({
  type: "document",
  name: "capability",
  title: "Capability",
  icon: TagIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A capability needs a title."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        subtitle: "Capability",
        title: title || "Untitled capability",
      };
    },
  },
});
