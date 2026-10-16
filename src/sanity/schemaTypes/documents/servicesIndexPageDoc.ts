import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const servicesIndexPageDoc = defineType({
  name: "servicesIndexPage",
  title: "Services index",
  type: "document",
  icon: EarthGlobeIcon,
  fields: websitePageFields("servicesIndexPage"),
  preview: websitePagePreview("servicesIndexPage"),
});
