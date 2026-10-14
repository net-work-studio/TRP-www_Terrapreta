import { describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// SanityImage pulls in the Sanity client, which requires project env vars.
mock.module("@/components/ui/sanity-image", () => ({
  default: ({ alt }: { alt: string }) => <span aria-label={alt} role="img" />,
}));

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
    expect(markup).toContain('aria-label="Acme"');
    expect(markup).not.toContain("No logo");
  });
});
