import type { Metadata } from "next";
import PageGrid from "@/components/layout/page-grid";
import PageHeader from "@/components/shared/page-header";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import type { PROJECTS_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = generateMetadataHelper({
  title: "Projects",
  description: "Explore our latest projects.",
  url: "/projects",
});

function ProjectsContent({
  projects,
}: {
  projects: PROJECTS_QUERY_RESULT | null;
}) {
  return (
    <>
      <PageHeader description="Showing our latest projects" title="Projects" />
      <PageGrid basePath="projects" items={projects ?? []} />
    </>
  );
}

async function CachedProjectsPage({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data: projects } = await sanityFetch({
    query: PROJECTS_QUERY,
    perspective,
    stega,
  });

  return <ProjectsContent projects={projects} />;
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
