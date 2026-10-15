import SanityImage from "@/components/ui/sanity-image";
import { getSanityImageWidthForHeight } from "@/sanity/lib/image";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { ORGANIZATIONS_QUERY } from "@/sanity/lib/queries";
import type { ORGANIZATIONS_QUERY_RESULT } from "@/sanity/types";

const LOGO_HEIGHT = 48;

function LogosContent({ logos }: { logos: ORGANIZATIONS_QUERY_RESULT | null }) {
  const logoItems =
    logos
      ?.filter(
        (
          logo
        ): logo is ORGANIZATIONS_QUERY_RESULT[number] & {
          name: string;
          logoDark: { asset: { url: string } };
        } =>
          Boolean(
            logo.name &&
              logo.logoDark?.asset?.url &&
              logo.logoDark.asset.url !== null
          )
      )
      .map((logo) => (
        <div className="flex items-center justify-center px-16" key={logo._id}>
          <SanityImage
            alt={logo.name}
            className="h-12 w-auto object-contain"
            height={LOGO_HEIGHT}
            quality={75}
            source={logo.logoDark}
            width={
              getSanityImageWidthForHeight(logo.logoDark, LOGO_HEIGHT) ?? 120
            }
          />
        </div>
      )) || [];

  return (
    <div className="container-site flex w-full flex-col items-center justify-center space-y-20">
      <hgroup className="flex max-w-prose flex-col items-center justify-center gap-1.5 text-center">
        <h2 className="text-3xl">A solid Network of Partners</h2>
        <p className="text-balance text-lg text-stone-400">
          We are proud to work with a network of partners who share our vision
          and commitment to regenerate Soil.
        </p>
      </hgroup>
      <div className="relative w-full">
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-linear-to-r from-stone-900 to-transparent" />
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-linear-to-l from-stone-900 to-transparent" />
        <div className="overflow-hidden">
          <div className="flex w-max animate-logo-ticker motion-reduce:transform-none motion-reduce:animate-none hover:[animation-duration:37.5s]">
            <div className="flex shrink-0">{logoItems}</div>
            <div aria-hidden="true" className="flex shrink-0">
              {logoItems}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function CachedLogos({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data: logos } = await sanityFetch({
    query: ORGANIZATIONS_QUERY,
    perspective,
    stega,
  });

  return <LogosContent logos={logos} />;
}

async function DynamicLogos() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedLogos {...fetchOptions} />;
}

export default function Logos() {
  return renderSanityCacheBoundary({
    draft: <DynamicLogos />,
    fallback: <LogosContent logos={null} />,
    published: <CachedLogos {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
