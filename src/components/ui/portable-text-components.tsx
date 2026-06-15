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
      const href = value?.href ? stegaClean(value.href) : "#";
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
      const { slug, type } = value || {};
      if (!(slug && type)) {
        return <span>{children}</span>;
      }
      const basePath = getPathForType(type);
      const cleanSlug = stegaClean(slug);
      const href = basePath ? `${basePath}/${cleanSlug}` : `/${cleanSlug}`;
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
