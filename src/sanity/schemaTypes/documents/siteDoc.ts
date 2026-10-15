import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";
import { groups } from "../helpers/groups";

export const siteDoc = defineType({
  type: "document",
  name: "site",
  title: "Site",
  icon: CogIcon,
  groups,
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Site Name",
      hidden: true,
      readOnly: true,
      initialValue: "Site settings",
      validation: (rule) => [
        rule.required().error("The site settings document needs a site name."),
      ],
    }),
    defineField({
      name: "brandName",
      type: "string",
      group: "content",
      initialValue: "Terrapreta",
      description:
        "The brand used in page titles and social metadata. Defaults to Terrapreta when empty.",
    }),
    defineField({
      type: "seoObject",
      name: "seo",
      title: "Site SEO Defaults",
      group: "seo",
      description:
        "Shared SEO defaults. Homepage-specific metadata is edited under Website pages.",
    }),
  ],
  preview: {
    select: {
      brandName: "brandName",
    },
    prepare({ brandName }) {
      return {
        subtitle: `${brandName || "Terrapreta"} · Shared SEO defaults`,
        title: "Site settings",
      };
    },
  },
});
