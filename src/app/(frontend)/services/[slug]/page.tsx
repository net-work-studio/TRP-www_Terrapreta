import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { BreadcrumbJsonLd } from "@/components/shared/breadcrumb-json-ld";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { portableTextComponents } from "@/components/ui/portable-text-components";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
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
  SERVICE_QUERY,
  SERVICE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { SERVICE_QUERY_RESULT } from "@/sanity/types";

type SlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({
    query: SERVICE_SLUGS_QUERY,
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

  const [{ data: service }, siteSettings] = await Promise.all([
    sanityFetchMetadata({
      query: SERVICE_QUERY,
      params: { slug },
      perspective: fetchOptions.perspective,
    }),
    getSiteSettings(fetchOptions),
  ]);

  if (!service?.name) {
    return generateMetadataHelper({
      title: "Services",
      description: "Discover our services.",
      url: "/services",
      siteSettings,
      isDraftMode,
    });
  }

  return generateMetadataHelper({
    title: service.seo?.metaTitle || service.name,
    description:
      service.seo?.metaDescription || service.shortDescription || undefined,
    image: service.seo?.ogImage ?? service.mainImage?.image ?? undefined,
    url: `/services/${slug}`,
    canonicalUrl: service.seo?.canonicalUrl ?? undefined,
    robotsIndex: service.seo?.robotsIndex ?? undefined,
    robotsFollow: service.seo?.robotsFollow ?? undefined,
    ogTitle: service.seo?.ogTitle ?? undefined,
    ogDescription: service.seo?.ogDescription ?? undefined,
    twitterCard: service.seo?.twitterCard ?? undefined,
    siteSettings,
    isDraftMode,
  });
}

function ServicePageContent({
  service,
  slug,
}: {
  service: NonNullable<SERVICE_QUERY_RESULT>;
  slug: string;
}) {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-20 bg-stone-800 py-40">
        <div className="container-site grid grid-cols-1 gap-20 lg:grid-cols-[40%_60%] lg:gap-5">
          <div className="flex flex-col items-start justify-center gap-10">
            <hgroup className="flex w-full flex-col items-start justify-center gap-1.5">
              <h1 className="font-bold text-4xl">{service.name}</h1>
              <p className="max-w-prose text-pretty text-lg text-stone-300">
                {service.shortDescription}
              </p>
            </hgroup>
            <Button>
              <Link href="/contacts">Book a Discovery Call</Link>
            </Button>
          </div>
          <div className="container-site relative aspect-3/2 rounded-md">
            {service.mainImage?.image && (
              <Image
                alt={service.name || ""}
                blurDataURL={urlFor(service.mainImage.image)
                  .width(24)
                  .height(24)
                  .quality(5)
                  .auto("format")
                  .url()}
                className="z-0 aspect-4/5 h-full w-full rounded-md object-cover object-center"
                fill
                placeholder="blur"
                quality={75}
                src={urlFor(service.mainImage.image)
                  .quality(75)
                  .auto("format")
                  .url()}
              />
            )}
          </div>
        </div>
      </div>

      <article className="container-article container-site space-y-20 py-20">
        {service.clients && (
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-2xl">Our Clients</h3>
            <div className="flex flex-row items-center justify-center gap-5">
              {service.clients
                ?.filter(
                  (client: {
                    _id: string;
                    name: string | null;
                    logoDark: {
                      asset: {
                        _id: string;
                        _type: "sanity.imageAsset";
                        url: string | null;
                      } | null;
                    } | null;
                  }): client is {
                    _id: string;
                    name: string;
                    logoDark: {
                      asset: {
                        _id: string;
                        _type: "sanity.imageAsset";
                        url: string;
                      };
                    };
                  } => Boolean(client.name && client.logoDark?.asset?._id)
                )
                .map(
                  (client: {
                    _id: string;
                    name: string;
                    logoDark: {
                      asset: {
                        _id: string;
                        _type: "sanity.imageAsset";
                        url: string;
                      };
                    };
                  }) => {
                    const logoAsset = client.logoDark.asset;
                    return (
                      <div key={client._id}>
                        <Image
                          alt={client.name}
                          blurDataURL={urlFor(logoAsset)
                            .width(24)
                            .height(24)
                            .quality(5)
                            .auto("format")
                            .url()}
                          height={100}
                          src={urlFor(logoAsset)
                            .quality(75)
                            .auto("format")
                            .url()}
                          width={100}
                        />
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-start justify-center space-y-2.5">
          <h3 className="font-bold text-2xl">Our Capabilities</h3>
          <div className="flex flex-row flex-wrap items-start justify-start gap-x-2.5 gap-y-3">
            {service.capabilities
              ?.filter(
                (capability: {
                  _id: string;
                  name: string | null;
                }): capability is { _id: string; name: string } =>
                  Boolean(capability.name)
              )
              .map((capability: { _id: string; name: string }) => (
                <div
                  className="rounded-full border border-stone-500 px-3 py-1.5 text-stone-100"
                  key={capability._id}
                >
                  {capability.name}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-center space-y-5 text-lg md:text-xl lg:text-2xl">
          {service.content && (
            <PortableText
              components={portableTextComponents}
              value={service.content}
            />
          )}
        </div>
      </article>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.name || "Service", url: `/services/${slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": service.seo?.schemaType || "Service",
          name: service.name,
          description: service.shortDescription,
          provider: {
            "@type": "Organization",
            name: "Terrapreta",
            url: "https://terrapreta.it",
            ...(service.seo?.customSchema?.knowsAbout && {
              knowsAbout: service.seo.customSchema.knowsAbout
                .split(",")
                .map((s: string) => s.trim()),
            }),
          },
          serviceType: "Environmental Consulting",
          areaServed: {
            "@type": "Place",
            name: "Europe",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Terrapreta Services",
            itemListElement:
              service.seo?.customSchema?.hasOfferCatalog &&
              service.seo.customSchema.hasOfferCatalog.length > 0
                ? service.seo.customSchema.hasOfferCatalog.map(
                    (item: string) => ({
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: item,
                      },
                    })
                  )
                : [
                    {
                      "@type": "Offer",
                      itemOffered: {
                        "@type": "Service",
                        name: service.name,
                        description: service.shortDescription,
                      },
                    },
                  ],
          },
          ...(service.mainImage?.image && {
            image: urlFor(service.mainImage.image)
              .width(1200)
              .auto("format")
              .url(),
          }),
        }}
        id="service-json-ld"
      />
    </>
  );
}

async function CachedServicePage({
  slug,
  perspective,
  stega,
}: { slug: string } & SanityFetchOptions) {
  "use cache";

  const { data: service } = await sanityFetch({
    query: SERVICE_QUERY,
    params: { slug },
    perspective,
    stega,
  });

  if (!service) {
    notFound();
  }

  return <ServicePageContent service={service} slug={slug} />;
}

async function DynamicServicePage({
  params,
}: SlugPageProps) {
  const [{ slug }, { fetchOptions }] = await Promise.all([
    params,
    getSanityRequestState(),
  ]);

  return <CachedServicePage slug={slug} {...fetchOptions} />;
}

function ServicePageFallback() {
  return (
    <div aria-busy="true">
      <div className="flex w-full flex-col items-center justify-center gap-20 bg-stone-800 py-40">
        <div className="container-site grid grid-cols-1 gap-20 lg:grid-cols-[40%_60%] lg:gap-5">
          <div className="flex flex-col items-start justify-center gap-10">
            <div className="flex w-full flex-col gap-1.5">
              <div className="h-10 w-2/3 animate-pulse rounded bg-stone-700" />
              <div className="h-6 w-full max-w-prose animate-pulse rounded bg-stone-700" />
            </div>
            <div className="h-10 w-48 animate-pulse rounded bg-stone-700" />
          </div>
          <div className="container-site relative aspect-3/2 w-full animate-pulse rounded-md bg-stone-700" />
        </div>
      </div>
      <div className="container-article container-site space-y-5 py-20">
        <div className="h-6 w-full animate-pulse rounded bg-stone-800" />
        <div className="h-6 w-full animate-pulse rounded bg-stone-800" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-stone-800" />
      </div>
    </div>
  );
}

export default async function Page({
  params,
}: SlugPageProps) {
  return renderSanityCacheBoundary({
    draft: <DynamicServicePage params={params} />,
    fallback: <ServicePageFallback />,
    published: async () => {
      const { slug } = await params;
      return (
        <CachedServicePage slug={slug} {...PUBLISHED_SANITY_FETCH_OPTIONS} />
      );
    },
  });
}
