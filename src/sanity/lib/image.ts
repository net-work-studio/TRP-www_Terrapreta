import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import type {
  ImageObject,
  SanityImageAsset as GeneratedSanityImageAsset,
} from "../types";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

type GeneratedImageMetadata = NonNullable<
  GeneratedSanityImageAsset["metadata"]
>;
type NullablePartial<T> = {
  [TKey in keyof T]?: T[TKey] | null;
};
type SanityImageDimensions = Partial<
  Pick<
    NonNullable<GeneratedImageMetadata["dimensions"]>,
    "aspectRatio" | "height" | "width"
  >
>;
type SanityImageAssetMetadata = NullablePartial<
  Pick<GeneratedImageMetadata, "lqip">
> & {
  dimensions?: SanityImageDimensions | null;
};
type SanityImageAsset = Partial<
  Pick<GeneratedSanityImageAsset, "_id" | "url">
> & {
  metadata?: SanityImageAssetMetadata | null;
};

type GeneratedImageField = NonNullable<ImageObject["image"]>;
type SanityImageField = Partial<Pick<GeneratedImageField, "_type">> &
  NullablePartial<Pick<GeneratedImageField, "crop" | "hotspot">> & {
    asset?: SanityImageAsset | null;
  };

export type SanityImageSourceInput =
  | {
      _type?: ImageObject["_type"] | SanityImageField["_type"];
      alt?: string | null;
      altContent?: string | null;
      image?: SanityImageField | null;
      asset?: SanityImageAsset | null;
      hotspot?: SanityImageField["hotspot"];
      crop?: SanityImageField["crop"];
    }
  | null
  | undefined;

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
    return {
      _type: source._type === "image" ? source._type : undefined,
      asset: source.asset,
      crop: source.crop,
      hotspot: source.hotspot,
    };
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
  return source?.altContent || source?.alt || fallback;
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
