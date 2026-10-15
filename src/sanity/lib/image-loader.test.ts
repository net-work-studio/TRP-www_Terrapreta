import { describe, expect, test } from "bun:test";
import { getImageProps } from "next/image";
import sanityImageLoader from "./image-loader";

const assetUrl =
  "https://cdn.sanity.io/images/example/production/example-3000x2000.webp";

describe("Sanity image loader", () => {
  test("serves the requested width directly from Sanity with default quality", () => {
    expect(sanityImageLoader({ src: assetUrl, width: 640 })).toBe(
      `${assetUrl}?w=640&q=75&auto=format`
    );
  });

  test("preserves editorial crops and replaces existing resize parameters", () => {
    const url = new URL(
      sanityImageLoader({
        src: `${assetUrl}?rect=300,200,2400,1400&w=120&w=240&q=40&auto=other`,
        width: 1280,
        quality: 90,
      })
    );

    expect(url.origin).toBe("https://cdn.sanity.io");
    expect(url.searchParams.get("rect")).toBe("300,200,2400,1400");
    expect(url.searchParams.getAll("w")).toEqual(["1280"]);
    expect(url.searchParams.getAll("q")).toEqual(["90"]);
    expect(url.searchParams.getAll("auto")).toEqual(["format"]);
  });

  test.each([
    { width: 120, height: 48, retinaWidth: "256" },
    { width: 160, height: 144, retinaWidth: "384" },
  ])(
    "generates a sharp DPR 2 source for a $width px logo",
    ({ width, height, retinaWidth }) => {
      const { props } = getImageProps({
        alt: "Organization logo",
        src: assetUrl,
        width,
        height,
        loader: sanityImageLoader,
      });
      const retinaSource = props.srcSet
        ?.split(", ")
        .find((source) => source.endsWith(" 2x"));

      expect(retinaSource).toBe(
        `${assetUrl}?w=${retinaWidth}&q=75&auto=format 2x`
      );
      expect(props.src).toBe(`${assetUrl}?w=${retinaWidth}&q=75&auto=format`);
      expect(props.srcSet).not.toContain("/_next/image");
    }
  );

  test("keeps inline LQIP placeholders alongside responsive fill sources", () => {
    const { props } = getImageProps({
      alt: "Restored soil",
      src: `${assetUrl}?rect=300,200,2400,1400`,
      fill: true,
      sizes: "100vw",
      placeholder: "blur",
      blurDataURL: "data:image/jpeg;base64,example",
      loader: sanityImageLoader,
    });

    expect(props.style?.backgroundImage).toContain(
      "data:image/jpeg;base64,example"
    );
    expect(props.srcSet).not.toContain("/_next/image");
    for (const source of props.srcSet?.split(", ") ?? []) {
      const url = new URL(source.split(" ")[0]);
      expect(url.searchParams.get("rect")).toBe("300,200,2400,1400");
      expect(url.searchParams.getAll("w")).toHaveLength(1);
      expect(url.searchParams.has("h")).toBe(false);
    }
  });

  test.each(["/images/local.png", "https://example.com/image.png"])(
    "leaves non-Sanity sources usable: %s",
    (src) => {
      expect(sanityImageLoader({ src, width: 640 })).toBe(src);
    }
  );
});
