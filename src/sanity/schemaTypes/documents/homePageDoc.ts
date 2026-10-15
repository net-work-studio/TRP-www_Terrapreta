import { HomeIcon } from "@sanity/icons/Home";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const homePageDoc = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  fields: websitePageFields("homePage"),
  preview: websitePagePreview("homePage"),
});
