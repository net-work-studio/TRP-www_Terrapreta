import type { Metadata } from "next";
import "./globals.css";
import PlausibleProvider from "next-plausible";
import type { ScriptHTMLAttributes } from "react";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_DEFAULTS } from "@/lib/constants";

interface LegacyPlausibleScriptProps
  extends ScriptHTMLAttributes<HTMLScriptElement> {
  "data-domain": string;
  "data-api": string;
}

// The self-hosted legacy tracker still reads attributes instead of init options.
const LEGACY_PLAUSIBLE_SCRIPT_PROPS: LegacyPlausibleScriptProps = {
  "data-domain": SITE_DEFAULTS.analyticsDomain,
  "data-api": "/api/event",
};

import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";

export const metadata: Metadata = generateMetadataHelper({
  title: "Terrapreta — Soil-based Solutions",
  description:
    "Regenerating ecosystems from the soil up. Growing equitable places for nature, people and climate.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { baseUrl } = SITE_DEFAULTS;

  return (
    <html
      className="dark scroll-smooth bg-stone-950"
      data-scroll-behavior="smooth"
      lang="en"
    >
      <head>
        <meta content="Terrapreta" name="apple-mobile-web-app-title" />
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/ABCMarfa-Light.woff2"
          rel="preload"
          type="font/woff2"
        />
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/ABCMarfa-Bold.woff2"
          rel="preload"
          type="font/woff2"
        />
      </head>
      <body className="flex h-screen flex-col justify-between bg-stone-950 font-light font-sans text-stone-50 antialiased">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Terrapreta",
            url: baseUrl,
            logo: `${baseUrl}/terrapreta-logo.png`,
            description:
              "Regenerating ecosystems from the soil up. Growing equitable places for nature, people and climate.",
            sameAs: [
              "https://www.linkedin.com/company/terrapreta-it/",
              "https://www.instagram.com/terrapreta_it/",
            ],
            knowsAbout: [
              "soil regeneration",
              "ecosystem restoration",
              "nature-based solutions",
              "sustainable development",
              "brownfield restoration",
              "soil health",
            ],
            areaServed: "Europe",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Via Valparaiso 11",
              addressLocality: "Milano",
              addressRegion: "MI",
              postalCode: "20144",
              addressCountry: "IT",
            },
            contactPoint: {
              "@type": "ContactPoint",
              email: SITE_DEFAULTS.email,
              contactType: "Customer Service",
            },
          }}
        />
        <PlausibleProvider scriptProps={LEGACY_PLAUSIBLE_SCRIPT_PROPS}>
          {children}
        </PlausibleProvider>
      </body>
    </html>
  );
}
