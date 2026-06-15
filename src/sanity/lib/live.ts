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
import { createElement, Suspense, type ReactNode } from "react";
import { browserToken, serverToken } from "@/sanity/lib/token";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken,
  serverToken,
  strict: true,
});

export interface SanityFetchOptions {
  perspective: LivePerspective;
  stega: boolean;
}

export interface SanityRequestState {
  fetchOptions: SanityFetchOptions;
  isDraftMode: boolean;
}

export const PUBLISHED_SANITY_FETCH_OPTIONS = {
  perspective: "published",
  stega: false,
} as const satisfies SanityFetchOptions;

type SanityBoundaryPublished =
  | ReactNode
  | (() => Promise<ReactNode> | ReactNode);

interface SanityCacheBoundaryOptions {
  draft: ReactNode;
  fallback: ReactNode;
  isDraftMode?: boolean;
  published: SanityBoundaryPublished;
}

export async function isSanityDraftMode(): Promise<boolean> {
  const { isEnabled: isDraftMode } = await draftMode();
  return isDraftMode;
}

export async function getSanityRequestState(): Promise<SanityRequestState> {
  const isDraftMode = await isSanityDraftMode();

  if (!isDraftMode) {
    return {
      fetchOptions: PUBLISHED_SANITY_FETCH_OPTIONS,
      isDraftMode,
    };
  }

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });

  return {
    fetchOptions: {
      perspective: perspective ?? "drafts",
      stega: true,
    },
    isDraftMode,
  };
}

export async function renderSanityCacheBoundary({
  draft,
  fallback,
  isDraftMode,
  published,
}: SanityCacheBoundaryOptions): Promise<ReactNode> {
  const shouldRenderDraft = isDraftMode ?? (await isSanityDraftMode());

  if (shouldRenderDraft) {
    return createElement(Suspense, { fallback }, draft);
  }

  if (typeof published === "function") {
    return published();
  }

  return published;
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
