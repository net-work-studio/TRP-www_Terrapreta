import Link from "next/link";
import { type PortableTextComponents, stegaClean } from "next-sanity";
import { getInternalPageHref } from "@/lib/internal-page";
import { PortableImage } from "./portable-image";
import {
  PortableTextHeadingFour,
  PortableTextHeadingThree,
  PortableTextHeadingTwo,
} from "./portable-text-headings";

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
      const href = getInternalPageHref(value?.destination);
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
