# Give fixed website pages separate content models

Homepage, Contact, About, Projects index, Journal index, and Research index each have a dedicated singleton document type. Editors find active fixed pages under Website pages, while Research index and the existing generic Page collection remain available under Inactive content. Separate types let each fixed page gain content fields suited to its purpose without adding conditional fields to a common page type.

The first version manages SEO through the existing shared SEO object and connects it to existing website routes. Homepage SEO is separate from Site SEO defaults. Page overrides take priority, existing live pages retain metadata fallbacks, and canonical URLs default to each page's fixed URL. About and Research receive SEO singletons now, while their public pages launch when their visible content is ready. Contact keeps the existing /contacts URL.

SEO overrides are optional, with length recommendations reported as warnings. Active singleton pages marked noindex are excluded from the sitemap. The former About document type is removed because the owner confirmed its documents and references are not in production; no compatibility migration is needed.

Site Settings has a separate brand name for title suffixes and social metadata, falling back to Terrapreta. Its existing administrative document name is preserved and never used as the brand. New page SEO starts without indexing, following, or Twitter-card overrides so those values inherit Site defaults.

If a page builder is needed later, its blocks are shared across page types. Building that page builder and moving visible page content into Sanity are deferred.

The broader sitemap and SEO audit is tracked separately in [NWS-2636](https://linear.app/nws2/issue/NWS-2636/audit-sitemap-and-complete-seo-integration).

The October 2026 Studio organization uses “index” for collection pages. Inactive content groups models awaiting website integration without deleting their documents or references. Glossary retains a top-level entry because its activation is planned soon. Navigation is omitted from the sidebar and creation menus because public menus are maintained in code; its schema and existing documents are retained. Capabilities remain editable under Services because service detail pages display them. These editorial changes preserve singleton identities and the existing project and service sequences.
