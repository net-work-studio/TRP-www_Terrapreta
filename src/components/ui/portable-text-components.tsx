import Link from "next/link";
import { stegaClean, type PortableTextComponents } from "next-sanity";
import { PortableImage } from "./portable-image";

/**
 * Map document types to their URL paths
 */
function getPathForType(type: string): string {
  const cleanType = stegaClean(type);
  const pathMap: Record<string, string> = {
    journal: "/journal",
    project: "/projects",
    service: "/services",
    research: "/research",
    press: "/press",
    about: "/about",
    page: "",
  };
  return pathMap[cleanType] || "";
}

/**
 * Shared PortableText components configuration with internal link support.
 * Use this across all pages that render Portable Text content.
 */
export const portableTextComponents: PortableTextComponents = {
  types: {
    imageObject: PortableImage,
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
      if (!(slug && type)) {
        return <span>{children}</span>;
      }
      const basePath = getPathForType(type);
      const href = basePath ? `${basePath}/${slug}` : `/${slug}`;
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
