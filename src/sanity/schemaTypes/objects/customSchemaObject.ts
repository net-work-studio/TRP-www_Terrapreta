import { CodeIcon } from "@sanity/icons/Code";
import { defineArrayMember, defineField, defineType } from "sanity";

export const customSchemaObject = defineType({
  name: "customSchema",
  title: "Structured data details",
  type: "object",
  icon: CodeIcon,
  fields: [
    defineField({
      name: "knowsAbout",
      title: "Topics",
      type: "text",
      description:
        "Comma-separated topics. Used as article or case-study keywords, or the service provider's areas of expertise.",
    }),
    defineField({
      name: "hasOfferCatalog",
      title: "Services offered",
      type: "array",
      hidden: ({ document }) => document?._type !== "service",
      description: "Services included in this service's offer catalog.",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: { title: "knowsAbout", services: "hasOfferCatalog" },
    prepare({ title, services }) {
      return {
        title: title || "Structured data details",
        subtitle: `${services?.length || 0} services offered`,
      };
    },
  },
});
