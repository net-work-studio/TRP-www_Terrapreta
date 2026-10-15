import { AspectRatio } from "@/components/ui/aspect-ratio";
import SanityImage from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";
import {
  getSanityImageField,
  type SanityImageSourceInput,
} from "@/sanity/lib/image";

const LANDSCAPE_ASPECT_RATIO = 4 / 5;
const PORTRAIT_ASPECT_RATIO = 5 / 4;
const IMAGE_QUALITY = 75;

type PortableImageProps = {
  layout?: "article" | "contained";
  value: NonNullable<SanityImageSourceInput> & {
    _key?: string;
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
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

export function PortableImage({
  value,
  layout = "article",
}: PortableImageProps) {
  const imageField = getSanityImageField(value);

  if (!imageField?.asset) {
    return null;
  }

  const dimensions =
    value.dimensions || imageField.asset.metadata?.dimensions || undefined;
  const aspectRatio = getAspectRatio(dimensions);

  let targetAspectRatio: number;
  if (dimensions) {
    targetAspectRatio = aspectRatio;
  } else {
    targetAspectRatio =
      aspectRatio < 1 ? PORTRAIT_ASPECT_RATIO : LANDSCAPE_ASPECT_RATIO;
  }

  return (
    <figure
      className={cn(
        "relative",
        layout === "contained"
          ? "m-0 w-full"
          : "left-1/2 my-8 w-220 max-w-[calc(100vw-2rem)] -translate-x-1/2"
      )}
    >
      <AspectRatio className="relative" ratio={targetAspectRatio}>
        <SanityImage
          alt={value.caption || "Body content image"}
          className="z-0 h-full w-full object-cover"
          fill
          quality={IMAGE_QUALITY}
          sizes={
            layout === "contained"
              ? "(min-width: 1536px) 1472px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2rem)"
              : "(min-width: 912px) 880px, 100vw"
          }
          source={value}
        />
      </AspectRatio>
      {!!value.caption && (
        <figcaption className="mt-2 text-stone-400 text-xs">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
