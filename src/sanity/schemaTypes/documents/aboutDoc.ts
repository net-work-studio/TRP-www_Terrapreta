import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { groups } from "../helpers/groups";

export const aboutDoc = defineType({
  type: "document",
  name: "about",
  title: "About",
  icon: DocumentIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("The About page needs a title."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        subtitle: "About page",
        title: title || "Untitled about page",
      };
    },
  },
});
