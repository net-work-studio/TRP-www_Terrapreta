import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import PageGrid from "@/components/layout/page-grid";
import PageHeader from "@/components/shared/page-header";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
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

async function CachedServicesPage({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const { data: services } = await sanityFetch({
    query: SERVICES_QUERY,
    perspective,
    stega,
  });

  return <ServicesContent services={services} />;
}

async function DynamicServicesPage() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedServicesPage perspective={perspective} stega={stega} />;
}

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<ServicesContent services={null} />}>
        <DynamicServicesPage />
      </Suspense>
    );
  }

  return <CachedServicesPage perspective="published" stega={false} />;
}
