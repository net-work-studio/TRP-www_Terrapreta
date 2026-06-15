import {
  type SanityFetchOptions,
  sanityFetchMetadata,
} from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export async function getSiteSettings({ perspective }: SanityFetchOptions) {
  const { data } = await sanityFetchMetadata({
    query: SITE_SETTINGS_QUERY,
    perspective,
  });
  return data;
}
