import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const tagDoc = defineType({
  type: "document",
  name: "tag",
  title: "Tag",
  icon: TagIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      validation: (rule) => [
        rule.required().error("A tag needs a name."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (rule) => [
        rule.required().error("A slug is required for tag URLs."),
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
        subtitle: slug ? `/${slug}` : "Tag",
        title: title || "Untitled tag",
      };
    },
  },
});
