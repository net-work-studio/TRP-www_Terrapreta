import type { Metadata } from "next";
import { getJournalAuthors } from "@/components/features/journal-authorship";
import { SITE_DEFAULTS } from "@/lib/constants";
import { cleanPublishingDate } from "@/lib/journal-date";
import { formatSeoTitle } from "@/lib/seo-title";
import { WEBSITE_PAGES, type WebsitePageId } from "@/lib/website-pages";
import {
  getSanityImageAlt,
  getSanityImageUrl,
  type SanityImageSourceInput,
} from "@/sanity/lib/image";
import type {
  JOURNAL_ITEM_QUERY_RESULT,
  PROJECT_ITEM_QUERY_RESULT,
  SERVICE_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  WEBSITE_PAGE_SEO_QUERY_RESULT,
} from "@/sanity/types";

type DetailPageMetadataOptions = (
  | { kind: "project"; page: PROJECT_ITEM_QUERY_RESULT }
  | { kind: "journal"; page: JOURNAL_ITEM_QUERY_RESULT }
  | { kind: "service"; page: SERVICE_QUERY_RESULT }
) & {
  slug: string;
  siteSettings: SITE_SETTINGS_QUERY_RESULT;
  isDraftMode: boolean;
};

const DETAIL_PAGE_DEFAULTS = {
  project: {
    title: "Projects",
    description: "Explore our latest projects.",
    url: "/projects",
  },
  journal: {
    title: "Journal",
    description: "Read our latest journal entries.",
    url: "/journal",
  },
  service: {
    title: "Services",
    description: "Discover our services.",
    url: "/services",
  },
} as const;

interface GenerateMetadataOptions {
  title: string;
  description?: string;
  image?: SanityImageSourceInput | string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  canonicalUrl?: string;
  robotsIndex?: "index" | "noindex";
  robotsFollow?: "follow" | "nofollow";
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary_large_image" | "summary";
  siteSettings?: SITE_SETTINGS_QUERY_RESULT;
  isDraftMode?: boolean;
}

function getImageUrl(
  image: SanityImageSourceInput | string | undefined,
  defaultImage: SanityImageSourceInput
): { url: string; source?: SanityImageSourceInput; resized?: boolean } {
  if (typeof image === "string") {
    return { url: new URL(image, SITE_DEFAULTS.baseUrl).toString() };
  }

  if (image) {
    const imageUrl = getSanityImageUrl(image, { width: 1200, height: 630 });

    if (imageUrl) {
      return { url: imageUrl, source: image, resized: true };
    }
  }

  if (defaultImage) {
    const defaultImageUrl = getSanityImageUrl(defaultImage, {
      width: 1200,
      height: 630,
    });

    if (defaultImageUrl) {
      return { url: defaultImageUrl, source: defaultImage, resized: true };
    }
  }

  return {
    url: new URL(SITE_DEFAULTS.defaultImage, SITE_DEFAULTS.baseUrl).toString(),
  };
}

function getRobotsConfig(
  isDraftMode: boolean | undefined,
  robotsIndex: "index" | "noindex" | undefined,
  robotsFollow: "follow" | "nofollow" | undefined
): { index: boolean; follow: boolean } | undefined {
  if (isDraftMode) {
    return { index: false, follow: false };
  }

  if (robotsIndex || robotsFollow) {
    return {
      index: robotsIndex !== "noindex",
      follow: robotsFollow !== "nofollow",
    };
  }

  return undefined;
}

