import { describe, expect, test } from "bun:test";
import type { SanityDocument } from "@sanity/types";
import { LexoRank } from "lexorank";
import projectMigration from "./initialize-project-order";
import serviceMigration from "./initialize-service-order";

type OrderedDocument = {
  _createdAt?: string;
  _id: string;
  _type: "project" | "service";
  name?: string;
  orderRank?: string;
  year?: number;
};

async function collectMutations(
  migration: typeof projectMigration | typeof serviceMigration,
  documents: OrderedDocument[],
) {
  async function* getDocuments() {
    for (const document of documents) {
      yield document as SanityDocument;
    }
  }

  const mutations = [];

  for await (const mutation of migration.migrate(getDocuments)) {
    mutations.push(mutation);
  }

  return mutations;
}

describe("order initialization migrations", () => {
  test("preserves a project's existing rank while ranking its draft", async () => {
    const mutations = await collectMutations(projectMigration, [
      {
        _id: "project-1",
        _type: "project",
        orderRank: "0|hzzzzz:",
        year: 2024,
      },
      { _id: "drafts.project-1", _type: "project", year: 2024 },
    ]);

    expect(mutations).toEqual([
      {
        id: "drafts.project-1",
        patches: [
          {
            op: { type: "set", value: "0|hzzzzz:" },
            path: ["orderRank"],
          },
        ],
        type: "patch",
      },
    ]);
  });

  test("preserves a service draft's existing rank while ranking its publication", async () => {
    const mutations = await collectMutations(serviceMigration, [
      { _id: "service-1", _type: "service", name: "Consulting" },
      {
        _id: "drafts.service-1",
        _type: "service",
        name: "Consulting",
        orderRank: "0|hzzzzz:",
      },
    ]);

    expect(mutations).toEqual([
      {
        id: "service-1",
        patches: [
          {
            op: { type: "set", value: "0|hzzzzz:" },
            path: ["orderRank"],
          },
        ],
        type: "patch",
      },
    ]);
  });

  test("reconciles conflicting service variant ranks to a canonical rank", async () => {
    const mutations = await collectMutations(serviceMigration, [
      {
        _id: "drafts.service-1",
        _type: "service",
        name: "Consulting",
        orderRank: "0|i00000:",
      },
      {
        _id: "service-1",
        _type: "service",
        name: "Consulting",
        orderRank: "0|hzzzzz:",
      },
    ]);

    expect(mutations).toEqual([
      {
        id: "drafts.service-1",
        patches: [
          {
            op: { type: "set", value: "0|hzzzzz:" },
            path: ["orderRank"],
          },
        ],
        type: "patch",
      },
    ]);
  });

  test("inserts unranked services between neighboring canonical ranks", async () => {
    const firstRank = LexoRank.parse("0|hzzzzz:");
    const lastRank = firstRank.genNext().genNext().genNext().genNext();
    const mutations = await collectMutations(serviceMigration, [
      {
        _id: "service-alpha",
        _type: "service",
        name: "Alpha",
        orderRank: firstRank.toString(),
      },
      { _id: "service-beta", _type: "service", name: "Beta" },
      {
        _id: "drafts.service-beta",
        _type: "service",
        name: "Beta",
      },
      {
        _id: "service-charlie",
        _type: "service",
        name: "Charlie",
        orderRank: lastRank.toString(),
      },
    ]);

    const expectedRank = firstRank.between(lastRank).toString();

    expect(mutations).toEqual([
      {
        id: "service-beta",
        patches: [
          { op: { type: "set", value: expectedRank }, path: ["orderRank"] },
        ],
        type: "patch",
      },
      {
        id: "drafts.service-beta",
        patches: [
          { op: { type: "set", value: expectedRank }, path: ["orderRank"] },
        ],
        type: "patch",
      },
    ]);
  });
});
