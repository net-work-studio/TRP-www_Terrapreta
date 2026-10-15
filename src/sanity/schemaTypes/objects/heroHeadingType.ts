import { type PortableTextBlock, toPlainText } from "next-sanity";
import { defineArrayMember, defineType } from "sanity";

export const heroHeadingType = defineType({
  name: "heroHeading",
  type: "array",
  description: "Write one heading. Use italic emphasis where needed.",
  of: [
    defineArrayMember({
      type: "block",
      styles: [],
      lists: [],
      marks: {
        decorators: [{ title: "Emphasis", value: "em" }],
        annotations: [],
      },
    }),
  ],
  validation: (rule) => [
    rule
      .required()
      .min(1)
      .error("Add the main hero heading before publishing."),
    rule.max(1).error("Keep the hero heading in a single paragraph."),
    rule.custom((value) =>
      !value || toPlainText(value as PortableTextBlock[]).trim()
        ? true
        : "The hero heading needs visible text."
    ),
    rule
      .custom((value) =>
        !value || toPlainText(value as PortableTextBlock[]).length <= 100
          ? true
          : "Aim for a heading under 100 characters so it stays easy to read."
      )
      .warning(),
  ],
});
