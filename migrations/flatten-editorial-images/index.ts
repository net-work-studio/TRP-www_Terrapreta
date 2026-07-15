import { defineMigration, set } from "sanity/migrate";
import { toCanonicalEditorialImage } from "../content-shape";

export default defineMigration({
  title: "Flatten editorial images",
  filter: `
    defined(mainImage.image)
    || defined(image.image)
    || count(contentObject[_type == "imageObject"]) > 0
    || count(content[_type == "imageObject"]) > 0
    || count(pageContent.content[_type == "imageObject"]) > 0
    || count(pageContent[_type == "imageObject"]) > 0
  `,
  migrate: {
    object(value) {
      const canonicalImage = toCanonicalEditorialImage(value);

      return canonicalImage === value ? undefined : set(canonicalImage);
    },
  },
});
