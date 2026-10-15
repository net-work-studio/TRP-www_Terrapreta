import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";

const { ServiceClients } = await import("./service-clients");

const logoDark = {
  _type: "image",
  asset: {
    _id: "image-abc123-200x100-png",
    metadata: null,
    url: "https://cdn.sanity.io/images/example/production/abc123-200x100.png",
  },
  crop: null,
  hotspot: null,
} as const;

const logoMissing = { ...logoDark, asset: null };

describe("ServiceClients", () => {
  test("renders nothing when there are no clients", () => {
    expect(renderToStaticMarkup(<ServiceClients clients={[]} />)).toBe("");
    expect(renderToStaticMarkup(<ServiceClients clients={null} />)).toBe("");
  });

  test("renders nothing when no client has a logo", () => {
    const markup = renderToStaticMarkup(
      <ServiceClients
        clients={[{ _id: "a", logoDark: logoMissing, name: "Acme" }]}
      />
    );

    expect(markup).toBe("");
  });

  test("renders an h2 heading and a wrapping logo row", () => {
    const markup = renderToStaticMarkup(
      <ServiceClients
        clients={[
          { _id: "a", logoDark, name: "Acme" },
          { _id: "b", logoDark: logoMissing, name: "No logo" },
        ]}
      />
    );

    expect(markup).toContain("<h2");
    expect(markup).not.toContain("<h3");
    expect(markup).toContain("flex-wrap");
    expect(markup).toContain('alt="Acme"');
    expect(markup).not.toContain("No logo");
  });
});
