import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { SearchIcon } from "@sanity/icons/Search";
import { UsersIcon } from "@sanity/icons/Users";
import { defineArrayMember, defineField, defineType } from "sanity";
import { websitePageFields, websitePagePreview } from "../helpers/websitePage";

export const aboutPageDoc = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  icon: InfoOutlineIcon,
  groups: [
    { name: "content", title: "Content", icon: InfoOutlineIcon, default: true },
    { name: "people", title: "People", icon: UsersIcon },
    { name: "seo", title: "SEO", icon: SearchIcon },
  ],
  fields: [
    ...websitePageFields("aboutPage").map((field) =>
      defineField({
        ...field,
        group: field.name === "seo" ? "seo" : "content",
      })
    ),
    defineField({
      name: "introduction",
      type: "richTextContent",
      validation: (rule) => [
        rule.required().error("Add the introduction before publishing About."),
        rule.min(1).error("Add at least one paragraph introducing Terrapreta."),
      ],
      group: "content",
    }),
    defineField({
      name: "team",
      type: "array",
      description:
        "Core company team in public display order. Add each person's public role and portrait in People.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      validation: (rule) => [
        rule.unique().error("Select each team member only once."),
      ],
      group: "people",
    }),
    defineField({
      name: "collaborators",
      type: "array",
      description:
        "Names and optional roles, displayed separately from the core team in this order.",
      of: [
        defineArrayMember({
          type: "companyCollaborator",
        }),
      ],
      validation: (rule) => [
        rule.unique().error("List each collaborator only once."),
      ],
      group: "people",
    }),
  ],
  preview: websitePagePreview("aboutPage"),
});
