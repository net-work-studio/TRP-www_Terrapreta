# navigation-menu

2026-07-17, transformation engine for legacy `new-york`, validated against the official Base Nova registry shape; migrated successfully from Radix UI to Base UI while preserving the customized New York visual treatment.

## Changed

- `src/components/ui/navigation-menu.tsx:2` now imports Base UI's Navigation Menu namespace and uses native part prop types.
- `src/components/ui/navigation-menu.tsx:8` removes the Radix-only `viewport` switch, forwards `align` to the shared positioner, and always renders Base UI's popup anatomy.
- `src/components/ui/navigation-menu.tsx:62` rewrites trigger styling from Radix `data-state` hooks to Base UI's `data-popup-open` hook and removes unsupported trigger-disabled styling.
- `src/components/ui/navigation-menu.tsx:86` replaces Radix motion attributes with Base UI activation-direction and starting/ending transition hooks.
- `src/components/ui/navigation-menu.tsx:100` replaces the Radix viewport wrapper with `Portal > Positioner > Popup > Viewport`, forwards all positioning props to the Positioner, and adopts Base UI popup size and transform-origin variables.
- `src/components/ui/navigation-menu.tsx:143` keeps `NavigationMenuIndicator` as an inert visual compatibility wrapper because Base UI has no equivalent for Radix's active-trigger indicator.
- `.migration/navigation-menu.md` records the API changes, behavior deltas, and manual QA expectations.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/navigation-menu.tsx` returned no matches.

## Left alone

- No application code imports this wrapper, so there were no consumer call sites to migrate.
- The draft-mode file move and dialog manual-QA note were already in progress and were not included in this component migration.
- Third-party UI wrappers such as Sonner remain untouched because they are not Radix primitives.

## Behavior changes

- `viewport` is no longer a supported Root prop; Base UI always renders the active content through its shared positioned popup.
- The public `NavigationMenuViewport` export is replaced by `NavigationMenuPositioner`, which owns `side`, `sideOffset`, `align`, and `alignOffset`.
- Base UI's default open and close delays are 50 ms rather than Radix's 200 ms open delay and 300 ms skip-delay window; no unsupported timing shim was added.
- `NavigationMenuIndicator` no longer tracks the active trigger. It preserves its markup and styling as an inert compatibility wrapper because Base UI's `Icon` is a trigger chevron, not a list-position indicator.
- Navigation triggers have no Base UI `disabled` prop. Consumers must gate disabled navigation items in their own composition.
- Change callbacks now receive Base UI event details as a second argument, and links do not close an open menu unless `closeOnClick` is supplied.

## Verify by hand

- Render two navigation items with triggers and content, hover each trigger, and confirm the shared popup follows the active trigger without jumping or clipping.
- Use Tab, Enter, Space, arrow keys, and Escape to open, traverse, and close the menu; confirm focus returns predictably.
- Move directly between triggers and confirm the content transition direction matches the movement and the new 50 ms timing feels acceptable.
- Activate a navigation link and confirm whether the desired product behavior is to keep the menu open or to opt into `closeOnClick`.
- Resize to a narrow viewport and confirm popup collision handling keeps the content visible within the browser edge.
