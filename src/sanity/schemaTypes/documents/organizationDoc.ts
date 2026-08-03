import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const organizationDoc = defineType({
  type: "document",
  name: "organization",
  title: "Organization",
  icon: UserIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      validation: (rule) => [
        rule.required().error("An organization needs a name."),
      ],
    }),
    defineField({
      type: "image",
      name: "logoDark",
      title: "Logo White",
      options: { hotspot: true },
      validation: (rule) => [
        rule.required().error("Add the logo used on dark backgrounds."),
      ],
    }),
    defineField({
      type: "image",
      name: "logoLight",
      title: "Logo Black",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logoDark",
    },
  },
});
