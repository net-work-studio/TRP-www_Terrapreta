import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
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
  Route,
  Settings2,
  User,
  WholeWord,
} from "lucide-react";
import { structureTool } from "sanity/structure";
import { WEBSITE_PAGES } from "@/lib/website-pages";
import { group } from "./lib/builders";

export const structure = structureTool({
  structure: (S, context) =>
    S.list()
      .title("Content")
      .items([
        S.listItem().singleton("site").icon(Settings2),
        group(
          S,
          "Website pages",
          Object.keys(WEBSITE_PAGES).map((id) => S.listItem().singleton(id))
        ).icon(FileStack),
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
          S.documentTypeListItem("person").title("People").icon(User),
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
