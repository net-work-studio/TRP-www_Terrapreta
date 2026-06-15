import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const processDoc = defineType({
  type: "document",
  name: "process",
  title: "Process",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("A process needs a title."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        subtitle: "Process",
        title: title || "Untitled process",
      };
    },
  },
});
