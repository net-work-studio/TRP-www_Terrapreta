# Give the Homepage its own hero content

The Homepage singleton owns one hero with a required image and alt text, an emphasis-capable heading, and a short description. The image has no caption. This starts the visible content work deferred in ADR 0001 without introducing a page builder while the remaining sections are still being designed.

The optional hero button has independent visibility and editable text starting as "Learn more". Its destination can be the next section on the Homepage, preserving the original reading flow, or another internal page. New buttons default to the next section. Existing buttons with a page selected retain that destination until an editor changes the destination option.

Internal page destinations are limited to live fixed website pages other than the Homepage, full projects, journal entries, and services. The reference is deliberately weak so its target can be unpublished independently; a missing target or one without a public detail page hides a button configured to open another page. A shown button must have text, and the internal-page option also requires a published, available destination before the Homepage can be published. Switching between the two destination options retains the stored page selection.

The separate "Scroll to learn more" cue links to the section below the hero. Editors choose static, animated, or hidden; static is the default and reduced-motion preferences disable animation. Initial hero content preserves the current image, alt text, heading emphasis, and description in a draft, with the button hidden. The existing hero remains the public fallback until a complete CMS hero is published.
