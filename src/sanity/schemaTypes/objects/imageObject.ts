import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const imageObject = defineType({
  type: "object",
  name: "imageObject",
  title: "Image",
  icon: ImageIcon,
  fields: [
    defineField({
      type: "image",
      name: "image",
      validation: (rule) => [
        rule.required().error("Choose an image asset."),
      ],
      options: {
        hotspot: true,
      },
    }),
    defineField({
      type: "string",
      name: "altContent",
      title: "Alt Content",
      validation: (rule) => [
        rule
          .max(140)
          .warning("Keep alt text concise while describing the image purpose."),
      ],
    }),
    defineField({ type: "string", name: "caption", title: "Caption" }),
  ],
  preview: {
    select: {
      alt: "altContent",
      caption: "caption",
      media: "image",
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
