import { PortableText } from "next-sanity";
import type { ComponentProps } from "react";
import ArticleContent from "@/components/shared/article-content";
import PageHeader from "@/components/shared/page-header";
import { PortableImage } from "@/components/ui/portable-image";
import { portableTextComponents } from "@/components/ui/portable-text-components";
import SanityImage from "@/components/ui/sanity-image";
import { cleanOptionalString, type StegaAware } from "@/lib/sanity-stega";
import {
  getSanityImageWidthForHeight,
  hasSanityImage,
} from "@/sanity/lib/image";
import type { ABOUT_PAGE_QUERY_RESULT } from "@/sanity/types";

function AboutIntroductionImage({
  value,
}: ComponentProps<typeof PortableImage>) {
  return <PortableImage layout="contained" value={value} />;
}

const ABOUT_PORTABLE_TEXT_COMPONENTS = {
  ...portableTextComponents,
  types: {
    ...portableTextComponents.types,
    editorialImage: AboutIntroductionImage,
  },
};

export function AboutContent({
  page,
}: {
  page: StegaAware<NonNullable<ABOUT_PAGE_QUERY_RESULT>>;
}) {
  const team = page.team?.filter((person) => person?.name);
  // Published About content can still contain names while its updated draft is being edited.
  const collaborators = page.collaborators
    ?.map((collaborator) =>
      typeof collaborator === "string"
        ? {
            _key: collaborator,
            name: collaborator,
            role: null,
            email: null,
            bio: null,
          }
        : collaborator
    )
    .filter((collaborator) => collaborator?.name);
  return (
    <>
      <PageHeader position="left" title={page.name || "About"} />
      <div className="container-site flex flex-col gap-20 pb-20">
        {page.introduction?.length ? (
          <ArticleContent className="mx-0 max-w-none [&>:not(figure)]:max-w-[52ch]">
            <PortableText
              components={ABOUT_PORTABLE_TEXT_COMPONENTS}
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
            <ul className="grid grid-cols-1 gap-x-5 gap-y-15 md:grid-cols-2 lg:grid-cols-4">
              {team.map((person) => {
                const email =
                  cleanOptionalString(person.emailVisibility) === "visible"
                    ? cleanOptionalString(person.email)?.trim()
                    : undefined;
                return (
                  <li className="flex flex-col gap-4" key={person._id}>
                    {hasSanityImage(person.portrait) ? (
                      <SanityImage
                        alt={
                          person.portrait?.altContent ||
                          `Portrait of ${person.name}`
                        }
                        className="h-auto w-full"
                        height={900}
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
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
                      {cleanOptionalString(person.description)?.trim() ? (
                        <p className="whitespace-pre-line text-base">
                          {person.description}
                        </p>
                      ) : null}
                      {cleanOptionalString(person.bio)?.trim() ? (
                        <p className="whitespace-pre-line text-base text-muted-foreground">
                          {person.bio}
                        </p>
                      ) : null}
                      {email ? (
                        <a
                          className="w-fit break-all text-base underline underline-offset-4"
                          href={`mailto:${email}`}
                        >
                          {email}
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
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
            <ul className="grid grid-cols-1 gap-x-5 gap-y-15 text-lg md:grid-cols-2 lg:grid-cols-4">
              {collaborators.map((collaborator) => {
                const email = cleanOptionalString(collaborator.email)?.trim();
                const bio = cleanOptionalString(collaborator.bio)?.trim();
                return (
                  <li className="flex flex-col gap-1" key={collaborator._key}>
                    <span>{collaborator.name}</span>
                    {collaborator.role ? (
                      <p className="text-base text-muted-foreground">
                        {collaborator.role}
                      </p>
                    ) : null}
                    {bio ? (
                      <p className="whitespace-pre-line text-base text-muted-foreground">
                        {collaborator.bio}
                      </p>
                    ) : null}
                    {email ? (
                      <a
                        className="w-fit break-all text-base underline underline-offset-4"
                        href={`mailto:${email}`}
                      >
                        {email}
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
