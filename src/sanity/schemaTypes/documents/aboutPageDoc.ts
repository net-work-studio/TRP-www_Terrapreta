import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const aboutPageDoc = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  icon: InfoOutlineIcon,
  fields: websitePageFields("aboutPage"),
  preview: websitePagePreview("aboutPage"),
});
