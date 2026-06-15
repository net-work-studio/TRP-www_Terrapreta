# Three-layer component pattern

The core architecture for every route that can be fully statically prerendered and cached.

## Contents

- [Structure](#structure)
- [`generateStaticParams` for dynamic routes](#generatestaticparams-for-dynamic-routes)
- [Layer 1: Page component](#layer-1-page-component)
- [Layer 2: Dynamic component](#layer-2-dynamic-component)
- [Layer 3: Cached component](#layer-3-cached-component)
- [`searchParams` and other dynamic APIs](#searchparams-and-other-dynamic-apis)

## Structure

```text
Page/Layout (Layer 1)
  ├── NOT draft mode → <CachedX {...PUBLISHED_SANITY_FETCH_OPTIONS} />  (no Suspense)
  └── draft mode → renderSanityCacheBoundary creates <Suspense fallback={...}>
                      <DynamicX params={params} />  (Layer 2)
                        └── <CachedX params={await params} perspective={p} stega={s} />  (Layer 3)
```

## `generateStaticParams` for dynamic routes

The examples below use `/[slug]/page.tsx`, which needs:

```tsx
// src/app/[slug]/page.tsx
import {sanityFetchStaticParams} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export async function generateStaticParams() {
  const pageSlugsQuery = defineQuery(
    `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
  )
  const {data} = await sanityFetchStaticParams({query: pageSlugsQuery})
  return data
}
```

For `/layout.tsx` or `/page.tsx` (no params), skip the `params` handling.

## Layer 1: Page component

Calls the shared Sanity cache boundary helper:

```tsx
// src/app/[slug]/page.tsx (continued)
import {
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
} from '@/sanity/lib/live'

export default async function Page({params}: PageProps<'/[slug]'>) {
  return renderSanityCacheBoundary({
    draft: (
      <DynamicPage
        // do not await `params` here, it needs to be awaited in `<DynamicPage>` so the Suspense boundary works
        params={params}
      />
    ),
    fallback: <PageFallback />,
    published: async () => {
      const {slug} = await params
      return <CachedPage slug={slug} {...PUBLISHED_SANITY_FETCH_OPTIONS} />
    },
  })
}
```

Notes:

- `Page` does **not** have a `'use cache'` directive. It may lazily await `params` for the published branch, and `<DynamicPage>` calls `getSanityRequestState()`, which can read `cookies()`. Those dynamic APIs are not allowed inside `'use cache'`. It's enough for `<CachedPage>` (Layer 3) to carry `'use cache'` for `Page` to be prerendered as part of the static shell.
- Requires `generateStaticParams` if `params` is used as input to `sanityFetch`.
- Not in draft mode → no `<Suspense>` boundary, maximizes the static shell.
- In draft mode → `<DynamicPage />` inside `<Suspense>` will suspend twice:
  1. when `<DynamicPage>` awaits `getSanityRequestState()`
  2. when `<CachedPage />` awaits `sanityFetch` with the resolved `perspective`/`stega`

  A good fallback skeleton that doesn't cause layout shift is highly recommended.

## Layer 2: Dynamic component

Resolves `params`, `cookies()`, and `headers()` outside the cache boundary and passes plain props in:

```tsx
// src/app/[slug]/page.tsx (continued)
import {getSanityRequestState} from '@/sanity/lib/live'

async function DynamicPage({params}: Pick<PageProps<'/[slug]'>, 'params'>) {
  const [{slug}, {fetchOptions}] = await Promise.all([params, getSanityRequestState()])

  return <CachedPage slug={slug} {...fetchOptions} />
}
```

`draftMode()` is the only dynamic API allowed inside `'use cache'`, but in this pattern it isn't needed in Layer 3 because `perspective` and `stega` already encode the draft state.

## Layer 3: Cached component

Has `'use cache'` and only receives plain, serializable props:

```tsx
// src/app/[slug]/page.tsx (continued)
import {sanityFetch, type SanityFetchOptions} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

async function CachedPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/[slug]'>['params']> & SanityFetchOptions) {
  'use cache'
  const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`)
  const {data} = await sanityFetch({
    query: pageQuery,
    params: {slug},
    perspective,
    stega,
  })
  return <article>{/* use `data` to render stuff */}</article>
}
```

## `searchParams` and other dynamic APIs

If `searchParams` or other dynamic APIs are inputs to `sanityFetch` (or `params` is used without `generateStaticParams` or a `loading.tsx`), always render the `<Suspense>` tree and **stop branching on `draftMode`**. See [the streaming guide](https://nextjs.org/docs/app/guides/streaming#when-to-use-loadingjs-vs-suspense) for picking between `loading.tsx` and `<Suspense>`.

```tsx
// src/app/[slug]/page.tsx (continued)
import {Suspense} from 'react'

// Do not export an async function here, to avoid accidentally blocking render while awaiting a dynamic API
export default function Page({params}: PageProps<'/[slug]'>) {
  return (
    <Suspense
      // not optional — no draftMode branch means a missing skeleton causes massive layout shift
      fallback={<PageFallback />}
    >
      <DynamicPage
        // do not await `params` here, it needs to be awaited in `<DynamicPage>` so the Suspense boundary works
        params={params}
      />
    </Suspense>
  )
}
```
