import { ArrowRightIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const redirectDoc = defineType({
  type: "document",
  name: "redirect",
  title: "Redirect",
  icon: ArrowRightIcon,
  fields: [
    defineField({
      type: "string",
      name: "source",
      title: "Source Path",
      description:
        "The path to redirect from (e.g., /old-page or /blog/:slug for wildcards)",
      validation: (rule) => [
        rule.required().error("A redirect needs a source path."),
        rule.custom((value) => {
          if (!value?.startsWith("/")) {
            return "Source path must start with /";
          }
          return true;
        }),
      ],
    }),
    defineField({
      type: "string",
      name: "destination",
      title: "Destination Path",
      description:
        "The path to redirect to (e.g., /new-page or /journal/:slug for wildcards)",
      validation: (rule) => [
        rule.required().error("A redirect needs a destination path."),
        rule.custom((value) => {
          if (!(value?.startsWith("/") || value?.startsWith("http"))) {
            return "Destination must start with / or be a full URL";
          }
          return true;
        }),
      ],
    }),
    defineField({
      type: "string",
      name: "permanent",
      title: "Redirect Type",
      description: "Choose redirect type: 308 for permanent, 307 for temporary",
      options: {
        list: [
          { title: "Permanent (308)", value: "permanent" },
          { title: "Temporary (307)", value: "temporary" },
        ],
        layout: "radio",
      },
      initialValue: "permanent",
      validation: (rule) => [
        rule.required().error("Choose whether this redirect is permanent."),
      ],
    }),
    defineField({
      type: "string",
      name: "isActive",
      title: "Status",
      description: "Enable or disable this redirect",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
    defineField({
      type: "text",
      name: "notes",
      title: "Notes",
      description:
        "Internal notes about this redirect (not displayed publicly)",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      source: "source",
      destination: "destination",
      permanent: "permanent",
      isActive: "isActive",
    },
    prepare({ source, destination, permanent, isActive }) {
      return {
        title: `${source} → ${destination}`,
        subtitle: `${permanent === "permanent" ? "308" : "307"} ${isActive === "inactive" ? "(inactive)" : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Source Path",
      name: "sourceAsc",
      by: [{ field: "source", direction: "asc" }],
    },
  ],
});
