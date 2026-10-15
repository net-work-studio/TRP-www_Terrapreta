import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import type { EditorialImage } from "@/sanity/types";

export const personDoc = defineType({
  name: "person",
  title: "Person",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "profile", title: "Profile", icon: UserIcon, default: true },
    { name: "contact", title: "Contact", icon: EnvelopeIcon },
  ],
  fieldsets: [{ name: "email", title: "Email", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "name",
      group: "profile",
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
      group: "profile",
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
      name: "description",
      type: "text",
      rows: 2,
      group: "profile",
      description: "Optional one-sentence summary shown on About.",
      validation: (rule) => [
        rule
          .max(160)
          .warning(
            "Keep the description under 160 characters for a concise introduction."
          ),
      ],
    }),
    defineField({
      name: "bio",
      type: "text",
      rows: 4,
      group: "profile",
      description:
        "Optional short biography with more detail about the person.",
      validation: (rule) => [
        rule
          .max(400)
          .warning(
            "Keep the biography under 400 characters for team profiles."
          ),
      ],
    }),
    defineField({
      name: "portrait",
      group: "profile",
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
    defineField({
      name: "email",
      type: "string",
      group: "contact",
      fieldset: "email",
      description:
        "Shown on About only when Email visibility is set to Visible.",
      validation: (rule) => [
        rule
          .email()
          .error("Enter a valid email address or leave this field empty."),
      ],
    }),
    defineField({
      name: "emailVisibility",
      type: "string",
      group: "contact",
      fieldset: "email",
      initialValue: "hidden",
      description: "Controls whether the email address appears on the website.",
      options: {
        layout: "radio",
        list: [
          { title: "Hidden", value: "hidden" },
          { title: "Visible", value: "visible" },
        ],
      },
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
