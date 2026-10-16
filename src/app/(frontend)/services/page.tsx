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
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { fetchWebsitePageHeading } from "@/sanity/lib/website-page-heading";
import type { SERVICES_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  return getWebsitePageMetadata("servicesIndexPage");
}

function ServicesContent({
  services,
  title = WEBSITE_PAGE_HEADING_DEFAULTS.servicesIndexPage,
}: {
  services: StegaAware<SERVICES_QUERY_RESULT> | null;
  title?: string;
}) {
  return (
    <>
      <PageHeader position="left" title={title} />
      <PageGrid basePath="services" items={services ?? []} />
    </>
  );
}

async function CachedServicesPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const [{ data: services }, title] = await Promise.all([
    sanityFetch({ query: SERVICES_QUERY, perspective, stega }),
    fetchWebsitePageHeading({
      pageId: "servicesIndexPage",
      perspective,
      stega,
    }),
  ]);

  return <ServicesContent services={services} title={title} />;
}

async function DynamicServicesPage() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedServicesPage {...fetchOptions} />;
}

export default async function Page() {
  return renderSanityCacheBoundary({
    draft: <DynamicServicesPage />,
    fallback: <ServicesContent services={null} />,
    published: <CachedServicesPage {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
