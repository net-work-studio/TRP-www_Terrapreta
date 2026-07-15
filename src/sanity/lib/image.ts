import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";
import {
  getBlurDataUrl,
  getSanityImageAlt,
  getSanityImageField,
  hasSanityImage,
  type SanityImageSourceInput,
} from "./image-source";

export {
  getBlurDataUrl,
  getSanityImageAlt,
  getSanityImageField,
  hasSanityImage,
  type SanityImageSourceInput,
} from "./image-source";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

const DEFAULT_FILL_WIDTH = 1920;
const DEFAULT_IMAGE_QUALITY = 75;

export function urlForImage(
  source: SanityImageSourceInput
): ImageUrlBuilder | null {
  const imageField = getSanityImageField(source);

  if (!imageField?.asset?._id && !imageField?.asset?.url) {
    return null;
  }

  return urlFor(imageField as SanityImageSource);
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
