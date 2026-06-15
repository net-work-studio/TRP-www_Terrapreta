# Non-blocking layout patterns

When `sanityFetch` runs inside a `layout.tsx`, the goal is to keep `children` streaming and keep the static shell as large as possible.

## Contents

- [Rules](#rules)
- [Pattern: shared `'use cache'` helper per draft/published branch](#pattern-shared-use-cache-helper-per-draftpublished-branch)
- [Anti-pattern: wrapping `children` in a single cached layout](#anti-pattern-wrapping-children-in-a-single-cached-layout)
- [Simpler example: a single `<Footer>`](#simpler-example-a-single-footer)

## Rules

- The top-level `layout.tsx` component must not `await` dynamic APIs (other than `draftMode()`) or fetch data. `draftMode()` is the lone exception because Next.js bypasses caching when it's enabled and a `draftMode()`-only top-level component still prerenders into the static shell. Anything else (`cookies()`, `headers()`, `await params`, `await searchParams`, `sanityFetch`) reduces the static shell or slows draft-mode streaming.
- Push [dynamic API calls](https://nextjs.org/docs/app/guides/streaming#push-dynamic-access-down) down to the leaf that needs them.
- Extract shared data fetching into a reusable async `'use cache'` helper so two components that need the same data don't both wait independently.

## Pattern: shared `'use cache'` helper per draft/published branch

```tsx
// src/app/(website)/layout.tsx
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  sanityFetch,
  type SanityFetchOptions,
} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'

async function fetchSettings({perspective, stega}: SanityFetchOptions) {
  'use cache'
  const settingsQuery = defineQuery(`*[_type == "settings"][0]`)
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return data
}

export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  const navbar = await renderSanityCacheBoundary({
    draft: <DynamicNavbar />,
    fallback: <NavbarFallback />,
    isDraftMode,
    published: <CachedNavbar {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  })
  const footer = await renderSanityCacheBoundary({
    draft: <DynamicFooter />,
    fallback: null,
    isDraftMode,
    published: <CachedFooter {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  })

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  )
}

async function DynamicNavbar() {
  const {fetchOptions} = await getSanityRequestState()
  return <CachedNavbar {...fetchOptions} />
}
async function CachedNavbar({perspective, stega}: SanityFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Navbar data={data} />
}

async function DynamicFooter() {
  const {fetchOptions} = await getSanityRequestState()
  return <CachedFooter {...fetchOptions} />
}
async function CachedFooter({perspective, stega}: SanityFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Footer data={data} />
}
```

## Anti-pattern: wrapping `children` in a single cached layout

This blocks `children` on the layout's data fetch and prevents the page itself from streaming in independently.

```tsx
// src/app/(website)/layout.tsx
export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense>
        <DynamicWebsiteLayout>{children}</DynamicWebsiteLayout>
      </Suspense>
    )
  }
  return (
    <CachedWebsiteLayout perspective="published" stega={false}>
      {children}
    </CachedWebsiteLayout>
  )
}
async function CachedWebsiteLayout({
  children,
  perspective,
  stega,
}: {children: ReactNode} & SanityFetchOptions) {
  'use cache'
  const settingsQuery = defineQuery(`*[_type == "settings"][0]`)
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})

  return (
    <>
      <Navbar data={data} />
      {children}
      <Footer data={data} />
    </>
  )
}
```

## Simpler example: a single `<Footer>`

Useful as a sanity check when adapting the pattern to a layout with only one data-driven section:

```tsx
// src/app/(website)/layout.tsx
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  sanityFetch,
  type SanityFetchOptions,
} from '@/sanity/lib/live'
import {defineQuery} from 'next-sanity'

export default async function WebsiteLayout({children}: LayoutProps<'/'>) {
  const footer = await renderSanityCacheBoundary({
    draft: <DynamicFooter />,
    fallback: <FooterFallback />,
    published: <Footer {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  })

  return (
    <>
      {children}
      {footer}
    </>
  )
}
async function DynamicFooter() {
  const {fetchOptions} = await getSanityRequestState()
  return <Footer {...fetchOptions} />
}
async function Footer({perspective, stega}: SanityFetchOptions) {
  'use cache'
  const footerQuery = defineQuery(`*[_type == "footer"][0]`)
  const {data} = await sanityFetch({query: footerQuery, perspective, stega})
  return <footer>{/* use `data` to render stuff */}</footer>
}
function FooterFallback() {
  return (
    <footer>
      <p>Loading footer...</p>
    </footer>
  )
}
```

The non-draft `<Footer perspective="published" stega={false} />` is part of the static shell, so the whole layout is cached and revalidates only when content used by `sanityFetch` changes. In draft mode the layout still renders immediately from its static shell while `<DynamicFooter>` streams in.
