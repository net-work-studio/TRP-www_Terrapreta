import { at, defineMigration, setIfMissing } from "sanity/migrate";

type LegacyGridDimension = {
  isBig?: boolean;
  prominence?: "featured" | "standard";
};

export default defineMigration({
  title: "Backfill grid prominence",
  documentTypes: ["journal", "project"],
  filter: "!defined(gridDimension.prominence)",
  migrate: {
    document(document) {
      const gridDimension = document.gridDimension as
        | LegacyGridDimension
        | undefined;
      const prominence = gridDimension?.isBig ? "featured" : "standard";

      return [
        at(
          "gridDimension",
          setIfMissing({
            _type: "gridDimensionObject",
            prominence,
          }),
        ),
        at("gridDimension.prominence", setIfMissing(prominence)),
      ];
    },
  },
});
