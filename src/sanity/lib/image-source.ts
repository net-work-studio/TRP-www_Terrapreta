import type {
  EditorialImage,
  SanityImageAsset as GeneratedSanityImageAsset,
} from "../types";

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

export type SanityImageField = {
  _type?: EditorialImage["_type"] | "image";
} & NullablePartial<Pick<EditorialImage, "crop" | "hotspot">> & {
    asset?: SanityImageAsset | null;
  };

export type SanityImageSourceInput =
  | {
      _type?: SanityImageField["_type"];
      alt?: string | null;
      altContent?: string | null;
      caption?: string | null;
      asset?: SanityImageAsset | null;
      hotspot?: SanityImageField["hotspot"];
      crop?: SanityImageField["crop"];
    }
  | null
  | undefined;

export function getSanityImageField(
  source: SanityImageSourceInput
): SanityImageField | null {
  if (!source) {
    return null;
  }

  if (source.asset) {
    return {
      _type: source._type,
      asset: source.asset,
      crop: source.crop,
      hotspot: source.hotspot,
    };
  }

  return null;
}

export function hasSanityImage(source: SanityImageSourceInput): boolean {
  const imageField = getSanityImageField(source);

  return Boolean(imageField?.asset?._id || imageField?.asset?.url);
}

export function getBlurDataUrl(
  source: SanityImageSourceInput
): string | undefined {
  const imageField = getSanityImageField(source);
  const lqip = imageField?.asset?.metadata?.lqip;

  return lqip ?? undefined;
}

export function getSanityImageAlt(
  source: SanityImageSourceInput,
  fallback = ""
): string {
  return source?.altContent || source?.alt || fallback;
}
