import { defineSingleton } from "sanity";
import { WEBSITE_PAGES } from "@/lib/website-pages";

export const singletons = [
  defineSingleton({
    documentId: "site",
    schemaType: "site",
    title: "Site Settings",
  }),
  ...Object.entries(WEBSITE_PAGES).map(([documentId, page]) =>
    defineSingleton({
      documentId,
      schemaType: documentId,
      title: page.title,
    })
  ),
];
