import type { Metadata } from "next";
import Link from "next/link";
import CalendarStefano from "@/components/features/calendar-stefano";
import PageHeader from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/lib/constants";
import { getWebsitePageMetadata } from "@/lib/website-page-metadata";
import { WEBSITE_PAGE_HEADING_DEFAULTS } from "@/lib/website-pages";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
} from "@/sanity/lib/live";
import { fetchWebsitePageHeading } from "@/sanity/lib/website-page-heading";

export async function generateMetadata(): Promise<Metadata> {
  return getWebsitePageMetadata("contactPage");
}

async function CachedContactHeading(options: SanityFetchOptions) {
  "use cache";

  const title = await fetchWebsitePageHeading({
    pageId: "contactPage",
    ...options,
  });
  return <PageHeader position="left" title={title} />;
}

async function DynamicContactHeading() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedContactHeading {...fetchOptions} />;
}

async function ContactHeading() {
  return renderSanityCacheBoundary({
    draft: <DynamicContactHeading />,
    fallback: (
      <PageHeader
        position="left"
        title={WEBSITE_PAGE_HEADING_DEFAULTS.contactPage}
      />
    ),
    published: <CachedContactHeading {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}

export default function ContactsPage() {
  return (
    <>
      <ContactHeading />

      <section className="container-site grid w-full grid-cols-1 items-start justify-start gap-10 py-20 lg:grid-cols-[60%_40%]">
        <CalendarStefano />
        <div className="flex flex-col items-start justify-center gap-10">
          <h2 className="font-bold text-2xl">Write us an email</h2>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href={`mailto:${SITE_DEFAULTS.email}`}
          >
            {SITE_DEFAULTS.email}
          </Link>
        </div>
      </section>
    </>
  );
}
