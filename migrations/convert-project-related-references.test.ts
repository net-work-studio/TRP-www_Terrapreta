import { describe, expect, test } from "bun:test";
import migration, {
  toReferenceArray,
} from "./convert-project-related-references";

describe("toReferenceArray", () => {
  test("converts scalar references to keyed array members", () => {
    const references = toReferenceArray({
      _ref: "service-1",
      _type: "reference",
      _weak: true,
    });

    expect(references).toEqual([
      {
        _key: expect.stringMatching(/^[a-f0-9]{32}$/),
        _ref: "service-1",
        _type: "reference",
        _weak: true,
      },
    ]);
  });

  test("leaves existing relationship arrays unchanged", () => {
    const references = [
      { _key: "existing-key", _ref: "research-1", _type: "reference" },
    ];

    expect(toReferenceArray(references)).toBe(references);
  });

  test("retains both relationship links when migrating a project", () => {
    const patches = migration.migrate.document?.(
      {
        _id: "project-1",
        _type: "project",
        relatedResearch: { _ref: "research-1", _type: "reference" },
        relatedService: { _ref: "service-1", _type: "reference" },
      } as never,
    );

    expect(patches).toMatchObject([
      {
        op: {
          type: "set",
          value: [
            {
              _key: expect.stringMatching(/^[a-f0-9]{32}$/),
              _ref: "service-1",
              _type: "reference",
            },
          ],
        },
        path: ["relatedService"],
      },
      {
        op: {
          type: "set",
          value: [
            {
              _key: expect.stringMatching(/^[a-f0-9]{32}$/),
              _ref: "research-1",
              _type: "reference",
            },
          ],
        },
        path: ["relatedResearch"],
      },
    ]);
  });
});
