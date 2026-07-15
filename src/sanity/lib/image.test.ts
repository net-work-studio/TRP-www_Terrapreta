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

describe("Sanity image compatibility", () => {
  test("exposes the same rendering metadata for wrapped and direct images", () => {
    const wrappedImage = {
      _type: "imageObject",
      altContent: "Restored urban soil",
      image: { _type: "image", asset },
    } as const;
    const directImage = {
      _type: "editorialImage",
      altContent: "Restored urban soil",
      asset,
    } as const;

    for (const image of [wrappedImage, directImage]) {
      expect(hasSanityImage(image)).toBe(true);
      expect(getSanityImageAlt(image)).toBe("Restored urban soil");
      expect(getBlurDataUrl(image)).toBe("data:image/jpeg;base64,example");
    }
  });
});
