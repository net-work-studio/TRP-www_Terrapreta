import { describe, expect, test } from "bun:test";
import { evaluate, parse } from "groq-js";
import { PortableText } from "next-sanity";
import { renderToStaticMarkup } from "react-dom/server";
import { JOURNAL_ITEM_QUERY } from "@/sanity/lib/queries";
import type { JOURNAL_ITEM_QUERY_RESULT } from "@/sanity/types";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { portableTextComponents } = await import("./portable-text-components");

const IMAGE_ASSET = {
  _id: "image-example-1200x800-webp",
  _type: "sanity.imageAsset",
  url: "https://cdn.sanity.io/images/example/production/example-1200x800.webp",
};
const MAIN_IMAGE = {
  _type: "editorialImage",
  asset: { _type: "reference", _ref: IMAGE_ASSET._id },
};

async function renderInternalLink(
  target: Record<string, unknown> | null,
  referenceId = "target"
) {
  const dataset = [
    IMAGE_ASSET,
    {
      _id: "source",
      _type: "journal",
      slug: { current: "source" },
      contentObject: [
        {
          _type: "block",
          _key: "block",
          style: "normal",
          markDefs: [
            {
              _type: "internalLink",
              _key: "link",
              reference: { _type: "reference", _ref: referenceId },
            },
          ],
          children: [
            { _type: "span", _key: "text", text: "Page link", marks: ["link"] },
          ],
        },
      ],
    },
    ...(target ? [{ _id: referenceId, ...target }] : []),
  ];
  const result = await evaluate(parse(JOURNAL_ITEM_QUERY), {
    dataset,
    params: { slug: "source" },
  });
  const page: JOURNAL_ITEM_QUERY_RESULT = await result.get();

  if (!page) {
    throw new Error("The source Journal entry must be projected.");
  }
  return renderToStaticMarkup(
    <PortableText
      components={portableTextComponents}
      value={page.contentObject}
    />
  );
}

describe("Portable Text public destinations through GROQ", () => {
  test.each([
    { type: "homePage", href: "/" },
    { type: "contactPage", href: "/contacts" },
    { type: "aboutPage", href: "/about" },
    { type: "servicesIndexPage", href: "/services" },
    { type: "projectsIndexPage", href: "/projects" },
    { type: "journalIndexPage", href: "/journal" },
  ])("links to canonical $type without a slug", async ({ type, href }) => {
    expect(await renderInternalLink({ _type: type }, type)).toContain(
      `href="${href}"`
    );
  });

  test.each([
    { type: "project", href: "/projects/soil%20%26%20water" },
    { type: "service", href: "/services/soil%20%26%20water" },
    { type: "journal", href: "/journal/soil%20%26%20water" },
  ])("encodes $type detail destinations", async ({ type, href }) => {
    const html = await renderInternalLink({
      _type: type,
      slug: { current: "soil & water" },
      mainImage: MAIN_IMAGE,
    });
    expect(html).toContain(`href="${href}"`);
  });

  test.each(["researchIndexPage", "page", "research", "press"])(
    "keeps %s references as text until a public route exists",
    async (type) => {
      const html = await renderInternalLink({
        _type: type,
        slug: { current: "example" },
      });
      expect(html).toContain("Page link");
      expect(html).not.toContain("href=");
    }
  );

  test.each(["project", "journal"])(
    "keeps an image-less or dangling-image %s destination as text",
    async (type) => {
      const results = await Promise.all(
        [null, { asset: { _type: "reference", _ref: "missing-image" } }].map(
          (mainImage) =>
            renderInternalLink({
              _type: type,
              slug: { current: "example" },
              mainImage,
            })
        )
      );
      for (const html of results) {
        expect(html).toContain("Page link");
        expect(html).not.toContain("href=");
      }
    }
  );

  test("links to a Service without requiring an image", async () => {
    expect(
      await renderInternalLink({
        _type: "service",
        slug: { current: "restoration" },
      })
    ).toContain('href="/services/restoration"');
  });

  test("keeps overview-only projects and missing targets as text", async () => {
    const overview = await renderInternalLink({
      _type: "project",
      slug: { current: "overview" },
      publicationScope: "overview",
      mainImage: MAIN_IMAGE,
    });
    expect(overview).toContain("Page link");
    expect(overview).not.toContain("href=");
    const missing = await renderInternalLink(null);
    expect(missing).toContain("Page link");
    expect(missing).not.toContain("href=");
  });

  test("rejects noncanonical singleton copies and blank slugs", async () => {
    expect(
      await renderInternalLink({ _type: "contactPage" }, "copy-of-contact")
    ).not.toContain("href=");
    expect(
      await renderInternalLink({ _type: "service", slug: { current: "  " } })
    ).not.toContain("href=");
  });
});
