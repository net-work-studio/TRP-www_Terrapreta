import { getWebsitePageHeading } from "@/lib/website-page-heading";
import type { WebsitePageWithHeadingId } from "@/lib/website-pages";
import { type SanityFetchOptions, sanityFetch } from "./live";
import { WEBSITE_PAGE_HEADING_QUERY } from "./queries";

export async function fetchWebsitePageHeading({
  pageId,
  perspective,
  stega,
}: SanityFetchOptions & { pageId: WebsitePageWithHeadingId }) {
  "use cache";

  const { data: page } = await sanityFetch({
    query: WEBSITE_PAGE_HEADING_QUERY,
    params: { id: pageId },
    perspective,
    stega,
  });
  return getWebsitePageHeading(pageId, page);
}
