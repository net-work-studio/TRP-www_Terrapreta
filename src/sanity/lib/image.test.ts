import { describe, expect, test } from "bun:test";
import {
  getBlurDataUrl,
  getSanityImageAlt,
  hasSanityImage,
} from "./image-source";

const asset = {
  _id: "image-example-3000x2000-webp",
  metadata: { lqip: "data:image/jpeg;base64,example" },
  url: "https://cdn.sanity.io/images/example/production/example.webp",
};

describe("Sanity images", () => {
  test("exposes rendering metadata from a direct image", () => {
    const directImage = {
      _type: "editorialImage",
      altContent: "Restored urban soil",
      asset,
    } as const;

    expect(hasSanityImage(directImage)).toBe(true);
    expect(getSanityImageAlt(directImage)).toBe("Restored urban soil");
    expect(getBlurDataUrl(directImage)).toBe(
      "data:image/jpeg;base64,example"
    );
  });
});
