import { describe, expect, test } from "bun:test";
import { evaluate, parse } from "groq-js";
import { renderToStaticMarkup } from "react-dom/server";
import { getInternalPageHref } from "@/lib/internal-page";
import { getContentSitemap } from "@/lib/website-page-sitemap";
import {
  HOME_HERO_QUERY,
  INTERNAL_PAGE_DESTINATION_QUERY,
  JOURNAL_QUERY,
  JOURNAL_SITEMAP_QUERY,
  PROJECTS_QUERY,
  PROJECTS_SITEMAP_QUERY,
  SERVICES_QUERY,
  SERVICES_SITEMAP_QUERY,
} from "@/sanity/lib/queries";
import type {
  HOME_HERO_QUERY_RESULT,
  INTERNAL_PAGE_DESTINATION_QUERY_RESULT,
  JOURNAL_QUERY_RESULT,
  JOURNAL_SITEMAP_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
  PROJECTS_SITEMAP_QUERY_RESULT,
  SERVICES_QUERY_RESULT,
  SERVICES_SITEMAP_QUERY_RESULT,
} from "@/sanity/types";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { default: PageGrid } = await import("@/components/layout/page-grid");
const { HomeHeroContent } = await import(
  "@/app/(frontend)/_sections/home-hero-content"
);

const ASSET = {
  _id: "image-example-1200x800-webp",
  _type: "sanity.imageAsset",
  url: "https://cdn.sanity.io/images/example/production/example-1200x800.webp",
};
const IMAGE = {
  _type: "editorialImage",
  altContent: "Restored woodland",
  asset: { _type: "reference", _ref: ASSET._id },
};

describe("Public page availability across callers", () => {
  test.each([
    {
      type: "project",
      scope: "full",
      image: IMAGE,
      href: "/projects/soil%20%26%20water",
    },
    {
      type: "project",
      scope: undefined,
      image: IMAGE,
      href: "/projects/soil%20%26%20water",
    },
    { type: "project", scope: "overview", image: IMAGE, href: null },
    { type: "project", scope: "full", image: null, href: null },
    {
      type: "journal",
      scope: undefined,
      image: IMAGE,
      href: "/journal/soil%20%26%20water",
    },
    {
      type: "journal",
      scope: undefined,
      image: { asset: { _ref: "missing" } },
      href: null,
    },
    {
      type: "service",
      scope: undefined,
      image: null,
      href: "/services/soil%20%26%20water",
    },
  ])(
    "$type / $scope / $href agrees through GROQ, Hero, grid and sitemap",
    async ({ type, scope, image, href }) => {
      const dataset = [
        ASSET,
        {
          _id: "target",
          _type: type,
          _updatedAt: "2026-10-01T00:00:00Z",
          name: "Target",
          slug: { current: "soil & water" },
          publicationScope: scope,
          mainImage: image,
        },
        {
          _id: "homePage",
          _type: "homePage",
          hero: {
            heading: [
              {
                _type: "block",
                _key: "heading",
                style: "normal",
                children: [
                  {
                    _type: "span",
                    _key: "text",
                    text: "Restore nature",
                    marks: [],
                  },
                ],
              },
            ],
            description: "Restoring ecosystems together",
            image: IMAGE,
            button: {
              visibility: "shown",
              label: "Target link",
              destinationType: "page",
              page: { _type: "reference", _ref: "target" },
            },
            scrollCue: "hidden",
          },
        },
      ];
      async function query(queryString: string, params = {}) {
        return (await evaluate(parse(queryString), { dataset, params })).get();
      }

      const destination: INTERNAL_PAGE_DESTINATION_QUERY_RESULT = await query(
        INTERNAL_PAGE_DESTINATION_QUERY,
        { id: "target" }
      );
      const hero: HOME_HERO_QUERY_RESULT = await query(HOME_HERO_QUERY);
      const projects: PROJECTS_QUERY_RESULT = await query(PROJECTS_QUERY);
      const journal: JOURNAL_QUERY_RESULT = await query(JOURNAL_QUERY);
      const services: SERVICES_QUERY_RESULT = await query(SERVICES_QUERY);
      const sitemapProjects: PROJECTS_SITEMAP_QUERY_RESULT = await query(
        PROJECTS_SITEMAP_QUERY
      );
      const sitemapJournal: JOURNAL_SITEMAP_QUERY_RESULT = await query(
        JOURNAL_SITEMAP_QUERY
      );
      const sitemapServices: SERVICES_SITEMAP_QUERY_RESULT = await query(
        SERVICES_SITEMAP_QUERY
      );

      if (!hero) {
        throw new Error("The Homepage hero must be projected.");
      }
      expect(getInternalPageHref(destination)).toBe(href);
      expect(getInternalPageHref(hero.hero.button?.page, "hero")).toBe(href);
      const heroMarkup = renderToStaticMarkup(
        <HomeHeroContent hero={hero.hero} />
      );
      if (href) {
        expect(heroMarkup).toContain(`href="${href}"`);
      } else {
        expect(heroMarkup).not.toContain("Target link");
      }

      const grid = renderToStaticMarkup(
        <PageGrid items={[...projects, ...journal, ...services]} />
      );
      if (href && image === IMAGE) {
        expect(grid).toContain(`href="${href}"`);
      } else {
        expect(grid).not.toContain("<a ");
      }
      if (scope === "overview") {
        expect(grid).toContain("<article");
        expect(grid).toContain("Target");
      }

      const sitemap = getContentSitemap({
        pages: [],
        projects: sitemapProjects,
        journal: sitemapJournal,
        services: sitemapServices,
        redirects: [],
        baseUrl: "https://terrapreta.it",
      });
      const detailUrls = sitemap
        .map(({ url }) => url)
        .filter((url) => url.includes("/soil"));
      expect(detailUrls).toEqual(href ? [`https://terrapreta.it${href}`] : []);
    }
  );
});
