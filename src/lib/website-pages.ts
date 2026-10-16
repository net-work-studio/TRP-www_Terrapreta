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
    description:
      "Meet Terrapreta, an interdisciplinary team developing nature-based solutions and ecological restoration projects with soil health at the centre.",
  },
  servicesIndexPage: {
    title: "Services index",
    path: "/services",
    metadataTitle: "Services",
    description: "Discover our services.",
  },
  projectsIndexPage: {
    title: "Projects index",
    path: "/projects",
    metadataTitle: "Projects",
    description: "Explore our latest projects.",
  },
  journalIndexPage: {
    title: "Journal index",
    path: "/journal",
    metadataTitle: "Journal",
    description: "Read our latest journal entries.",
  },
  researchIndexPage: {
    title: "Research index",
    path: "/research",
    metadataTitle: "Research",
    description: undefined,
  },
} as const;

export type WebsitePageId = keyof typeof WEBSITE_PAGES;

export const WEBSITE_PAGE_HEADING_DEFAULTS = {
  aboutPage: "About",
  contactPage: "Contact us",
  servicesIndexPage: "Services",
  projectsIndexPage: "Projects",
  journalIndexPage: "Journal",
} as const satisfies Partial<Record<WebsitePageId, string>>;

export type WebsitePageWithHeadingId =
  keyof typeof WEBSITE_PAGE_HEADING_DEFAULTS;

export function isWebsitePageWithHeadingId(
  id: WebsitePageId
): id is WebsitePageWithHeadingId {
  return Object.hasOwn(WEBSITE_PAGE_HEADING_DEFAULTS, id);
}

export function isWebsitePageId(value: string): value is WebsitePageId {
  return Object.hasOwn(WEBSITE_PAGES, value);
}

// Research joins this list when its public route launches.
export const LIVE_WEBSITE_PAGE_IDS = [
  "homePage",
  "contactPage",
  "aboutPage",
  "servicesIndexPage",
  "projectsIndexPage",
  "journalIndexPage",
] as const satisfies readonly WebsitePageId[];

export function isLiveWebsitePageId(
  value: string
): value is (typeof LIVE_WEBSITE_PAGE_IDS)[number] {
  return LIVE_WEBSITE_PAGE_IDS.some((id) => id === value);
}
