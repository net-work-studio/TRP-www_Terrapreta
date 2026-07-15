import { Minus } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { BreadcrumbJsonLd } from "@/components/shared/breadcrumb-json-ld";
import { JsonLd } from "@/components/shared/json-ld";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { portableTextComponents } from "@/components/ui/portable-text-components";
import SanityImage from "@/components/ui/sanity-image";
import SocialShare from "@/components/ui/social-share";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
import { cleanCommaList, cleanOptionalString } from "@/lib/sanity-stega";
import { getSiteSettings } from "@/lib/site-settings";
import { getSanityImageUrl, hasSanityImage } from "@/sanity/lib/image";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@/sanity/lib/live";
import {
  JOURNAL_ITEM_QUERY,
  JOURNAL_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { JOURNAL_ITEM_QUERY_RESULT } from "@/sanity/types";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

const ASPECT_RATIO = 16 / 9;
const IMAGE_QUALITY = 75;

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({
    query: JOURNAL_SLUGS_QUERY,
  });
  return data ?? [];
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const [{ slug }, { fetchOptions, isDraftMode }] = await Promise.all([
    params,
    getSanityRequestState(),
  ]);

  const [{ data: journalItem }, siteSettings] = await Promise.all([
    sanityFetchMetadata({
      query: JOURNAL_ITEM_QUERY,
      params: { slug },
      perspective: fetchOptions.perspective,
    }),
    getSiteSettings(fetchOptions),
  ]);

  if (!journalItem?.name) {
    return generateMetadataHelper({
      title: "Journal",
      description: "Read our latest journal entries.",
      url: "/journal",
      siteSettings,
      isDraftMode,
    });
  }

  return generateMetadataHelper({
    title: journalItem.seo?.metaTitle || journalItem.name,
    description:
      journalItem.seo?.metaDescription ||
      journalItem.shortDescription ||
      undefined,
    image: journalItem.seo?.ogImage ?? journalItem.mainImage ?? undefined,
    url: `/journal/${slug}`,
    type: "article",
    publishedTime: journalItem.publishingDate ?? undefined,
    canonicalUrl: journalItem.seo?.canonicalUrl ?? undefined,
    robotsIndex: journalItem.seo?.robotsIndex ?? undefined,
    robotsFollow: journalItem.seo?.robotsFollow ?? undefined,
    ogTitle: journalItem.seo?.ogTitle ?? undefined,
    ogDescription: journalItem.seo?.ogDescription ?? undefined,
    twitterCard: journalItem.seo?.twitterCard ?? undefined,
    siteSettings,
    isDraftMode,
  });
}

function JournalPageContent({
  journalItem,
  slug,
}: {
  journalItem: NonNullable<JOURNAL_ITEM_QUERY_RESULT>;
  slug: string;
}) {
  if (!hasSanityImage(journalItem.mainImage)) {
    notFound();
  }

  const schemaType =
    cleanOptionalString(journalItem.seo?.schemaType) || "BlogPosting";
  const knowsAbout = cleanCommaList(journalItem.seo?.customSchema?.knowsAbout);

  return (
    <article className="container-site flex flex-col items-center justify-center gap-5 pt-30 pb-20 md:pt-40">
      <hgroup className="flex starting:translate-y-2 translate-y-0 flex-col items-center justify-center gap-5 text-balance pb-5 text-center starting:opacity-0 transition-all duration-400">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/journal">Journal</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/journal">
                {journalItem.tag?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
          {journalItem.name}
        </h1>
        <p className="max-w-[70ch] text-pretty text-lg text-stone-400 md:text-xl lg:text-2xl">
          {journalItem.shortDescription}
        </p>
      </hgroup>

      <AspectRatio
        className="relative blur-none starting:blur-xl transition-all duration-400"
        ratio={ASPECT_RATIO}
      >
        <SanityImage
          alt={journalItem.name || ""}
          className="z-0 h-full w-full object-cover"
          fill
          priority
          quality={IMAGE_QUALITY}
          sizes="100vw"
          source={journalItem.mainImage}
        />
      </AspectRatio>

      <div className="container-article space-y-4 py-20">
        <ul className="flex items-center gap-2 text-lg text-muted-foreground">
          <li>{journalItem.location}</li>
          <Minus size={16} />
          <li>
            {journalItem.publishingDate
              ? new Date(journalItem.publishingDate).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : ""}
          </li>
        </ul>
        {journalItem.contentObject && (
          <section className="space-y-7.5 text-pretty text-lg md:text-xl lg:text-2xl">
            <PortableText
              components={portableTextComponents}
              value={journalItem.contentObject}
            />
          </section>
        )}
      </div>

      <SocialShare />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": schemaType,
          headline: journalItem.name,
          description: journalItem.shortDescription,
          ...(journalItem.publishingDate && {
            datePublished: journalItem.publishingDate,
          }),
          ...(hasSanityImage(journalItem.mainImage) && {
            image: getSanityImageUrl(journalItem.mainImage, { width: 1200 }),
          }),
          ...(journalItem.location && {
            locationCreated: journalItem.location,
          }),
          ...(knowsAbout && { knowsAbout }),
          author: {
            "@type": "Organization",
            name: "Terrapreta",
          },
          publisher: {
            "@type": "Organization",
            name: "Terrapreta",
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Journal", url: "/journal" },
          { name: journalItem.name || "Article", url: `/journal/${slug}` },
        ]}
      />
    </article>
  );
}

async function CachedJournalPage({
  slug,
  perspective,
  stega,
}: { slug: string } & SanityFetchOptions) {
  "use cache";

  const { data: journalItem } = await sanityFetch({
    query: JOURNAL_ITEM_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!journalItem) {
    notFound();
  }

  return <JournalPageContent journalItem={journalItem} slug={slug} />;
}

async function DynamicJournalPage({
  params,
}: SlugPageProps) {
  const [{ slug }, { fetchOptions }] = await Promise.all([
    params,
    getSanityRequestState(),
  ]);

  return <CachedJournalPage slug={slug} {...fetchOptions} />;
}

function JournalPageFallback() {
  return (
    <article
      aria-busy="true"
      className="container-site flex flex-col items-center justify-center gap-5 pt-30 pb-20 md:pt-40"
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 pb-5">
        <div className="h-4 w-40 animate-pulse rounded bg-stone-800" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-stone-800" />
        <div className="h-6 w-full max-w-[70ch] animate-pulse rounded bg-stone-800" />
      </div>
      <AspectRatio className="w-full" ratio={ASPECT_RATIO}>
        <div className="h-full w-full animate-pulse rounded bg-stone-800" />
      </AspectRatio>
      <div className="container-article w-full space-y-4 py-20">
        <div className="h-5 w-48 animate-pulse rounded bg-stone-800" />
        <div className="space-y-3 pt-4">
          <div className="h-6 w-full animate-pulse rounded bg-stone-800" />
          <div className="h-6 w-full animate-pulse rounded bg-stone-800" />
          <div className="h-6 w-2/3 animate-pulse rounded bg-stone-800" />
        </div>
      </div>
    </article>
  );
}

export default async function Page({ params }: SlugPageProps) {
  return renderSanityCacheBoundary({
    draft: <DynamicJournalPage params={params} />,
    fallback: <JournalPageFallback />,
    published: async () => {
      const { slug } = await params;
      return (
        <CachedJournalPage slug={slug} {...PUBLISHED_SANITY_FETCH_OPTIONS} />
      );
    },
  });
}
