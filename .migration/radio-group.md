# radio-group

2026-07-17, transformation engine for legacy `new-york`; migrated successfully from Radix UI to Base UI while preserving the customized wrapper's visual treatment.

## Changed

- `src/components/ui/radio-group.tsx:3` now composes Base UI's callable `RadioGroup` with `Radio.Root` and `Radio.Indicator`, matching Base UI's split primitive anatomy.
- `src/components/ui/radio-group.tsx:28` replaces the dead native `disabled:` selectors with Base UI's `data-disabled:` state selectors because `Radio.Root` renders a span and hidden input.
- `.migration/radio-group.md` records the migration, element change, and manual QA expectations.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/radio-group.tsx` returned no matches.

## Left alone

- `src/components/ui/field.tsx` only styles the radio group's existing `data-slot` marker and requires no API changes.
- `components.json`, `package.json`, and `bun.lock` retain their Radix configuration and dependency until the final Radix wrapper is migrated.
- The draft-mode file move and dialog manual-QA note were already in progress and were not included in this component migration.

## Behavior changes

- Each radio item now renders a span with a hidden input instead of a button. Keyboard navigation, form submission, required state, and disabled state remain owned by the Base UI radio group.
- `onValueChange` now receives Base UI event details as a second argument; existing one-argument handlers remain compatible.

## Verify by hand

- Render two or more radio items with distinct values and confirm clicking each label or item updates the selected indicator.
- Focus the selected item and use the arrow keys to move selection through the group, including wraparound.
- Confirm a disabled item is skipped by keyboard navigation and cannot be selected by pointer.
- Submit the radio group inside a form and confirm its selected value and required validation behavior.
