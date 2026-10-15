import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { ImageIcon } from "@sanity/icons/Image";
import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

export const homeHeroObject = defineType({
  name: "homeHero",
  title: "Homepage hero",
  type: "object",
  icon: BlockContentIcon,
  groups: [
    { name: "content", icon: BlockContentIcon, default: true },
    { name: "image", icon: ImageIcon },
    { name: "interaction", icon: LinkIcon },
  ],
  initialValue: {
    button: {
      _type: "internalCallToAction",
      visibility: "hidden",
      label: "Learn more",
      destinationType: "section",
    },
    scrollCue: "static",
  },
  fields: [
    defineField({
      name: "heading",
      type: "heroHeading",
      group: "content",
      validation: (rule) => [
        rule.required().error("Add the main hero heading before publishing."),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      group: "content",
      description: "The short supporting text below the main heading.",
      validation: (rule) => [
        rule.required().error("Add supporting text for the hero heading."),
        rule.custom((value) =>
          value === undefined || value.trim()
            ? true
            : "The hero description needs visible text."
        ),
        rule.max(180).warning("Aim for a description under 180 characters."),
      ],
    }),
    defineField({
      name: "image",
      type: "heroImage",
      group: "image",
      validation: (rule) => [
        rule.required().error("Choose the hero image before publishing."),
      ],
    }),
    defineField({
      name: "button",
      type: "internalCallToAction",
      group: "interaction",
    }),
    defineField({
      name: "scrollCue",
      type: "string",
      group: "interaction",
      description:
        'The "Scroll to learn more" link to the next section. Reduced-motion preferences always disable its animation.',
      initialValue: "static",
      options: {
        list: [
          { title: "Static", value: "static" },
          { title: "Animated", value: "animated" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule.required().error("Choose how the scroll cue appears."),
        rule.custom((value) =>
          value === undefined ||
          value === "static" ||
          value === "animated" ||
          value === "hidden"
            ? true
            : "Choose Static, Animated, or Hidden."
        ),
      ],
    }),
  ],
  preview: {
    select: { description: "description", media: "image" },
    prepare({ description, media }) {
      return {
        title: "Homepage hero",
        subtitle: description || "Add supporting text",
        media,
      };
    },
  },
});
