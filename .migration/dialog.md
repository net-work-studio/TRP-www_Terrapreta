# dialog

2026-07-17, transformation engine for legacy `new-york`; migrated successfully from Radix UI to Base UI while preserving the existing visual treatment. TypeScript, 10 tests, the production build, and the diff check pass.

## Changed

- `src/components/ui/dialog.tsx:3` now imports `Dialog` from `@base-ui/react/dialog`; `Overlay` maps to `Backdrop`, `Content` maps to `Popup`, component prop types use Base UI part types, and enter/exit styles use Base UI transition attributes.
- `src/components/ui/dialog.tsx:50` keeps the centered modal anatomy as `Portal > Backdrop + Popup`, with no Positioner.
- `src/app/(frontend)/_sections/services.tsx:51` migrates the only consumer from Radix `asChild` to Base UI `render`, with `nativeButton={false}` for its rendered `<div>` trigger.
- `.migration/dialog.md` records the migration, compatibility notes, and manual verification steps.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/dialog.tsx src/app/\(frontend\)/_sections/services.tsx` returned no matches.

## Left alone

- `components.json` remains on the Radix `new-york` style because this is a progressive single-component migration and five UI wrappers still use Radix.
- `package.json` and `bun.lock` retain `@radix-ui/react-dialog`; Radix dependencies are removed only after the final Radix wrapper is migrated.
- The other UI wrappers and their consumers were not touched because they are outside this component migration.
- `biome.json` and the Ultracite setup were not changed. `bun run check` cannot resolve its existing `ultracite/core` extension with installed Ultracite 7.9.3, so that repository-wide check could not run.

## Behavior changes

- Base UI's `onOpenChange` callback supplies a second event-details argument. Existing one-argument handlers remain compatible, but dismiss prevention now uses the event-details reason and `cancel()` API.
- Base UI's Portal renders a `<div>` wrapper, whereas the Radix Portal did not add a wrapper element.
- Open and close animations now use Base UI's starting/ending transition states instead of Radix state-driven keyframe utilities; the intended fade-and-scale effect is preserved.

## Verify by hand

- Open a service card by clicking its title row and confirm the dialog is centered with the backdrop visible.
- Press Tab and Shift+Tab to confirm focus stays inside the open dialog.
- Press Escape and confirm the dialog closes and focus returns to the service-card trigger.
- Reopen it, click the backdrop and the close icon in separate passes, and confirm both close paths work.
- Confirm the dialog title is announced by a screen reader and the page cannot scroll while the modal is open.
