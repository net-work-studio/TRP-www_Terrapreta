"use client";

import { useVisualEditingEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment();

  if (
    environment === "presentation-iframe" ||
    environment === "presentation-window"
  ) {
    return null;
  }

  return (
    <a
      className="fixed right-4 bottom-4 bg-gray-100 px-4 py-2 text-black hover:bg-gray-200"
      href="/api/draft-mode/disable"
    >
      Disable Draft Mode
    </a>
  );
}
