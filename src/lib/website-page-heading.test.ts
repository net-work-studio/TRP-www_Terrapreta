import { describe, expect, test } from "bun:test";
import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { getWebsitePageHeading } from "./website-page-heading";

describe("website page headings", () => {
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
    const titles = stegaEncodeSourceMap(
      { headingOverride: "Who we are", metaTitle: "About our studio" },
      {
        documents: [{ _id: "aboutPage", _type: "aboutPage" }],
        paths: ["$['headingOverride']", "$['seo']['metaTitle']"],
        mappings: {
          "$['headingOverride']": {
            type: "value",
            source: { type: "documentValue", document: 0, path: 0 },
          },
          "$['metaTitle']": {
            type: "value",
            source: { type: "documentValue", document: 0, path: 1 },
          },
        },
      },
      { enabled: true, studioUrl: "/admin", filter: () => true }
    );
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
