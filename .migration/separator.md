# separator

2026-07-17, transformation engine validated against the Base Nova registry, migrated the customized New York wrapper to Base UI while preserving its existing visual classes.

## Changed

- `src/components/ui/separator.tsx:3` replaces `@radix-ui/react-separator` with the installed `@base-ui/react/separator` primitive.
- `src/components/ui/separator.tsx:7` adopts `SeparatorPrimitive.Props`, removes Radix's unsupported `decorative` prop, and retains the existing orientation defaults and classes.
- `.migration/separator.md` records the migration, behavior delta, and manual QA expectations.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/separator.tsx` returns no matches.

## Left alone

- `src/components/ui/field.tsx` keeps importing the stable `Separator` wrapper API; no consumer prop changes were required.
- Other Radix wrappers are unrelated to this component and were not touched.
- The typecheck baseline remains blocked only by the pre-existing `@/components/disable-draft-mode` import after that file was moved outside this migration's scope.

## Behavior changes

- Base UI separators are always semantic `role="separator"` elements. Radix's previous default `decorative={true}` behavior and the `decorative` consumer prop are no longer available.

## Verify by hand - OK

- Confirm horizontal separators remain one pixel high and span the available width.
- Confirm vertical separators fill their container height and remain one pixel wide.
- Inspect the accessibility tree and confirm meaningful separators expose `role="separator"` with the correct orientation.
