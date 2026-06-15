import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const unGoalDoc = defineType({
  type: "document",
  name: "unGoal",
  title: "United Nations Goal",
  icon: DocumentIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      validation: (rule) => [
        rule.required().error("A UN goal needs a name."),
      ],
    }),
    defineField({
      type: "image",
      name: "logoPositive",
      title: "Logo Positive",
      validation: (rule) => [
        rule.required().error("Add the positive UN goal logo."),
      ],
    }),
    defineField({
      type: "image",
      name: "logoNegative",
      title: "Logo Negative",
      validation: (rule) => [
        rule.required().error("Add the negative UN goal logo."),
      ],
    }),
  ],
  preview: {
    select: {
      media: "logoPositive",
      title: "name",
    },
    prepare({ media, title }) {
      return {
        media,
        subtitle: "United Nations goal",
        title: title || "Untitled goal",
      };
    },
  },
});
