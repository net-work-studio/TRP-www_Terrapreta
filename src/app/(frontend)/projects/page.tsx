import type { Metadata } from "next";
import PageGrid from "@/components/layout/page-grid";
import PageHeader from "@/components/shared/page-header";
import type { StegaAware } from "@/lib/sanity-stega";
import { getWebsitePageMetadata } from "@/lib/website-page-metadata";
import { WEBSITE_PAGE_HEADING_DEFAULTS } from "@/lib/website-pages";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { fetchWebsitePageHeading } from "@/sanity/lib/website-page-heading";
import type { PROJECTS_QUERY_RESULT } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  return getWebsitePageMetadata("projectsIndexPage");
}

function ProjectsContent({
  projects,
  title = WEBSITE_PAGE_HEADING_DEFAULTS.projectsIndexPage,
}: {
  projects: StegaAware<PROJECTS_QUERY_RESULT> | null;
  title?: string;
}) {
  return (
    <>
      <PageHeader position="left" title={title} />
      <PageGrid basePath="projects" items={projects ?? []} />
    </>
  );
}

async function CachedProjectsPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const [{ data: projects }, title] = await Promise.all([
    sanityFetch({ query: PROJECTS_QUERY, perspective, stega }),
    fetchWebsitePageHeading({
      pageId: "projectsIndexPage",
      perspective,
      stega,
    }),
  ]);

  return <ProjectsContent projects={projects} title={title} />;
}

async function DynamicProjectsPage() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedProjectsPage {...fetchOptions} />;
}

export default async function Page() {
  return renderSanityCacheBoundary({
    draft: <DynamicProjectsPage />,
    fallback: <ProjectsContent projects={null} />,
    published: <CachedProjectsPage {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
