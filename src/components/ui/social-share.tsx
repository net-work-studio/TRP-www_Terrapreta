"use client";

import { ExternalLink, Mail, MessageCircle, Share2 } from "lucide-react";
import { CopyLink } from "@/components/ui/copy-link";
import { Button } from "@/components/ui/button";

const SHARE_ACTIONS = [
  {
    label: "LinkedIn",
    icon: ExternalLink,
    getHref: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    getHref: (url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${document.title} ${url}`)}`,
  },
  {
    label: "Email",
    icon: Mail,
    getHref: (url: string) =>
      `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(url)}`,
  },
];

export default function SocialShare() {
  const handleShare = (getHref: (url: string) => string) => {
    window.open(
      getHref(window.location.href),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      aria-labelledby="share-heading"
      className="mx-auto w-full max-w-[52ch] border-t pt-6 text-lg"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <h2 id="share-heading">Share this page</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SHARE_ACTIONS.map(({ label, icon: Icon, getHref }) => (
            <Button
              key={label}
              onClick={() => handleShare(getHref)}
              size="sm"
              type="button"
              variant="outline"
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          ))}
          <CopyLink className="h-8 border bg-background px-3 text-sm hover:bg-accent hover:text-accent-foreground" />
        </div>
      </div>
    </section>
  );
}
