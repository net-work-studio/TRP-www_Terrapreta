import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const glossaryDoc = defineType({
  type: "document",
  name: "glossary",
  title: "Glossary",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      validation: (rule) => [
        rule.required().error("A glossary entry needs a name."),
      ],
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      validation: (rule) => [
        rule.required().error("A slug is required to generate the glossary URL."),
      ],
      options: {
        source: "name",
      },
    }),
    defineField({
      type: "imageObject",
      name: "image",
      title: "Image",
    }),
    defineField({
      type: "text",
      name: "definition",
      title: "Definition",
      validation: (rule) => [
        rule
          .max(300)
          .warning("Keep glossary definitions under 300 characters for scanning."),
      ],
    }),
  ],
  preview: {
    select: {
      definition: "definition",
      media: "image.image",
      title: "name",
    },
    prepare({ definition, media, title }) {
      return {
        media,
        subtitle: definition || "Glossary entry",
        title: title || "Untitled glossary entry",
      };
    },
  },
});
