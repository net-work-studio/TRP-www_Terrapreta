import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { HOME_HERO_QUERY } from "@/sanity/lib/queries";
import { HomeHeroContent } from "./home-hero-content";

async function CachedHomeHero({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data } = await sanityFetch({
    query: HOME_HERO_QUERY,
    perspective,
    stega,
  });
  return <HomeHeroContent hero={data?.hero} />;
}

async function DynamicHomeHero() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedHomeHero {...fetchOptions} />;
}

export default function HomeHero() {
  return renderSanityCacheBoundary({
    draft: <DynamicHomeHero />,
    fallback: <HomeHeroContent hero={null} />,
    published: <CachedHomeHero {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
