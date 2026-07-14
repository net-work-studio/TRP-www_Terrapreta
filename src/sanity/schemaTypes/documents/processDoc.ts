import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { requiredField } from "../helpers/requiredField";

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
      validation: requiredField("A process needs a title."),
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
