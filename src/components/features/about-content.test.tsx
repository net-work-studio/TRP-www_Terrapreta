import { expect, test } from "bun:test";
import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { AboutContent } = await import("./about-content");

test.each([
  { headingOverride: "Who we are", expected: "Who we are" },
  { headingOverride: null, expected: "About our studio" },
  { headingOverride: "  ", expected: "About our studio" },
])(
  "About displays $expected without an automatic brand suffix",
  ({ headingOverride, expected }) => {
    const html = renderToStaticMarkup(
      <AboutContent
        page={{
          _id: "aboutPage",
          name: "About",
          headingOverride,
          seo: { metaTitle: "About our studio" },
          introduction: [],
          team: null,
          collaborators: null,
        }}
      />
    );
    expect(html).toContain(`>${expected}</h1>`);
    expect(html).not.toContain(" — Terrapreta</h1>");
  }
);

test("About renders its editable introduction without empty people sections", () => {
  const html = renderToStaticMarkup(
    <AboutContent
      page={{
        _id: "aboutPage",
        name: "About",
        headingOverride: null,
        seo: null,
        introduction: [
          {
            _key: "intro",
            _type: "block",
            style: "normal",
            listItem: null,
            level: null,
            markDefs: [],
            children: [
              {
                _key: "text",
                _type: "span",
                text: "Soil is at the centre of our work.",
                marks: [],
              },
            ],
          },
        ],
        team: null,
        collaborators: null,
      }}
    />
  );

  expect(html).toContain(">About</h1>");
  expect(html).toContain("Soil is at the centre of our work.");
  expect(html).not.toContain(">Team</h2>");
  expect(html).not.toContain(">Collaborators</h2>");
});

test.each([
  { emailVisibility: null, email: "private@example.com" },
  { emailVisibility: "hidden", email: "private@example.com" },
  { emailVisibility: "visible", email: "  " },
] as const)(
  "team email stays absent for $emailVisibility visibility and $email",
  ({ emailVisibility, email }) => {
    const html = renderToStaticMarkup(
      <AboutContent
        page={{
          _id: "aboutPage",
          name: "About",
          headingOverride: null,
          seo: null,
          introduction: [],
          collaborators: null,
          team: [
            {
              _id: "person",
              name: "Anna Verdi",
              role: null,
              description: "  ",
              bio: "  ",
              portrait: null,
              email,
              emailVisibility,
            },
          ],
        }}
      />
    );
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("private@example.com");
    expect(html).not.toContain(">  </p>");
  }
);

test("About preserves people order and displays collaborator details only when filled in", () => {
  const html = renderToStaticMarkup(
    <AboutContent
      page={{
        _id: "aboutPage",
        name: "About",
        headingOverride: null,
        seo: null,
        introduction: [],
        team: [
          {
            _id: "bianca",
            name: "Bianca Rossi",
            role: "Ecologist",
            description: "Ecologist working on soil health.",
            bio: "Bianca studies how urban forests recover after industrial use.",
            email: "bianca@example.com",
            emailVisibility: "visible",
            portrait: {
              _type: "editorialImage",
              altContent: "Bianca in the Goccia forest",
              caption: null,
              crop: null,
              hotspot: null,
              asset: {
                _id: "image-example-900x1200-jpg",
                url: "https://cdn.sanity.io/images/example/production/example-900x1200.jpg",
                metadata: null,
              },
            },
          },
          {
            _id: "anna",
            name: "Anna Verdi",
            role: "Landscape architect",
            description: null,
            bio: null,
            email: "anna@example.com",
            emailVisibility: "hidden",
            portrait: null,
          },
        ],
        collaborators: [
          {
            _key: "francesco",
            _type: "companyCollaborator",
            name: "Francesco Castrovilli",
            role: "Landscape designer",
            email: "francesco@example.com",
            bio: "Works on ecological restoration and landscape design.",
          },
          {
            _key: "gabriele",
            _type: "companyCollaborator",
            name: "Gabriele Gagliardi",
            email: "  ",
            bio: "  ",
          },
        ],
      }}
    />
  );

  expect(html).toContain(">Team</h2>");
  expect(html).toContain("Bianca in the Goccia forest");
  expect(html).toContain("Ecologist");
  expect(html).toContain("Ecologist working on soil health.");
  expect(html).toContain(
    "Bianca studies how urban forests recover after industrial use."
  );
  expect(html).toContain('href="mailto:bianca@example.com"');
  expect(html).not.toContain("anna@example.com");
  expect(html.indexOf("Bianca Rossi")).toBeLessThan(html.indexOf("Anna Verdi"));
  expect(html.indexOf("Anna Verdi")).toBeLessThan(
    html.indexOf(">Collaborators</h2>")
  );
  expect(html.indexOf("Francesco Castrovilli")).toBeLessThan(
    html.indexOf("Gabriele Gagliardi")
  );
  expect(html).toContain("Landscape designer");
  expect(html).toContain('href="mailto:francesco@example.com"');
  expect(html).toContain(
    "Works on ecological restoration and landscape design."
  );
  expect(html.match(/href="mailto:/g)).toHaveLength(2);
  expect(html).not.toContain(">  </p>");
  expect(html).not.toContain("undefined");
});

test("About email links display cleaned, trimmed team and collaborator addresses", () => {
  const emails = stegaEncodeSourceMap(
    {
      teamEmail: "  anna@example.com  ",
      collaboratorEmail: "  francesco@example.com  ",
    },
    {
      documents: [{ _id: "aboutPage", _type: "aboutPage" }],
      paths: ["$['teamEmail']", "$['collaboratorEmail']"],
      mappings: {
        "$['teamEmail']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 0 },
        },
        "$['collaboratorEmail']": {
          type: "value",
          source: { type: "documentValue", document: 0, path: 1 },
        },
      },
    },
    { enabled: true, studioUrl: "/admin", filter: () => true }
  );
  expect(emails.teamEmail).not.toBe("  anna@example.com  ");
  expect(emails.collaboratorEmail).not.toBe("  francesco@example.com  ");

  const html = renderToStaticMarkup(
    <AboutContent
      page={{
        _id: "aboutPage",
        name: "About",
        headingOverride: null,
        seo: null,
        introduction: [],
        team: [
          {
            _id: "anna",
            name: "Anna Verdi",
            role: null,
            description: null,
            bio: null,
            portrait: null,
            email: emails.teamEmail,
            emailVisibility: "visible",
          },
        ],
        collaborators: [
          {
            _key: "francesco",
            _type: "companyCollaborator",
            name: "Francesco Castrovilli",
            email: emails.collaboratorEmail,
          },
        ],
      }}
    />
  );

  expect(html).toContain('href="mailto:anna@example.com">anna@example.com</a>');
  expect(html).toContain(
    'href="mailto:francesco@example.com">francesco@example.com</a>'
  );
});
