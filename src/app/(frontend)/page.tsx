import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import {
  EcosystemRestorationJsonLd,
  NatureBasedSolutionsJsonLd,
  SoilHealthJsonLd,
} from "@/components/shared/domain-json-ld";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";
import { getDynamicFetchOptions } from "@/sanity/lib/live";
import Customers from "./_sections/customers";
import HomeHero from "./_sections/home-hero";
import Logos from "./_sections/logos";
import Numbers from "./_sections/numbers";
import PilotProject from "./_sections/pilot-project";
import Services from "./_sections/services";
import SoilRevolution from "./_sections/soil-revolution";

export async function generateMetadata(): Promise<Metadata> {
  const [{ perspective }, { isEnabled: isDraftMode }] = await Promise.all([
    getDynamicFetchOptions(),
    draftMode(),
  ]);
  const siteSettings = await getSiteSettings(perspective);

  return generateMetadataHelper({
    title: siteSettings?.seo?.metaTitle || siteSettings?.name || "Terrapreta",
    description: siteSettings?.seo?.metaDescription || undefined,
    image: siteSettings?.seo?.ogImage ?? undefined,
    url: "/",
    siteSettings,
    canonicalUrl: siteSettings?.seo?.canonicalUrl ?? undefined,
    robotsIndex: siteSettings?.seo?.robotsIndex ?? undefined,
    robotsFollow: siteSettings?.seo?.robotsFollow ?? undefined,
    ogTitle: siteSettings?.seo?.ogTitle ?? undefined,
    ogDescription: siteSettings?.seo?.ogDescription ?? undefined,
    twitterCard: siteSettings?.seo?.twitterCard ?? undefined,
    isDraftMode,
  });
}

interface SectionWrapperProps {
  children: React.ReactNode;
  isFirstItem?: boolean;
}

function SectionWrapper({
  children,
  isFirstItem = false,
}: SectionWrapperProps) {
  return (
    <div
      className={cn(
        isFirstItem ? "pt-10 pb-15 md:pb-30" : "py-15 md:py-30",
        "space-y-30 bg-linear-to-b from-stone-900 to-transparent md:space-y-60"
      )}
    >
      {children}
    </div>
  );
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://terrapreta.it";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Terrapreta",
          url: baseUrl,
          description: "Soil-based solutions for ecosystem regeneration",
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
        id="website-json-ld"
      />
      <SoilHealthJsonLd />
      <EcosystemRestorationJsonLd />
      <NatureBasedSolutionsJsonLd />
      <HomeHero />
      <div className="scroll-mt-16 space-y-0" id="learn-more">
        <SectionWrapper isFirstItem>
          <Numbers />
        </SectionWrapper>
        <SectionWrapper>
          <SoilRevolution />
        </SectionWrapper>
        <SectionWrapper>
          <Services />
        </SectionWrapper>
        {/*       <SectionWrapper>
          <Context />
        </SectionWrapper> */}
        <SectionWrapper>
          <Customers />
        </SectionWrapper>
        <SectionWrapper>
          <PilotProject />
        </SectionWrapper>
        <SectionWrapper>
          <Logos />
          {/* <ContactForm /> */}
          <div className="flex w-full items-center justify-center">
            <Button asChild>
              <Link href="/contacts">Get in contact</Link>
            </Button>
          </div>
        </SectionWrapper>
      </div>
    </>
  );
}
