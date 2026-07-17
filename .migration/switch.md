# switch

2026-07-17, transformation engine for legacy `new-york`; migrated successfully from Radix UI to Base UI while preserving the customized wrapper's visual treatment. TypeScript, 10 tests, the production build, and generated CSS inspection pass.

## Changed

- `src/components/ui/switch.tsx:3` now imports Base UI's `Switch` namespace and uses its `Root` and `Thumb` parts with native Base UI prop types.
- `src/components/ui/switch.tsx:15` rewrites Radix `data-[state=checked|unchecked]` selectors to Base UI's `data-checked` and `data-unchecked` presence selectors.
- `src/components/ui/switch.tsx:15` replaces dead native `disabled:` selectors with `data-disabled:` because Base UI's root renders a span and hidden input.
- `src/components/ui/label.tsx:12` adds `peer-data-disabled` cursor and opacity variants so labels following a disabled Base UI switch retain their disabled appearance.
- `.migration/switch.md` records the migration, element change, and manual QA expectations.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/switch.tsx src/components/ui/label.tsx src/components/shared/contact-form.tsx` returned no matches.

## Left alone

- `src/components/shared/contact-form.tsx` continues to pass only `id="newsletter"`; Base UI applies that ID to the hidden input, so its existing label association remains valid without a call-site change.
- `components.json`, `package.json`, and `bun.lock` retain their Radix configuration and dependency until the final Radix wrapper is migrated.
- The draft-mode file move and dialog manual-QA note were already in progress and were not included in this component migration.

## Behavior changes

- The switch root now renders a span with a hidden input instead of a button. Pointer and keyboard interaction, form submission, required state, and disabled state remain owned by Base UI.
- `onCheckedChange` now receives Base UI event details as a second argument; existing one-argument handlers remain compatible.

## Verify by hand

- On the contact form, click both the newsletter label and the switch and confirm each toggles the control.
- Focus the switch with Tab, press Space, and confirm the thumb and background move between unchecked and checked styles.
- Temporarily render the switch disabled and confirm it cannot be toggled and both the control and adjacent label show their disabled cursor and opacity.
- Submit the switch inside a form with a `name` and confirm the checked value is included while the unchecked value is omitted.
