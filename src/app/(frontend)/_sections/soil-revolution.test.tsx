import { expect, test } from "bun:test";
import { getImageProps } from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import sanityImageLoader from "@/sanity/lib/image-loader";
import SoilRevolution from "./soil-revolution";

const DESIGN_IMAGE_PATTERN = /<img\b[^>]*alt="Design"[^>]*>/;
const SRC_PATTERN = /\bsrc="([^"]+)"/;
const SIZES_PATTERN = /\bsizes="([^"]+)"/;

test("the Design image retains enough detail to cover its portrait card at DPR 2", () => {
  const markup = renderToStaticMarkup(<SoilRevolution />);
  const image = markup.match(DESIGN_IMAGE_PATTERN)?.[0];
  const src = image?.match(SRC_PATTERN)?.[1];
  const sizes = image?.match(SIZES_PATTERN)?.[1];

  expect(src).toBeDefined();
  expect(sizes).toBeDefined();
  if (!(src && sizes)) {
    throw new Error("The Design card must render a responsive image");
  }

  const optimizerUrl = new URL(
    src.replaceAll("&amp;", "&"),
    "https://example.com"
  );
  const source = new URL(
    optimizerUrl.searchParams.get("url") ?? optimizerUrl.href
  );
  const crop = source.searchParams.get("rect")?.split(",").map(Number);

  expect(crop).toBeDefined();
  if (!crop) {
    throw new Error("Crop the landscape Design source before resizing it");
  }

  const [left, top, width, height] = crop;
  const cardWidth = (1024 - 2 * 32 - 2 * 20) / 3;
  const cardHeight = cardWidth / (4 / 5);

  expect(width / height).toBeCloseTo(4 / 5);
  expect(left).toBeGreaterThanOrEqual(0);
  expect(top).toBeGreaterThanOrEqual(0);
  expect(left + width).toBeLessThanOrEqual(1200);
  expect(top + height).toBeLessThanOrEqual(857);
  expect(width).toBeGreaterThanOrEqual(cardWidth * 2);
  expect(height).toBeGreaterThanOrEqual(cardHeight * 2);

  const { props } = getImageProps({
    alt: "Design",
    src: source.href,
    fill: true,
    sizes,
    loader: sanityImageLoader,
  });
  const retinaSource = props.srcSet
    ?.split(", ")
    .find((candidate) => candidate.endsWith(" 750w"));

  expect(retinaSource).toBeDefined();
  const derivative = new URL(retinaSource?.split(" ")[0] ?? source.href);
  expect(derivative.searchParams.get("rect")).toBe(
    source.searchParams.get("rect")
  );
  const derivativeWidth = Number(derivative.searchParams.get("w"));
  expect(derivativeWidth).toBeGreaterThanOrEqual(cardWidth * 2);
  expect((derivativeWidth * height) / width).toBeGreaterThanOrEqual(
    cardHeight * 2
  );
});
