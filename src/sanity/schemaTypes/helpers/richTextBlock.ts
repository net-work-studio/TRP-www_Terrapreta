import { defineArrayMember, defineField } from "sanity";

/**
 * Rich text block configuration with internal link support.
 * Use this for all Portable Text content fields to enable
 * reference-based internal linking that auto-updates when slugs change.
 */
export const richTextBlock = defineArrayMember({
  type: "block",
  marks: {
    annotations: [
      {
        name: "link",
        type: "object",
        title: "External Link",
        fields: [
          defineField({
            name: "href",
            type: "url",
            title: "URL",
            validation: (rule) => [
              rule.required().error("Add the URL this link points to."),
              rule
                .uri({
                  scheme: ["http", "https", "mailto", "tel"],
                })
                .error("URL must start with http, https, mailto, or tel."),
            ],
          }),
          defineField({
            name: "blank",
            type: "string",
            title: "Open in new tab",
            options: {
              list: [
                { title: "Yes", value: "true" },
                { title: "No", value: "false" },
              ],
              layout: "radio",
            },
            initialValue: "true",
          }),
        ],
      },
      {
        name: "internalLink",
        type: "object",
        title: "Internal Link",
        fields: [
          defineField({
            name: "reference",
            type: "reference",
            title: "Reference",
            to: [
              { type: "page" },
              { type: "journal" },
              { type: "project" },
              { type: "service" },
              { type: "research" },
              { type: "press" },
              { type: "about" },
            ],
            validation: (rule) => [
              rule
                .required()
                .error("Choose the document this link points to."),
            ],
          }),
        ],
      },
    ],
  },
});
