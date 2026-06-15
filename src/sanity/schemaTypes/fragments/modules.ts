import { defineField } from "sanity";

export default defineField({
  name: "modules",
  description: "Page content",
  type: "array",
  of: [
    /*  { type: "accordion-list" },
    { type: "blog-frontpage" },
    { type: "blog-list" },
    { type: "blog-post-content" },
    { type: "breadcrumbs" },
    { type: "callout" },
    { type: "card-list" },
    { type: "creative-module" },
    { type: "custom-html" },
    { type: "flag-list" },
    { type: "hero" },
    { type: "hero.saas" }, */
    { type: "heroSplitModule" },
    /*  { type: "logo-list" },
    { type: "person-list" },
    { type: "pricing-list" },
    { type: "richtext-module" },
    { type: "schedule-module" },
    { type: "search-module" },
    { type: "stat-list" },
    { type: "step-list" },
    { type: "tabbed-content" },
    { type: "testimonial-list" },
    { type: "testimonial.featured" }, */
  ],
  options: {
    insertMenu: {
      views: [
        {
          name: "grid",
          previewImageUrl: (schemaType) =>
            `/admin/thumbnails/${schemaType}.webp`,
        },
        { name: "list" },
      ],
      groups: [
        { name: "hero", of: ["heroSplitModule"] },
      ],
    },
  },
});
