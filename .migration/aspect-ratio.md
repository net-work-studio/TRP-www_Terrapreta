# aspect-ratio

2026-07-16, transformation engine (CSS-native replacement), migrated successfully; typecheck, tests, and production build pass.

## Changed

- `src/components/ui/aspect-ratio.tsx:1` replaces the Radix primitive with a native `div`, preserves the `ratio` prop and div props, applies CSS `aspect-ratio`, and keeps a relative positioning context for fill media.
- `.migration/aspect-ratio.md` records this migration and its manual verification checklist.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/aspect-ratio.tsx` returns no matches.

## Left alone

- The 11 consumer files remain unchanged because the wrapper preserves their existing `ratio`, `className`, children, and div-prop call sites.
- `package.json` and `bun.lock` retain the Radix dependencies until the remaining Radix wrappers are migrated, as required by the progressive migration strategy.
- The repository's Ultracite check remains blocked by its existing `ultracite/core` configuration resolution error; this migration does not alter lint configuration.

## Behavior changes

- The rendered anatomy changes from Radix's wrapper and absolutely positioned inner element to one native `div` using CSS `aspect-ratio`. Selectors targeting Radix's internal `data-radix-aspect-ratio-wrapper` attribute will no longer match.
- The component no longer creates a client boundary because the CSS-native implementation has no client-side behavior.

## Verify by hand

- Open the home, project, and journal views and confirm square, portrait, and landscape media retain their configured ratios.
- Resize across mobile and desktop widths and confirm fill images still cover their containers without overflow.
- Open a service dialog and confirm its image and gradient overlay remain contained by the aspect-ratio element.
