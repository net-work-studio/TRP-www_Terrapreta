import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { requiredField } from "../helpers/requiredField";

type TitleSlugFieldMessages = {
  name: string;
  slug: string;
};

export function createTitleSlugFields({ name, slug }: TitleSlugFieldMessages) {
  return [
    defineField({
      type: "string",
      name: "name",
      title: "Title",
      validation: requiredField(name),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: requiredField(slug),
      options: {
        source: "name",
      },
    }),
  ];
}

export const titleSlugObject = defineType({
  type: "object",
  name: "titleSlugObject",
  title: "Title + Slug",
  icon: DocumentTextIcon,
  fields: createTitleSlugFields({
    name: "Add a title before publishing.",
    slug: "A slug is required to generate a URL.",
  }),
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
