import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

export const projectTeamMemberObject = defineType({
  type: "object",
  name: "projectTeamMember",
  title: "Project Team Member",
  icon: UserIcon,
  fields: [
    defineField({
      type: "reference",
      name: "organization",
      description: "Select the organization that contributed to the project.",
      to: [{ type: "organization" }],
      validation: (rule) => [
        rule.required().error("Select the organization that contributed."),
      ],
    }),
    defineField({
      type: "text",
      name: "contribution",
      description: "Briefly describe what this organization did on the project.",
      rows: 3,
      validation: (rule) => [
        rule.required().error("Describe what this organization contributed."),
        rule
          .max(240)
          .warning("Keep the contribution under 240 characters for concise display."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "organization.name",
      subtitle: "contribution",
      media: "organization.logoDark",
    },
    prepare({ media, subtitle, title }) {
      return {
        media,
        subtitle: subtitle || "Contribution not described",
        title: title || "Organization not selected",
      };
    },
  },
});
