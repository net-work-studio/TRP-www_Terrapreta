import { describe, expect, test } from "bun:test";
import type {
  SITE_SETTINGS_QUERY_RESULT,
  WEBSITE_PAGE_SEO_QUERY_RESULT,
} from "@/sanity/types";
import { SITE_DEFAULTS } from "./constants";
import {
  getContentSitemap,
  getWebsitePagesSitemap,
} from "./website-page-sitemap";

// Metadata's image builder needs a project configuration even for fallback images.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { generateMetadata, generateWebsitePageMetadata } = await import(
  "./metadata"
);

const EMPTY_SEO = {
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
  canonicalUrl: null,
  robotsIndex: null,
  robotsFollow: null,
  ogTitle: null,
  ogDescription: null,
  twitterCard: null,
} satisfies NonNullable<NonNullable<SITE_SETTINGS_QUERY_RESULT>["seo"]>;

const SITE_SETTINGS = {
  name: "Site Settings",
  brandName: null,
  seo: {
    ...EMPTY_SEO,
    metaTitle: "Soil-based solutions",
    metaDescription: "Shared description",
    ogTitle: "Shared social title",
    ogDescription: "Shared social description",
    canonicalUrl: "https://example.com/site-canonical",
    twitterCard: "summary",
  },
} satisfies SITE_SETTINGS_QUERY_RESULT;

