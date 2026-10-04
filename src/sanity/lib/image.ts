import type { ImageUrlBuilder, SanityImageSource } from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";

import { dataset, projectId } from "../env";
import {
  getSanityImageField,
  type SanityImageSourceInput,
} from "./image-source";

// biome-ignore lint/performance/noBarrelFile: Keep image metadata and URL helpers available through the shared image API.
export {
  getBlurDataUrl,
  getSanityImageAlt,
  getSanityImageField,
  getSanityImageWidthForHeight,
  hasSanityImage,
  type SanityImageSourceInput,
} from "./image-source";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);

const DEFAULT_IMAGE_QUALITY = 75;

export function urlForImage(
  source: SanityImageSourceInput
): ImageUrlBuilder | null {
  const imageField = getSanityImageField(source);

  if (!(imageField?.asset?._id || imageField?.asset?.url)) {
    return null;
  }

  return urlFor(imageField as SanityImageSource);
}

export function getSanityImageUrl(
  source: SanityImageSourceInput,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string | null {
  const imageBuilder = urlForImage(source);

  if (!imageBuilder) {
    return null;
  }

  if (!options) {
    return imageBuilder.url();
  }

  return imageBuilder
    .width(options.width ?? 800)
    .height(options.height ?? 600)
    .quality(options.quality ?? DEFAULT_IMAGE_QUALITY)
    .auto("format")
    .url();
}
