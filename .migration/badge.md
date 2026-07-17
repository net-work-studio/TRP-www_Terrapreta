# badge

2026-07-16 — transformation engine using the current Base UI registry shape; the customized legacy `new-york` badge migrated successfully with its styling preserved.

## Changed

- `src/components/ui/badge.tsx:1` replaces Radix Slot with Base UI `useRender` and `mergeProps`, exposes the Base UI `render` API, and derives `data-slot`/`data-variant` from component state.
- `src/components/ui/badge.tsx:7` retains the existing CVA classes, variants, and default variant unchanged.
- `package.json:23` adds `@base-ui/react` alongside Radix for the progressive migration.
- `bun.lock` records the Base UI dependency graph.
- `src/components/layout/page-grid.tsx:4` was temporarily repointed to the progressive `badge-base` module and typechecked, then restored to the finalized `@/components/ui/badge` path.
- `bun run typecheck` and `bun run build` pass. The build also completes Sanity schema extraction and TypeGen successfully.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/badge.tsx` returns no matches.

## Left alone

- `components.json` remains on the legacy `new-york`/Radix configuration because this is a progressive single-component migration and eight UI wrappers still import Radix.
- `@radix-ui/react-slot` remains installed because `button.tsx` and `breadcrumb.tsx` still use it.
- The repository's Ultracite check remains blocked by its existing `ultracite/core` configuration resolution error; this migration does not alter lint configuration.
- Other UI wrappers and their consumers were not changed because they are outside the requested badge migration.

## Behavior changes

- Polymorphic rendering now uses Base UI's `render` prop instead of Radix's `asChild` boolean. No current Badge consumer uses `asChild`, so existing rendered behavior is unchanged.

## Verify by hand - OK

- Open a page-grid entry with a tag and confirm the secondary badge matches its previous appearance.
- Render each badge variant and confirm its colors, border, spacing, and icon sizing.
- Render a badge with `render={<a href="#" />}` and confirm hover and keyboard focus styles apply to the anchor.