export function generateMetadata({
  title,
  description,
  image,
  url = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  canonicalUrl,
  robotsIndex,
  robotsFollow,
  ogTitle,
  ogDescription,
  twitterCard,
  siteSettings,
  isDraftMode,
}: GenerateMetadataOptions): Metadata {
  // Use site settings as fallbacks with hardcoded values as last resort
  const siteName = siteSettings?.brandName || SITE_DEFAULTS.name;
  const defaultDescription =
    siteSettings?.seo?.metaDescription || SITE_DEFAULTS.description;
  const defaultImage = siteSettings?.seo?.ogImage || null;

  const finalDescription = description || defaultDescription;
  const finalTwitterCard =
    twitterCard ||
    (siteSettings?.seo?.twitterCard as "summary_large_image" | "summary") ||
    "summary_large_image";

  const fullTitle = formatSeoTitle(title, siteName);
  const pageUrl = new URL(url, SITE_DEFAULTS.baseUrl).toString();
  const canonical = new URL(
    canonicalUrl || pageUrl,
    SITE_DEFAULTS.baseUrl
  ).toString();

  const socialImage = getImageUrl(image, defaultImage);
  const imageUrl = socialImage.url;
  const robotsConfig = getRobotsConfig(
    isDraftMode,
    robotsIndex ?? siteSettings?.seo?.robotsIndex ?? undefined,
    robotsFollow ?? siteSettings?.seo?.robotsFollow ?? undefined
  );
  const imageAlt = getSanityImageAlt(socialImage.source, title);

  // Open Graph values (use overrides or fall back to defaults)
  const ogTitleValue = ogTitle || fullTitle;
  const ogDescriptionValue = ogDescription || finalDescription;

  return {
    title: fullTitle,
    description: finalDescription,
    ...(robotsConfig && { robots: robotsConfig }),
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      siteName,
      title: ogTitleValue,
      description: ogDescriptionValue,
      url: canonical,
      images: [
        {
          url: imageUrl,
          ...(socialImage.resized && { width: 1200, height: 630 }),
          alt: imageAlt,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && authors.length > 0 && { authors }),
    },
    twitter: {
      card: finalTwitterCard,
      title: ogTitleValue,
      description: ogDescriptionValue,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
  };
}

export function generateDetailPageMetadata({
  kind,
  page,
  slug,
  siteSettings,
  isDraftMode,
}: DetailPageMetadataOptions): Metadata {
  const defaults = DETAIL_PAGE_DEFAULTS[kind];
  if (!page?.name) {
    return generateMetadata({ ...defaults, siteSettings, isDraftMode });
  }

  const journalMetadata =
    kind === "journal"
      ? {
          type: "article" as const,
          authors: getJournalAuthors(page.authors).map((author) => author.name),
          publishedTime: cleanPublishingDate(page.publishingDate) ?? undefined,
          modifiedTime: page._updatedAt,
        }
      : {};

  return generateMetadata({
    title: page.seo?.metaTitle || page.name,
    description:
      page.seo?.metaDescription || page.shortDescription || undefined,
    image: page.seo?.ogImage ?? page.mainImage,
    url: `${defaults.url}/${slug}`,
    canonicalUrl: page.seo?.canonicalUrl ?? undefined,
    robotsIndex: page.seo?.robotsIndex ?? undefined,
    robotsFollow: page.seo?.robotsFollow ?? undefined,
    ogTitle: page.seo?.ogTitle ?? undefined,
    ogDescription: page.seo?.ogDescription ?? undefined,
    twitterCard: page.seo?.twitterCard ?? undefined,
    ...journalMetadata,
    siteSettings,
    isDraftMode,
  });
}

export function generateWebsitePageMetadata({
  pageId,
  page,
  siteSettings,
  isDraftMode,
}: {
  pageId: WebsitePageId;
  page: WEBSITE_PAGE_SEO_QUERY_RESULT;
  siteSettings: SITE_SETTINGS_QUERY_RESULT;
  isDraftMode?: boolean;
}): Metadata {
  const definition = WEBSITE_PAGES[pageId];
  const seo = page?.seo;
  const defaults = siteSettings?.seo;
  const fallbackTitle =
    pageId === "homePage"
      ? defaults?.metaTitle ||
        siteSettings?.brandName ||
        definition.metadataTitle
      : definition.metadataTitle;

  return generateMetadata({
    title: seo?.metaTitle || fallbackTitle,
    description: seo?.metaDescription || definition.description,
    image: seo?.ogImage ?? undefined,
    url: definition.path,
    canonicalUrl: seo?.canonicalUrl || undefined,
    robotsIndex: seo?.robotsIndex ?? defaults?.robotsIndex ?? undefined,
    robotsFollow: seo?.robotsFollow ?? defaults?.robotsFollow ?? undefined,
    // Let the shared helper format the page's meta title for social previews.
    ogTitle:
      seo?.ogTitle ||
      (seo?.metaTitle ? undefined : defaults?.ogTitle || undefined),
    ogDescription:
      seo?.ogDescription ||
      seo?.metaDescription ||
      defaults?.ogDescription ||
      undefined,
    twitterCard: seo?.twitterCard ?? undefined,
    siteSettings,
    isDraftMode,
  });
}
