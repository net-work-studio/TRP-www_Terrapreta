import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getJournalAuthors, JournalByline } from "./journal-authorship";

test("journal credits selected people in editorial order", () => {
  const authors = [
    { _id: "bianca", name: "Bianca Rossi" },
    { _id: "anna", name: "Anna Verdi" },
  ];
  const html = renderToStaticMarkup(<JournalByline authors={authors} />);

  expect(html).toContain("By ");
  expect(html.indexOf("Bianca Rossi")).toBeLessThan(html.indexOf("Anna Verdi"));
  expect(getJournalAuthors(authors)).toEqual([
    { "@type": "Person", name: "Bianca Rossi" },
    { "@type": "Person", name: "Anna Verdi" },
  ]);
});

test("journal entries without individual authors keep Terrapreta attribution", () => {
  expect(renderToStaticMarkup(<JournalByline authors={null} />)).toBe("");
  expect(getJournalAuthors(null)).toEqual([
    { "@type": "Organization", name: "Terrapreta" },
  ]);
  expect(getJournalAuthors([])).toEqual([
    { "@type": "Organization", name: "Terrapreta" },
  ]);
});
