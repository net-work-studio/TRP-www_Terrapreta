import type { WEBSITE_PAGE_HEADING_QUERY_RESULT } from "@/sanity/types";
import { cleanOptionalString, type StegaAware } from "./sanity-stega";
import {
  WEBSITE_PAGE_HEADING_DEFAULTS,
  type WebsitePageWithHeadingId,
} from "./website-pages";

export function getWebsitePageHeading(
  pageId: WebsitePageWithHeadingId,
  page: StegaAware<WEBSITE_PAGE_HEADING_QUERY_RESULT> | undefined
): string {
  for (const value of [page?.headingOverride, page?.seo?.metaTitle]) {
    if (value && cleanOptionalString(value)?.trim()) {
      // Preserve the source field's Visual Editing annotation in visible text.
      return value;
    }
  }
  return WEBSITE_PAGE_HEADING_DEFAULTS[pageId];
}
