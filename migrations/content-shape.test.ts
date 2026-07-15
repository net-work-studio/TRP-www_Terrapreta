import { describe, expect, test } from "bun:test";
import {
  toCanonicalEditorialImage,
  toCanonicalPortableText,
} from "./content-shape";

describe("toCanonicalEditorialImage", () => {
  test("preserves image content while removing the wrapper", () => {
    const legacyImage = {
      _key: "image-key",
      _type: "imageObject",
      altContent: "Roots growing through restored soil",
      caption: "Pilot site after restoration",
      image: {
        _type: "image",
        asset: {
          _ref: "image-example-3000x2000-webp",
          _type: "reference",
        },
        crop: { bottom: 0.1, left: 0, right: 0, top: 0.05 },
        hotspot: { height: 0.8, width: 0.7, x: 0.5, y: 0.45 },
      },
    };

    expect(toCanonicalEditorialImage(legacyImage)).toEqual({
      _key: "image-key",
      _type: "editorialImage",
      altContent: "Roots growing through restored soil",
      asset: {
        _ref: "image-example-3000x2000-webp",
        _type: "reference",
      },
      caption: "Pilot site after restoration",
      crop: { bottom: 0.1, left: 0, right: 0, top: 0.05 },
      hotspot: { height: 0.8, width: 0.7, x: 0.5, y: 0.45 },
    });
  });

  test("leaves canonical images unchanged", () => {
    const canonicalImage = {
      _type: "editorialImage",
      asset: {
        _ref: "image-example-3000x2000-webp",
        _type: "reference",
      },
    };

    expect(toCanonicalEditorialImage(canonicalImage)).toBe(canonicalImage);
  });

  test("preserves unrecognized image properties", () => {
    const legacyImage = {
      _type: "imageObject",
      attribution: "Terrapreta archive",
      image: {
        _type: "image",
        asset: { _ref: "image-example", _type: "reference" },
        sourceId: "archive-42",
      },
    };

    expect(toCanonicalEditorialImage(legacyImage)).toEqual({
      _type: "editorialImage",
      asset: { _ref: "image-example", _type: "reference" },
      attribution: "Terrapreta archive",
      sourceId: "archive-42",
    });
  });

  test("leaves malformed wrappers unchanged", () => {
    const legacyImage = { _type: "imageObject", caption: "Missing asset" };

    expect(toCanonicalEditorialImage(legacyImage)).toBe(legacyImage);
  });
});

describe("toCanonicalPortableText", () => {
  test("unwraps page content without changing its Portable Text value", () => {
    const portableText = [
      {
        _key: "block-key",
        _type: "block",
        children: [
          {
            _key: "span-key",
            _type: "span",
            marks: ["link-key"],
            text: "Restoring urban soil",
          },
        ],
        markDefs: [
          {
            _key: "link-key",
            _type: "internalLink",
            reference: { _ref: "service-id", _type: "reference" },
          },
        ],
        style: "normal",
      },
    ];
    const legacyContent = {
      _type: "contentObject",
      content: portableText,
    };

    expect(toCanonicalPortableText(legacyContent)).toBe(portableText);
  });

  test("preserves nested project content in either migration order", () => {
    const legacyImage = {
      _key: "image-key",
      _type: "imageObject",
      altContent: "A planted courtyard",
      caption: "Courtyard after planting",
      image: {
        _type: "image",
        asset: {
          _ref: "image-asset-id-1200x800-jpg",
          _type: "reference",
        },
        crop: { bottom: 0.1, left: 0, right: 0, top: 0.05 },
        hotspot: { height: 0.8, width: 0.9, x: 0.5, y: 0.45 },
        metadata: { source: "legacy-import" },
      },
    };
    const block = {
      _key: "block-key",
      _type: "block",
      children: [
        {
          _key: "span-key",
          _type: "span",
          marks: ["internal-link-key"],
          text: "Read the research",
        },
      ],
      markDefs: [
        {
          _key: "internal-link-key",
          _type: "internalLink",
          reference: {
            _ref: "research-document-id",
            _type: "reference",
          },
        },
      ],
      style: "normal",
    };
    const wrappedContent = {
      _type: "contentObject",
      content: [block, legacyImage],
    };

    const flattenThenUnwrap = toCanonicalPortableText({
      ...wrappedContent,
      content: wrappedContent.content.map(toCanonicalEditorialImage),
    });
    const unwrapped = toCanonicalPortableText(wrappedContent);
    const unwrapThenFlatten = Array.isArray(unwrapped)
      ? unwrapped.map(toCanonicalEditorialImage)
      : unwrapped;

    expect(unwrapThenFlatten).toEqual(flattenThenUnwrap);
    expect(unwrapThenFlatten).toEqual([
      block,
      {
        _key: "image-key",
        _type: "editorialImage",
        altContent: "A planted courtyard",
        asset: {
          _ref: "image-asset-id-1200x800-jpg",
          _type: "reference",
        },
        caption: "Courtyard after planting",
        crop: { bottom: 0.1, left: 0, right: 0, top: 0.05 },
        hotspot: { height: 0.8, width: 0.9, x: 0.5, y: 0.45 },
        metadata: { source: "legacy-import" },
      },
    ]);
  });

  test("preserves an empty Portable Text array", () => {
    const portableText: unknown[] = [];

    expect(
      toCanonicalPortableText({
        _type: "contentObject",
        content: portableText,
      })
    ).toBe(portableText);
  });

  test("leaves canonical Portable Text unchanged", () => {
    const portableText = [{ _key: "block-key", _type: "block" }];

    expect(toCanonicalPortableText(portableText)).toBe(portableText);
  });
});
