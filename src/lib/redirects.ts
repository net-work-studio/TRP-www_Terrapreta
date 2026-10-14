import { pathToRegexp } from "path-to-regexp";
import type { REDIRECTS_QUERY_RESULT } from "@/sanity/types";

export const LEGACY_REDIRECTS = [
  { source: "/en", destination: "/", permanent: true },
  { source: "/ita", destination: "/", permanent: true },
  { source: "/en/journal", destination: "/journal", permanent: true },
  { source: "/ita/journal", destination: "/journal", permanent: true },
  {
    source: "/ita/journal/vuoto-futuro",
    destination: "/journal/vuoto-futuro",
    permanent: true,
  },
  {
    source: "/en/journal/vuoto-futuro",
    destination: "/journal/vuoto-futuro",
    permanent: true,
  },
  {
    source: "/ita/journal/eui-goccia",
    destination: "/journal/eui-goccia",
    permanent: true,
  },
  {
    source: "/en/journal/eui-goccia",
    destination: "/journal/eui-goccia",
    permanent: true,
  },
  {
    source: "/ita/journal/luar-bovisa-art-district",
    destination: "/journal/bovisa-art-district-luar",
    permanent: true,
  },
  {
    source: "/en/journal/luar-bovisa-art-district",
    destination: "/journal/bovisa-art-district-luar",
    permanent: true,
  },
  {
    source: "/en/projects/osservatorio-la-goccia",
    destination: "/projects/osservatorio-la-goccia",
    permanent: true,
  },
  {
    source: "/ita/progetti/osservatorio-la-goccia",
    destination: "/projects/osservatorio-la-goccia",
    permanent: true,
  },
  {
    source: "/ita/impressum",
    destination: "/impressum",
    permanent: true,
  },
  {
    source: "/en/impressum",
    destination: "/impressum",
    permanent: true,
  },
  {
    source: "/en/credits",
    destination: "/",
    permanent: true,
  },
  {
    source: "/ita/credits",
    destination: "/",
    permanent: true,
  },
] as const;

export function isRedirectSource(path: string, sources: string[]): boolean {
  return sources.some((source) => {
    try {
      return pathToRegexp(source).test(path);
    } catch {
      return source === path;
    }
  });
}

export function getDeployedSitemapRedirects(): REDIRECTS_QUERY_RESULT {
  // Next inlines this build-owned configuration into the server bundle.
  return JSON.parse(process.env.SITEMAP_REDIRECTS || "[]");
}
