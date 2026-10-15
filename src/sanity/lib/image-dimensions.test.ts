import { describe, expect, test } from "bun:test";
import { createImageUrlBuilder } from "@sanity/image-url";
import { getImageProps } from "next/image";
import sanityImageLoader from "./image-loader";
import { getSanityImageWidthForHeight } from "./image-source";

const source = {
  asset: {
    _id: "image-example-1200x240-webp",
    url: "https://cdn.sanity.io/images/example/production/example-1200x240.webp",
    metadata: { dimensions: { width: 1200, height: 240, aspectRatio: 5 } },
  },
};

const imageBuilder = createImageUrlBuilder({
  projectId: "example",
  dataset: "production",
});

describe("intrinsic logo image widths", () => {
  test.each([
    { crop: undefined, renderedWidth: 240 },
    {
      crop: {
        _type: "sanity.imageCrop" as const,
        left: 0,
        right: 0,
        top: 0.25,
        bottom: 0.25,
      },
      renderedWidth: 480,
    },
    {
      crop: {
        _type: "sanity.imageCrop" as const,
        left: 0.25,
        right: 0.25,
        top: 0,
        bottom: 0,
      },
      renderedWidth: 120,
    },
  ])(
    "provides enough DPR 2 pixels for a $renderedWidth px logo",
    ({ crop, renderedWidth }) => {
      const image = { ...source, crop };
      const width = getSanityImageWidthForHeight(image, 48);
      expect(width).toBe(renderedWidth);

      const { props } = getImageProps({
        alt: "Wide partner logo",
        src: imageBuilder.image(image).url(),
        width,
        height: 48,
        loader: sanityImageLoader,
      });
      const retinaSource = props.srcSet
        ?.split(", ")
        .find((candidate) => candidate.endsWith(" 2x"));
      expect(retinaSource).toBeDefined();
      const retinaWidth = Number(
        new URL(
          retinaSource?.split(" ")[0] ?? source.asset.url
        ).searchParams.get("w")
      );
      expect(retinaWidth).toBeGreaterThanOrEqual(renderedWidth * 2);
    }
  );

  test("matches integer source-pixel crops before rounding the displayed width up", () => {
    const image = {
      asset: { metadata: { dimensions: { width: 101, height: 20 } } },
      crop: {
        _type: "sanity.imageCrop" as const,
        left: 0.03,
        right: 0.04,
        top: 0,
        bottom: 0,
      },
    };
    expect(getSanityImageWidthForHeight(image, 48)).toBe(226);
  });

  test("leaves the caller's fallback available for missing or unusable dimensions", () => {
    expect(getSanityImageWidthForHeight(null, 48)).toBeUndefined();
    expect(getSanityImageWidthForHeight({ asset: {} }, 48)).toBeUndefined();
    expect(
      getSanityImageWidthForHeight(
        { asset: { metadata: { dimensions: { width: 0, height: 240 } } } },
        48
      )
    ).toBeUndefined();
    expect(
      getSanityImageWidthForHeight(
        {
          ...source,
          crop: {
            _type: "sanity.imageCrop" as const,
            left: 0,
            right: 0,
            top: 0.5,
            bottom: 0.5,
          },
        },
        48
      )
    ).toBeUndefined();
  });
});
