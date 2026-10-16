import { defineField } from "sanity";
import {
  isWebsitePageWithHeadingId,
  WEBSITE_PAGE_HEADING_DEFAULTS,
  WEBSITE_PAGES,
  type WebsitePageId,
} from "@/lib/website-pages";

export function websitePageFields(pageId: WebsitePageId) {
  return [
    defineField({
      name: "name",
      type: "string",
      readOnly: true,
      initialValue: WEBSITE_PAGES[pageId].title,
      validation: (rule) => [
        rule.required().error("A fixed website page needs its page name."),
      ],
    }),
    ...(isWebsitePageWithHeadingId(pageId)
      ? [
          defineField({
            name: "headingOverride",
            type: "string",
            description: `Visible page heading. Leave empty to use SEO → Meta title, then “${WEBSITE_PAGE_HEADING_DEFAULTS[pageId]}”. Does not change metadata, menus or URLs.`,
            validation: (rule) => [
              rule
                .max(100)
                .warning(
                  "Keep the page heading concise; aim for 100 characters or fewer."
                ),
            ],
          }),
        ]
      : []),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoObject",
      initialValue: {
        robotsIndex: null,
        robotsFollow: null,
        twitterCard: null,
      },
      description:
        "Page-specific metadata. Leave overrides empty to use page and Site defaults.",
    }),
  ];
}

export function websitePagePreview(pageId: WebsitePageId) {
  const page = WEBSITE_PAGES[pageId];
  return {
    select: { metaTitle: "seo.metaTitle", heading: "headingOverride" },
    prepare({ metaTitle, heading }: { metaTitle?: string; heading?: string }) {
      return {
        title: page.title,
        subtitle: `${page.path} · ${heading || metaTitle || "Default heading and SEO"}`,
      };
    },
  };
}
