import { generateMetadata, generateWebsitePageMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import type { WebsitePageId } from "@/lib/website-pages";
import { getSanityRequestState, sanityFetchMetadata } from "@/sanity/lib/live";
import { WEBSITE_PAGE_SEO_QUERY } from "@/sanity/lib/queries";

export async function getWebsitePageMetadata(pageId: WebsitePageId) {
  const { fetchOptions, isDraftMode } = await getSanityRequestState();
  const [{ data: page }, siteSettings] = await Promise.all([
    sanityFetchMetadata({
      query: WEBSITE_PAGE_SEO_QUERY,
      params: { id: pageId },
      perspective: fetchOptions.perspective,
    }),
    getSiteSettings(fetchOptions),
  ]);

  return generateWebsitePageMetadata({
    pageId,
    page,
    siteSettings,
    isDraftMode,
  });
}

export async function getStaticPageMetadata(options: {
  title: string;
  description: string;
  url: string;
}) {
  const { fetchOptions, isDraftMode } = await getSanityRequestState();
  const siteSettings = await getSiteSettings(fetchOptions);
  return generateMetadata({ ...options, siteSettings, isDraftMode });
}
