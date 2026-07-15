import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { defineArrayMember, defineType } from "sanity";
import { richTextBlock } from "../helpers/richTextBlock";

export const richTextContentType = defineType({
  type: "array",
  name: "richTextContent",
  title: "Rich Text Content",
  icon: BlockContentIcon,
  of: [richTextBlock, defineArrayMember({ type: "editorialImage" })],
});
