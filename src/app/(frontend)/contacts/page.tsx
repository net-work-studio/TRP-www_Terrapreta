import type { Metadata } from "next";
import CalendarStefano from "@/components/features/calendar-stefano";
import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import PageHeader from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";

export const metadata: Metadata = generateMetadataHelper({
  title: "Contacts",
  description: "Get in touch with Terrapreta.",
  url: "/contacts",
});

export default function ContactsPage() {
  return (
    <>
      <PageHeader position="left" title="Contact Us" />

      <section className="container-site grid w-full grid-cols-1 items-start justify-start gap-10 py-20 lg:grid-cols-[60%_40%]">
        <CalendarStefano />
        <div className="flex flex-col items-start justify-center gap-10">
          <h2 className="font-bold text-2xl">Write us an email</h2>
          <ObfuscatedEmail
            className={buttonVariants({ size: "lg", variant: "outline" })}
            display="mail@terrapreta.it"
            domain="terrapreta.it"
            local="mail"
          />
        </div>
      </section>
    </>
  );
}
