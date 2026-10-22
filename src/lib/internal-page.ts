import { type StegaBranded, stegaClean } from "next-sanity";
import type { INTERNAL_PAGE_DESTINATION_QUERY_RESULT } from "@/sanity/types";
import {
  isLiveWebsitePageId,
  WEBSITE_PAGES,
  type WebsitePageId,
} from "./website-pages";

/** Resolve only pages that the website can currently render. */
export function getInternalPageHref(
  destination:
    | WebsitePageId
    | INTERNAL_PAGE_DESTINATION_QUERY_RESULT
    | StegaBranded<INTERNAL_PAGE_DESTINATION_QUERY_RESULT>
    | undefined,
  context: "public" | "hero" = "public"
): string | null {
  if (!destination) {
    return null;
  }

  // Most fixed routes have public fallbacks without a CMS document; About does not.
  if (typeof destination === "string") {
    return destination !== "aboutPage" &&
      isLiveWebsitePageId(destination) &&
      !(context === "hero" && destination === "homePage")
      ? WEBSITE_PAGES[destination].path
      : null;
  }

  const { _id, _type, slug, publicationScope, hasImage } =
    stegaClean(destination);

  if (isLiveWebsitePageId(_type)) {
    return !(context === "hero" && _type === "homePage") && _id === _type
      ? WEBSITE_PAGES[_type].path
      : null;
  }

  if (!slug?.trim()) {
    return null;
  }

  switch (_type) {
    case "project":
      return publicationScope === "full" && hasImage
        ? `/projects/${encodeURIComponent(slug)}`
        : null;
    case "journal":
      return hasImage ? `/journal/${encodeURIComponent(slug)}` : null;
    case "service":
      return `/services/${encodeURIComponent(slug)}`;
    default:
      return null;
  }
}
