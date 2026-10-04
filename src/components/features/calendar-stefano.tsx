"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function CalendarPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center bg-muted/20 text-muted-foreground">
      <p role="status">Loading booking calendar...</p>
    </div>
  );
}

const CalendarEmbed = dynamic(() => import("./calendar-stefano-embed"), {
  ssr: false,
  loading: CalendarPlaceholder,
});

export default function CalendarStefano() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <h2 className="font-bold text-2xl">Schedule a Discovery Call</h2>
      <div
        className="h-[700px] min-h-[700px] overflow-y-auto"
        ref={containerRef}
      >
        {shouldLoad ? <CalendarEmbed /> : <CalendarPlaceholder />}
      </div>
    </div>
  );
}
