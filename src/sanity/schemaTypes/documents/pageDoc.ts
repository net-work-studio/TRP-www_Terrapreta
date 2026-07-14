import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import modules from "../fragments/modules";
import { createTitleSlugFields } from "../objects/titleSlugObject";

export const pageDoc = defineType({
  type: "document",
  name: "page",
  title: "Page",
  icon: DocumentIcon,
  fields: [
    ...createTitleSlugFields({
      name: "A page needs a title before publishing.",
      slug: "A slug is required to generate the page URL.",
    }),
    defineField({
      type: "imageObject",
      name: "mainImage",
      title: "Main Image",
      validation: (rule) => [
        rule.required().error("A main image is required for page previews."),
      ],
    }),
    defineField({
      ...modules,
    }),
    defineField({
      type: "seoObject",
      name: "seo",
      title: "SEO",
      description: "Search engine optimization settings",
      initialValue: {
        robotsIndex: "index",
        robotsFollow: "follow",
        twitterCard: "summary_large_image",
      },
    }),
  ],
  preview: {
    select: {
      media: "mainImage.image",
      slug: "slug.current",
      title: "name",
    },
    prepare({ media, slug, title }) {
      return {
        media,
        subtitle: slug ? `/${slug}` : "Missing slug",
        title: title || "Untitled page",
      };
    },
  },
});
