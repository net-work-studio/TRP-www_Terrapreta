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
} & Partial<
  Omit<ComponentProps<typeof Image>, "src" | "fill" | "sizes" | "priority">
> &
  ({ fill: true; sizes: string } | { fill?: false; sizes?: string });

export default function SanityImage({
  source,
  alt,
  width = 800,
  height = 600,
  fill,
  sizes,
  className,
  preload,
  quality = 75,
  ...props
}: SanityImageProps) {
  const url = getSanityImageUrl(source);

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
        preload={preload}
        quality={quality}
        sizes={sizes}
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
      preload={preload}
      quality={quality}
      sizes={sizes}
      src={url}
      width={width}
      {...props}
    />
  );
}
