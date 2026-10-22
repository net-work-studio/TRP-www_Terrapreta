import type { Metadata } from "next";
import PageGrid from "@/components/layout/page-grid";
import PageHeader from "@/components/shared/page-header";
import type { StegaAware } from "@/lib/sanity-stega";
import { getWebsitePageMetadata } from "@/lib/website-page-metadata";
import { WEBSITE_PAGE_HEADING_DEFAULTS } from "@/lib/website-pages";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { JOURNAL_QUERY } from "@/sanity/lib/queries";
import { fetchWebsitePageHeading } from "@/sanity/lib/website-page-heading";
import type { JOURNAL_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  return getWebsitePageMetadata("journalIndexPage");
}

function JournalContent({
  journal,
  title = WEBSITE_PAGE_HEADING_DEFAULTS.journalIndexPage,
}: {
  journal: StegaAware<JOURNAL_QUERY_RESULT> | null;
  title?: string;
}) {
  const validJournal =
    journal?.filter((item) => Boolean(item.slug?.current)) ?? [];

  return (
    <>
      <PageHeader position="left" title={title} />
      <PageGrid items={validJournal} />
    </>
  );
}

async function CachedJournalPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const [{ data: journal }, title] = await Promise.all([
    sanityFetch({ query: JOURNAL_QUERY, perspective, stega }),
    fetchWebsitePageHeading({ pageId: "journalIndexPage", perspective, stega }),
  ]);

  return <JournalContent journal={journal} title={title} />;
}

async function DynamicJournalPage() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedJournalPage {...fetchOptions} />;
}

export default async function Page() {
  return renderSanityCacheBoundary({
    draft: <DynamicJournalPage />,
    fallback: <JournalContent journal={null} />,
    published: <CachedJournalPage {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
