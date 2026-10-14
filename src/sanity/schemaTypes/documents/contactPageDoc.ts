import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const contactPageDoc = defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  icon: EnvelopeIcon,
  fields: websitePageFields("contactPage"),
  preview: websitePagePreview("contactPage"),
});