describe("fixed website page SEO", () => {
  test("keeps existing route metadata available before singletons are published", () => {
    const metadata = generateWebsitePageMetadata({
      pageId: "contactPage",
      page: null,
      siteSettings: null,
    });

    expect(metadata.title).toBe("Contacts — Terrapreta");
    expect(metadata.description).toBe("Get in touch with Terrapreta.");
    expect(metadata.alternates?.canonical).toBe(
      `${SITE_DEFAULTS.baseUrl}/contacts`
    );
    expect(
      getWebsitePagesSitemap([], SITE_DEFAULTS.baseUrl).map(({ url }) => url)
    ).toEqual([
      `${SITE_DEFAULTS.baseUrl}/`,
      `${SITE_DEFAULTS.baseUrl}/contacts`,
      `${SITE_DEFAULTS.baseUrl}/projects`,
      `${SITE_DEFAULTS.baseUrl}/journal`,
    ]);
  });

  test("uses page overrides without turning the homepage title into the site brand", () => {
    const page = {
      _id: "projectsIndexPage",
      seo: {
        ...EMPTY_SEO,
        metaTitle: "Our work",
        metaDescription: "Page description",
        canonicalUrl: "https://example.com/work",
        ogTitle: "Work social title",
        ogDescription: "Work social description",
        twitterCard: "summary_large_image",
      },
    } satisfies WEBSITE_PAGE_SEO_QUERY_RESULT;

    const metadata = generateWebsitePageMetadata({
      pageId: "projectsIndexPage",
      page,
      siteSettings: SITE_SETTINGS,
    });
    expect(metadata.title).toBe("Our work — Terrapreta");
    expect(metadata.description).toBe("Page description");
    expect(metadata.alternates?.canonical).toBe("https://example.com/work");
    expect(metadata.openGraph).toMatchObject({
      siteName: "Terrapreta",
      title: "Work social title",
      description: "Work social description",
      url: "https://example.com/work",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Work social title",
      description: "Work social description",
    });

    expect(
      generateMetadata({ title: "An article", siteSettings: SITE_SETTINGS })
        .title
    ).toBe("An article — Terrapreta");
  });

  test.each([null, ""])(
    "uses page SEO for social previews when OG overrides are %j",
    (override) => {
      const metadata = generateWebsitePageMetadata({
        pageId: "projectsIndexPage",
        page: {
          _id: "projectsIndexPage",
          seo: {
            ...EMPTY_SEO,
            metaTitle: "Our work",
            metaDescription: "Page description",
            ogTitle: override,
            ogDescription: override,
          },
        },
        siteSettings: SITE_SETTINGS,
      });

      expect(metadata.title).toBe("Our work — Terrapreta");
      expect(metadata.description).toBe("Page description");
      for (const social of [metadata.openGraph, metadata.twitter]) {
        expect(social).toMatchObject({
          title: "Our work — Terrapreta",
          description: "Page description",
        });
      }
    }
  );

  test.each([
    {
      metaTitle: "Our work",
      metaDescription: null,
      title: "Our work — Terrapreta",
      description: "Shared social description",
    },
    {
      metaTitle: null,
      metaDescription: "Page description",
      title: "Shared social title",
      description: "Page description",
    },
  ])("resolves social title and description independently for %j", (values) => {
    const metadata = generateWebsitePageMetadata({
      pageId: "projectsIndexPage",
      page: {
        _id: "projectsIndexPage",
        seo: {
          ...EMPTY_SEO,
          metaTitle: values.metaTitle,
          metaDescription: values.metaDescription,
        },
      },
      siteSettings: SITE_SETTINGS,
    });

    for (const social of [metadata.openGraph, metadata.twitter]) {
      expect(social).toMatchObject({
        title: values.title,
        description: values.description,
      });
    }
  });

  test("uses shared homepage fallbacks but keeps canonical URLs specific to each route", () => {
    const home = generateWebsitePageMetadata({
      pageId: "homePage",
      page: { _id: "homePage", seo: EMPTY_SEO },
      siteSettings: SITE_SETTINGS,
    });
    expect(home.title).toBe("Soil-based solutions — Terrapreta");
    expect(home.description).toBe("Shared description");
    expect(home.alternates?.canonical).toBe(`${SITE_DEFAULTS.baseUrl}/`);
    expect(home.twitter).toMatchObject({ card: "summary" });
    for (const social of [home.openGraph, home.twitter]) {
      expect(social).toMatchObject({
        title: "Shared social title",
        description: "Shared social description",
      });
    }

    const journal = generateWebsitePageMetadata({
      pageId: "journalIndexPage",
      page: { _id: "journalIndexPage", seo: EMPTY_SEO },
      siteSettings: SITE_SETTINGS,
    });
    expect(journal.title).toBe("Journal — Terrapreta");
    expect(journal.description).toBe("Read our latest journal entries.");
    expect(journal.alternates?.canonical).toBe(
      `${SITE_DEFAULTS.baseUrl}/journal`
    );
  });

  test("uses an explicit brand name independently of the Site document label and SEO title", () => {
    const metadata = generateWebsitePageMetadata({
      pageId: "projectsIndexPage",
      page: null,
      siteSettings: { ...SITE_SETTINGS, brandName: "Terrapreta Studio" },
    });
    expect(metadata.title).toBe("Projects — Terrapreta Studio");
    expect(metadata.openGraph).toMatchObject({ siteName: "Terrapreta Studio" });
  });

  test("keeps robots metadata and sitemap inclusion consistent with inherited defaults", () => {
    const siteSettings = {
      ...SITE_SETTINGS,
      seo: {
        ...SITE_SETTINGS.seo,
        robotsIndex: "noindex",
        robotsFollow: "nofollow",
      },
    } satisfies SITE_SETTINGS_QUERY_RESULT;
    const contact = {
      _id: "contactPage",
      seo: { ...EMPTY_SEO, robotsIndex: "index" },
    } satisfies WEBSITE_PAGE_SEO_QUERY_RESULT;

    expect(
      generateWebsitePageMetadata({
        pageId: "contactPage",
        page: contact,
        siteSettings,
      }).robots
    ).toEqual({ index: true, follow: false });
    expect(
      generateWebsitePageMetadata({
        pageId: "projectsIndexPage",
        page: null,
        siteSettings,
      }).robots
    ).toEqual({ index: false, follow: false });

    const sitemap = getWebsitePagesSitemap(
      [
        {
          _id: "site",
          _updatedAt: "2026-10-01",
          seo: { robotsIndex: "noindex", canonicalUrl: null },
        },
        {
          _id: "contactPage",
          _updatedAt: "2026-10-02",
          seo: { robotsIndex: "index", canonicalUrl: null },
        },
        {
          _id: "aboutPage",
          _updatedAt: "2026-10-03",
          seo: { robotsIndex: "index", canonicalUrl: null },
        },
        {
          _id: "researchIndexPage",
          _updatedAt: "2026-10-03",
          seo: { robotsIndex: "index", canonicalUrl: null },
        },
      ],
      SITE_DEFAULTS.baseUrl
    );
    expect(sitemap.map(({ url }) => url)).toEqual([
      `${SITE_DEFAULTS.baseUrl}/contacts`,
      `${SITE_DEFAULTS.baseUrl}/about`,
    ]);
    expect(sitemap[0]?.lastModified).toEqual(new Date("2026-10-02"));
  });

  test("excludes a noindex page without removing its indexable collection overview siblings", () => {
    const metadata = generateWebsitePageMetadata({
      pageId: "projectsIndexPage",
      page: {
        _id: "projectsIndexPage",
        seo: { ...EMPTY_SEO, robotsIndex: "noindex" },
      },
      siteSettings: null,
    });
    expect(metadata.robots).toEqual({ index: false, follow: true });
    const sitemap = getWebsitePagesSitemap(
      [
        {
          _id: "projectsIndexPage",
          _updatedAt: "2026-10-02",
          seo: { robotsIndex: "noindex", canonicalUrl: null },
        },
      ],
      SITE_DEFAULTS.baseUrl
    );
    expect(sitemap.some(({ url }) => url.endsWith("/projects"))).toBe(false);
    expect(sitemap.some(({ url }) => url.endsWith("/journal"))).toBe(true);
  });

  test("forces previews to noindex and nofollow even when the page permits indexing", () => {
    const metadata = generateWebsitePageMetadata({
      pageId: "homePage",
      page: {
        _id: "homePage",
        seo: { ...EMPTY_SEO, robotsIndex: "index", robotsFollow: "follow" },
      },
      siteSettings: SITE_SETTINGS,
      isDraftMode: true,
    });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("complete SEO integration", () => {
  test("inherits Site robots on detail and static pages, with independent page overrides", () => {
    const siteSettings = {
      ...SITE_SETTINGS,
      seo: {
        ...SITE_SETTINGS.seo,
        robotsIndex: "noindex",
        robotsFollow: "nofollow",
      },
    } satisfies SITE_SETTINGS_QUERY_RESULT;
    expect(
      generateMetadata({ title: "A service", siteSettings }).robots
    ).toEqual({ index: false, follow: false });
    expect(
      generateMetadata({
        title: "A service",
        robotsIndex: "index",
        siteSettings,
      }).robots
    ).toEqual({ index: true, follow: false });
    expect(
      generateMetadata({
        title: "A service",
        robotsIndex: "index",
        siteSettings,
        isDraftMode: true,
      }).robots
    ).toEqual({ index: false, follow: false });
  });

  test("adds the brand to titles containing punctuation without duplicating an existing suffix", () => {
    expect(generateMetadata({ title: "Soil — a living system" }).title).toBe(
      "Soil — a living system — Terrapreta"
    );
    expect(generateMetadata({ title: "Soil — Terrapreta" }).title).toBe(
      "Soil — Terrapreta"
    );
  });

  test("omits noindex, noncanonical and redirected URLs across every sitemap collection", () => {
    const result = getContentSitemap({
      baseUrl: "https://terrapreta.it",
      pages: [
        {
          _id: "site",
          _updatedAt: "2026-10-01",
          seo: { robotsIndex: "noindex", canonicalUrl: null },
        },
        {
          _id: "contactPage",
          _updatedAt: "2026-10-02",
          seo: {
            robotsIndex: "index",
            canonicalUrl: "https://example.org/contact",
          },
        },
      ],
      projects: [
        {
          slug: "old",
          _updatedAt: "2026-10-02",
          seo: { robotsIndex: "index", canonicalUrl: null },
        },
      ],
      journal: [{ slug: "inherited", _updatedAt: "2026-10-03", seo: null }],
      services: [
        {
          slug: "restoration",
          _updatedAt: "2026-10-04",
          seo: { robotsIndex: "index", canonicalUrl: null },
        },
      ],
      redirects: [
        {
          source: "/projects/:slug",
          destination: "/projects",
          permanent: "permanent",
        },
      ],
    });
    expect(result).toEqual([
      {
        url: "https://terrapreta.it/services/restoration",
        lastModified: new Date("2026-10-04"),
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ]);
  });

  test("social images retain editor alt text and advertise dimensions only for resized assets", () => {
    const metadata = generateMetadata({
      title: "Forest",
      image: {
        asset: { _id: "image-example-2400x1600-webp" },
        alt: "Sunlight through restored woodland",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      images: [
        { width: 1200, height: 630, alt: "Sunlight through restored woodland" },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      images: [{ alt: "Sunlight through restored woodland" }],
    });
    const fallback = generateMetadata({ title: "Contacts" });
    expect(fallback.openGraph).toMatchObject({
      images: [
        {
          url: `${SITE_DEFAULTS.baseUrl}/images/terrapreta_hero.webp`,
          alt: "Contacts",
        },
      ],
    });
    expect(fallback.openGraph).not.toMatchObject({
      images: [{ width: 1200, height: 630 }],
    });
  });

  test("social-image resizing respects the editor's crop and hotspot", () => {
    const metadata = generateMetadata({
      title: "Forest",
      image: {
        asset: { _id: "image-example-2400x1600-webp" },
        crop: {
          _type: "sanity.imageCrop",
          top: 0.25,
          bottom: 0.25,
          left: 0.25,
          right: 0.25,
        },
        hotspot: {
          _type: "sanity.imageHotspot",
          x: 0.5,
          y: 0.5,
          width: 0.1,
          height: 0.1,
        },
      },
    });
    expect(metadata.openGraph).toMatchObject({
      images: [
        { url: expect.stringContaining("rect=600,485,1200,630&w=1200&h=630") },
      ],
    });
  });
});
