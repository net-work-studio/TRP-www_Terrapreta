import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { requiredField } from "../helpers/requiredField";

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
      validation: requiredField("A press item needs a title."),
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
