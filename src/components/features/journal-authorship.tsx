import type { StegaAware } from "@/lib/sanity-stega";
import type { JOURNAL_ITEM_QUERY_RESULT } from "@/sanity/types";

type JournalAuthors = StegaAware<
  NonNullable<JOURNAL_ITEM_QUERY_RESULT>["authors"]
>;

export function getJournalAuthors(authors: JournalAuthors) {
  const people =
    authors?.flatMap((person) =>
      person?.name ? [{ "@type": "Person", name: person.name }] : []
    ) ?? [];
  return people.length
    ? people
    : [{ "@type": "Organization", name: "Terrapreta" }];
}

export function JournalByline({ authors }: { authors: JournalAuthors }) {
  const people = authors?.filter((person) => person?.name);
  if (!people?.length) {
    return null;
  }
  return (
    <p className="text-base text-muted-foreground">
      By{" "}
      {people.map((person, index) => (
        <span key={person._id}>
          {index > 0 ? ", " : ""}
          {person.name}
        </span>
      ))}
    </p>
  );
}
