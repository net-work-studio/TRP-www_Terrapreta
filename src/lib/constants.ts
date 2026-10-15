/**
 * Site-wide constants and fallback values.
 * These serve as defaults when Sanity CMS is unavailable or values are not set.
 */

export const SITE_DEFAULTS = {
  name: "Terrapreta",
  description:
    "Regenerating ecosystems from the soil up. Growing equitable places for nature, people and climate.",
  defaultImage: "/images/terrapreta_hero.webp",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://terrapreta.it",
  email: "mail@terrapreta.it",
  certifiedEmail: "pec@srlc.terrapreta.it",
  // Keep the analytics site identity fixed when the base URL is overridden.
  analyticsDomain: "terrapreta.it",
} as const;
