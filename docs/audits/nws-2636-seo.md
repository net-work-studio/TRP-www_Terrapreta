# Sitemap and SEO audit

Implemented for [NWS-2636](https://linear.app/nws2/issue/NWS-2636/audit-sitemap-and-complete-seo-integration), compared with commit `559b70a` on 2026-10-14.

## Findings and fixes

1. **Site defaults were inconsistent.** Fixed pages inherited robots settings; detail routes did not. Services and Impressum used static metadata and missed all Site defaults and preview robots. All active routes now resolve Site settings and draft state. Page overrides take priority independently for indexing and following.
2. **Sitemap inclusion disagreed with metadata.** Detail queries filtered only their own noindex value, ignoring Site defaults. Fixed pages and details ignored canonical overrides and redirects. Sitemap assembly now applies inherited indexing to all routes, excludes URLs canonicalized elsewhere, and excludes CMS and legacy redirect sources, including wildcard patterns. It does not invent an entry for an unknown canonical destination. Project overview-only entries and project/journal entries without the hero image required by their route are excluded by the published queries.
3. **Sitemap freshness depended on browser activity.** It retains Sanity Live query tags and also revalidates after five minutes, expiring after ten. This bounds staleness when no browser is connected. Production `prerender-manifest.json` confirms 300/600 seconds and `sanity:` cache tags on `/sitemap.xml`. Page metadata continues to use the existing tagged Sanity Live caches. The production Server Action used by SanityLive was invoked with the build's actual query tags. `/services` changed from cache HIT to STALE, and the action returned `refresh`. This verifies the deployed invalidation path without editing production content. Delivery of an actual CMS publication event remains an operational check.
4. **Social-image data was incomplete.** Detail SEO image projections omitted crop and hotspot. All SEO image projections now include them and an editor-managed alt field. Open Graph and Twitter both expose alt text, with a page-title fallback. Resized CMS images declare 1200 by 630. Raw URL and bundled fallbacks omit dimensions rather than misstate them: the bundled hero is 2400 by 1602. Four representative CMS social-image URLs were loaded and confirmed to be 1200 by 630.
5. **Canonical identity differed across outputs.** Open Graph now uses the resolved canonical URL. Detail JSON-LD includes canonical URLs too. Site-level canonical settings are hidden because a shared canonical must not replace each page's identity.
6. **Project structured data described the wrong entity.** Schema.org's `Project` is an Organization subtype. Case studies now emit `CreativeWork`, with `contentLocation` as a Place. Hidden realization status is no longer emitted as the unsupported `status` property. Topic controls become `keywords` for case studies and journal articles; service topics describe provider expertise. Width-only JSON-LD images preserve aspect ratio rather than receiving an implicit 600-pixel crop.
7. **Schema controls promised unsupported behavior.** Project and Service schema types now follow their content; Journal supports Article or BlogPosting. Fixed pages and Site Settings hide schema controls, as their queries do not support them. Custom properties are exposed only on the three detail document types. Offer catalogs appear only on Services. The extracted custom-schema type retains the stored `customSchema` type name. No content migration or publication was performed.
8. **Title warnings omitted the brand suffix.** Studio now measures the formatted title with the published Site brand, or the current Site document's brand while editing Site Settings. Runtime formatting appends the brand even when a title contains other em-dash punctuation, while preserving an existing suffix. Titles are not silently truncated. Homepage glossary schemas were removed because their definitions were not rendered as page content; WebSite and Organization remain.

## Rendered evidence

[Raw before/after metadata, schemas, image sizes, robots and sitemap output](nws-2636-rendered.json) records the local production run against the existing dataset. The public deployment was also inspected to distinguish deployed behavior from branch behavior.

| Route | Status | Final title length | Structured-data result |
| --- | --- | --- | --- |
| `/` | 200 | 10 | Organization and WebSite |
| `/contacts` | 200 | 21 | Organization |
| `/projects` | 200 | 21 | Organization |
| `/journal` | 200 | 20 | Organization |
| `/services` | 200 | 21 | Organization; now inherits Site metadata |
| `/impressum` | 200 | 22 | Organization; now inherits Site metadata |
| `/projects/la-goccia-urban-forest` | 200 | 35 | CreativeWork and BreadcrumbList |
| `/services/brownfield-restoration` | 200 | 35 | Service and BreadcrumbList |
| `/journal/vuoto-futuro` | 200 | 94 | BlogPosting and BreadcrumbList |
| `/about` | 404 | 27 | Unavailable and omitted from sitemap |
| `/research` | 404 | 27 | Unavailable and omitted from sitemap |

All sampled successful routes use absolute canonical and social URLs. Draft requests to Homepage, Contact, Services, Impressum and one of each detail type returned `noindex, nofollow` on the production server. These requests used the local build's preview cookie; no production preview session was changed.

The sitemap contains six active overview/static routes plus the published detail entries. All 22 URLs returned HTTP 200 without redirects on the final production build. It omits About, Research, legacy language URLs and overview-only projects. Fixed-page `lastModified` uses the singleton's real `_updatedAt` when available; absent singletons and code-only pages omit it. Detail entries use the document's `_updatedAt`. No generation-time timestamps are fabricated.

`robots.txt` allows public crawling, disallows `/admin` including the bare Studio URL, and disallows `/api/`. Its sitemap URL is absolute. `/en/journal/vuoto-futuro` follows the configured permanent redirect to `/journal/vuoto-futuro`. CMS redirects remain Next.js build-time configuration, so changing them requires deployment; sitemap filtering uses the same deployed redirect snapshot embedded by Next configuration. It stays consistent with installed redirects when CMS records change before the next deployment.

## Metadata precedence and remaining editorial work

Search metadata uses page SEO first, then the route's existing title/summary, then Site or hardcoded defaults where the route has no value. Homepage may inherit the Site SEO title; other routes retain their own identity. Fixed-page social overrides resolve independently, preserving the earlier page-SEO-over-Site behavior. Detail social titles/descriptions follow their SEO overrides or their own resolved search metadata. Site supplies brand, image, description when absent, Twitter card and robots defaults. Site canonical and schema controls do not apply to individual pages.

The sampled Journal title is 94 characters with the brand. An editor should add a shorter SEO title, for example `Vuoto Futuro: adaptive reuse and soil regeneration`, rather than shortening the article's visible name. This audit does not edit live content. Existing empty titles that fall back to a long document name still need editorial review; the Studio warning measures explicit SEO titles.

## Verification

- Focused metadata/sitemap tests cover fallback precedence, independent overrides, preview directives, canonical and redirect exclusions, title formatting, social alt text and crop/hotspot behavior.
- Project JSON-LD is rendered to server HTML and checked as a CreativeWork at its public URL. Existing JSON-LD escaping and stega-cleaning tests remain in place.
- TypeScript, schema extraction/TypeGen and production build pass. All 67 tests pass. Full lint passes with four existing console warnings in the Netlify build-ignore script.
- No About or Research route was launched. No CMS content was changed.

## References

- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) informs the canonical-only policy and use of genuine modification times.
- [Next.js sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) describes the cached metadata route.
- [Schema.org Project](https://schema.org/Project) and [CreativeWork](https://schema.org/CreativeWork) distinguish an organization from a case study.
- The installed `next-sanity` 13.3.4 implementation in `dist/live/conditions/next-js/index.js` registers query sync tags through `cacheTag`; `dist/live/server-actions/index.js` revalidates them through SanityLive. [Upstream source](https://github.com/sanity-io/next-sanity) documents the integration.

## Standards

Standards review found no documented-rule violations. Its one optional duplication observation concerns canonical selection across JSON-LD and metadata; existing behavior is consistent for schema-valid URLs.

## Spec

Spec review identified deployment-time redirect consistency and insufficient cache evidence. The redirect snapshot now comes from the same Next configuration as installed redirects, and the actual SanityLive Server Action was exercised against the production build. Re-review found no remaining blocking findings. The real CMS event-delivery limitation remains documented above.

Review totals: Standards has zero hard findings and one optional duplication observation. Spec has zero open findings after resolving two findings.
