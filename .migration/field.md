# field

2026-07-17, transformation engine validated against the official Base Nova field registry, migrated the customized New York wrapper's remaining Radix state hooks after its Label and Separator prerequisites were moved off Radix.

## Changed

- `src/components/ui/field.tsx:118` replaces Radix `data-state="checked"` descendant selectors with Base UI's boolean `data-checked` selectors while retaining the existing colors and dark-mode treatment.
- `.migration/field.md` records the dependency ordering, state-hook migration, behavior delta, and manual QA expectations.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/field.tsx` returns no matches.

## Left alone

- `src/components/shared/contact-form.tsx` continues using the stable Field API; it has no migrated call-site props and required no edits.
- Customized New York spacing, typography, orientation behavior, error de-duplication, and layout selectors were preserved instead of replaying Nova styles.
- Other Radix controls, including Switch and Radio Group, remain outside this migration.
- The typecheck baseline remains blocked only by the pre-existing `@/components/disable-draft-mode` import after that file was moved outside this migration's scope.

## Behavior changes

- Card-style `FieldLabel` checked styling now responds to Base UI controls exposing `data-checked`. A still-Radix control nested in that pattern will not trigger the checked styling until its own wrapper is migrated.

## Verify by hand

- Submit the contact form with empty required inputs and confirm native validation still targets the correct fields.
- Click each label and confirm focus or activation reaches its associated input or switch.
- Check a Base UI checkbox or radio inside a card-style `FieldLabel` and confirm the border and background checked styles appear.
- Resize a responsive field group and confirm vertical and horizontal orientations retain their spacing and alignment.
