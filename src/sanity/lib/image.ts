import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

type SanityImageAssetMetadata = {
  lqip?: string | null;
  dimensions?: {
    width?: number;
    height?: number;
    aspectRatio?: number;
  } | null;
};

type SanityImageAsset = {
  _id?: string;
  url?: string | null;
  metadata?: SanityImageAssetMetadata | null;
};

type SanityImageField = {
  _type?: string;
  asset?: SanityImageAsset | null;
  hotspot?: unknown;
  crop?: unknown;
};

export type SanityImageSourceInput = {
  _type?: string;
  alt?: string | null;
  altContent?: string | null;
  image?: SanityImageField | null;
  asset?: SanityImageAsset | null;
  hotspot?: unknown;
  crop?: unknown;
} | null | undefined;

const DEFAULT_FILL_WIDTH = 1920;
const DEFAULT_IMAGE_QUALITY = 75;

function resolveImageField(
  source: SanityImageSourceInput
): SanityImageField | null {
  if (!source) {
    return null;
  }

  if (source.image) {
    return source.image;
  }

  if (source.asset) {
    return source;
  }

  return null;
}

export function urlForImage(
  source: SanityImageSourceInput
): ImageUrlBuilder | null {
  const imageField = resolveImageField(source);

  if (!imageField?.asset?._id && !imageField?.asset?.url) {
    return null;
  }

  return urlFor(imageField as SanityImageSource);
}

export function getBlurDataUrl(
  source: SanityImageSourceInput
): string | undefined {
  const imageField = resolveImageField(source);
  const lqip = imageField?.asset?.metadata?.lqip;

  return lqip ?? undefined;
}

export function getSanityImageAlt(
  source: SanityImageSourceInput,
  fallback = ""
): string {
  return source?.altContent ?? source?.alt ?? fallback;
}

export function getSanityImageUrl(
  source: SanityImageSourceInput,
  options?: {
    fill?: boolean;
    width?: number;
    height?: number;
    quality?: number;
  }
): string | null {
  const imageBuilder = urlForImage(source);

  if (!imageBuilder) {
    return null;
  }

  const quality = options?.quality ?? DEFAULT_IMAGE_QUALITY;

  if (options?.fill) {
    return imageBuilder
      .width(DEFAULT_FILL_WIDTH)
      .quality(quality)
      .auto("format")
      .url();
  }

  return imageBuilder
    .width(options?.width ?? 800)
    .height(options?.height ?? 600)
    .quality(quality)
    .auto("format")
    .url();
}
