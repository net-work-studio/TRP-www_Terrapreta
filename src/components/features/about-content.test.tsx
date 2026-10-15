import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { AboutContent } = await import("./about-content");

test("About renders its editable introduction without empty people sections", () => {
  const html = renderToStaticMarkup(
    <AboutContent
      page={{
        _id: "aboutPage",
        name: "About",
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

test("About preserves team and collaborator order and displays optional collaborator roles", () => {
  const html = renderToStaticMarkup(
    <AboutContent
      page={{
        _id: "aboutPage",
        name: "About",
        introduction: [],
        team: [
          {
            _id: "bianca",
            name: "Bianca Rossi",
            role: "Ecologist",
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
            portrait: null,
          },
        ],
        collaborators: [
          {
            _key: "francesco",
            name: "Francesco Castrovilli",
            role: "Landscape designer",
          },
          { _key: "gabriele", name: "Gabriele Gagliardi", role: null },
        ],
      }}
    />
  );

  expect(html).toContain(">Team</h2>");
  expect(html).toContain("Bianca in the Goccia forest");
  expect(html).toContain("Ecologist");
  expect(html.indexOf("Bianca Rossi")).toBeLessThan(html.indexOf("Anna Verdi"));
  expect(html.indexOf("Anna Verdi")).toBeLessThan(
    html.indexOf(">Collaborators</h2>")
  );
  expect(html.indexOf("Francesco Castrovilli")).toBeLessThan(
    html.indexOf("Gabriele Gagliardi")
  );
  expect(html).toContain("Landscape designer");
  expect(html).not.toContain("undefined");
});
