import { MasterDetailIcon } from "@sanity/icons/MasterDetail";
import { defineField, defineType } from "sanity";

export const gridDimensionObject = defineType({
  type: "object",
  name: "gridDimensionObject",
  title: "Content Prominence",
  icon: MasterDetailIcon,
  fields: [
    defineField({
      type: "string",
      name: "prominence",
      description:
        "Controls whether this item should receive extra emphasis in index listings.",
      initialValue: "standard",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Featured", value: "featured" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule
          .required()
          .error("Choose how prominently this item should appear."),
      ],
    }),
  ],
  preview: {
    select: {
      prominence: "prominence",
    },
    prepare({ prominence }) {
      return {
        title: prominence === "featured" ? "Featured" : "Standard",
        subtitle: "Content prominence",
      };
    },
  },
});
