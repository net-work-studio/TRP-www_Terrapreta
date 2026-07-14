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
      type: "string",
      name: "type",
      validation: (rule) => [
        rule.required().error("Choose the organization type."),
      ],
      options: {
        list: [
          { title: "Client", value: "client" },
          { title: "Partner", value: "partner" },
          { title: "Sponsor", value: "sponsor" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      type: "image",
      name: "logoDark",
      title: "Logo White",
      validation: (rule) => [
        rule.required().error("Add the logo used on dark backgrounds."),
      ],
    }),
    defineField({
      type: "image",
      name: "logoLight",
      title: "Logo Black",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
      media: "logoDark",
    },
  },
});
