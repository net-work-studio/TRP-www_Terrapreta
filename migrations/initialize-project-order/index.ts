import { LexoRank } from "lexorank";
import { at, defineMigration, patch, set } from "sanity/migrate";

type ProjectDocument = {
  _createdAt?: string;
  _id: string;
  orderRank?: string;
  year?: number;
};

type ProjectGroup = {
  documents: ProjectDocument[];
  project: ProjectDocument;
};

export default defineMigration({
  title: "Initialize project order",
  documentTypes: ["project"],
  async *migrate(documents) {
    const projectsById = new Map<string, ProjectDocument[]>();

    for await (const document of documents()) {
      const project = document as ProjectDocument;
      const projectId = project._id.replace(/^drafts\./, "");
      const projectDocuments = projectsById.get(projectId) ?? [];

      projectDocuments.push(project);
      projectsById.set(projectId, projectDocuments);
    }

    const projects: ProjectGroup[] = Array.from(projectsById.values()).map(
      (projectDocuments) => ({
        documents: projectDocuments,
        project:
          projectDocuments.find((project) =>
            project._id.startsWith("drafts."),
          ) ?? projectDocuments[0],
      }),
    );

    projects.sort(
      (first, second) =>
        (second.project.year ?? -Infinity) -
          (first.project.year ?? -Infinity) ||
        (second.project._createdAt ?? "").localeCompare(
          first.project._createdAt ?? "",
        ),
    );

    let rank = LexoRank.min();

    for (const project of projects) {
      const existingRank = project.documents.find(
        (document) => document.orderRank !== undefined,
      )?.orderRank;
      const orderRank = existingRank ?? rank.genNext().genNext().toString();

      if (existingRank === undefined) {
        rank = LexoRank.parse(orderRank);
      }

      for (const document of project.documents) {
        if (document.orderRank === undefined) {
          yield patch(document._id, at("orderRank", set(orderRank)));
        }
      }
    }
  },
});
