import { BillIcon } from "@sanity/icons/Bill";
import { defineField, defineType } from "sanity";

export const fundingProgrammeObject = defineType({
  type: "object",
  name: "fundingProgramme",
  title: "Funding / Programme",
  icon: BillIcon,
  fields: [
    defineField({
      type: "string",
      name: "name",
      validation: (rule) => [
        rule.required().error("Enter the funding source or programme name."),
        rule
          .max(120)
          .warning("Keep the name under 120 characters for concise display."),
      ],
    }),
    defineField({
      type: "string",
      name: "amount",
      description: "Enter the amount together with its currency, if known.",
      validation: (rule) => [
        rule
          .max(80)
          .warning("Keep the funding amount under 80 characters."),
      ],
    }),
    defineField({
      type: "url",
      name: "url",
      title: "URL",
      description: "Link to the funder or programme page.",
      validation: (rule) => [
        rule.uri({ scheme: ["http", "https"] }).error("Enter a valid web URL."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      amount: "amount",
    },
    prepare({ amount, title }) {
      return {
        subtitle: amount || "Amount not specified",
        title: title || "Unnamed funding programme",
      };
    },
  },
});
