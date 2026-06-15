import Image from "next/image";
import Link from "next/link";
import Mark from "@/components/brand/mark";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { UN_GOALS_QUERY } from "@/sanity/lib/queries";
import type { UN_GOALS_QUERY_RESULT } from "@/sanity/types";

function FooterShell({ logos = [] }: { logos?: React.ReactNode[] }) {
  return (
    <div className="mt-20 flex w-full justify-center border-stone-800 border-t md:mt-40">
      <footer className="container-site flex flex-col justify-start gap-10 py-20">
        <div className="grid grid-cols-1 gap-5 gap-y-15 md:grid-cols-2 md:gap-y-0 lg:grid-cols-6">
          <div className="col-span-3 flex flex-col gap-5">
            <div className="h-6 w-fit">
              <Mark />
            </div>
            <div className="flex flex-col gap-7.5">
              <p className="max-w-full text-pretty md:max-w-[50ch] md:text-balance">
                Our mission is to regenerate one thousand hectares of land by
                2031 via Soil-based Solutions.
              </p>
              {logos.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">{logos}</div>
              )}
              <Button asChild className="w-fit" variant="outline">
                <Link href="/contacts">Let's talk</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="text-stone-400">Terrapreta</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/brownfield-restoration">
                  Brownfield Restoration
                </Link>
              </li>
              <li>
                <Link href="/services/data-driven-urban-planning">
                  Data-driven Urban Planning
                </Link>
              </li>
              <li>
                <Link href="/services/soil-health-strategies">
                  Soil Health Strategies
                </Link>
              </li>
              <li>
                <Link href="/services/nbs-landscape-design">
                  NbS Landscape Design
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="text-stone-400">Follow us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.linkedin.com/company/terrapreta-it/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/terrapreta_it/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.are.na/terrapreta"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Are.na
                </a>
              </li>
              <li>
                <a
                  href="mailto:mail@terrapreta.it"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-5 opacity-0">
            <h3 className="text-stone-400">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="">Impressum</Link>
              </li>
              <li>
                <Link href="">Privacy Policy</Link>
              </li>
              <li>
                <Link href="">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-stone-800 border-t pt-10 text-xs">
          <p>Terrapreta SRL Società Benefit</p>
          <ul className="space-y-1.5 text-stone-400">
            <li>© Terrapreta SRL SB, Via Valparaiso 11, 20144 Milan, Italy</li>
            <li>VAT Number IT13083330962, REA number MI 2702314</li>
            <li>Contributed capital €10,000.00 fully paid-in</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

// Synchronous fallback for the Suspense boundary in draft mode. A Suspense
// fallback must not itself suspend, so this renders the footer shell without
// the data-driven UN goal logos.
export function FooterFallback() {
  return <FooterShell />;
}

export default async function Footer({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";

  const { data: unGoals } = await sanityFetch({
    query: UN_GOALS_QUERY,
    perspective,
    stega,
  });

  const unGoalLogos =
    unGoals
      ?.filter(
        (
          goal
        ): goal is UN_GOALS_QUERY_RESULT[number] & {
          logoNegative: { asset: { url: string } };
        } =>
          Boolean(
            goal.logoNegative?.asset?.url &&
              goal.logoNegative.asset.url !== null
          )
      )
      .map((goal) => (
        <Image
          alt={goal.name || "UN Goal"}
          blurDataURL={urlFor(goal.logoNegative)
            .quality(5)
            .width(24)
            .height(24)
            .auto("format")
            .url()}
          className="h-18 w-auto object-contain"
          height={144}
          key={goal._id}
          placeholder="blur"
          quality={75}
          sizes="20vw"
          src={urlFor(goal.logoNegative)
            .width(144)
            .height(144)
            .quality(75)
            .auto("format")
            .url()}
          width={160}
        />
      )) || [];

  return <FooterShell logos={unGoalLogos} />;
}
