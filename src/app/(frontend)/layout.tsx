import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Toaster } from "@/components/ui/sonner";
import {
  getDynamicFetchOptions,
  SanityLive,
} from "@/sanity/lib/live";

async function DynamicFooter() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <Footer perspective={perspective} stega={stega} />;
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <Header />
      <main className="mb-auto">{children}</main>
      {isDraftMode ? (
        <Suspense fallback={<Footer perspective="published" stega={false} />}>
          <DynamicFooter />
        </Suspense>
      ) : (
        <Footer perspective="published" stega={false} />
      )}
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
