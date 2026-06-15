import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const titleSlugObject = defineType({
  type: "object",
  name: "titleSlugObject",
  title: "Title + Slug",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: (rule) => [
        rule.required().error("Add a title before publishing."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (rule) => [
        rule.required().error("A slug is required to generate a URL."),
      ],
      options: {
        source: "name",
      },
    }),
  ],
  preview: {
    select: {
      slug: "slug.current",
      title: "name",
    },
    prepare({ slug, title }) {
      return {
        subtitle: slug ? `/${slug}` : "Missing slug",
        title: title || "Untitled",
      };
    },
  },
});
