import type { Metadata } from "next";
import Link from "next/link";
import Mark from "@/components/brand/mark";
import { buttonVariants } from "@/components/ui/button";
import { generateMetadata as generateMetadataHelper } from "@/lib/metadata";

export const metadata: Metadata = generateMetadataHelper({
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  url: "/404",
  robotsIndex: "noindex",
  robotsFollow: "nofollow",
});

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-900 px-4">
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <Link className="h-8" href="/">
          <Mark />
        </Link>

        <div className="space-y-4">
          <h1 className="font-bold text-6xl text-stone-100 md:text-8xl">404</h1>
          <h2 className="text-2xl text-stone-300 md:text-3xl">
            Page Not Found
          </h2>
          <p className="max-w-md text-pretty text-stone-400">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link className={buttonVariants({ size: "lg" })} href="/">
            Go to Homepage
          </Link>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href="/contacts"
          >
            Contact Us
          </Link>
        </div>

        <nav className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-stone-400">
          <Link
            className="transition-colors hover:text-stone-200"
            href="/services"
          >
            Services
          </Link>
          <Link
            className="transition-colors hover:text-stone-200"
            href="/projects"
          >
            Projects
          </Link>
          <Link
            className="transition-colors hover:text-stone-200"
            href="/journal"
          >
            Journal
          </Link>
        </nav>
      </div>
    </div>
  );
}
