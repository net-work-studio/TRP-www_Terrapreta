import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  ArrowRightLeft,
  Building,
  FileStack,
  Flag,
  GraduationCap,
  Hammer,
  HeartHandshake,
  Mailbox,
  Newspaper,
  Route,
  Search,
  Settings2,
  Tags,
  User,
  WholeWord,
} from "lucide-react";
import { structureTool } from "sanity/structure";
import { group } from "./lib/builders";

export const structure = structureTool({
  structure: (S, context) =>
    S.list()
      .title("Content")
      .items([
        group(S, "Website pages", [
          S.listItem().singleton("homePage"),
          S.listItem().singleton("aboutPage"),
          S.listItem().singleton("servicesIndexPage"),
          S.listItem().singleton("contactPage"),
          S.listItem().singleton("projectsIndexPage"),
          S.listItem().singleton("journalIndexPage"),
        ])
          .id("website-pages")
          .icon(FileStack),
        orderableDocumentListDeskItem({
          type: "project",
          title: "Projects",
          icon: Hammer,
          S,
          context,
        }),
        group(S, "Services", [
          orderableDocumentListDeskItem({
            type: "service",
            title: "Service entries",
            icon: HeartHandshake,
            S,
            context,
          }),
          S.documentTypeListItem("capability")
            .title("Capabilities")
            .icon(GraduationCap),
        ])
          .id("services")
          .icon(HeartHandshake),
        group(S, "Journal", [
          S.documentTypeListItem("journal")
            .title("Journal entries")
            .icon(Newspaper),
          S.documentTypeListItem("tag").title("Tags").icon(Tags),
        ])
          .id("journal")
          .icon(Newspaper),
        group(S, "People & organizations", [
          S.documentTypeListItem("person").title("People").icon(User),
          S.documentTypeListItem("organization")
            .title("Organizations")
            .icon(Building),
          S.documentTypeListItem("customer").title("Customers").icon(User),
        ])
          .id("people-organizations")
          .icon(User),
        group(S, "Project classifications", [
          S.documentTypeListItem("unGoal").title("UN Goals").icon(Flag),
        ])
          .id("project-classifications")
          .icon(Flag),
        S.documentTypeListItem("glossary").title("Glossary").icon(WholeWord),
        group(S, "Website settings", [
          S.listItem().singleton("site").icon(Settings2),
          S.documentTypeListItem("redirect")
            .title("Redirects")
            .icon(ArrowRightLeft),
        ])
          .id("website-settings")
          .icon(Settings2),
        group(S, "Inactive content", [
          S.documentTypeListItem("page").title("Generic Pages").icon(FileStack),
          S.listItem().singleton("researchIndexPage"),
          S.documentTypeListItem("research")
            .title("Research entries")
            .icon(Search),
          S.documentTypeListItem("press").title("Press").icon(Mailbox),
          S.documentTypeListItem("process").title("Processes").icon(Route),
        ])
          .id("inactive-content")
          .icon(FileStack),
      ]),
});
