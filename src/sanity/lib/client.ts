import { createClient } from "next-sanity";
import { WEBSITE_PAGE_HEADING_DEFAULTS } from "@/lib/website-pages";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: "/admin",
    filter: (props) => {
      const { sourceDocument, sourcePath } = props;
      // These SEO titles also supply visible page headings in preview.
      return (
        (Object.hasOwn(WEBSITE_PAGE_HEADING_DEFAULTS, sourceDocument._type) &&
          sourcePath.length === 2 &&
          sourcePath[0] === "seo" &&
          sourcePath[1] === "metaTitle") ||
        props.filterDefault(props)
      );
    },
  },
});
