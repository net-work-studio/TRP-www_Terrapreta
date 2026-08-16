import { LexoRank } from "lexorank";
import { at, defineMigration, patch, set } from "sanity/migrate";

type ServiceDocument = {
  _createdAt?: string;
  _id: string;
  name?: string;
  orderRank?: string;
};

type ServiceGroup = {
  documents: ServiceDocument[];
  service: ServiceDocument;
};

export default defineMigration({
  title: "Initialize service order",
  documentTypes: ["service"],
  async *migrate(documents) {
    const servicesById = new Map<string, ServiceDocument[]>();

    for await (const document of documents()) {
      const service = document as ServiceDocument;
      const serviceId = service._id.replace(/^drafts\./, "");
      const serviceDocuments = servicesById.get(serviceId) ?? [];

      serviceDocuments.push(service);
      servicesById.set(serviceId, serviceDocuments);
    }

    const services: ServiceGroup[] = Array.from(servicesById.values()).map(
      (serviceDocuments) => ({
        documents: serviceDocuments,
        service:
          serviceDocuments.find((service) =>
            service._id.startsWith("drafts."),
          ) ?? serviceDocuments[0],
      }),
    );

    services.sort(
      (first, second) =>
        (first.service.name ?? "").localeCompare(second.service.name ?? "") ||
        (first.service._createdAt ?? "").localeCompare(
          second.service._createdAt ?? "",
        ),
    );

    let rank = LexoRank.min();

    for (const service of services) {
      const existingRank = service.documents.find(
        (document) => document.orderRank !== undefined,
      )?.orderRank;
      const orderRank = existingRank ?? rank.genNext().genNext().toString();

      if (existingRank === undefined) {
        rank = LexoRank.parse(orderRank);
      }

      for (const document of service.documents) {
        if (document.orderRank === undefined) {
          yield patch(document._id, at("orderRank", set(orderRank)));
        }
      }
    }
  },
});
