import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { AspectRatio } from "./aspect-ratio";

test("fills the available width so its aspect ratio produces a height", () => {
  const markup = renderToStaticMarkup(
    <AspectRatio ratio={2}>
      <div style={{ position: "absolute" }} />
    </AspectRatio>
  );

  expect(markup).toContain("width:100%");
  expect(markup).toContain("aspect-ratio:2");
});
