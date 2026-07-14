import Link from "next/link";
import { stegaClean } from "next-sanity";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import SanityImage from "@/components/ui/sanity-image";
import { cn } from "@/lib/utils";
import type {
  JOURNAL_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
  Slug,
} from "@/sanity/types";

type GridItemProps = Partial<
  Omit<JOURNAL_QUERY_RESULT[0] | PROJECTS_QUERY_RESULT[0], "slug">
> & {
  _id: string;
  name: string | null;
  shortDescription: string | null;
  mainImage: {
    _type: "imageObject";
    image: {
      _type: "image";
      asset: {
        _id: string;
        url: string | null;
        metadata?: {
          lqip?: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
  isFeatured?: boolean;
  isInteractive?: boolean;
  publishingDate?: string | null;
  publicationScope?: string | null;
  slug: string;
  tag?: { _id: string; name: string | null } | null;
};

type GridItemInput = Omit<GridItemProps, "slug"> & {
  slug: Slug | null | string;
};

const IMAGE_QUALITY = 75;
const ASPECT_RATIO = 3 / 2;

function getSlugValue(slug: GridItemInput["slug"]): string | null {
  if (!slug) {
    return null;
  }

  if (typeof slug === "string") {
    return slug;
  }

  return slug.current || null;
}

function GridItem({
  name,
  mainImage,
  tag,
  isFeatured,
  isInteractive = true,
  slug,
  publishingDate,
}: GridItemProps) {
  if (!mainImage?.image?.asset) {
    return null;
  }

  const className = cn(
    "h-fit space-y-2.5",
    isInteractive && "group",
    isFeatured ? "col-span-2" : "col-span-1"
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
          sizes={isFeatured ? "50vw" : "30vw"}
          source={mainImage}
        />
      </AspectRatio>
      <hgroup className="space-y-2">
        {(tag?.name || publishingDate) && (
          <span className="flex items-center gap-2.5">
            {tag?.name && <Badge variant="secondary">{tag?.name}</Badge>}
            {publishingDate && (
              <time
                className="text-muted-foreground text-sm"
                dateTime={publishingDate}
              >
                {new Date(publishingDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            )}
          </span>
        )}
        <h2 className="text-xl">{name}</h2>
      </hgroup>
    </>
  );

  if (!isInteractive) {
    return <article className={className}>{content}</article>;
  }

  return (
    <Link className={className} href={slug}>
      {content}
    </Link>
  );
}

export default function PageGrid({
  items,
  basePath,
}: {
  items: GridItemInput[];
  basePath: string;
}) {
  return (
    <section className="container-site mx-auto grid w-full grid-cols-1 gap-x-5 gap-y-15 pb-40 starting:opacity-0 transition-opacity duration-300 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const slugValue = getSlugValue(item.slug);

        return (
          <GridItem
            key={item._id}
            {...item}
            isFeatured={item.gridDimension?.prominence === "featured"}
            isInteractive={
              Boolean(slugValue) &&
              stegaClean(item.publicationScope) !== "overview"
            }
            publishingDate={item.publishingDate ?? undefined}
            slug={slugValue ? `/${basePath}/${slugValue}` : "#"}
          />
        );
      })}
    </section>
  );
}
