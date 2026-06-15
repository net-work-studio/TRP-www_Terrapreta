import type { Metadata } from "next";
import PageGrid from "@/components/layout/page-grid";
import PageHeader from "@/components/shared/page-header";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { JOURNAL_QUERY } from "@/sanity/lib/queries";
import type { JOURNAL_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = generateMetadataHelper({
  title: "Journal",
  description: "Read our latest journal entries.",
  url: "/journal",
});

function JournalContent({ journal }: { journal: JOURNAL_QUERY_RESULT | null }) {
  const validJournal =
    journal?.filter(
      (item): item is typeof item & { slug: { current: string } } =>
        Boolean(item.slug?.current)
    ) ?? [];

  const transformedJournal = validJournal.map((item) => ({
    ...item,
    slug: item.slug.current,
  }));

  return (
    <>
      <PageHeader position="left" title="Journal" />
      <PageGrid basePath="journal" items={transformedJournal} />
    </>
  );
}

async function CachedJournalPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data: journal } = await sanityFetch({
    query: JOURNAL_QUERY,
    perspective,
    stega,
  });

  return <JournalContent journal={journal} />;
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
