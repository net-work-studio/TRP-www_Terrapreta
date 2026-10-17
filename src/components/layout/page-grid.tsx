import Link from "next/link";
import { stegaClean } from "next-sanity";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import SanityImage from "@/components/ui/sanity-image";
import { getInternalPageHref } from "@/lib/internal-page";
import { cleanPublishingDate, formatPublishingDate } from "@/lib/journal-date";
import type { StegaAware } from "@/lib/sanity-stega";
import { cn } from "@/lib/utils";
import {
  hasSanityImage,
  type SanityImageSourceInput,
} from "@/sanity/lib/image";
import type { INTERNAL_PAGE_DESTINATION_QUERY_RESULT } from "@/sanity/types";

type GridItemProps = {
  _id: string;
  name: StegaAware<string> | null;
  shortDescription: StegaAware<string> | null;
  mainImage: SanityImageSourceInput;
  isFeatured?: boolean;
  publishingDate?: StegaAware<string> | null;
  href: string | null;
  tag?: { _id: string; name: StegaAware<string> | null } | null;
};

type GridItemInput = Omit<GridItemProps, "href" | "isFeatured"> & {
  destination: StegaAware<INTERNAL_PAGE_DESTINATION_QUERY_RESULT>;
  gridDimension?: {
    prominence: StegaAware<"featured" | "standard">;
  } | null;
};

const IMAGE_QUALITY = 75;
const ASPECT_RATIO = 3 / 2;

function GridItem({
  name,
  mainImage,
  tag,
  isFeatured,
  href,
  publishingDate,
}: GridItemProps) {
  if (!hasSanityImage(mainImage)) {
    return null;
  }

  const isInteractive = Boolean(href);
  const publishingDateValue = cleanPublishingDate(publishingDate);
  const publishingDateLabel = formatPublishingDate(publishingDate);
  const className = cn(
    "h-fit space-y-2.5",
    isInteractive && "group",
    isFeatured ? "md:col-span-2" : "col-span-1"
  );
  const content = (
    <>
      <AspectRatio className="relative overflow-hidden" ratio={ASPECT_RATIO}>
        <SanityImage
          alt={name || ""}
          className={cn(
            "h-full w-full object-cover",
            isInteractive &&
              "transition-transform duration-300 group-hover:scale-103"
          )}
          fill
          quality={IMAGE_QUALITY}
          sizes={
            isFeatured
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          }
          source={mainImage}
        />
      </AspectRatio>
      <hgroup className="space-y-2">
        {!!(tag?.name || publishingDateValue) && (
          <span className="flex items-center gap-2.5">
            {!!tag?.name && <Badge variant="secondary">{tag?.name}</Badge>}
            {!!publishingDateValue && (
              <time
                className="text-muted-foreground text-sm"
                dateTime={publishingDateValue}
              >
                {publishingDateLabel}
              </time>
            )}
          </span>
        )}
        <h2 className="text-xl">{name}</h2>
      </hgroup>
    </>
  );

  if (!href) {
    return <article className={className}>{content}</article>;
  }

  return (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}

export default function PageGrid({ items }: { items: GridItemInput[] }) {
  return (
    <section className="container-site mx-auto grid w-full grid-cols-1 gap-x-5 gap-y-15 pb-40 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const href = getInternalPageHref(item.destination);

        return (
          <GridItem
            key={item._id}
            {...item}
            href={href}
            isFeatured={
              stegaClean(item.gridDimension?.prominence) === "featured"
            }
            publishingDate={item.publishingDate ?? undefined}
          />
        );
      })}
    </section>
  );
}
