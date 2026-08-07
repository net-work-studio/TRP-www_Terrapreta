import {
  ArrowRightLeft,
  Building,
  FileStack,
  Flag,
  GraduationCap,
  Hammer,
  HeartHandshake,
  Link,
  Mailbox,
  Newspaper,
  Rocket,
  Route,
  Settings2,
  User,
  WholeWord,
} from "lucide-react";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { structureTool } from "sanity/structure";
import { group, singleton } from "./lib/builders";

export const structure = structureTool({
  structure: (S, context) =>
    S.list()
      .title("Content")
      .items([
        singleton(S, "site", "Site Settings").icon(Settings2),
        S.divider(),

        S.documentTypeListItem("page").title("All Pages").icon(FileStack),
        S.divider(),
        orderableDocumentListDeskItem({
          type: "project",
          title: "Projects",
          icon: Hammer,
          S,
          context,
        }),
        orderableDocumentListDeskItem({
          type: "service",
          title: "Services",
          icon: HeartHandshake,
          S,
          context,
        }),
        S.divider(),

        group(S, "Company", [
          S.documentTypeListItem("about").title("About").icon(Rocket),
          S.documentTypeListItem("customer").title("Customers").icon(User),
        ]),
        S.divider(),

        group(S, "Media", [
          S.documentTypeListItem("journal")
            .title("Journal posts")
            .icon(Newspaper),
          S.documentTypeListItem("press").title("Press").icon(Mailbox),
        ]),
        S.divider(),

        group(S, "Resources", [
          S.documentTypeListItem("glossary").title("Glossary").icon(WholeWord),
        ]),
        S.divider(),

        group(S, "Miscellaneous", [
          S.documentTypeListItem("capability")
            .title("Capabilities")
            .icon(GraduationCap),
          S.documentTypeListItem("process").title("Processes").icon(Route),

          S.documentTypeListItem("organization")
            .title("Organizations")
            .icon(Building),
          S.documentTypeListItem("unGoal")
            .title("United Nations Goals")
            .icon(Flag),
        ]),
        S.divider(),

        S.documentTypeListItem("navigation").title("Navigations").icon(Link),
        S.documentTypeListItem("redirect")
          .title("Redirects")
          .icon(ArrowRightLeft),
      ]),
});
