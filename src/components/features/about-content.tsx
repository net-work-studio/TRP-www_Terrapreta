import { PortableText } from "next-sanity";
import ArticleContent from "@/components/shared/article-content";
import PageHeader from "@/components/shared/page-header";
import { portableTextComponents } from "@/components/ui/portable-text-components";
import SanityImage from "@/components/ui/sanity-image";
import type { StegaAware } from "@/lib/sanity-stega";
import {
  getSanityImageWidthForHeight,
  hasSanityImage,
} from "@/sanity/lib/image";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

export function AboutContent({
  page,
}: {
  page: StegaAware<NonNullable<ABOUT_PAGE_QUERY_RESULT>>;
}) {
  const team = page.team?.filter((person) => person?.name);
  const collaborators = page.collaborators?.filter(Boolean);
  return (
    <>
      <PageHeader position="left" title={page.name || "About"} />
      <div className="container-site flex flex-col gap-20 pb-20">
        {page.introduction?.length ? (
          <ArticleContent className="mx-0">
            <PortableText
              components={portableTextComponents}
              value={page.introduction}
            />
          </ArticleContent>
        ) : null}
        {team?.length ? (
          <section
            aria-labelledby="team-heading"
            className="flex flex-col gap-8"
          >
            <h2 className="text-3xl tracking-tight" id="team-heading">
              Team
            </h2>
            <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((person) => (
                <li className="flex flex-col gap-4" key={person._id}>
                  {hasSanityImage(person.portrait) ? (
                    <SanityImage
                      alt={
                        person.portrait?.altContent ||
                        `Portrait of ${person.name}`
                      }
                      className="h-auto w-full"
                      height={900}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      source={person.portrait}
                      width={
                        getSanityImageWidthForHeight(person.portrait, 900) ??
                        675
                      }
                    />
                  ) : null}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl">{person.name}</h3>
                    {person.role ? (
                      <p className="text-muted-foreground">{person.role}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {collaborators?.length ? (
          <section
            aria-labelledby="collaborators-heading"
            className="flex flex-col gap-8"
          >
            <h2 className="text-3xl tracking-tight" id="collaborators-heading">
              Collaborators
            </h2>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-3 text-lg sm:grid-cols-2 lg:grid-cols-3">
              {collaborators.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
