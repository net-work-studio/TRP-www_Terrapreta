import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const heroSplitModule = defineType({
  name: "heroSplitModule",
  title: "Hero (split)",
  type: "object",
  icon: BlockContentIcon,
  groups: [{ name: "content", default: true }, { name: "asset" }],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => [
        rule.required().error("Name this hero block for easier editing."),
      ],
      group: "content",
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        media: BlockContentIcon,
        subtitle: "Hero (split)",
        title: title || "Untitled hero",
      };
    },
  },
});
