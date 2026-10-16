import { describe, expect, test } from "bun:test";
import { PortableText } from "next-sanity";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { portableTextComponents } = await import("./portable-text-components");

function renderInternalLink(type: string, slug: string | null) {
  return renderToStaticMarkup(
    <PortableText
      components={portableTextComponents}
      value={[
        {
          _type: "block",
          _key: "block",
          style: "normal",
          markDefs: [{ _type: "internalLink", _key: "link", type, slug }],
          children: [
            { _type: "span", _key: "text", text: "Page link", marks: ["link"] },
          ],
        },
      ]}
    />
  );
}

describe("Portable Text public destinations", () => {
  test.each([
    { type: "homePage", href: "/" },
    { type: "contactPage", href: "/contacts" },
    { type: "aboutPage", href: "/about" },
    { type: "servicesIndexPage", href: "/services" },
    { type: "projectsIndexPage", href: "/projects" },
    { type: "journalIndexPage", href: "/journal" },
  ])("links to $type without needing a slug", ({ type, href }) => {
    expect(renderInternalLink(type, null)).toContain(`href="${href}"`);
  });

  test.each([
    { type: "project", href: "/projects/example" },
    { type: "service", href: "/services/example" },
    { type: "journal", href: "/journal/example" },
  ])("preserves $type detail links", ({ type, href }) => {
    expect(renderInternalLink(type, "example")).toContain(`href="${href}"`);
  });

  test.each(["researchIndexPage", "page", "research", "press"])(
    "keeps %s references as text until a public route exists",
    (type) => {
      const html = renderInternalLink(type, "example");
      expect(html).toContain("Page link");
      expect(html).not.toContain("href=");
    }
  );

  test("keeps an overview-only project reference without a detail slug as text", () => {
    expect(renderInternalLink("project", null)).not.toContain("href=");
  });
});
