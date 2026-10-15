import { describe, expect, test } from "bun:test";
import {
  createSchema,
  type LocaleSource,
  type SanityDocument,
  usEnglishLocale,
  validateDocument,
} from "sanity";
import type { HeroHeading, HomeHero } from "@/sanity/types";

process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "example";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "production";
const { schema } = await import("../index");

const ASSET_ID =
  "image-eecceff4dc7444ca6289425e2b06dc94610ea58e-2400x1602-webp";
const workspace = {
  schema: createSchema({ name: "hero-validation", types: schema.types }),
  getClient: () => {
    throw new Error("Hero validation tests must not make API calls.");
  },
  i18n: {
    currentLocale: usEnglishLocale,
    locales: [usEnglishLocale],
    loadNamespaces: () => Promise.resolve(),
    t: ((key: string) => key) as LocaleSource["t"],
  },
};

function headingBlock(text: string, key = "heading"): HeroHeading[number] {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: null,
    children: [{ _type: "span", _key: "text", text, marks: [] }],
  };
}

const validHero: HomeHero = {
  _type: "homeHero",
  heading: [headingBlock("Restore nature")],
  description: "Restoring ecosystems together",
  image: {
    _type: "heroImage",
    altContent: "Researchers examining woodland soil",
    asset: { _type: "reference", _ref: ASSET_ID },
  },
  scrollCue: "static",
};

function validateHero(overrides: Record<string, unknown> = {}) {
  const document: SanityDocument = {
    _id: "homePage",
    _type: "homePage",
    _rev: "test",
    _createdAt: "2026-10-15T00:00:00Z",
    _updatedAt: "2026-10-15T00:00:00Z",
    name: "Homepage",
    hero: { ...validHero, ...overrides },
  };

  return validateDocument({
    document,
    workspace,
    getDocumentExists: ({ id }) => Promise.resolve(id === ASSET_ID),
  });
}

describe("Homepage hero publishing validation", () => {
  test("accepts one visible heading paragraph and an image asset", async () => {
    expect(await validateHero()).toEqual([]);
  });

  test("rejects multiple heading paragraphs", async () => {
    const markers = await validateHero({
      heading: [headingBlock("Restore"), headingBlock("nature", "second")],
    });
    expect(markers).toContainEqual(
      expect.objectContaining({
        level: "error",
        path: ["hero", "heading"],
        message: "Keep the hero heading in a single paragraph.",
      })
    );
  });

  test("rejects whitespace-only heading text", async () => {
    const markers = await validateHero({ heading: [headingBlock(" \t ")] });
    expect(markers).toContainEqual(
      expect.objectContaining({
        level: "error",
        path: ["hero", "heading"],
        message: "The hero heading needs visible text.",
      })
    );
  });

  test("rejects an image object without an asset", async () => {
    const markers = await validateHero({
      image: { _type: "heroImage", altContent: validHero.image.altContent },
    });
    expect(markers).toContainEqual(
      expect.objectContaining({
        level: "error",
        path: ["hero", "image"],
        message: "Choose a hero image before publishing.",
      })
    );
  });

  test.each([
    {
      field: "heading",
      message: "Add the main hero heading before publishing.",
    },
    { field: "image", message: "Choose a hero image before publishing." },
  ])("still requires the $field field", async ({ field, message }) => {
    const markers = await validateHero({ [field]: undefined });
    expect(markers).toContainEqual(
      expect.objectContaining({
        level: "error",
        path: ["hero", field],
        message,
      })
    );
  });

  test("keeps a long heading as a publishing warning", async () => {
    const markers = await validateHero({
      heading: [headingBlock("a".repeat(101))],
    });
    expect(markers).toContainEqual(
      expect.objectContaining({
        level: "warning",
        path: ["hero", "heading"],
        message:
          "Aim for a heading under 100 characters so it stays easy to read.",
      })
    );
    expect(markers.some((marker) => marker.level === "error")).toBe(false);
  });
});
