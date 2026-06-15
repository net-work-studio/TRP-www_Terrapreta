// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { type QueryParams } from "next-sanity";
import {
  defineLive,
  resolvePerspectiveFromCookies,
  type LivePerspective,
} from "next-sanity/live";
import { cookies, draftMode } from "next/headers";
import { token } from "@/sanity/lib/token";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
  strict: true,
});

export interface DynamicFetchOptions {
  perspective: LivePerspective;
  stega: boolean;
}

export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) {
    return { perspective: "published", stega: false };
  }

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  return { perspective: perspective ?? "drafts", stega: true };
}

export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString;
  params?: QueryParams;
}) {
  "use cache";
  const { data } = await sanityFetch({
    query,
    params,
    perspective: "published",
    stega: false,
  });
  return { data };
}

export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString;
  params?: QueryParams;
  perspective: LivePerspective;
}) {
  "use cache";
  const { data } = await sanityFetch({
    query,
    params,
    perspective,
    stega: false,
  });
  return { data };
}
