import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const researchDoc = defineType({
  type: "document",
  name: "research",
  title: "Research",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      type: "titleSlugObject",
      name: "titleSlug",
      title: "Title + Slug",
      validation: (rule) => [
        rule.required().error("Research needs a title and slug."),
      ],
    }),
    defineField({
      type: "imageObject",
      name: "mainImage",
      title: "Main Image",
      validation: (rule) => [
        rule.required().error("A main image is required for research pages."),
      ],
    }),
    defineField({
      type: "reference",
      name: "relatedService",
      title: "Related Service",
      to: [{ type: "service" }],
    }),
    defineField({
      type: "reference",
      name: "relatedProject",
      title: "Related Project",
      to: [{ type: "project" }],
    }),
  ],
  preview: {
    select: {
      media: "mainImage.image",
      slug: "titleSlug.slug.current",
      title: "titleSlug.name",
    },
    prepare({ media, slug, title }) {
      return {
        media,
        subtitle: slug ? `/research/${slug}` : "Research",
        title: title || "Untitled research",
      };
    },
  },
});
