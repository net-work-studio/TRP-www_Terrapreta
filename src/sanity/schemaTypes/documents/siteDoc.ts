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
      validation: (rule) => [
        rule.required().error("The site settings document needs a site name."),
      ],
    }),
    defineField({
      type: "seoObject",
      name: "seo",
      title: "Site SEO Defaults",
      group: "seo",
      description: "Default SEO settings used across the site and for the homepage",
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        subtitle: "Site settings",
        title: title || "Site settings",
      };
    },
  },
});
