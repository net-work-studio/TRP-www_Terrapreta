import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

export const heroImageType = defineType({
  name: "heroImage",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "altContent",
      title: "Alt text",
      type: "string",
      description: "Describe the image for visitors who cannot see it.",
      validation: (rule) => [
        rule.required().error("Describe the hero image before publishing."),
        rule.custom((value) =>
          value === undefined || value.trim()
            ? true
            : "Alt text must describe the image, rather than contain only spaces."
        ),
        rule.max(140).warning("Keep alt text concise and descriptive."),
      ],
    }),
  ],
  validation: (rule) => [
    rule
      .required()
      .assetRequired()
      .error("Choose a hero image before publishing."),
  ],
  preview: {
    select: { title: "altContent", media: "asset" },
    prepare({ title, media }) {
      return { title: title || "Hero image", subtitle: "No caption", media };
    },
  },
});
