import { describe, expect, test } from "bun:test";
import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { getWebsitePageHeading } from "./website-page-heading";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { client } = await import("@/sanity/lib/client");

function encodeTitles(pageType: string) {
  return stegaEncodeSourceMap(
    {
      headingOverride: "Who we are",
      metaTitle: "About our studio",
      metaDescription: "Search description",
      ogTitle: "Social title",
    },
    {
      documents: [{ _id: pageType, _type: pageType }],
      paths: [
        "$['headingOverride']",
        "$['seo']['metaTitle']",
        "$['seo']['metaDescription']",
        "$['seo']['ogTitle']",
      ],
      mappings: {
        "$['headingOverride']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 0 },
        },
        "$['metaTitle']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 1 },
        },
        "$['metaDescription']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 2 },
        },
        "$['ogTitle']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 3 },
        },
      },
    },
    { ...client.config().stega, enabled: true }
  );
}

describe("website page headings", () => {
  test.each([
    "aboutPage",
    "servicesIndexPage",
    "projectsIndexPage",
    "journalIndexPage",
    "contactPage",
  ] as const)(
    "keeps SEO-derived %s headings editable with the production stega filter",
    (pageId) => {
      const titles = encodeTitles(pageId);
      const heading = getWebsitePageHeading(pageId, {
        _id: pageId,
        headingOverride: null,
        seo: { metaTitle: titles.metaTitle },
      });
      expect(heading).not.toBe("About our studio");
      expect(heading).toBe(titles.metaTitle);
      expect(titles.metaDescription).toBe("Search description");
      expect(titles.ogTitle).toBe("Social title");
    }
  );

  test.each([
    "homePage",
    "researchIndexPage",
    "project",
    "service",
    "journal",
    "site",
  ])("keeps SEO titles on %s excluded from preview annotations", (pageType) => {
    expect(encodeTitles(pageType).metaTitle).toBe("About our studio");
  });

  test("keeps stega disabled unless a preview fetch enables it", () => {
    expect(client.config().stega.enabled).toBe(false);
  });

  test("uses visible wording independently of the existing SEO title", () => {
    const page = {
      _id: "servicesIndexPage",
      headingOverride: "What we do",
      seo: { metaTitle: "Ecosystem restoration services" },
    };
    expect(getWebsitePageHeading("servicesIndexPage", page)).toBe("What we do");
    expect(page.seo.metaTitle).toBe("Ecosystem restoration services");
    expect(
      getWebsitePageHeading("servicesIndexPage", {
        ...page,
        headingOverride: null,
      })
    ).toBe("Ecosystem restoration services");
  });

  test("uses the visible default when a page or its title fields are missing", () => {
    expect(getWebsitePageHeading("contactPage", null)).toBe("Contact us");
    expect(getWebsitePageHeading("aboutPage", undefined)).toBe("About");
    expect(
      getWebsitePageHeading("projectsIndexPage", {
        _id: "projectsIndexPage",
        headingOverride: "  ",
        seo: { metaTitle: "" },
      })
    ).toBe("Projects");
  });

  test("keeps Visual Editing annotations on the chosen source field and ignores annotated blanks", () => {
    const titles = encodeTitles("aboutPage");
    expect(titles.headingOverride).not.toBe("Who we are");
    expect(
      getWebsitePageHeading("aboutPage", {
        _id: "aboutPage",
        headingOverride: titles.headingOverride,
        seo: { metaTitle: titles.metaTitle },
      })
    ).toBe(titles.headingOverride);
    const annotation = titles.headingOverride.slice("Who we are".length);
    expect(
      getWebsitePageHeading("aboutPage", {
        _id: "aboutPage",
        headingOverride: `  ${annotation}`,
        seo: { metaTitle: titles.metaTitle },
      })
    ).toBe(titles.metaTitle);
  });
});
