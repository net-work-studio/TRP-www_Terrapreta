import { describe, expect, test } from "bun:test";
import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { renderToStaticMarkup } from "react-dom/server";
import { BreadcrumbJsonLd } from "./breadcrumb-json-ld";
import { JsonLd } from "./json-ld";

const JSON_LD_SCRIPT =
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

describe("JSON-LD server HTML", () => {
  test.each(["BlogPosting", "Project"])(
    "renders %s alongside Organization and BreadcrumbList without hydration",
    (schemaType) => {
      const markup = renderToStaticMarkup(
        <>
          <JsonLd data={{ "@type": "Organization", name: "Terrapreta" }} />
          <JsonLd data={{ "@type": schemaType, name: "Restoring soil" }} />
          <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }]} />
        </>
      );

      const schemas = Array.from(markup.matchAll(JSON_LD_SCRIPT), (match) =>
        JSON.parse(match[1])
      );

      expect(schemas.map((schema) => schema["@type"])).toEqual([
        "Organization",
        schemaType,
        "BreadcrumbList",
      ]);
    }
  );

  test("keeps CMS markup inside JSON-LD and preserves its JSON values", () => {
    const data = {
      "@type": "BlogPosting",
      headline: '</script><script>alert("CMS")</script>',
      author: { name: "Soil < water & air" },
      description: "<!-- <img src=x onerror=alert(1)> </ScRiPt>",
    };
    const markup = renderToStaticMarkup(<JsonLd data={data} />);
    const scripts = Array.from(markup.matchAll(JSON_LD_SCRIPT));

    expect(scripts).toHaveLength(1);
    expect(scripts[0][1]).not.toContain("<");
    expect(JSON.parse(scripts[0][1])).toEqual(data);
  });

  test("removes Sanity visual editing metadata from CMS strings", () => {
    const data = stegaEncodeSourceMap(
      { headline: "Restoring soil" },
      {
        documents: [{ _id: "journal-entry", _type: "journal" }],
        paths: ["$['name']"],
        mappings: {
          "$['headline']": {
            type: "value",
            source: { type: "documentValue", document: 0, path: 0 },
          },
        },
      },
      { enabled: true, studioUrl: "/admin" }
    );
    expect(data.headline).not.toBe("Restoring soil");

    const markup = renderToStaticMarkup(<JsonLd data={data} />);
    const scripts = Array.from(markup.matchAll(JSON_LD_SCRIPT));

    expect(JSON.parse(scripts[0][1])).toEqual({ headline: "Restoring soil" });
  });
});
