import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import PlausibleProvider from "next-plausible";
import { JsonLd } from "@/components/shared/json-ld";

const sans = localFont({
  variable: "--font-sans",
  src: [
    {
      path: "../../public/fonts/ABCMarfa-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCMarfa-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/ABCMarfa-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ABCMarfa-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://terrapreta.it";

  return (
    <html
      className="dark scroll-smooth bg-stone-950"
      data-scroll-behavior="smooth"
      lang="en"
    >
      <head>
        <meta content="Terrapreta" name="apple-mobile-web-app-title" />
      </head>
      <body
        className={`${sans.variable} flex h-screen flex-col justify-between bg-stone-950 font-sans font-settings text-stone-50 antialiased`}
      >
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
              email: "mail@terrapreta.it",
              contactType: "Customer Service",
            },
          }}
        />
        <PlausibleProvider>{children}</PlausibleProvider>
      </body>
    </html>
  );
}
