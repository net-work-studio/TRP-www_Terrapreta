# breadcrumb

2026-07-16, transformation engine for legacy `new-york`, migrated successfully while preserving local styling and markup.

## Changed

- `src/components/ui/breadcrumb.tsx:1` replaces Radix Slot with Base UI `useRender` and `mergeProps`; `BreadcrumbLink` now accepts Base UI's `render` prop at line 35.
- `src/components/shared/breadcrumb-custom.tsx:20` migrates the Next.js Link composition from `asChild` to `render`.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui"` returns no matches for the breadcrumb wrapper or its consumers.

## Left alone

- `src/app/(frontend)/projects/[slug]/page.tsx` uses `BreadcrumbLink` as a native anchor with `href`, so no consumer prop change was needed.
- `components.json` remains on the legacy `new-york` style because this is a progressive migration and other Radix wrappers remain.
- `@radix-ui/react-slot` remains installed because other UI wrappers still depend on Radix; dependencies are removed only after the last wrapper is migrated.
- Repository linting remains blocked by the existing `biome.json` imports for `ultracite/core`, `ultracite/next`, and `ultracite/react`, which Ultracite 7.9.3 no longer exports.

## Behavior changes

None.

## Verify by hand

- Open a journal detail page and confirm the “Journal” breadcrumb navigates to `/journal`.
- Tab to the breadcrumb link and confirm its focus and activation behavior are unchanged.
- Open a project detail page and confirm its native breadcrumb link still renders and navigates correctly.
