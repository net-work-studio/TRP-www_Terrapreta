import { ArrowDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
  type StegaBranded,
  stegaClean,
} from "next-sanity";
import { buttonVariants } from "@/components/ui/button";
import SanityImage from "@/components/ui/sanity-image";
import { getInternalPageHref } from "@/lib/internal-page";
import { cn } from "@/lib/utils";
import { hasSanityImage } from "@/sanity/lib/image-source";
import type { HOME_HERO_QUERY_RESULT } from "@/sanity/types";

type HeroContent = NonNullable<HOME_HERO_QUERY_RESULT>["hero"];
type Hero = HeroContent | StegaBranded<HeroContent>;

const headingComponents: Partial<PortableTextComponents> = {
  block: { normal: ({ children }) => <>{children}</> },
};

function isCompleteHero(hero: Hero | null | undefined): hero is Hero {
  return Boolean(
    hasSanityImage(hero?.image) &&
      stegaClean(hero?.image?.altContent)?.trim() &&
      stegaClean(hero?.description)?.trim() &&
      hero?.heading?.some((block) =>
        block.children?.some((span) => stegaClean(span.text)?.trim())
      )
  );
}

export function HomeHeroContent({ hero }: { hero: Hero | null | undefined }) {
  // Keep the existing public hero until a complete CMS hero is published.
  const content = isCompleteHero(hero) ? hero : null;
  const button = content?.button;
  let buttonHref: string | null = null;
  if (!content) {
    buttonHref = "#learn-more";
  } else if (
    stegaClean(button?.visibility) === "shown" &&
    stegaClean(button?.label)?.trim()
  ) {
    const destinationType = stegaClean(button?.destinationType);
    if (destinationType === "section") {
      buttonHref = "#learn-more";
    } else if (destinationType === "page") {
      buttonHref = getInternalPageHref(button?.page, "hero");
    }
  }
  const scrollCue = content
    ? (stegaClean(content.scrollCue) ?? "static")
    : "animated";
  const hotspot = content?.image.hotspot;

  return (
    <div className="h-[90svh] w-full">
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="z-10 flex flex-col items-center justify-center gap-8">
          <hgroup className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-2.5 text-center">
            <h1 className="text-balance font-bold text-4xl md:text-5xl lg:text-6xl">
              {content ? (
                <PortableText
                  components={headingComponents}
                  value={content.heading}
                />
              ) : (
                <>
                  Regenerating ecosystems from the <em>soil up</em>
                </>
              )}
            </h1>
            <p className="text-pretty text-2xl">
              {content?.description ??
                "Developing projects for nature, people and climate"}
            </p>
          </hgroup>
          {buttonHref ? (
            <Link
              className={buttonVariants({
                className:
                  "motion-safe:starting:opacity-0 motion-safe:transition-opacity motion-safe:duration-200",
                variant: "brand",
              })}
              href={buttonHref}
            >
              {content ? button?.label : "Learn more"}
            </Link>
          ) : null}
        </div>
        {scrollCue === "hidden" ? null : (
          <a
            className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-center pb-5 outline-offset-4 motion-safe:starting:opacity-0 motion-safe:transition-opacity motion-safe:duration-200"
            href="#learn-more"
          >
            <span
              className={cn(
                "flex flex-col items-center justify-center gap-2.5",
                scrollCue === "animated" && "motion-safe:animate-bounce"
              )}
            >
              <span>Scroll to learn more</span>
              <ArrowDownIcon aria-hidden="true" className="size-4" />
            </span>
          </a>
        )}
        <div className="absolute inset-0 z-1 h-full w-full bg-stone-950/30" />
        {content ? (
          <SanityImage
            className="z-0 h-full w-full object-cover"
            fill
            preload
            quality={75}
            sizes="100vw"
            source={content.image}
            style={
              hotspot
                ? { objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%` }
                : undefined
            }
          />
        ) : (
          <Image
            alt="Two researchers crouching in a dense, shaded woodland to examine the forest floor"
            className="z-0 h-full w-full object-cover"
            fill
            preload
            quality={75}
            sizes="100vw"
            src="https://cdn.sanity.io/images/wj2okvbq/production/eecceff4dc7444ca6289425e2b06dc94610ea58e-2400x1602.webp"
          />
        )}
      </div>
    </div>
  );
}
