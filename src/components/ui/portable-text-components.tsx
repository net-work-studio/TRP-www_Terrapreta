import Link from "next/link";
import { type PortableTextComponents, stegaClean } from "next-sanity";
import { isLiveWebsitePageId, WEBSITE_PAGES } from "@/lib/website-pages";
import { PortableImage } from "./portable-image";
import {
  PortableTextHeadingFour,
  PortableTextHeadingThree,
  PortableTextHeadingTwo,
} from "./portable-text-headings";

/**
 * Map document types to their URL paths
 */
function getPathForType(type: string): string | undefined {
  switch (type) {
    case "journal":
      return "/journal";
    case "project":
      return "/projects";
    case "service":
      return "/services";
    default:
      return undefined;
  }
}

/**
 * Shared PortableText components configuration with internal link support.
 * Use this across all pages that render Portable Text content.
 */
export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: PortableTextHeadingTwo,
    h3: PortableTextHeadingThree,
    h4: PortableTextHeadingFour,
  },
  types: {
    editorialImage: PortableImage,
  },
  marks: {
    link: ({ children, value }) => {
      const href = stegaClean(value?.href) || "#";
      const blank = stegaClean(value?.blank) === "true";
      return (
        <a
          className="underline underline-offset-4 transition-colors hover:text-stone-400"
          href={href}
          rel={blank ? "noopener noreferrer" : undefined}
          target={blank ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      const slug = stegaClean(value?.slug);
      const type = stegaClean(value?.type);
      if (!type) {
        return <span>{children}</span>;
      }
      const fixedPath = isLiveWebsitePageId(type)
        ? WEBSITE_PAGES[type].path
        : undefined;
      const basePath = getPathForType(type);
      const detailPath = basePath && slug ? `${basePath}/${slug}` : undefined;
      const href = fixedPath ?? detailPath;
      if (!href) {
        return <span>{children}</span>;
      }
      return (
        <Link
          className="underline underline-offset-4 transition-colors hover:text-stone-400"
          href={href}
        >
          {children}
        </Link>
      );
    },
  },
};
