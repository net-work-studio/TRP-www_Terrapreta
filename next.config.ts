import { createClient } from "@sanity/client";
import type { NextConfig } from "next";
import { withPlausibleProxy } from "next-plausible";
import { sanity } from "next-sanity/live/cache-life";
import { LEGACY_REDIRECTS } from "./src/lib/redirects";
import { apiVersion } from "./src/sanity/env";
import { REDIRECTS_QUERY } from "./src/sanity/lib/queries";

type SanityRedirect = {
  destination: string | null;
  permanent: string | null;
  source: string | null;
};

type NextRedirect = {
  destination: string;
  permanent: boolean;
  source: string;
};

// Sanity client for fetching redirects at build time
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion,
  useCdn: false,
});

// Fetch CMS-managed redirects from Sanity
async function getSanityRedirects(): Promise<NextRedirect[]> {
  try {
    const redirects =
      await sanityClient.fetch<SanityRedirect[]>(REDIRECTS_QUERY);

    return (redirects ?? [])
      .filter(
        (
          redirect
        ): redirect is SanityRedirect & {
          destination: string;
          source: string;
        } => Boolean(redirect.source && redirect.destination)
      )
      .map(({ destination, permanent, source }) => ({
        destination,
        permanent: permanent === "permanent",
        source,
      }));
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  images: {
    loader: "custom",
    loaderFile: "./src/sanity/lib/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default async function config(): Promise<NextConfig> {
  const sanityRedirects = await getSanityRedirects();
  return withPlausibleProxy({
    src: "https://plausible.net-work.studio/js/script.file-downloads.hash.outbound-links.js",
  })({
    ...nextConfig,
    env: {
      // Embed the same snapshot used by redirects(), rather than current CMS state.
      SITEMAP_REDIRECTS: JSON.stringify(
        sanityRedirects.map(({ source, destination, permanent }) => ({
          source,
          destination,
          permanent: permanent ? "permanent" : "temporary",
        }))
      ),
    },
    async redirects() {
      return [...sanityRedirects, ...LEGACY_REDIRECTS];
    },
  });
}
