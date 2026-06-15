import type { LivePerspective } from "next-sanity/live";
import { sanityFetchMetadata } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export async function getSiteSettings(perspective: LivePerspective) {
  const { data } = await sanityFetchMetadata({
    query: SITE_SETTINGS_QUERY,
    perspective,
  });
  return data;
}
