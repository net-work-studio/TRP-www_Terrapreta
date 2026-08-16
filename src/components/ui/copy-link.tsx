"use client";

import { Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CopyLinkButtonProps = {
  className?: string;
};

export function CopyLink({ className }: CopyLinkButtonProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      className={className}
      onClick={handleCopyLink}
      size="sm"
      type="button"
      variant="outline"
    >
      <Link aria-hidden="true" />
      Copy link
    </Button>
  );
}
