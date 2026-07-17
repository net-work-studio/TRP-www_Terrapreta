# project

2026-07-17, whole-project progressive migration completed successfully: all Radix UI wrappers have been replaced with Base UI or native equivalents, and zero wrappers remain on Radix.

## Dependency cleanup

- `package.json` removes all eight direct `@radix-ui/*` dependencies after the final wrapper migration.
- `bun.lock` was regenerated with Bun 1.3.3 and prunes the obsolete Radix dependency graph.
- `@base-ui/react` remains the project's primitive library.

## Application sweep

- `src/components/ui` contains no `radix-ui` or `@radix-ui` imports.
- The full `src` tree and `package.json` contain no Radix imports or direct dependencies.
- The final consumer sweep found no remaining `asChild`, `delayDuration`, `skipDelayDuration`, `viewport`, `onValueCommit`, `activationMode`, `rovingFocus`, or `decorative` call-site props.
- Sonner and other third-party wrappers were intentionally left untouched because they are not Radix primitives.

## Verification

- `bun run typecheck`: passed.
- `bun test`: passed, 10 tests across 3 files.
- `bun run build`: passed, including Sanity schema extraction and TypeGen; Next.js emitted its existing non-fatal `next/dynamic` client-rendering bailout while generating all 36 static pages.
- Generated CSS inspection confirms the four navigation activation-direction selectors, Base UI disabled-peer selectors, and dialog scale transition property are present.
- `git diff --check`: passed for the migration changes.
- `bun run check`: remains blocked by the pre-existing `biome.json` extension resolution failure for `ultracite/core` with installed Ultracite 7.9.3.

## Registry configuration

- `components.json` now uses `style: "base-maia"` so future shadcn additions resolve to Base UI Maia variants.
- `bunx --bun shadcn@latest info --json` confirms `base: "base"`, Base UI documentation and registry links, and the resolved Maia preset.
- Existing migrated wrappers were not overwritten or restyled; this configuration change only selects the registry source for future component operations.
