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
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import type { SERVICES_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = generateMetadataHelper({
  title: "Services",
  description: "Discover our services.",
  url: "/services",
});

function ServicesContent({
  services,
}: {
  services: SERVICES_QUERY_RESULT | null;
}) {
  return (
    <>
      <PageHeader position="left" title="Services" />
      <PageGrid basePath="services" items={services ?? []} />
    </>
  );
}

async function CachedServicesPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data: services } = await sanityFetch({
    query: SERVICES_QUERY,
    perspective,
    stega,
  });

  return <ServicesContent services={services} />;
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
