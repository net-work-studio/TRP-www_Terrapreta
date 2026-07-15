import { at, defineMigration, set } from "sanity/migrate";
import { toCanonicalPortableText } from "../content-shape";

export default defineMigration({
  title: "Unwrap project content",
  documentTypes: ["project"],
  filter: `
    pageContent._type == "contentObject"
    && defined(pageContent.content)
  `,
  migrate: {
    document(document) {
      const portableText = toCanonicalPortableText(document.pageContent);

      return portableText === document.pageContent
        ? undefined
        : at("pageContent", set(portableText));
    },
  },
});
