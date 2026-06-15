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
} from "@/components/ui/breadcrumb";
import { portableTextComponents } from "@/components/ui/portable-text-components";
import SanityImage from "@/components/ui/sanity-image";
import SocialShare from "@/components/ui/social-share";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
import { cleanCommaList, cleanOptionalString } from "@/lib/sanity-stega";
import { getSiteSettings } from "@/lib/site-settings";
import { urlFor } from "@/sanity/lib/image";
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
  PROJECT_ITEM_QUERY,
  PROJECT_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { PROJECT_ITEM_QUERY_RESULT } from "@/sanity/types";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

const ASPECT_RATIO = 16 / 9;
const IMAGE_QUALITY = 75;

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({
    query: PROJECT_SLUGS_QUERY,
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

  const [{ data: projectItem }, siteSettings] = await Promise.all([
    sanityFetchMetadata({
      query: PROJECT_ITEM_QUERY,
      params: { slug },
      perspective: fetchOptions.perspective,
    }),
    getSiteSettings(fetchOptions),
  ]);

  if (!projectItem?.name) {
    return generateMetadataHelper({
      title: "Projects",
      description: "Explore our latest projects.",
      url: "/projects",
      siteSettings,
      isDraftMode,
    });
  }

  return generateMetadataHelper({
    title: projectItem.seo?.metaTitle || projectItem.name,
    description:
      projectItem.seo?.metaDescription ||
      projectItem.shortDescription ||
      undefined,
    image:
      projectItem.seo?.ogImage ?? projectItem.mainImage?.image ?? undefined,
    url: `/projects/${slug}`,
    type: "article",
    canonicalUrl: projectItem.seo?.canonicalUrl ?? undefined,
    robotsIndex: projectItem.seo?.robotsIndex ?? undefined,
    robotsFollow: projectItem.seo?.robotsFollow ?? undefined,
    ogTitle: projectItem.seo?.ogTitle ?? undefined,
    ogDescription: projectItem.seo?.ogDescription ?? undefined,
    twitterCard: projectItem.seo?.twitterCard ?? undefined,
    siteSettings,
    isDraftMode,
  });
}

function ProjectPageContent({
  projectItem,
  slug,
}: {
  projectItem: NonNullable<PROJECT_ITEM_QUERY_RESULT>;
  slug: string;
}) {
  if (!projectItem.mainImage?.image) {
    notFound();
  }

  const schemaType = cleanOptionalString(projectItem.seo?.schemaType) || "Project";
  const statusLabel = projectItem.status
    ? cleanOptionalString(projectItem.status)?.replace("-", " ")
    : undefined;
  const knowsAbout = cleanCommaList(projectItem.seo?.customSchema?.knowsAbout);

  return (
    <article className="container-site flex flex-col items-center justify-center gap-5 pt-30 pb-20 md:pt-40">
      <hgroup className="flex starting:translate-y-2 translate-y-0 flex-col items-center justify-center gap-5 text-balance pb-5 text-center starting:opacity-0 transition-all duration-400">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
          {projectItem.name}
        </h1>
        <p className="max-w-[70ch] text-pretty text-lg text-stone-400 md:text-xl lg:text-2xl">
          {projectItem.shortDescription}
        </p>
      </hgroup>

      <AspectRatio
        className="relative blur-none starting:blur-xl transition-all duration-400"
        ratio={ASPECT_RATIO}
      >
        <SanityImage
          alt={projectItem.name || ""}
          className="z-0 h-full w-full object-cover"
          fill
          priority
          quality={IMAGE_QUALITY}
          sizes="100vw"
          source={projectItem.mainImage}
        />
      </AspectRatio>

      <div className="container-article space-y-4 py-20">
        <ul className="flex items-center gap-2 text-lg text-muted-foreground">
          {projectItem.location && (
            <>
              <li>{projectItem.location}</li>
              {projectItem.status && <Minus size={16} />}
            </>
          )}
          {projectItem.status && (
            <li className="capitalize">
              {statusLabel}
            </li>
          )}
        </ul>
        {projectItem.pageContent?.content && (
          <section className="space-y-7.5 text-pretty text-lg md:text-xl lg:text-2xl">
            <PortableText
              components={portableTextComponents}
              value={projectItem.pageContent.content}
            />
          </section>
        )}
      </div>

      <SocialShare />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": schemaType,
          name: projectItem.name,
          description: projectItem.shortDescription,
          ...(projectItem.location && { location: projectItem.location }),
          ...(projectItem.status && { status: projectItem.status }),
          ...(projectItem.mainImage?.image && {
            image: urlFor(projectItem.mainImage.image)
              .width(1200)
              .auto("format")
              .url(),
          }),
          ...(knowsAbout && { knowsAbout }),
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
          { name: projectItem.name || "Project", url: `/projects/${slug}` },
        ]}
      />
    </article>
  );
}

async function CachedProjectPage({
  slug,
  perspective,
  stega,
}: { slug: string } & SanityFetchOptions) {
  "use cache";

  const { data: projectItem } = await sanityFetch({
    query: PROJECT_ITEM_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!projectItem) {
    notFound();
  }

  return <ProjectPageContent projectItem={projectItem} slug={slug} />;
}

async function DynamicProjectPage({
  params,
}: SlugPageProps) {
  const [{ slug }, { fetchOptions }] = await Promise.all([
    params,
    getSanityRequestState(),
  ]);

  return <CachedProjectPage slug={slug} {...fetchOptions} />;
}

function ProjectPageFallback() {
  return (
    <article
      aria-busy="true"
      className="container-site flex flex-col items-center justify-center gap-5 pt-30 pb-20 md:pt-40"
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-5 pb-5">
        <div className="h-4 w-32 animate-pulse rounded bg-stone-800" />
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

export default async function Page({
  params,
}: SlugPageProps) {
  return renderSanityCacheBoundary({
    draft: <DynamicProjectPage params={params} />,
    fallback: <ProjectPageFallback />,
    published: async () => {
      const { slug } = await params;
      return (
        <CachedProjectPage slug={slug} {...PUBLISHED_SANITY_FETCH_OPTIONS} />
      );
    },
  });
}
