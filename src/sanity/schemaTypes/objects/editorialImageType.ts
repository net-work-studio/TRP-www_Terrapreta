import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

export const editorialImageType = defineType({
  type: "image",
  name: "editorialImage",
  title: "Editorial Image",
  icon: ImageIcon,
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      type: "string",
      name: "altContent",
      validation: (rule) => [
        rule
          .max(140)
          .warning("Keep alt text concise while describing the image purpose."),
      ],
    }),
    defineField({ type: "string", name: "caption" }),
  ],
  validation: (rule) => [
    rule
      .required()
      .assetRequired()
      .error("Choose an image asset before publishing."),
  ],
  preview: {
    select: {
      alt: "altContent",
      caption: "caption",
      media: "asset",
    },
    prepare({ alt, caption, media }) {
      return {
        media,
        subtitle: caption || "Image",
        title: alt || "Untitled image",
      };
    },
  },
});
