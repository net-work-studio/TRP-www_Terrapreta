"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";
import Mark from "@/components/brand/mark";
import { resolve } from "@/sanity/presentation/resolve";
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { singletons } from "./src/sanity/singletons";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  logo: Mark,
  name: "Terrapreta",
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  document: {
    singletons,
    actions: (actions, context) =>
      context.singleton
        ? actions.filter((action) => action.action !== "delete")
        : actions,
  },
  plugins: [
    structure,
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
});
