"use client";

import dynamic from "next/dynamic";

const DisableDraftMode = dynamic(
  () => import("@/lib/disable-draft-mode").then((mod) => mod.DisableDraftMode),
  { ssr: false }
);

const VisualEditing = dynamic(
  () => import("next-sanity/visual-editing").then((mod) => mod.VisualEditing),
  { ssr: false }
);

export function DraftModeTools() {
  return (
    <>
      <DisableDraftMode />
      <VisualEditing />
    </>
  );
}
