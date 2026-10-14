import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { ProjectJsonLd } = await import("./project-json-ld");

const JSON_LD_SCRIPT = /<script[^>]*>([\s\S]*?)<\/script>/;

test("a project case study describes a CreativeWork at its canonical URL", () => {
  const markup = renderToStaticMarkup(
    <ProjectJsonLd
      project={{
        name: "Urban forest",
        shortDescription: "Restoring a former gasworks",
        location: "Milan, Italy",
        seo: null,
      }}
      slug="urban-forest"
    />
  );
  const json = markup.match(JSON_LD_SCRIPT)?.[1];
  expect(JSON.parse(json || "null")).toEqual({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Urban forest",
    description: "Restoring a former gasworks",
    url: "https://terrapreta.it/projects/urban-forest",
    contentLocation: { "@type": "Place", name: "Milan, Italy" },
  });
});
