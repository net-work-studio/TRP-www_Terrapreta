import { AspectRatio } from "@/components/ui/aspect-ratio";
import SanityImage from "@/components/ui/sanity-image";
import type { ImageObject } from "@/sanity/types";

const LANDSCAPE_ASPECT_RATIO = 4 / 5;
const PORTRAIT_ASPECT_RATIO = 5 / 4;
const IMAGE_QUALITY = 75;

type PortableImageProps = {
  value: ImageObject & {
    _key?: string;
    image?: ImageObject["image"] & {
      asset?: {
        metadata?: {
          dimensions?: {
            width?: number;
            height?: number;
            aspectRatio?: number;
          };
        };
      };
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
};

function getAspectRatio(dimensions?: {
  width?: number;
  height?: number;
  aspectRatio?: number;
}): number {
  if (dimensions?.aspectRatio) {
    return dimensions.aspectRatio;
  }
  if (dimensions?.width && dimensions?.height) {
    return dimensions.width / dimensions.height;
  }
  return LANDSCAPE_ASPECT_RATIO;
}

export function PortableImage({ value }: PortableImageProps) {
  if (!value?.image) {
    return null;
  }

  const dimensions =
    value.image.dimensions ||
    (
      value.image.asset as
        | {
            metadata?: {
              dimensions?: {
                width?: number;
                height?: number;
                aspectRatio?: number;
              };
            };
          }
        | undefined
    )?.metadata?.dimensions;
  const aspectRatio = getAspectRatio(dimensions);

  let targetAspectRatio: number;
  if (dimensions) {
    targetAspectRatio = aspectRatio;
  } else {
    targetAspectRatio =
      aspectRatio < 1 ? PORTRAIT_ASPECT_RATIO : LANDSCAPE_ASPECT_RATIO;
  }

  return (
    <figure className="my-8">
      <AspectRatio className="relative" ratio={targetAspectRatio}>
        <SanityImage
          className="z-0 h-full w-full object-cover"
          fill
          quality={IMAGE_QUALITY}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          source={value}
        />
      </AspectRatio>
      {value.caption && (
        <figcaption className="mt-2 text-stone-400 text-xs">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
