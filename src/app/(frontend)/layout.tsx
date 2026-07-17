import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/lib/disable-draft-mode";
import Footer, { FooterFallback } from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner";
import {
  getSanityRequestState,
  isSanityDraftMode,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  SanityLive,
} from "@/sanity/lib/live";

async function DynamicFooter() {
  const { fetchOptions } = await getSanityRequestState();
  return <Footer {...fetchOptions} />;
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = await isSanityDraftMode();
  const footer = await renderSanityCacheBoundary({
    draft: <DynamicFooter />,
    fallback: <FooterFallback />,
    isDraftMode,
    published: <Footer {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });

  return (
    <>
      <Header />
      <main className="mb-auto">{children}</main>
      {footer}
      <Toaster />
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode ? (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      ) : null}
    </>
  );
}
