import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { defineArrayMember, defineField, defineType } from "sanity";
import { richTextBlock } from "../helpers/richTextBlock";

export const contentObject = defineType({
  type: "object",
  name: "contentObject",
  title: "Content",
  icon: BlockContentIcon,
  fields: [
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      validation: (rule) => [
        rule.required().error("Add content before publishing."),
      ],
      of: [richTextBlock, defineArrayMember({ type: "imageObject" })],
    }),
  ],
  preview: {
    prepare() {
      return {
        subtitle: "Rich text and images",
        title: "Content",
      };
    },
  },
});
