# button

2026-07-17, transformation engine for legacy `new-york`, migrated successfully to Base UI while preserving the customized styles and variants.

## Changed

- `src/components/ui/button.tsx:1` replaces Radix Slot with the real `@base-ui/react/button` primitive; the wrapper now accepts `ButtonPrimitive.Props` and retains the existing CVA variants, sizes, classes, defaults, and `data-slot` attribute.
- `src/app/not-found.tsx:35` and `src/app/error.tsx:40` replace link-rendering Buttons with semantic Next.js Links styled through `buttonVariants`.
- `src/components/shared/footer.tsx:29`, `src/app/(frontend)/page.tsx:110`, `src/app/(frontend)/_sections/home-hero.tsx:23`, and `src/app/(frontend)/_sections/pilot-project.tsx:44` migrate CTA links from Radix `asChild` composition to semantic Links styled through `buttonVariants`.
- `src/app/(frontend)/_sections/services.tsx:84` and `src/app/(frontend)/_sections/services.tsx:114` replace nested or `asChild` link Buttons with styled Links while retaining the true icon action as a Button.
- `src/app/(frontend)/services/[slug]/page.tsx:109` replaces the nested contact Link inside a Button with a semantic styled Link.
- `src/app/(frontend)/contacts/page.tsx:23` applies `buttonVariants` directly to `ObfuscatedEmail`, preserving its eventual `mailto:` link semantics.
- `src/components/shared/header.tsx:3` removes a disabled Radix `asChild` example and the scroll state used only by that dead code, leaving the active mobile-menu Button unchanged.
- `.migration/button.md` records this migration and its manual verification checklist.
- `bun run typecheck`, `bun test`, and `bun run build` pass. The build also completes Sanity schema extraction and TypeGen successfully.
- Leftover scan is clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/button.tsx` returns no matches.

## Left alone

- `src/components/shared/contact-form.tsx`, `src/components/ui/copy-link.tsx`, and the active Button in `src/components/shared/header.tsx` use native button behavior and require no consumer API changes.
- `src/app/(frontend)/_sections/services.tsx` still uses Radix `DialogTrigger asChild`; Dialog is a separate wrapper and outside this button migration.
- `components.json` remains on the legacy `new-york`/Radix configuration because this is a progressive single-component migration and six UI wrappers still import Radix.
- `@radix-ui/react-slot` and the other Radix dependencies remain installed until the last Radix wrapper is migrated.

## Behavior changes

- No runtime behavior change is expected. Link-shaped controls remain links instead of receiving Base UI Button's forced `role="button"`; true actions render through the Base UI Button primitive.
- The wrapper API no longer exposes Radix's `asChild` prop. All active consumers were migrated to the semantic `buttonVariants` link pattern.

## Verify by hand - OK

- Open the home, footer, contacts, service, error, and not-found views; confirm each CTA matches its previous size, colors, spacing, hover state, and layout.
- Tab through those CTAs and confirm links show the expected focus ring, navigate normally, and expose link semantics to assistive technology.
- Open the mobile menu and submit the contact form; confirm true Buttons still respond to click, keyboard activation, disabled state, and focus styling.
- Check the home hero and pilot-project CTAs at desktop and mobile widths to confirm their transition and sizing classes remain intact.
