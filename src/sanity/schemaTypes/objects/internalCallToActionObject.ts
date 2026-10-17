import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";
import { getInternalPageHref } from "@/lib/internal-page";
import { LIVE_WEBSITE_PAGE_IDS } from "@/lib/website-pages";
import { apiVersion } from "@/sanity/env";
import {
  INTERNAL_PAGE_DESTINATION_QUERY,
  INTERNAL_PAGE_REFERENCE_FILTER,
} from "@/sanity/lib/queries";

const PAGE_IDS = LIVE_WEBSITE_PAGE_IDS.filter((id) => id !== "homePage");

export const internalCallToActionObject = defineType({
  name: "internalCallToAction",
  title: "Button",
  type: "object",
  icon: LinkIcon,
  initialValue: {
    visibility: "hidden",
    label: "Learn more",
    destinationType: "section",
  },
  fieldsets: [{ name: "link", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "visibility",
      type: "string",
      initialValue: "hidden",
      description: "Hide the button without deleting its text or destination.",
      options: {
        list: [
          { title: "Hide", value: "hidden" },
          { title: "Show", value: "shown" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule.required().error("Choose whether to show or hide the button."),
        rule.custom((value) =>
          value === undefined || value === "hidden" || value === "shown"
            ? true
            : "Choose Show or Hide."
        ),
      ],
    }),
    defineField({
      name: "destinationType",
      title: "Destination",
      type: "string",
      initialValue: "section",
      description:
        "Scroll to the next section, or open another page on this website.",
      hidden: ({ parent }) => parent?.visibility !== "shown",
      options: {
        list: [
          { title: "Next section on this page", value: "section" },
          { title: "Another internal page", value: "page" },
        ],
        layout: "radio",
      },
      validation: (rule) => [
        rule.custom((value) =>
          value === undefined || value === "section" || value === "page"
            ? true
            : "Choose the next section or another internal page."
        ),
      ],
    }),
    defineField({
      name: "label",
      title: "Button text",
      type: "string",
      initialValue: "Learn more",
      fieldset: "link",
      hidden: ({ parent }) => parent?.visibility !== "shown",
      validation: (rule) => [
        rule.custom((value, context) =>
          (context.parent as { visibility?: string } | undefined)
            ?.visibility !== "shown" || value?.trim()
            ? true
            : "Add button text before showing the button."
        ),
        rule.max(40).warning("Keep button text short and clear."),
      ],
    }),
    defineField({
      name: "page",
      title: "Internal page",
      type: "reference",
      weak: true,
      fieldset: "link",
      description:
        "Choose a published internal page. The button hides if its destination becomes unavailable.",
      to: [
        ...PAGE_IDS.map((type) => ({ type })),
        { type: "project" },
        { type: "journal" },
        { type: "service" },
      ],
      options: {
        disableNew: true,
        filter: INTERNAL_PAGE_REFERENCE_FILTER,
        filterParams: { pageIds: PAGE_IDS },
      },
      hidden: ({ parent }) =>
        parent?.visibility !== "shown" ||
        (parent?.destinationType ??
          (parent?.page?._ref ? "page" : "section")) !== "page",
      validation: (rule) => [
        rule.custom(async (value, context) => {
          const parent = context.parent as
            | {
                visibility?: string;
                destinationType?: string;
              }
            | undefined;
          if (
            parent?.visibility !== "shown" ||
            parent.destinationType === "section"
          ) {
            return true;
          }
          if (!value?._ref) {
            // Existing buttons without a destination default to the next section.
            return parent.destinationType === "page"
              ? "Choose an internal page before showing the button."
              : true;
          }
          const destination = await context
            .getClient({ apiVersion })
            .withConfig({ perspective: "published", useCdn: false })
            .fetch(INTERNAL_PAGE_DESTINATION_QUERY, { id: value._ref });

          return getInternalPageHref(destination, "hero")
            ? true
            : "Choose a published page with a working public URL.";
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "label",
      visibility: "visibility",
      destinationType: "destinationType",
      page: "page.name",
      pageId: "page._ref",
    },
    prepare({ title, visibility, destinationType, page, pageId }) {
      const resolvedDestinationType =
        destinationType ?? (pageId ? "page" : "section");
      let subtitle = "Hidden";
      if (visibility === "shown") {
        subtitle =
          resolvedDestinationType === "section"
            ? "Next section on this page"
            : page || "Choose an internal page";
      }
      return {
        title: title || "Hero button",
        subtitle,
      };
    },
  },
});
