import { describe, expect, test } from "bun:test";
import { evaluate, parse } from "groq-js";
import {
  JOURNAL_ITEM_QUERY,
  PROJECT_ITEM_QUERY,
  SERVICE_QUERY,
} from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { generateDetailPageMetadata } = await import("./metadata");

const QUERIES = {
  project: PROJECT_ITEM_QUERY,
  journal: JOURNAL_ITEM_QUERY,
  service: SERVICE_QUERY,
} as const;
const KINDS = [
  "project",
  "journal",
  "service",
] satisfies (keyof typeof QUERIES)[];
const CONTENT_IMAGE = {
  _id: "image-content-1200x800-webp",
  _type: "sanity.imageAsset",
  url: "https://cdn.sanity.io/images/example/production/content-1200x800.webp",
};
const SOCIAL_IMAGE = {
  _id: "image-social-1200x630-webp",
  _type: "sanity.imageAsset",
  url: "https://cdn.sanity.io/images/example/production/social-1200x630.webp",
};
const SITE_SETTINGS = {
  name: "Site settings",
  brandName: "Terrapreta Studio",
  seo: {
    metaTitle: "Site title",
    metaDescription: "Site description",
    ogImage: {
      _type: "image",
      asset: {
        _id: "image-site-1200x630-webp",
        url: "https://cdn.sanity.io/images/example/production/site-1200x630.webp",
        metadata: null,
      },
      crop: null,
      hotspot: null,
      alt: "Site image",
    },
    canonicalUrl: null,
    robotsIndex: "noindex",
    robotsFollow: "nofollow",
    ogTitle: "Site social title",
    ogDescription: "Site social description",
    twitterCard: "summary",
  },
} satisfies SITE_SETTINGS_QUERY_RESULT;

async function metadata(
  kind: (typeof KINDS)[number],
  overrides: Record<string, unknown> | null = {},
  siteSettings: SITE_SETTINGS_QUERY_RESULT = SITE_SETTINGS,
  isDraftMode = false
) {
  const result = await evaluate(parse(QUERIES[kind]), {
    dataset: [
      CONTENT_IMAGE,
      SOCIAL_IMAGE,
      { _id: "anna", _type: "person", name: "Anna Verdi" },
      { _id: "bianca", _type: "person", name: "Bianca Rossi" },
      ...(overrides
        ? [
            {
              _id: "target",
              _type: kind,
              _updatedAt: "2026-10-16T12:00:00Z",
              name: "Restoring soil",
              slug: { current: "woodland" },
              shortDescription: "Content description",
              mainImage: {
                _type: "editorialImage",
                altContent: "Restored woodland",
                asset: { _type: "reference", _ref: CONTENT_IMAGE._id },
              },
              ...overrides,
            },
          ]
        : []),
    ],
    params: { slug: "woodland" },
  });
  return generateDetailPageMetadata({
    kind,
    page: await result.get(),
    slug: "woodland",
    siteSettings,
    isDraftMode,
  });
}

describe("Detail Page SEO through query results", () => {
  test.each(KINDS)("%s maps every Page SEO override", async (kind) => {
    const result = await metadata(kind, {
      seo: {
        metaTitle: "Search title",
        metaDescription: "Search description",
        ogImage: {
          _type: "image",
          alt: "Social image",
          asset: { _type: "reference", _ref: SOCIAL_IMAGE._id },
        },
        canonicalUrl: "https://example.org/woodland",
        robotsIndex: "index",
        robotsFollow: "follow",
        ogTitle: "Social title",
        ogDescription: "Social description",
        twitterCard: "summary_large_image",
      },
    });
    expect(result.title).toBe("Search title — Terrapreta Studio");
    expect(result.description).toBe("Search description");
    expect(result.alternates?.canonical).toBe("https://example.org/woodland");
    expect(result.robots).toEqual({ index: true, follow: true });
    expect(result.openGraph).toMatchObject({
      siteName: "Terrapreta Studio",
      title: "Social title",
      description: "Social description",
      url: "https://example.org/woodland",
      images: [
        {
          url: expect.stringContaining("social-1200x630.webp"),
          alt: "Social image",
        },
      ],
    });
    expect(result.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Social title",
      description: "Social description",
    });
  });

  test.each(KINDS)(
    "%s falls back to content and Site defaults independently",
    async (kind) => {
      const result = await metadata(kind, {
        seo: {
          metaTitle: "",
          metaDescription: "",
          ogTitle: "",
          ogDescription: "",
        },
      });
      expect(result.title).toBe("Restoring soil — Terrapreta Studio");
      expect(result.description).toBe("Content description");
      expect(result.robots).toEqual({ index: false, follow: false });
      expect(result.openGraph).toMatchObject({
        title: "Restoring soil — Terrapreta Studio",
        description: "Content description",
        images: [
          {
            url: expect.stringContaining("content-1200x800.webp"),
            alt: "Restored woodland",
          },
        ],
      });
      expect(result.twitter).toMatchObject({ card: "summary" });
      expect(
        (await metadata(kind, { shortDescription: null, mainImage: null }))
          .openGraph
      ).toMatchObject({
        description: "Site description",
        images: [{ url: expect.stringContaining("site-1200x630.webp") }],
      });
      // A configured but unusable social image retains the existing Site-image fallback.
      expect(
        (await metadata(kind, { seo: { ogImage: {} } })).openGraph
      ).toMatchObject({
        images: [{ url: expect.stringContaining("site-1200x630.webp") }],
      });
    }
  );

  test.each([
    {
      kind: "project",
      title: "Projects",
      description: "Explore our latest projects.",
      path: "/projects",
    },
    {
      kind: "journal",
      title: "Journal",
      description: "Read our latest journal entries.",
      path: "/journal",
    },
    {
      kind: "service",
      title: "Services",
      description: "Discover our services.",
      path: "/services",
    },
  ] as const)(
    "$kind keeps collection metadata when the entry or name is absent",
    async ({ kind, title, description, path }) => {
      const results = await Promise.all(
        [null, { name: null }, { name: "" }].map((page) => metadata(kind, page))
      );
      for (const result of results) {
        expect(result.title).toBe(`${title} — Terrapreta Studio`);
        expect(result.description).toBe(description);
        expect(result.alternates?.canonical).toBe(
          `https://terrapreta.it${path}`
        );
        expect(result.openGraph).toMatchObject({ type: "website" });
        expect(result.openGraph).not.toHaveProperty("authors");
      }
    }
  );

  test.each(KINDS)("%s previews force noindex and nofollow", async (kind) => {
    expect(
      (
        await metadata(
          kind,
          { seo: { robotsIndex: "index", robotsFollow: "follow" } },
          SITE_SETTINGS,
          true
        )
      ).robots
    ).toEqual({ index: false, follow: false });
  });

  test("Journal metadata preserves author order, valid dates and Organization fallback", async () => {
    const result = await metadata("journal", {
      publishingDate: "2026-10-01",
      authors: [
        { _type: "reference", _ref: "bianca" },
        { _type: "reference", _ref: "anna" },
      ],
    });
    expect(result.openGraph).toMatchObject({
      type: "article",
      authors: ["Bianca Rossi", "Anna Verdi"],
      publishedTime: "2026-10-01",
      modifiedTime: "2026-10-16T12:00:00Z",
      url: "https://terrapreta.it/journal/woodland",
    });
    const fallback = await metadata("journal", {
      publishingDate: "invalid",
      authors: [],
    });
    expect(fallback.openGraph).toMatchObject({ authors: ["Terrapreta"] });
    expect(fallback.openGraph).not.toHaveProperty("publishedTime");
  });
});
