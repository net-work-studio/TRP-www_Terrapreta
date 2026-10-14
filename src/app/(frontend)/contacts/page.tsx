import type { Metadata } from "next";
import Link from "next/link";
import CalendarStefano from "@/components/features/calendar-stefano";
import PageHeader from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { SITE_DEFAULTS } from "@/lib/constants";
import { getWebsitePageMetadata } from "@/lib/website-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getWebsitePageMetadata("contactPage");
}

export default function ContactsPage() {
  return (
    <>
      <PageHeader position="left" title="Contact Us" />

      <section className="container-site grid w-full grid-cols-1 items-start justify-start gap-10 py-20 lg:grid-cols-[60%_40%]">
        <CalendarStefano />
        <div className="flex flex-col items-start justify-center gap-10">
          <h2 className="font-bold text-2xl">Write us an email</h2>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href={`mailto:${SITE_DEFAULTS.email}`}
          >
            {SITE_DEFAULTS.email}
          </Link>
        </div>
      </section>
    </>
  );
}
