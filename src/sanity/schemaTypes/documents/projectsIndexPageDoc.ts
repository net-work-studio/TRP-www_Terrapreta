import { ProjectsIcon } from "@sanity/icons/Projects";
import { defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const projectsIndexPageDoc = defineType({
  name: "projectsIndexPage",
  title: "Projects overview",
  type: "document",
  icon: ProjectsIcon,
  fields: websitePageFields("projectsIndexPage"),
  preview: websitePagePreview("projectsIndexPage"),
});
