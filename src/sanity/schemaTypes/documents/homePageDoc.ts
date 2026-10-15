import { HomeIcon } from "@sanity/icons/Home";
import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";
import { websitePageFields } from "../helpers/websitePage";

const [nameField, seoField] = websitePageFields("homePage");

export const homePageDoc = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", icon: HomeIcon, default: true },
    { name: "seo", title: "SEO", icon: SearchIcon },
  ],
  fields: [
    defineField({ ...nameField, group: "content" }),
    defineField({
      name: "hero",
      type: "homeHero",
      group: "content",
      validation: (rule) => [
        rule.required().error("Complete the Homepage hero before publishing."),
      ],
    }),
    defineField({ ...seoField, group: "seo" }),
  ],
  preview: {
    select: { description: "hero.description", media: "hero.image" },
    prepare({ description, media }) {
      return {
        title: "Homepage",
        subtitle: description || "/ · Default hero",
        media,
      };
    },
  },
});
