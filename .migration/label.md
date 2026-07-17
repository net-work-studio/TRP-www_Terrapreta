# label

2026-07-17, transformation engine, migrated the customized New York wrapper from Radix Label to a native label while preserving its public API and styling.

## Changed

- `src/components/ui/label.tsx:1` removes the client boundary and `@radix-ui/react-label` dependency because the wrapper is now static native markup.
- `src/components/ui/label.tsx:8` renders a native `<label>` and retains the existing classes, `data-slot`, `htmlFor`, ref support, and label semantics.
- `.migration/label.md` records the migration and manual QA expectations.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/label.tsx` returns no matches.

## Left alone

- `src/components/ui/field.tsx` keeps importing the stable `Label` wrapper API; no consumer prop changes were required.
- Other Radix wrappers are unrelated to this component and were not touched.
- The typecheck baseline remains blocked only by the pre-existing `@/components/disable-draft-mode` import after that file was moved outside this migration's scope.

## Behavior changes

None. The existing `select-none` class preserves Radix Label's text-selection behavior.

## Verify by hand

- Click a label associated with an input and confirm focus moves to the input.
- Double-click the label and confirm its text is not selected.
- Disable a field and confirm the label's disabled styling remains visible.
