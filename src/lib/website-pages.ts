export const WEBSITE_PAGES = {
  homePage: {
    title: "Homepage",
    path: "/",
    metadataTitle: "Terrapreta",
    description: undefined,
  },
  contactPage: {
    title: "Contact",
    path: "/contacts",
    metadataTitle: "Contacts",
    description: "Get in touch with Terrapreta.",
  },
  aboutPage: {
    title: "About",
    path: "/about",
    metadataTitle: "About",
    description: undefined,
  },
  projectsIndexPage: {
    title: "Projects overview",
    path: "/projects",
    metadataTitle: "Projects",
    description: "Explore our latest projects.",
  },
  journalIndexPage: {
    title: "Journal overview",
    path: "/journal",
    metadataTitle: "Journal",
    description: "Read our latest journal entries.",
  },
  researchIndexPage: {
    title: "Research overview",
    path: "/research",
    metadataTitle: "Research",
    description: undefined,
  },
} as const;

export type WebsitePageId = keyof typeof WEBSITE_PAGES;

export function isWebsitePageId(value: string): value is WebsitePageId {
  return Object.hasOwn(WEBSITE_PAGES, value);
}

// About and Research join this list when their public routes launch.
export const LIVE_WEBSITE_PAGE_IDS = [
  "homePage",
  "contactPage",
  "projectsIndexPage",
  "journalIndexPage",
] as const satisfies readonly WebsitePageId[];

export function isLiveWebsitePageId(
  value: string
): value is (typeof LIVE_WEBSITE_PAGE_IDS)[number] {
  return LIVE_WEBSITE_PAGE_IDS.some((id) => id === value);
}
