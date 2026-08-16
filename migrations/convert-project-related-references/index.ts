import { at, defineMigration, set } from "sanity/migrate";

type Reference = {
  _ref: string;
  _type?: string;
  _weak?: boolean;
};

function isReference(value: unknown): value is Reference {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "_ref" in value &&
    typeof value._ref === "string"
  );
}

export function toReferenceArray(value: unknown): unknown {
  if (Array.isArray(value) || !isReference(value)) {
    return value;
  }

  return [
    {
      ...value,
      _key: crypto.randomUUID().replaceAll("-", ""),
      _type: "reference",
    },
  ];
}

export default defineMigration({
  title: "Convert project relationships to arrays",
  documentTypes: ["project"],
  filter: "defined(relatedService._ref) || defined(relatedResearch._ref)",
  migrate: {
    document(document) {
      const relatedService = toReferenceArray(document.relatedService);
      const relatedResearch = toReferenceArray(document.relatedResearch);
      const patches = [];

      if (relatedService !== document.relatedService) {
        patches.push(at("relatedService", set(relatedService)));
      }

      if (relatedResearch !== document.relatedResearch) {
        patches.push(at("relatedResearch", set(relatedResearch)));
      }

      return patches.length > 0 ? patches : undefined;
    },
  },
});
