import { createClient } from "@sanity/client";
import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";
import { withPlausibleProxy } from "next-plausible";
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
    const redirects = await sanityClient.fetch<SanityRedirect[]>(REDIRECTS_QUERY);

    return (redirects ?? [])
      .filter(
        (redirect): redirect is SanityRedirect & {
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    // Fetch CMS-managed redirects from Sanity
    const sanityRedirects = await getSanityRedirects();

    // Legacy redirects (kept for backwards compatibility)
    const legacyRedirects = [
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
    ];

    // CMS redirects take precedence over legacy redirects
    return [...sanityRedirects, ...legacyRedirects];
  },
};

export default withPlausibleProxy({
  src: "https://plausible.net-work.studio/js/script.file-downloads.hash.outbound-links.js",
})(nextConfig);
