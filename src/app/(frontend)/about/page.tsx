import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutContent } from "@/components/features/about-content";
import { BreadcrumbJsonLd } from "@/components/shared/breadcrumb-json-ld";
import PageHeader from "@/components/shared/page-header";
import { getWebsitePageMetadata } from "@/lib/website-page-metadata";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  return getWebsitePageMetadata("aboutPage");
}

async function CachedAboutPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data: page } = await sanityFetch({
    query: ABOUT_PAGE_QUERY,
    perspective,
    stega,
  });

  if (!page) {
    notFound();
  }

  return (
    <>
      <AboutContent page={page} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
    </>
  );
}

async function DynamicAboutPage() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedAboutPage {...fetchOptions} />;
}

export default async function Page() {
  return renderSanityCacheBoundary({
    draft: <DynamicAboutPage />,
    fallback: <PageHeader position="left" title="About" />,
    published: <CachedAboutPage {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
