import { defineField } from "sanity";
import { WEBSITE_PAGES, type WebsitePageId } from "@/lib/website-pages";

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
    select: { metaTitle: "seo.metaTitle" },
    prepare({ metaTitle }: { metaTitle?: string }) {
      return {
        title: page.title,
        subtitle: `${page.path} · ${metaTitle || "Default SEO"}`,
      };
    },
  };
}
