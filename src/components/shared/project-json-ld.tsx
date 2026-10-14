import { SITE_DEFAULTS } from "@/lib/constants";
import { cleanCommaList, type StegaAware } from "@/lib/sanity-stega";
import { getSanityImageUrl, hasSanityImage } from "@/sanity/lib/image";
import type { PROJECT_ITEM_QUERY_RESULT } from "@/sanity/types";
import { JsonLd } from "./json-ld";

export function ProjectJsonLd({
  project,
  slug,
}: {
  project: StegaAware<
    Pick<
      NonNullable<PROJECT_ITEM_QUERY_RESULT>,
      "name" | "shortDescription" | "location" | "seo"
    > &
      Partial<Pick<NonNullable<PROJECT_ITEM_QUERY_RESULT>, "mainImage">>
  >;
  slug: string;
}) {
  const keywords = cleanCommaList(project.seo?.customSchema?.knowsAbout);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.name,
        description: project.shortDescription,
        url:
          project.seo?.canonicalUrl ||
          new URL(`/projects/${slug}`, SITE_DEFAULTS.baseUrl).toString(),
        ...(project.location && {
          contentLocation: { "@type": "Place", name: project.location },
        }),
        ...(hasSanityImage(project.mainImage) && {
          image: getSanityImageUrl(project.mainImage, { width: 1200 }),
        }),
        ...(keywords && { keywords }),
      }}
    />
  );
}
