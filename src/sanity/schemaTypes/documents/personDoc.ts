import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import type { EditorialImage } from "@/sanity/types";

export const personDoc = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => [
        rule
          .required()
          .error("Add the person's public name before publishing."),
        rule.custom((value) =>
          value && !value.trim() ? "Enter a name, not just spaces." : true
        ),
      ],
    }),
    defineField({
      name: "role",
      type: "string",
      description:
        "Public role at Terrapreta, shown with company team members.",
      validation: (rule) => [
        rule
          .max(100)
          .warning("Keep the public role concise for team profiles."),
      ],
    }),
    defineField({
      name: "portrait",
      type: "editorialImage",
      description:
        "For the company team. Add useful alt text and review the crop and hotspot. Authors may leave this empty.",
      validation: (rule) => [
        rule.custom<EditorialImage>((value) => {
          if (!value) {
            return true;
          }
          if (!value.asset?._ref) {
            return "Choose an image asset for this portrait.";
          }
          return value.altContent?.trim()
            ? true
            : "Describe the portrait for people using screen readers.";
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Unnamed person",
        subtitle: subtitle || "Person",
        media,
      };
    },
  },
});
