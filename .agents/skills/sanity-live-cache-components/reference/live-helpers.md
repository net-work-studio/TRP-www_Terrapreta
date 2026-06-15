# Live helpers: `client.ts` and `live.ts`

## Contents

- [`client.ts`](#clientts)
- [`live.ts`](#livets)
- [`sanityFetch`](#sanityfetch)
- [`sanityFetchMetadata`](#sanityfetchmetadata)
- [`getSanityRequestState`](#getsanityrequeststate)
- [`sanityFetchStaticParams`](#sanityfetchstaticparams)
- [Anti-patterns to grep for](#anti-patterns-to-grep-for)

## `client.ts`

Projects typically have a `src/sanity/lib/client.ts` that exports a `createClient` instance.

**If no `client.ts` exists yet**, use this shape as a starting point:

```ts
// src/sanity/lib/client.ts
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2026-05-19',
  perspective: 'published',
  stega: {studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'},
})
```

**If `client.ts` already exists**, leave its structure alone. Templates often centralize env-var reads in a separate `sanity/lib/api.ts` with an `assertValue` helper — keep that. Append only what's missing.

- Use a modern `apiVersion` (e.g. today's date as a hardcoded string).
- `stega.studioUrl` enables stega encoding. It can be a relative string when an embedded Studio is mounted via `NextStudio` from `next-sanity/studio`, otherwise an absolute URL (typically env-driven).
- Changing `apiVersion` or removing existing `stega.*` options can break callers.
- Never remove an existing `token` from `createClient`. Private datasets require a client token even for published-content fetches.

## `live.ts`

Create `src/sanity/lib/live.ts` alongside `client.ts`. If it already exists, append only what's missing.

`SANITY_API_READ_TOKEN` must never reach the client bundle. If the project already keeps it in a dedicated server-only module (commonly `src/sanity/lib/token.ts` with `import 'server-only'` at the top), import the token from there instead of inlining the `process.env` read. The example below inlines it for brevity — swap in the existing module if there is one.

```ts
// src/sanity/lib/live.ts
import {type QueryParams} from 'next-sanity'
import {defineLive, resolvePerspectiveFromCookies, type LivePerspective} from 'next-sanity/live'
import {cookies, draftMode} from 'next/headers'
import {createElement, Suspense, type ReactNode} from 'react'
import {client} from './client'

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const {SanityLive, sanityFetch} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

export interface SanityFetchOptions {
  perspective: LivePerspective
  stega: boolean
}

export interface SanityRequestState {
  fetchOptions: SanityFetchOptions
  isDraftMode: boolean
}

export const PUBLISHED_SANITY_FETCH_OPTIONS = {
  perspective: 'published',
  stega: false,
} as const satisfies SanityFetchOptions

export async function isSanityDraftMode(): Promise<boolean> {
  const {isEnabled: isDraftMode} = await draftMode()
  return isDraftMode
}

export async function getSanityRequestState(): Promise<SanityRequestState> {
  const isDraftMode = await isSanityDraftMode()
  if (!isDraftMode) {
    return {fetchOptions: PUBLISHED_SANITY_FETCH_OPTIONS, isDraftMode}
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  return {
    fetchOptions: {perspective: perspective ?? 'drafts', stega: true},
    isDraftMode,
  }
}

export async function renderSanityCacheBoundary({
  draft,
  fallback,
  isDraftMode,
  published,
}: {
  draft: ReactNode
  fallback: ReactNode
  isDraftMode?: boolean
  published: ReactNode | (() => Promise<ReactNode> | ReactNode)
}): Promise<ReactNode> {
  const shouldRenderDraft = isDraftMode ?? (await isSanityDraftMode())
  if (shouldRenderDraft) {
    return createElement(Suspense, {fallback}, draft)
  }

  return typeof published === 'function' ? published() : published
}

// For usage within `generateStaticParams`
export async function sanityFetchStaticParams<const QueryString extends string>({
  query,
  params = {},
}: {
  query: QueryString
  params?: QueryParams
}) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective: 'published', stega: false})
  return {data}
}

// For usage within `generateMetadata` and `generateViewport`
export async function sanityFetchMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString
  params?: QueryParams
  perspective: LivePerspective
}) {
  'use cache'
  const {data} = await sanityFetch({query, params, perspective, stega: false})
  return {data}
}
```

## `sanityFetch`

For fetching data in React Server Components that have a `'use cache'` directive and are rendered (directly or transitively) from a `page.tsx` or `layout.tsx`.

- `perspective` switches between published, drafts, and specific Sanity Content Releases.
- `stega: true` (combined with `stega.studioUrl` in `createClient` and `<VisualEditing>` in the root layout) renders click-to-edit overlays.
- `getSanityRequestState` resolves `perspective` from the `sanity-preview-perspective` cookie, which `<VisualEditing>` manages when the app is rendered inside Presentation Tool's preview iframe, and returns `isDraftMode` for metadata/layout code that needs it.

The async function that calls `sanityFetch` must carry `'use cache'` or `'use cache: remote'`, and must take `perspective` and `stega` as props. Never hardcode them.

Pattern:

```tsx
import {sanityFetch, type SanityFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function CachedComponent({slug, perspective, stega}: {slug: string} & SanityFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({query: pageQuery, params: {slug}, perspective, stega})
}
```

Anti-pattern (hardcoded options break Visual Editing and content-release previewing):

```tsx
async function CachedComponent({slug}: {slug: string}) {
  'use cache'
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective: 'published', // hardcoded
    stega: false, // hardcoded
  })
}
```

### `sanityFetch` inside server actions

`'use server'` boundaries cannot accept `perspective`/`stega` as props (server action inputs are untrusted). Resolve them inside the `'use server'` function and forward them to a separate `'use cache'` boundary:

```tsx
import {getSanityRequestState, sanityFetch, type SanityFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function fetchMore({page, perspective, stega}: {page: string} & SanityFetchOptions) {
  'use cache'
  const pagesQuery = defineQuery(`*[_type == "page"][0...$page]`)
  const {data} = await sanityFetch({query: pagesQuery, params: {page}, perspective, stega})
  return data
}
async function renderMore({page}: {page: string}) {
  'use server'
  const {fetchOptions} = await getSanityRequestState()
  const data = await fetchMore({page, ...fetchOptions})
}
```

Anti-patterns:

- Hardcoding `perspective`/`stega` in the `'use cache'` helper.
- Calling `sanityFetch` directly inside `'use server'` — it bypasses caching entirely.

### `sanityFetch` inside `route.ts`

Hardcode `stega: false` and resolve only `perspective`. Route handlers don't render a DOM next to `<VisualEditing>`, so stega encoding only inflates the payload (and can cause downstream errors).

## `sanityFetchMetadata`

For fetching data inside `generateMetadata`, `generateSitemaps`, `generateViewport`, `generateImageMetadata`, and the file-based metadata routes (`icon.tsx`, `apple-icon.tsx`, `manifest.ts`, `opengraph-image.tsx`, `twitter-image.tsx`, `robots.ts`, `sitemap.ts`).

It's `sanityFetch` without `stega` (never wanted in these contexts) and without requiring `'use cache'` at the callsite — the helper already provides it.

Presentation Tool can open an app in a standalone preview window, so the correct content release must still be reflected in `<title>` and friends. Always resolve `perspective`:

```ts
import {getSanityRequestState, sanityFetchMetadata} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export async function generateMetadata({params}: PageProps<'/[slug]'>) {
  const [{slug}, {fetchOptions}] = await Promise.all([params, getSanityRequestState()])
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetchMetadata({
    query: pageQuery,
    params: {slug},
    perspective: fetchOptions.perspective,
  })
}
```

Anti-pattern: hardcoding `perspective: 'published'` — content-release previewing won't work.

## `getSanityRequestState`

Resolves draft mode plus `perspective` and `stega` outside the `'use cache'` boundary so they can be passed in as plain props. It calls `cookies()` only in draft mode, so request-state resolution should live inside a `<Suspense>` boundary (or a route with a sibling `loading.tsx`) when used by render paths that should keep the static shell streaming.

Avoid calling `getSanityRequestState` in the top-level body of a `layout.tsx` or `page.tsx` that should remain part of the static shell. The exception is routes that intentionally use a sibling `loading.tsx` for fallback UI (see [dynamic-segments.md](dynamic-segments.md)) — there the page can await `getSanityRequestState` directly because `loading.tsx` provides the streaming fallback.

When Cache Components are enabled, `<Suspense>` boundaries determine the static shell. For fully prerendered routes, render the Suspense tree only when in draft mode — see [three-layer-pattern.md](three-layer-pattern.md).

## `sanityFetchStaticParams`

Used inside `generateStaticParams`. `stega` is never wanted (the data feeds route params), and `perspective` cookies aren't available at build time anyway, so both are hardcoded.

- Never call `sanityFetch` inside `generateStaticParams` — always use `sanityFetchStaticParams`.
- Never call `sanityFetchStaticParams` outside `generateStaticParams`.

## Anti-patterns to grep for

When migrating an existing app, these are the strings to search for and refactor:

- `perspective: 'published'` and `stega: false` hardcoded together in a `sanityFetch` call → replace with `perspective` and `stega` props sourced from `getSanityRequestState` via the three-layer pattern.
- `sanityFetch(` directly inside a function whose body starts with `'use server'` → split into a separate `'use cache'` helper and forward `perspective`/`stega` as props.
- `sanityFetch(` inside `generateStaticParams` → swap for `sanityFetchStaticParams`.
- `sanityFetch(` inside `generateMetadata` / `generateViewport` / `sitemap.ts` / `robots.ts` / `opengraph-image.tsx` etc. → swap for `sanityFetchMetadata` and resolve `perspective` via `getSanityRequestState`.
- `await draftMode()` immediately followed by `await getSanityRequestState()` at the top of a `page.tsx` or `layout.tsx` without a sibling `loading.tsx` → move the request-state call into a child component wrapped in `<Suspense>` so the static shell can prerender.
