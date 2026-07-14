import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const customerDoc = defineType({
  type: "document",
  name: "customer",
  title: "Customer",
  icon: UserIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      validation: (rule) => [
        rule.required().error("A customer needs a name."),
      ],
    }),
    defineField({
      type: "image",
      name: "mainImage",
      title: "Main Image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      type: "text",
      name: "shortDescription",
      title: "Short Description",
      description: "Max 280 characters",
      validation: (rule) => [
        rule
          .max(280)
          .error("Short Description must be less than 280 characters"),
      ],
    }),
  ],
  preview: {
    select: {
      description: "shortDescription",
      media: "mainImage",
      title: "name",
    },
    prepare({ description, media, title }) {
      return {
        media,
        subtitle: description || "Customer",
        title: title || "Untitled customer",
      };
    },
  },
});
