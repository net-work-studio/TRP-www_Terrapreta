import { StarIcon } from "@sanity/icons/Star";
import { defineField, defineType } from "sanity";

const competitionResultTitles = {
  "first-prize": "First prize",
  "second-prize": "Second prize",
  "third-prize": "Third prize",
  "honourable-mention": "Honourable mention",
  shortlisted: "Shortlisted",
  participant: "Participant",
} as const;

export const competitionObject = defineType({
  type: "object",
  name: "competitionObject",
  title: "Competition",
  icon: StarIcon,
  fields: [
    defineField({
      type: "string",
      name: "result",
      description: "Select the result announced after judging.",
      options: {
        list: Object.entries(competitionResultTitles).map(([value, title]) => ({
          title,
          value,
        })),
      },
      validation: (rule) => [
        rule.required().error("A result is required for a competition entry."),
      ],
    }),
    defineField({
      type: "string",
      name: "name",
      description:
        "Add the official competition name only when it differs from the project title.",
      validation: (rule) => [
        rule
          .max(120)
          .warning("Keep the competition name under 120 characters."),
      ],
    }),
  ],
  preview: {
    select: {
      name: "name",
      result: "result",
    },
    prepare({ name, result }) {
      const resultTitle =
        competitionResultTitles[
          result as keyof typeof competitionResultTitles
        ] || "Missing result";

      return {
        title: resultTitle,
        subtitle: name || "Uses project title",
      };
    },
  },
});
