import { SearchIcon } from "@sanity/icons/Search";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const researchIndexPageDoc = defineType({
  name: "researchIndexPage",
  title: "Research index",
  type: "document",
  icon: SearchIcon,
  fields: websitePageFields("researchIndexPage"),
  preview: websitePagePreview("researchIndexPage"),
});
