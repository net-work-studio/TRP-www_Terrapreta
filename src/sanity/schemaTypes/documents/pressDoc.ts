import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const pressDoc = defineType({
  type: "document",
  name: "press",
  title: "Press",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A press item needs a title."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        subtitle: "Press",
        title: title || "Untitled press item",
      };
    },
  },
});
