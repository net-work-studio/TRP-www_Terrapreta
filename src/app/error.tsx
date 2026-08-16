"use client";

import Link from "next/link";
import Mark from "@/components/brand/mark";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-900 px-4">
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <Link className="h-8" href="/">
          <Mark />
        </Link>

        <div className="space-y-4">
          <h1 className="font-bold text-4xl text-stone-100 md:text-5xl">
            Something went wrong
          </h1>
          <p className="max-w-md text-pretty text-stone-400">
            We encountered an unexpected error. Please try again or contact us
            if the problem persists.
          </p>
          {error.digest && (
            <p className="font-mono text-stone-500 text-xs">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={reset} size="lg">
            Try Again
          </Button>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href="/"
          >
            Go to Homepage
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
          <Link
            className="transition-colors hover:text-stone-200"
            href="/contacts"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </div>
  );
}
