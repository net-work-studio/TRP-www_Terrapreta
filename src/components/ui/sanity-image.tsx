import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import {
  getBlurDataUrl,
  getSanityImageAlt,
  getSanityImageUrl,
  type SanityImageSourceInput,
} from "@/sanity/lib/image";

type SanityImageProps = {
  source: SanityImageSourceInput;
} & Partial<ComponentProps<typeof Image>>;

export default function SanityImage({
  source,
  alt,
  width = 800,
  height = 600,
  fill,
  sizes,
  className,
  priority,
  quality = 75,
  ...props
}: SanityImageProps) {
  const url = getSanityImageUrl(source, {
    fill: Boolean(fill),
    width: Number(width),
    height: Number(height),
    quality: Number(quality),
  });

  if (!url) {
    return null;
  }

  const blurDataUrl = getBlurDataUrl(source);
  const imageAlt = getSanityImageAlt(source, alt ?? "");
  const blurProps = blurDataUrl
    ? { blurDataURL: blurDataUrl, placeholder: "blur" as const }
    : {};

  if (fill) {
    return (
      <Image
        alt={imageAlt}
        {...blurProps}
        className={cn("object-cover", className)}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes ?? "100vw"}
        src={url}
        {...props}
      />
    );
  }

  return (
    <Image
      alt={imageAlt}
      {...blurProps}
      className={cn("object-cover", className)}
      height={height}
      priority={priority}
      quality={quality}
      sizes={sizes}
      src={url}
      width={width}
      {...props}
    />
  );
}
