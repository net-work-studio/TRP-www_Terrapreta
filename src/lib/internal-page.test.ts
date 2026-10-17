import { describe, expect, test } from "bun:test";
import { getInternalPageHref } from "./internal-page";

describe("Public page destinations", () => {
  test.each([
    { _type: "contactPage", href: "/contacts" },
    { _type: "aboutPage", href: "/about" },
    { _type: "projectsIndexPage", href: "/projects" },
    { _type: "journalIndexPage", href: "/journal" },
  ] as const)("resolves the live $_type singleton", ({ _type, href }) => {
    expect(
      getInternalPageHref({
        _id: _type,
        _type,
        slug: null,
        publicationScope: "full",
        hasImage: false,
      })
    ).toBe(href);
  });

  test.each([
    { _type: "project", href: "/projects/woodland" },
    { _type: "journal", href: "/journal/woodland" },
    { _type: "service", href: "/services/woodland" },
  ] as const)("resolves a published $_type detail page", ({ _type, href }) => {
    expect(
      getInternalPageHref({
        _id: "example",
        _type,
        slug: "woodland",
        publicationScope: "full",
        hasImage: true,
      })
    ).toBe(href);
  });

  test.each(["homePage", "researchIndexPage"] as const)(
    "rejects %s as a Homepage hero destination",
    (_type) => {
      expect(
        getInternalPageHref(
          {
            _id: _type,
            _type,
            slug: null,
            publicationScope: "full",
            hasImage: false,
          },
          "hero"
        )
      ).toBeNull();
    }
  );

  test("rejects a generic page even when it has a slug", () => {
    expect(
      getInternalPageHref({
        _id: "example",
        _type: "page",
        slug: "woodland",
        publicationScope: "full",
        hasImage: true,
      })
    ).toBeNull();
  });

  test("rejects noncanonical copies of a singleton", () => {
    expect(
      getInternalPageHref({
        _id: "copy-of-contact",
        _type: "contactPage",
        slug: null,
        publicationScope: "full",
        hasImage: false,
      })
    ).toBeNull();
  });
});

test("Homepage is available to public links but excluded from Hero links", () => {
  const destination = {
    _id: "homePage",
    _type: "homePage",
    slug: null,
    publicationScope: "full",
    hasImage: false,
  } as const;
  expect(getInternalPageHref(destination)).toBe("/");
  expect(getInternalPageHref(destination, "hero")).toBeNull();
});

test("fixed routes retain public fallbacks except document-backed About", () => {
  expect(getInternalPageHref("homePage")).toBe("/");
  expect(getInternalPageHref("contactPage")).toBe("/contacts");
  expect(getInternalPageHref("projectsIndexPage")).toBe("/projects");
  expect(getInternalPageHref("journalIndexPage")).toBe("/journal");
  expect(getInternalPageHref("aboutPage")).toBeNull();
  expect(getInternalPageHref("researchIndexPage")).toBeNull();
});
