import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const companyCollaboratorObject = defineType({
  name: "companyCollaborator",
  title: "Collaborator",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => [
        rule.required().error("Enter the collaborator's public name."),
        rule.custom((value) =>
          value && !value.trim() ? "Enter a name, not just spaces." : true
        ),
      ],
    }),
    defineField({
      name: "role",
      type: "string",
      description: "Optional public role or area of contribution.",
      validation: (rule) => [
        rule
          .max(100)
          .warning("Keep the public role concise for the collaborator list."),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Unnamed collaborator",
        subtitle: subtitle || "Collaborator",
      };
    },
  },
});
