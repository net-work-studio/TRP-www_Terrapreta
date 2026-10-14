import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const journalIndexPageDoc = defineType({
  name: "journalIndexPage",
  title: "Journal overview",
  type: "document",
  icon: DocumentTextIcon,
  fields: websitePageFields("journalIndexPage"),
  preview: websitePagePreview("journalIndexPage"),
});
